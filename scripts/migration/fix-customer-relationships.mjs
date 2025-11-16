#!/usr/bin/env node

/**
 * Script to fix customer relationship foreign keys
 * Run: node scripts/fix-customer-relationships.mjs
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!(supabaseUrl && supabaseKey)) {
	console.error("❌ Missing Supabase credentials");
	console.error("Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
	process.exit(1);
}

console.log("🔧 Fixing customer relationship foreign keys...\n");

const supabase = createClient(supabaseUrl, supabaseKey, {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
	},
});

const sql = `
-- Fix Foreign Key Relationships: jobs, properties, and estimates should reference customers.id not users.id

-- Step 1: Drop old foreign key constraints
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_customer_id_users_id_fk;
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_customer_id_fkey;

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_customer_id_users_id_fk;
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_customer_id_fkey;

ALTER TABLE estimates DROP CONSTRAINT IF EXISTS estimates_customer_id_users_id_fk;
ALTER TABLE estimates DROP CONSTRAINT IF EXISTS estimates_customer_id_fkey;

-- Step 2: Add correct foreign key constraints
ALTER TABLE properties
  ADD CONSTRAINT properties_customer_id_customers_id_fk
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

ALTER TABLE jobs
  ADD CONSTRAINT jobs_customer_id_customers_id_fk
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

ALTER TABLE estimates
  ADD CONSTRAINT estimates_customer_id_customers_id_fk
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
`;

try {
	console.log("Executing SQL migration...");

	const { error } = await supabase.rpc("exec_sql", { sql_string: sql }).single();

	if (error) {
		// Try alternative method - using REST API directly
		console.log("Trying alternative method...");

		const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				apikey: supabaseKey,
				Authorization: `Bearer ${supabaseKey}`,
			},
			body: JSON.stringify({ sql_string: sql }),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
		}

		console.log("✅ Migration completed successfully!");
	} else {
		console.log("✅ Migration completed successfully!");
	}

	console.log("\n📝 Changes applied:");
	console.log("  • properties.customer_id now references customers.id");
	console.log("  • jobs.customer_id now references customers.id");
	console.log("  • estimates.customer_id now references customers.id");
	console.log("\n🔄 Schema cache refreshed");
	console.log("\n✨ You can now reload your jobs page!");
} catch (err) {
	console.error("❌ Migration failed:", err.message);
	console.error("\n📋 Please run the SQL manually in Supabase Dashboard:");
	console.error("   SQL Editor → Paste contents of fix_customer_relationships.sql → Run");
	process.exit(1);
}

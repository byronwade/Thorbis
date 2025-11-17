#!/usr/bin/env node

/**
 * Apply Owner Permissions Fix Migration
 *
 * This script applies the migration to fix owner permissions in the database.
 * Owners should ALWAYS have full access regardless of team_members status.
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "../../..");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!(supabaseUrl && supabaseServiceKey)) {
	console.error("❌ Error: Missing Supabase credentials");
	console.error(
		"Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local"
	);
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const STATEMENT_SPLIT_REGEX = /;\s*$\n/m;
const SQL_COMMENT_REGEX = /--[^\n]*\n/g;

async function applyMigration() {
	console.log("🚀 Applying Owner Permissions Fix Migration...\n");

	const migrationPath = path.join(
		projectRoot,
		"supabase/migrations/20250213000000_fix_owner_permissions.sql"
	);

	if (!fs.existsSync(migrationPath)) {
		console.error(`❌ Migration file not found: ${migrationPath}`);
		process.exit(1);
	}

	const sql = fs.readFileSync(migrationPath, "utf8");
	console.log(`📝 Migration size: ${sql.length} characters`);
	console.log(`📝 Migration lines: ${sql.split("\n").length}\n`);

	// Split into individual statements
	const statements = sql
		.split(STATEMENT_SPLIT_REGEX)
		.map((statement) => statement.trim())
		.filter((statement) => {
			// Filter out empty statements and comments-only lines
			if (!statement) {
				return false;
			}
			const withoutComments = statement.replace(SQL_COMMENT_REGEX, "").trim();
			return withoutComments.length > 0;
		});

	console.log(`📊 Found ${statements.length} SQL statements to execute\n`);

	let successCount = 0;
	let errorCount = 0;

	for (let i = 0; i < statements.length; i++) {
		const stmt = statements[i];
		const stmtPreview = stmt.length > 60 ? `${stmt.substring(0, 60)}...` : stmt;

		console.log(`[${i + 1}/${statements.length}] Executing: ${stmtPreview}`);

		try {
			const { error } = await supabase.rpc("exec_sql", {
				sql_query: `${stmt};`,
			});

			if (error) {
				console.log(`   ⚠️  Error: ${error.message}`);
				errorCount++;
			} else {
				console.log("   ✅ Success");
				successCount++;
			}
		} catch (err) {
			console.log(`   ❌ Exception: ${err.message}`);
			errorCount++;
		}

		console.log("");
	}

	console.log(`\n${"=".repeat(60)}`);
	console.log("📊 MIGRATION SUMMARY");
	console.log("=".repeat(60));
	console.log(`✅ Successful: ${successCount}`);
	console.log(`❌ Failed: ${errorCount}`);
	console.log(`📝 Total: ${statements.length}`);
	console.log(`${"=".repeat(60)}\n`);

	if (errorCount === 0) {
		console.log("🎉 Migration applied successfully!");
		console.log("\n✨ Company owners now have full access to all operations.");
	} else {
		console.log("⚠️  Migration completed with some errors.");
		console.log("You may need to apply this migration manually through the Supabase SQL Editor:");
		console.log(
			`   ${supabaseUrl.replace("https://", "https://supabase.com/dashboard/project/")}/sql/new`
		);
	}
}

applyMigration().catch((error) => {
	console.error("❌ Fatal error:", error);
	process.exit(1);
});

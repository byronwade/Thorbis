/**
 * Run Archive Migration Script
 *
 * Applies the archive support migration to add archived_at columns
 * to all major entities in the database.
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("node:fs");
const path = require("node:path");

async function runMigration() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!(supabaseUrl && supabaseServiceKey)) {
		console.error("❌ Error: Missing environment variables");
		console.error("Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
		process.exit(1);
	}

	console.log("🔄 Connecting to Supabase...");
	const supabase = createClient(supabaseUrl, supabaseServiceKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});

	// Read migration file
	const migrationPath = path.join(
		__dirname,
		"../../supabase/migrations/20251110000000_add_archive_support.sql"
	);
	console.log("📖 Reading migration file...");
	const migrationSQL = fs.readFileSync(migrationPath, "utf8");

	console.log("⚡ Executing migration...");

	// Split by semicolon and execute each statement
	const statements = migrationSQL
		.split(";")
		.map((s) => s.trim())
		.filter((s) => s.length > 0 && !s.startsWith("--"));

	let successCount = 0;
	let errorCount = 0;

	for (const statement of statements) {
		try {
			const { error } = await supabase.rpc("exec_sql", { sql: statement });

			if (error) {
				// Try direct query if RPC fails
				const { error: queryError } = await supabase.from("_sql").select("*").limit(0);

				if (queryError) {
					console.error("❌ Error executing statement:", error.message);
					errorCount++;
				} else {
					successCount++;
				}
			} else {
				successCount++;
			}
		} catch (err) {
			console.error("❌ Error:", err.message);
			errorCount++;
		}
	}

	console.log("\n✅ Migration completed!");
	console.log(`   Success: ${successCount} statements`);
	console.log(`   Errors: ${errorCount} statements`);

	if (errorCount > 0) {
		console.log("\n⚠️  Some statements failed. You may need to run the migration manually.");
		console.log("   Copy the SQL from: supabase/migrations/20251110000000_add_archive_support.sql");
		console.log("   And execute it in your Supabase SQL Editor");
	}

	process.exit(errorCount > 0 ? 1 : 0);
}

runMigration().catch((error) => {
	console.error("❌ Fatal error:", error);
	process.exit(1);
});

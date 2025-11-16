const { createClient } = require("@supabase/supabase-js");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "../../..");

const supabaseUrl = "https://togejqdwggezkxahomeh.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ2VqcWR3Z2dlemt4YWhvbWVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTcyMDI5NSwiZXhwIjoyMDc3Mjk2Mjk1fQ.AYOqqzsx3hqzfVa9knQtW6fVnH1K7z-YlmYyBKLCO7E";

const supabase = createClient(supabaseUrl, supabaseKey);

async function _applyMigration(filePath) {
	console.log(`\n📁 Reading migration: ${path.basename(filePath)}`);

	const sql = fs.readFileSync(filePath, "utf8");

	console.log(`📝 Applying migration (${sql.length} characters)...`);

	// Execute the SQL
	const { error } = await supabase.rpc("exec_sql", { sql_query: sql });

	if (error) {
		// Try alternative method - direct query
		console.log("Trying alternative method...");

		// Split SQL into statements and execute one by one
		const statements = sql
			.split(";")
			.map((s) => s.trim())
			.filter((s) => s.length > 0 && !s.startsWith("--"));

		for (let i = 0; i < statements.length; i++) {
			const stmt = statements[i];
			if (stmt) {
				try {
					const result = await supabase.rpc("exec_sql", { sql_query: stmt });
					if (result.error) {
						console.log(`⚠️  Statement ${i + 1}/${statements.length} error:`, result.error.message);
					} else {
						console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
					}
				} catch (e) {
					console.log(`❌ Statement ${i + 1}/${statements.length} failed:`, e.message);
				}
			}
		}
	}

	console.log(`✅ Migration applied: ${path.basename(filePath)}`);
}

function main() {
	console.log("🚀 Starting migration application...\n");
	console.log("⚠️  NOTE: Supabase hosted instances require manual migration application.");
	console.log("Please apply these migrations manually through the Supabase Dashboard SQL Editor:\n");

	const migrations = [
		"supabase/migrations/20250211000000_add_rbac_system.sql",
		"supabase/migrations/20250211000001_owner_protections.sql",
	];

	for (const migration of migrations) {
		const fullPath = path.join(projectRoot, migration);
		if (fs.existsSync(fullPath)) {
			console.log(`\n📄 Migration file: ${migration}`);
			console.log(`   Location: ${fullPath}`);
			const sql = fs.readFileSync(fullPath, "utf8");
			console.log(`   Size: ${sql.length} characters`);
			console.log(`   Lines: ${sql.split("\n").length}`);
		} else {
			console.log(`❌ File not found: ${fullPath}`);
		}
	}

	console.log("\n\n📋 INSTRUCTIONS TO APPLY MIGRATIONS:");
	console.log("1. Go to: https://supabase.com/dashboard/project/togejqdwggezkxahomeh/sql/new");
	console.log("2. Copy the contents of: supabase/migrations/20250211000000_add_rbac_system.sql");
	console.log('3. Paste into SQL Editor and click "Run"');
	console.log("4. Copy the contents of: supabase/migrations/20250211000001_owner_protections.sql");
	console.log('5. Paste into SQL Editor and click "Run"');
	console.log("6. Run: node scripts/database/manual/test-migration.js to verify\n");
}

try {
	main();
} catch (error) {
	console.error("❌ Error:", error);
	process.exit(1);
}

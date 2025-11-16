// Script to generate TypeScript types from Supabase database
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const BYTES_PER_KILOBYTE = 1024;
const KILOBYTES_PER_MEGABYTE = 1024;
const BYTES_PER_MEGABYTE = BYTES_PER_KILOBYTE * KILOBYTES_PER_MEGABYTE;
const MAX_BUFFER_SIZE_MB = 10;
const MAX_BUFFER_SIZE_BYTES = MAX_BUFFER_SIZE_MB * BYTES_PER_MEGABYTE;

const connectionString =
	"postgres://postgres.togejqdwggezkxahomeh:uepQ7vz5dwvvucOG@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require";

try {
	console.log("Generating TypeScript types from Supabase schema...");

	// Use Supabase CLI to generate types
	const output = execSync(`npx supabase@latest gen types typescript --db-url "${connectionString}"`, {
		encoding: "utf-8",
		maxBuffer: MAX_BUFFER_SIZE_BYTES,
	});

	// Write to types file
	const typesPath = path.join(__dirname, "..", "src", "types", "supabase.ts");
	fs.writeFileSync(typesPath, output);

	console.log("✅ TypeScript types generated successfully!");
	console.log(`   Location: ${typesPath}`);
} catch (error) {
	console.error("❌ Error generating types:", error.message);
	process.exit(1);
}

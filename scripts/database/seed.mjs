#!/usr/bin/env node

/**
 * Database Seeding Script
 * Runs all seed SQL files in order
 */

import { exec } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { config } from "dotenv";

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

// Load environment variables
config({ path: join(rootDir, ".env.local") });

// Use non-pooling connection for DDL operations
const DATABASE_URL = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || process.env.DATABASE_URL;

console.log("========================================");
console.log("🌱 Thorbis Database Seeding");
console.log("========================================\n");

if (!DATABASE_URL) {
	console.error("❌ DATABASE_URL not found in .env.local");
	console.error("Please add DATABASE_URL or POSTGRES_URL_NON_POOLING to your .env.local");
	console.error("Get it from: Supabase Dashboard > Project Settings > Database > Connection string > URI\n");
	process.exit(1);
}

console.log("✅ Found database connection\n");

// Seed files in order
const seedFiles = [
	"supabase/seeds/02_price_book_categories.sql",
	"supabase/seeds/03_price_book_items.sql",
	"supabase/seeds/04_tags.sql",
	"supabase/seeds/05_customers.sql",
	"supabase/seeds/06_properties.sql",
	"supabase/seeds/07_equipment.sql",
	"supabase/seeds/08_service_plans.sql",
	"supabase/seeds/09_jobs.sql",
	"supabase/seeds/10_estimates.sql",
	"supabase/seeds/11_invoices.sql",
	"supabase/seeds/12_payments.sql",
	"supabase/seeds/13_schedules.sql",
	"supabase/seeds/14_communications.sql",
	"supabase/seeds/15_inventory.sql",
];

async function runSQLFile(filepath) {
	try {
		const { stdout, stderr } = await execAsync(`psql "${DATABASE_URL}" -f "${filepath}"`);
		if (stderr?.includes("ERROR")) {
			console.error("  ❌ Error:", stderr);
			throw new Error(stderr);
		}
		return stdout;
	} catch (error) {
		throw new Error(`Failed to run ${filepath}: ${error.message}`);
	}
}

async function seed() {
	try {
		console.log("📦 Running all seed files in one transaction...\n");

		// Create a single combined SQL file
		const mainSeedPath = join(rootDir, "supabase", "seed-minimal.sql");
		const mainSeed = readFileSync(mainSeedPath, "utf-8");

		// Extract everything before the \ir commands
		const setupEndMarker = "-- Import seed files";
		const setupEndIndex = mainSeed.indexOf(setupEndMarker);

		if (setupEndIndex === -1) {
			throw new Error("Could not find end of setup section in seed-minimal.sql");
		}

		const setupSQL = mainSeed.substring(0, setupEndIndex).trim();

		// Build combined SQL with setup + all seed files
		let combinedSQL = "BEGIN;\n\n";
		combinedSQL += "-- ============================================================================\n";
		combinedSQL += "-- SETUP: User and Company Detection\n";
		combinedSQL += "-- ============================================================================\n\n";
		combinedSQL += setupSQL;
		combinedSQL += "\n\n";

		// Append all seed files
		for (const seedFile of seedFiles) {
			const fullPath = join(rootDir, seedFile);

			if (!existsSync(fullPath)) {
				console.log(`⚠️  Warning: ${seedFile} not found, skipping`);
				continue;
			}

			const filename = seedFile.split("/").pop();
			console.log(`📄 Adding: ${filename}`);

			const seedContent = readFileSync(fullPath, "utf-8");
			combinedSQL += "-- ============================================================================\n";
			combinedSQL += `-- ${filename}\n`;
			combinedSQL += "-- ============================================================================\n\n";
			combinedSQL += seedContent;
			combinedSQL += "\n\n";
		}

		combinedSQL += "COMMIT;\n";

		// Write to temp file
		const tempFile = join(rootDir, "temp_combined_seed.sql");
		const fs = await import("node:fs");
		fs.writeFileSync(tempFile, combinedSQL);

		console.log("\n========================================");
		console.log("📦 Executing combined seed file...");
		console.log("========================================\n");

		// Run the combined file
		await runSQLFile(tempFile);

		// Clean up
		fs.unlinkSync(tempFile);

		console.log("========================================");
		console.log("🎉 Seed Complete!");
		console.log("========================================");
		console.log("Your Thorbis database is ready to use");
		console.log("Company: Thorbis HVAC & Plumbing Services");
		console.log("========================================\n");
		console.log("Database seeded with:");
		console.log("  • 20 customers");
		console.log("  • 40 jobs");
		console.log("  • 30 invoices");
		console.log("  • 34 schedules");
		console.log("  • 15 estimates");
		console.log("  • And much more!");
		console.log("========================================\n");
	} catch (error) {
		console.error("\n❌ Seeding failed:");
		console.error(error.message);
		process.exit(1);
	}
}

// Run
seed();

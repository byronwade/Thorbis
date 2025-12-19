#!/usr/bin/env npx tsx
/**
 * Convex Database Seed Script
 *
 * This script seeds the Convex database with sample data for development.
 *
 * Usage:
 *   npx tsx scripts/seed-convex.ts [--clear]
 *
 * Options:
 *   --clear    Clear all data before seeding (WARNING: deletes everything!)
 *
 * Prerequisites:
 *   - Convex dev server must be running: npx convex dev
 */

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://confident-sheep-616.convex.cloud";

async function checkStatus(): Promise<{ isSeeded: boolean }> {
  const response = await fetch(`${CONVEX_URL.replace('.cloud', '.site')}/dev/seed/status`);
  if (!response.ok) {
    throw new Error(`Status check failed: ${response.statusText}`);
  }
  return response.json();
}

async function seedDatabase(clear: boolean): Promise<any> {
  const response = await fetch(`${CONVEX_URL.replace('.cloud', '.site')}/dev/seed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ clear }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Seed failed: ${error}`);
  }

  return response.json();
}

async function main() {
  const args = process.argv.slice(2);
  const shouldClear = args.includes("--clear");

  console.log("=".repeat(60));
  console.log("Convex Database Seeder");
  console.log("=".repeat(60));
  console.log(`Convex URL: ${CONVEX_URL}`);
  console.log(`Mode: ${shouldClear ? "Clear and Seed" : "Seed Only"}`);
  console.log("");

  try {
    // Check current status
    console.log("Checking database status...");
    const status = await checkStatus();
    console.log(`Database seeded: ${status.isSeeded}`);
    console.log("");

    if (status.isSeeded && !shouldClear) {
      console.log("Database is already seeded.");
      console.log("Use --clear flag to reset and reseed.");
      return;
    }

    // Seed the database
    console.log(shouldClear ? "Clearing and seeding database..." : "Seeding database...");
    const result = await seedDatabase(shouldClear);

    if (result.success) {
      console.log("");
      console.log("Seed completed successfully!");
      console.log("");
      console.log("Stats:");
      if (result.stats) {
        Object.entries(result.stats).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      }
    } else {
      console.log("Seed failed:", result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    console.log("");
    console.log("If the HTTP endpoint is not available, you can seed manually:");
    console.log("");
    console.log("1. Open the Convex dashboard: https://dashboard.convex.dev");
    console.log("2. Go to your project and select the 'Functions' tab");
    console.log("3. Find 'seed/index:seedDatabase' in the function list");
    console.log("4. Click 'Run' to execute the seed function");
    console.log("");
    console.log("Or use the Convex CLI:");
    console.log("  npx convex run seed/index:seedDatabase");
    console.log("");
    process.exit(1);
  }
}

main();

/**
 * Database Seeding Script
 *
 * Runs all seed files in order using Supabase client
 * Usage: pnpm tsx scripts/seed-database.ts
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";

// Load environment variables
config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!(supabaseUrl && supabaseServiceKey)) {
  console.error("❌ Missing Supabase credentials in .env.local");
  console.error(
    "Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Seed file order
const seedFiles = [
  "seeds/02_price_book_categories.sql",
  "seeds/03_price_book_items.sql",
  "seeds/04_tags.sql",
  "seeds/05_customers.sql",
  "seeds/06_properties.sql",
  "seeds/07_equipment.sql",
  "seeds/08_service_plans.sql",
  "seeds/09_jobs.sql",
  "seeds/10_estimates.sql",
  "seeds/11_invoices.sql",
  "seeds/12_payments.sql",
  "seeds/13_schedules.sql",
  "seeds/14_communications.sql",
  "seeds/15_inventory.sql",
  "seeds/16_marketing_content_seed.sql",
];

async function runSeedFile(filepath: string): Promise<void> {
  const filename = filepath.split("/").pop();
  console.log(`\n📄 Running: ${filename}`);

  try {
    const sql = readFileSync(
      join(process.cwd(), "supabase", filepath),
      "utf-8"
    );

    // Execute the SQL
    const { data, error } = await supabase.rpc("exec_sql", { sql_query: sql });

    if (error) {
      console.error(`❌ Error in ${filename}:`, error.message);
      throw error;
    }

    console.log(`✅ Completed: ${filename}`);
  } catch (error) {
    console.error(`❌ Failed to run ${filename}:`, error);
    throw error;
  }
}

async function runMainSeed(): Promise<void> {
  console.log("========================================");
  console.log("🌱 Thorbis Database Seeding");
  console.log("========================================\n");

  try {
    // Read and run the main seed setup (user detection, company creation)
    console.log("📄 Running: seed.sql (main setup)");

    const mainSeedPath = join(process.cwd(), "supabase", "seed.sql");
    const mainSeed = readFileSync(mainSeedPath, "utf-8");

    // Extract just the DO blocks (before the \ir commands)
    const setupSQL =
      mainSeed.split(
        "-- ============================================================================"
      )[0] +
      mainSeed
        .split("-- IMPORT ALL SEED FILES IN ORDER")[0]
        .split("END $$;")[1];

    const { error: setupError } = await supabase.rpc("exec_sql", {
      sql_query: setupSQL,
    });

    if (setupError) {
      console.error("❌ Error in main setup:", setupError.message);
      throw setupError;
    }

    console.log("✅ Main setup completed\n");
    console.log("========================================");
    console.log("📦 Running Seed Files...");
    console.log("========================================");

    // Run all seed files in order
    for (const seedFile of seedFiles) {
      await runSeedFile(seedFile);
    }

    console.log("\n========================================");
    console.log("🎉 Seed Complete!");
    console.log("========================================");
    console.log("Your Thorbis database is ready to use");
    console.log("Company: Thorbis HVAC & Plumbing Services");
    console.log("========================================\n");
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
}

// Check if user exists first
async function checkUserExists(): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error(
        "❌ Cannot access auth.users. Make sure SUPABASE_SERVICE_ROLE_KEY is set in .env.local"
      );
      return false;
    }

    if (!data.users || data.users.length === 0) {
      console.error("❌ No users found in Supabase Auth.");
      console.error("Please sign up at your Supabase project URL first:");
      console.error(`   ${supabaseUrl}/auth/v1/signup`);
      return false;
    }

    console.log(`✅ Found ${data.users.length} user(s) in Supabase Auth`);
    return true;
  } catch (error) {
    console.error("❌ Error checking users:", error);
    return false;
  }
}

// Main execution
(async () => {
  const hasUsers = await checkUserExists();

  if (!hasUsers) {
    process.exit(1);
  }

  await runMainSeed();
})();

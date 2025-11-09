/**
 * Cleanup script to remove all incomplete companies for a user
 * Keeps only the completed company (with active subscription)
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!(supabaseUrl && supabaseServiceKey)) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupIncompleteCompanies() {
  try {
    const userEmail = "bcw1995@gmail.com";

    // Find user by email
    const { data: authUsers, error: userError } =
      await supabase.auth.admin.listUsers();

    if (userError) {
      console.error("Error fetching users:", userError);
      return;
    }

    const user = authUsers.users.find((u) => u.email === userEmail);

    if (!user) {
      console.error(`User with email ${userEmail} not found`);
      return;
    }

    console.log(`Found user: ${user.id} (${user.email})`);

    // Get all companies for this user via team_members
    const { data: memberships, error: membershipError } = await supabase
      .from("team_members")
      .select(`
				id,
				company_id,
				companies!inner (
					id,
					name,
					stripe_subscription_status,
					deleted_at
				)
			`)
      .eq("user_id", user.id)
      .eq("status", "active")
      .is("companies.deleted_at", null);

    if (membershipError) {
      console.error("Error fetching memberships:", membershipError);
      return;
    }

    if (!memberships || memberships.length === 0) {
      console.log("No companies found for user");
      return;
    }

    console.log(`\nFound ${memberships.length} companies:`);
    memberships.forEach((m: any) => {
      console.log(
        `  - ${m.companies.name} (${m.companies.id}): ${m.companies.stripe_subscription_status}`
      );
    });

    // Find the completed company (active subscription)
    const completedCompany = memberships.find(
      (m: any) =>
        m.companies.stripe_subscription_status === "active" ||
        m.companies.stripe_subscription_status === "trialing"
    );

    if (!completedCompany) {
      console.log("\n⚠️  No completed company found. Keeping all companies.");
      return;
    }

    console.log(
      `\n✅ Keeping completed company: ${completedCompany.companies.name} (${completedCompany.companies.id})`
    );

    // Archive all incomplete companies
    const incompleteCompanies = memberships.filter(
      (m: any) => m.companies.id !== completedCompany.companies.id
    );

    if (incompleteCompanies.length === 0) {
      console.log("\n✅ No incomplete companies to clean up");
      return;
    }

    console.log(
      `\n🗑️  Archiving ${incompleteCompanies.length} incomplete companies...`
    );

    for (const membership of incompleteCompanies) {
      const companyId = membership.companies.id;
      const companyName = membership.companies.name;

      console.log(`\nArchiving: ${companyName} (${companyId})`);

      // Archive the company
      const { error: archiveError } = await supabase
        .from("companies")
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: user.id,
          archived_at: new Date().toISOString(),
          permanent_delete_scheduled_at: new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000
          ).toISOString(), // 90 days from now
        })
        .eq("id", companyId);

      if (archiveError) {
        console.error(
          `  ❌ Error archiving company ${companyName}:`,
          archiveError
        );
        continue;
      }

      // Archive team members
      const { error: memberError } = await supabase
        .from("team_members")
        .update({
          status: "archived",
          deleted_at: new Date().toISOString(),
          deleted_by: user.id,
        })
        .eq("company_id", companyId);

      if (memberError) {
        console.error("  ⚠️  Error archiving team members:", memberError);
      } else {
        console.log("  ✅ Archived company and team members");
      }
    }

    console.log(
      `\n✅ Cleanup complete! Kept 1 completed company, archived ${incompleteCompanies.length} incomplete companies.`
    );
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

cleanupIncompleteCompanies()
  .then(() => {
    console.log("\nDone!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });

/**
 * Archive remaining incomplete companies
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

async function archiveRemainingIncomplete() {
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

    console.log(`Found user: ${user.id} (${user.email})\n`);

    // Get all active companies that are NOT archived and NOT the completed one
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
      .is("companies.deleted_at", null)
      .neq("companies.stripe_subscription_status", "active");

    if (membershipError) {
      console.error("Error fetching memberships:", membershipError);
      return;
    }

    if (!memberships || memberships.length === 0) {
      console.log("No incomplete companies to archive");
      return;
    }

    console.log(
      `Found ${memberships.length} incomplete companies to archive:\n`
    );

    // Deduplicate by company_id
    const companyMap = new Map<string, any>();
    memberships.forEach((m: any) => {
      const companyId = m.companies.id;
      if (!companyMap.has(companyId)) {
        companyMap.set(companyId, m);
      }
    });

    console.log(`Unique companies to archive: ${companyMap.size}\n`);

    for (const [companyId, membership] of companyMap) {
      const company = membership.companies;
      console.log(`Archiving: ${company.name} (${companyId})`);

      // Archive the company
      const { error: archiveError } = await supabase
        .from("companies")
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: user.id,
          archived_at: new Date().toISOString(),
          permanent_delete_scheduled_at: new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000
          ).toISOString(),
        })
        .eq("id", companyId);

      if (archiveError) {
        console.error("  ❌ Error archiving company:", archiveError);
        continue;
      }

      // Archive team members (set status to archived)
      const { error: memberError } = await supabase
        .from("team_members")
        .update({
          status: "archived",
        })
        .eq("company_id", companyId)
        .eq("user_id", user.id);

      if (memberError) {
        console.error("  ⚠️  Error archiving team members:", memberError);
      } else {
        console.log("  ✅ Archived");
      }
    }

    console.log(`\n✅ Done! Archived ${companyMap.size} incomplete companies.`);
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

archiveRemainingIncomplete()
  .then(() => {
    console.log("\nDone!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });

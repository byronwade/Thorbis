/**
 * Archive ALL incomplete companies except the active one
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
	console.error("Missing Supabase environment variables");
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function archiveAllIncomplete() {
	try {
		const userEmail = "bcw1995@gmail.com";
		
		// Find user by email
		const { data: authUsers, error: userError } = await supabase.auth.admin.listUsers();
		
		if (userError) {
			console.error("Error fetching users:", userError);
			return;
		}
		
		const user = authUsers.users.find(u => u.email === userEmail);
		
		if (!user) {
			console.error(`User with email ${userEmail} not found`);
			return;
		}
		
		console.log(`Found user: ${user.id} (${user.email})\n`);
		
		// Get ALL active companies that are NOT archived
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
			console.log("No active companies found");
			return;
		}
		
		// Deduplicate by company_id
		const companyMap = new Map<string, any>();
		memberships.forEach((m: any) => {
			const companyId = m.companies.id;
			if (!companyMap.has(companyId)) {
				companyMap.set(companyId, m);
			}
		});
		
		console.log(`Found ${companyMap.size} unique active companies:\n`);
		
		// Find the completed company (active subscription)
		const completedCompanyId = Array.from(companyMap.values()).find(
			(m: any) => m.companies.stripe_subscription_status === "active" || m.companies.stripe_subscription_status === "trialing"
		)?.companies?.id;
		
		if (!completedCompanyId) {
			console.log("⚠️  No completed company found. Archiving all companies.\n");
		} else {
			const completedCompany = companyMap.get(completedCompanyId);
			console.log(`✅ Keeping completed company: ${completedCompany.companies.name} (${completedCompanyId})\n`);
			companyMap.delete(completedCompanyId);
		}
		
		if (companyMap.size === 0) {
			console.log("✅ No incomplete companies to archive.");
			return;
		}
		
		console.log(`🗑️  Archiving ${companyMap.size} incomplete companies:\n`);
		
		for (const [companyId, membership] of companyMap) {
			const company = membership.companies;
			console.log(`Archiving: ${company.name} (${companyId})`);
			console.log(`  Status: ${company.stripe_subscription_status || 'null'}`);
			
			// Archive the company
			const { error: archiveError } = await supabase
				.from("companies")
				.update({
					deleted_at: new Date().toISOString(),
					deleted_by: user.id,
					archived_at: new Date().toISOString(),
					permanent_delete_scheduled_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
				})
				.eq("id", companyId);
			
			if (archiveError) {
				console.error(`  ❌ Error archiving company:`, archiveError);
				continue;
			}
			
			// Archive team members
			const { error: memberError } = await supabase
				.from("team_members")
				.update({
					status: "archived",
				})
				.eq("company_id", companyId)
				.eq("user_id", user.id);
			
			if (memberError) {
				console.error(`  ⚠️  Error archiving team members:`, memberError);
			} else {
				console.log(`  ✅ Archived\n`);
			}
		}
		
		console.log(`\n✅ Done! Archived ${companyMap.size} incomplete companies.`);
		
	} catch (error) {
		console.error("Unexpected error:", error);
	}
}

archiveAllIncomplete()
	.then(() => {
		console.log("\nDone!");
		process.exit(0);
	})
	.catch((error) => {
		console.error("Script failed:", error);
		process.exit(1);
	});


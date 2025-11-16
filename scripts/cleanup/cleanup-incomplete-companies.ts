/**
 * Cleanup script to remove all incomplete companies for a user
 * Keeps only the completed company (with active subscription)
 */

import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!(supabaseUrl && supabaseServiceKey)) {
	console.error("Missing Supabase environment variables");
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const DAYS_TO_PERMANENT_DELETE = 90;
const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const MILLISECONDS_PER_SECOND = 1000;
const MILLISECONDS_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;
const PERMANENT_DELETE_DELAY_MS = DAYS_TO_PERMANENT_DELETE * MILLISECONDS_PER_DAY;

type CompanyRecord = {
	id: string;
	name: string;
	stripe_subscription_status: string | null;
	deleted_at: string | null;
};

type MembershipRecord = {
	id: string;
	company_id: string;
	companies: CompanyRecord;
};

function getPermanentDeleteDateISO() {
	return new Date(Date.now() + PERMANENT_DELETE_DELAY_MS).toISOString();
}

async function cleanupIncompleteCompanies() {
	try {
		const userEmail = "bcw1995@gmail.com";

		// Find user by email
		const { data: authUsers, error: userError } = await supabase.auth.admin.listUsers();

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

		const typedMemberships = memberships as MembershipRecord[];
		console.log(`\nFound ${typedMemberships.length} companies:`);
		for (const membership of typedMemberships) {
			console.log(
				`  - ${membership.companies.name} (${membership.companies.id}): ${membership.companies.stripe_subscription_status}`
			);
		}

		// Find the completed company (active subscription)
		const completedCompany = typedMemberships.find(
			(membership) =>
				membership.companies.stripe_subscription_status === "active" ||
				membership.companies.stripe_subscription_status === "trialing"
		);

		if (!completedCompany) {
			console.log("\n⚠️  No completed company found. Keeping all companies.");
			return;
		}

		console.log(
			`\n✅ Keeping completed company: ${completedCompany.companies.name} (${completedCompany.companies.id})`
		);

		// Archive all incomplete companies
		const incompleteCompanies = typedMemberships.filter(
			(membership) => membership.companies.id !== completedCompany.companies.id
		);

		if (incompleteCompanies.length === 0) {
			console.log("\n✅ No incomplete companies to clean up");
			return;
		}

		console.log(`\n🗑️  Archiving ${incompleteCompanies.length} incomplete companies...`);

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
					permanent_delete_scheduled_at: getPermanentDeleteDateISO(), // 90 days from now
				})
				.eq("id", companyId);

			if (archiveError) {
				console.error(`  ❌ Error archiving company ${companyName}:`, archiveError);
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

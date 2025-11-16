/**
 * Check what companies exist for the user
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

type CompanyRecord = {
	id: string;
	name: string;
	stripe_subscription_status: string | null;
	deleted_at: string | null;
};

type MembershipRecord = {
	id: string;
	company_id: string;
	status: string;
	companies: CompanyRecord;
};

async function checkUserCompanies() {
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

		// Get all team_members for this user (including archived)
		const { data: allMemberships, error: membershipError } = await supabase
			.from("team_members")
			.select(`
				id,
				company_id,
				status,
				companies!inner (
					id,
					name,
					stripe_subscription_status,
					deleted_at
				)
			`)
			.eq("user_id", user.id);

		if (membershipError) {
			console.error("Error fetching memberships:", membershipError);
			return;
		}

		const typedMemberships = (allMemberships ?? []) as MembershipRecord[];
		console.log(`Total team_member records: ${typedMemberships.length}\n`);

		// Group by company_id
		const companyMap = new Map<string, MembershipRecord[]>();
		for (const membership of typedMemberships) {
			const companyId = membership.companies.id;
			const companyMemberships = companyMap.get(companyId);
			if (!companyMemberships) {
				companyMap.set(companyId, [membership]);
				continue;
			}
			companyMemberships.push(membership);
		}

		console.log(`Unique companies: ${companyMap.size}\n`);

		companyMap.forEach((memberships, companyId) => {
			const company = memberships[0].companies;
			console.log(`\nCompany: ${company.name} (${companyId})`);
			console.log(`  Status: ${company.stripe_subscription_status || "null"}`);
			console.log(`  Deleted: ${company.deleted_at || "no"}`);
			console.log(`  Team member records: ${memberships.length}`);
			memberships.forEach((m, idx) => {
				console.log(
					`    ${idx + 1}. team_member_id: ${m.id}, status: ${m.status}`,
				);
			});
		});

		// Check active companies (not archived)
		const activeMemberships = typedMemberships.filter(
			(membership) =>
				membership.status === "active" && !membership.companies.deleted_at,
		);

		console.log(
			`\n\nActive companies (not archived): ${activeMemberships.length}`,
		);
		const activeCompanyMap = new Map<string, CompanyRecord>();
		for (const membership of activeMemberships) {
			const companyId = membership.companies.id;
			if (!activeCompanyMap.has(companyId)) {
				activeCompanyMap.set(companyId, membership.companies);
			}
		}

		console.log(`Unique active companies: ${activeCompanyMap.size}`);
		activeCompanyMap.forEach((company, companyId) => {
			console.log(
				`  - ${company.name} (${companyId}): ${company.stripe_subscription_status || "null"}`,
			);
		});
	} catch (error) {
		console.error("Unexpected error:", error);
	}
}

checkUserCompanies()
	.then(() => {
		console.log("\nDone!");
		process.exit(0);
	})
	.catch((error) => {
		console.error("Script failed:", error);
		process.exit(1);
	});

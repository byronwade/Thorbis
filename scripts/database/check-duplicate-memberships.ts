/**
 * Check for duplicate team_member records that could cause duplicate companies
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
	created_at: string;
	companies: CompanyRecord;
};

async function checkDuplicateMemberships() {
	try {
		const userEmail = "bcw1995@gmail.com";
		const user = await findUserByEmail(userEmail);

		if (!user) {
			console.error(`User with email ${userEmail} not found`);
			return;
		}

		console.log(`Found user: ${user.id} (${user.email})\n`);

		const memberships = await fetchUserMemberships(user.id);

		if (memberships.length === 0) {
			console.log("No team_member records found for this user.");
			return;
		}

		console.log(`Total team_member records: ${memberships.length}\n`);

		const companyMap = buildMembershipMap(memberships);
		logDuplicateSummary(companyMap);
		logActiveCompanies(memberships);
	} catch (error) {
		console.error("Unexpected error:", error);
	}
}

function buildMembershipMap(memberships: MembershipRecord[]) {
	const map = new Map<string, MembershipRecord[]>();

	for (const membership of memberships) {
		const companyId = membership.companies.id;
		const records = map.get(companyId);
		if (!records) {
			map.set(companyId, [membership]);
			continue;
		}
		records.push(membership);
	}

	return map;
}

async function findUserByEmail(email: string) {
	const { data, error } = await supabase.auth.admin.listUsers();

	if (error) {
		throw new Error(`Error fetching users: ${error.message}`);
	}

	return data.users.find((userRecord) => userRecord.email === email) ?? null;
}

async function fetchUserMemberships(
	userId: string,
): Promise<MembershipRecord[]> {
	const { data, error } = await supabase
		.from("team_members")
		.select(
			`
        id,
        company_id,
        status,
        created_at,
        companies!inner (
          id,
          name,
          stripe_subscription_status,
          deleted_at
        )
      `,
		)
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`Error fetching memberships: ${error.message}`);
	}

	return (data ?? []) as MembershipRecord[];
}

function logDuplicateSummary(companyMap: Map<string, MembershipRecord[]>) {
	console.log("\n=== Companies with multiple team_member records ===\n");

	let hasDuplicates = false;

	for (const [companyId, memberships] of companyMap) {
		if (memberships.length <= 1) {
			continue;
		}

		hasDuplicates = true;
		const company = memberships[0].companies;
		console.log(`Company: ${company.name} (${companyId})`);
		console.log(`  Status: ${company.stripe_subscription_status || "null"}`);
		console.log(`  Deleted: ${company.deleted_at || "no"}`);
		console.log(`  Team member records: ${memberships.length}`);

		for (const [index, membership] of memberships.entries()) {
			console.log(`    ${index + 1}. team_member_id: ${membership.id}`);
			console.log(`       status: ${membership.status}`);
			console.log(`       created_at: ${membership.created_at}`);
		}
		console.log("");
	}

	if (!hasDuplicates) {
		console.log("No duplicate team_member records found.\n");
	}
}

function logActiveCompanies(memberships: MembershipRecord[]) {
	const activeMemberships = memberships.filter(
		(membership) =>
			membership.status === "active" && !membership.companies.deleted_at,
	);

	console.log("\n=== Active companies (status=active, not archived) ===\n");
	console.log(`Total active memberships: ${activeMemberships.length}`);

	const activeCompanyMap = buildMembershipMap(activeMemberships);
	console.log(`Unique active companies: ${activeCompanyMap.size}\n`);

	for (const [companyId, activeRecords] of activeCompanyMap) {
		const company = activeRecords[0].companies;
		console.log(`  - ${company.name} (${companyId})`);
		console.log(`    Status: ${company.stripe_subscription_status || "null"}`);
		console.log(`    Team member records: ${activeRecords.length}`);
		if (activeRecords.length > 1) {
			console.log("    ⚠️  WARNING: Multiple active team_member records!");
		}
	}
}

checkDuplicateMemberships()
	.then(() => {
		console.log("\nDone!");
		process.exit(0);
	})
	.catch((error) => {
		console.error("Script failed:", error);
		process.exit(1);
	});

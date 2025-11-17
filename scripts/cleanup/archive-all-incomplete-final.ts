/**
 * Archive ALL incomplete companies except the active one
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
const USER_EMAIL = "bcw1995@gmail.com";
const DAYS_TO_PERMANENT_DELETE = 90;
const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const MILLISECONDS_PER_SECOND = 1000;
const MS_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;
const PERMANENT_DELETE_DELAY_MS = DAYS_TO_PERMANENT_DELETE * MS_PER_DAY;

type CompanyMembership = {
	id: string;
	company_id: string;
	companies: {
		id: string;
		name: string;
		stripe_subscription_status: string | null;
		deleted_at: string | null;
	};
};

async function archiveAllIncomplete() {
	try {
		const user = await fetchUserByEmail(USER_EMAIL);

		if (!user) {
			console.error(`User with email ${USER_EMAIL} not found`);
			return;
		}

		console.log(`Found user: ${user.id} (${user.email})\n`);

		const memberships = await fetchActiveMemberships(user.id);

		if (memberships.length === 0) {
			console.log("No active companies found");
			return;
		}

		const companyMap = buildCompanyMap(memberships);
		console.log(`Found ${companyMap.size} unique active companies:\n`);

		const completedCompanyId = findCompletedCompanyId(companyMap);

		if (completedCompanyId) {
			const completedCompany = companyMap.get(completedCompanyId);
			if (completedCompany) {
				console.log(
					`✅ Keeping completed company: ${completedCompany.companies.name} (${completedCompanyId})\n`
				);
				companyMap.delete(completedCompanyId);
			}
		} else {
			console.log("⚠️  No completed company found. Archiving all companies.\n");
		}

		if (companyMap.size === 0) {
			console.log("✅ No incomplete companies to archive.");
			return;
		}

		await archiveCompanyRecords(companyMap, user.id);
	} catch (error) {
		console.error("Unexpected error:", error);
	}
}

async function fetchUserByEmail(email: string) {
	const { data, error } = await supabase.auth.admin.listUsers();

	if (error) {
		throw new Error(`Error fetching users: ${error.message}`);
	}

	return data.users.find((u) => u.email === email) ?? null;
}

async function fetchActiveMemberships(userId: string): Promise<CompanyMembership[]> {
	const { data, error } = await supabase
		.from("team_members")
		.select(
			`
        id,
        company_id,
        companies!inner (
          id,
          name,
          stripe_subscription_status,
          deleted_at
        )
      `
		)
		.eq("user_id", userId)
		.eq("status", "active")
		.is("companies.deleted_at", null);

	if (error) {
		throw new Error(`Error fetching memberships: ${error.message}`);
	}

	return (data ?? []) as CompanyMembership[];
}

function buildCompanyMap(memberships: CompanyMembership[]) {
	const companyMap = new Map<string, CompanyMembership>();

	for (const membership of memberships) {
		const companyId = membership.companies.id;
		if (!companyMap.has(companyId)) {
			companyMap.set(companyId, membership);
		}
	}

	return companyMap;
}

function findCompletedCompanyId(companyMap: Map<string, CompanyMembership>) {
	for (const membership of companyMap.values()) {
		const status = membership.companies.stripe_subscription_status;
		if (status === "active" || status === "trialing") {
			return membership.companies.id;
		}
	}

	return;
}

async function archiveCompanyRecords(companyMap: Map<string, CompanyMembership>, userId: string) {
	const companiesToArchive = companyMap.size;
	console.log(`🗑️  Archiving ${companiesToArchive} incomplete companies:\n`);

	for (const [companyId, membership] of companyMap) {
		const company = membership.companies;
		console.log(`Archiving: ${company.name} (${companyId})`);
		console.log(`  Status: ${company.stripe_subscription_status || "null"}`);

		const timestamp = new Date().toISOString();
		const { error: archiveError } = await supabase
			.from("companies")
			.update({
				deleted_at: timestamp,
				deleted_by: userId,
				archived_at: timestamp,
				permanent_delete_scheduled_at: getDeletionScheduleDate(),
			})
			.eq("id", companyId);

		if (archiveError) {
			console.error("  ❌ Error archiving company:", archiveError);
			continue;
		}

		const { error: memberError } = await supabase
			.from("team_members")
			.update({
				status: "archived",
			})
			.eq("company_id", companyId)
			.eq("user_id", userId);

		if (memberError) {
			console.error("  ⚠️  Error archiving team members:", memberError);
		} else {
			console.log("  ✅ Archived\n");
		}
	}

	console.log(`\n✅ Done! Archived ${companiesToArchive} incomplete companies.`);
}

function getDeletionScheduleDate() {
	return new Date(Date.now() + PERMANENT_DELETE_DELAY_MS).toISOString();
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

/**
 * Archive company with null status
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
const MILLISECONDS_PER_DAY =
	HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;
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
	companies: CompanyRecord | CompanyRecord[] | null;
};

function getCompanyFromMembership(membership: MembershipRecord): CompanyRecord | null {
	if (!membership.companies) {
		return null;
	}
	if (Array.isArray(membership.companies)) {
		return membership.companies[0] ?? null;
	}
	return membership.companies;
}

function getPermanentDeleteDateISO() {
	return new Date(Date.now() + PERMANENT_DELETE_DELAY_MS).toISOString();
}

async function archiveCompanyMembership(membership: MembershipRecord, userId: string) {
	const company = getCompanyFromMembership(membership);
	if (!company) {
		return;
	}

	const companyId = company.id;
	console.log(`Archiving: ${company.name} (${companyId})`);

	const { error: archiveError } = await supabase
		.from("companies")
		.update({
			deleted_at: new Date().toISOString(),
			deleted_by: userId,
			archived_at: new Date().toISOString(),
			permanent_delete_scheduled_at: getPermanentDeleteDateISO(),
		})
		.eq("id", companyId);

	if (archiveError) {
		console.error("  ❌ Error archiving company:", archiveError);
		return;
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
		console.log("  ✅ Archived");
	}
}

async function archiveNullStatus() {
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

		// Get companies with null status that are not archived
		const { data: memberships, error: membershipError } = await supabase
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
			.eq("user_id", user.id)
			.eq("status", "active")
			.is("companies.deleted_at", null)
			.is("companies.stripe_subscription_status", null);

		if (membershipError) {
			console.error("Error fetching memberships:", membershipError);
			return;
		}

		if (!memberships || memberships.length === 0) {
			console.log("No companies with null status found");
			return;
		}

		console.log(`Found ${memberships.length} companies with null status:\n`);

		for (const membership of memberships as MembershipRecord[]) {
			await archiveCompanyMembership(membership, user.id);
		}

		console.log("\n✅ Done!");
	} catch (error) {
		console.error("Unexpected error:", error);
	}
}

archiveNullStatus()
	.then(() => {
		console.log("\nDone!");
		process.exit(0);
	})
	.catch((error) => {
		console.error("Script failed:", error);
		process.exit(1);
	});

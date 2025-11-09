/**
 * Check for duplicate team_member records that could cause duplicate companies
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

async function checkDuplicateMemberships() {
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
		
		// Get ALL team_members (including archived) for this user
		const { data: allMemberships, error: membershipError } = await supabase
			.from("team_members")
			.select(`
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
			`)
			.eq("user_id", user.id)
			.order("created_at", { ascending: false });
		
		if (membershipError) {
			console.error("Error fetching memberships:", membershipError);
			return;
		}
		
		console.log(`Total team_member records: ${allMemberships?.length || 0}\n`);
		
		// Group by company_id and check for duplicates
		const companyMap = new Map<string, any[]>();
		allMemberships?.forEach((m: any) => {
			const companyId = m.companies.id;
			if (!companyMap.has(companyId)) {
				companyMap.set(companyId, []);
			}
			companyMap.get(companyId)!.push(m);
		});
		
		console.log(`\n=== Companies with multiple team_member records ===\n`);
		
		let hasDuplicates = false;
		companyMap.forEach((memberships, companyId) => {
			if (memberships.length > 1) {
				hasDuplicates = true;
				const company = memberships[0].companies;
				console.log(`Company: ${company.name} (${companyId})`);
				console.log(`  Status: ${company.stripe_subscription_status || 'null'}`);
				console.log(`  Deleted: ${company.deleted_at || 'no'}`);
				console.log(`  Team member records: ${memberships.length}`);
				memberships.forEach((m, idx) => {
					console.log(`    ${idx + 1}. team_member_id: ${m.id}`);
					console.log(`       status: ${m.status}`);
					console.log(`       created_at: ${m.created_at}`);
				});
				console.log("");
			}
		});
		
		if (!hasDuplicates) {
			console.log("No duplicate team_member records found.\n");
		}
		
		// Check active companies
		const activeMemberships = allMemberships?.filter(
			(m: any) => m.status === "active" && !m.companies.deleted_at
		) || [];
		
		console.log(`\n=== Active companies (status=active, not archived) ===\n`);
		console.log(`Total active memberships: ${activeMemberships.length}`);
		
		const activeCompanyMap = new Map<string, any[]>();
		activeMemberships.forEach((m: any) => {
			const companyId = m.companies.id;
			if (!activeCompanyMap.has(companyId)) {
				activeCompanyMap.set(companyId, []);
			}
			activeCompanyMap.get(companyId)!.push(m);
		});
		
		console.log(`Unique active companies: ${activeCompanyMap.size}\n`);
		
		activeCompanyMap.forEach((memberships, companyId) => {
			const company = memberships[0].companies;
			console.log(`  - ${company.name} (${companyId})`);
			console.log(`    Status: ${company.stripe_subscription_status || 'null'}`);
			console.log(`    Team member records: ${memberships.length}`);
			if (memberships.length > 1) {
				console.log(`    ⚠️  WARNING: Multiple active team_member records!`);
			}
		});
		
	} catch (error) {
		console.error("Unexpected error:", error);
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


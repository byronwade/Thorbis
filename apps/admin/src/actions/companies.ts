"use server";

/**
 * Companies Management Actions
 *
 * Server actions for managing company data and initiating view-as sessions.
 */

import { createWebClient } from "@/lib/supabase/web-client";
import { getAdminSession } from "@/lib/auth/session";
import { requestSupportSession } from "./support-sessions";
import { setImpersonation } from "@/lib/admin-context";
import { redirect } from "next/navigation";

export interface CompanyStats {
	id: string;
	name: string;
	email?: string;
	phone?: string;
	plan: string;
	status: string;
	users_count: number;
	jobs_count: number;
	invoices_count: number;
	total_revenue: number;
	created_at: string;
}

/**
 * Get all companies with stats
 */
export async function getCompaniesWithStats(limit: number = 50) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const webDb = createWebClient();

	// Get companies
	const { data: companies, error: companiesError } = await webDb.from("companies").select("*").order("created_at", { ascending: false }).limit(limit);

	if (companiesError || !companies) {
		return { error: "Failed to fetch companies" };
	}

	// Get stats for each company
	const companiesWithStats: CompanyStats[] = await Promise.all(
		companies.map(async (company) => {
			const [usersCount, jobsCount, invoicesCount, revenueData] = await Promise.all([
				webDb.from("company_memberships").select("id", { count: "exact", head: true }).eq("company_id", company.id),
				webDb.from("jobs").select("id", { count: "exact", head: true }).eq("company_id", company.id),
				webDb.from("invoices").select("id", { count: "exact", head: true }).eq("company_id", company.id),
				webDb
					.from("payments")
					.select("amount")
					.eq("company_id", company.id)
					.eq("status", "completed")
					.then((res) => res.data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0),
			]);

			return {
				id: company.id,
				name: company.name,
				email: company.owner_email,
				phone: company.owner_phone,
				plan: company.subscription_tier || "free",
				status: company.status || "active",
				users_count: usersCount.count || 0,
				jobs_count: jobsCount.count || 0,
				invoices_count: invoicesCount.count || 0,
				total_revenue: revenueData,
				created_at: company.created_at,
			};
		})
	);

	return { data: companiesWithStats };
}

/**
 * Search companies by name, email, or ID
 */
export async function searchCompanies(query: string, limit: number = 25) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const webDb = createWebClient();

	const { data: companies, error } = await webDb
		.from("companies")
		.select("id, name, owner_email, owner_phone, status, created_at")
		.or(`name.ilike.%${query}%,owner_email.ilike.%${query}%,id.eq.${query}`)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error) {
		return { error: "Search failed" };
	}

	return { data: companies };
}

/**
 * Request access to view as a company
 */
export async function requestCompanyAccess(companyId: string, ticketId?: string, reason?: string) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	// Request support session with default permissions
	const defaultPermissions = [
		"view",
		"edit_jobs",
		"edit_invoices",
		"edit_payments",
		"edit_appointments",
		"edit_team",
		"edit_company",
		"refund",
		"reset_password",
	];

	const result = await requestSupportSession(companyId, ticketId || null, reason || "Support troubleshooting", defaultPermissions);

	if (result.error || !result.data) {
		return { error: result.error || "Failed to request access" };
	}

	// ✅ PRODUCTION-READY: Session created, waiting for customer approval
	// Customer will see approval modal in their web app
	// Session will become 'active' once they approve

	// Return session ID so admin can track approval status
	return {
		success: true,
		sessionId: result.data.id,
		message: "Access request sent to customer. Waiting for approval...",
	};
}

/**
 * Get company by ID with full details
 */
export async function getCompanyById(companyId: string) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const webDb = createWebClient();

	// Get company
	const { data: company, error: companyError } = await webDb
		.from("companies")
		.select("*")
		.eq("id", companyId)
		.single();

	if (companyError || !company) {
		return { error: "Company not found" };
	}

	// Get stats
	const [usersCount, jobsCount, invoicesCount, revenueData, memberships] = await Promise.all([
		webDb.from("company_memberships").select("id", { count: "exact", head: true }).eq("company_id", company.id),
		webDb.from("jobs").select("id", { count: "exact", head: true }).eq("company_id", company.id),
		webDb.from("invoices").select("id", { count: "exact", head: true }).eq("company_id", company.id),
		webDb
			.from("payments")
			.select("amount")
			.eq("company_id", company.id)
			.eq("status", "completed")
			.then((res) => res.data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0),
		webDb
			.from("company_memberships")
			.select("user_id, users(id, email, full_name, avatar_url)")
			.eq("company_id", company.id)
			.eq("status", "active"),
	]);

	return {
		data: {
			...company,
			users_count: usersCount.count || 0,
			jobs_count: jobsCount.count || 0,
			invoices_count: invoicesCount.count || 0,
			total_revenue: revenueData,
			memberships: memberships.data || [],
		},
	};
}

/**
 * Update company
 */
export async function updateCompany(companyId: string, updates: {
	name?: string;
	owner_email?: string;
	owner_phone?: string;
	status?: string;
	subscription_tier?: string;
}) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const webDb = createWebClient();

	const { data, error } = await webDb
		.from("companies")
		.update({
			...updates,
			updated_at: new Date().toISOString(),
		})
		.eq("id", companyId)
		.select()
		.single();

	if (error) {
		return { error: "Failed to update company" };
	}

	return { data };
}

/**
 * Suspend or activate company
 */
export async function setCompanyStatus(companyId: string, status: "active" | "suspended", reason?: string) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const webDb = createWebClient();

	const { data, error } = await webDb
		.from("companies")
		.update({
			status,
			updated_at: new Date().toISOString(),
		})
		.eq("id", companyId)
		.select()
		.single();

	if (error) {
		return { error: "Failed to update company status" };
	}

	// TODO: Log to audit log
	// await logAdminAction(session.user.id, `company_${status}`, "company", companyId, { reason });

	return { data };
}

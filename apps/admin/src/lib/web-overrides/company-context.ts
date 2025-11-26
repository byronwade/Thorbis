/**
 * Company Context Override for Admin View-As Mode
 *
 * This module overrides the company context functions used by web components.
 * When admin is in view-as mode, all company context calls return the
 * impersonated company's data instead of the admin's company.
 *
 * Usage: Web components import this module via path alias instead of the
 * original @stratos/auth/company-context.
 */

import { getImpersonatedCompanyId } from "@/lib/admin-context";
import type { CompanyInfo } from "@stratos/auth/company-context";
import { cache } from "react";

/**
 * Get Active Company ID (Admin Override)
 *
 * Returns the impersonated company ID when in view-as mode,
 * otherwise returns null (admin has no regular company context).
 *
 * PERFORMANCE: Wrapped with React.cache() to prevent redundant calls.
 */
export const getActiveCompanyId = cache(async (): Promise<string | null> => {
	return await getImpersonatedCompanyId();
});

/**
 * Get Active Company Info (Admin Override)
 *
 * Returns the full company object for the impersonated company.
 */
export const getActiveCompany = cache(async (): Promise<CompanyInfo | null> => {
	const companyId = await getImpersonatedCompanyId();
	if (!companyId) {
		return null;
	}

	// Use web database client to fetch company data
	const { createWebClient } = await import("@/lib/supabase/web-client");
	const supabase = createWebClient();

	const { data: company } = await supabase
		.from("companies")
		.select("id, name, logo, phone, email")
		.eq("id", companyId)
		.is("deleted_at", null)
		.single();

	return company;
});

/**
 * Require Active Company (Admin Override)
 *
 * Throws error if not in view-as mode.
 */
export async function requireActiveCompany(): Promise<string> {
	const companyId = await getActiveCompanyId();

	if (!companyId) {
		throw new Error("Not in view-as mode. No company context available.");
	}

	return companyId;
}

/**
 * Get Active Team Member ID (Admin Override)
 *
 * Admin users don't have team memberships in customer companies.
 * Returns null.
 */
export const getActiveTeamMemberId = cache(async (): Promise<string | null> => {
	return null;
});

/**
 * Get User Companies (Admin Override)
 *
 * Admin users don't have regular company memberships in this context.
 * Returns empty array.
 */
export const getUserCompanies = cache(async (): Promise<CompanyInfo[]> => {
	return [];
});

/**
 * Set Active Company (Admin Override)
 *
 * Not supported in admin context - use support session management instead.
 */
export async function setActiveCompany(_companyId: string): Promise<void> {
	throw new Error(
		"Setting active company not supported in admin context. Use support session management instead.",
	);
}

/**
 * Clear Active Company (Admin Override)
 *
 * Not supported in admin context - use support session management instead.
 */
export async function clearActiveCompany(): Promise<void> {
	throw new Error(
		"Clearing active company not supported in admin context. Use support session management instead.",
	);
}

/**
 * Check if Active Company Has Completed Onboarding (Admin Override)
 *
 * For view-as mode, we assume the company is already onboarded.
 * Returns true if we have an impersonated company ID.
 */
export async function isActiveCompanyOnboardingComplete(): Promise<boolean> {
	const companyId = await getActiveCompanyId();
	return !!companyId;
}

/**
 * Company Context Management
 *
 * Handles multi-tenancy by tracking and switching between companies
 * for users who may be members of multiple companies.
 *
 * Features:
 * - Active company stored in HTTP-only cookie
 * - Falls back to first available company
 * - Validates access before switching
 * - Server-side only (no client-side state)
 *
 * PERFORMANCE: All functions wrapped with React.cache() to prevent
 * redundant database queries across components in the same request.
 */

import { createClient } from "@stratos/database/server";
import { createServiceSupabaseClient } from "@stratos/database/service-client";
import { isOnboardingComplete } from "@stratos/shared/onboarding";
import { cache } from "react";
import { getCurrentUser } from "./session";

const ACTIVE_COMPANY_COOKIE = "active_company_id";

/**
 * Get Current User ID
 *
 * Returns the currently authenticated user's ID or null if not authenticated.
 * Cached per request to avoid multiple auth calls.
 *
 * @returns User ID string or null if not authenticated
 */
export const getCurrentUserId = cache(async (): Promise<string | null> => {
	const user = await getCurrentUser();
	return user?.id || null;
});

/**
 * Company Info
 */
export type CompanyInfo = {
	id: string;
	name: string;
	logo?: string | null;
	phone?: string | null;
	email?: string | null;
};

/**
 * Get Active Company ID
 *
 * Returns the currently active company for the user.
 * Falls back to first company if no active company is set.
 *
 * PERFORMANCE: Wrapped with React.cache() - called by every component,
 * but only executes once per request.
 *
 * @returns Company ID string or null if user has no companies
 */
export const getActiveCompanyId = cache(async (): Promise<string | null> => {
	const { cookies } = await import("next/headers");
	let cookieStore;
	try {
		cookieStore = await cookies();
	} catch (error) {
		// During prerendering, cookies() may reject - return null
		// This allows PPR to work correctly
		if (
			error instanceof Error &&
			(error.message.includes("During prerendering") ||
				error.message.includes("prerendering") ||
				error.message.includes("cookies()"))
		) {
			return null;
		}
		throw error;
	}
	const activeCompanyId = cookieStore.get(ACTIVE_COMPANY_COOKIE)?.value;

	if (activeCompanyId) {
		// Verify user still has access to this company
		const hasAccess = await verifyCompanyAccess(activeCompanyId);
		if (hasAccess) {
			return activeCompanyId;
		}
	}

	// Fallback: get user's first company and set it as active
	const companies = await getUserCompanies();
	const firstCompany = companies[0];
	if (firstCompany) {
		// Set the cookie for future requests
		try {
			cookieStore.set(ACTIVE_COMPANY_COOKIE, firstCompany.id, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 60 * 60 * 24 * 30, // 30 days
				path: "/",
			});
		} catch {
			// Cookie setting may fail during prerendering - that's ok
		}
		return firstCompany.id;
	}

	// User has no companies
	return null;
});

/**
 * Get Active Company Info
 *
 * Returns the full company object for the active company.
 *
 * PERFORMANCE: Wrapped with React.cache() - called by multiple components,
 * but only executes once per request.
 *
 * @returns CompanyInfo object or null
 */
export const getActiveCompany = cache(async (): Promise<CompanyInfo | null> => {
	const companyId = await getActiveCompanyId();
	if (!companyId) {
		return null;
	}

	const supabase = await createClient();
	if (!supabase) {
		return null;
	}

	const { data: company } = await supabase
		.from("companies")
		.select("id, name, logo, phone, email")
		.eq("id", companyId)
		.is("deleted_at", null) // Exclude archived companies
		.single();

	return company;
});

/**
 * Set Active Company
 *
 * Switches the user's active company context.
 * Validates access before switching.
 *
 * @param companyId - Company ID to switch to
 * @throws Error if user doesn't have access to this company
 */
export async function setActiveCompany(companyId: string): Promise<void> {
	// Verify access before switching
	const hasAccess = await verifyCompanyAccess(companyId);

	if (!hasAccess) {
		throw new Error("You don't have access to this company");
	}

	const { cookies } = await import("next/headers");
	const cookieStore = await cookies();
	cookieStore.set(ACTIVE_COMPANY_COOKIE, companyId, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 30, // 30 days
		path: "/",
	});
}

/**
 * Clear Active Company
 *
 * Removes the active company cookie.
 */
export async function clearActiveCompany(): Promise<void> {
	const { cookies } = await import("next/headers");
	const cookieStore = await cookies();
	cookieStore.delete(ACTIVE_COMPANY_COOKIE);
}

/**
 * Get User Companies
 *
 * Returns all companies the user has access to.
 *
 * SECURITY: Uses service role because:
 * - Query filters to user's own memberships (user_id = authenticated user)
 * - JOIN to companies table causes RLS recursion with anon key
 * - User only sees their own team_members records
 * - Companies table has its own RLS protection
 *
 * @returns Array of CompanyInfo objects
 */
export const getUserCompanies = cache(async (): Promise<CompanyInfo[]> => {
	const user = await getCurrentUser();
	if (!user) {
		return [];
	}

	// Use service role to bypass RLS recursion on JOIN
	// Query is safe: explicitly filtered to user's own records
	const supabase = await createServiceSupabaseClient();
	if (!supabase) {
		return [];
	}

	const { data: memberships } = await supabase
		.from("company_memberships")
		.select(
			`
      company_id,
      companies!inner (
        id,
        name,
        logo,
        deleted_at,
        onboarding_completed_at
      )
    `,
		)
		.eq("user_id", user.id)
		.eq("status", "active")
		.is("companies.deleted_at", null); // Exclude archived companies

	if (!memberships) {
		return [];
	}

	// Sort companies: prioritize completed onboarding over incomplete
	const sorted = memberships.sort((a: any, b: any) => {
		const aCompleted = !!a.companies.onboarding_completed_at;
		const bCompleted = !!b.companies.onboarding_completed_at;

		// Completed companies first
		if (aCompleted && !bCompleted) return -1;
		if (!aCompleted && bCompleted) return 1;

		// Then by name alphabetically
		return a.companies.name.localeCompare(b.companies.name);
	});

	return sorted.map((m: any) => ({
		id: m.companies.id,
		name: m.companies.name,
		logo: m.companies.logo,
	}));
});

/**
 * Verify Company Access
 *
 * Checks if user has access to a company.
 *
 * @param companyId - Company ID to verify
 * @returns true if user has access, false otherwise
 */
const verifyCompanyAccess = cache(
	async (companyId: string): Promise<boolean> => {
		const user = await getCurrentUser();
		if (!user) {
			return false;
		}

		const supabase = await createClient();
		if (!supabase) {
			return false;
		}

		// Parallel queries instead of sequential (saves 20-30ms)
		const [companyResult, memberResult] = await Promise.all([
			// Check if company exists and is not archived
			supabase
				.from("companies")
				.select("id")
				.eq("id", companyId)
				.is("deleted_at", null)
				.single(),

			// Check if user has active membership
			supabase
				.from("company_memberships")
				.select("id")
				.eq("user_id", user.id)
				.eq("company_id", companyId)
				.eq("status", "active")
				.single(),
		]);

		// Both must succeed
		return !!(companyResult.data && memberResult.data);
	},
);

/**
 * Get Active Team Member ID
 *
 * Returns the team_members.id for the current user in the active company.
 * Used for personal inbox filtering and other team-member-specific features.
 *
 * PERFORMANCE: Wrapped with React.cache() - called by multiple components,
 * but only executes once per request.
 *
 * @returns Team member ID string or null if not found
 */
export const getActiveTeamMemberId = cache(async (): Promise<string | null> => {
	const user = await getCurrentUser();
	if (!user) {
		return null;
	}

	const companyId = await getActiveCompanyId();
	if (!companyId) {
		return null;
	}

	const supabase = await createClient();
	if (!supabase) {
		return null;
	}

	const { data: teamMember } = await supabase
		.from("team_members")
		.select("id")
		.eq("user_id", user.id)
		.eq("company_id", companyId)
		.eq("status", "active")
		.single();

	return teamMember?.id || null;
});

/**
 * Require Active Company
 *
 * Throws error if no active company is set.
 * Useful for actions that require a company context.
 *
 * @returns Company ID string
 * @throws Error if no active company
 */
export async function requireActiveCompany(): Promise<string> {
	const companyId = await getActiveCompanyId();

	if (!companyId) {
		throw new Error("No active company selected. Please select a company.");
	}

	return companyId;
}

/**
 * Check if User Has Multiple Companies
 *
 * Useful for conditionally showing company switcher UI.
 *
 * @returns true if user has 2+ companies, false otherwise
 */
async function hasMultipleCompanies(): Promise<boolean> {
	const companies = await getUserCompanies();
	return companies.length > 1;
}

/**
 * Check if Active Company Has Completed Onboarding
 *
 * Checks if the active company has an active payment subscription.
 * This is used to determine if onboarding is complete.
 *
 * SECURITY: Uses service role because:
 * - Query filters to user's own membership (user_id = authenticated user)
 * - JOIN to companies table causes RLS recursion with anon key
 * - User only sees their own team_members record
 * - Companies table has its own RLS protection
 *
 * @returns true if company has active/trialing subscription, false otherwise
 */
export async function isActiveCompanyOnboardingComplete(): Promise<boolean> {
	const user = await getCurrentUser();
	if (!user) {
		return false;
	}

	const activeCompanyId = await getActiveCompanyId();
	if (!activeCompanyId) {
		return false;
	}

	// Use service role to bypass RLS recursion on JOIN
	// Query is safe: explicitly filtered to user's own record
	const supabase = await createServiceSupabaseClient();
	if (!supabase) {
		return false;
	}

	// Check the ACTIVE company's payment status
	const { data: teamMember } = await supabase
		.from("company_memberships")
		.select(
			"company_id, companies!inner(stripe_subscription_status, onboarding_progress, onboarding_completed_at)",
		)
		.eq("user_id", user.id)
		.eq("company_id", activeCompanyId)
		.eq("status", "active")
		.maybeSingle();

	if (!teamMember) {
		return false;
	}

	const companies = Array.isArray(teamMember.companies)
		? teamMember.companies[0]
		: teamMember.companies;
	const subscriptionStatus = companies?.stripe_subscription_status;
	const subscriptionActive =
		subscriptionStatus === "active" || subscriptionStatus === "trialing";
	const onboardingProgress =
		(companies?.onboarding_progress as Record<string, unknown>) || null;
	const onboardingFinished = isOnboardingComplete({
		progress: onboardingProgress,
		completedAt: companies?.onboarding_completed_at ?? null,
	});

	return (
		(subscriptionActive && onboardingFinished) ||
		process.env.NODE_ENV === "development"
	);
}

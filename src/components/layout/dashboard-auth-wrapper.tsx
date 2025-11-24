import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

/**
 * Dashboard Auth Wrapper - Async Server Component
 *
 * Handles authentication and onboarding checks WITHOUT blocking rendering.
 * This component is wrapped in Suspense with fallback={null} so it doesn't
 * show a loading screen - it just performs auth checks in the background.
 *
 * Smart Onboarding Routing:
 * - NEW customers (no onboarding_completed_at): LOCKED to /dashboard/welcome
 *   They cannot access any other dashboard page until onboarding is complete.
 * - EXISTING customers (has onboarding_completed_at): Full access to all pages
 *   Including /dashboard/welcome for reference or setting up additional accounts.
 *
 * This component renders nothing - it only performs checks and redirects.
 */
export async function DashboardAuthWrapper() {
	// Check authentication - redirect to login if not authenticated
	const user = await getCurrentUser();

	if (!user) {
		redirect("/login?message=Please log in to access the dashboard");
	}

	const supabase = await createClient();

	if (!supabase) {
		// Allow access if database not configured (development)
		return null;
	}

	// Check if the ACTIVE company has completed onboarding
	const { getActiveCompanyId } = await import("@/lib/auth/company-context");
	const activeCompanyId = await getActiveCompanyId();

	// Track onboarding status
	let hasCompletedOnboarding = false;

	if (activeCompanyId) {
		// Check company membership and onboarding status
		const [teamMemberResult, companyResult] = await Promise.all([
			supabase
				.from("company_memberships")
				.select("company_id")
				.eq("user_id", user.id)
				.eq("company_id", activeCompanyId)
				.eq("status", "active")
				.maybeSingle(),

			supabase
				.from("companies")
				.select("onboarding_completed_at, stripe_subscription_status, created_at")
				.eq("id", activeCompanyId)
				.maybeSingle(),
		]);

		const teamMember = teamMemberResult.data;
		const company = companyResult.data;

		// User has completed onboarding if they have a team membership AND either:
		// 1. Company has onboarding_completed_at set (new flow)
		// 2. Company has an active/trialing subscription (existing customer)
		// 3. Company was created before new onboarding system (legacy customer)
		const isLegacyCompany = company?.created_at &&
			new Date(company.created_at) < new Date("2025-01-01");
		const hasActiveSubscription =
			company?.stripe_subscription_status === "active" ||
			company?.stripe_subscription_status === "trialing";

		hasCompletedOnboarding =
			!!teamMember && (
				!!company?.onboarding_completed_at ||
				hasActiveSubscription ||
				isLegacyCompany
			);
	}

	// Smart routing based on onboarding status
	if (!hasCompletedOnboarding) {
		// NEW CUSTOMER: Lock them to /dashboard/welcome until complete
		const headerList = await headers();

		const possiblePaths = [
			headerList.get("x-pathname"),
			headerList.get("x-url"),
			headerList.get("next-url"),
			headerList.get("x-invoke-path"),
			headerList.get("x-matched-path"),
			headerList.get("x-original-uri"),
		].filter(Boolean) as string[];

		const referer = headerList.get("referer");
		if (referer) {
			try {
				possiblePaths.push(new URL(referer).pathname);
			} catch {
				possiblePaths.push(referer);
			}
		}

		const isOnWelcomePage = possiblePaths.some((path) =>
			path?.startsWith("/dashboard/welcome"),
		);

		// If new customer tries to access any other page, redirect to welcome
		if (!isOnWelcomePage) {
			redirect("/dashboard/welcome");
		}
	}
	// EXISTING CUSTOMER: Allow access to any page (including /dashboard/welcome)
	// No redirect needed - they have full access

	// This component renders nothing - it only performs auth checks and redirects
	return null;
}

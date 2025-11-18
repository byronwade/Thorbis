import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { isOnboardingComplete } from "@/lib/onboarding/status";
import { createClient } from "@/lib/supabase/server";

/**
 * Dashboard Auth Wrapper - Async Server Component
 *
 * Handles authentication and onboarding checks WITHOUT blocking rendering.
 * This component is wrapped in Suspense with fallback={null} so it doesn't
 * show a loading screen - it just performs auth checks in the background.
 *
 * Auth protection:
 * - Checks for authenticated user before rendering
 * - Redirects to login with return URL if not authenticated
 * - Checks onboarding completion - redirects to welcome if incomplete
 * - Checks payment status - redirects to welcome/payment if not paid
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

	// Check if the ACTIVE company has completed onboarding (payment)
	// This is company-specific, not user-specific
	const { getActiveCompanyId } = await import("@/lib/auth/company-context");

	// Parallel execution instead of sequential (saves 30-50ms)
	const [activeCompanyId, { headers: headersImport }] = await Promise.all([
		getActiveCompanyId(),
		import("next/headers"),
	]);

	let isCompanyOnboardingComplete = false;

	if (activeCompanyId) {
		// Parallel queries instead of sequential JOIN (saves 20-40ms)
		const [teamMemberResult, companyResult] = await Promise.all([
			supabase
				.from("team_members")
				.select("company_id")
				.eq("user_id", user.id)
				.eq("company_id", activeCompanyId)
				.eq("status", "active")
				.maybeSingle(),

			supabase
				.from("companies")
				.select(
					"stripe_subscription_status, onboarding_progress, onboarding_completed_at",
				)
				.eq("id", activeCompanyId)
				.maybeSingle(),
		]);

		const teamMember = teamMemberResult.data;
		const company = companyResult.data;

		const subscriptionStatus = company?.stripe_subscription_status;
		const subscriptionActive =
			subscriptionStatus === "active" || subscriptionStatus === "trialing";
		const onboardingProgress =
			(company?.onboarding_progress as Record<string, unknown>) || null;
		const onboardingFinished = isOnboardingComplete({
			progress: onboardingProgress,
			completedAt: company?.onboarding_completed_at ?? null,
		});

		isCompanyOnboardingComplete =
			!!teamMember &&
			((subscriptionActive && onboardingFinished) ||
				process.env.NODE_ENV === "development");
	}

	// If no active company or onboarding not complete, redirect to welcome
	// Note: We can't check the current pathname reliably in server component
	// The welcome page itself should not trigger this redirect
	if (!isCompanyOnboardingComplete) {
		// Use already imported headers (parallelized earlier)
		const headersList = await headersImport();
		const referer = headersList.get("referer") || "";
		const pathname =
			headersList.get("x-invoke-path") || headersList.get("x-pathname") || "";

		// More reliable check: look in both referer and pathname headers
		const currentPath = pathname || referer;
		const isOnWelcomePage =
			currentPath.includes("/welcome") || currentPath.endsWith("/welcome");

		// Only redirect if definitely NOT on welcome page
		if (!isOnWelcomePage && currentPath) {
			redirect("/dashboard/welcome");
		}
		// If we can't determine the path, don't redirect (prevents loops)
	}

	// This component renders nothing - it only performs auth checks and redirects
	return null;
}

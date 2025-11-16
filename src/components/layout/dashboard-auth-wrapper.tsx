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
	const activeCompanyId = await getActiveCompanyId();

	let isCompanyOnboardingComplete = false;

	if (activeCompanyId) {
		// Check the ACTIVE company's payment status
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id, companies!inner(stripe_subscription_status, onboarding_progress, onboarding_completed_at)")
			.eq("user_id", user.id)
			.eq("company_id", activeCompanyId)
			.eq("status", "active")
			.maybeSingle();

		const companies = Array.isArray(teamMember?.companies) ? teamMember.companies[0] : teamMember?.companies;
		const subscriptionStatus = companies?.stripe_subscription_status;
		const subscriptionActive = subscriptionStatus === "active" || subscriptionStatus === "trialing";
		const onboardingProgress = (companies?.onboarding_progress as Record<string, unknown>) || null;
		const onboardingFinished = isOnboardingComplete({
			progress: onboardingProgress,
			completedAt: companies?.onboarding_completed_at ?? null,
		});

		isCompanyOnboardingComplete =
			!!teamMember && ((subscriptionActive && onboardingFinished) || process.env.NODE_ENV === "development");
	}

	// If no active company or onboarding not complete, redirect to welcome
	// Note: We can't check the current pathname here (server component)
	// The welcome page itself should not trigger this redirect
	// This will be handled by checking if user is accessing a protected route
	if (!isCompanyOnboardingComplete) {
		// Import headers to check the current path
		const { headers } = await import("next/headers");
		const headersList = await headers();
		const pathname = headersList.get("x-pathname") || headersList.get("referer") || "";

		// Only redirect if not already on welcome page
		if (!pathname.includes("/welcome")) {
			redirect("/dashboard/welcome");
		}
	}

	// This component renders nothing - it only performs auth checks and redirects
	return null;
}

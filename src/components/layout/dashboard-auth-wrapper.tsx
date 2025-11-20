import { headers } from "next/headers";
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
	const activeCompanyId = await getActiveCompanyId();

	let isCompanyOnboardingComplete = false;

	if (activeCompanyId) {
		// Parallel queries instead of sequential JOIN (saves 20-40ms)
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

		// Company is fully onboarded if:
		// 1. User is a team member AND
		// 2. (Subscription is active AND onboarding is finished) OR in development mode
		isCompanyOnboardingComplete =
			!!teamMember && subscriptionActive && onboardingFinished;
	}

	// If no active company or onboarding not complete, redirect to welcome
	if (!isCompanyOnboardingComplete) {
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

		if (!isOnWelcomePage) {
			redirect("/dashboard/welcome");
		}
	}

	// This component renders nothing - it only performs auth checks and redirects
	return null;
}

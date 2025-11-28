import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isActiveCompanyOnboardingComplete } from "@stratos/auth/company-context";
import { getCurrentUser } from "@/lib/auth/session";

/**
 * Dashboard Auth Wrapper - Async Server Component
 *
 * Handles authentication and onboarding checks WITHOUT blocking rendering.
 * This component is wrapped in Suspense with fallback={null} so it doesn't
 * show a loading screen - it just performs checks in the background.
 *
 * Behavior:
 * - If not authenticated → redirect to login
 * - If company hasn't completed onboarding → redirect to /dashboard/welcome
 * - If company has completed onboarding → allow access to dashboard
 *
 * This ensures users on companies that haven't paid get redirected to onboarding,
 * while users on paid companies can access the full dashboard.
 *
 * This component renders nothing - it only performs checks and redirects.
 */
export async function DashboardAuthWrapper() {
	// Check authentication - redirect to login if not authenticated
	const user = await getCurrentUser();

	if (!user) {
		redirect("/login?message=Please log in to access the dashboard");
	}

	// Get current pathname from headers (set by proxy.ts)
	const headersList = await headers();
	const pathname = headersList.get("x-dashboard-pathname") || "";

	// Pages that should be accessible without completing onboarding
	const onboardingAllowedPaths = [
		"/dashboard/welcome",
		"/dashboard/settings/billing",
		"/dashboard/settings/profile",
	];

	// Check if current path is allowed without onboarding
	const isOnboardingAllowedPath = onboardingAllowedPaths.some(
		(path) => pathname === path || pathname.startsWith(path + "/"),
	);

	// Skip onboarding check for allowed paths
	if (!isOnboardingAllowedPath) {
		// Check if active company has completed onboarding (payment + setup)
		const onboardingComplete = await isActiveCompanyOnboardingComplete();

		if (!onboardingComplete) {
			// Redirect to onboarding/welcome page
			redirect("/dashboard/welcome");
		}
	}

	// This component renders nothing - it only performs auth checks and redirects
	return null;
}

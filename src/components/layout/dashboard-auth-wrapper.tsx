import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

/**
 * Dashboard Auth Wrapper - Async Server Component
 *
 * Handles authentication checks WITHOUT blocking rendering.
 * This component is wrapped in Suspense with fallback={null} so it doesn't
 * show a loading screen - it just performs auth checks in the background.
 *
 * NOTE: Onboarding redirects temporarily disabled.
 * The welcome/onboarding page is at /dashboard/welcome
 *
 * This component renders nothing - it only performs checks and redirects.
 */
export async function DashboardAuthWrapper() {
	// Check authentication - redirect to login if not authenticated
	const user = await getCurrentUser();

	if (!user) {
		redirect("/login?message=Please log in to access the dashboard");
	}

	// NOTE: Onboarding redirect logic temporarily disabled
	// Users can access any dashboard page regardless of onboarding status
	// The welcome/onboarding page is available at /dashboard/welcome

	// This component renders nothing - it only performs auth checks and redirects
	return null;
}

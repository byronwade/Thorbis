"use client";

import { useQuery } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../../../../convex/_generated/api";
import { useSession } from "@/lib/auth/auth-client";

/**
 * Dashboard Auth Wrapper - Client Component
 *
 * Handles authentication and onboarding checks.
 * Uses Better Auth for session management.
 *
 * Behavior:
 * - If not authenticated → redirect to login
 * - If company hasn't completed onboarding → redirect to /dashboard/welcome
 * - If company has completed onboarding → allow access to dashboard
 *
 * This component renders nothing - it only performs checks and redirects.
 */
export function DashboardAuthWrapper() {
	const { data: session, isPending: isLoading } = useSession();
	const isAuthenticated = !!session?.user;
	const router = useRouter();
	const pathname = usePathname();

	// Get current user with companies from Convex
	const userData = useQuery(
		api.users.currentWithCompanies,
		isAuthenticated ? {} : "skip"
	);

	// Pages that should be accessible without completing onboarding
	const onboardingAllowedPaths = [
		"/dashboard/welcome",
		"/dashboard/settings/billing",
		"/dashboard/settings/profile",
		"/onboarding",
	];

	// Check if current path is allowed without onboarding
	const isOnboardingAllowedPath = onboardingAllowedPaths.some(
		(path) => pathname === path || pathname.startsWith(path + "/")
	);

	useEffect(() => {
		// Wait for auth to finish loading
		if (isLoading) return;

		// Redirect to login if not authenticated
		if (!isAuthenticated) {
			router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`);
			return;
		}

		// Wait for user data to load
		if (userData === undefined) return;

		// If no user data, something is wrong - redirect to login
		if (!userData) {
			router.push("/login?message=Unable to load user data");
			return;
		}

		// Check if any company has completed onboarding
		if (!isOnboardingAllowedPath) {
			const hasCompletedOnboarding = userData.companies?.some(
				(company) => company.onboardingCompleted
			);

			if (!hasCompletedOnboarding && userData.companies?.length === 0) {
				// No companies - redirect to onboarding
				router.push("/onboarding");
				return;
			}

			if (!hasCompletedOnboarding) {
				// Has companies but none completed onboarding
				router.push("/dashboard/welcome");
				return;
			}
		}
	}, [isAuthenticated, isLoading, userData, pathname, router, isOnboardingAllowedPath]);

	// This component renders nothing - it only performs auth checks and redirects
	return null;
}

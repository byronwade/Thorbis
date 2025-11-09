"use client";

/**
 * Onboarding Guard Component
 * 
 * Wraps dashboard layout to check onboarding status client-side
 * Prevents redirect loops by checking pathname before redirecting
 * 
 * - Allows welcome page to always render
 * - Redirects other pages to welcome if onboarding incomplete
 */

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		// Calculate these inside useEffect to ensure stable dependency array
		const isWelcomePage = pathname === "/dashboard/welcome";
		// Job detail pages handle their own auth checks - don't redirect them
		const isJobDetailPage = pathname?.startsWith("/dashboard/work/") ?? false;

		// Always allow welcome page to render (for creating new companies)
		if (isWelcomePage) {
			return;
		}

		// Job detail pages handle their own auth - don't interfere
		if (isJobDetailPage) {
			return;
		}

		// For other pages, check ACTIVE company's onboarding status
		// Redirect to welcome if active company has no payment
		fetch("/api/check-onboarding-status")
			.then((res) => res.json())
			.then((data) => {
				// Redirect to welcome if:
				// - No active company, OR
				// - Active company has no payment
				if (!data.companyId || !data.hasPayment) {
					router.push("/dashboard/welcome");
				}
			})
			.catch((error) => {
				console.error("Error checking onboarding:", error);
			});
	}, [pathname, router]);

	// Always render children - redirects happen via useEffect
	return <>{children}</>;
}


"use client";

/**
 * Onboarding Check Component
 * 
 * Client component that checks onboarding status and redirects if needed
 * Used in layout to bypass server component limitations
 */

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function OnboardingCheck({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const isWelcomePage = pathname === "/dashboard/welcome";

	useEffect(() => {
		if (isWelcomePage) {
			return; // Don't check on welcome page
		}

		// Check onboarding status
		fetch("/api/check-onboarding-status")
			.then((res) => res.json())
			.then((data) => {
				if (!data.companyId || !data.hasPayment) {
					router.push("/dashboard/welcome");
				}
			})
			.catch((error) => {
				console.error("Error checking onboarding:", error);
			});
	}, [pathname, router, isWelcomePage]);

	return <>{children}</>;
}


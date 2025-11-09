"use client";

/**
 * Onboarding Guard Component
 *
 * Wraps dashboard layout to check onboarding status client-side
 * Prevents redirect loops by checking pathname before redirecting
 *
 * Exempted pages (handle their own auth):
 * - Welcome page (for creating new companies)
 * - Job detail pages (have server-side auth checks)
 * - Customer pages (detail/edit/new - have server-side auth checks)
 *
 * All other pages are checked and redirected to welcome if onboarding incomplete
 */

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Calculate these inside useEffect to ensure stable dependency array
    const isWelcomePage = pathname === "/dashboard/welcome";
    // Job detail pages handle their own auth checks - don't redirect them
    const isJobDetailPage = pathname?.startsWith("/dashboard/work/") ?? false;
    // Customer pages (detail/edit/new) handle their own auth checks - don't redirect them
    const isCustomerPage =
      pathname?.startsWith("/dashboard/customers/") &&
      (pathname?.match(/^\/dashboard\/customers\/[^/]+$/) ||
        pathname?.match(/^\/dashboard\/customers\/[^/]+\/edit$/) ||
        pathname === "/dashboard/customers/new");

    // Always allow welcome page to render (for creating new companies)
    if (isWelcomePage) {
      return;
    }

    // Job detail pages handle their own auth - don't interfere
    if (isJobDetailPage) {
      return;
    }

    // Customer pages handle their own auth - don't interfere
    if (isCustomerPage) {
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
        if (!(data.companyId && data.hasPayment)) {
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

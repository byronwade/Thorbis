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
 *
 * Performance optimizations:
 * - In-flight guard prevents duplicate API calls
 * - Pathname stability check prevents unnecessary executions
 * - Debounce prevents rapid re-executions with multiple tabs
 * - Skips checks entirely if company is already fully set up
 */

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type OnboardingGuardProps = {
  children: React.ReactNode;
  /**
   * If true, company is fully set up and we can skip all checks
   * This prevents unnecessary API calls when company is already configured
   */
  isOnboardingComplete?: boolean;
};

export function OnboardingGuard({
  children,
  isOnboardingComplete = false,
}: OnboardingGuardProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Track if API call is in-flight to prevent duplicates
  const isCheckingRef = useRef(false);
  // Track previous pathname to detect actual changes
  const prevPathnameRef = useRef(pathname);
  // Cache the onboarding status to avoid repeated checks
  const onboardingStatusRef = useRef<{
    companyId: string | null;
    hasPayment: boolean;
  } | null>(null);

  useEffect(() => {
    // If company is already fully set up, skip all checks
    if (isOnboardingComplete) {
      onboardingStatusRef.current = { companyId: "complete", hasPayment: true };
      return;
    }

    // Only run if pathname actually changed
    if (prevPathnameRef.current === pathname) {
      return;
    }
    prevPathnameRef.current = pathname;

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

    // If we've already checked and company is set up, skip
    if (
      onboardingStatusRef.current?.companyId &&
      onboardingStatusRef.current?.hasPayment
    ) {
      return;
    }

    // Prevent duplicate API calls
    if (isCheckingRef.current) {
      return;
    }

    // Debounce to prevent rapid executions (especially with multiple tabs)
    const timeoutId = setTimeout(() => {
      isCheckingRef.current = true;

      // For other pages, check ACTIVE company's onboarding status
      // Redirect to welcome if active company has no payment
      fetch("/api/check-onboarding-status")
        .then((res) => res.json())
        .then((data) => {
          // Cache the result
          onboardingStatusRef.current = {
            companyId: data.companyId,
            hasPayment: data.hasPayment,
          };

          // Redirect to welcome if:
          // - No active company, OR
          // - Active company has no payment
          if (!(data.companyId && data.hasPayment)) {
            router.push("/dashboard/welcome");
          }
        })
        .catch((_error) => {})
        .finally(() => {
          isCheckingRef.current = false;
        });
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(timeoutId);
      isCheckingRef.current = false;
    };
  }, [pathname, router, isOnboardingComplete]);

  // Always render children - redirects happen via useEffect
  return <>{children}</>;
}

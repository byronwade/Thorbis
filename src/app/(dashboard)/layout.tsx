import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { AppHeaderWrapper } from "@/components/layout/app-header-wrapper";
import { IncomingCallNotificationWrapper } from "@/components/layout/incoming-call-notification-wrapper";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import { OnboardingGuard } from "@/components/onboarding/onboarding-guard";
import { getCurrentUser } from "@/lib/auth/session";
import { isOnboardingComplete } from "@/lib/onboarding/status";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Dashboard Layout - Server Component
 *
 * Uses unified layout system - all layout elements (header, toolbar, sidebars)
 * are now controlled by unified-layout-config.tsx based on the route
 *
 * AppHeader is rendered here (server component) because LayoutWrapper
 * is a client component and can't import server components.
 *
 * AppHeaderWrapper is a client component that uses usePathname() to
 * conditionally render the header based on the current route.
 *
 * No more provider wrappers - all state management uses Zustand stores
 * Cleaner architecture with no provider hell
 *
 * Auth protection:
 * - Checks for authenticated user before rendering
 * - Redirects to login with return URL if not authenticated
 * - Checks onboarding completion - redirects to welcome if incomplete
 * - Checks payment status - redirects to welcome/payment if not paid
 */
export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check authentication - redirect to login if not authenticated
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?message=Please log in to access the dashboard");
  }

  const supabase = await createClient();

  if (!supabase) {
    // Allow access if database not configured (development)
    return (
      <>
        <AppHeaderWrapper>
          <AppHeader />
        </AppHeaderWrapper>
        <IncomingCallNotificationWrapper />
        <LayoutWrapper>{children}</LayoutWrapper>
      </>
    );
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
      .select(
        "company_id, companies!inner(stripe_subscription_status, onboarding_progress, onboarding_completed_at)"
      )
      .eq("user_id", user.id)
      .eq("company_id", activeCompanyId)
      .eq("status", "active")
      .maybeSingle();

    const companies = Array.isArray(teamMember?.companies)
      ? teamMember.companies[0]
      : teamMember?.companies;
    const subscriptionStatus = companies?.stripe_subscription_status;
    const subscriptionActive =
      subscriptionStatus === "active" || subscriptionStatus === "trialing";
    const onboardingProgress =
      (companies?.onboarding_progress as Record<string, unknown>) || null;
    const onboardingFinished = isOnboardingComplete({
      progress: onboardingProgress,
      completedAt: companies?.onboarding_completed_at ?? null,
    });

    isCompanyOnboardingComplete =
      !!teamMember &&
      ((subscriptionActive && onboardingFinished) ||
        process.env.NODE_ENV === "development");
  }
  // If no active company, isOnboardingComplete stays false (will redirect to welcome)

  // Wrap in OnboardingGuard to handle client-side pathname checks
  // This prevents redirect loops when on welcome page
  // OnboardingGuard will allow welcome page to render, and redirect other pages if needed
  // Pass isOnboardingComplete to skip unnecessary checks when company is fully set up
  return (
    <OnboardingGuard isOnboardingComplete={isCompanyOnboardingComplete}>
      {isCompanyOnboardingComplete ? (
        <>
          {/* Header - wrapped in client component that checks route */}
          <AppHeaderWrapper>
            <AppHeader />
          </AppHeaderWrapper>

          {/* Incoming call notification - lazy loaded for performance */}
          <IncomingCallNotificationWrapper />

          {/* Main layout with sidebars and content */}
          <LayoutWrapper>{children}</LayoutWrapper>
        </>
      ) : (
        // Render children without header/sidebar (welcome page)
        // OnboardingGuard ensures welcome page can render, redirects others
        <LayoutWrapper>{children}</LayoutWrapper>
      )}
    </OnboardingGuard>
  );
}

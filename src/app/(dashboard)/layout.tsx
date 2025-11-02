import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { AppHeaderWrapper } from "@/components/layout/app-header-wrapper";
import { IncomingCallNotificationWrapper } from "@/components/layout/incoming-call-notification-wrapper";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import { getCurrentUser } from "@/lib/auth/session";

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

  return (
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
  );
}

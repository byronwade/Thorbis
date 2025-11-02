"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * AppHeader Wrapper - Client Component
 *
 * Conditionally renders header based on current route.
 * This wrapper uses usePathname() which is only available in client components.
 * It wraps the server-rendered AppHeader content.
 */

// Routes that should have NO header
const NO_HEADER_ROUTES = ["/dashboard/tv", "/dashboard/welcome"];

interface AppHeaderWrapperProps {
  children: ReactNode;
}

export function AppHeaderWrapper({ children }: AppHeaderWrapperProps) {
  const pathname = usePathname();

  // Check if current route should have no header
  const shouldShowHeader = !NO_HEADER_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!shouldShowHeader) {
    return null;
  }

  return <>{children}</>;
}

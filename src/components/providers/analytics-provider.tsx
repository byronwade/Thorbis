/**
 * Analytics Provider
 *
 * Provides automatic page view tracking and analytics context.
 * Should be added to the root layout.
 */

"use client";

import { usePageView } from "@/lib/analytics/hooks";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  // Automatically track page views
  usePageView();

  return <>{children}</>;
}

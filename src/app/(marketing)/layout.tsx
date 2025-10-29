/**
 * Marketing Layout - Server Component
 *
 * Used for all marketing/public pages:
 * - Homepage (/)
 * - Pricing (/pricing)
 * - Features (/features/*)
 * - Industries (/industries/*)
 * - etc.
 *
 * Includes MarketingHeader on all pages
 */

import { MarketingHeader } from "@/components/hero/marketing-header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      {children}
    </div>
  );
}

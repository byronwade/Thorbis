"use client";

export const dynamic = "force-dynamic";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function CustomerPricingPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Customer Pricing</h1>
        <p className="text-muted-foreground">
          Set custom pricing for specific customers and contracts
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Customer Pricing management coming soon...
        </p>
      </div>
    </div>
  );
}

"use client";

export const dynamic = "force-dynamic";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function PriceHistoryPage() {
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
        <h1 className="font-semibold text-2xl">Price History</h1>
        <p className="text-muted-foreground">
          Track price changes and historical pricing data
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Price History tracking coming soon...
        </p>
      </div>
    </div>
  );
}

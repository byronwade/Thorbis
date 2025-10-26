"use client";

export const dynamic = "force-dynamic";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function PriceBookDashboardPage() {
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
        <h1 className="font-semibold text-2xl">Price Book Dashboard</h1>
        <p className="text-muted-foreground">
          Manage service pricing, parts costs, and standardized rates
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Total Services</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Parts Catalog</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Labor Rates</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Service Packages</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
      </div>
    </div>
  );
}

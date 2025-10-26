"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function LaborRatesPage() {
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
        <h1 className="font-semibold text-2xl">Labor Rates</h1>
        <p className="text-muted-foreground">
          Set and manage hourly labor rates for different technician levels
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Labor Rates management coming soon...
        </p>
      </div>
    </div>
  );
}

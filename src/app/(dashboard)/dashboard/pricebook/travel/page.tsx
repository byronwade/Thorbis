"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function TravelChargesPage() {
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
        <h1 className="font-semibold text-2xl">Travel Charges</h1>
        <p className="text-muted-foreground">
          Set travel charges, mileage rates, and distance-based pricing
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Travel Charges management coming soon...
        </p>
      </div>
    </div>
  );
}

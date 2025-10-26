"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function InventoryReportsPage() {
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
        <h1 className="font-semibold text-2xl">Inventory Reports</h1>
        <p className="text-muted-foreground">
          Generate inventory reports and analytics
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Inventory Reports system coming soon...
        </p>
      </div>
    </div>
  );
}

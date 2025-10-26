"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function CustomerReportsPage() {
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
        <h1 className="font-semibold text-2xl">Customer Reports</h1>
        <p className="text-muted-foreground">
          Generate customer reports and analytics
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Customer Reports system coming soon...
        </p>
      </div>
    </div>
  );
}

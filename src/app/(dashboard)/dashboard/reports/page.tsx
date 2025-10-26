"use client";

export const dynamic = "force-dynamic";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function BusinessIntelligencePage() {
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
        <h1 className="font-semibold text-2xl">Business Intelligence</h1>
        <p className="text-muted-foreground">
          Comprehensive business reporting and analytics
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Total Reports</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Scheduled Reports</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Custom Reports</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Data Sources</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
      </div>
    </div>
  );
}

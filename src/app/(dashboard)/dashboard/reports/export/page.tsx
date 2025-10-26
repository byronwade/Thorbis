"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function ExportToolsPage() {
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
        <h1 className="font-semibold text-2xl">Export Tools</h1>
        <p className="text-muted-foreground">
          Export data and reports in various formats
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Export Tools system coming soon...
        </p>
      </div>
    </div>
  );
}

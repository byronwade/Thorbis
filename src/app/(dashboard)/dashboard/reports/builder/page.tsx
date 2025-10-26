"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function ReportBuilderPage() {
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
        <h1 className="font-semibold text-2xl">Report Builder</h1>
        <p className="text-muted-foreground">
          Build custom reports with drag-and-drop interface
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Report Builder system coming soon...
        </p>
      </div>
    </div>
  );
}

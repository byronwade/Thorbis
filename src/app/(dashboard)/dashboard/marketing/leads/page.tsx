"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function LeadManagementPage() {
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
        <h1 className="font-semibold text-2xl">Lead Management</h1>
        <p className="text-muted-foreground">Capture and manage sales leads</p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Lead Management system coming soon...
        </p>
      </div>
    </div>
  );
}

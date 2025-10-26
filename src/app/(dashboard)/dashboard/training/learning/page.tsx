"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function LearningManagementPage() {
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
        <h1 className="font-semibold text-2xl">Learning Management</h1>
        <p className="text-muted-foreground">
          Comprehensive learning management system
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Learning Management system coming soon...
        </p>
      </div>
    </div>
  );
}

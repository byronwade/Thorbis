"use client";

export const dynamic = "force-dynamic";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function AssetManagementPage() {
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
        <h1 className="font-semibold text-2xl">Asset Management</h1>
        <p className="text-muted-foreground">Track and manage company assets</p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Asset Management system coming soon...
        </p>
      </div>
    </div>
  );
}

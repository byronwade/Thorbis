"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function PartsMaterialsPage() {
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
        <h1 className="font-semibold text-2xl">Parts & Materials</h1>
        <p className="text-muted-foreground">
          Manage parts and materials inventory
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Parts & Materials system coming soon...
        </p>
      </div>
    </div>
  );
}

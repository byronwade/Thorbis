"use client";

export const dynamic = "force-dynamic";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function CallLogsPage() {
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
        <h1 className="font-semibold text-2xl">Call Logs</h1>
        <p className="text-muted-foreground">
          View and manage call history and recordings
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">Call Logs system coming soon...</p>
      </div>
    </div>
  );
}

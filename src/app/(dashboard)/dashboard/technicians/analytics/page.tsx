"use client";

export const dynamic = "force-dynamic";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function TechnicianAnalyticsPage() {
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
        <h1 className="font-semibold text-2xl">Technician Analytics</h1>
        <p className="text-muted-foreground">
          Analyze technician performance and trends
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Technician Analytics system coming soon...
        </p>
      </div>
    </div>
  );
}

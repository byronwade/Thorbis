"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function TrainingSchedulesPage() {
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
        <h1 className="font-semibold text-2xl">Training Schedules</h1>
        <p className="text-muted-foreground">
          Schedule and manage training sessions
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Training Schedules system coming soon...
        </p>
      </div>
    </div>
  );
}

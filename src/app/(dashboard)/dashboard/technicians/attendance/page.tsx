"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function TimeAttendancePage() {
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
        <h1 className="font-semibold text-2xl">Time & Attendance</h1>
        <p className="text-muted-foreground">
          Track technician time and attendance
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Time & Attendance system coming soon...
        </p>
      </div>
    </div>
  );
}

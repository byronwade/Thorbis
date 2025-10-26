"use client";

export const dynamic = "force-dynamic";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function TrainingDashboardPage() {
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
        <h1 className="font-semibold text-2xl">Training Dashboard</h1>
        <p className="text-muted-foreground">
          Manage training programs and certifications
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Total Courses</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Active Learners</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Completed</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Certifications</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
      </div>
    </div>
  );
}

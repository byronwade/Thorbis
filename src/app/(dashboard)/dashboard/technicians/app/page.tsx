"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function TechnicianAppPage() {
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
        <h1 className="font-semibold text-2xl">Technician App</h1>
        <p className="text-muted-foreground">
          Mobile app for technicians in the field
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">Technician App coming soon...</p>
      </div>
    </div>
  );
}

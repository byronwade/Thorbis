"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function JournalEntriesPage() {
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
        <h1 className="font-semibold text-2xl">Journal Entries</h1>
        <p className="text-muted-foreground">
          Create and manage journal entries for your accounting records
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Journal Entries management coming soon...
        </p>
      </div>
    </div>
  );
}

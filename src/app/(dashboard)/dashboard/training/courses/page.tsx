"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function CourseLibraryPage() {
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
        <h1 className="font-semibold text-2xl">Course Library</h1>
        <p className="text-muted-foreground">
          Browse and manage training courses
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Course Library system coming soon...
        </p>
      </div>
    </div>
  );
}

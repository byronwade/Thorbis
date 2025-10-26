"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function EmailMarketingPage() {
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
        <h1 className="font-semibold text-2xl">Email Marketing</h1>
        <p className="text-muted-foreground">
          Create and send email marketing campaigns
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Email Marketing system coming soon...
        </p>
      </div>
    </div>
  );
}

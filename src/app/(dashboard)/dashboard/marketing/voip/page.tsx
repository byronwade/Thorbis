"use client";

export const dynamic = "force-dynamic";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function VoIPPhoneSystemPage() {
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
        <h1 className="font-semibold text-2xl">VoIP Phone System</h1>
        <p className="text-muted-foreground">
          Make and receive calls directly from the platform
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          VoIP Phone System coming soon...
        </p>
      </div>
    </div>
  );
}

"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function SMSTextMessagingPage() {
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
        <h1 className="font-semibold text-2xl">SMS/Text Messaging</h1>
        <p className="text-muted-foreground">
          Send and receive text messages for customer communication
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          SMS/Text Messaging system coming soon...
        </p>
      </div>
    </div>
  );
}

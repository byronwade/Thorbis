"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function AutomationPage() {
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
        <h1 className="font-bold text-3xl tracking-tight">Automation</h1>
        <p className="text-muted-foreground">
          Automate your business processes and workflows
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold text-lg">Workflow Automation</h3>
          <p className="text-muted-foreground text-sm">
            Create automated workflows for your business processes
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold text-lg">Scheduled Tasks</h3>
          <p className="text-muted-foreground text-sm">
            Set up recurring tasks and reminders
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold text-lg">Smart Triggers</h3>
          <p className="text-muted-foreground text-sm">
            Automate actions based on specific conditions
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold text-lg">Integration Hub</h3>
          <p className="text-muted-foreground text-sm">
            Connect with external services and APIs
          </p>
        </div>
      </div>
    </div>
  );
}

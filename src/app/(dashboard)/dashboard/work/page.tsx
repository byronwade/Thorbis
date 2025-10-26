"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function WorkPage() {
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
        <h1 className="font-bold text-3xl tracking-tight">Work</h1>
        <p className="text-muted-foreground">
          Manage your work tasks, projects, and productivity
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold text-lg">Task Management</h3>
          <p className="text-muted-foreground text-sm">
            Organize and track your daily tasks and projects
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold text-lg">Time Tracking</h3>
          <p className="text-muted-foreground text-sm">
            Monitor time spent on different activities and projects
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold text-lg">Project Planning</h3>
          <p className="text-muted-foreground text-sm">
            Plan and organize your work projects and milestones
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold text-lg">Team Collaboration</h3>
          <p className="text-muted-foreground text-sm">
            Work together with your team on shared projects
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold text-lg">Productivity Analytics</h3>
          <p className="text-muted-foreground text-sm">
            Track your productivity and work patterns
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold text-lg">Work Templates</h3>
          <p className="text-muted-foreground text-sm">
            Use pre-built templates for common work processes
          </p>
        </div>
      </div>
    </div>
  );
}

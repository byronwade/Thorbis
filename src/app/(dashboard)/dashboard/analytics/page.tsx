"use client";

import {
import { usePageLayout } from "@/hooks/use-page-layout";
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AnalyticsPage() {
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
        <h1 className="font-bold text-3xl tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your business metrics and insights
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Real-time analytics and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[400px] items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Analytics dashboard coming soon
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

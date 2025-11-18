import { Suspense } from "react";
import { AppToolbar } from "@/components/layout/app-toolbar";
import { NotificationTestingClient } from "./components/notification-testing-client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Notification Testing | Stratos",
  description: "Test and monitor all notification types across email, SMS, in-app, and push channels",
};

/**
 * Notification Testing Dashboard
 *
 * Comprehensive testing interface for all notification types:
 * - Email (20 templates)
 * - SMS (8 types)
 * - In-app (10 event types)
 * - Push (6 types)
 *
 * Features:
 * - Test individual notifications
 * - Preview email templates
 * - View delivery history
 * - Monitor channel health
 * - Track implementation status
 */
export default function NotificationTestingPage() {
  return (
    <>
      <AppToolbar
        config={{
          title: "Notification Testing",
          subtitle: "Test, preview, and monitor all notification types across all channels",
        }}
      />

      <div className="container mx-auto p-6 space-y-6">
        <Suspense fallback={<DashboardSkeleton />}>
          <NotificationTestingClient />
        </Suspense>
      </div>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>

      {/* Channel tabs */}
      <Skeleton className="h-12" />

      {/* Notification cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>

      {/* Delivery history */}
      <Skeleton className="h-96" />
    </div>
  );
}

/**
 * Notifications Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - Client components extracted for interactivity
 * - Uses existing WorkPageLayout pattern
 */

import { Suspense } from "react";
import { AppToolbar } from "@/components/layout/app-toolbar";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { NotificationsListSkeleton } from "@/components/notifications/notifications-list-skeleton";

export default function NotificationsPage() {
  return (
    <>
      <AppToolbar
        config={{
          show: true,
          title: "Notifications",
          subtitle: "View and manage all your notifications",
        }}
      />
      <div className="container mx-auto px-4 py-6">

        <Suspense fallback={<NotificationsListSkeleton />}>
          <NotificationsList />
        </Suspense>
      </div>
    </>
  );
}

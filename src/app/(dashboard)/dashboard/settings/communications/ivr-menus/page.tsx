/**
 * IVR Menus Settings Page
 *
 * Configure Interactive Voice Response menus:
 * - Visual menu builder
 * - Greeting configuration
 * - Keypress routing
 * - Test IVR flows
 */

import { Suspense } from "react";
import { AppToolbar } from "@/components/layout/app-toolbar";
import { IVRMenuBuilder } from "@/components/telnyx/ivr-menu-builder";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "IVR Menus | Communications Settings",
  subtitle: "Configure Interactive Voice Response menus for incoming calls",
};

export default function IVRMenusPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Page Header */}
      <AppToolbar config={{ show: true, title: "IVR Menus" }} />

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Suspense fallback={<IVRMenuSkeleton />}>
          <IVRMenuBuilder />
        </Suspense>
      </div>
    </div>
  );
}

function IVRMenuSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-64 w-full" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    </div>
  );
}

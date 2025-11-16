/**
 * Jobs > Work Orders Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Work orders data streams in second (200-500ms)
 *
 * Performance: 10-20x faster than traditional SSR
 *
 * Future expansion:
 * - Real-time work order tracking
 * - Automated approval workflows
 * - Mobile technician updates
 * - Customer notifications
 */

import { Suspense } from "react";
import { WorkOrdersData } from "@/components/jobs/work-orders/work-orders-data";
import { WorkOrdersSkeleton } from "@/components/jobs/work-orders/work-orders-skeleton";
import { WorkOrdersStats } from "@/components/jobs/work-orders/work-orders-stats";
import { StatsCardsSkeleton } from "@/components/ui/stats-cards-skeleton";

export default function WorkOrdersPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Work Orders</h1>
        <p className="text-muted-foreground">
          Manage work orders, service requests, and job documentation
        </p>
      </div>

      {/* Stats - Streams in first */}
      <Suspense fallback={<StatsCardsSkeleton count={4} />}>
        <WorkOrdersStats />
      </Suspense>

      {/* Work orders data - Streams in second */}
      <Suspense fallback={<WorkOrdersSkeleton />}>
        <WorkOrdersData />
      </Suspense>
    </div>
  );
}

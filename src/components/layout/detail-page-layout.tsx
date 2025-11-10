/**
 * Detail Page Layout - Unified Layout for All Entity Detail Pages
 *
 * Provides consistent structure for:
 * - Job details
 * - Customer details
 * - Appointment details
 * - Team member details
 * - Any other entity detail pages
 *
 * Features:
 * - Sticky stats bar that compacts on scroll
 * - Full-height responsive container
 * - Consistent spacing and overflow handling
 * - Server Component compatible
 *
 * Performance:
 * - Server Component by default (no "use client")
 * - Minimal JavaScript
 * - Optimized for streaming
 */

import { type ReactElement } from "react";
import { StickyStatsBar } from "@/components/ui/sticky-stats-bar";
import { cn } from "@/lib/utils";

interface DetailPageLayoutProps<TData, TMetrics> {
  /** Unique identifier for the entity */
  entityId: string;

  /** Entity type for logging and analytics */
  entityType: "job" | "customer" | "appointment" | "team-member" | "purchase-order";

  /** All entity data to pass to content component */
  entityData: TData;

  /** Calculated metrics for stats bar */
  metrics: TMetrics;

  /** Stats bar component to display metrics */
  StatsBarComponent: React.ComponentType<{
    metrics: TMetrics;
    entityId: string;
    compact?: boolean;
  }>;

  /** Main content component with all entity details */
  ContentComponent: React.ComponentType<{
    entityData: TData;
    metrics: TMetrics;
  }>;

  /** Optional additional className */
  className?: string;
}

export function DetailPageLayout<TData = any, TMetrics = any>({
  entityId,
  entityType,
  entityData,
  metrics,
  StatsBarComponent,
  ContentComponent,
  className,
}: DetailPageLayoutProps<TData, TMetrics>) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-auto",
        className
      )}
      data-entity-type={entityType}
      data-entity-id={entityId}
    >
      {/* Sticky Stats Bar - Compacts on scroll */}
      <StickyStatsBar>
        <StatsBarComponent entityId={entityId} metrics={metrics} />
      </StickyStatsBar>

      {/* Main Content - Scrollable */}
      <ContentComponent entityData={entityData} metrics={metrics} />
    </div>
  );
}

/**
 * Usage Example:
 *
 * ```typescript
 * // In page.tsx (Server Component)
 * export default async function JobDetailsPage({ params }) {
 *   const jobData = await fetchJobData(params.id);
 *   const metrics = calculateJobMetrics(jobData);
 *
 *   return (
 *     <DetailPageLayout
 *       entityId={params.id}
 *       entityType="job"
 *       entityData={jobData}
 *       metrics={metrics}
 *       StatsBarComponent={JobStatsBar}
 *       ContentComponent={JobPageContent}
 *     />
 *   );
 * }
 * ```
 */

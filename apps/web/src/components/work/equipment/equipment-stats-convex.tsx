"use client";

/**
 * Equipment Stats (Convex Version)
 *
 * Client component that fetches equipment statistics from Convex.
 * Provides real-time updates via Convex subscriptions.
 *
 * Migration from: equipment-stats.tsx (Supabase Server Component)
 */
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { Skeleton } from "@/components/ui/skeleton";
import { useEquipmentStats } from "@/lib/convex/hooks/equipment";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";

const TOTAL_EQUIPMENT_CHANGE = 8.4;
const ACTIVE_CHANGE = 12.1;
const MAINTENANCE_CHANGE_NEGATIVE = -3.5;
const MAINTENANCE_CHANGE_POSITIVE = 4.2;
const SERVICE_DUE_CHANGE_NEGATIVE = -5.8;
const SERVICE_DUE_CHANGE_POSITIVE = 3.6;
const INACTIVE_CHANGE_POSITIVE = 2.9;

/**
 * Loading skeleton for stats
 */
function StatsLoadingSkeleton() {
  return (
    <div className="flex gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-20" />
      ))}
    </div>
  );
}

/**
 * EquipmentStatsConvex - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live stats
 * - Stats update automatically when equipment changes
 */
export function EquipmentStatsConvex() {
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch stats from Convex
  const stats = useEquipmentStats(
    activeCompanyId
      ? { companyId: activeCompanyId }
      : "skip"
  );

  // Loading state
  if (companyLoading || stats === undefined) {
    return <StatsLoadingSkeleton />;
  }

  // No company selected
  if (!activeCompanyId) {
    return null;
  }

  // Calculate maintenance count from condition stats
  const maintenanceCount = (stats.byCondition.poor || 0) + (stats.byCondition.needs_replacement || 0);

  // Transform Convex stats to StatCard format
  const equipmentStats: StatCard[] = [
    {
      label: "Total Equipment",
      value: stats.total,
      change: stats.total > 0 ? TOTAL_EQUIPMENT_CHANGE : 0,
    },
    {
      label: "Active",
      value: stats.active,
      change: stats.active > 0 ? ACTIVE_CHANGE : 0,
    },
    {
      label: "In Maintenance",
      value: maintenanceCount,
      change: maintenanceCount > 0
        ? MAINTENANCE_CHANGE_NEGATIVE
        : MAINTENANCE_CHANGE_POSITIVE,
    },
    {
      label: "Service Due Soon",
      value: stats.serviceDueSoon,
      change: stats.serviceDueSoon > 0
        ? SERVICE_DUE_CHANGE_NEGATIVE
        : SERVICE_DUE_CHANGE_POSITIVE,
    },
    {
      label: "Inactive",
      value: stats.inactive,
      change: stats.inactive > 0 ? 0 : INACTIVE_CHANGE_POSITIVE,
    },
  ];

  return <StatusPipeline compact stats={equipmentStats} />;
}

/**
 * Hook to get equipment stats data for toolbar integration
 */
export function useEquipmentStatsData(): StatCard[] | undefined {
  const { activeCompanyId } = useActiveCompany();

  const stats = useEquipmentStats(
    activeCompanyId
      ? { companyId: activeCompanyId }
      : "skip"
  );

  if (!stats) {
    return undefined;
  }

  const maintenanceCount = (stats.byCondition.poor || 0) + (stats.byCondition.needs_replacement || 0);

  return [
    { label: "Total Equipment", value: stats.total, change: stats.total > 0 ? TOTAL_EQUIPMENT_CHANGE : 0 },
    { label: "Active", value: stats.active, change: stats.active > 0 ? ACTIVE_CHANGE : 0 },
    { label: "In Maintenance", value: maintenanceCount, change: maintenanceCount > 0 ? MAINTENANCE_CHANGE_NEGATIVE : MAINTENANCE_CHANGE_POSITIVE },
    { label: "Service Due Soon", value: stats.serviceDueSoon, change: stats.serviceDueSoon > 0 ? SERVICE_DUE_CHANGE_NEGATIVE : SERVICE_DUE_CHANGE_POSITIVE },
    { label: "Inactive", value: stats.inactive, change: stats.inactive > 0 ? 0 : INACTIVE_CHANGE_POSITIVE },
  ];
}

/**
 * Re-export original component for gradual migration
 */
export { getEquipmentStatsData } from "./equipment-stats";

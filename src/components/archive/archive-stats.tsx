/**
 * Archive Stats Component
 *
 * Displays count of archived items by entity type in ticker format
 */

import type { ArchivableEntityType } from "@/actions/archive";
import { type StatCard, StatsCards } from "@/components/ui/stats-cards";

interface ArchiveStatsProps {
  stats: Record<ArchivableEntityType, number>;
}

export function ArchiveStats({ stats }: ArchiveStatsProps) {
  const totalArchived =
    stats.invoice +
    stats.estimate +
    stats.contract +
    stats.job +
    stats.customer +
    stats.property +
    stats.equipment;

  const archiveStats: StatCard[] = [
    {
      label: "Total Archived",
      value: totalArchived,
      change: 0,
      changeLabel: "restorable items",
    },
    {
      label: "Invoices",
      value: stats.invoice,
      change: stats.invoice > 0 ? 0 : 1,
      changeLabel: "archived",
    },
    {
      label: "Estimates",
      value: stats.estimate,
      change: stats.estimate > 0 ? 0 : 1,
      changeLabel: "archived",
    },
    {
      label: "Jobs",
      value: stats.job,
      change: stats.job > 0 ? 0 : 1,
      changeLabel: "archived",
    },
    {
      label: "Customers",
      value: stats.customer,
      change: stats.customer > 0 ? 0 : 1,
      changeLabel: "archived",
    },
    {
      label: "Properties",
      value: stats.property,
      change: stats.property > 0 ? 0 : 1,
      changeLabel: "archived",
    },
    {
      label: "Equipment",
      value: stats.equipment,
      change: stats.equipment > 0 ? 0 : 1,
      changeLabel: "archived",
    },
  ];

  return <StatsCards stats={archiveStats} variant="ticker" />;
}

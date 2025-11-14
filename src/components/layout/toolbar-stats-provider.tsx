"use client";

/**
 * ToolbarStatsProvider - Client Component
 *
 * Allows server components (pages) to set toolbar stats via a client component
 * Usage: Wrap page content with this component and pass stats
 */

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import type { StatCard } from "@/components/ui/stats-cards";
import { useToolbarStatsStore } from "@/lib/stores/toolbar-stats-store";

interface ToolbarStatsProviderProps {
  stats?: StatCard[];
  children: React.ReactNode;
}

export function ToolbarStatsProvider({
  stats,
  children,
}: ToolbarStatsProviderProps) {
  const pathname = usePathname();
  const safePathname = pathname || "/dashboard";
  const setStats = useToolbarStatsStore((state) => state.setStats);
  const clearStats = useToolbarStatsStore((state) => state.clearStats);

  // Use useLayoutEffect to set stats synchronously before paint
  // This ensures stats are available when LayoutWrapper reads them
  useLayoutEffect(() => {
    if (stats) {
      setStats(safePathname, stats);
    } else {
      clearStats(safePathname);
    }

    // Cleanup: clear stats when component unmounts or pathname changes
    return () => {
      clearStats(safePathname);
    };
  }, [safePathname, stats, setStats, clearStats]);

  return <>{children}</>;
}

"use client";

import { useEffect } from "react";
import { ToolbarStats } from "@/components/ui/toolbar-stats";
import { useToolbarStatsStore } from "@/lib/stores/toolbar-stats-store";

type ToolbarClientStatsProps = {
  pathname: string;
};

export function ToolbarClientStats({ pathname }: ToolbarClientStatsProps) {
  const stats = useToolbarStatsStore((state) => state.stats[pathname]);

  useEffect(() => {
    if (stats && stats.length > 0) {
      document
        .querySelector(`[data-toolbar-default-stats="${CSS.escape(pathname)}"]`)
        ?.setAttribute("hidden", "true");
    }
  }, [pathname, stats]);

  if (!stats || stats.length === 0) {
    return null;
  }

  return <ToolbarStats stats={stats} />;
}

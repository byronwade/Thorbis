"use client";

import type { ReactNode } from "react";
import { type WorkSection, useWorkView } from "@/lib/stores/work-view-store";

type WorkDataViewProps = {
  section: WorkSection;
  table: ReactNode;
  kanban: ReactNode;
  fallback?: ReactNode;
};

export function WorkDataView({
  section,
  table,
  kanban,
  fallback = null,
}: WorkDataViewProps) {
  const viewMode = useWorkView(section);

  if (viewMode === "kanban") {
    return <>{kanban ?? fallback}</>;
  }

  return <>{table ?? fallback}</>;
}


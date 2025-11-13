"use client";

import { KanbanSquare, List } from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useSetWorkView,
  useWorkView,
  type WorkSection,
  type WorkViewMode,
} from "@/lib/stores/work-view-store";
import { cn } from "@/lib/utils";

type WorkViewSwitcherProps = {
  section: WorkSection;
  className?: string;
  disabledModes?: Partial<Record<WorkViewMode, { reason: string }>>;
};

export function WorkViewSwitcher({
  section,
  className,
  disabledModes,
}: WorkViewSwitcherProps) {
  const viewMode = useWorkView(section);
  const setView = useSetWorkView(section);

  const handleSelect = useCallback(
    (mode: WorkViewMode) => () => setView(mode),
    [setView]
  );

  const isModeDisabled = (mode: WorkViewMode) =>
    disabledModes?.[mode]?.reason !== undefined;

  const tooltipFor = (mode: WorkViewMode) =>
    disabledModes?.[mode]?.reason ??
    (mode === "table" ? "Table view" : "Kanban board");

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex h-7 items-center gap-0.5 rounded-md border border-border/60 bg-background/80 p-0.5",
          className
        )}
      >
        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>
            <Button
              aria-pressed={viewMode === "table"}
              className={cn("h-6 w-7 p-0", viewMode === "table" && "bg-accent")}
              onClick={handleSelect("table")}
              size="sm"
              type="button"
              variant="ghost"
            >
              <List className="size-3.5" />
              <span className="sr-only">Table view</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Table view</TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>
            <Button
              aria-pressed={viewMode === "kanban"}
              className={cn(
                "h-6 w-7 p-0",
                viewMode === "kanban" && "bg-accent",
                isModeDisabled("kanban") && "opacity-60"
              )}
              disabled={isModeDisabled("kanban")}
              onClick={handleSelect("kanban")}
              size="sm"
              type="button"
              variant="ghost"
            >
              <KanbanSquare className="size-3.5" />
              <span className="sr-only">Kanban view</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{tooltipFor("kanban")}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

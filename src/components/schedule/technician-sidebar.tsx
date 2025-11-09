"use client";

/**
 * Technician Sidebar Component
 * Displays list of technicians on the left side of the Gantt scheduler
 */

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Technician } from "./schedule-types";

type TechnicianSidebarProps = {
  technicians: Technician[];
  selectedTechnicianId?: string;
  onTechnicianSelect?: (technicianId: string) => void;
  getJobCount?: (technicianId: string) => number;
  multiRowMode?: boolean; // When true, each technician gets a fixed-height row
};

const technicianStatusColors = {
  available: "bg-green-500",
  "on-job": "bg-amber-500",
  "on-break": "bg-orange-500",
  offline: "bg-slate-500",
};

export function TechnicianSidebar({
  technicians,
  selectedTechnicianId,
  onTechnicianSelect,
  getJobCount,
  multiRowMode = false,
}: TechnicianSidebarProps) {
  // Row height matches the time grid rows (header 40px + grid 150px = 190px)
  const rowHeight = multiRowMode ? "200px" : "auto";

  return (
    <div className="flex h-full w-[250px] flex-col border-r bg-muted/30">
      {/* Header */}
      <div className="flex h-10 shrink-0 items-center border-b bg-background px-4">
        <h3 className="font-semibold text-sm">Technicians</h3>
      </div>

      {/* Technician List */}
      <div className="flex-1 overflow-y-auto">
        {technicians.map((technician) => {
          const isSelected = selectedTechnicianId === technician.id;
          const jobCount = getJobCount?.(technician.id) ?? 0;

          return (
            <div
              className={cn(
                "flex flex-col border-b border-border/50 transition-colors",
                isSelected && "bg-primary/5",
                onTechnicianSelect && "cursor-pointer hover:bg-muted/50"
              )}
              key={technician.id}
              onClick={() => onTechnicianSelect?.(technician.id)}
              style={{ height: rowHeight, minHeight: rowHeight }}
            >
              {/* Header section matching time grid header */}
              <div className="flex h-10 shrink-0 items-center border-b bg-muted/30 px-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-[10px]">
                    {technician.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <h4 className="truncate font-semibold text-sm">
                    {technician.name}
                  </h4>
                  <div
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      technicianStatusColors[technician.status]
                    )}
                    title={technician.status}
                  />
                </div>
              </div>

              {/* Content section matching time grid */}
              <div className="flex flex-1 items-center px-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-muted-foreground">
                    {technician.role}
                  </p>
                  {jobCount > 0 && (
                    <div className="mt-1">
                      <Badge className="text-[10px]" variant="outline">
                        {jobCount} {jobCount === 1 ? "job" : "jobs"}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


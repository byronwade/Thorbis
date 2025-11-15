"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { AlertCircle, ChevronRight, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Job } from "./schedule-types";

function UnassignedJobCard({ job }: { job: Job }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: job.id,
      data: { job },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const startTime =
    job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
  const endTime =
    job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
  const duration = Math.round(
    (endTime.getTime() - startTime.getTime()) / (1000 * 60)
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative cursor-grab rounded-lg border-2 border-red-300 border-dashed bg-red-50 p-3 shadow-sm transition-all hover:border-red-400 hover:shadow-md active:cursor-grabbing dark:border-red-800 dark:bg-red-950",
        isDragging && "opacity-50"
      )}
    >
      {/* Drag indicator */}
      <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex size-5 items-center justify-center rounded bg-red-500 text-white">
          <ChevronRight className="size-3" />
        </div>
      </div>

      <div className="space-y-2">
        {/* Title */}
        <div className="pr-6">
          <p className="font-semibold text-red-900 text-sm dark:text-red-100">
            {job.title}
          </p>
          <p className="text-red-700 text-xs dark:text-red-300">
            {job.customer.name}
          </p>
        </div>

        {/* Time */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-red-800 dark:text-red-200">
            <Clock className="size-3.5" />
            <span className="font-medium font-mono">
              {format(startTime, "h:mm a")}
            </span>
          </div>
          <Badge className="text-[10px]" variant="secondary">
            {duration} min
          </Badge>
        </div>

        {/* Location */}
        {job.location.address.street && (
          <div className="flex items-start gap-1.5 text-red-700 text-xs dark:text-red-300">
            <MapPin className="mt-0.5 size-3.5 shrink-0" />
            <span className="line-clamp-1">{job.location.address.street}</span>
          </div>
        )}

        {/* Priority indicator */}
        {job.priority === "urgent" && (
          <Badge className="text-[9px]" variant="destructive">
            URGENT
          </Badge>
        )}
      </div>
    </div>
  );
}

export function UnassignedPanel({
  unassignedJobs,
  isOpen,
  onToggle,
}: {
  unassignedJobs: Job[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <Collapsible className="h-full" onOpenChange={onToggle} open={isOpen}>
      <div className="flex h-full flex-col border-r bg-card">
        {isOpen ? (
          // Expanded: Full panel with flex layout
          <>
            <CollapsibleTrigger asChild>
              <Button
                className="h-auto w-full shrink-0 justify-between px-4 py-3 hover:bg-muted"
                variant="ghost"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 text-red-500" />
                  <span className="font-semibold text-sm">Unscheduled</span>
                  <Badge className="text-[10px]" variant="destructive">
                    {unassignedJobs.length}
                  </Badge>
                </div>
                <ChevronRight className="size-4 rotate-90 transition-transform" />
              </Button>
            </CollapsibleTrigger>

            <div className="flex-1 overflow-y-auto" style={{ height: 0 }}>
              <div className="space-y-2 p-3">
                {unassignedJobs.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <p className="text-muted-foreground text-xs">
                      All jobs scheduled
                    </p>
                  </div>
                ) : (
                  unassignedJobs.map((job) => (
                    <UnassignedJobCard job={job} key={job.id} />
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          // Collapsed: Vertical text in sliver
          <button
            className="flex h-full w-12 items-center justify-center bg-red-50 transition-colors hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900"
            onClick={onToggle}
          >
            <div className="flex rotate-180 items-center gap-3 [writing-mode:vertical-rl]">
              <span className="font-bold text-red-700 text-sm tracking-wider dark:text-red-300">
                UNSCHEDULED
              </span>
              <Badge
                className="px-2 py-0.5 font-bold text-[10px]"
                variant="destructive"
              >
                {unassignedJobs.length}
              </Badge>
            </div>
          </button>
        )}
      </div>
    </Collapsible>
  );
}

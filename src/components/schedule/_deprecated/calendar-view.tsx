"use client";

import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mockTechnicians } from "./schedule-types";

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7 AM to 7 PM

const statusColors = {
  scheduled: "bg-primary/90 border-primary text-white",
  "in-progress": "bg-warning/90 border-warning text-white",
  completed: "bg-success/90 border-success text-white",
  cancelled: "bg-destructive/90 border-destructive text-white",
};

export function CalendarView() {
  const [currentDate] = useState(new Date());

  // Get all jobs with technician info
  const allJobs = mockTechnicians.flatMap((tech) =>
    tech.jobs.map((job) => ({
      ...job,
      technician: tech,
    }))
  );

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between border-b bg-background px-6 py-4">
        <div>
          <h2 className="font-semibold text-xl">{formatDate(currentDate)}</h2>
          <p className="text-muted-foreground text-sm">
            {allJobs.length} jobs scheduled today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <ChevronLeft className="size-4" />
          </Button>
          <Button size="sm" variant="outline">
            Today
          </Button>
          <Button size="sm" variant="outline">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex min-h-0 flex-1">
        {/* Time Column */}
        <div className="w-20 shrink-0 border-r bg-muted/30">
          <div className="h-16" /> {/* Spacer for header */}
          {HOURS.map((hour) => (
            <div
              className="flex h-24 items-start justify-end border-t px-3 py-2 text-muted-foreground text-xs"
              key={hour}
            >
              {hour === 12
                ? "12 PM"
                : hour > 12
                  ? `${hour - 12} PM`
                  : `${hour} AM`}
            </div>
          ))}
        </div>

        {/* Calendar Body - Scrollable */}
        <div className="min-w-0 flex-1 overflow-auto">
          <div className="grid grid-cols-1 gap-0">
            {/* Technician Columns Header */}
            <div className="sticky top-0 z-10 grid h-16 grid-cols-4 gap-0 border-b bg-background">
              {mockTechnicians.slice(0, 4).map((tech) => (
                <div
                  className="flex flex-col items-center justify-center border-r px-4 py-2"
                  key={tech.id}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                      {tech.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm leading-tight">
                        {tech.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {tech.jobs.length} jobs
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="relative grid grid-cols-4">
              {/* Grid Lines */}
              {HOURS.map((hour, _hourIndex) => (
                <div className="col-span-4 flex h-24 border-t" key={hour}>
                  {mockTechnicians.slice(0, 4).map((_, techIndex) => (
                    <div className="flex-1 border-r" key={techIndex} />
                  ))}
                </div>
              ))}

              {/* Jobs Overlay */}
              {mockTechnicians.slice(0, 4).map((tech, techIndex) => (
                <div
                  className="absolute inset-0"
                  key={tech.id}
                  style={{
                    left: `${(techIndex / 4) * 100}%`,
                    width: `${100 / 4}%`,
                    pointerEvents: "none",
                  }}
                >
                  {tech.jobs.map((job) => {
                    const [startHour, startMin] = job.startTime
                      .split(":")
                      .map(Number);
                    const [endHour, endMin] = job.endTime
                      .split(":")
                      .map(Number);

                    const startMinutes = (startHour - 7) * 60 + startMin;
                    const endMinutes = (endHour - 7) * 60 + endMin;
                    const duration = endMinutes - startMinutes;

                    const top = (startMinutes / 60) * 96; // 96px per hour (24px * 4 quarters)
                    const height = (duration / 60) * 96;

                    return (
                      <div
                        className={cn(
                          "absolute right-1 left-1 overflow-hidden rounded-md border-l-4 p-2 shadow-sm",
                          "pointer-events-auto cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md",
                          statusColors[job.status]
                        )}
                        key={job.id}
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                        }}
                      >
                        <div className="flex h-full flex-col gap-1">
                          <h5 className="line-clamp-2 font-semibold text-xs leading-tight">
                            {job.title}
                          </h5>
                          <p className="line-clamp-1 text-[10px] opacity-90">
                            {job.customer}
                          </p>
                          <div className="mt-auto flex items-center gap-1 text-[10px] opacity-90">
                            <Clock className="size-3" />
                            <span>
                              {job.startTime} - {job.endTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

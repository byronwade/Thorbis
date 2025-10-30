"use client";

/**
 * Editable Job Process Indicator - Client Component
 *
 * Allows inline editing of job dates and status
 */

import { Calendar, Check, Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type JobStatus =
  | "quoted"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

type JobProcessIndicatorEditableProps = {
  currentStatus: JobStatus;
  className?: string;
  dates?: {
    quoted?: Date | null;
    scheduled?: Date | null;
    inProgress?: Date | null;
    completed?: Date | null;
  };
  jobId: string;
  onDateChange?: (dateKey: string, newDate: Date) => Promise<void>;
  onStatusChange?: (newStatus: JobStatus) => Promise<void>;
};

const statusSteps = [
  { key: "quoted", label: "Quoted", dateKey: "quoted" as const },
  { key: "scheduled", label: "Scheduled", dateKey: "scheduled" as const },
  { key: "in_progress", label: "In Progress", dateKey: "inProgress" as const },
  { key: "completed", label: "Completed", dateKey: "completed" as const },
] as const;

function formatStepDate(date: Date | null | undefined): string {
  if (!date) {
    return "Not set";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatStepTime(date: Date | null | undefined): string {
  if (!date) {
    return "";
  }
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function getStatusIndex(status: JobStatus): number {
  if (status === "cancelled") {
    return -1;
  }
  return statusSteps.findIndex((step) => step.key === status);
}

export function JobProcessIndicatorEditable({
  currentStatus,
  className,
  dates,
  jobId,
  onDateChange,
  onStatusChange,
}: JobProcessIndicatorEditableProps) {
  const currentIndex = getStatusIndex(currentStatus);
  const isCancelled = currentStatus === "cancelled";
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");

  async function handleDateSave(dateKey: string) {
    if (selectedDate && onDateChange) {
      // Combine date and time
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const finalDate = new Date(selectedDate);
      if (hours !== undefined && minutes !== undefined) {
        finalDate.setHours(hours, minutes);
      }

      await onDateChange(dateKey, finalDate);
      setEditingDate(null);
      setSelectedDate(undefined);
      setSelectedTime("");
    }
  }

  function openDateEditor(dateKey: string, currentDate?: Date | null) {
    setEditingDate(dateKey);
    setSelectedDate(currentDate || undefined);
    if (currentDate) {
      const hours = currentDate.getHours().toString().padStart(2, "0");
      const minutes = currentDate.getMinutes().toString().padStart(2, "0");
      setSelectedTime(`${hours}:${minutes}`);
    } else {
      setSelectedTime("09:00");
    }
  }

  if (isCancelled) {
    return (
      <div
        className={cn(
          "rounded-lg border border-destructive bg-destructive/10 p-4",
          className
        )}
      >
        <div className="flex items-center justify-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-destructive/20">
            <div className="size-2 rounded-full bg-destructive" />
          </div>
          <span className="font-medium text-destructive">Job Cancelled</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {statusSteps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const currentDate = dates?.[step.dateKey];

        return (
          <div className="flex flex-1 items-center gap-1" key={step.key}>
            {/* Step */}
            <div className="flex flex-1 flex-col items-center gap-1">
              {/* Step Circle */}
              <button
                className={cn(
                  "relative z-10 flex size-8 items-center justify-center rounded-full border transition-all hover:scale-110",
                  isCompleted || isCurrent ? "border-primary" : "border-muted"
                )}
                onClick={() => onStatusChange?.(step.key as JobStatus)}
                type="button"
              >
                {isCompleted ? (
                  <div className="flex size-full items-center justify-center rounded-full bg-primary">
                    <Check
                      className="size-4 text-primary-foreground"
                      strokeWidth={2.5}
                    />
                  </div>
                ) : isCurrent ? (
                  <div className="relative flex size-full items-center justify-center rounded-full bg-primary">
                    <div className="size-2 animate-pulse rounded-full bg-primary-foreground" />
                  </div>
                ) : (
                  <div className="size-2 rounded-full bg-muted" />
                )}
              </button>

              {/* Step Label and Date */}
              <div className="text-center">
                <p
                  className={cn(
                    "font-medium text-xs",
                    isCurrent
                      ? "text-foreground"
                      : isCompleted
                        ? "text-muted-foreground"
                        : "text-muted-foreground/60"
                  )}
                >
                  {step.label}
                </p>

                {/* Editable Date */}
                <Popover
                  onOpenChange={(open) => {
                    if (!open) {
                      setEditingDate(null);
                    }
                  }}
                  open={editingDate === step.dateKey}
                >
                  <PopoverTrigger asChild>
                    <Button
                      className={cn(
                        "h-auto p-1 text-[10px]",
                        !currentDate && "text-muted-foreground/40"
                      )}
                      onClick={() => openDateEditor(step.dateKey, currentDate)}
                      size="sm"
                      variant="ghost"
                    >
                      <Calendar className="mr-1 size-3" />
                      {formatStepDate(currentDate)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs">Date</Label>
                        <CalendarComponent
                          initialFocus
                          mode="single"
                          onSelect={setSelectedDate}
                          selected={selectedDate}
                        />
                      </div>
                      <div>
                        <Label className="text-xs" htmlFor="time">
                          Time
                        </Label>
                        <div className="flex items-center gap-2">
                          <Clock className="size-4 text-muted-foreground" />
                          <Input
                            id="time"
                            onChange={(e) => setSelectedTime(e.target.value)}
                            type="time"
                            value={selectedTime}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          onClick={() => handleDateSave(step.dateKey)}
                          size="sm"
                        >
                          Save
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={() => setEditingDate(null)}
                          size="sm"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {currentDate ? (
                  <p className="text-[10px] text-muted-foreground/50">
                    {formatStepTime(currentDate)}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Connecting Line */}
            {index < statusSteps.length - 1 ? (
              <div
                className={cn(
                  "h-[1px] flex-1 transition-all",
                  isCompleted ? "bg-primary" : "bg-muted"
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

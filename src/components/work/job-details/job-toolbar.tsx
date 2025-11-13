"use client";

/**
 * Job Details Toolbar - Client Component
 *
 * Displays job information and edit mode controls.
 * Back button and layout controls have been moved to the sidebar.
 */

import { Edit3, Lock, Save, Unlock, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ============================================================================
// Props Types
// ============================================================================

interface JobToolbarProps {
  jobNumber: string;
  jobTitle: string;
  status: string;
  jobType: string;
  isEditMode: boolean;
  onToggleEditMode: (value: boolean) => void;
}

// ============================================================================
// Job Toolbar Component
// ============================================================================

export function JobToolbar({
  jobNumber,
  jobTitle,
  status,
  jobType,
  isEditMode,
  onToggleEditMode,
}: JobToolbarProps) {
  // Toggle edit mode
  function handleToggleEditMode() {
    onToggleEditMode(!isEditMode);
  }

  return (
    <div className="space-y-4">
      {/* Main Toolbar */}
      <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Side: Job Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-2xl tracking-tight">{jobNumber}</h1>
            <Badge className="capitalize" variant="outline">
              {jobType}
            </Badge>
            <Badge
              variant={
                status === "in_progress"
                  ? "default"
                  : status === "completed"
                    ? "secondary"
                    : "outline"
              }
            >
              {status.replace("_", " ")}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Lock className="ml-2 size-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Job number cannot be changed</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-muted-foreground">{jobTitle}</p>
        </div>

        {/* Right Side: Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Edit/Save Button */}
          <Button
            onClick={handleToggleEditMode}
            size="sm"
            variant={isEditMode ? "default" : "outline"}
          >
            {isEditMode ? (
              <>
                <Save className="mr-2 size-4" />
                Save
              </>
            ) : (
              <>
                <Edit3 className="mr-2 size-4" />
                Edit
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Edit Mode Banner */}
      {isEditMode ? (
        <div className="fade-in slide-in-from-top-2 animate-in rounded-lg border-2 border-primary bg-primary/5 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Unlock className="size-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">Edit Mode Active</h3>
                <p className="text-muted-foreground text-xs">You can now:</p>
                <ul className="space-y-0.5 text-muted-foreground text-xs">
                  <li className="flex items-center gap-1.5">
                    <div className="size-1 rounded-full bg-primary" />
                    Drag widgets to reposition them
                  </li>
                  <li className="flex items-center gap-1.5">
                    <div className="size-1 rounded-full bg-primary" />
                    Add or remove widgets
                  </li>
                  <li className="flex items-center gap-1.5">
                    <div className="size-1 rounded-full bg-primary" />
                    Resize widgets (drag corners)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <div className="size-1 rounded-full bg-primary" />
                    Edit job data inline (customer, amounts, etc.)
                  </li>
                </ul>
                <div className="mt-2 flex items-center gap-2 rounded-md bg-warning/10 p-2 text-xs">
                  <Lock className="size-3.5 text-warning" />
                  <span className="text-warning dark:text-warning">
                    Job number and some fields are locked and cannot be changed
                  </span>
                </div>
              </div>
            </div>
            <Button
              className="shrink-0"
              onClick={handleToggleEditMode}
              size="sm"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

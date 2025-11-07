/**
 * Job Core Actions - Dispatch, Arrive, Close
 * Primary workflow actions for job management
 */

"use client";

import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  Edit2,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { completeJob, startJob, updateJobStatus } from "@/actions/jobs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type JobQuickActionsProps = {
  jobId: string;
  currentStatus: string;
  scheduledStart?: string | null;
  actualStart?: string | null;
  actualEnd?: string | null;
};

export function JobQuickActions({
  jobId,
  currentStatus,
  scheduledStart,
  actualStart,
  actualEnd,
}: JobQuickActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editType, setEditType] = useState<
    "dispatch" | "arrive" | "close" | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Dispatch: Set job to scheduled (ready for technician)
  const handleDispatch = async () => {
    setIsLoading("dispatch");
    try {
      const result = await updateJobStatus(jobId, "scheduled");
      if (result.success) {
        toast.success("Job dispatched to technician");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to dispatch job");
      }
    } catch {
      toast.error("Failed to dispatch job");
    } finally {
      setIsLoading(null);
    }
  };

  // Arrive: Technician arrives at job site (starts job)
  const handleArrive = async () => {
    setIsLoading("arrive");
    try {
      const result = await startJob(jobId);
      if (result.success) {
        toast.success("Job started - technician arrived");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to mark job as arrived");
      }
    } catch {
      toast.error("Failed to mark job as arrived");
    } finally {
      setIsLoading(null);
    }
  };

  // Close: Complete the job
  const handleClose = async () => {
    setIsLoading("close");
    try {
      const result = await completeJob(jobId);
      if (result.success) {
        toast.success("Job closed successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to close job");
      }
    } catch {
      toast.error("Failed to close job");
    } finally {
      setIsLoading(null);
    }
  };

  // Determine which actions are available based on status
  const canDispatch = currentStatus === "quoted";
  const canArrive = currentStatus === "scheduled";
  const canClose = currentStatus === "in_progress";
  const isCompleted = currentStatus === "completed";
  const isCancelled = currentStatus === "cancelled";

  // Format timestamps for display
  const formatTime = (timestamp: string | null | undefined) => {
    if (!timestamp) {
      return "Not set";
    }
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Get dialog title
  const getDialogTitle = () => {
    if (editType === "dispatch") {
      return "Scheduled";
    }
    if (editType === "arrive") {
      return "Arrival";
    }
    return "Completion";
  };

  // Initialize date and time when dialog opens
  const handleDialogOpen = (type: "dispatch" | "arrive" | "close") => {
    setEditType(type);

    const timestamp =
      type === "dispatch"
        ? scheduledStart
        : type === "arrive"
          ? actualStart
          : actualEnd;

    if (timestamp) {
      const date = new Date(timestamp);
      setSelectedDate(date);
      setSelectedTime(format(date, "HH:mm"));
    } else {
      const now = new Date();
      setSelectedDate(now);
      setSelectedTime(format(now, "HH:mm"));
    }

    setIsEditDialogOpen(true);
  };

  // Handle saving the timestamp
  const handleSaveTimestamp = () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    // Combine date and time
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const combinedDateTime = new Date(selectedDate);
    combinedDateTime.setHours(hours, minutes, 0, 0);

    // TODO: Implement the actual save logic with server action
    toast.info(`Date saved: ${format(combinedDateTime, "PPP p")}`);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Primary Action Button */}
      {!(isCompleted || isCancelled) &&
        (canDispatch || canArrive || canClose) && (
          <div className="flex justify-end">
            {canDispatch && (
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading === "dispatch"}
                onClick={handleDispatch}
              >
                <MapPin className="mr-2 h-4 w-4" />
                {isLoading === "dispatch" ? "Dispatching..." : "Dispatch Job"}
              </Button>
            )}
            {canArrive && (
              <Button
                className="bg-green-600 hover:bg-green-700"
                disabled={isLoading === "arrive"}
                onClick={handleArrive}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {isLoading === "arrive" ? "Arriving..." : "Arrive at Site"}
              </Button>
            )}
            {canClose && (
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                disabled={isLoading === "close"}
                onClick={handleClose}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {isLoading === "close" ? "Closing..." : "Complete Job"}
              </Button>
            )}
          </div>
        )}

      {/* Editable Timestamps */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <button
          className="flex items-center justify-between rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent"
          onClick={() => handleDialogOpen("dispatch")}
          type="button"
        >
          <div className="flex-1">
            <p className="text-muted-foreground text-xs">Scheduled</p>
            <p className="mt-0.5 font-medium text-sm">
              {formatTime(scheduledStart)}
            </p>
          </div>
          <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
        </button>

        <button
          className="flex items-center justify-between rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent"
          onClick={() => handleDialogOpen("arrive")}
          type="button"
        >
          <div className="flex-1">
            <p className="text-muted-foreground text-xs">Arrived</p>
            <p className="mt-0.5 font-medium text-sm">
              {formatTime(actualStart)}
            </p>
          </div>
          <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
        </button>

        <button
          className="flex items-center justify-between rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent"
          onClick={() => handleDialogOpen("close")}
          type="button"
        >
          <div className="flex-1">
            <p className="text-muted-foreground text-xs">Completed</p>
            <p className="mt-0.5 font-medium text-sm">
              {formatTime(actualEnd)}
            </p>
          </div>
          <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Edit Time Dialog */}
      <Dialog onOpenChange={setIsEditDialogOpen} open={isEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {getDialogTitle()} Time</DialogTitle>
            <DialogDescription>
              Adjust the timestamp for this job action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                    variant={"outline"}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    initialFocus
                    mode="single"
                    onSelect={setSelectedDate}
                    selected={selectedDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                onChange={(e) => setSelectedTime(e.target.value)}
                type="time"
                value={selectedTime}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setIsEditDialogOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveTimestamp}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Job Core Actions - Arrive, Close
 * Primary workflow actions for job management
 */

"use client";

import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { completeJob, startJob } from "@/actions/jobs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type JobQuickActionsProps = {
  jobId: string;
  currentStatus: string;
};

export function JobQuickActions({
  jobId,
  currentStatus,
}: JobQuickActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);

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
  const canArrive = currentStatus === "scheduled";
  const canClose = currentStatus === "in_progress";
  const isCompleted = currentStatus === "completed";
  const isCancelled = currentStatus === "cancelled";

  return (
    <div className="space-y-3">
      {/* Primary Action Button */}
      {!(isCompleted || isCancelled) && (canArrive || canClose) && (
        <div className="flex justify-end">
          {canArrive && (
            <Button
              className="bg-success hover:bg-success"
              disabled={isLoading === "arrive"}
              onClick={handleArrive}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isLoading === "arrive" ? "Arriving..." : "Arrive at Site"}
            </Button>
          )}
          {canClose && (
            <Button
              className="bg-accent hover:bg-accent"
              disabled={isLoading === "close"}
              onClick={handleClose}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isLoading === "close" ? "Closing..." : "Complete Job"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

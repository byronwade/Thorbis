"use client";

/**
 * Job Detail Toolbar - AppToolbar Actions
 *
 * Displays in AppToolbar for job detail pages:
 * - Quick actions (New Invoice, New Estimate, Clone Job, Archive Job)
 */

import { Archive, BarChart3, Copy, FileText, Receipt } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { archiveJob } from "@/actions/jobs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { JobStatisticsSheet } from "./job-statistics-sheet";

type JobDetailToolbarProps = {
  job?: any;
  metrics?: any;
  timeEntries?: any[];
  teamAssignments?: any[];
  invoices?: any[];
  payments?: any[];
  jobMaterials?: any[];
};

export function JobDetailToolbar({
  job,
  metrics,
  timeEntries = [],
  teamAssignments = [],
  invoices = [],
  payments = [],
  jobMaterials = [],
}: JobDetailToolbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const jobId = pathname.split("/").pop();
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isStatisticsOpen, setIsStatisticsOpen] = useState(false);

  const handleArchive = async () => {
    if (!jobId) {
      toast.error("Job ID not found");
      return;
    }

    setIsArchiving(true);
    try {
      const result = await archiveJob(jobId);
      if (result.success) {
        toast.success("Job archived successfully");
        setIsArchiveDialogOpen(false);
        router.push("/dashboard/work");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to archive job");
      }
    } catch (_error) {
      toast.error("Failed to archive job");
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Statistics Button */}
        {job && metrics && (
          <Button
            onClick={() => setIsStatisticsOpen(true)}
            size="sm"
            variant="outline"
          >
            <BarChart3 className="mr-2 size-4" />
            Statistics
          </Button>
        )}
        {/* Quick Actions */}
        <Button asChild size="sm" variant="outline">
          <a href={`/dashboard/work/invoices/new?jobId=${jobId}`}>
            <Receipt className="mr-2 size-4" />
            Create Invoice
          </a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={`/dashboard/work/estimates/new?jobId=${jobId}`}>
            <FileText className="mr-2 size-4" />
            Create Estimate
          </a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={`/dashboard/work/new?cloneFrom=${jobId}`}>
            <Copy className="mr-2 size-4" />
            Clone Job
          </a>
        </Button>
        <Button
          onClick={() => setIsArchiveDialogOpen(true)}
          size="sm"
          variant="outline"
        >
          <Archive className="mr-2 size-4" />
          Archive Job
        </Button>
      </div>

      {/* Archive Confirmation Dialog */}
      <Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive this job? Archived jobs can be
              restored within 90 days. Completed or invoiced jobs cannot be
              archived.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isArchiving}
              onClick={() => setIsArchiveDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isArchiving}
              onClick={handleArchive}
              variant="destructive"
            >
              {isArchiving ? "Archiving..." : "Archive Job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Statistics Sheet */}
      {job && metrics && (
        <JobStatisticsSheet
          invoices={invoices}
          job={job}
          jobMaterials={jobMaterials}
          metrics={metrics}
          onOpenChange={setIsStatisticsOpen}
          open={isStatisticsOpen}
          payments={payments}
          teamAssignments={teamAssignments}
          timeEntries={timeEntries}
        />
      )}
    </>
  );
}

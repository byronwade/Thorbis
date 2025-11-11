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
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
      <div className="flex items-center gap-1.5">
        {/* Analytics Section */}
        {job && metrics && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/30"
                    onClick={() => setIsStatisticsOpen(true)}
                    size="sm"
                    variant="outline"
                  >
                    <BarChart3 className="size-4 text-primary" />
                    <span className="font-medium">Statistics</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View job analytics and metrics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Separator className="h-6" orientation="vertical" />
          </>
        )}

        {/* Quick Actions Group */}
        <div className="flex items-center gap-1.5 rounded-lg border bg-muted/30 p-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  className="gap-2 hover:bg-background"
                  size="sm"
                  variant="ghost"
                >
                  <a href={`/dashboard/work/invoices/new?jobId=${jobId}`}>
                    <Receipt className="size-4" />
                    <span className="hidden sm:inline">Invoice</span>
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create invoice from this job</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  className="gap-2 hover:bg-background"
                  size="sm"
                  variant="ghost"
                >
                  <a href={`/dashboard/work/estimates/new?jobId=${jobId}`}>
                    <FileText className="size-4" />
                    <span className="hidden sm:inline">Estimate</span>
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create estimate from this job</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  className="gap-2 hover:bg-background"
                  size="sm"
                  variant="ghost"
                >
                  <a href={`/dashboard/work/new?cloneFrom=${jobId}`}>
                    <Copy className="size-4" />
                    <span className="hidden sm:inline">Clone</span>
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Duplicate this job</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Archive Action */}
        <Separator className="h-6" orientation="vertical" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="gap-2 border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                onClick={() => setIsArchiveDialogOpen(true)}
                size="sm"
                variant="outline"
              >
                <Archive className="size-4" />
                <span className="hidden sm:inline">Archive</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Archive this job</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Ellipsis Menu - Export/Import & More */}
        <Separator className="h-6" orientation="vertical" />
        <ImportExportDropdown dataType="jobs" />
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

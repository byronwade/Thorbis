"use client";

/**
 * Job Detail Toolbar - AppToolbar Actions
 *
 * Displays in AppToolbar for job detail pages:
 * - Quick actions (Invoice, Estimate, Clone)
 * - Ellipsis menu with Statistics, Export, Archive
 *
 * Design: Clean, compact, no button groups, outline variant
 */

import {
  Archive,
  BarChart3,
  Copy,
  Download,
  FileText,
  MoreVertical,
  Printer,
  Receipt,
  Share2,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      <div className="flex items-center gap-2">
        {/* Quick Actions - Individual Buttons with consistent styling */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size="sm" variant="outline">
                <a href={`/dashboard/work/invoices/new?jobId=${jobId}`}>
                  <Receipt />
                  <span className="hidden md:inline">Invoice</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create invoice from this job</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size="sm" variant="outline">
                <a href={`/dashboard/work/estimates/new?jobId=${jobId}`}>
                  <FileText />
                  <span className="hidden md:inline">Estimate</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create estimate from this job</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size="sm" variant="outline">
                <a href={`/dashboard/work/new?cloneFrom=${jobId}`}>
                  <Copy />
                  <span className="hidden lg:inline">Clone</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Duplicate this job</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Ellipsis Menu - Includes Statistics + Archive */}
        <Separator className="h-8" orientation="vertical" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon-sm" variant="outline">
              <MoreVertical />
              <span className="sr-only">More actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Statistics - Only if available */}
            {job && metrics && (
              <>
                <DropdownMenuItem onClick={() => setIsStatisticsOpen(true)}>
                  <BarChart3 className="mr-2 size-3.5" />
                  View Statistics
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            {/* Export/Print/Share */}
            <DropdownMenuItem>
              <Download className="mr-2 size-3.5" />
              Export to CSV
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Printer className="mr-2 size-3.5" />
              Print Job Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="mr-2 size-3.5" />
              Share Job Link
            </DropdownMenuItem>

            {/* Destructive Actions */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setIsArchiveDialogOpen(true)}
            >
              <Archive className="mr-2 size-3.5" />
              Archive Job
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

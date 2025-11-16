"use client";

/**
 * Maintenance Plan Detail Toolbar Actions - Client Component
 *
 * Provides maintenance plan-specific toolbar actions:
 * - View schedule
 * - Copy plan
 * - Archive plan
 *
 * Design: Clean, compact, outline buttons with consistent grouping
 */

import { Archive, Calendar, Copy } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { archiveMaintenancePlan } from "@/actions/maintenance-plans";
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

export function MaintenancePlanDetailToolbarActions() {
	const pathname = usePathname();
	const router = useRouter();
	const { toast } = useToast();
	const planId = pathname?.split("/").pop();
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);

	const handleArchive = async () => {
		if (!planId) {
			toast.error("Maintenance plan ID not found");
			return;
		}

		setIsArchiving(true);
		try {
			const result = await archiveMaintenancePlan(planId);
			if (result.success) {
				toast.success("Maintenance plan archived successfully");
				setIsArchiveDialogOpen(false);
				router.push("/dashboard/work/maintenance-plans");
				router.refresh();
			} else {
				toast.error(result.error || "Failed to archive maintenance plan");
			}
		} catch {
			toast.error("Failed to archive maintenance plan");
		} finally {
			setIsArchiving(false);
		}
	};

	return (
		<>
			<div className="flex items-center gap-1.5">
				{/* Quick Actions */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								asChild
								className="h-8 gap-1.5"
								size="sm"
								variant="outline"
							>
								<a href={`/dashboard/schedule?planId=${planId}`}>
									<Calendar className="size-3.5" />
									<span className="hidden md:inline">Schedule</span>
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>View plan schedule</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								asChild
								className="h-8 gap-1.5"
								size="sm"
								variant="outline"
							>
								<a
									href={`/dashboard/work/maintenance-plans/new?cloneFrom=${planId}`}
								>
									<Copy className="size-3.5" />
									<span className="hidden lg:inline">Copy</span>
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Duplicate plan</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<Separator className="h-6" orientation="vertical" />
				<ImportExportDropdown dataType="maintenance-plans" />

				<Separator className="h-6" orientation="vertical" />
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="h-8 gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
								onClick={() => setIsArchiveDialogOpen(true)}
								size="sm"
								variant="outline"
							>
								<Archive className="size-3.5" />
								<span className="hidden lg:inline">Archive</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Archive maintenance plan</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Archive Maintenance Plan</DialogTitle>
						<DialogDescription>
							Are you sure you want to archive this maintenance plan? Archived
							plans can be restored within 90 days.
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
							{isArchiving ? "Archiving..." : "Archive Plan"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

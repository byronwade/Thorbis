"use client";

/**
 * Equipment Detail Toolbar Actions - Client Component
 *
 * Provides equipment-specific toolbar actions:
 * - Create service job
 * - View maintenance log
 * - Duplicate equipment
 * - Archive equipment
 *
 * Design: Clean, compact, outline buttons with consistent grouping
 */

import { Archive, ClipboardList, Copy, Wrench } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { archiveEquipment } from "@/actions/equipment";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

export function EquipmentDetailToolbarActions() {
	const pathname = usePathname();
	const router = useRouter();
	const { toast } = useToast();
	const equipmentId = pathname?.split("/").pop();
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);

	const handleArchive = async () => {
		if (!equipmentId) {
			toast.error("Equipment ID not found");
			return;
		}

		setIsArchiving(true);
		try {
			const result = await archiveEquipment(equipmentId);
			if (result.success) {
				toast.success("Equipment archived successfully");
				setIsArchiveDialogOpen(false);
				router.push("/dashboard/work/equipment");
				router.refresh();
			} else {
				toast.error(result.error || "Failed to archive equipment");
			}
		} catch {
			toast.error("Failed to archive equipment");
		} finally {
			setIsArchiving(false);
		}
	};

	return (
		<>
			<div className="flex items-center gap-1.5">
				{/* Quick Actions - Standardized styling */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button asChild size="sm" variant="outline">
								<a href={`/dashboard/work/new?equipmentId=${equipmentId}`}>
									<Wrench />
									<span className="hidden md:inline">Service Job</span>
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Create service job for this equipment</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button asChild size="sm" variant="outline">
								<a href={`/dashboard/work/equipment/${equipmentId}?tab=maintenance`}>
									<ClipboardList />
									<span className="hidden lg:inline">Maintenance</span>
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>View maintenance log</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button asChild size="sm" variant="outline">
								<a href={`/dashboard/work/equipment/new?cloneFrom=${equipmentId}`}>
									<Copy />
									<span className="hidden lg:inline">Copy</span>
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Duplicate equipment record</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<Separator className="h-8" orientation="vertical" />
				<ImportExportDropdown dataType="equipment" />

				<Separator className="h-8" orientation="vertical" />
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
							<p>Archive equipment</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Archive Equipment</DialogTitle>
						<DialogDescription>
							Are you sure you want to archive this equipment? Archived records can be restored within 90 days.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button disabled={isArchiving} onClick={() => setIsArchiveDialogOpen(false)} variant="outline">
							Cancel
						</Button>
						<Button disabled={isArchiving} onClick={handleArchive} variant="destructive">
							{isArchiving ? "Archiving..." : "Archive Equipment"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

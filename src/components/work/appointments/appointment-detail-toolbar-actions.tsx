"use client";

/**
 * Appointment Detail Toolbar Actions - Client Component
 *
 * Provides appointment-specific toolbar actions:
 * - Link to Job (assign/reassign)
 * - Reschedule
 * - Copy
 * - Archive
 * - Ellipsis menu with complete/cancel/archive
 *
 * Design: Clean, compact, outline buttons
 */

import { Archive, Briefcase, Calendar, Copy } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { archiveAppointment } from "@/actions/appointments";
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

export function AppointmentDetailToolbarActions() {
	const pathname = usePathname();
	const router = useRouter();
	const { toast } = useToast();
	const appointmentId = pathname?.split("/").pop();
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);

	const handleArchive = async () => {
		if (!appointmentId) {
			toast.error("Appointment ID not found");
			return;
		}

		setIsArchiving(true);
		try {
			const result = await archiveAppointment(appointmentId);
			if (result.success) {
				toast.success("Appointment archived successfully");
				setIsArchiveDialogOpen(false);
				router.push("/dashboard/work/appointments");
				// Server Action handles revalidation automatically
			} else {
				toast.error(result.error || "Failed to archive appointment");
			}
		} catch (_error) {
			toast.error("Failed to archive appointment");
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
							<Button className="h-8 gap-1.5" size="sm" variant="outline">
								<Briefcase className="size-3.5" />
								<span className="hidden md:inline">Link to Job</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Assign to existing job</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button className="h-8 gap-1.5" size="sm" variant="outline">
								<Calendar className="size-3.5" />
								<span className="hidden lg:inline">Reschedule</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Reschedule appointment</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button asChild className="h-8 gap-1.5" size="sm" variant="outline">
								<a href={`/dashboard/work/appointments/new?cloneFrom=${appointmentId}`}>
									<Copy className="size-3.5" />
									<span className="hidden lg:inline">Copy</span>
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Duplicate appointment</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				{/* Archive Button */}
				<Separator className="h-6" orientation="vertical" />
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="border-destructive/40 text-destructive hover:bg-destructive/10 h-8 gap-1.5"
								onClick={() => setIsArchiveDialogOpen(true)}
								size="sm"
								variant="outline"
							>
								<Archive className="size-3.5" />
								<span className="hidden lg:inline">Archive</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Archive appointment</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				{/* Ellipsis Menu */}
				<Separator className="h-6" orientation="vertical" />
				<ImportExportDropdown dataType="schedule" />
			</div>

			{/* Archive Confirmation Dialog */}
			<Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Archive Appointment</DialogTitle>
						<DialogDescription>
							Are you sure you want to archive this appointment? Archived appointments can be
							restored within 90 days.
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
						<Button disabled={isArchiving} onClick={handleArchive} variant="destructive">
							{isArchiving ? "Archiving..." : "Archive Appointment"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

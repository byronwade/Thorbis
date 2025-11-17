"use client";

/**
 * Service Agreement Detail Toolbar Actions - Client Component
 *
 * Provides service agreement-specific toolbar actions:
 * - Download PDF
 * - View schedule
 * - Copy agreement
 * - Archive agreement
 *
 * Design: Clean, compact, outline buttons with consistent grouping
 */

import { Archive, Calendar, Copy, Download } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { archiveServiceAgreement } from "@/actions/service-agreements";
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

export function ServiceAgreementDetailToolbarActions() {
	const pathname = usePathname();
	const router = useRouter();
	const { toast } = useToast();
	const agreementId = pathname?.split("/").pop();
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);

	const handleArchive = async () => {
		if (!agreementId) {
			toast.error("Service agreement ID not found");
			return;
		}

		setIsArchiving(true);
		try {
			const result = await archiveServiceAgreement(agreementId);
			if (result.success) {
				toast.success("Service agreement archived successfully");
				setIsArchiveDialogOpen(false);
				router.push("/dashboard/work/service-agreements");
				// Server Action handles revalidation automatically
			} else {
				toast.error(result.error || "Failed to archive service agreement");
			}
		} catch {
			toast.error("Failed to archive service agreement");
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
								<Download className="size-3.5" />
								<span className="hidden md:inline">PDF</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Download PDF</p>
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
								<a href={`/dashboard/schedule?agreementId=${agreementId}`}>
									<Calendar className="size-3.5" />
									<span className="hidden lg:inline">Schedule</span>
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>View agreement schedule</p>
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
									href={`/dashboard/work/service-agreements/new?cloneFrom=${agreementId}`}
								>
									<Copy className="size-3.5" />
									<span className="hidden lg:inline">Copy</span>
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Duplicate agreement</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<Separator className="h-6" orientation="vertical" />
				<ImportExportDropdown dataType="service-agreements" />

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
							<p>Archive service agreement</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Archive Service Agreement</DialogTitle>
						<DialogDescription>
							Are you sure you want to archive this service agreement? Archived
							agreements can be restored within 90 days.
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
							{isArchiving ? "Archiving..." : "Archive Agreement"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

"use client";

/**
 * Estimate Detail Toolbar Actions - Client Component
 *
 * Provides estimate-specific toolbar actions for detail pages:
 * - Preview estimate
 * - Export PDF
 * - Send email
 * - Archive estimate
 *
 * Design: Clean, compact, outline buttons with consistent grouping
 */

import { Archive, Download, Eye, Mail } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { archiveEstimate } from "@/actions/estimates";
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

export function EstimateDetailToolbarActions() {
	const pathname = usePathname();
	const router = useRouter();
	const { toast } = useToast();
	const estimateId = pathname?.split("/").pop();
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);

	const handlePreview = () => {
		toast.info("Estimate preview coming soon");
	};

	const handleExportPDF = () => {
		toast.info("PDF export coming soon");
	};

	const handleSendEmail = () => {
		toast.info("Email delivery coming soon");
	};

	const handleArchive = async () => {
		if (!estimateId) {
			toast.error("Estimate ID not found");
			return;
		}

		setIsArchiving(true);
		try {
			const result = await archiveEstimate(estimateId);
			if (result.success) {
				toast.success("Estimate archived successfully");
				setIsArchiveDialogOpen(false);
				router.push("/dashboard/work/estimates");
				// Server Action handles revalidation automatically
			} else {
				toast.error(result.error || "Failed to archive estimate");
			}
		} catch {
			toast.error("Failed to archive estimate");
		} finally {
			setIsArchiving(false);
		}
	};

	return (
		<>
			<div className="flex items-center gap-1.5">
				{/* Quick Actions - Individual Buttons, NO Groups */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="h-8 gap-1.5"
								onClick={handlePreview}
								size="sm"
								variant="outline"
							>
								<Eye className="size-3.5" />
								<span className="hidden md:inline">Preview</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Preview estimate</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="h-8 gap-1.5"
								onClick={handleExportPDF}
								size="sm"
								variant="outline"
							>
								<Download className="size-3.5" />
								<span className="hidden lg:inline">PDF</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Export to PDF</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="h-8 gap-1.5"
								onClick={handleSendEmail}
								size="sm"
								variant="outline"
							>
								<Mail className="size-3.5" />
								<span className="hidden lg:inline">Send</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Send via email</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<Separator className="h-6" orientation="vertical" />
				<ImportExportDropdown dataType="estimates" />

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
							<p>Archive estimate</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Archive Estimate</DialogTitle>
						<DialogDescription>
							Are you sure you want to archive this estimate? Archived estimates
							can be restored within 90 days.
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
							{isArchiving ? "Archiving..." : "Archive Estimate"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

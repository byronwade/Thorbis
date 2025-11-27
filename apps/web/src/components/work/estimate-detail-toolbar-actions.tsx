"use client";

/**
 * Estimate Detail Toolbar Actions - Client Component
 *
 * Provides estimate-specific toolbar actions for detail pages:
 * - Status update dropdown (inline)
 * - Preview estimate
 * - Export PDF
 * - Send email
 * - Archive estimate
 *
 * Design: Clean, compact, outline buttons with consistent grouping
 */

import { Archive, Download, Eye, Send } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { archiveEstimate, updateEstimateStatus } from "@/actions/estimates";
import { sendEstimateEmail } from "@/actions/invoice-communications";
import { StatusUpdateDropdown } from "@/components/work/shared/quick-actions/status-update-dropdown";
import { ImportExportDropdownLazy as ImportExportDropdown } from "@/components/data/import-export-dropdown-lazy";
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

type EstimateDetailToolbarActionsProps = {
	/** Estimate data for status and actions */
	estimate?: {
		id: string;
		status?: string;
	};
};

export function EstimateDetailToolbarActions({
	estimate,
}: EstimateDetailToolbarActionsProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { toast } = useToast();
	const estimateId = estimate?.id || pathname?.split("/").pop() || "";
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);
	const [isSending, setIsSending] = useState(false);

	const handlePreview = () => {
		if (!estimateId) {
			toast.error("Estimate ID not found");
			return;
		}
		router.push(`/dashboard/work/estimates/${estimateId}/preview`);
	};

	const handleExportPDF = () => {
		if (!estimateId) {
			toast.error("Estimate ID not found");
			return;
		}
		window.open(`/api/estimates/${estimateId}/pdf`, "_blank");
	};

	const handleSendEmail = async () => {
		if (!estimateId) {
			toast.error("Estimate ID not found");
			return;
		}

		setIsSending(true);
		try {
			const result = await sendEstimateEmail(estimateId);
			if (result.success) {
				toast.success("Estimate sent successfully!");
				router.refresh();
			} else {
				toast.error(result.error || "Failed to send estimate");
			}
		} catch (error) {
			toast.error("An error occurred while sending estimate");
			console.error("Send estimate error:", error);
		} finally {
			setIsSending(false);
		}
	};

	/**
	 * Handle estimate status update via server action
	 */
	const handleStatusChange = async (
		entityId: string,
		newStatus: string
	): Promise<{ success: boolean; error?: string }> => {
		try {
			const result = await updateEstimateStatus(entityId, newStatus);
			return {
				success: result.success,
				error: result.error,
			};
		} catch (error) {
			console.error("Estimate status update error:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Failed to update status",
			};
		}
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
				{/* Status Update Dropdown - First Position */}
				{estimate?.status && estimateId && (
					<StatusUpdateDropdown
						currentStatus={estimate.status}
						entityId={estimateId}
						entityType="estimate"
						onStatusChange={handleStatusChange}
						size="sm"
					/>
				)}

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
								disabled={isSending}
								onClick={handleSendEmail}
								size="sm"
								variant="outline"
							>
								{isSending ? (
									<span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
								) : (
									<Send className="size-3.5" />
								)}
								<span className="hidden lg:inline">
									{isSending ? "Sending..." : "Send"}
								</span>
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

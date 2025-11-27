"use client";

/**
 * Purchase Order Detail Toolbar Actions - Client Component
 *
 * Provides PO-specific toolbar actions:
 * - Status update dropdown (inline)
 * - Send to vendor
 * - Download PDF
 * - Duplicate PO
 * - Archive PO
 *
 * Design: Clean, compact, outline variant buttons
 */

import { Archive, Copy, Download, Mail } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
	archivePurchaseOrder,
	updatePurchaseOrderStatus,
} from "@/actions/purchase-orders";
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

type PurchaseOrderDetailToolbarActionsProps = {
	/** Purchase Order data for status and actions */
	purchaseOrder?: {
		id: string;
		status?: string;
	};
};

export function PurchaseOrderDetailToolbarActions({
	purchaseOrder,
}: PurchaseOrderDetailToolbarActionsProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { toast } = useToast();
	const poId = purchaseOrder?.id || pathname?.split("/").pop() || "";
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);

	/**
	 * Handle purchase order status update via server action
	 */
	const handleStatusChange = async (
		entityId: string,
		newStatus: string
	): Promise<{ success: boolean; error?: string }> => {
		try {
			const result = await updatePurchaseOrderStatus(entityId, newStatus);
			return {
				success: result.success,
				error: result.error,
			};
		} catch (error) {
			console.error("Purchase order status update error:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Failed to update status",
			};
		}
	};

	const handleArchive = async () => {
		if (!poId) {
			toast.error("Purchase order ID not found");
			return;
		}

		setIsArchiving(true);
		try {
			const result = await archivePurchaseOrder(poId);
			if (result.success) {
				toast.success("Purchase order archived successfully");
				setIsArchiveDialogOpen(false);
				router.push("/dashboard/work/purchase-orders");
				// Server Action handles revalidation automatically
			} else {
				toast.error(result.error || "Failed to archive purchase order");
			}
		} catch {
			toast.error("Failed to archive purchase order");
		} finally {
			setIsArchiving(false);
		}
	};

	return (
		<>
			<div className="flex items-center gap-1.5">
				{/* Status Update Dropdown - First Position */}
				{purchaseOrder?.status && poId && (
					<StatusUpdateDropdown
						currentStatus={purchaseOrder.status}
						entityId={poId}
						entityType="purchase-order"
						onStatusChange={handleStatusChange}
						size="sm"
					/>
				)}

				{/* Quick Actions */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button className="h-8 gap-1.5" size="sm" variant="outline">
								<Mail className="size-3.5" />
								<span className="hidden md:inline">Send</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Send to vendor</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button className="h-8 gap-1.5" size="sm" variant="outline">
								<Download className="size-3.5" />
								<span className="hidden lg:inline">PDF</span>
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
								<a
									href={`/dashboard/work/purchase-orders/new?cloneFrom=${poId}`}
								>
									<Copy className="size-3.5" />
									<span className="hidden lg:inline">Copy</span>
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Duplicate purchase order</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<Separator className="h-6" orientation="vertical" />
				<ImportExportDropdown dataType="purchase-orders" />

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
							<p>Archive purchase order</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Archive Purchase Order</DialogTitle>
						<DialogDescription>
							Are you sure you want to archive this purchase order? Archived
							records can be restored within 90 days.
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
							{isArchiving ? "Archiving..." : "Archive PO"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

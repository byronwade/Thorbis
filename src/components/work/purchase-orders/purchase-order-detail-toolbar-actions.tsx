"use client";

/**
 * Purchase Order Detail Toolbar Actions - Client Component
 *
 * Provides PO-specific toolbar actions:
 * - Send to vendor
 * - Download PDF
 * - Duplicate PO
 * - Archive PO
 *
 * Design: Clean, compact, outline buttons with consistent grouping
 */

import { Archive, Copy, Download, Mail } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { archivePurchaseOrder } from "@/actions/purchase-orders";
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

export function PurchaseOrderDetailToolbarActions() {
	const pathname = usePathname();
	const router = useRouter();
	const { toast } = useToast();
	const poId = pathname?.split("/").pop();
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);

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
				router.refresh();
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
							<Button asChild className="h-8 gap-1.5" size="sm" variant="outline">
								<a href={`/dashboard/work/purchase-orders/new?cloneFrom=${poId}`}>
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
							Are you sure you want to archive this purchase order? Archived records can be restored within 90 days.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button disabled={isArchiving} onClick={() => setIsArchiveDialogOpen(false)} variant="outline">
							Cancel
						</Button>
						<Button disabled={isArchiving} onClick={handleArchive} variant="destructive">
							{isArchiving ? "Archiving..." : "Archive PO"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

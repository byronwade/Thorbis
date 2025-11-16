"use client";

/**
 * Payment Detail Toolbar Actions - Client Component
 *
 * Provides payment-specific toolbar actions:
 * - Download receipt
 * - Email receipt
 * - Print receipt
 * - Archive payment
 *
 * Design: Clean, compact, outline buttons with consistent grouping
 */

import { Archive, Download, Mail, Printer } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { archivePayment } from "@/actions/payments";
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

export function PaymentDetailToolbarActions() {
	const pathname = usePathname();
	const router = useRouter();
	const { toast } = useToast();
	const paymentId = pathname?.split("/").pop();
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);

	const handleArchive = async () => {
		if (!paymentId) {
			toast.error("Payment ID not found");
			return;
		}

		setIsArchiving(true);
		try {
			const result = await archivePayment(paymentId);
			if (result.success) {
				toast.success("Payment archived successfully");
				setIsArchiveDialogOpen(false);
				router.push("/dashboard/work/payments");
				router.refresh();
			} else {
				toast.error(result.error || "Failed to archive payment");
			}
		} catch {
			toast.error("Failed to archive payment");
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
							<Button size="sm" variant="outline">
								<Download />
								<span className="hidden md:inline">Receipt</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Download receipt</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button size="sm" variant="outline">
								<Mail />
								<span className="hidden lg:inline">Email</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Email receipt to customer</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button size="sm" variant="outline">
								<Printer />
								<span className="hidden lg:inline">Print</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Print receipt</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<Separator className="h-8" orientation="vertical" />
				<ImportExportDropdown dataType="payments" />

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
							<p>Archive payment</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Archive Payment</DialogTitle>
						<DialogDescription>
							Are you sure you want to archive this payment? Archived payments can be restored within 90 days.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button disabled={isArchiving} onClick={() => setIsArchiveDialogOpen(false)} variant="outline">
							Cancel
						</Button>
						<Button disabled={isArchiving} onClick={handleArchive} variant="destructive">
							{isArchiving ? "Archiving..." : "Archive Payment"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

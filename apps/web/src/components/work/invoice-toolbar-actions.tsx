"use client";

/**
 * Invoice Toolbar Actions - Client Component
 *
 * Provides invoice-specific toolbar actions with API-powered quick actions:
 * - Status update dropdown (inline)
 * - Send invoice via email
 * - Record payment (inline dialog)
 * - Download PDF
 * - Preview
 * - Copy/Clone
 * - Archive
 *
 * Design: Clean, compact, outline variant buttons
 */

import { Archive, Copy, Download, Eye, Send } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { sendInvoiceEmail } from "@/actions/invoice-communications";
import { processInvoicePayment } from "@/actions/invoice-payments";
import { archiveInvoice, updateInvoiceStatus } from "@/actions/invoices";
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
import {
	RecordPaymentDialog,
	type PaymentMethod,
} from "./shared/quick-actions/record-payment-dialog";

type InvoiceToolbarActionsProps = {
	/** Invoice data for quick actions */
	invoice?: {
		id: string;
		status?: string;
		total_amount?: number;
		balance_amount?: number;
		customer?: {
			id: string;
			name: string;
			email?: string | null;
		};
	};
};

export function InvoiceToolbarActions({ invoice }: InvoiceToolbarActionsProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { toast } = useToast();
	const [isSending, setIsSending] = useState(false);
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);

	// Extract invoice ID from pathname if not provided
	const invoiceId = invoice?.id || pathname?.split("/").pop() || "";

	/**
	 * Handle invoice status update via server action
	 */
	const handleStatusChange = async (
		entityId: string,
		newStatus: string
	): Promise<{ success: boolean; error?: string }> => {
		try {
			const result = await updateInvoiceStatus(entityId, newStatus);
			return {
				success: result.success,
				error: result.error,
			};
		} catch (error) {
			console.error("Invoice status update error:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Failed to update status",
			};
		}
	};

	const handleSendInvoice = async () => {
		if (!invoiceId) {
			toast.error("Invoice ID not found");
			return;
		}

		setIsSending(true);
		try {
			const result = await sendInvoiceEmail(invoiceId);
			if (result.success) {
				toast.success("Invoice sent successfully!");
				router.refresh();
			} else {
				toast.error(result.error || "Failed to send invoice");
			}
		} catch (error) {
			toast.error("An error occurred while sending invoice");
			console.error("Send invoice error:", error);
		} finally {
			setIsSending(false);
		}
	};

	const handleExportPDF = () => {
		if (!invoiceId) {
			toast.error("Invoice ID not found");
			return;
		}
		// Open PDF in new tab
		window.open(`/api/invoices/${invoiceId}/pdf`, "_blank");
	};

	const handlePreview = () => {
		if (!invoiceId) {
			toast.error("Invoice ID not found");
			return;
		}
		// Navigate to preview page or open modal
		router.push(`/dashboard/work/invoices/${invoiceId}/preview`);
	};

	const handleCopy = () => {
		if (!invoiceId) {
			toast.error("Invoice ID not found");
			return;
		}
		// Navigate to new invoice page with cloneFrom parameter
		router.push(`/dashboard/work/invoices/new?cloneFrom=${invoiceId}`);
	};

	const handleArchive = async () => {
		if (!invoiceId) {
			toast.error("Invoice ID not found");
			return;
		}

		setIsArchiving(true);
		try {
			const result = await archiveInvoice(invoiceId);
			if (result.success) {
				toast.success("Invoice archived successfully");
				setIsArchiveDialogOpen(false);
				router.push("/dashboard/work/invoices");
			} else {
				toast.error(result.error || "Failed to archive invoice");
			}
		} catch (_error) {
			toast.error("Failed to archive invoice");
		} finally {
			setIsArchiving(false);
		}
	};

	/**
	 * Handle recording a payment via the processInvoicePayment action
	 */
	const handleRecordPayment = async (data: {
		entityId: string;
		entityType: "invoice" | "job";
		amount: number;
		method: PaymentMethod;
		referenceNumber?: string;
		notes?: string;
		sendReceipt?: boolean;
		customerId?: string;
	}): Promise<{ success: boolean; error?: string; paymentId?: string }> => {
		try {
			// Map our payment method to the channel expected by processInvoicePayment
			const channelMap: Record<PaymentMethod, "online" | "card_present" | "ach"> = {
				cash: "card_present", // Manual entry
				check: "card_present", // Manual entry
				card: "online",
				bank_transfer: "ach",
				other: "card_present",
			};

			const result = await processInvoicePayment({
				invoiceId: data.entityId,
				channel: channelMap[data.method],
				amount: data.amount / 100, // Convert cents to dollars for the API
			});

			if (result.success) {
				return {
					success: true,
					paymentId: result.transactionId,
				};
			}

			return {
				success: false,
				error: result.error || "Failed to process payment",
			};
		} catch (error) {
			console.error("Payment recording error:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Payment processing failed",
			};
		}
	};

	return (
		<>
			<div className="flex items-center gap-1.5">
				{/* Status Update Dropdown - First Position */}
				{invoice?.status && invoiceId && (
					<StatusUpdateDropdown
						currentStatus={invoice.status}
						entityId={invoiceId}
						entityType="invoice"
						onStatusChange={handleStatusChange}
						size="sm"
					/>
				)}

				{/* Quick Actions - Individual Buttons */}
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
							<p>Preview invoice</p>
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
							<p>Download PDF</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="h-8 gap-1.5"
								disabled={isSending}
								onClick={handleSendInvoice}
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
							<p>Send invoice to customer</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				{/* Record Payment - Inline Dialog */}
				{invoice && (
					<RecordPaymentDialog
						balanceAmount={invoice.balance_amount || 0}
						className="h-8"
						customer={invoice.customer}
						entityId={invoiceId}
						entityLabel={`Invoice Payment`}
						entityType="invoice"
						onRecordPayment={handleRecordPayment}
						totalAmount={invoice.total_amount || 0}
						triggerSize="sm"
						triggerText="Payment"
						triggerVariant="outline"
					/>
				)}

				{/* Copy/Clone */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="h-8 gap-1.5"
								onClick={handleCopy}
								size="sm"
								variant="outline"
							>
								<Copy className="size-3.5" />
								<span className="hidden lg:inline">Copy</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Duplicate invoice</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				{/* Ellipsis Menu - Export/Import */}
				<Separator className="h-6" orientation="vertical" />
				<ImportExportDropdown dataType="invoices" />

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
							<p>Archive invoice</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			{/* Archive Confirmation Dialog */}
			<Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Archive Invoice</DialogTitle>
						<DialogDescription>
							Are you sure you want to archive this invoice? Archived invoices
							can be restored within 90 days. Paid invoices cannot be archived.
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
							{isArchiving ? "Archiving..." : "Archive Invoice"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

"use client";

/**
 * RecordPaymentDialog - Quick payment recording from invoice/job pages
 *
 * Enables recording cash, check, card, or bank transfer payments
 * directly from detail pages with automatic balance updates.
 */

import {
	Banknote,
	Building2,
	CheckCircle,
	CreditCard,
	DollarSign,
	Loader2,
	Receipt,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/**
 * Payment method options
 */
export type PaymentMethod = "cash" | "check" | "card" | "bank_transfer" | "other";

/**
 * Payment method configurations
 */
const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
	{ value: "cash", label: "Cash", icon: <Banknote className="size-4" /> },
	{ value: "check", label: "Check", icon: <Receipt className="size-4" /> },
	{ value: "card", label: "Credit/Debit Card", icon: <CreditCard className="size-4" /> },
	{ value: "bank_transfer", label: "Bank Transfer", icon: <Building2 className="size-4" /> },
	{ value: "other", label: "Other", icon: <DollarSign className="size-4" /> },
];

/**
 * Payment data structure
 */
export type PaymentData = {
	amount: number;
	method: PaymentMethod;
	referenceNumber?: string;
	notes?: string;
	sendReceipt?: boolean;
};

type RecordPaymentDialogProps = {
	/** Invoice or job ID to record payment against */
	entityId: string;
	/** Entity type */
	entityType: "invoice" | "job";
	/** Entity label for display (e.g., "Invoice #1234") */
	entityLabel?: string;
	/** Outstanding balance in cents */
	balanceAmount: number;
	/** Total amount in cents */
	totalAmount: number;
	/** Customer info for receipt */
	customer?: {
		id: string;
		name: string;
		email?: string | null;
	};
	/** Server action to process payment */
	onRecordPayment: (data: {
		entityId: string;
		entityType: "invoice" | "job";
		amount: number;
		method: PaymentMethod;
		referenceNumber?: string;
		notes?: string;
		sendReceipt?: boolean;
		customerId?: string;
	}) => Promise<{ success: boolean; error?: string; paymentId?: string }>;
	/** Trigger button variant */
	triggerVariant?: "default" | "outline" | "ghost" | "secondary";
	/** Trigger button size */
	triggerSize?: "sm" | "default" | "lg";
	/** Trigger button text */
	triggerText?: string;
	/** Additional className for trigger */
	className?: string;
	/** Disable the dialog */
	disabled?: boolean;
};

/**
 * Format cents to currency display
 */
function formatCurrency(cents: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(cents / 100);
}

/**
 * Parse currency input to cents
 */
function parseCurrencyToCents(value: string): number {
	const cleaned = value.replace(/[^0-9.]/g, "");
	const parsed = parseFloat(cleaned);
	return isNaN(parsed) ? 0 : Math.round(parsed * 100);
}

export function RecordPaymentDialog({
	entityId,
	entityType,
	entityLabel,
	balanceAmount,
	totalAmount,
	customer,
	onRecordPayment,
	triggerVariant = "default",
	triggerSize = "sm",
	triggerText = "Record Payment",
	className,
	disabled = false,
}: RecordPaymentDialogProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [isOpen, setIsOpen] = useState(false);

	// Form state
	const [amountInput, setAmountInput] = useState("");
	const [method, setMethod] = useState<PaymentMethod>("card");
	const [referenceNumber, setReferenceNumber] = useState("");
	const [notes, setNotes] = useState("");
	const [sendReceipt, setSendReceipt] = useState(!!customer?.email);

	const amountCents = parseCurrencyToCents(amountInput);
	const isFullPayment = amountCents >= balanceAmount;
	const isOverpayment = amountCents > balanceAmount;

	const handlePayFullBalance = () => {
		setAmountInput((balanceAmount / 100).toFixed(2));
	};

	const handleSubmit = () => {
		if (amountCents <= 0) {
			toast.error("Please enter a valid payment amount");
			return;
		}

		if (isOverpayment) {
			const confirmed = window.confirm(
				`The payment amount (${formatCurrency(amountCents)}) exceeds the balance (${formatCurrency(balanceAmount)}). Continue anyway?`
			);
			if (!confirmed) return;
		}

		startTransition(async () => {
			try {
				const result = await onRecordPayment({
					entityId,
					entityType,
					amount: amountCents,
					method,
					referenceNumber: referenceNumber || undefined,
					notes: notes || undefined,
					sendReceipt: sendReceipt && !!customer?.email,
					customerId: customer?.id,
				});

				if (result.success) {
					toast.success(
						isFullPayment
							? "Payment recorded! Balance paid in full."
							: `Payment of ${formatCurrency(amountCents)} recorded successfully.`
					);
					setIsOpen(false);
					resetForm();
					router.refresh();
				} else {
					toast.error(result.error || "Failed to record payment");
				}
			} catch (error) {
				toast.error("An error occurred while recording payment");
				console.error("Payment recording error:", error);
			}
		});
	};

	const resetForm = () => {
		setAmountInput("");
		setMethod("card");
		setReferenceNumber("");
		setNotes("");
		setSendReceipt(!!customer?.email);
	};

	// Don't show if no balance
	if (balanceAmount <= 0) {
		return (
			<Button
				className={cn("gap-1.5", className)}
				disabled
				size={triggerSize}
				variant="outline"
			>
				<CheckCircle className="size-4 text-green-500" />
				<span>Paid in Full</span>
			</Button>
		);
	}

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen}>
			<DialogTrigger asChild>
				<Button
					className={cn("gap-1.5", className)}
					disabled={disabled}
					size={triggerSize}
					variant={triggerVariant}
				>
					<DollarSign className="size-4" />
					<span>{triggerText}</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Record Payment</DialogTitle>
					<DialogDescription>
						{entityLabel || `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Payment`}
					</DialogDescription>
				</DialogHeader>

				{/* Balance Summary */}
				<div className="bg-muted/50 rounded-lg p-4">
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground text-sm">Total Amount</span>
						<span className="font-medium">{formatCurrency(totalAmount)}</span>
					</div>
					<div className="mt-2 flex items-center justify-between border-t pt-2">
						<span className="text-sm font-medium">Balance Due</span>
						<span className="text-lg font-bold text-primary">
							{formatCurrency(balanceAmount)}
						</span>
					</div>
				</div>

				<div className="space-y-4">
					{/* Amount Input */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="amount">Payment Amount</Label>
							<Button
								className="h-auto p-0 text-xs"
								onClick={handlePayFullBalance}
								type="button"
								variant="link"
							>
								Pay full balance
							</Button>
						</div>
						<div className="relative">
							<DollarSign className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
							<Input
								className="pl-9"
								id="amount"
								onChange={(e) => setAmountInput(e.target.value)}
								placeholder="0.00"
								type="text"
								value={amountInput}
							/>
						</div>
						{isOverpayment && (
							<p className="text-xs text-amber-600">
								This exceeds the outstanding balance
							</p>
						)}
					</div>

					{/* Payment Method */}
					<div className="space-y-2">
						<Label htmlFor="method">Payment Method</Label>
						<Select onValueChange={(v) => setMethod(v as PaymentMethod)} value={method}>
							<SelectTrigger>
								<SelectValue placeholder="Select method" />
							</SelectTrigger>
							<SelectContent>
								{PAYMENT_METHODS.map((pm) => (
									<SelectItem key={pm.value} value={pm.value}>
										<div className="flex items-center gap-2">
											{pm.icon}
											<span>{pm.label}</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Reference Number (optional, shown for check/bank transfer) */}
					{(method === "check" || method === "bank_transfer") && (
						<div className="space-y-2">
							<Label htmlFor="reference">
								{method === "check" ? "Check Number" : "Transaction Reference"}
							</Label>
							<Input
								id="reference"
								onChange={(e) => setReferenceNumber(e.target.value)}
								placeholder={method === "check" ? "e.g., 1234" : "e.g., TXN-123456"}
								value={referenceNumber}
							/>
						</div>
					)}

					{/* Notes */}
					<div className="space-y-2">
						<Label htmlFor="notes">Notes (optional)</Label>
						<Textarea
							className="min-h-[60px]"
							id="notes"
							onChange={(e) => setNotes(e.target.value)}
							placeholder="Add any notes about this payment..."
							value={notes}
						/>
					</div>

					{/* Send Receipt Checkbox */}
					{customer?.email && (
						<div className="flex items-center space-x-2">
							<Checkbox
								checked={sendReceipt}
								id="send-receipt"
								onCheckedChange={(checked) => setSendReceipt(!!checked)}
							/>
							<Label className="text-sm font-normal" htmlFor="send-receipt">
								Send receipt to {customer.email}
							</Label>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button
						onClick={() => setIsOpen(false)}
						type="button"
						variant="outline"
					>
						Cancel
					</Button>
					<Button
						disabled={isPending || amountCents <= 0}
						onClick={handleSubmit}
						type="button"
					>
						{isPending ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								Recording...
							</>
						) : (
							<>
								<CheckCircle className="mr-2 size-4" />
								Record {formatCurrency(amountCents)}
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

/**
 * PaymentSummaryBadge - Shows payment status at a glance
 */
export function PaymentSummaryBadge({
	balanceAmount,
	totalAmount,
	className,
}: {
	balanceAmount: number;
	totalAmount: number;
	className?: string;
}) {
	const isPaid = balanceAmount <= 0;
	const isPartial = balanceAmount > 0 && balanceAmount < totalAmount;
	const paidPercent = Math.round(((totalAmount - balanceAmount) / totalAmount) * 100);

	if (isPaid) {
		return (
			<div className={cn("flex items-center gap-1.5 text-green-600", className)}>
				<CheckCircle className="size-4" />
				<span className="text-sm font-medium">Paid in Full</span>
			</div>
		);
	}

	if (isPartial) {
		return (
			<div className={cn("flex items-center gap-1.5 text-amber-600", className)}>
				<DollarSign className="size-4" />
				<span className="text-sm font-medium">
					{paidPercent}% Paid · {formatCurrency(balanceAmount)} due
				</span>
			</div>
		);
	}

	return (
		<div className={cn("flex items-center gap-1.5 text-muted-foreground", className)}>
			<DollarSign className="size-4" />
			<span className="text-sm font-medium">
				{formatCurrency(balanceAmount)} due
			</span>
		</div>
	);
}

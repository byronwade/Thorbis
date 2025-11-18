/**
 * PaymentForm Component
 *
 * Comprehensive payment creation form with:
 * - Invoice selection with amount due
 * - Payment method selector (Stripe integration)
 * - Split payment support
 * - Customer selection
 * - Keyboard shortcuts (⌘S, ⌘K, ⌘/)
 *
 * Performance: Client Component (interactive form)
 */

"use client";

import { CreditCard, DollarSign, Loader2, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPayment } from "@/actions/payments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

type Customer = {
	id: string;
	first_name: string | null;
	last_name: string | null;
	display_name: string | null;
	email: string | null;
};

type Invoice = {
	id: string;
	invoice_number: string;
	customer_id: string;
	total_amount: number;
	paid_amount: number;
	status: string;
};

type PaymentFormProps = {
	customers: Customer[];
	invoices: Invoice[];
	preselectedInvoiceId?: string;
	preselectedCustomerId?: string;
};

export function PaymentForm({
	customers,
	invoices,
	preselectedInvoiceId,
	preselectedCustomerId,
}: PaymentFormProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const formRef = useRef<HTMLFormElement>(null);

	// Form state
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedCustomerId, setSelectedCustomerId] = useState<
		string | undefined
	>(preselectedCustomerId || searchParams?.get("customerId") || undefined);
	const [selectedInvoiceId, setSelectedInvoiceId] = useState<
		string | undefined
	>(preselectedInvoiceId || searchParams?.get("invoiceId") || undefined);
	const [paymentMethod, setPaymentMethod] = useState("stripe");
	const [paymentAmount, setPaymentAmount] = useState(0);

	// Find selected invoice
	const selectedInvoice = invoices.find((inv) => inv.id === selectedInvoiceId);

	// Calculate amount due
	const amountDue = selectedInvoice
		? (selectedInvoice.total_amount - selectedInvoice.paid_amount) / 100
		: 0;

	// Filter invoices by customer
	const customerInvoices = selectedCustomerId
		? invoices.filter((inv) => inv.customer_id === selectedCustomerId)
		: invoices;

	// Auto-fill payment amount when invoice is selected
	useEffect(() => {
		if (selectedInvoice && amountDue > 0) {
			setPaymentAmount(amountDue);
		}
	}, [selectedInvoice, amountDue]);

	// Keyboard shortcuts
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if ((e.metaKey || e.ctrlKey) && e.key === "s") {
				e.preventDefault();
				formRef.current?.requestSubmit();
			}
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				document.getElementById("customer-select")?.focus();
			}
			if (e.key === "Escape") {
				router.back();
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [router]);

	// Handle form submission
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const formData = new FormData(e.currentTarget);

		const result = await createPayment(formData);

		if (!result.success) {
			setError(result.error || "Failed to process payment");
			setIsLoading(false);
			return;
		}

		if (result.paymentId) {
			router.push(`/dashboard/work/payments/${result.paymentId}`);
		} else {
			router.push("/dashboard/work/payments");
		}
	}

	return (
		<form className="space-y-6" onSubmit={handleSubmit} ref={formRef}>
			{/* Error Display */}
			{error && (
				<div className="border-destructive/50 bg-destructive/10 rounded-lg border p-4">
					<p className="text-destructive text-sm font-medium">{error}</p>
				</div>
			)}

			{/* Customer & Invoice Selection */}
			<Card>
				<CardHeader>
					<CardTitle>Invoice Selection</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="customer-select">
							Customer <span className="text-destructive">*</span>
						</Label>
						<Select
							onValueChange={setSelectedCustomerId}
							required
							value={selectedCustomerId}
						>
							<SelectTrigger id="customer-select">
								<SelectValue placeholder="Select customer (⌘K)" />
							</SelectTrigger>
							<SelectContent>
								{customers.map((customer) => (
									<SelectItem key={customer.id} value={customer.id}>
										{customer.display_name ||
											`${customer.first_name} ${customer.last_name}` ||
											customer.email}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{selectedCustomerId && (
						<div className="space-y-2">
							<Label htmlFor="invoice-select">
								Invoice <span className="text-destructive">*</span>
							</Label>
							<Select
								name="invoiceId"
								onValueChange={setSelectedInvoiceId}
								required
								value={selectedInvoiceId}
							>
								<SelectTrigger id="invoice-select">
									<SelectValue placeholder="Select invoice" />
								</SelectTrigger>
								<SelectContent>
									{customerInvoices
										.filter((inv) => inv.status !== "paid")
										.map((invoice) => (
											<SelectItem key={invoice.id} value={invoice.id}>
												{invoice.invoice_number} - $
												{(
													(invoice.total_amount - invoice.paid_amount) /
													100
												).toFixed(2)}{" "}
												due
											</SelectItem>
										))}
								</SelectContent>
							</Select>
						</div>
					)}

					{selectedInvoice && (
						<div className="rounded-lg border bg-blue-50/50 p-4">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Invoice Total:</span>
								<span className="font-medium">
									${(selectedInvoice.total_amount / 100).toFixed(2)}
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Already Paid:</span>
								<span className="font-medium">
									${(selectedInvoice.paid_amount / 100).toFixed(2)}
								</span>
							</div>
							<div className="flex justify-between border-t pt-2 font-bold">
								<span>Amount Due:</span>
								<span className="text-lg">${amountDue.toFixed(2)}</span>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Payment Details */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<DollarSign className="h-5 w-5" />
						<CardTitle>Payment Details</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="amount">
							Payment Amount ($) <span className="text-destructive">*</span>
						</Label>
						<Input
							id="amount"
							min="0.01"
							name="amount"
							onChange={(e) =>
								setPaymentAmount(Number.parseFloat(e.target.value) || 0)
							}
							placeholder="0.00"
							required
							step="0.01"
							type="number"
							value={paymentAmount}
						/>
						{selectedInvoice && paymentAmount > amountDue && (
							<p className="text-sm text-amber-600">
								⚠️ Amount exceeds balance due by $
								{(paymentAmount - amountDue).toFixed(2)}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="paymentDate">Payment Date</Label>
						<Input
							defaultValue={new Date().toISOString().split("T")[0]}
							id="paymentDate"
							name="paymentDate"
							type="date"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Payment Method */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<CreditCard className="h-5 w-5" />
						<CardTitle>Payment Method</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="paymentMethod">
							Method <span className="text-destructive">*</span>
						</Label>
						<Select
							name="paymentMethod"
							onValueChange={setPaymentMethod}
							required
							value={paymentMethod}
						>
							<SelectTrigger id="paymentMethod">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="stripe">
									Credit/Debit Card (Stripe)
								</SelectItem>
								<SelectItem value="cash">Cash</SelectItem>
								<SelectItem value="check">Check</SelectItem>
								<SelectItem value="bank_transfer">Bank Transfer</SelectItem>
								<SelectItem value="other">Other</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{paymentMethod === "check" && (
						<div className="space-y-2">
							<Label htmlFor="checkNumber">Check Number</Label>
							<Input
								id="checkNumber"
								name="checkNumber"
								placeholder="e.g., 1234"
							/>
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="notes">Notes (Optional)</Label>
						<Textarea
							id="notes"
							name="notes"
							placeholder="Reference number, transaction ID, etc."
							rows={2}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Actions */}
			<div className="flex justify-end gap-3">
				<Button
					disabled={isLoading}
					onClick={() => router.back()}
					type="button"
					variant="outline"
				>
					Cancel (Esc)
				</Button>
				<Button disabled={isLoading || !selectedInvoiceId} type="submit">
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					<Save className="mr-2 h-4 w-4" />
					Record Payment (⌘S)
				</Button>
			</div>
		</form>
	);
}

/**
 * Collect Payment Dialog
 *
 * Allows CSRs to manually collect payments from customers.
 *
 * Features:
 * - Multiple payment methods (cash, check, card, ACH)
 * - Integration with Adyen/Plaid processors
 * - Manual entry for offline payments
 * - Receipt generation
 */

"use client";

import {
	Banknote,
	Building2,
	CreditCard,
	FileCheck,
	Loader2,
	Receipt,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { collectManualPayment } from "@/actions/payments/collect-manual-payment";
import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type PaymentMethod = "cash" | "check" | "card" | "ach";

type CollectPaymentDialogProps = {
	invoiceId: string;
	invoiceNumber: string;
	customerId: string;
	customerName: string;
	companyId: string;
	amountDue: number; // In cents
	currency?: string;
	trigger?: React.ReactNode;
	onSuccess?: () => void;
};

const PAYMENT_METHODS = [
	{
		id: "cash" as PaymentMethod,
		name: "Cash",
		description: "Customer paid with cash",
		icon: Banknote,
	},
	{
		id: "check" as PaymentMethod,
		name: "Check",
		description: "Customer paid with check",
		icon: FileCheck,
	},
	{
		id: "card" as PaymentMethod,
		name: "Credit/Debit Card",
		description: "Process card payment",
		icon: CreditCard,
	},
	{
		id: "ach" as PaymentMethod,
		name: "Bank Transfer (ACH)",
		description: "Process ACH payment",
		icon: Building2,
	},
];

export function CollectPaymentDialog({
	invoiceId,
	invoiceNumber,
	customerId,
	customerName,
	companyId,
	amountDue,
	currency = "USD",
	trigger,
	onSuccess,
}: CollectPaymentDialogProps) {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
	const [amount, setAmount] = useState((amountDue / 100).toFixed(2));
	const [notes, setNotes] = useState("");

	// Check-specific fields
	const [checkNumber, setCheckNumber] = useState("");

	// Card-specific fields
	const [cardNumber, setCardNumber] = useState("");
	const [cardExpiry, setCardExpiry] = useState("");
	const [cardCvc, setCardCvc] = useState("");
	const [cardName, setCardName] = useState(customerName);

	// ACH-specific fields
	const [accountNumber, setAccountNumber] = useState("");
	const [routingNumber, setRoutingNumber] = useState("");
	const [accountName, setAccountName] = useState(customerName);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const amountCents = Math.round(Number.parseFloat(amount) * 100);

		if (amountCents <= 0) {
			toast.error("Invalid amount", {
				description: "Please enter a valid payment amount.",
			});
			return;
		}

		startTransition(async () => {
			try {
				const result = await collectManualPayment({
					invoiceId,
					companyId,
					customerId,
					paymentMethod,
					amount: amountCents,
					notes: notes || undefined,
					checkNumber: paymentMethod === "check" ? checkNumber : undefined,
					cardDetails:
						paymentMethod === "card"
							? {
									cardNumber: cardNumber.replace(/\s/g, ""),
									cardExpiry,
									cardCvc,
									cardName,
								}
							: undefined,
					achDetails:
						paymentMethod === "ach"
							? {
									accountNumber,
									routingNumber,
									accountName,
								}
							: undefined,
				});

				if (result.success) {
					toast.success("Payment collected", {
						description: `Payment of ${formatCurrency(amountCents)} has been recorded.`,
					});
					setOpen(false);
					resetForm();
					onSuccess?.();
				} else {
					toast.error("Payment failed", {
						description: result.error || "Unable to process payment.",
					});
				}
			} catch (_error) {
				toast.error("Payment error", {
					description: "An unexpected error occurred. Please try again.",
				});
			}
		});
	};

	const resetForm = () => {
		setPaymentMethod("cash");
		setAmount((amountDue / 100).toFixed(2));
		setNotes("");
		setCheckNumber("");
		setCardNumber("");
		setCardExpiry("");
		setCardCvc("");
		setCardName(customerName);
		setAccountNumber("");
		setRoutingNumber("");
		setAccountName(customerName);
	};

	const formatCurrency = (cents: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
		}).format(cents / 100);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger || (
					<Button variant="outline" size="sm">
						<Receipt className="mr-2 h-4 w-4" />
						Collect Payment
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Collect Payment</DialogTitle>
						<DialogDescription>
							Record a payment for Invoice #{invoiceNumber} from {customerName}
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-6 py-4">
						{/* Amount */}
						<div className="space-y-2">
							<Label htmlFor="amount">Payment Amount</Label>
							<div className="relative">
								<span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2">
									$
								</span>
								<Input
									id="amount"
									type="number"
									step="0.01"
									min="0.01"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									className="pl-8"
									required
								/>
							</div>
							{Number.parseFloat(amount) * 100 < amountDue && (
								<p className="text-muted-foreground text-xs">
									Partial payment (
									{formatCurrency(amountDue - Number.parseFloat(amount) * 100)}{" "}
									remaining)
								</p>
							)}
						</div>

						{/* Payment Method Selection */}
						<div className="space-y-3">
							<Label>Payment Method</Label>
							<RadioGroup
								value={paymentMethod}
								onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
								className="grid gap-2"
							>
								{PAYMENT_METHODS.map((method) => {
									const Icon = method.icon;
									return (
										<div key={method.id}>
											<RadioGroupItem
												value={method.id}
												id={method.id}
												className="peer sr-only"
											/>
											<Label
												htmlFor={method.id}
												className={cn(
													"flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-colors",
													"peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
													"hover:border-primary/50",
												)}
											>
												<Icon className="h-5 w-5 text-muted-foreground" />
												<div className="flex-1">
													<p className="text-sm font-medium">{method.name}</p>
													<p className="text-muted-foreground text-xs">
														{method.description}
													</p>
												</div>
											</Label>
										</div>
									);
								})}
							</RadioGroup>
						</div>

						{/* Check Fields */}
						{paymentMethod === "check" && (
							<div className="space-y-2">
								<Label htmlFor="checkNumber">Check Number</Label>
								<Input
									id="checkNumber"
									value={checkNumber}
									onChange={(e) => setCheckNumber(e.target.value)}
									placeholder="Enter check number"
									required
								/>
							</div>
						)}

						{/* Card Fields */}
						{paymentMethod === "card" && (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="cardName">Cardholder Name</Label>
									<Input
										id="cardName"
										value={cardName}
										onChange={(e) => setCardName(e.target.value)}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="cardNumber">Card Number</Label>
									<Input
										id="cardNumber"
										maxLength={19}
										value={cardNumber}
										onChange={(e) => {
											const value = e.target.value.replace(/\s/g, "");
											const formatted =
												value.match(/.{1,4}/g)?.join(" ") || value;
											setCardNumber(formatted);
										}}
										placeholder="1234 5678 9012 3456"
										required
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="cardExpiry">Expiry</Label>
										<Input
											id="cardExpiry"
											maxLength={5}
											value={cardExpiry}
											onChange={(e) => {
												const value = e.target.value.replace(/\D/g, "");
												if (value.length >= 2) {
													setCardExpiry(
														`${value.slice(0, 2)}/${value.slice(2, 4)}`,
													);
												} else {
													setCardExpiry(value);
												}
											}}
											placeholder="MM/YY"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="cardCvc">CVC</Label>
										<Input
											id="cardCvc"
											maxLength={4}
											value={cardCvc}
											onChange={(e) =>
												setCardCvc(e.target.value.replace(/\D/g, ""))
											}
											placeholder="123"
											required
										/>
									</div>
								</div>
							</div>
						)}

						{/* ACH Fields */}
						{paymentMethod === "ach" && (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="accountName">Account Holder Name</Label>
									<Input
										id="accountName"
										value={accountName}
										onChange={(e) => setAccountName(e.target.value)}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="routingNumber">Routing Number</Label>
									<Input
										id="routingNumber"
										maxLength={9}
										value={routingNumber}
										onChange={(e) =>
											setRoutingNumber(e.target.value.replace(/\D/g, ""))
										}
										placeholder="110000000"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="accountNumber">Account Number</Label>
									<Input
										id="accountNumber"
										value={accountNumber}
										onChange={(e) =>
											setAccountNumber(e.target.value.replace(/\D/g, ""))
										}
										placeholder="000123456789"
										required
									/>
								</div>
							</div>
						)}

						{/* Notes */}
						<div className="space-y-2">
							<Label htmlFor="notes">Notes (Optional)</Label>
							<Textarea
								id="notes"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="Add any notes about this payment..."
								rows={2}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Processing...
								</>
							) : (
								<>
									<Receipt className="mr-2 h-4 w-4" />
									Collect {formatCurrency(Number.parseFloat(amount) * 100)}
								</>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

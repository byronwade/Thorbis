"use client";

/**
 * Payment Method Selector Component
 *
 * Comprehensive payment selection with:
 * - Dropdown to select existing payment methods
 * - Option to add new card
 * - Apple Pay / Google Pay support via Express Checkout
 */

import { useState, useEffect } from "react";
import { Elements, useStripe, useElements, ExpressCheckoutElement } from "@stripe/react-stripe-js";
import type { Stripe, StripeElements } from "@stripe/stripe-js";
import { CreditCard, Plus, CheckCircle2, Loader2, Apple, Smartphone } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CustomPaymentForm } from "./custom-payment-form";

type PaymentMethod = {
	id: string;
	brand: string;
	last4: string;
	exp_month: number;
	exp_year: number;
};

type PaymentMethodSelectorProps = {
	customerId?: string;
	onPaymentMethodSelected: (paymentMethodId: string) => void;
	onError: (error: string) => void;
};

function PaymentMethodSelectorInner({
	customerId,
	onPaymentMethodSelected,
	onError,
}: PaymentMethodSelectorProps) {
	const stripe = useStripe();
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
	const [selectedMethod, setSelectedMethod] = useState<string>("");
	const [showNewCardForm, setShowNewCardForm] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Fetch existing payment methods if customer ID is provided
	useEffect(() => {
		async function fetchPaymentMethods() {
			if (!customerId || !stripe) {
				// If no customer ID, auto-select credit card option
				setSelectedMethod("new-card");
				setShowNewCardForm(true);
				return;
			}

			setIsLoading(true);
			try {
				// Call API to fetch payment methods
				const response = await fetch(`/api/payments/methods?customerId=${customerId}`);
				if (response.ok) {
					const data = await response.json();
					setPaymentMethods(data.paymentMethods || []);

					// Auto-select if only one payment method exists
					if (data.paymentMethods?.length === 1) {
						const method = data.paymentMethods[0];
						setSelectedMethod(method.id);
						onPaymentMethodSelected(method.id);
					} else if (!data.paymentMethods || data.paymentMethods.length === 0) {
						// Auto-select credit card option if no payment methods exist
						setSelectedMethod("new-card");
						setShowNewCardForm(true);
					}
				} else {
					// If API fails or no customer, default to credit card
					setSelectedMethod("new-card");
					setShowNewCardForm(true);
				}
			} catch (err) {
				console.error("Error fetching payment methods:", err);
				// Default to credit card on error
				setSelectedMethod("new-card");
				setShowNewCardForm(true);
			} finally {
				setIsLoading(false);
			}
		}

		fetchPaymentMethods();
	}, [customerId, stripe]);

	const handleMethodSelect = (methodId: string) => {
		if (methodId === "new-card") {
			setShowNewCardForm(true);
			setSelectedMethod("new-card");
		} else if (methodId === "apple-pay" || methodId === "google-pay") {
			setShowNewCardForm(false);
			setSelectedMethod(methodId);
			// Express checkout methods don't have a payment method ID yet
		} else {
			setShowNewCardForm(false);
			setSelectedMethod(methodId);
			onPaymentMethodSelected(methodId);
		}
	};

	const handleNewCardSuccess = (paymentMethodId: string) => {
		setShowNewCardForm(false);
		setSelectedMethod(paymentMethodId);
		onPaymentMethodSelected(paymentMethodId);

		// Add to list of payment methods
		// We'll refresh this from the API in a real implementation
	};

	return (
		<div className="space-y-4">
			{/* Always show dropdown with all payment options */}
			<div className="space-y-2">
				<Label htmlFor="payment-method" className="text-foreground font-semibold">Select Payment Method</Label>
				<Select value={selectedMethod} onValueChange={handleMethodSelect}>
					<SelectTrigger id="payment-method" className="bg-background text-foreground border-2 border-input focus:border-ring dark:bg-background/95" disabled={isLoading}>
						<SelectValue placeholder={isLoading ? "Loading..." : "Choose payment method"} />
					</SelectTrigger>
					<SelectContent>
						{/* Existing payment methods from primary org */}
						{paymentMethods.length > 0 && (
							<>
								<div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
									Primary Organization Cards
								</div>
								{paymentMethods.map((method) => (
									<SelectItem key={method.id} value={method.id}>
										<div className="flex items-center gap-2">
											<CreditCard className="size-4" />
											<span>
												{method.brand} •••• {method.last4}
											</span>
											<span className="text-muted-foreground text-xs">
												Exp {method.exp_month}/{method.exp_year}
											</span>
										</div>
									</SelectItem>
								))}
								<div className="my-1 h-px bg-border" />
							</>
						)}

						{/* Add new card option */}
						<SelectItem value="new-card">
							<div className="flex items-center gap-2">
								<CreditCard className="size-4" />
								<span>Add new debit or credit card</span>
							</div>
						</SelectItem>

						{/* Apple Pay option */}
						<SelectItem value="apple-pay">
							<div className="flex items-center gap-2">
								<Apple className="size-4" />
								<span>Apple Pay</span>
							</div>
						</SelectItem>

						{/* Google Pay option */}
						<SelectItem value="google-pay">
							<div className="flex items-center gap-2">
								<Smartphone className="size-4" />
								<span>Google Pay</span>
							</div>
						</SelectItem>
					</SelectContent>
				</Select>

				{/* Success indicator for existing method selected */}
				{selectedMethod && selectedMethod !== "new-card" && selectedMethod !== "apple-pay" && selectedMethod !== "google-pay" && (
					<div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
						<CheckCircle2 className="size-4" />
						<span>Payment method selected from primary organization</span>
					</div>
				)}
			</div>

			{/* Show card entry form when "Add new card" is selected */}
			{selectedMethod === "new-card" && (
				<div className="space-y-4 rounded-lg border-2 border-input bg-background/80 p-4 dark:bg-background/90">
					<div className="flex items-center justify-between">
						<h4 className="font-medium text-sm">Enter Card Details</h4>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => {
								setSelectedMethod("");
								setShowNewCardForm(false);
							}}
						>
							Cancel
						</Button>
					</div>
					<CustomPaymentForm onSuccess={handleNewCardSuccess} onError={onError} showButton={false} />
				</div>
			)}

			{/* Show Express Checkout for Apple Pay */}
			{selectedMethod === "apple-pay" && (
				<div className="space-y-4 rounded-lg border bg-muted/30 p-4">
					<div className="flex items-center justify-between">
						<h4 className="font-medium text-sm">Apple Pay</h4>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => setSelectedMethod("")}
						>
							Cancel
						</Button>
					</div>
					<ExpressCheckoutElement
						options={{
							buttonType: {
								applePay: "plain",
							},
						}}
						onConfirm={async (event: any) => {
							// Handle Apple Pay confirmation
							if (event.expressPaymentType === "apple_pay") {
								// The payment method will be in event.paymentMethod
								if (event.paymentMethod?.id) {
									handleNewCardSuccess(event.paymentMethod.id);
								}
							}
						}}
					/>
					<p className="text-muted-foreground text-xs">
						Click the Apple Pay button above to complete payment
					</p>
				</div>
			)}

			{/* Show Express Checkout for Google Pay */}
			{selectedMethod === "google-pay" && (
				<div className="space-y-4 rounded-lg border bg-muted/30 p-4">
					<div className="flex items-center justify-between">
						<h4 className="font-medium text-sm">Google Pay</h4>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => setSelectedMethod("")}
						>
							Cancel
						</Button>
					</div>
					<ExpressCheckoutElement
						options={{
							buttonType: {
								googlePay: "plain",
							},
						}}
						onConfirm={async (event: any) => {
							// Handle Google Pay confirmation
							if (event.expressPaymentType === "google_pay") {
								// The payment method will be in event.paymentMethod
								if (event.paymentMethod?.id) {
									handleNewCardSuccess(event.paymentMethod.id);
								}
							}
						}}
					/>
					<p className="text-muted-foreground text-xs">
						Click the Google Pay button above to complete payment
					</p>
				</div>
			)}
		</div>
	);
}

// Wrapper component with Stripe Elements provider
export function PaymentMethodSelector(
	props: PaymentMethodSelectorProps & { stripe: Stripe | null }
) {
	if (!props.stripe) {
		return (
			<div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-200">
				<p className="text-sm">Payment system is not configured. Please contact support.</p>
			</div>
		);
	}

	return (
		<Elements stripe={props.stripe}>
			<PaymentMethodSelectorInner {...props} />
		</Elements>
	);
}

"use client";

/**
 * Payment Method Selector Component
 *
 * Comprehensive payment selection with:
 * - Dropdown to select existing payment methods
 * - Option to add new card
 * - Apple Pay / Google Pay support via Express Checkout
 */

import {
	Elements,
	ExpressCheckoutElement,
	useStripe,
} from "@stripe/react-stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import { Apple, CheckCircle2, CreditCard, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
	const [_showNewCardForm, setShowNewCardForm] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Fetch existing payment methods if customer ID is provided
	useEffect(() => {
		async function fetchPaymentMethods() {
			if (!(customerId && stripe)) {
				// If no customer ID, auto-select credit card option
				setSelectedMethod("new-card");
				setShowNewCardForm(true);
				return;
			}

			setIsLoading(true);
			try {
				// Call API to fetch payment methods
				const response = await fetch(
					`/api/payments/methods?customerId=${customerId}`,
				);
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
			} catch (_err) {
				// Default to credit card on error
				setSelectedMethod("new-card");
				setShowNewCardForm(true);
			} finally {
				setIsLoading(false);
			}
		}

		fetchPaymentMethods();
	}, [customerId, stripe, onPaymentMethodSelected]);

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
				<Label
					className="font-semibold text-foreground"
					htmlFor="payment-method"
				>
					Select Payment Method
				</Label>
				<Select onValueChange={handleMethodSelect} value={selectedMethod}>
					<SelectTrigger
						className="border-2 border-input bg-background text-foreground focus:border-ring dark:bg-background/95"
						disabled={isLoading}
						id="payment-method"
					>
						<SelectValue
							placeholder={isLoading ? "Loading..." : "Choose payment method"}
						/>
					</SelectTrigger>
					<SelectContent>
						{/* Existing payment methods from primary org */}
						{paymentMethods.length > 0 && (
							<>
								<div className="px-2 py-1.5 font-semibold text-muted-foreground text-xs">
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
				{selectedMethod &&
					selectedMethod !== "new-card" &&
					selectedMethod !== "apple-pay" &&
					selectedMethod !== "google-pay" && (
						<div className="flex items-center gap-2 rounded-lg border border-success bg-success p-3 text-sm text-success dark:border-success dark:bg-success dark:text-success">
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
							onClick={() => {
								setSelectedMethod("");
								setShowNewCardForm(false);
							}}
							size="sm"
							type="button"
							variant="ghost"
						>
							Cancel
						</Button>
					</div>
					<CustomPaymentForm
						onError={onError}
						onSuccess={handleNewCardSuccess}
						showButton={false}
					/>
				</div>
			)}

			{/* Show Express Checkout for Apple Pay */}
			{selectedMethod === "apple-pay" && (
				<div className="space-y-4 rounded-lg border bg-muted/30 p-4">
					<div className="flex items-center justify-between">
						<h4 className="font-medium text-sm">Apple Pay</h4>
						<Button
							onClick={() => setSelectedMethod("")}
							size="sm"
							type="button"
							variant="ghost"
						>
							Cancel
						</Button>
					</div>
					<ExpressCheckoutElement
						onConfirm={async (event: any) => {
							// Handle Apple Pay confirmation
							if (event.expressPaymentType === "apple_pay") {
								// The payment method will be in event.paymentMethod
								if (event.paymentMethod?.id) {
									handleNewCardSuccess(event.paymentMethod.id);
								}
							}
						}}
						options={{
							buttonType: {
								applePay: "plain",
							},
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
							onClick={() => setSelectedMethod("")}
							size="sm"
							type="button"
							variant="ghost"
						>
							Cancel
						</Button>
					</div>
					<ExpressCheckoutElement
						onConfirm={async (event: any) => {
							// Handle Google Pay confirmation
							if (event.expressPaymentType === "google_pay") {
								// The payment method will be in event.paymentMethod
								if (event.paymentMethod?.id) {
									handleNewCardSuccess(event.paymentMethod.id);
								}
							}
						}}
						options={{
							buttonType: {
								googlePay: "plain",
							},
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
	props: PaymentMethodSelectorProps & { stripe: Stripe | null },
) {
	if (!props.stripe) {
		return (
			<div className="rounded-lg border border-warning bg-warning p-4 text-warning dark:border-warning dark:bg-warning dark:text-warning">
				<p className="text-sm">
					Payment system is not configured. Please contact support.
				</p>
			</div>
		);
	}

	return (
		<Elements stripe={props.stripe}>
			<PaymentMethodSelectorInner {...props} />
		</Elements>
	);
}

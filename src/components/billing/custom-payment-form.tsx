"use client";

/**
 * Custom Payment Form Component
 *
 * Fully custom Stripe payment form with individual Elements:
 * - CardNumber
 * - CardExpiry
 * - CardCvc
 * - Integrated with our design system
 */

import {
	CardCvcElement,
	CardExpiryElement,
	CardNumberElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import type { StripeCardNumberElementChangeEvent } from "@stripe/stripe-js";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type CustomPaymentFormProps = {
	onSuccess: (paymentMethodId: string) => void;
	onError: (error: string) => void;
	buttonText?: string;
	showButton?: boolean;
};

export function CustomPaymentForm({
	onSuccess,
	onError,
	buttonText = "Save Payment Method",
	showButton = true,
}: CustomPaymentFormProps) {
	const stripe = useStripe();
	const elements = useElements();
	const [isProcessing, setIsProcessing] = useState(false);
	const [cardComplete, setCardComplete] = useState(false);
	const [expiryComplete, setExpiryComplete] = useState(false);
	const [cvcComplete, setCvcComplete] = useState(false);
	const [cardError, setCardError] = useState<string | null>(null);

	// Styling for Stripe Elements to match our design system
	const elementOptions = {
		style: {
			base: {
				fontSize: "16px",
				color: "hsl(var(--foreground))",
				fontFamily: "inherit",
				"::placeholder": {
					color: "hsl(var(--muted-foreground))",
				},
			},
			invalid: {
				color: "hsl(var(--destructive))",
			},
		},
	};

	const handleCardChange = (event: StripeCardNumberElementChangeEvent) => {
		setCardComplete(event.complete);
		if (event.error) {
			setCardError(event.error.message);
		} else {
			setCardError(null);
		}
	};

	const handleExpiryChange = (event: any) => {
		setExpiryComplete(event.complete);
	};

	const handleCvcChange = (event: any) => {
		setCvcComplete(event.complete);
	};

	const isFormComplete = cardComplete && expiryComplete && cvcComplete;

	const handleSubmit = async (e?: React.FormEvent) => {
		if (e) {
			e.preventDefault();
		}

		if (!(stripe && elements)) {
			onError("Stripe has not loaded yet. Please try again.");
			return;
		}

		if (!isFormComplete) {
			onError("Please complete all payment fields.");
			return;
		}

		setIsProcessing(true);

		try {
			const cardNumberElement = elements.getElement(CardNumberElement);

			if (!cardNumberElement) {
				throw new Error("Card element not found");
			}

			// Create payment method
			const { error, paymentMethod } = await stripe.createPaymentMethod({
				type: "card",
				card: cardNumberElement,
			});

			if (error) {
				onError(error.message || "Failed to save payment method");
				setIsProcessing(false);
			} else if (paymentMethod) {
				onSuccess(paymentMethod.id);
				setIsProcessing(false);
			}
		} catch (err) {
			onError(
				err instanceof Error ? err.message : "An unexpected error occurred",
			);
			setIsProcessing(false);
		}
	};

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			{/* Card Number */}
			<div className="space-y-2">
				<Label htmlFor="card-number">Card Number</Label>
				<div className="border-input bg-background ring-offset-background focus-within:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none">
					<CardNumberElement
						className="w-full"
						id="card-number"
						onChange={handleCardChange}
						options={elementOptions}
					/>
				</div>
				{cardError && (
					<div className="text-destructive flex items-center gap-1 text-sm">
						<AlertCircle className="size-3" />
						<span>{cardError}</span>
					</div>
				)}
			</div>

			{/* Expiry and CVC */}
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="card-expiry">Expiry Date</Label>
					<div className="border-input bg-background ring-offset-background focus-within:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none">
						<CardExpiryElement
							className="w-full"
							id="card-expiry"
							onChange={handleExpiryChange}
							options={elementOptions}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="card-cvc">CVC</Label>
					<div className="border-input bg-background ring-offset-background focus-within:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none">
						<CardCvcElement
							className="w-full"
							id="card-cvc"
							onChange={handleCvcChange}
							options={elementOptions}
						/>
					</div>
				</div>
			</div>

			{/* Success Indicator */}
			{isFormComplete && !isProcessing && (
				<div className="border-success bg-success text-success dark:border-success dark:bg-success dark:text-success flex items-center gap-2 rounded-lg border p-3 text-sm">
					<CheckCircle2 className="size-4" />
					<span>Payment information is valid</span>
				</div>
			)}

			{/* Optional Submit Button */}
			{showButton && (
				<Button
					className="w-full"
					disabled={!stripe || isProcessing || !isFormComplete}
					type="submit"
				>
					{isProcessing && <Loader2 className="mr-2 size-4 animate-spin" />}
					{isProcessing ? "Processing..." : buttonText}
				</Button>
			)}
		</form>
	);
}

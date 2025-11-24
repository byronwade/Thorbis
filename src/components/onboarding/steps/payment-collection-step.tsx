"use client";

/**
 * Payment Collection Step - Platform Billing Setup
 *
 * Collects payment method for Thorbis platform subscription.
 * Displays itemized cost breakdown and initiates Stripe Checkout.
 *
 * Key Features:
 * - Itemized cost breakdown (one-time + monthly)
 * - 14-day free trial notice
 * - Stripe Checkout integration (card + ACH)
 * - Real-time cost calculation from store selections
 */

import { useState } from "react";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
	CreditCard,
	Building2,
	Shield,
	Calendar,
	Check,
	Loader2,
	AlertCircle,
	Info,
} from "lucide-react";
import {
	calculateOnboardingCosts,
	formatCurrency,
} from "@/lib/pricing/onboarding-fees";
import { createOnboardingCheckoutSession } from "@/actions/onboarding-billing";

type PaymentMethod = "card" | "ach";

export function PaymentCollectionStep() {
	const { data, updateData } = useOnboardingStore();
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Calculate costs based on current selections
	const costs = calculateOnboardingCosts({
		phonePortingCount: data.phonePortingCount || 0,
		newPhoneNumberCount: data.newPhoneNumberCount || 0,
		gmailWorkspaceUsers: data.gmailWorkspaceUsers || 0,
		profitRhinoEnabled: data.profitRhinoEnabled || false,
	});

	const handleCheckout = async () => {
		setIsSubmitting(true);
		setError(null);

		try {
			// TODO: Call server action to create Stripe Checkout session
			// const result = await createCheckoutSession({
			//   phonePortingCount: data.phonePortingCount,
			//   newPhoneNumberCount: data.newPhoneNumberCount,
			//   gmailWorkspaceUsers: data.gmailWorkspaceUsers,
			//   profitRhinoEnabled: data.profitRhinoEnabled,
			//   paymentMethod: selectedMethod,
			// });

			// if (result.success) {
			//   window.location.href = result.checkoutUrl;
			// } else {
			//   setError(result.error);
			// }

			// For now, simulate checkout
			await new Promise((resolve) => setTimeout(resolve, 1500));
			console.log("Creating checkout session with method:", selectedMethod);

			// In production, this would redirect to Stripe Checkout
			// For now, mark as collected
			updateData({ paymentMethodCollected: true });
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to start checkout"
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">Payment setup</h2>
				<p className="text-muted-foreground">
					Start your 14-day free trial. Your card won't be charged until the trial
					ends.
				</p>
			</div>

			{/* Cost Breakdown Card */}
			<Card className="p-6 space-y-6">
				<div className="space-y-4">
					<h3 className="font-semibold">Your subscription</h3>

					{/* One-time charges */}
					{costs.oneTime.total > 0 && (
						<>
							<div className="space-y-3">
								<p className="text-sm font-medium text-muted-foreground">
									One-time setup fees
								</p>

								{costs.oneTime.phonePorting > 0 && (
									<div className="flex justify-between text-sm">
										<span>
											Phone number porting ({data.phonePortingCount}{" "}
											{data.phonePortingCount === 1 ? "number" : "numbers"})
										</span>
										<span className="font-medium">
											{formatCurrency(costs.oneTime.phonePorting)}
										</span>
									</div>
								)}

								{costs.oneTime.phoneSetup > 0 && (
									<div className="flex justify-between text-sm">
										<span>
											New phone number setup ({data.newPhoneNumberCount}{" "}
											{data.newPhoneNumberCount === 1 ? "number" : "numbers"})
										</span>
										<span className="font-medium">
											{formatCurrency(costs.oneTime.phoneSetup)}
										</span>
									</div>
								)}

								<div className="flex justify-between text-sm font-semibold pt-2 border-t">
									<span>One-time total</span>
									<span>{formatCurrency(costs.oneTime.total)}</span>
								</div>
							</div>

							<Separator />
						</>
					)}

					{/* Monthly recurring charges */}
					<div className="space-y-3">
						<p className="text-sm font-medium text-muted-foreground">
							Monthly subscription
						</p>

						<div className="flex justify-between text-sm">
							<span>Base platform</span>
							<span className="font-medium">
								{formatCurrency(costs.monthly.basePlatform)}
							</span>
						</div>

						{costs.monthly.phoneNumbers > 0 && (
							<div className="flex justify-between text-sm">
								<span>
									Phone numbers ({data.newPhoneNumberCount}{" "}
									{data.newPhoneNumberCount === 1 ? "number" : "numbers"})
								</span>
								<span className="font-medium">
									{formatCurrency(costs.monthly.phoneNumbers)}
								</span>
							</div>
						)}

						{costs.monthly.gmailWorkspace > 0 && (
							<div className="flex justify-between text-sm">
								<span>
									Gmail Workspace ({data.gmailWorkspaceUsers}{" "}
									{data.gmailWorkspaceUsers === 1 ? "user" : "users"})
								</span>
								<span className="font-medium">
									{formatCurrency(costs.monthly.gmailWorkspace)}
								</span>
							</div>
						)}

						{costs.monthly.profitRhino > 0 && (
							<div className="flex justify-between text-sm">
								<span>Profit Rhino financing add-on</span>
								<span className="font-medium">
									{formatCurrency(costs.monthly.profitRhino)}
								</span>
							</div>
						)}

						<div className="flex justify-between text-sm font-semibold pt-2 border-t">
							<span>Monthly total</span>
							<span>{formatCurrency(costs.monthly.total)}</span>
						</div>
					</div>

					<Separator />

					{/* Grand total */}
					<div className="flex justify-between text-lg font-bold">
						<span>Total due after trial</span>
						<span>{formatCurrency(costs.firstMonthTotal)}</span>
					</div>
				</div>
			</Card>

			{/* Trial Notice */}
			<div className="flex items-start gap-3 bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-lg p-4">
				<Calendar className="h-5 w-5 flex-shrink-0 mt-0.5" />
				<div className="text-sm space-y-1">
					<p className="font-medium">14-day free trial</p>
					<p>
						Your payment method will be saved but not charged until{" "}
						<span className="font-semibold">
							{new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(
								"en-US",
								{ month: "long", day: "numeric", year: "numeric" }
							)}
						</span>
						. Cancel anytime before then at no charge.
					</p>
				</div>
			</div>

			{/* Payment Method Selection */}
			<div className="space-y-4">
				<label className="text-sm font-medium">Choose payment method</label>

				<div className="grid gap-3">
					{/* Credit/Debit Card */}
					<button
						type="button"
						onClick={() => setSelectedMethod("card")}
						className={cn(
							"relative flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-all",
							selectedMethod === "card"
								? "border-primary bg-primary/5"
								: "border-transparent bg-muted/40 hover:bg-muted/60"
						)}
					>
						{selectedMethod === "card" && (
							<div className="absolute top-3 right-3">
								<Check className="h-4 w-4 text-primary" />
							</div>
						)}
						<div
							className={cn(
								"flex h-10 w-10 items-center justify-center rounded-full",
								selectedMethod === "card"
									? "bg-primary text-primary-foreground"
									: "bg-muted"
							)}
						>
							<CreditCard className="h-5 w-5" />
						</div>
						<div>
							<p className="font-medium">Credit or debit card</p>
							<p className="text-sm text-muted-foreground">
								Visa, Mastercard, Amex, Discover
							</p>
						</div>
					</button>

					{/* ACH Bank Transfer */}
					<button
						type="button"
						onClick={() => setSelectedMethod("ach")}
						className={cn(
							"relative flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-all",
							selectedMethod === "ach"
								? "border-primary bg-primary/5"
								: "border-transparent bg-muted/40 hover:bg-muted/60"
						)}
					>
						{selectedMethod === "ach" && (
							<div className="absolute top-3 right-3">
								<Check className="h-4 w-4 text-primary" />
							</div>
						)}
						<div
							className={cn(
								"flex h-10 w-10 items-center justify-center rounded-full",
								selectedMethod === "ach"
									? "bg-primary text-primary-foreground"
									: "bg-muted"
							)}
						>
							<Building2 className="h-5 w-5" />
						</div>
						<div>
							<p className="font-medium">Bank account (ACH)</p>
							<p className="text-sm text-muted-foreground">
								Direct debit from your bank
							</p>
						</div>
					</button>
				</div>
			</div>

			{/* Security Notice */}
			<div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/40 rounded-lg p-4">
				<Shield className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
				<div>
					<p className="font-medium text-foreground">Secure payment processing</p>
					<p>
						Powered by Stripe. Your payment information is encrypted and never
						stored on our servers. PCI DSS Level 1 certified.
					</p>
				</div>
			</div>

			{/* Error Display */}
			{error && (
				<div className="flex items-start gap-3 bg-destructive/10 rounded-lg p-4">
					<AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
					<div className="text-sm">
						<p className="font-medium text-destructive">{error}</p>
					</div>
				</div>
			)}

			{/* Checkout Button */}
			<Button
				size="lg"
				className="w-full"
				onClick={handleCheckout}
				disabled={isSubmitting}
			>
				{isSubmitting ? (
					<>
						<Loader2 className="mr-2 h-5 w-5 animate-spin" />
						Starting checkout...
					</>
				) : (
					<>
						Continue to secure checkout
						<Shield className="ml-2 h-5 w-5" />
					</>
				)}
			</Button>

			{/* Info Note */}
			<div className="flex items-start gap-2 text-xs text-muted-foreground">
				<Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
				<p>
					By continuing, you agree to our Terms of Service and Privacy Policy. You
					can cancel your subscription anytime from Settings → Billing.
				</p>
			</div>
		</div>
	);
}

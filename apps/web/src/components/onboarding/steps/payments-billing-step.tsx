"use client";

/**
 * Payments & Billing Step - Consolidated customer payments and platform billing
 *
 * This step handles all payment-related setup in one place:
 * - Section 1: Customer Payment Methods (how customers pay you)
 * - Section 2: Platform Subscription (Stripe billing for Thorbis)
 */

import {
	AlertTriangle,
	ArrowRight,
	Banknote,
	Building2,
	Calendar,
	Camera,
	Check,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	CreditCard,
	Info,
	Landmark,
	Loader2,
	Percent,
	Shield,
	SkipForward,
	Smartphone,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { createOnboardingCheckoutSession } from "@/actions/onboarding-billing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
	calculateOnboardingCosts,
	formatCurrency,
} from "@/lib/onboarding/onboarding-fees";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { cn } from "@/lib/utils";

type SectionId = "customer-payments" | "platform-billing";
type PaymentMethod = "check-capture" | "ach" | "cards" | "cash" | "financing";
type PlatformPaymentMethod = "card" | "ach";

interface SectionState {
	expanded: boolean;
	completed: boolean;
}

const PAYMENT_METHODS: {
	id: PaymentMethod;
	title: string;
	description: string;
	icon: React.ElementType;
	fees?: string;
	badge?: string;
	recommended?: boolean;
}[] = [
	{
		id: "check-capture",
		title: "Mobile Check Capture",
		description: "Snap photos of checks, instant deposit",
		icon: Camera,
		badge: "Popular",
		recommended: true,
	},
	{
		id: "ach",
		title: "Bank Transfers (ACH)",
		description: "Direct bank-to-bank via Plaid",
		icon: Building2,
		fees: "0.8% (max $5)",
	},
	{
		id: "cards",
		title: "Credit & Debit Cards",
		description: "Visa, Mastercard, Amex, Discover",
		icon: CreditCard,
		fees: "2.9% + 30¢",
	},
	{
		id: "cash",
		title: "Cash Payments",
		description: "Track field cash collections",
		icon: Banknote,
	},
	{
		id: "financing",
		title: "Customer Financing",
		description: "Payment plans for large jobs",
		icon: Percent,
	},
];

export function PaymentsBillingStep() {
	const { data, updateData } = useOnboardingStore();

	// Track which sections are expanded
	const [sections, setSections] = useState<Record<SectionId, SectionState>>({
		"customer-payments": {
			expanded: true,
			completed: data.plaidConnected || (data.paymentMethods?.length || 0) > 0,
		},
		"platform-billing": {
			expanded: false,
			completed: data.paymentMethodCollected || false,
		},
	});

	// Customer payments state
	const [connectingBank, setConnectingBank] = useState(false);
	const bankConnected = data.plaidConnected || false;

	// Platform billing state
	const [selectedPlatformMethod, setSelectedPlatformMethod] =
		useState<PlatformPaymentMethod>("card");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const toggleSection = (id: SectionId) => {
		setSections((prev) => ({
			...prev,
			[id]: { ...prev[id], expanded: !prev[id].expanded },
		}));
	};

	const markSectionComplete = (id: SectionId) => {
		setSections((prev) => ({
			...prev,
			[id]: { ...prev[id], completed: true, expanded: false },
		}));
		// Auto-expand next section
		if (id === "customer-payments") {
			setSections((prev) => ({
				...prev,
				"platform-billing": { ...prev["platform-billing"], expanded: true },
			}));
		}
	};

	// Customer payment helpers
	const togglePaymentMethod = (method: PaymentMethod, enabled: boolean) => {
		const current = data.paymentMethods || [];
		const updated = enabled
			? [...current, method]
			: current.filter((m) => m !== method);
		updateData({ paymentMethods: updated });
	};

	const isMethodEnabled = (method: PaymentMethod) => {
		return (data.paymentMethods || []).includes(method);
	};

	const connectBankAccount = async () => {
		setConnectingBank(true);
		// Simulate Plaid connection
		await new Promise((resolve) => setTimeout(resolve, 1500));
		updateData({ plaidConnected: true, paymentSetupComplete: true });
		setConnectingBank(false);
	};

	const enableQuickSetup = () => {
		updateData({
			paymentMethods: ["check-capture", "ach", "cards", "cash"],
			acceptCards: true,
			acceptACH: true,
			acceptChecks: true,
			acceptCash: true,
		});
	};

	// Platform billing helpers
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
			const companyId = data.companyId || "";
			const teamMemberId = data.teamMemberId || "";

			if (!companyId || !teamMemberId) {
				setError("Missing company or user information. Please log in again.");
				return;
			}

			const baseUrl = window.location.origin;
			const successUrl = `${baseUrl}/onboarding/payment/success?session_id={CHECKOUT_SESSION_ID}&company_id=${companyId}`;
			const cancelUrl = `${baseUrl}/onboarding/payment/cancel`;

			const result = await createOnboardingCheckoutSession({
				companyId,
				teamMemberId,
				selections: {
					phonePortingCount: data.phonePortingCount || 0,
					newPhoneNumberCount: data.newPhoneNumberCount || 0,
					gmailWorkspaceUsers: data.gmailWorkspaceUsers || 0,
					profitRhinoEnabled: data.profitRhinoEnabled || false,
				},
				successUrl,
				cancelUrl,
			});

			if (result.success && result.checkoutUrl) {
				window.location.href = result.checkoutUrl;
			} else {
				setError(result.error || "Failed to create checkout session");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to start checkout");
		} finally {
			setIsSubmitting(false);
		}
	};

	const enabledCount = (data.paymentMethods || []).length;
	const completedCount = Object.values(sections).filter((s) => s.completed).length;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">Payments Setup</h2>
				<p className="text-muted-foreground">
					Set up how you accept payments and start your platform subscription.
				</p>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<CheckCircle2 className="h-4 w-4 text-green-500" />
					<span>{completedCount} of 2 sections complete</span>
				</div>
			</div>

			{/* Section 1: Customer Payments */}
			<Card
				className={cn(
					sections["customer-payments"].completed &&
						"border-green-200 bg-green-50/50"
				)}
			>
				<CardHeader
					className="cursor-pointer"
					onClick={() => toggleSection("customer-payments")}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div
								className={cn(
									"p-2 rounded-lg",
									sections["customer-payments"].completed
										? "bg-green-100 text-green-600"
										: "bg-muted text-muted-foreground"
								)}
							>
								<CreditCard className="h-5 w-5" />
							</div>
							<div>
								<CardTitle className="text-lg flex items-center gap-2">
									Customer Payments
									{sections["customer-payments"].completed && (
										<Badge
											variant="secondary"
											className="bg-green-100 text-green-700"
										>
											Done
										</Badge>
									)}
								</CardTitle>
								<CardDescription>
									How your customers will pay you
								</CardDescription>
							</div>
						</div>
						{sections["customer-payments"].expanded ? (
							<ChevronUp className="h-5 w-5 text-muted-foreground" />
						) : (
							<ChevronDown className="h-5 w-5 text-muted-foreground" />
						)}
					</div>
				</CardHeader>
				{sections["customer-payments"].expanded && (
					<CardContent className="space-y-6 pt-0">
						{/* Bank Connection */}
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
									<span className="text-xs font-medium text-primary">1</span>
								</div>
								<span className="text-sm font-medium">
									Connect your bank account
								</span>
							</div>

							{!bankConnected ? (
								<div className="rounded-lg border-2 border-dashed border-muted-foreground/20 p-4">
									<div className="flex items-start gap-3">
										<Landmark className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
										<div className="flex-1 space-y-3">
											<p className="text-sm text-muted-foreground">
												Connect where customer payments will be deposited.
											</p>
											<Button
												onClick={connectBankAccount}
												disabled={connectingBank}
												size="sm"
											>
												{connectingBank ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														Connecting...
													</>
												) : (
													<>
														<Shield className="mr-2 h-4 w-4" />
														Connect via Plaid
													</>
												)}
											</Button>
										</div>
									</div>
								</div>
							) : (
								<div className="rounded-lg bg-green-500/10 p-3 flex items-center gap-3">
									<CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
									<span className="text-sm font-medium text-green-700 dark:text-green-400">
										Bank account connected
									</span>
								</div>
							)}
						</div>

						{/* Payment Methods */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
										<span className="text-xs font-medium text-primary">2</span>
									</div>
									<span className="text-sm font-medium">
										Choose payment methods
									</span>
								</div>
								{enabledCount === 0 && (
									<Button
										variant="outline"
										size="sm"
										onClick={enableQuickSetup}
										disabled={!bankConnected}
									>
										<Zap className="mr-1 h-3 w-3" />
										Quick Setup
									</Button>
								)}
							</div>

							<div className="space-y-2">
								{PAYMENT_METHODS.slice(0, 4).map((method) => {
									const Icon = method.icon;
									const enabled = isMethodEnabled(method.id);

									return (
										<div
											key={method.id}
											className={cn(
												"flex items-center gap-3 rounded-lg p-3 transition-colors",
												enabled ? "bg-primary/10" : "bg-muted/40",
												!bankConnected && "opacity-50"
											)}
										>
											<Icon
												className={cn(
													"h-4 w-4 flex-shrink-0",
													enabled ? "text-primary" : "text-muted-foreground"
												)}
											/>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium">{method.title}</p>
												<p className="text-xs text-muted-foreground">
													{method.description}
													{method.fees && ` • ${method.fees}`}
												</p>
											</div>
											<Switch
												checked={enabled}
												disabled={!bankConnected}
												onCheckedChange={(v) =>
													togglePaymentMethod(method.id, v)
												}
											/>
										</div>
									);
								})}
							</div>
						</div>

						<div className="flex justify-end gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => markSectionComplete("customer-payments")}
							>
								<SkipForward className="h-4 w-4 mr-1" />
								Skip
							</Button>
							<Button
								size="sm"
								onClick={() => markSectionComplete("customer-payments")}
								disabled={!bankConnected && enabledCount === 0}
							>
								Continue
								<ArrowRight className="h-4 w-4 ml-1" />
							</Button>
						</div>
					</CardContent>
				)}
			</Card>

			{/* Section 2: Platform Billing */}
			<Card
				className={cn(
					sections["platform-billing"].completed &&
						"border-green-200 bg-green-50/50"
				)}
			>
				<CardHeader
					className="cursor-pointer"
					onClick={() => toggleSection("platform-billing")}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div
								className={cn(
									"p-2 rounded-lg",
									sections["platform-billing"].completed
										? "bg-green-100 text-green-600"
										: "bg-muted text-muted-foreground"
								)}
							>
								<Shield className="h-5 w-5" />
							</div>
							<div>
								<CardTitle className="text-lg flex items-center gap-2">
									Platform Subscription
									{sections["platform-billing"].completed && (
										<Badge
											variant="secondary"
											className="bg-green-100 text-green-700"
										>
											Done
										</Badge>
									)}
								</CardTitle>
								<CardDescription>
									Start your 14-day free trial
								</CardDescription>
							</div>
						</div>
						{sections["platform-billing"].expanded ? (
							<ChevronUp className="h-5 w-5 text-muted-foreground" />
						) : (
							<ChevronDown className="h-5 w-5 text-muted-foreground" />
						)}
					</div>
				</CardHeader>
				{sections["platform-billing"].expanded && (
					<CardContent className="space-y-6 pt-0">
						{/* Cost Breakdown */}
						<div className="rounded-lg bg-muted/40 p-4 space-y-4">
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Base platform</span>
									<span className="font-medium">
										{formatCurrency(costs.monthly.basePlatform)}/mo
									</span>
								</div>
								{costs.monthly.phoneNumbers > 0 && (
									<div className="flex justify-between text-sm">
										<span>Phone numbers</span>
										<span className="font-medium">
											{formatCurrency(costs.monthly.phoneNumbers)}/mo
										</span>
									</div>
								)}
								{costs.oneTime.total > 0 && (
									<div className="flex justify-between text-sm text-muted-foreground">
										<span>One-time setup</span>
										<span>{formatCurrency(costs.oneTime.total)}</span>
									</div>
								)}
								<Separator />
								<div className="flex justify-between font-semibold">
									<span>After trial</span>
									<span>{formatCurrency(costs.monthly.total)}/mo</span>
								</div>
							</div>
						</div>

						{/* Trial Notice */}
						<div className="flex items-start gap-3 bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-lg p-3">
							<Calendar className="h-4 w-4 flex-shrink-0 mt-0.5" />
							<p className="text-sm">
								<span className="font-medium">14-day free trial</span> - Your
								card won't be charged until{" "}
								{new Date(
									Date.now() + 14 * 24 * 60 * 60 * 1000
								).toLocaleDateString("en-US", {
									month: "long",
									day: "numeric",
								})}
							</p>
						</div>

						{/* Payment Method Selection */}
						<div className="space-y-3">
							<label className="text-sm font-medium">Payment method</label>
							<div className="grid gap-2 sm:grid-cols-2">
								<button
									type="button"
									onClick={() => setSelectedPlatformMethod("card")}
									className={cn(
										"relative flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all",
										selectedPlatformMethod === "card"
											? "border-primary bg-primary/5"
											: "border-transparent bg-muted/40"
									)}
								>
									{selectedPlatformMethod === "card" && (
										<Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
									)}
									<CreditCard className="h-4 w-4" />
									<span className="text-sm font-medium">Card</span>
								</button>
								<button
									type="button"
									onClick={() => setSelectedPlatformMethod("ach")}
									className={cn(
										"relative flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all",
										selectedPlatformMethod === "ach"
											? "border-primary bg-primary/5"
											: "border-transparent bg-muted/40"
									)}
								>
									{selectedPlatformMethod === "ach" && (
										<Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
									)}
									<Building2 className="h-4 w-4" />
									<span className="text-sm font-medium">Bank (ACH)</span>
								</button>
							</div>
						</div>

						{/* Error Display */}
						{error && (
							<div className="flex items-start gap-3 bg-destructive/10 rounded-lg p-3">
								<AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
								<p className="text-sm text-destructive">{error}</p>
							</div>
						)}

						{/* Checkout Button */}
						<Button
							className="w-full"
							onClick={handleCheckout}
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Starting checkout...
								</>
							) : (
								<>
									Start Free Trial
									<Shield className="ml-2 h-4 w-4" />
								</>
							)}
						</Button>

						{/* Security Note */}
						<p className="text-xs text-center text-muted-foreground">
							Secure payment via Stripe. Cancel anytime.
						</p>
					</CardContent>
				)}
			</Card>
		</div>
	);
}

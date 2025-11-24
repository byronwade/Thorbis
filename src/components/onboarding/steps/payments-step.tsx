"use client";

/**
 * Payments Step - Payment Processing Setup
 *
 * Sets up payment acceptance:
 * - Stripe integration for cards
 * - ACH/bank transfers
 * - Check acceptance
 * - Cash tracking
 * - Financing options
 */

import { useState } from "react";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { InfoCard, ExpandableInfo } from "@/components/onboarding/info-cards/walkthrough-slide";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
	CreditCard,
	Building2,
	Banknote,
	Receipt,
	Percent,
	Shield,
	CheckCircle2,
	ExternalLink,
	Sparkles,
	Clock,
	DollarSign,
	ArrowRight,
	SkipForward,
	Wallet,
	TrendingUp,
	AlertTriangle,
} from "lucide-react";

type PaymentMethod = "cards" | "ach" | "checks" | "cash" | "financing";

const PAYMENT_METHODS: {
	id: PaymentMethod;
	title: string;
	description: string;
	icon: React.ElementType;
	fees?: string;
	timing: string;
	popular?: boolean;
}[] = [
	{
		id: "cards",
		title: "Credit & Debit Cards",
		description: "Accept Visa, Mastercard, Amex, Discover",
		icon: CreditCard,
		fees: "2.9% + 30¢",
		timing: "Instant authorization, 2-day payout",
		popular: true,
	},
	{
		id: "ach",
		title: "Bank Transfers (ACH)",
		description: "Direct bank-to-bank payments",
		icon: Building2,
		fees: "0.8% (max $5)",
		timing: "3-5 business days",
	},
	{
		id: "checks",
		title: "Check Payments",
		description: "Accept and track check payments",
		icon: Receipt,
		fees: "No processing fees",
		timing: "Manual deposit",
	},
	{
		id: "cash",
		title: "Cash Payments",
		description: "Track cash collected in the field",
		icon: Banknote,
		fees: "No processing fees",
		timing: "Immediate",
	},
	{
		id: "financing",
		title: "Customer Financing",
		description: "Offer payment plans for large jobs",
		icon: Percent,
		fees: "Varies by plan",
		timing: "You get paid upfront",
	},
];

export function PaymentsStep() {
	const { data, updateData } = useOnboardingStore();
	const [connecting, setConnecting] = useState(false);

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

	const connectStripe = async () => {
		setConnecting(true);
		// Simulate Stripe OAuth
		await new Promise((resolve) => setTimeout(resolve, 2000));
		updateData({ stripeConnected: true });
		togglePaymentMethod("cards", true);
		togglePaymentMethod("ach", true);
		setConnecting(false);
	};

	const skipStep = () => {
		updateData({ paymentMethods: [] });
	};

	return (
		<div className="space-y-6 max-w-2xl">
			<div>
				<h2 className="text-xl font-semibold">Set up payments</h2>
				<p className="text-sm text-muted-foreground">
					Get paid faster with integrated payment processing. Accept payments in the field or send payment links.
				</p>
			</div>

			{/* Benefits Info */}
			<InfoCard
				icon={<Sparkles className="h-5 w-5" />}
				title="Why accept payments through Thorbis?"
				description="Integrated payments mean faster collections and less manual work."
				bullets={[
					"Get paid 2x faster than invoicing separately",
					"Automatic payment reminders",
					"Real-time deposit tracking",
					"Accept payments from the mobile app",
				]}
				variant="tip"
			/>

			{/* Stripe Connection */}
			<div className="rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-5 space-y-4">
				<div className="flex items-start gap-4">
					<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 flex-shrink-0">
						<Wallet className="h-6 w-6 text-primary" />
					</div>
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1">
							<h3 className="font-semibold">Connect with Stripe</h3>
							{data.stripeConnected && (
								<Badge variant="default" className="bg-green-500">
									<CheckCircle2 className="mr-1 h-3 w-3" />
									Connected
								</Badge>
							)}
						</div>
						<p className="text-sm text-muted-foreground">
							Stripe powers card and ACH payments. Secure, PCI-compliant, trusted by millions of businesses.
						</p>
					</div>
				</div>

				{!data.stripeConnected ? (
					<Button
						onClick={connectStripe}
						disabled={connecting}
						className="w-full"
					>
						{connecting ? (
							<>
								<Clock className="mr-2 h-4 w-4 animate-spin" />
								Connecting to Stripe...
							</>
						) : (
							<>
								<ExternalLink className="mr-2 h-4 w-4" />
								Connect Stripe Account
							</>
						)}
					</Button>
				) : (
					<div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
						<CheckCircle2 className="h-4 w-4 flex-shrink-0" />
						<span>
							Stripe connected! You can now accept card and ACH payments.
						</span>
					</div>
				)}

				<p className="text-xs text-muted-foreground text-center">
					Takes about 10 minutes. You'll need your bank details for payouts.
				</p>
			</div>

			{/* Payment Methods */}
			<div className="space-y-3">
				<h3 className="font-semibold">Payment Methods</h3>

				{PAYMENT_METHODS.map((method) => {
					const Icon = method.icon;
					const enabled = isMethodEnabled(method.id);
					const requiresStripe = method.id === "cards" || method.id === "ach";
					const locked = requiresStripe && !data.stripeConnected;

					return (
						<div
							key={method.id}
							className={cn(
								"rounded-xl p-4 transition-all",
								enabled
									? "bg-primary/10 ring-1 ring-primary/30"
									: "bg-muted/30",
								locked && "opacity-60"
							)}
						>
							<div className="flex items-start gap-4">
								<div className={cn(
									"flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 transition-colors",
									enabled ? "bg-primary text-primary-foreground" : "bg-muted"
								)}>
									<Icon className="h-5 w-5" />
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<p className="font-medium">{method.title}</p>
										{method.popular && (
											<Badge variant="secondary" className="text-xs">Popular</Badge>
										)}
									</div>
									<p className="text-sm text-muted-foreground">{method.description}</p>
									<div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
										{method.fees && (
											<span className="flex items-center gap-1">
												<DollarSign className="h-3 w-3" />
												{method.fees}
											</span>
										)}
										<span className="flex items-center gap-1">
											<Clock className="h-3 w-3" />
											{method.timing}
										</span>
									</div>
								</div>

								<Switch
									checked={enabled}
									onCheckedChange={(v) => togglePaymentMethod(method.id, v)}
									disabled={locked}
								/>
							</div>

							{locked && (
								<p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
									<AlertTriangle className="h-3 w-3" />
									Connect Stripe above to enable this method
								</p>
							)}
						</div>
					);
				})}
			</div>

			{/* Financing Details */}
			{isMethodEnabled("financing") && (
				<div className="rounded-xl bg-muted/30 p-5 space-y-4">
					<h3 className="font-semibold">Customer Financing Options</h3>
					<p className="text-sm text-muted-foreground">
						Offer flexible payment plans for larger jobs. You get paid in full upfront while customers pay over time.
					</p>
					<div className="grid gap-3 sm:grid-cols-2">
						<div className="rounded-lg bg-background p-3">
							<p className="font-medium text-sm">6-Month Plan</p>
							<p className="text-xs text-muted-foreground">0% APR for qualified customers</p>
						</div>
						<div className="rounded-lg bg-background p-3">
							<p className="font-medium text-sm">12-Month Plan</p>
							<p className="text-xs text-muted-foreground">Low APR financing</p>
						</div>
						<div className="rounded-lg bg-background p-3">
							<p className="font-medium text-sm">24-Month Plan</p>
							<p className="text-xs text-muted-foreground">Extended payment terms</p>
						</div>
						<div className="rounded-lg bg-background p-3">
							<p className="font-medium text-sm">Buy Now, Pay Later</p>
							<p className="text-xs text-muted-foreground">Split into 4 payments</p>
						</div>
					</div>
					<p className="text-xs text-muted-foreground">
						Financing details will be configured after setup completion.
					</p>
				</div>
			)}

			{/* Stats Preview */}
			{(data.paymentMethods?.length ?? 0) > 0 && (
				<div className="rounded-xl bg-muted/30 p-4 space-y-3">
					<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
						Payment Summary
					</p>
					<div className="flex items-center justify-between">
						<span className="text-sm">Enabled payment methods</span>
						<span className="font-semibold">{data.paymentMethods?.length || 0}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm">Stripe status</span>
						<span className={cn(
							"text-sm font-medium",
							data.stripeConnected ? "text-green-500" : "text-amber-500"
						)}>
							{data.stripeConnected ? "Connected" : "Not connected"}
						</span>
					</div>
				</div>
			)}

			{/* Expandable: Processing Fees */}
			<ExpandableInfo title="Understanding payment processing fees">
				<div className="space-y-3">
					<p>
						Payment processing fees are charged by the payment networks (Visa, Mastercard, banks) and are standard across all software platforms.
					</p>
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span>Credit/Debit Cards</span>
							<span className="font-mono">2.9% + $0.30</span>
						</div>
						<div className="flex justify-between text-sm">
							<span>ACH Bank Transfer</span>
							<span className="font-mono">0.8% (max $5)</span>
						</div>
						<div className="flex justify-between text-sm">
							<span>Check/Cash</span>
							<span className="font-mono">$0.00</span>
						</div>
					</div>
					<p className="text-muted-foreground">
						<strong>Tip:</strong> For large invoices ($500+), encouraging ACH payment can save you significant fees.
					</p>
				</div>
			</ExpandableInfo>

			{/* Security Badge */}
			<div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
				<Shield className="h-4 w-4" />
				<span>PCI-DSS compliant • Bank-level encryption • SOC 2 certified</span>
			</div>

			{/* Skip Option */}
			<div className="text-center">
				<button
					onClick={skipStep}
					className="text-sm text-muted-foreground hover:text-foreground"
				>
					Skip for now — set up payments later
				</button>
			</div>
		</div>
	);
}

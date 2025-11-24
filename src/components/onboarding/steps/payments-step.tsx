"use client";

/**
 * Payments Step - Complete Payment Setup
 *
 * Two distinct sections:
 * 1. WHERE PAYMENTS GO - Connect your bank account (where money is deposited)
 * 2. HOW TO ACCEPT PAYMENTS - Enable payment methods (how customers pay)
 *
 * Note: Stripe is ONLY for Thorbis platform billing, not customer payments.
 */

import { useState } from "react";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
	CreditCard,
	Building2,
	Banknote,
	Percent,
	Camera,
	Smartphone,
	Shield,
	Zap,
	CheckCircle2,
	Loader2,
	ArrowRight,
	Landmark,
	AlertTriangle,
	Info,
} from "lucide-react";
import { PlaidVerificationTracker } from "@/components/onboarding/status-tracking/plaid-verification-tracker";

type PaymentMethod = "check-capture" | "ach" | "cards" | "cash" | "financing";

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

export function PaymentsStep() {
	const { data, updateData } = useOnboardingStore();
	const [connectingPlaid, setConnectingPlaid] = useState(false);
	const [connectingBank, setConnectingBank] = useState(false);
	const [plaidInitiated, setPlaidInitiated] = useState(false);
	const [plaidItemId, setPlaidItemId] = useState<string | undefined>(undefined);

	const bankConnected = data.plaidConnected || false;
	const [showBankForm, setShowBankForm] = useState(!bankConnected && !plaidInitiated);

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

		// In production, this would:
		// 1. Call createPlaidLinkToken() action
		// 2. Open Plaid Link UI
		// 3. User selects bank and logs in
		// 4. Get public token from Plaid
		// 5. Call exchangePlaidToken() action
		// 6. Store access token and fetch accounts

		// For now, simulate the connection process
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// Mock Plaid item ID (would come from real Plaid API)
		const mockItemId = `item_${Date.now()}`;
		setPlaidItemId(mockItemId);
		setPlaidInitiated(true);
		setConnectingBank(false);

		// Don't set plaidConnected yet - let the tracker do that
		// after it verifies the accounts
	};

	const connectPlaidForACH = async () => {
		setConnectingPlaid(true);
		// Simulate Plaid connection for ACH verification
		await new Promise((resolve) => setTimeout(resolve, 1500));
		togglePaymentMethod("ach", true);
		updateData({ acceptACH: true });
		setConnectingPlaid(false);
	};

	const enableQuickSetup = () => {
		// Auto-enable recommended payment methods
		updateData({
			paymentMethods: ["check-capture", "ach", "cards", "cash"],
			acceptCards: true,
			acceptACH: true,
			acceptChecks: true,
			acceptCash: true,
		});
	};

	const enabledCount = (data.paymentMethods || []).length;

	return (
		<div className="space-y-10">
			{/* Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">Payment Setup</h2>
				<p className="text-muted-foreground">
					Connect your bank account and choose how you want to accept payments.
				</p>
			</div>

			{/* SECTION 1: WHERE PAYMENTS GO */}
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
						<span className="text-sm font-medium text-primary">1</span>
					</div>
					<div>
						<h3 className="text-lg font-semibold">Where payments go</h3>
						<p className="text-sm text-muted-foreground">
							Connect your business bank account to receive deposits
						</p>
					</div>
				</div>

				{/* Bank Connection Status */}
				{!bankConnected && !plaidInitiated ? (
					<div className="rounded-lg border-2 border-dashed border-muted-foreground/20 p-6 space-y-4">
						<div className="flex items-start gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
								<Landmark className="h-6 w-6 text-primary" />
							</div>
							<div className="flex-1">
								<h4 className="font-medium">Connect your bank account</h4>
								<p className="text-sm text-muted-foreground mt-1">
									All customer payments will be deposited here. We use Plaid for secure bank connections.
								</p>
							</div>
						</div>

						{showBankForm && (
							<div className="space-y-4 pt-2">
								<div className="flex items-start gap-3 text-sm bg-amber-500/10 rounded-lg p-3">
									<Info className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
									<p className="text-muted-foreground">
										This is your business receiving account - NOT for platform billing.
										All payments from customers will be deposited here.
									</p>
								</div>

								<Button
									onClick={connectBankAccount}
									disabled={connectingBank}
									className="w-full"
									size="lg"
								>
									{connectingBank ? (
										<>
											<Loader2 className="mr-2 h-5 w-5 animate-spin" />
											Connecting to Plaid...
										</>
									) : (
										<>
											<Shield className="mr-2 h-5 w-5" />
											Connect Bank Account via Plaid
										</>
									)}
								</Button>

								<p className="text-xs text-center text-muted-foreground">
									Plaid uses bank-level security. Your login credentials are never stored.
								</p>
							</div>
						)}
					</div>
				) : plaidInitiated && !bankConnected ? (
					/* Show Plaid Verification Tracker */
					<div className="rounded-lg border-2 border-primary/20 p-6">
						<PlaidVerificationTracker
							companyId={data.companyId || ""}
							plaidItemId={plaidItemId}
							onVerificationComplete={(accounts) => {
								updateData({
									plaidConnected: true,
									paymentSetupComplete: true,
								});
							}}
						/>
					</div>
				) : (
					<div className="rounded-lg bg-green-500/10 p-4 space-y-3">
						<div className="flex items-center gap-3">
							<CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
							<div className="flex-1">
								<span className="font-medium text-green-700 dark:text-green-400">
									Bank account connected
								</span>
								<p className="text-sm text-muted-foreground mt-1">
									Payments will be deposited to your connected bank account
								</p>
							</div>
						</div>

						{/* Payout Schedule Info */}
						<div className="flex items-start gap-3 text-sm bg-muted/40 rounded-lg p-3">
							<Zap className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
							<div>
								<p className="font-medium">Automatic daily deposits</p>
								<p className="text-muted-foreground">
									Funds are deposited every business day. You can change this in Settings.
								</p>
							</div>
						</div>

						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setShowBankForm(true);
								setPlaidInitiated(false);
								updateData({ plaidConnected: false });
							}}
						>
							Change bank account
						</Button>
					</div>
				)}
			</div>

			{/* Warning if bank not connected but trying to enable methods */}
			{!bankConnected && enabledCount > 0 && (
				<div className="flex items-start gap-3 text-sm bg-amber-500/10 rounded-lg p-4">
					<AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
					<div>
						<p className="font-medium text-foreground">Bank account required</p>
						<p className="text-muted-foreground">
							Connect your bank account above before enabling payment methods. Payments need somewhere to go.
						</p>
					</div>
				</div>
			)}

			{/* SECTION 2: HOW TO ACCEPT PAYMENTS */}
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
						<span className="text-sm font-medium text-primary">2</span>
					</div>
					<div>
						<h3 className="text-lg font-semibold">How to accept payments</h3>
						<p className="text-sm text-muted-foreground">
							Choose how customers can pay you
						</p>
					</div>
				</div>

				{/* Quick Setup Option */}
				{enabledCount === 0 && (
					<div className="space-y-3">
						<Button
							onClick={enableQuickSetup}
							disabled={!bankConnected}
							variant="outline"
							className="w-full justify-between"
							size="lg"
						>
							<div className="flex items-center gap-3">
								<Zap className="h-5 w-5 text-primary" />
								<div className="text-left">
									<p className="font-medium">Quick Setup (Recommended)</p>
									<p className="text-xs text-muted-foreground">
										Enable all popular payment methods
									</p>
								</div>
							</div>
							<ArrowRight className="h-4 w-4" />
						</Button>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">Or customize</span>
							</div>
						</div>
					</div>
				)}

				{/* Payment Methods List */}
				<div className="space-y-2">
					{enabledCount > 0 && (
						<div className="flex items-center justify-between mb-4">
							<span className="text-sm font-medium text-muted-foreground">
								{enabledCount} method{enabledCount !== 1 ? "s" : ""} enabled
							</span>
							{enabledCount < PAYMENT_METHODS.length && (
								<Button
									variant="ghost"
									size="sm"
									onClick={enableQuickSetup}
									disabled={!bankConnected}
								>
									Enable all
								</Button>
							)}
						</div>
					)}

					{PAYMENT_METHODS.map((method) => {
						const Icon = method.icon;
						const enabled = isMethodEnabled(method.id);

						return (
							<div
								key={method.id}
								className={cn(
									"flex items-center gap-4 rounded-lg p-4 transition-colors",
									enabled ? "bg-primary/10 ring-1 ring-primary/20" : "bg-muted/40",
									!bankConnected && "opacity-50"
								)}
							>
								<div
									className={cn(
										"flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0",
										enabled ? "bg-primary text-primary-foreground" : "bg-muted"
									)}
								>
									<Icon className="h-5 w-5" />
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<p className="font-medium">{method.title}</p>
										{method.badge && (
											<span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
												{method.badge}
											</span>
										)}
									</div>
									<p className="text-sm text-muted-foreground">
										{method.description}
										{method.fees && ` • ${method.fees}`}
									</p>
								</div>

								<Switch
									checked={enabled}
									disabled={!bankConnected}
									onCheckedChange={(v) => {
										togglePaymentMethod(method.id, v);
										if (v && !data.paymentSetupComplete) {
											updateData({ paymentSetupComplete: true });
										}
									}}
								/>
							</div>
						);
					})}
				</div>

				{/* ACH Plaid Verification */}
				{isMethodEnabled("ach") && bankConnected && (
					<div className="space-y-3 mt-6">
						<div className="flex items-start gap-3 text-sm bg-muted/40 rounded-lg p-4">
							<Building2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
							<div className="flex-1">
								<p className="font-medium text-foreground">ACH bank verification</p>
								<p className="text-muted-foreground">
									Use Plaid to instantly verify customer bank accounts for ACH transfers.
									This prevents bounced payments and fraud.
								</p>
							</div>
						</div>
						<Button
							onClick={connectPlaidForACH}
							disabled={connectingPlaid}
							variant="outline"
							className="w-full"
						>
							{connectingPlaid ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Connecting...
								</>
							) : (
								<>
									<Shield className="mr-2 h-4 w-4" />
									Enable ACH Verification
								</>
							)}
						</Button>
					</div>
				)}

				{/* Check Capture Info */}
				{isMethodEnabled("check-capture") && (
					<div className="flex items-start gap-3 text-sm bg-muted/40 rounded-lg p-4 mt-4">
						<Smartphone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
						<div>
							<p className="font-medium text-foreground">Mobile check capture ready</p>
							<p className="text-muted-foreground">
								Your team can snap photos of checks in the field for instant deposit to your connected bank.
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Summary Footer */}
			{bankConnected && enabledCount > 0 && (
				<div className="rounded-lg bg-primary/5 p-4 space-y-2">
					<div className="flex items-center gap-2">
						<CheckCircle2 className="h-5 w-5 text-primary" />
						<span className="font-medium">Payment setup complete</span>
					</div>
					<p className="text-sm text-muted-foreground">
						You're ready to accept payments. Funds will be deposited daily to your connected bank account.
					</p>
				</div>
			)}

			{/* Info Note */}
			<p className="text-xs text-muted-foreground text-center">
				Processing fees are paid by your business. You can adjust all settings anytime from Settings → Payments.
			</p>
		</div>
	);
}

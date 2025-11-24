"use client";

/**
 * Payment Settings Content Component
 *
 * Configure payment processors (Adyen, Plaid, ProfitStars) and payout settings.
 */

import { useState } from "react";
import {
	CreditCard,
	Building2,
	FileCheck,
	Zap,
	Clock,
	Calendar,
	Check,
	AlertTriangle,
	ExternalLink,
	Eye,
	EyeOff,
	Loader2,
	Settings,
	DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { updatePaymentSettings, updatePayoutSchedule } from "@/actions/settings/payments";

interface PaymentSettingsContentProps {
	companyId: string;
	paymentSettings: {
		id?: string;
		adyen_merchant_id?: string;
		adyen_api_key?: string;
		adyen_client_key?: string;
		adyen_enabled?: boolean;
		plaid_client_id?: string;
		plaid_secret?: string;
		plaid_enabled?: boolean;
		profitstars_merchant_id?: string;
		profitstars_api_key?: string;
		profitstars_enabled?: boolean;
		financing_providers?: Record<string, unknown>;
		trust_score?: number;
	} | null;
	payoutSchedule: {
		id?: string;
		payout_speed?: "standard" | "instant" | "daily";
		instant_payout_enabled?: boolean;
		daily_payout_time?: string;
		minimum_payout_amount?: number;
		bank_account_last4?: string;
		bank_account_name?: string;
	} | null;
}

type PayoutSpeed = "standard" | "instant" | "daily";

const PAYOUT_SPEEDS: {
	id: PayoutSpeed;
	name: string;
	description: string;
	fee?: string;
	icon: typeof Clock;
}[] = [
	{
		id: "standard",
		name: "Standard",
		description: "2 business days",
		fee: "Free",
		icon: Clock,
	},
	{
		id: "instant",
		name: "Instant",
		description: "Within 30 minutes",
		fee: "1% (max $10)",
		icon: Zap,
	},
	{
		id: "daily",
		name: "Daily Automatic",
		description: "Every day at your preferred time",
		fee: "Free",
		icon: Calendar,
	},
];

export function PaymentSettingsContent({
	companyId,
	paymentSettings,
	payoutSchedule,
}: PaymentSettingsContentProps) {
	const [activeTab, setActiveTab] = useState("processors");
	const [saving, setSaving] = useState(false);
	const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});

	// Processor states
	const [adyenEnabled, setAdyenEnabled] = useState(
		paymentSettings?.adyen_enabled ?? false
	);
	const [plaidEnabled, setPlaidEnabled] = useState(
		paymentSettings?.plaid_enabled ?? false
	);
	const [profitStarsEnabled, setProfitStarsEnabled] = useState(
		paymentSettings?.profitstars_enabled ?? false
	);

	// Payout states
	const [payoutSpeed, setPayoutSpeed] = useState<PayoutSpeed>(
		payoutSchedule?.payout_speed ?? "standard"
	);
	const [dailyPayoutTime, setDailyPayoutTime] = useState(
		payoutSchedule?.daily_payout_time ?? "18:00"
	);
	const [minimumPayout, setMinimumPayout] = useState(
		payoutSchedule?.minimum_payout_amount ?? 100
	);

	const handleSaveProcessors = async () => {
		setSaving(true);
		try {
			await updatePaymentSettings(companyId, {
				adyen_enabled: adyenEnabled,
				plaid_enabled: plaidEnabled,
				profitstars_enabled: profitStarsEnabled,
			});
		} finally {
			setSaving(false);
		}
	};

	const handleSavePayouts = async () => {
		setSaving(true);
		try {
			await updatePayoutSchedule(companyId, {
				payout_speed: payoutSpeed,
				daily_payout_time: dailyPayoutTime,
				minimum_payout_amount: minimumPayout,
			});
		} finally {
			setSaving(false);
		}
	};

	const toggleApiKeyVisibility = (key: string) => {
		setShowApiKeys((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const maskApiKey = (key: string | undefined, show: boolean) => {
		if (!key) return "Not configured";
		if (show) return key;
		return `${"•".repeat(8)}${key.slice(-4)}`;
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Payment Settings</h2>
				<p className="text-muted-foreground">
					Configure payment processors and payout preferences for your business
				</p>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList>
					<TabsTrigger value="processors" className="gap-2">
						<CreditCard className="h-4 w-4" />
						Payment Processors
					</TabsTrigger>
					<TabsTrigger value="payouts" className="gap-2">
						<DollarSign className="h-4 w-4" />
						Payouts
					</TabsTrigger>
					<TabsTrigger value="trust" className="gap-2">
						<Settings className="h-4 w-4" />
						Trust & Limits
					</TabsTrigger>
				</TabsList>

				{/* Payment Processors Tab */}
				<TabsContent value="processors" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{/* Adyen Card */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg">Adyen</CardTitle>
									<Switch
										checked={adyenEnabled}
										onCheckedChange={setAdyenEnabled}
									/>
								</div>
								<CardDescription>
									Card payments, tap-to-pay, Apple Pay, Google Pay
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="adyen-merchant">Merchant ID</Label>
									<div className="flex gap-2">
										<Input
											id="adyen-merchant"
											value={paymentSettings?.adyen_merchant_id || ""}
											placeholder="Your Adyen Merchant ID"
											disabled
											className="font-mono text-sm"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="adyen-api">API Key</Label>
									<div className="flex gap-2">
										<Input
											id="adyen-api"
											value={maskApiKey(
												paymentSettings?.adyen_api_key,
												showApiKeys["adyen-api"] || false
											)}
											disabled
											className="font-mono text-sm"
										/>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => toggleApiKeyVisibility("adyen-api")}
										>
											{showApiKeys["adyen-api"] ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</Button>
									</div>
								</div>
								<div className="flex flex-wrap gap-2 pt-2">
									<Badge variant="secondary">Cards</Badge>
									<Badge variant="secondary">Tap-to-Pay</Badge>
									<Badge variant="secondary">Apple Pay</Badge>
								</div>
							</CardContent>
							<CardFooter>
								<Button variant="outline" size="sm" className="w-full">
									<ExternalLink className="h-4 w-4 mr-2" />
									Manage in Adyen
								</Button>
							</CardFooter>
						</Card>

						{/* Plaid Card */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg">Plaid</CardTitle>
									<Switch
										checked={plaidEnabled}
										onCheckedChange={setPlaidEnabled}
									/>
								</div>
								<CardDescription>
									Bank account verification and ACH payments
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="plaid-client">Client ID</Label>
									<div className="flex gap-2">
										<Input
											id="plaid-client"
											value={paymentSettings?.plaid_client_id || ""}
											placeholder="Your Plaid Client ID"
											disabled
											className="font-mono text-sm"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="plaid-secret">Secret</Label>
									<div className="flex gap-2">
										<Input
											id="plaid-secret"
											value={maskApiKey(
												paymentSettings?.plaid_secret,
												showApiKeys["plaid-secret"] || false
											)}
											disabled
											className="font-mono text-sm"
										/>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => toggleApiKeyVisibility("plaid-secret")}
										>
											{showApiKeys["plaid-secret"] ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</Button>
									</div>
								</div>
								<div className="flex flex-wrap gap-2 pt-2">
									<Badge variant="secondary">Bank Verification</Badge>
									<Badge variant="secondary">ACH</Badge>
								</div>
							</CardContent>
							<CardFooter>
								<Button variant="outline" size="sm" className="w-full">
									<ExternalLink className="h-4 w-4 mr-2" />
									Manage in Plaid
								</Button>
							</CardFooter>
						</Card>

						{/* ProfitStars Card */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg">ProfitStars</CardTitle>
									<Switch
										checked={profitStarsEnabled}
										onCheckedChange={setProfitStarsEnabled}
									/>
								</div>
								<CardDescription>
									ACH processing and remote check deposit
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="profitstars-merchant">Merchant ID</Label>
									<div className="flex gap-2">
										<Input
											id="profitstars-merchant"
											value={paymentSettings?.profitstars_merchant_id || ""}
											placeholder="Your ProfitStars Merchant ID"
											disabled
											className="font-mono text-sm"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="profitstars-api">API Key</Label>
									<div className="flex gap-2">
										<Input
											id="profitstars-api"
											value={maskApiKey(
												paymentSettings?.profitstars_api_key,
												showApiKeys["profitstars-api"] || false
											)}
											disabled
											className="font-mono text-sm"
										/>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => toggleApiKeyVisibility("profitstars-api")}
										>
											{showApiKeys["profitstars-api"] ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</Button>
									</div>
								</div>
								<div className="flex flex-wrap gap-2 pt-2">
									<Badge variant="secondary">ACH</Badge>
									<Badge variant="secondary">Check Capture</Badge>
								</div>
							</CardContent>
							<CardFooter>
								<Button variant="outline" size="sm" className="w-full">
									<ExternalLink className="h-4 w-4 mr-2" />
									Manage in ProfitStars
								</Button>
							</CardFooter>
						</Card>
					</div>

					<div className="flex justify-end pt-4">
						<Button onClick={handleSaveProcessors} disabled={saving}>
							{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
							Save Processor Settings
						</Button>
					</div>
				</TabsContent>

				{/* Payouts Tab */}
				<TabsContent value="payouts" className="space-y-6">
					{/* Bank Account */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Building2 className="h-5 w-5" />
								Bank Account
							</CardTitle>
							<CardDescription>
								Where your payouts will be deposited
							</CardDescription>
						</CardHeader>
						<CardContent>
							{payoutSchedule?.bank_account_last4 ? (
								<div className="flex items-center justify-between p-4 bg-muted rounded-lg">
									<div className="flex items-center gap-3">
										<Building2 className="h-8 w-8 text-muted-foreground" />
										<div>
											<p className="font-medium">
												{payoutSchedule.bank_account_name || "Bank Account"}
											</p>
											<p className="text-sm text-muted-foreground">
												••••{payoutSchedule.bank_account_last4}
											</p>
										</div>
									</div>
									<Badge variant="secondary" className="gap-1">
										<Check className="h-3 w-3" />
										Verified
									</Badge>
								</div>
							) : (
								<div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
									<Building2 className="h-12 w-12 text-muted-foreground mb-4" />
									<p className="text-muted-foreground mb-4">
										No bank account connected
									</p>
									<Button>Connect Bank Account</Button>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Payout Speed */}
					<Card>
						<CardHeader>
							<CardTitle>Payout Speed</CardTitle>
							<CardDescription>
								Choose how quickly you receive your funds
							</CardDescription>
						</CardHeader>
						<CardContent>
							<RadioGroup
								value={payoutSpeed}
								onValueChange={(v) => setPayoutSpeed(v as PayoutSpeed)}
								className="grid gap-4 md:grid-cols-3"
							>
								{PAYOUT_SPEEDS.map((speed) => {
									const Icon = speed.icon;
									return (
										<div key={speed.id}>
											<RadioGroupItem
												value={speed.id}
												id={speed.id}
												className="peer sr-only"
											/>
											<Label
												htmlFor={speed.id}
												className={cn(
													"flex flex-col gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all",
													"peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
													"hover:border-primary/50"
												)}
											>
												<div className="flex items-center justify-between">
													<Icon className="h-5 w-5" />
													{payoutSpeed === speed.id && (
														<Check className="h-4 w-4 text-primary" />
													)}
												</div>
												<div>
													<p className="font-semibold">{speed.name}</p>
													<p className="text-sm text-muted-foreground">
														{speed.description}
													</p>
												</div>
												{speed.fee && (
													<Badge variant="outline" className="w-fit">
														{speed.fee}
													</Badge>
												)}
											</Label>
										</div>
									);
								})}
							</RadioGroup>

							{payoutSpeed === "daily" && (
								<div className="mt-6 space-y-4">
									<Separator />
									<div className="space-y-2">
										<Label htmlFor="daily-time">Daily Payout Time</Label>
										<Select
											value={dailyPayoutTime}
											onValueChange={setDailyPayoutTime}
										>
											<SelectTrigger id="daily-time" className="w-48">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{Array.from({ length: 24 }, (_, i) => {
													const hour = i.toString().padStart(2, "0");
													const time = `${hour}:00`;
													const display =
														i === 0
															? "12:00 AM"
															: i < 12
															? `${i}:00 AM`
															: i === 12
															? "12:00 PM"
															: `${i - 12}:00 PM`;
													return (
														<SelectItem key={time} value={time}>
															{display}
														</SelectItem>
													);
												})}
											</SelectContent>
										</Select>
										<p className="text-xs text-muted-foreground">
											Payouts will be initiated daily at this time (your local
											timezone)
										</p>
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Minimum Payout */}
					<Card>
						<CardHeader>
							<CardTitle>Minimum Payout Amount</CardTitle>
							<CardDescription>
								Set a minimum balance before payouts are triggered
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-4">
								<div className="relative w-48">
									<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										type="number"
										value={minimumPayout}
										onChange={(e) => setMinimumPayout(Number(e.target.value))}
										min={0}
										step={50}
										className="pl-8"
									/>
								</div>
								<p className="text-sm text-muted-foreground">
									Payouts will only be triggered when your balance exceeds this
									amount
								</p>
							</div>
						</CardContent>
					</Card>

					<div className="flex justify-end">
						<Button onClick={handleSavePayouts} disabled={saving}>
							{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
							Save Payout Settings
						</Button>
					</div>
				</TabsContent>

				{/* Trust & Limits Tab */}
				<TabsContent value="trust" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Trust Score</CardTitle>
							<CardDescription>
								Your trust score affects transaction limits and processing fees
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-6">
								<div
									className={cn(
										"w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold",
										(paymentSettings?.trust_score ?? 0) >= 80
											? "bg-green-500/10 text-green-600"
											: (paymentSettings?.trust_score ?? 0) >= 50
											? "bg-yellow-500/10 text-yellow-600"
											: "bg-red-500/10 text-red-600"
									)}
								>
									{paymentSettings?.trust_score ?? 0}
								</div>
								<div className="space-y-2">
									<p className="font-medium">
										{(paymentSettings?.trust_score ?? 0) >= 80
											? "Excellent Standing"
											: (paymentSettings?.trust_score ?? 0) >= 50
											? "Good Standing"
											: "Limited Standing"}
									</p>
									<ul className="text-sm text-muted-foreground space-y-1">
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											Identity verified
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											Bank account connected
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											No chargebacks in 90 days
										</li>
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Transaction Limits</CardTitle>
							<CardDescription>
								Current limits based on your trust score
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
								<div className="space-y-1">
									<p className="text-sm text-muted-foreground">
										Per Transaction
									</p>
									<p className="text-2xl font-bold">$10,000</p>
								</div>
								<div className="space-y-1">
									<p className="text-sm text-muted-foreground">Daily Limit</p>
									<p className="text-2xl font-bold">$50,000</p>
								</div>
								<div className="space-y-1">
									<p className="text-sm text-muted-foreground">Weekly Limit</p>
									<p className="text-2xl font-bold">$200,000</p>
								</div>
								<div className="space-y-1">
									<p className="text-sm text-muted-foreground">Monthly Limit</p>
									<p className="text-2xl font-bold">$500,000</p>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<p className="text-sm text-muted-foreground">
								Need higher limits?{" "}
								<Button variant="link" className="p-0 h-auto">
									Contact support
								</Button>{" "}
								to request an increase.
							</p>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}

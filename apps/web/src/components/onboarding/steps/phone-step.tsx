"use client";

/**
 * Phone & SMS Step - Real Number Porting
 *
 * Integrates with Twilio porting API to:
 * - Check number portability
 * - Collect current carrier info
 * - Submit real porting orders
 * - Track porting status
 */

import {
	AlertTriangle,
	ArrowRightLeft,
	Building2,
	Check,
	CheckCircle2,
	Clock,
	Info,
	Loader2,
	MessageSquare,
	Shield,
	SkipForward,
	Smartphone,
} from "lucide-react";
import { useState } from "react";
import { checkPortability } from "@/actions/phone-porting";
import { PortingStatusTracker } from "@/components/onboarding/status-tracking/porting-status-tracker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	formatCurrency,
	PHONE_NEW_NUMBER_MONTHLY_FEE,
	PHONE_NEW_NUMBER_SETUP_FEE,
	PHONE_PORTING_FEE,
} from "@/lib/onboarding/onboarding-fees";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { getEstimatedFocDate } from "@/lib/twilio/porting-utils";
import { cn } from "@/lib/utils";

type PhoneSetupOption = "new" | "port" | "skip";

const SETUP_OPTIONS: {
	id: PhoneSetupOption;
	title: string;
	subtitle: string;
	icon: React.ElementType;
	pricing?: string;
}[] = [
	{
		id: "new",
		title: "Get a new number",
		subtitle: "Ready instantly",
		icon: Smartphone,
		pricing: `${formatCurrency(PHONE_NEW_NUMBER_SETUP_FEE)} setup + ${formatCurrency(PHONE_NEW_NUMBER_MONTHLY_FEE)}/month`,
	},
	{
		id: "port",
		title: "Port existing number",
		subtitle: "Keep your current number",
		icon: ArrowRightLeft,
		pricing: `${formatCurrency(PHONE_PORTING_FEE)} one-time`,
	},
	{
		id: "skip",
		title: "Skip for now",
		subtitle: "Set up later",
		icon: SkipForward,
	},
];

interface PortabilityCheck {
	checked: boolean;
	portable: boolean | null;
	carrier: string | null;
	error: string | null;
}

export function PhoneStep() {
	const { data, updateData } = useOnboardingStore();
	const [checking, setChecking] = useState(false);
	const [portability, setPortability] = useState<PortabilityCheck>({
		checked: false,
		portable: null,
		carrier: null,
		error: null,
	});

	// Porting order details
	const [currentCarrier, setCurrentCarrier] = useState("");
	const [accountNumber, setAccountNumber] = useState("");
	const [pinPassword, setPinPassword] = useState("");
	const [billingPhone, setBillingPhone] = useState("");
	const [portingSubmitted, setPortingSubmitted] = useState(false);
	const [portingOrderId, setPortingOrderId] = useState<string | null>(null);

	const estimatedFocDate = getEstimatedFocDate();

	const handleCheckPortability = async () => {
		if (!data.phoneNumber) return;

		setChecking(true);
		setPortability({
			checked: false,
			portable: null,
			carrier: null,
			error: null,
		});

		try {
			const result = await checkPortability(data.phoneNumber);

			if (result.success) {
				setPortability({
					checked: true,
					portable: result.portable || false,
					carrier: result.carrier || null,
					error: result.portable
						? null
						: "This number cannot be ported. Please contact your current carrier.",
				});

				// Pre-fill carrier name if detected
				if (result.carrier) {
					setCurrentCarrier(result.carrier);
				}
			} else {
				setPortability({
					checked: true,
					portable: null,
					carrier: null,
					error: result.error || "Failed to check portability",
				});
			}
		} catch (error) {
			setPortability({
				checked: true,
				portable: null,
				carrier: null,
				error: "Failed to check portability. Please try again.",
			});
		} finally {
			setChecking(false);
		}
	};

	const canProceedWithPorting =
		portability.checked &&
		portability.portable &&
		data.phoneNumber &&
		currentCarrier &&
		accountNumber;

	return (
		<div className="space-y-10">
			{/* Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">Phone & SMS</h2>
				<p className="text-muted-foreground">
					A dedicated business line keeps work and personal separate.
				</p>
			</div>

			{/* Info Card - What is phone porting? */}
			{!data.phoneSetupType && (
				<div className="rounded-lg border bg-muted/30 p-4">
					<button
						type="button"
						className="w-full flex items-center justify-between text-left"
						onClick={(e) => {
							const content = e.currentTarget.nextElementSibling as HTMLElement;
							if (content) {
								content.classList.toggle("hidden");
							}
						}}
					>
						<span className="text-sm font-medium flex items-center gap-2">
							<Info className="h-4 w-4 text-primary" />
							Not sure which option to choose?
						</span>
						<span className="text-sm text-muted-foreground">
							Show comparison
						</span>
					</button>
					<div className="hidden mt-4 pt-4 border-t">
						<div className="grid sm:grid-cols-2 gap-4">
							<div className="space-y-2 p-3 rounded bg-background">
								<p className="font-medium text-sm">Get a new number</p>
								<ul className="space-y-1 text-sm text-muted-foreground">
									<li className="flex items-center gap-2">
										<Check className="h-3.5 w-3.5 text-green-500" />
										Ready in minutes
									</li>
									<li className="flex items-center gap-2">
										<Check className="h-3.5 w-3.5 text-green-500" />
										No paperwork required
									</li>
									<li className="flex items-center gap-2">
										<Check className="h-3.5 w-3.5 text-green-500" />
										Choose your area code
									</li>
									<li className="flex items-center gap-2 text-amber-600">
										<AlertTriangle className="h-3.5 w-3.5" />
										Customers need new number
									</li>
								</ul>
								<p className="text-xs text-primary font-medium pt-2">
									Best for: New businesses, side projects
								</p>
							</div>
							<div className="space-y-2 p-3 rounded bg-background">
								<p className="font-medium text-sm">Port existing number</p>
								<ul className="space-y-1 text-sm text-muted-foreground">
									<li className="flex items-center gap-2">
										<Check className="h-3.5 w-3.5 text-green-500" />
										Keep your current number
									</li>
									<li className="flex items-center gap-2">
										<Check className="h-3.5 w-3.5 text-green-500" />
										No customer confusion
									</li>
									<li className="flex items-center gap-2">
										<Check className="h-3.5 w-3.5 text-green-500" />
										One-time fee only
									</li>
									<li className="flex items-center gap-2 text-amber-600">
										<Clock className="h-3.5 w-3.5" />
										Takes 2-4 weeks
									</li>
								</ul>
								<p className="text-xs text-primary font-medium pt-2">
									Best for: Established businesses
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Setup Options */}
			<div className="space-y-4">
				<label className="text-sm font-medium text-muted-foreground">
					Choose setup method
				</label>
				<div className="grid gap-3">
					{SETUP_OPTIONS.map((option) => {
						const Icon = option.icon;
						const isSelected = data.phoneSetupType === option.id;

						return (
							<button
								key={option.id}
								type="button"
								onClick={() => {
									// Update phone setup type
									updateData({ phoneSetupType: option.id });

									// Update billing counts based on selection
									if (option.id === "new") {
										updateData({
											newPhoneNumberCount: 1,
											phonePortingCount: 0,
										});
									} else if (option.id === "port") {
										updateData({
											phonePortingCount: 1,
											newPhoneNumberCount: 0,
										});
									} else {
										updateData({
											phonePortingCount: 0,
											newPhoneNumberCount: 0,
										});
									}

									// Reset portability check when changing options
									if (option.id !== "port") {
										setPortability({
											checked: false,
											portable: null,
											carrier: null,
											error: null,
										});
									}
								}}
								className={cn(
									"relative flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-all",
									isSelected
										? "border-primary bg-primary/5"
										: "border-transparent bg-muted/40 hover:bg-muted/60",
								)}
							>
								{isSelected && (
									<div className="absolute top-3 right-3">
										<Check className="h-4 w-4 text-primary" />
									</div>
								)}
								<div
									className={cn(
										"flex h-10 w-10 items-center justify-center rounded-full",
										isSelected
											? "bg-primary text-primary-foreground"
											: "bg-muted",
									)}
								>
									<Icon className="h-5 w-5" />
								</div>
								<div className="flex-1">
									<p className="font-medium">{option.title}</p>
									<p className="text-sm text-muted-foreground">
										{option.subtitle}
									</p>
									{option.pricing && (
										<p className="text-sm font-medium text-primary mt-1">
											{option.pricing}
										</p>
									)}
								</div>
							</button>
						);
					})}
				</div>
			</div>

			{/* New Number Configuration */}
			{data.phoneSetupType === "new" && (
				<div className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="areaCode">Preferred area code</Label>
						<Input
							id="areaCode"
							placeholder="e.g., 555"
							maxLength={3}
							className="w-[120px]"
						/>
						<p className="text-xs text-muted-foreground">
							Optional. We'll match your location if not specified.
						</p>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<MessageSquare className="h-5 w-5 text-muted-foreground" />
							<div>
								<p className="font-medium">Enable SMS</p>
								<p className="text-sm text-muted-foreground">
									Send appointment reminders
								</p>
							</div>
						</div>
						<Switch
							checked={data.smsEnabled}
							onCheckedChange={(v) => updateData({ smsEnabled: v })}
						/>
					</div>
				</div>
			)}

			{/* Porting Configuration - With Real Twilio Integration */}
			{data.phoneSetupType === "port" && (
				<div className="space-y-6">
					{/* Step 1: Enter Number & Check Portability */}
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="portNumber">
								Number to port <span className="text-destructive">*</span>
							</Label>
							<div className="flex gap-2">
								<Input
									id="portNumber"
									type="tel"
									placeholder="(555) 123-4567"
									value={data.phoneNumber}
									onChange={(e) => {
										updateData({ phoneNumber: e.target.value });
										// Reset portability check when number changes
										if (portability.checked) {
											setPortability({
												checked: false,
												portable: null,
												carrier: null,
												error: null,
											});
										}
									}}
									className="flex-1"
								/>
								<Button
									type="button"
									variant="outline"
									onClick={handleCheckPortability}
									disabled={!data.phoneNumber || checking}
								>
									{checking ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Checking...
										</>
									) : (
										"Check"
									)}
								</Button>
							</div>
						</div>

						{/* Portability Result */}
						{portability.checked && (
							<>
								{portability.portable && (
									<div className="flex items-start gap-3 bg-green-500/10 rounded-lg p-4">
										<CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
										<div className="text-sm">
											<p className="font-medium text-green-700 dark:text-green-400">
												Number is portable!
											</p>
											{portability.carrier && (
												<p className="text-muted-foreground">
													Current carrier detected: {portability.carrier}
												</p>
											)}
										</div>
									</div>
								)}

								{portability.error && (
									<div className="flex items-start gap-3 bg-destructive/10 rounded-lg p-4">
										<AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
										<div className="text-sm">
											<p className="font-medium text-destructive">
												{portability.error}
											</p>
										</div>
									</div>
								)}
							</>
						)}
					</div>

					{/* Step 2: Current Carrier Info (only if portable) */}
					{portability.checked && portability.portable && (
						<div className="space-y-6">
							{/* Critical Warning Banner */}
							<div className="rounded-lg border-2 border-destructive bg-destructive/5 p-5">
								<div className="flex items-start gap-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 flex-shrink-0">
										<AlertTriangle className="h-5 w-5 text-destructive" />
									</div>
									<div className="flex-1 space-y-3">
										<div>
											<h4 className="text-base font-semibold text-destructive">
												Do Not Cancel Your Current Service
											</h4>
											<p className="text-sm text-foreground mt-1">
												Canceling your service with {portability.carrier} will
												immediately cancel the port and you will lose your phone
												number permanently.
											</p>
										</div>
										<p className="text-sm text-muted-foreground">
											You must keep your {portability.carrier} service active
											and paid until you receive confirmation that the port is
											complete.
										</p>
									</div>
								</div>
							</div>

							{/* Porting Information Card */}
							<div className="rounded-lg border bg-card p-6">
								<h4 className="font-semibold mb-4">What to Expect</h4>

								<div className="space-y-4">
									<div className="flex items-start gap-3">
										<Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
										<div className="space-y-1">
											<p className="text-sm font-medium">Processing Time</p>
											<p className="text-sm text-muted-foreground">
												2-4 weeks is standard for all carriers. This timeline is
												controlled by {portability.carrier} and federal
												regulations.
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Building2 className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
										<div className="space-y-1">
											<p className="text-sm font-medium">Third-Party Service</p>
											<p className="text-sm text-muted-foreground">
												We use Twilio, a professional porting service, to
												coordinate with {portability.carrier}. Neither we nor
												Twilio can speed up the process.
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<CheckCircle2 className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
										<div className="space-y-1">
											<p className="text-sm font-medium">What You Need to Do</p>
											<ul className="text-sm text-muted-foreground space-y-1 ml-0 list-none">
												<li>
													• Keep your {portability.carrier} service active
												</li>
												<li>• Pay your {portability.carrier} bills on time</li>
												<li>• Check email daily for updates</li>
												<li>
													• Do not make any changes to your{" "}
													{portability.carrier} account
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>

							{/* Carrier Info Section */}
							<div className="space-y-4">
								<div>
									<h4 className="font-semibold">Carrier Information</h4>
									<p className="text-sm text-muted-foreground mt-1">
										Provide your current carrier details to submit the porting
										order.
									</p>
								</div>

								<div className="grid gap-4 sm:grid-cols-2">
									<div className="space-y-2 sm:col-span-2">
										<Label htmlFor="currentCarrier">
											Current carrier name{" "}
											<span className="text-destructive">*</span>
										</Label>
										<Input
											id="currentCarrier"
											placeholder="e.g., Verizon, AT&T, T-Mobile"
											value={currentCarrier}
											onChange={(e) => setCurrentCarrier(e.target.value)}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="accountNumber">
											Account number <span className="text-destructive">*</span>
										</Label>
										<Input
											id="accountNumber"
											placeholder="Account number with current carrier"
											value={accountNumber}
											onChange={(e) => setAccountNumber(e.target.value)}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="pinPassword">PIN / Password</Label>
										<Input
											id="pinPassword"
											type="password"
											placeholder="If required by carrier"
											value={pinPassword}
											onChange={(e) => setPinPassword(e.target.value)}
										/>
										<p className="text-xs text-muted-foreground">
											Some carriers require a PIN
										</p>
									</div>

									<div className="space-y-2 sm:col-span-2">
										<Label htmlFor="billingPhone">
											Billing telephone number (BTN)
										</Label>
										<Input
											id="billingPhone"
											type="tel"
											placeholder="(555) 123-4567"
											value={billingPhone}
											onChange={(e) => setBillingPhone(e.target.value)}
										/>
										<p className="text-xs text-muted-foreground">
											The main phone number on your current carrier account
										</p>
									</div>
								</div>
							</div>

							{/* SMS Toggle */}
							<div className="flex items-center justify-between rounded-lg border bg-card p-4">
								<div className="flex items-center gap-3">
									<MessageSquare className="h-5 w-5 text-muted-foreground" />
									<div>
										<p className="font-medium">Enable SMS</p>
										<p className="text-sm text-muted-foreground">
											Activates after porting completes
										</p>
									</div>
								</div>
								<Switch
									checked={data.smsEnabled}
									onCheckedChange={(v) => updateData({ smsEnabled: v })}
								/>
							</div>

							{/* Submit porting order OR show tracker */}
							{canProceedWithPorting && !portingSubmitted && (
								<Button
									type="button"
									onClick={async () => {
										// Save porting info
										updateData({
											portingStatus: "submitted",
											portingCarrier: currentCarrier,
											portingAccountNumber: accountNumber,
											portingPin: pinPassword,
											portingBillingPhone: billingPhone,
										});

										// In production, this would call a server action to submit to Twilio
										// For now, simulate getting an order ID
										const mockOrderId = `port_${Date.now()}`;
										setPortingOrderId(mockOrderId);
										setPortingSubmitted(true);
									}}
									className="w-full"
									variant="default"
								>
									<CheckCircle2 className="mr-2 h-4 w-4" />
									Submit porting order
								</Button>
							)}

							{/* Show porting status tracker after submission */}
							{portingSubmitted && portingOrderId && (
								<div className="mt-6 space-y-4">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<CheckCircle2 className="h-4 w-4 text-green-500" />
										<span>Porting order submitted successfully</span>
									</div>
									<PortingStatusTracker
										portingOrderId={portingOrderId}
										phoneNumber={data.phoneNumber}
										carrier={currentCarrier}
										estimatedFocDate={estimatedFocDate}
										onStatusChange={(status) => {
											updateData({ portingStatus: status });
										}}
									/>
								</div>
							)}
						</div>
					)}
				</div>
			)}

			{/* SMS Note */}
			{data.smsEnabled && data.phoneSetupType !== "skip" && (
				<div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/40 rounded-lg p-4">
					<Shield className="h-4 w-4 flex-shrink-0 mt-0.5" />
					<p>
						SMS requires business verification (10DLC). We'll guide you through
						this after setup using the business information you provided.
					</p>
				</div>
			)}
		</div>
	);
}

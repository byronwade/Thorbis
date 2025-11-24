"use client";

/**
 * Phone & SMS Step - Communication Setup
 *
 * Critical step that explains:
 * - Why business phone numbers matter
 * - 10DLC verification requirements for SMS
 * - Porting timeline and process
 */

import { useState } from "react";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { InfoCard, ExpandableInfo } from "@/components/onboarding/info-cards/walkthrough-slide";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
	Phone,
	MessageSquare,
	Smartphone,
	ArrowRightLeft,
	SkipForward,
	CheckCircle2,
	Clock,
	Shield,
	AlertTriangle,
	Sparkles,
	Users,
	Bell,
	FileCheck,
} from "lucide-react";

type PhoneSetupOption = "new" | "port" | "skip";

const SETUP_OPTIONS: {
	id: PhoneSetupOption;
	title: string;
	description: string;
	icon: React.ElementType;
	badge?: string;
	badgeVariant?: "default" | "secondary" | "destructive" | "outline";
	timeline: string;
	features: string[];
}[] = [
	{
		id: "new",
		title: "Get a New Number",
		description: "We'll provision a local business number instantly",
		icon: Smartphone,
		badge: "Instant",
		badgeVariant: "default",
		timeline: "Ready in 2 minutes",
		features: [
			"Professional local number",
			"SMS enabled immediately",
			"Call routing & voicemail",
			"No porting hassle",
		],
	},
	{
		id: "port",
		title: "Port Existing Number",
		description: "Bring your current business number to Thorbis",
		icon: ArrowRightLeft,
		badge: "2-4 weeks",
		badgeVariant: "secondary",
		timeline: "Requires carrier verification",
		features: [
			"Keep your existing number",
			"No disruption to customers",
			"We handle the paperwork",
			"Get a temp number while waiting",
		],
	},
	{
		id: "skip",
		title: "Skip for Now",
		description: "Set up phone later from settings",
		icon: SkipForward,
		timeline: "You can always add this later",
		features: [
			"Manual call tracking",
			"No SMS reminders",
			"Add anytime from settings",
		],
	},
];

export function PhoneStep() {
	const { data, updateData } = useOnboardingStore();
	const [showVerificationInfo, setShowVerificationInfo] = useState(false);

	const selectedOption = SETUP_OPTIONS.find((o) => o.id === data.phoneSetupType);

	return (
		<div className="space-y-6 max-w-2xl">
			<div>
				<h2 className="text-xl font-semibold">Set up business phone & SMS</h2>
				<p className="text-sm text-muted-foreground">
					A dedicated business line keeps work and personal separate, and enables powerful features.
				</p>
			</div>

			{/* Why This Matters */}
			<InfoCard
				icon={<Sparkles className="h-5 w-5" />}
				title="Why a business phone number?"
				description="Professional communication builds trust and enables automation."
				bullets={[
					"Separate work calls from personal",
					"Route calls to available team members",
					"Send automated appointment reminders via SMS",
					"Track all customer communications in one place",
				]}
				variant="tip"
			/>

			{/* Setup Options */}
			<div className="space-y-3">
				{SETUP_OPTIONS.map((option) => {
					const Icon = option.icon;
					const isSelected = data.phoneSetupType === option.id;

					return (
						<button
							key={option.id}
							type="button"
							onClick={() => updateData({ phoneSetupType: option.id })}
							className={cn(
								"w-full flex items-start gap-4 rounded-xl p-5 text-left transition-all",
								isSelected
									? "bg-primary/10 ring-2 ring-primary"
									: "bg-muted/30 hover:bg-muted/50"
							)}
						>
							<div className={cn(
								"flex h-12 w-12 items-center justify-center rounded-xl transition-colors flex-shrink-0",
								isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
							)}>
								<Icon className="h-6 w-6" />
							</div>

							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-1">
									<p className="font-semibold">{option.title}</p>
									{option.badge && (
										<Badge variant={option.badgeVariant}>{option.badge}</Badge>
									)}
								</div>
								<p className="text-sm text-muted-foreground mb-2">
									{option.description}
								</p>
								<div className="flex items-center gap-1 text-xs text-muted-foreground">
									<Clock className="h-3 w-3" />
									{option.timeline}
								</div>

								{isSelected && (
									<div className="mt-3 pt-3 border-t border-border/50">
										<ul className="space-y-1">
											{option.features.map((feature, i) => (
												<li key={i} className="flex items-center gap-2 text-sm">
													<CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
													{feature}
												</li>
											))}
										</ul>
									</div>
								)}
							</div>

							{isSelected && (
								<CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
							)}
						</button>
					);
				})}
			</div>

			{/* New Number Configuration */}
			{data.phoneSetupType === "new" && (
				<div className="rounded-xl bg-muted/30 p-5 space-y-4">
					<h3 className="font-semibold">Configure Your New Number</h3>

					<div className="space-y-2">
						<Label htmlFor="areaCode">Preferred Area Code (optional)</Label>
						<Input
							id="areaCode"
							placeholder="e.g., 555"
							maxLength={3}
							className="w-[120px]"
						/>
						<p className="text-xs text-muted-foreground">
							We'll try to get a number in this area code, or nearby if unavailable.
						</p>
					</div>

					<div className="flex items-center justify-between rounded-lg bg-background p-4">
						<div className="flex items-center gap-3">
							<MessageSquare className="h-5 w-5 text-primary" />
							<div>
								<p className="font-medium">Enable SMS</p>
								<p className="text-sm text-muted-foreground">
									Send appointment reminders and updates
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

			{/* Porting Information */}
			{data.phoneSetupType === "port" && (
				<div className="space-y-4">
					<div className="rounded-xl bg-muted/30 p-5 space-y-4">
						<h3 className="font-semibold">Port Your Existing Number</h3>

						<div className="space-y-2">
							<Label htmlFor="portNumber">Number to Port</Label>
							<Input
								id="portNumber"
								type="tel"
								placeholder="(555) 123-4567"
								value={data.phoneNumber}
								onChange={(e) => updateData({ phoneNumber: e.target.value })}
							/>
						</div>

						<div className="flex items-center justify-between rounded-lg bg-background p-4">
							<div className="flex items-center gap-3">
								<MessageSquare className="h-5 w-5 text-primary" />
								<div>
									<p className="font-medium">Enable SMS when ready</p>
									<p className="text-sm text-muted-foreground">
										SMS will activate after porting completes
									</p>
								</div>
							</div>
							<Switch
								checked={data.smsEnabled}
								onCheckedChange={(v) => updateData({ smsEnabled: v })}
							/>
						</div>
					</div>

					{/* Porting Process Info */}
					<InfoCard
						icon={<FileCheck className="h-5 w-5" />}
						title="What you'll need for porting"
						description="We'll guide you through collecting these after setup:"
						bullets={[
							"Current carrier account number",
							"Account PIN or password",
							"Letter of Authorization (we provide the template)",
							"Most recent bill showing the number",
						]}
						variant="default"
					/>
				</div>
			)}

			{/* 10DLC Verification Warning */}
			{data.smsEnabled && data.phoneSetupType !== "skip" && (
				<InfoCard
					icon={<Shield className="h-5 w-5" />}
					title="SMS Verification Required"
					description="To send SMS messages, your business must be verified through the 10DLC registration process. This is required by all carriers to prevent spam."
					variant="warning"
				/>
			)}

			{/* Expandable: 10DLC Deep Dive */}
			{data.smsEnabled && data.phoneSetupType !== "skip" && (
				<ExpandableInfo title="What is 10DLC verification?">
					<div className="space-y-3">
						<p>
							10DLC (10-Digit Long Code) is a system that allows businesses to send
							application-to-person (A2P) messages over standard 10-digit phone numbers.
						</p>
						<p>
							<strong>Why it's required:</strong> Carriers (AT&T, Verizon, T-Mobile) now
							require all businesses to register to prevent spam and improve deliverability.
						</p>
						<p>
							<strong>The process:</strong>
						</p>
						<ol className="list-decimal list-inside space-y-1 text-sm">
							<li>Register your business (EIN, business name, address)</li>
							<li>Describe your use case (appointment reminders, updates)</li>
							<li>Verification takes 1-7 business days</li>
							<li>Once approved, SMS is enabled automatically</li>
						</ol>
						<p className="text-sm">
							<strong>Don't worry!</strong> We'll guide you through every step after
							you complete this initial setup.
						</p>
					</div>
				</ExpandableInfo>
			)}

			{/* Skip Warning */}
			{data.phoneSetupType === "skip" && (
				<InfoCard
					icon={<AlertTriangle className="h-5 w-5" />}
					title="You'll miss out on key features"
					description="Without a business number, you won't be able to send SMS appointment reminders, track calls, or use the unified inbox. You can always set this up later in Settings."
					variant="warning"
				/>
			)}
		</div>
	);
}

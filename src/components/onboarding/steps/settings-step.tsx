"use client";

/**
 * Settings Step - Important Settings Tour
 *
 * Highlights key settings users should know about:
 * - Tax rates
 * - Invoice defaults
 * - Online booking settings
 * - Integrations overview
 */

import { useState } from "react";
import { useOnboardingStore, INDUSTRIES } from "@/lib/onboarding/onboarding-store";
import { InfoCard, ExpandableInfo } from "@/components/onboarding/info-cards/walkthrough-slide";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
	Settings,
	Percent,
	FileText,
	Globe,
	Link2,
	Sparkles,
	CheckCircle2,
	DollarSign,
	Clock,
	CalendarCheck,
	Shield,
	Zap,
	Info,
} from "lucide-react";

interface SettingSection {
	id: string;
	title: string;
	description: string;
	icon: React.ElementType;
	importance: "critical" | "recommended" | "optional";
}

const SETTING_SECTIONS: SettingSection[] = [
	{
		id: "tax",
		title: "Tax Settings",
		description: "Set your default tax rate for invoices",
		icon: Percent,
		importance: "critical",
	},
	{
		id: "invoice",
		title: "Invoice Defaults",
		description: "Payment terms, notes, and branding",
		icon: FileText,
		importance: "critical",
	},
	{
		id: "booking",
		title: "Online Booking",
		description: "Let customers book directly on your website",
		icon: CalendarCheck,
		importance: "recommended",
	},
	{
		id: "integrations",
		title: "Integrations",
		description: "Connect QuickBooks, Google Calendar, and more",
		icon: Link2,
		importance: "optional",
	},
];

const POPULAR_INTEGRATIONS = [
	{ id: "quickbooks", name: "QuickBooks", description: "Sync invoices and payments", logo: "QB" },
	{ id: "google_calendar", name: "Google Calendar", description: "Sync appointments", logo: "GC" },
	{ id: "zapier", name: "Zapier", description: "Connect 3,000+ apps", logo: "ZP" },
	{ id: "thumbtack", name: "Thumbtack", description: "Lead management", logo: "TT" },
];

export function SettingsStep() {
	const { data, updateData } = useOnboardingStore();
	const [taxRate, setTaxRate] = useState(data.taxRate || "");
	const [paymentTerms, setPaymentTerms] = useState(data.paymentTerms || "30");
	const [onlineBooking, setOnlineBooking] = useState(data.onlineBookingEnabled || false);
	const [autoReminders, setAutoReminders] = useState(data.autoReminders !== false);

	const handleTaxRateChange = (value: string) => {
		setTaxRate(value);
		updateData({ taxRate: value });
	};

	const handlePaymentTermsChange = (value: string) => {
		setPaymentTerms(value);
		updateData({ paymentTerms: value });
	};

	const handleOnlineBookingChange = (enabled: boolean) => {
		setOnlineBooking(enabled);
		updateData({ onlineBookingEnabled: enabled });
	};

	const handleAutoRemindersChange = (enabled: boolean) => {
		setAutoReminders(enabled);
		updateData({ autoReminders: enabled });
	};

	return (
		<div className="space-y-6 max-w-2xl">
			<div>
				<h2 className="text-xl font-semibold">Important settings</h2>
				<p className="text-sm text-muted-foreground">
					A few key settings to get right from the start. You can always change these later.
				</p>
			</div>

			{/* Info Card */}
			<InfoCard
				icon={<Sparkles className="h-5 w-5" />}
				title="Get these right from day one"
				description="These settings affect invoices, quotes, and how customers interact with your business. Taking a moment now saves headaches later."
				variant="tip"
			/>

			{/* Tax Settings */}
			<div className="rounded-xl bg-muted/30 p-5 space-y-4">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
						<Percent className="h-5 w-5 text-amber-500" />
					</div>
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<h3 className="font-semibold">Tax Rate</h3>
							<Badge variant="destructive" className="text-xs">Critical</Badge>
						</div>
						<p className="text-sm text-muted-foreground">
							Applied automatically to invoices
						</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<Input
						type="number"
						step="0.01"
						min="0"
						max="100"
						placeholder="8.25"
						value={taxRate}
						onChange={(e) => handleTaxRateChange(e.target.value)}
						className="w-[120px]"
					/>
					<span className="text-muted-foreground">%</span>
					<span className="text-sm text-muted-foreground">
						(e.g., 8.25% for Texas sales tax)
					</span>
				</div>

				<p className="text-xs text-muted-foreground">
					Don't know your rate? Search "[your city/state] sales tax rate" or ask your accountant.
				</p>
			</div>

			{/* Invoice Defaults */}
			<div className="rounded-xl bg-muted/30 p-5 space-y-4">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<FileText className="h-5 w-5 text-primary" />
					</div>
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<h3 className="font-semibold">Invoice Settings</h3>
							<Badge variant="destructive" className="text-xs">Critical</Badge>
						</div>
						<p className="text-sm text-muted-foreground">
							Default terms for all invoices
						</p>
					</div>
				</div>

				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<Label className="w-32">Payment due</Label>
						<select
							value={paymentTerms}
							onChange={(e) => handlePaymentTermsChange(e.target.value)}
							className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background sm:w-auto"
						>
							<option value="0">Due on receipt</option>
							<option value="7">Net 7 (7 days)</option>
							<option value="15">Net 15 (15 days)</option>
							<option value="30">Net 30 (30 days)</option>
							<option value="45">Net 45 (45 days)</option>
							<option value="60">Net 60 (60 days)</option>
						</select>
					</div>

					<div className="flex items-center justify-between rounded-lg bg-background p-3">
						<div>
							<p className="font-medium text-sm">Auto-send payment reminders</p>
							<p className="text-xs text-muted-foreground">
								Remind customers when invoices are due or overdue
							</p>
						</div>
						<Switch
							checked={autoReminders}
							onCheckedChange={handleAutoRemindersChange}
						/>
					</div>
				</div>
			</div>

			{/* Online Booking */}
			<div className="rounded-xl bg-muted/30 p-5 space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
							<CalendarCheck className="h-5 w-5 text-green-500" />
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h3 className="font-semibold">Online Booking</h3>
								<Badge variant="secondary" className="text-xs">Recommended</Badge>
							</div>
							<p className="text-sm text-muted-foreground">
								Let customers book directly
							</p>
						</div>
					</div>
					<Switch
						checked={onlineBooking}
						onCheckedChange={handleOnlineBookingChange}
					/>
				</div>

				{onlineBooking && (
					<div className="pt-4 border-t space-y-3">
						<div className="flex items-start gap-2 text-sm">
							<CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
							<span>Embed on your website or share a booking link</span>
						</div>
						<div className="flex items-start gap-2 text-sm">
							<CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
							<span>Customers see only available time slots</span>
						</div>
						<div className="flex items-start gap-2 text-sm">
							<CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
							<span>Automatic confirmations and reminders</span>
						</div>
						<p className="text-xs text-muted-foreground">
							Booking link: thorbis.com/book/{data.companyName?.toLowerCase().replace(/\s+/g, "-") || "your-company"}
						</p>
					</div>
				)}
			</div>

			{/* Integrations Preview */}
			<div className="rounded-xl bg-muted/30 p-5 space-y-4">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
						<Link2 className="h-5 w-5" />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h3 className="font-semibold">Integrations</h3>
							<Badge variant="outline" className="text-xs">Optional</Badge>
						</div>
						<p className="text-sm text-muted-foreground">
							Connect your favorite tools
						</p>
					</div>
				</div>

				<div className="grid gap-2 sm:grid-cols-2">
					{POPULAR_INTEGRATIONS.map((integration) => (
						<div
							key={integration.id}
							className="flex items-center gap-3 rounded-lg bg-background p-3"
						>
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-xs font-bold">
								{integration.logo}
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium">{integration.name}</p>
								<p className="text-xs text-muted-foreground truncate">
									{integration.description}
								</p>
							</div>
						</div>
					))}
				</div>

				<p className="text-xs text-muted-foreground text-center">
					Set up integrations after completing onboarding in Settings → Integrations
				</p>
			</div>

			{/* Expandable: More Settings */}
			<ExpandableInfo title="What other settings are available?">
				<div className="space-y-3">
					<p>
						You'll have full access to all settings after onboarding. Here are some highlights:
					</p>
					<ul className="space-y-2">
						<li className="flex items-start gap-2">
							<Shield className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
							<span><strong>Permissions:</strong> Control what each team member can see and do</span>
						</li>
						<li className="flex items-start gap-2">
							<FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
							<span><strong>Templates:</strong> Customize estimate and invoice templates</span>
						</li>
						<li className="flex items-start gap-2">
							<Globe className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
							<span><strong>Booking Page:</strong> Customize your online booking appearance</span>
						</li>
						<li className="flex items-start gap-2">
							<Zap className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
							<span><strong>Automations:</strong> Set up automatic follow-ups and workflows</span>
						</li>
					</ul>
				</div>
			</ExpandableInfo>

			{/* Settings Summary */}
			<div className="rounded-xl bg-muted/30 p-4 space-y-2">
				<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
					Settings Summary
				</p>
				<div className="space-y-1 text-sm">
					<div className="flex justify-between">
						<span>Tax rate</span>
						<span className={cn(
							"font-medium",
							taxRate ? "text-green-500" : "text-amber-500"
						)}>
							{taxRate ? `${taxRate}%` : "Not set"}
						</span>
					</div>
					<div className="flex justify-between">
						<span>Payment terms</span>
						<span className="font-medium">
							{paymentTerms === "0" ? "Due on receipt" : `Net ${paymentTerms}`}
						</span>
					</div>
					<div className="flex justify-between">
						<span>Auto reminders</span>
						<span className={cn(
							"font-medium",
							autoReminders ? "text-green-500" : "text-muted-foreground"
						)}>
							{autoReminders ? "Enabled" : "Disabled"}
						</span>
					</div>
					<div className="flex justify-between">
						<span>Online booking</span>
						<span className={cn(
							"font-medium",
							onlineBooking ? "text-green-500" : "text-muted-foreground"
						)}>
							{onlineBooking ? "Enabled" : "Disabled"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

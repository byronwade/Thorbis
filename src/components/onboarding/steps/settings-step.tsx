"use client";

/**
 * Settings Step - Important Settings Tour
 */

import { useState } from "react";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
	Percent,
	FileText,
	CalendarCheck,
	Link2,
	CheckCircle2,
} from "lucide-react";

const POPULAR_INTEGRATIONS = [
	{ id: "quickbooks", name: "QuickBooks", description: "Sync invoices", logo: "QB" },
	{ id: "google_calendar", name: "Google Calendar", description: "Sync appointments", logo: "GC" },
	{ id: "zapier", name: "Zapier", description: "Connect apps", logo: "ZP" },
	{ id: "thumbtack", name: "Thumbtack", description: "Lead management", logo: "TT" },
];

const PAYMENT_TERMS = [
	{ value: "0", label: "Due on receipt" },
	{ value: "7", label: "Net 7 (7 days)" },
	{ value: "15", label: "Net 15 (15 days)" },
	{ value: "30", label: "Net 30 (30 days)" },
	{ value: "45", label: "Net 45 (45 days)" },
	{ value: "60", label: "Net 60 (60 days)" },
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
		<div className="space-y-10">
			{/* Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">Important settings</h2>
				<p className="text-muted-foreground">
					A few key settings to get right from the start. You can always change these later.
				</p>
			</div>

			{/* Tax Settings */}
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<Percent className="h-5 w-5 text-muted-foreground" />
					<div>
						<p className="font-medium">Tax Rate</p>
						<p className="text-sm text-muted-foreground">Applied automatically to invoices</p>
					</div>
				</div>

				<div className="rounded-lg bg-muted/40 p-4">
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
					</div>
					<p className="text-xs text-muted-foreground mt-2">
						Example: 8.25% for Texas sales tax. Check your local rate.
					</p>
				</div>
			</div>

			{/* Invoice Defaults */}
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<FileText className="h-5 w-5 text-muted-foreground" />
					<div>
						<p className="font-medium">Invoice Settings</p>
						<p className="text-sm text-muted-foreground">Default terms for all invoices</p>
					</div>
				</div>

				<div className="space-y-3">
					<div className="rounded-lg bg-muted/40 p-4 flex items-center justify-between">
						<span className="text-sm">Payment due</span>
						<Select value={paymentTerms} onValueChange={handlePaymentTermsChange}>
							<SelectTrigger className="w-[160px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{PAYMENT_TERMS.map((term) => (
									<SelectItem key={term.value} value={term.value}>
										{term.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="rounded-lg bg-muted/40 p-4 flex items-center justify-between">
						<div>
							<p className="font-medium text-sm">Auto-send payment reminders</p>
							<p className="text-xs text-muted-foreground">
								Remind customers when invoices are due
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
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<CalendarCheck className="h-5 w-5 text-muted-foreground" />
						<div>
							<p className="font-medium">Online Booking</p>
							<p className="text-sm text-muted-foreground">Let customers book directly</p>
						</div>
					</div>
					<Switch
						checked={onlineBooking}
						onCheckedChange={handleOnlineBookingChange}
					/>
				</div>

				{onlineBooking && (
					<div className="rounded-lg bg-primary/10 p-4 space-y-2">
						<div className="flex items-center gap-2 text-sm">
							<CheckCircle2 className="h-4 w-4 text-primary" />
							<span>Embed on your website or share a booking link</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<CheckCircle2 className="h-4 w-4 text-primary" />
							<span>Customers see only available time slots</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<CheckCircle2 className="h-4 w-4 text-primary" />
							<span>Automatic confirmations and reminders</span>
						</div>
					</div>
				)}
			</div>

			{/* Integrations Preview */}
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<Link2 className="h-5 w-5 text-muted-foreground" />
					<div>
						<p className="font-medium">Integrations</p>
						<p className="text-sm text-muted-foreground">Connect your favorite tools later</p>
					</div>
				</div>

				<div className="grid gap-2 sm:grid-cols-2">
					{POPULAR_INTEGRATIONS.map((integration) => (
						<div
							key={integration.id}
							className="flex items-center gap-3 rounded-lg bg-muted/40 p-3"
						>
							<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-xs font-bold">
								{integration.logo}
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium">{integration.name}</p>
								<p className="text-xs text-muted-foreground">{integration.description}</p>
							</div>
						</div>
					))}
				</div>

				<p className="text-xs text-muted-foreground text-center">
					Set up integrations after onboarding in Settings → Integrations
				</p>
			</div>

			{/* Summary */}
			<div className="flex items-center justify-between text-sm text-muted-foreground">
				<span>Tax: {taxRate ? `${taxRate}%` : "Not set"}</span>
				<span>Terms: {PAYMENT_TERMS.find((t) => t.value === paymentTerms)?.label}</span>
			</div>
		</div>
	);
}

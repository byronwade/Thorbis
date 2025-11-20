"use client";

import {
	Calendar,
	Clock,
	Edit,
	Flame,
	Globe,
	Phone,
	Save,
	Smartphone,
	Snowflake,
	Store,
	Target,
	Thermometer,
	TrendingUp,
	Users,
	X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	StandardFormField,
	StandardFormRow,
} from "@/components/ui/standard-form-field";
import { Textarea } from "@/components/ui/textarea";

interface LeadAttributionData {
	lead_source?: string;
	lead_source_detail?: string;
	referral_customer_id?: string;
	referral_customer_name?: string; // For display only
	marketing_campaign_id?: string;
	lead_temperature?: "hot" | "warm" | "cold";
	booking_method?: "phone" | "website" | "mobile_app" | "walk_in";
	booked_by_user_id?: string;
	booked_by_name?: string; // For display only
	booking_notes?: string;
	converted_from_estimate_id?: string;
	time_to_conversion?: number;
	conversion_likelihood?: number;
}

interface LeadAttributionCardProps {
	jobId: string;
	attribution: LeadAttributionData;
	editable?: boolean;
	onSave?: (data: LeadAttributionData) => Promise<void>;
}

const LEAD_SOURCES = [
	{ value: "google", label: "Google Search", icon: Globe },
	{ value: "facebook", label: "Facebook", icon: Users },
	{ value: "instagram", label: "Instagram", icon: Users },
	{ value: "referral", label: "Customer Referral", icon: Users },
	{ value: "website", label: "Website Form", icon: Globe },
	{ value: "repeat", label: "Repeat Customer", icon: Users },
	{ value: "yelp", label: "Yelp", icon: Target },
	{ value: "nextdoor", label: "Nextdoor", icon: Users },
	{ value: "direct_mail", label: "Direct Mail", icon: Target },
	{ value: "radio", label: "Radio Ad", icon: Target },
	{ value: "tv", label: "TV Ad", icon: Target },
	{ value: "truck_wrap", label: "Truck Wrap/Sign", icon: Target },
	{ value: "trade_show", label: "Trade Show", icon: Store },
	{ value: "partnership", label: "Partnership", icon: Users },
	{ value: "other", label: "Other", icon: Target },
];

const LEAD_TEMPERATURES = [
	{
		value: "hot",
		label: "Hot Lead",
		description: "Ready to book immediately",
		icon: Flame,
		color: "text-red-600 dark:text-red-400",
		bgColor: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
	},
	{
		value: "warm",
		label: "Warm Lead",
		description: "Interested, needs follow-up",
		icon: Thermometer,
		color: "text-orange-600 dark:text-orange-400",
		bgColor:
			"bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800",
	},
	{
		value: "cold",
		label: "Cold Lead",
		description: "Early inquiry, low urgency",
		icon: Snowflake,
		color: "text-blue-600 dark:text-blue-400",
		bgColor: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
	},
];

const BOOKING_METHODS = [
	{ value: "phone", label: "Phone Call", icon: Phone },
	{ value: "website", label: "Website Form", icon: Globe },
	{ value: "mobile_app", label: "Mobile App", icon: Smartphone },
	{ value: "walk_in", label: "Walk-In", icon: Store },
];

export function LeadAttributionCard({
	jobId,
	attribution,
	editable = false,
	onSave,
}: LeadAttributionCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [formData, setFormData] = useState<LeadAttributionData>(attribution);

	const handleSave = async () => {
		if (!onSave) return;

		setIsSaving(true);
		try {
			await onSave(formData);
			setIsEditing(false);
		} catch (error) {
			console.error("Failed to save attribution data:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setFormData(attribution);
		setIsEditing(false);
	};

	const updateField = (field: keyof LeadAttributionData, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const selectedLeadSource = LEAD_SOURCES.find(
		(s) => s.value === formData.lead_source,
	);
	const selectedBookingMethod = BOOKING_METHODS.find(
		(m) => m.value === formData.booking_method,
	);
	const selectedTemperature = LEAD_TEMPERATURES.find(
		(t) => t.value === formData.lead_temperature,
	);

	// Format time to conversion
	const formatTimeToConversion = (hours?: number) => {
		if (!hours) return "—";
		if (hours < 1) return `${Math.round(hours * 60)} minutes`;
		if (hours < 24) return `${hours.toFixed(1)} hours`;
		return `${(hours / 24).toFixed(1)} days`;
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Target className="h-5 w-5 text-primary" />
						<div>
							<CardTitle>Lead Attribution & Tracking</CardTitle>
							<CardDescription>
								Understand where this job came from and how it converted
							</CardDescription>
						</div>
					</div>
					{editable && !isEditing && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsEditing(true)}
						>
							<Edit className="mr-2 h-4 w-4" />
							Edit Attribution
						</Button>
					)}
					{isEditing && (
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={handleCancel}
								disabled={isSaving}
							>
								<X className="mr-2 h-4 w-4" />
								Cancel
							</Button>
							<Button size="sm" onClick={handleSave} disabled={isSaving}>
								<Save className="mr-2 h-4 w-4" />
								{isSaving ? "Saving..." : "Save"}
							</Button>
						</div>
					)}
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				{/* Lead Temperature Badge */}
				{selectedTemperature && (
					<div
						className={`rounded-lg border p-4 ${selectedTemperature.bgColor}`}
					>
						<div className="flex items-center gap-3">
							<div className={`rounded-full p-2 ${selectedTemperature.color}`}>
								<selectedTemperature.icon className="h-5 w-5" />
							</div>
							<div className="flex-1">
								<h4 className="font-semibold">{selectedTemperature.label}</h4>
								<p className="text-muted-foreground text-sm">
									{selectedTemperature.description}
								</p>
							</div>
							{isEditing && (
								<Select
									value={formData.lead_temperature}
									onValueChange={(value) =>
										updateField("lead_temperature", value)
									}
								>
									<SelectTrigger className="w-40">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{LEAD_TEMPERATURES.map((temp) => (
											<SelectItem key={temp.value} value={temp.value}>
												<div className="flex items-center gap-2">
													<temp.icon className={`h-4 w-4 ${temp.color}`} />
													{temp.label}
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						</div>
					</div>
				)}

				{/* Key Metrics */}
				<div className="grid gap-4 md:grid-cols-3">
					<div className="rounded-lg border bg-card p-4">
						<div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs font-medium uppercase">
							<Clock className="h-3 w-3" />
							Time to Convert
						</div>
						<div className="text-2xl font-bold">
							{formatTimeToConversion(formData.time_to_conversion)}
						</div>
					</div>

					<div className="rounded-lg border bg-card p-4">
						<div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs font-medium uppercase">
							<TrendingUp className="h-3 w-3" />
							Likelihood
						</div>
						<div className="text-2xl font-bold">
							{formData.conversion_likelihood
								? `${formData.conversion_likelihood}%`
								: "—"}
						</div>
					</div>

					<div className="rounded-lg border bg-card p-4">
						<div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs font-medium uppercase">
							{selectedBookingMethod?.icon ? (
								<selectedBookingMethod.icon className="h-3 w-3" />
							) : (
								<Calendar className="h-3 w-3" />
							)}
							Booked Via
						</div>
						<div className="text-sm font-semibold">
							{selectedBookingMethod?.label || "Not specified"}
						</div>
					</div>
				</div>

				{/* Lead Source */}
				<div className="space-y-3">
					<Label>Lead Source</Label>
					{isEditing ? (
						<div className="space-y-3">
							<Select
								value={formData.lead_source}
								onValueChange={(value) => updateField("lead_source", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select lead source..." />
								</SelectTrigger>
								<SelectContent>
									{LEAD_SOURCES.map((source) => (
										<SelectItem key={source.value} value={source.value}>
											<div className="flex items-center gap-2">
												<source.icon className="h-4 w-4" />
												{source.label}
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<StandardFormField
								label="Campaign/Source Details"
								htmlFor="lead_source_detail"
							>
								<Input
									id="lead_source_detail"
									value={formData.lead_source_detail || ""}
									onChange={(e) =>
										updateField("lead_source_detail", e.target.value)
									}
									placeholder="e.g., Spring 2025 HVAC Campaign, John Smith referral"
								/>
							</StandardFormField>
						</div>
					) : (
						<div className="rounded-lg border bg-card p-3">
							<div className="flex items-center gap-2">
								{selectedLeadSource && (
									<selectedLeadSource.icon className="h-4 w-4 text-primary" />
								)}
								<span className="font-medium">
									{selectedLeadSource?.label || "Not specified"}
								</span>
							</div>
							{formData.lead_source_detail && (
								<p className="text-muted-foreground mt-2 text-sm">
									{formData.lead_source_detail}
								</p>
							)}
						</div>
					)}
				</div>

				{/* Referral Customer */}
				{(isEditing || formData.referral_customer_id) && (
					<div className="space-y-2">
						<Label>Referral Customer</Label>
						{isEditing ? (
							<Input
								value={formData.referral_customer_name || ""}
								onChange={(e) =>
									updateField("referral_customer_name", e.target.value)
								}
								placeholder="Search for customer..."
							/>
						) : (
							<div className="rounded-lg border bg-card p-3">
								<div className="flex items-center gap-2">
									<Users className="h-4 w-4 text-primary" />
									<span className="font-medium">
										{formData.referral_customer_name || "Referral customer"}
									</span>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Booking Details */}
				<div className="space-y-3">
					<Label>Booking Information</Label>
					<StandardFormRow cols={2}>
						<StandardFormField label="Booking Method" htmlFor="booking_method">
							{isEditing ? (
								<Select
									value={formData.booking_method}
									onValueChange={(value) =>
										updateField("booking_method", value)
									}
								>
									<SelectTrigger id="booking_method">
										<SelectValue placeholder="Select method..." />
									</SelectTrigger>
									<SelectContent>
										{BOOKING_METHODS.map((method) => (
											<SelectItem key={method.value} value={method.value}>
												<div className="flex items-center gap-2">
													<method.icon className="h-4 w-4" />
													{method.label}
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							) : (
								<div className="rounded-lg border bg-card p-2 px-3">
									<div className="flex items-center gap-2">
										{selectedBookingMethod && (
											<selectedBookingMethod.icon className="h-4 w-4 text-primary" />
										)}
										<span className="text-sm">
											{selectedBookingMethod?.label || "—"}
										</span>
									</div>
								</div>
							)}
						</StandardFormField>

						<StandardFormField label="Booked By" htmlFor="booked_by_name">
							<Input
								id="booked_by_name"
								value={formData.booked_by_name || ""}
								onChange={(e) => updateField("booked_by_name", e.target.value)}
								disabled={!isEditing}
								placeholder="CSR name"
							/>
						</StandardFormField>
					</StandardFormRow>

					<StandardFormField label="Booking Notes" htmlFor="booking_notes">
						<Textarea
							id="booking_notes"
							value={formData.booking_notes || ""}
							onChange={(e) => updateField("booking_notes", e.target.value)}
							disabled={!isEditing}
							placeholder="Any special notes about how this job was booked..."
							rows={3}
						/>
					</StandardFormField>
				</div>

				{/* Conversion Metrics */}
				{isEditing && (
					<div className="space-y-3">
						<Label>Conversion Tracking</Label>
						<StandardFormRow cols={2}>
							<StandardFormField
								label="Time to Convert (hours)"
								htmlFor="time_to_conversion"
							>
								<Input
									id="time_to_conversion"
									type="number"
									step="0.1"
									value={formData.time_to_conversion || ""}
									onChange={(e) =>
										updateField(
											"time_to_conversion",
											parseFloat(e.target.value) || undefined,
										)
									}
									placeholder="2.5"
								/>
								<p className="text-muted-foreground text-xs">
									Hours from initial contact to scheduled job
								</p>
							</StandardFormField>

							<StandardFormField
								label="Conversion Likelihood (%)"
								htmlFor="conversion_likelihood"
							>
								<Input
									id="conversion_likelihood"
									type="number"
									min="0"
									max="100"
									value={formData.conversion_likelihood || ""}
									onChange={(e) =>
										updateField(
											"conversion_likelihood",
											parseInt(e.target.value) || undefined,
										)
									}
									placeholder="75"
								/>
								<p className="text-muted-foreground text-xs">
									Estimated probability of conversion (0-100)
								</p>
							</StandardFormField>
						</StandardFormRow>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

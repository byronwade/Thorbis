"use client";

/**
 * Company Step - Business Profile Setup
 *
 * Collects essential company information that will appear
 * on invoices, estimates, and customer communications.
 */

import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { InfoCard } from "@/components/onboarding/info-cards/walkthrough-slide";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Building2, FileText, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

const TIMEZONES = [
	{ value: "America/New_York", label: "Eastern Time (ET)" },
	{ value: "America/Chicago", label: "Central Time (CT)" },
	{ value: "America/Denver", label: "Mountain Time (MT)" },
	{ value: "America/Los_Angeles", label: "Pacific Time (PT)" },
	{ value: "America/Anchorage", label: "Alaska Time (AKT)" },
	{ value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
	{ value: "America/Phoenix", label: "Arizona Time (MST)" },
];

const US_STATES = [
	"AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
	"HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
	"MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
	"NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
	"SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export function CompanyStep() {
	const { data, updateData } = useOnboardingStore();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [dragActive, setDragActive] = useState(false);

	const handleLogoUpload = (file: File) => {
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onload = (e) => {
				updateData({ companyLogo: e.target?.result as string });
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleLogoUpload(e.dataTransfer.files[0]);
		}
	};

	return (
		<div className="space-y-6 max-w-2xl">
			<div>
				<h2 className="text-xl font-semibold">Tell us about your business</h2>
				<p className="text-sm text-muted-foreground">
					This information appears on invoices, estimates, and customer communications.
				</p>
			</div>

			{/* Info Card */}
			<InfoCard
				icon={<FileText className="h-5 w-5" />}
				title="Professional documents in seconds"
				description="Once set up, every invoice and estimate automatically includes your company details, logo, and contact information."
				variant="tip"
			/>

			{/* Logo Upload */}
			<div className="space-y-2">
				<Label>Company Logo (optional)</Label>
				<div
					className={cn(
						"relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors cursor-pointer",
						dragActive ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/50",
						data.companyLogo && "border-solid border-muted bg-muted/30"
					)}
					onDragEnter={handleDrag}
					onDragLeave={handleDrag}
					onDragOver={handleDrag}
					onDrop={handleDrop}
					onClick={() => fileInputRef.current?.click()}
				>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={(e) => {
							if (e.target.files?.[0]) {
								handleLogoUpload(e.target.files[0]);
							}
						}}
					/>

					{data.companyLogo ? (
						<div className="relative">
							<img
								src={data.companyLogo}
								alt="Company logo"
								className="h-20 w-20 rounded-lg object-contain"
							/>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									updateData({ companyLogo: null });
								}}
								className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
							>
								<X className="h-3 w-3" />
							</button>
						</div>
					) : (
						<>
							<Upload className="h-8 w-8 text-muted-foreground mb-2" />
							<p className="text-sm font-medium">Drop your logo here</p>
							<p className="text-xs text-muted-foreground">or click to browse</p>
						</>
					)}
				</div>
			</div>

			{/* Company Name */}
			<div className="space-y-2">
				<Label htmlFor="companyName">
					Company Name <span className="text-destructive">*</span>
				</Label>
				<Input
					id="companyName"
					placeholder="Acme Plumbing & HVAC"
					value={data.companyName}
					onChange={(e) => updateData({ companyName: e.target.value })}
					className="text-lg"
				/>
			</div>

			{/* Contact Info */}
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="companyPhone">
						Business Phone <span className="text-destructive">*</span>
					</Label>
					<Input
						id="companyPhone"
						type="tel"
						placeholder="(555) 123-4567"
						value={data.companyPhone}
						onChange={(e) => updateData({ companyPhone: e.target.value })}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="companyEmail">
						Business Email <span className="text-destructive">*</span>
					</Label>
					<Input
						id="companyEmail"
						type="email"
						placeholder="info@acmeplumbing.com"
						value={data.companyEmail}
						onChange={(e) => updateData({ companyEmail: e.target.value })}
					/>
				</div>
			</div>

			{/* Address */}
			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="companyAddress">Street Address</Label>
					<Input
						id="companyAddress"
						placeholder="123 Main Street, Suite 100"
						value={data.companyAddress}
						onChange={(e) => updateData({ companyAddress: e.target.value })}
					/>
				</div>

				<div className="grid gap-4 sm:grid-cols-3">
					<div className="space-y-2">
						<Label htmlFor="companyCity">City</Label>
						<Input
							id="companyCity"
							placeholder="Springfield"
							value={data.companyCity}
							onChange={(e) => updateData({ companyCity: e.target.value })}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="companyState">State</Label>
						<Select
							value={data.companyState}
							onValueChange={(v) => updateData({ companyState: v })}
						>
							<SelectTrigger id="companyState">
								<SelectValue placeholder="State" />
							</SelectTrigger>
							<SelectContent>
								{US_STATES.map((state) => (
									<SelectItem key={state} value={state}>
										{state}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="companyZip">ZIP Code</Label>
						<Input
							id="companyZip"
							placeholder="12345"
							value={data.companyZip}
							onChange={(e) => updateData({ companyZip: e.target.value })}
						/>
					</div>
				</div>
			</div>

			{/* Timezone */}
			<div className="space-y-2">
				<Label htmlFor="timezone">Timezone</Label>
				<Select
					value={data.timezone}
					onValueChange={(v) => updateData({ timezone: v })}
				>
					<SelectTrigger id="timezone" className="w-full sm:w-[300px]">
						<SelectValue placeholder="Select timezone" />
					</SelectTrigger>
					<SelectContent>
						{TIMEZONES.map((tz) => (
							<SelectItem key={tz.value} value={tz.value}>
								{tz.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<p className="text-xs text-muted-foreground">
					This affects how times are displayed throughout the app
				</p>
			</div>

			{/* Preview */}
			{data.companyName && (
				<div className="rounded-xl bg-muted/30 p-4 space-y-3">
					<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
						Preview - How it looks on invoices
					</p>
					<div className="flex items-start gap-4 p-4 bg-background rounded-lg border">
						{data.companyLogo ? (
							<img
								src={data.companyLogo}
								alt=""
								className="h-12 w-12 rounded object-contain"
							/>
						) : (
							<div className="flex h-12 w-12 items-center justify-center rounded bg-primary/10">
								<Building2 className="h-6 w-6 text-primary" />
							</div>
						)}
						<div className="text-sm">
							<p className="font-semibold">{data.companyName}</p>
							{data.companyAddress && (
								<p className="text-muted-foreground">
									{data.companyAddress}
									{data.companyCity && `, ${data.companyCity}`}
									{data.companyState && ` ${data.companyState}`}
									{data.companyZip && ` ${data.companyZip}`}
								</p>
							)}
							<p className="text-muted-foreground">
								{data.companyPhone && <span>{data.companyPhone}</span>}
								{data.companyPhone && data.companyEmail && <span> • </span>}
								{data.companyEmail && <span>{data.companyEmail}</span>}
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

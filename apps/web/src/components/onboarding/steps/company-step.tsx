"use client";

/**
 * Company Step - Comprehensive Business Profile & Verification
 *
 * Collects all information needed for:
 * - Bank account setup (Plaid, ACH)
 * - Payment processing (check capture, card processing)
 * - Identity verification and compliance
 * - Business verification for 10DLC SMS registration
 */

import {
	AlertTriangle,
	Building2,
	Calendar,
	DollarSign,
	HelpCircle,
	Shield,
	Upload,
	Users,
	X,
} from "lucide-react";
import { useRef, useState } from "react";
import {
	HELP_CONTENT,
	HelpTooltip,
} from "@/components/onboarding/help-tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { cn } from "@/lib/utils";

const TIMEZONES = [
	{ value: "America/New_York", label: "Eastern Time" },
	{ value: "America/Chicago", label: "Central Time" },
	{ value: "America/Denver", label: "Mountain Time" },
	{ value: "America/Los_Angeles", label: "Pacific Time" },
	{ value: "America/Anchorage", label: "Alaska Time" },
	{ value: "Pacific/Honolulu", label: "Hawaii Time" },
];

const US_STATES = [
	"AL",
	"AK",
	"AZ",
	"AR",
	"CA",
	"CO",
	"CT",
	"DE",
	"FL",
	"GA",
	"HI",
	"ID",
	"IL",
	"IN",
	"IA",
	"KS",
	"KY",
	"LA",
	"ME",
	"MD",
	"MA",
	"MI",
	"MN",
	"MS",
	"MO",
	"MT",
	"NE",
	"NV",
	"NH",
	"NJ",
	"NM",
	"NY",
	"NC",
	"ND",
	"OH",
	"OK",
	"OR",
	"PA",
	"RI",
	"SC",
	"SD",
	"TN",
	"TX",
	"UT",
	"VT",
	"VA",
	"WA",
	"WV",
	"WI",
	"WY",
];

const BUSINESS_TYPES = [
	{
		value: "sole_proprietor",
		label: "Sole Proprietor",
		description: "Individual owner",
	},
	{ value: "llc", label: "LLC", description: "Limited Liability Company" },
	{
		value: "corporation",
		label: "Corporation",
		description: "C-Corp or S-Corp",
	},
	{
		value: "partnership",
		label: "Partnership",
		description: "General or Limited Partnership",
	},
	{
		value: "non_profit",
		label: "Non-Profit",
		description: "501(c) organization",
	},
];

const EMPLOYEE_RANGES = [
	{ value: "1", label: "Just me" },
	{ value: "2-5", label: "2-5 employees" },
	{ value: "6-10", label: "6-10 employees" },
	{ value: "11-25", label: "11-25 employees" },
	{ value: "26-50", label: "26-50 employees" },
	{ value: "51-100", label: "51-100 employees" },
	{ value: "100+", label: "100+ employees" },
];

const REVENUE_RANGES = [
	{ value: "under-100k", label: "Under $100K" },
	{ value: "100k-250k", label: "$100K - $250K" },
	{ value: "250k-500k", label: "$250K - $500K" },
	{ value: "500k-1m", label: "$500K - $1M" },
	{ value: "1m-5m", label: "$1M - $5M" },
	{ value: "5m-10m", label: "$5M - $10M" },
	{ value: "10m+", label: "$10M+" },
	{ value: "prefer-not-say", label: "Prefer not to say" },
];

const YEARS_IN_BUSINESS = [
	{ value: "new", label: "Starting a new business" },
	{ value: "under-1", label: "Less than 1 year" },
	{ value: "1-2", label: "1-2 years" },
	{ value: "3-5", label: "3-5 years" },
	{ value: "6-10", label: "6-10 years" },
	{ value: "10+", label: "10+ years" },
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

	// Format EIN input (XX-XXXXXXX)
	const handleEinInput = (value: string) => {
		const cleaned = value.replace(/\D/g, "");
		let formatted = cleaned;
		if (cleaned.length > 2) {
			formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 9)}`;
		}
		updateData({ ein: formatted });
	};

	// Format SSN input (last 4 digits only)
	const handleSsnInput = (value: string) => {
		const cleaned = value.replace(/\D/g, "").slice(0, 4);
		updateData({ ownerSSN: cleaned });
	};

	return (
		<div className="space-y-10">
			{/* Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">Company information</h2>
				<p className="text-muted-foreground">
					This information is used for identity verification, bank account
					setup, and compliance.
				</p>
			</div>

			{/* Section 1: Basic Company Info */}
			<div className="space-y-6">
				<div className="flex items-center gap-2 text-sm font-medium">
					<Building2 className="h-4 w-4 text-primary" />
					<span>Business Profile</span>
				</div>

				{/* Logo & Name */}
				<div className="flex items-start gap-6">
					{/* Logo Upload */}
					<div
						className={cn(
							"relative flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-colors",
							dragActive
								? "border-primary bg-primary/5"
								: "border-muted-foreground/25 hover:border-muted-foreground/50",
							data.companyLogo && "border-solid border-transparent",
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
							<div className="relative w-full h-full">
								<img
									src={data.companyLogo}
									alt="Logo"
									className="h-full w-full rounded-xl object-contain bg-muted/30"
								/>
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										updateData({ companyLogo: null });
									}}
									className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm"
								>
									<X className="h-3 w-3" />
								</button>
							</div>
						) : (
							<Upload className="h-6 w-6 text-muted-foreground/50" />
						)}
					</div>

					{/* Company Name */}
					<div className="flex-1 space-y-2">
						<Label htmlFor="companyName">
							Company name <span className="text-destructive">*</span>
						</Label>
						<Input
							id="companyName"
							placeholder="Acme Plumbing LLC"
							value={data.companyName}
							onChange={(e) => updateData({ companyName: e.target.value })}
							className="text-lg h-12"
						/>
					</div>
				</div>

				{/* Contact Info */}
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="companyPhone">Phone</Label>
						<Input
							id="companyPhone"
							type="tel"
							placeholder="(555) 123-4567"
							value={data.companyPhone}
							onChange={(e) => updateData({ companyPhone: e.target.value })}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="companyEmail">Email</Label>
						<Input
							id="companyEmail"
							type="email"
							placeholder="info@example.com"
							value={data.companyEmail}
							onChange={(e) => updateData({ companyEmail: e.target.value })}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="companyWebsite">Website (optional)</Label>
					<Input
						id="companyWebsite"
						type="url"
						placeholder="https://acmeplumbing.com"
						value={data.companyWebsite}
						onChange={(e) => updateData({ companyWebsite: e.target.value })}
					/>
				</div>
			</div>

			{/* Section 2: Business Address */}
			<div className="space-y-4">
				<Label>Business Address</Label>
				<Input
					placeholder="Street address"
					value={data.companyAddress}
					onChange={(e) => updateData({ companyAddress: e.target.value })}
				/>
				<div className="grid gap-4 sm:grid-cols-3">
					<Input
						placeholder="City"
						value={data.companyCity}
						onChange={(e) => updateData({ companyCity: e.target.value })}
					/>
					<Select
						value={data.companyState}
						onValueChange={(v) => updateData({ companyState: v })}
					>
						<SelectTrigger>
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
					<Input
						placeholder="ZIP"
						value={data.companyZip}
						onChange={(e) => updateData({ companyZip: e.target.value })}
					/>
				</div>
			</div>

			{/* Section 3: Mailing Address */}
			<div className="space-y-4">
				<div className="flex items-center space-x-2">
					<Checkbox
						id="mailingAddressSame"
						checked={data.mailingAddressSame}
						onCheckedChange={(v) =>
							updateData({ mailingAddressSame: v as boolean })
						}
					/>
					<Label htmlFor="mailingAddressSame" className="cursor-pointer">
						Mailing address is the same as business address
					</Label>
				</div>

				{!data.mailingAddressSame && (
					<div className="space-y-4 pl-6 border-l-2 border-muted">
						<Label>Mailing Address</Label>
						<Input
							placeholder="Street address"
							value={data.mailingAddress}
							onChange={(e) => updateData({ mailingAddress: e.target.value })}
						/>
						<div className="grid gap-4 sm:grid-cols-3">
							<Input
								placeholder="City"
								value={data.mailingCity}
								onChange={(e) => updateData({ mailingCity: e.target.value })}
							/>
							<Select
								value={data.mailingState}
								onValueChange={(v) => updateData({ mailingState: v })}
							>
								<SelectTrigger>
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
							<Input
								placeholder="ZIP"
								value={data.mailingZip}
								onChange={(e) => updateData({ mailingZip: e.target.value })}
							/>
						</div>
					</div>
				)}
			</div>

			{/* Section 4: Business Verification */}
			<div className="space-y-6">
				<div className="flex items-start gap-3 bg-amber-500/10 rounded-lg p-4">
					<Shield className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
					<div className="text-sm">
						<p className="font-medium text-foreground">
							Business verification required
						</p>
						<p className="text-muted-foreground">
							This information is needed for bank account setup, payment
							processing, and compliance. All data is encrypted and secure.
						</p>
					</div>
				</div>

				<div className="grid gap-6 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="businessType">
							Business Type <span className="text-destructive">*</span>
						</Label>
						<Select
							value={data.businessType || undefined}
							onValueChange={(v) => updateData({ businessType: v as any })}
						>
							<SelectTrigger id="businessType">
								<SelectValue placeholder="Select business type" />
							</SelectTrigger>
							<SelectContent>
								{BUSINESS_TYPES.map((type) => (
									<SelectItem key={type.value} value={type.value}>
										<div>
											<span className="font-medium">{type.label}</span>
											<span className="text-muted-foreground ml-2">
												- {type.description}
											</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="ein">
							EIN / Tax ID <span className="text-destructive">*</span>
						</Label>
						<Input
							id="ein"
							placeholder="XX-XXXXXXX"
							value={data.ein}
							onChange={(e) => handleEinInput(e.target.value)}
							maxLength={10}
						/>
						<p className="text-xs text-muted-foreground">
							9-digit Employer Identification Number
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="stateOfIncorporation">State of Incorporation</Label>
						<Select
							value={data.stateOfIncorporation}
							onValueChange={(v) => updateData({ stateOfIncorporation: v })}
						>
							<SelectTrigger id="stateOfIncorporation">
								<SelectValue placeholder="Select state" />
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
						<Label htmlFor="dateEstablished">Date Established</Label>
						<Input
							id="dateEstablished"
							type="date"
							value={data.dateEstablished}
							onChange={(e) => updateData({ dateEstablished: e.target.value })}
						/>
					</div>

					<div className="space-y-2 sm:col-span-2">
						<Label htmlFor="businessLicense">
							Business License Number (if applicable)
						</Label>
						<Input
							id="businessLicense"
							placeholder="License number"
							value={data.businessLicense}
							onChange={(e) => updateData({ businessLicense: e.target.value })}
						/>
					</div>
				</div>
			</div>

			{/* Section 5: Beneficial Owner Information */}
			<div className="space-y-6">
				<div className="flex items-start gap-3 bg-blue-500/10 rounded-lg p-4">
					<AlertTriangle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
					<div className="text-sm">
						<p className="font-medium text-foreground">
							Beneficial owner information
						</p>
						<p className="text-muted-foreground">
							Required for financial compliance (FinCEN rules). This is the
							person who owns or controls 25% or more of the business.
						</p>
					</div>
				</div>

				<div className="grid gap-6 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="ownerName">
							Owner Full Name <span className="text-destructive">*</span>
						</Label>
						<Input
							id="ownerName"
							placeholder="John Smith"
							value={data.ownerName}
							onChange={(e) => updateData({ ownerName: e.target.value })}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="ownerTitle">Title</Label>
						<Input
							id="ownerTitle"
							placeholder="Owner, CEO, etc."
							value={data.ownerTitle}
							onChange={(e) => updateData({ ownerTitle: e.target.value })}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="ownerEmail">Email</Label>
						<Input
							id="ownerEmail"
							type="email"
							placeholder="john@acmeplumbing.com"
							value={data.ownerEmail}
							onChange={(e) => updateData({ ownerEmail: e.target.value })}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="ownerPhone">Phone</Label>
						<Input
							id="ownerPhone"
							type="tel"
							placeholder="(555) 123-4567"
							value={data.ownerPhone}
							onChange={(e) => updateData({ ownerPhone: e.target.value })}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="ownerDOB">Date of Birth</Label>
						<Input
							id="ownerDOB"
							type="date"
							value={data.ownerDOB}
							onChange={(e) => updateData({ ownerDOB: e.target.value })}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="ownerSSN">Last 4 of SSN</Label>
						<Input
							id="ownerSSN"
							type="text"
							placeholder="1234"
							value={data.ownerSSN}
							onChange={(e) => handleSsnInput(e.target.value)}
							maxLength={4}
						/>
						<p className="text-xs text-muted-foreground">
							Last 4 digits only for verification
						</p>
					</div>

					<div className="space-y-2 sm:col-span-2">
						<Label htmlFor="ownerAddress">Owner Address</Label>
						<Input
							id="ownerAddress"
							placeholder="Full address"
							value={data.ownerAddress}
							onChange={(e) => updateData({ ownerAddress: e.target.value })}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="ownerOwnershipPercent">Ownership %</Label>
						<Input
							id="ownerOwnershipPercent"
							type="number"
							min="0"
							max="100"
							value={data.ownerOwnershipPercent}
							onChange={(e) =>
								updateData({
									ownerOwnershipPercent: parseInt(e.target.value) || 0,
								})
							}
						/>
					</div>
				</div>
			</div>

			{/* Section 6: Business Size & Experience */}
			<div className="space-y-6">
				<div className="flex items-center gap-2 text-sm font-medium">
					<Users className="h-4 w-4 text-primary" />
					<span>Business Size</span>
					<span className="text-muted-foreground font-normal">(optional)</span>
				</div>

				<p className="text-sm text-muted-foreground -mt-2">
					This helps us recommend the right features and pricing for your
					business.
				</p>

				<div className="grid gap-6 sm:grid-cols-3">
					<div className="space-y-2">
						<div className="flex items-center gap-1.5">
							<Label htmlFor="yearsInBusiness">Years in business</Label>
							<HelpTooltip
								tooltip="How long have you been operating?"
								details="This helps us understand your business maturity and recommend appropriate features. New businesses may benefit from our getting-started guides."
							/>
						</div>
						<Select
							value={data.yearsInBusiness}
							onValueChange={(v) => updateData({ yearsInBusiness: v })}
						>
							<SelectTrigger id="yearsInBusiness">
								<SelectValue placeholder="Select" />
							</SelectTrigger>
							<SelectContent>
								{YEARS_IN_BUSINESS.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<div className="flex items-center gap-1.5">
							<Label htmlFor="numberOfEmployees">Team size</Label>
							<HelpTooltip
								tooltip="Number of people in your company"
								details="This helps us recommend the right team management features and pricing tier for your business."
							/>
						</div>
						<Select
							value={data.numberOfEmployees}
							onValueChange={(v) => updateData({ numberOfEmployees: v })}
						>
							<SelectTrigger id="numberOfEmployees">
								<SelectValue placeholder="Select" />
							</SelectTrigger>
							<SelectContent>
								{EMPLOYEE_RANGES.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<div className="flex items-center gap-1.5">
							<Label htmlFor="annualRevenueRange">Annual revenue</Label>
							<HelpTooltip
								tooltip="Approximate annual revenue"
								details="This is completely optional and confidential. It helps us recommend appropriate payment processing limits and financial features."
							/>
						</div>
						<Select
							value={data.annualRevenueRange}
							onValueChange={(v) => updateData({ annualRevenueRange: v })}
						>
							<SelectTrigger id="annualRevenueRange">
								<SelectValue placeholder="Select" />
							</SelectTrigger>
							<SelectContent>
								{REVENUE_RANGES.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* Timezone */}
			<div className="space-y-2">
				<Label>Timezone</Label>
				<Select
					value={data.timezone}
					onValueChange={(v) => updateData({ timezone: v })}
				>
					<SelectTrigger className="w-full sm:w-64">
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
			</div>

			{/* Security Note */}
			<div className="flex items-start gap-3 text-xs text-muted-foreground bg-muted/40 rounded-lg p-4">
				<Shield className="h-4 w-4 flex-shrink-0 mt-0.5" />
				<p>
					All sensitive information is encrypted with bank-level security
					(AES-256) and never shared without your consent. Required for payment
					processing and compliance with FinCEN regulations.
				</p>
			</div>
		</div>
	);
}

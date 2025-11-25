"use client";

/**
 * Help Tooltip - Contextual help for onboarding fields
 *
 * Provides inline help explaining WHY data is collected, reducing confusion
 * and support requests.
 */

import { useState } from "react";
import { HelpCircle, ExternalLink, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface HelpTooltipProps {
	/** Short tooltip text shown on hover (desktop) or tap (mobile) */
	tooltip: string;
	/** Optional longer explanation shown in expandable popover */
	details?: string;
	/** Optional link to more documentation */
	learnMoreUrl?: string;
	/** Optional link text */
	learnMoreText?: string;
	/** Size variant */
	size?: "sm" | "md";
	/** Additional class names */
	className?: string;
}

export function HelpTooltip({
	tooltip,
	details,
	learnMoreUrl,
	learnMoreText = "Learn more",
	size = "sm",
	className,
}: HelpTooltipProps) {
	const [isOpen, setIsOpen] = useState(false);

	const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

	// Simple tooltip if no details
	if (!details) {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							type="button"
							className={cn(
								"inline-flex items-center justify-center rounded-full text-muted-foreground/60 hover:text-muted-foreground transition-colors",
								className
							)}
							aria-label="Help"
						>
							<HelpCircle className={iconSize} />
						</button>
					</TooltipTrigger>
					<TooltipContent side="top" className="max-w-xs">
						<p className="text-sm">{tooltip}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	// Popover with more details
	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={cn(
						"inline-flex items-center justify-center rounded-full text-muted-foreground/60 hover:text-muted-foreground transition-colors",
						className
					)}
					aria-label="Help"
				>
					<HelpCircle className={iconSize} />
				</button>
			</PopoverTrigger>
			<PopoverContent side="top" className="w-80 p-0" align="start">
				<div className="space-y-3 p-4">
					<div className="flex items-start justify-between gap-2">
						<p className="text-sm font-medium">{tooltip}</p>
						<Button
							variant="ghost"
							size="icon"
							className="h-6 w-6 -mr-2 -mt-1"
							onClick={() => setIsOpen(false)}
						>
							<X className="h-3.5 w-3.5" />
						</Button>
					</div>
					<p className="text-sm text-muted-foreground">{details}</p>
					{learnMoreUrl && (
						<a
							href={learnMoreUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
						>
							{learnMoreText}
							<ExternalLink className="h-3 w-3" />
						</a>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}

/**
 * Help Section - Expandable "Why do we need this?" section
 */
interface HelpSectionProps {
	title?: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
	className?: string;
}

export function HelpSection({
	title = "Why do we need this?",
	children,
	defaultOpen = false,
	className,
}: HelpSectionProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<div className={cn("rounded-lg bg-muted/30 border", className)}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors rounded-lg"
			>
				<span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
					<HelpCircle className="h-4 w-4" />
					{title}
				</span>
				<span className="text-sm text-muted-foreground">
					{isOpen ? "Hide" : "Show"}
				</span>
			</button>
			{isOpen && (
				<div className="px-4 pb-4 pt-0">
					<div className="text-sm text-muted-foreground space-y-2">
						{children}
					</div>
				</div>
			)}
		</div>
	);
}

/**
 * Field Label with Help - Label component with integrated help tooltip
 */
interface FieldLabelProps {
	label: string;
	htmlFor?: string;
	required?: boolean;
	tooltip?: string;
	details?: string;
	learnMoreUrl?: string;
	className?: string;
}

export function FieldLabel({
	label,
	htmlFor,
	required = false,
	tooltip,
	details,
	learnMoreUrl,
	className,
}: FieldLabelProps) {
	return (
		<div className={cn("flex items-center gap-1.5", className)}>
			<label
				htmlFor={htmlFor}
				className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{label}
				{required && <span className="text-destructive ml-0.5">*</span>}
			</label>
			{tooltip && (
				<HelpTooltip
					tooltip={tooltip}
					details={details}
					learnMoreUrl={learnMoreUrl}
				/>
			)}
		</div>
	);
}

/**
 * Pre-built help content for common onboarding fields
 */
export const HELP_CONTENT = {
	companyName: {
		tooltip: "Your legal business name",
		details: "This appears on invoices, contracts, and customer communications. Use your registered business name for consistency.",
	},
	ein: {
		tooltip: "Employer Identification Number (Tax ID)",
		details: "Required for payment processing and tax compliance. If you're a sole proprietor without an EIN, you can use your SSN.",
		learnMoreUrl: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
	},
	businessType: {
		tooltip: "Your legal business structure",
		details: "This affects how we set up payment processing and compliance features. Choose the structure you registered with your state.",
	},
	ownerSSN: {
		tooltip: "Last 4 digits of owner's SSN",
		details: "Required by financial regulations (KYC) to verify business ownership. We only store the last 4 digits and use bank-level encryption.",
	},
	phonePorting: {
		tooltip: "Keep your existing business number",
		details: "Phone porting transfers your existing number to our platform. This typically takes 7-14 business days. Your current service continues until the port completes.",
		learnMoreUrl: "/kb/phone-porting",
	},
	customDomain: {
		tooltip: "Send emails from your own domain",
		details: "Using a custom domain (e.g., noreply@yourbusiness.com) improves deliverability and looks more professional. Requires DNS configuration.",
	},
	serviceRadius: {
		tooltip: "How far you'll travel for jobs",
		details: "This helps us calculate travel time estimates and filter customer requests by location. You can adjust this anytime in settings.",
	},
	taxRate: {
		tooltip: "Your default sales tax rate",
		details: "Applied automatically to invoices. You can override this per invoice if needed for different jurisdictions.",
	},
	gpsTracking: {
		tooltip: "Track technician locations",
		details: "Enables real-time location tracking for dispatching efficiency and customer ETAs. Technicians must consent, and you can disable this anytime.",
	},
	customerPortal: {
		tooltip: "Self-service portal for customers",
		details: "Lets customers view their job history, pay invoices, and schedule appointments online. Reduces phone calls and improves customer experience.",
	},
} as const;

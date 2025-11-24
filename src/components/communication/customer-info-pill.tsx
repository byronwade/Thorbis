"use client";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, ExternalLink, Mail, Phone, User } from "lucide-react";
import Link from "next/link";

export interface CustomerData {
	id?: string;
	first_name?: string | null;
	last_name?: string | null;
	display_name?: string | null;
	email?: string | null;
	phone?: string | null;
	company_name?: string | null;
}

interface CustomerInfoPillProps {
	customer: CustomerData | null | undefined;
	/** Fallback name if no customer linked */
	fallbackName?: string;
	/** Fallback email if no customer linked */
	fallbackEmail?: string;
	/** Fallback phone if no customer linked */
	fallbackPhone?: string;
	/** Additional CSS classes */
	className?: string;
	/** Size variant */
	size?: "sm" | "default";
}

/**
 * A pill-shaped badge displaying customer name with a popover
 * showing detailed customer information on click.
 */
export function CustomerInfoPill({
	customer,
	fallbackName,
	fallbackEmail,
	fallbackPhone,
	className,
	size = "default",
}: CustomerInfoPillProps) {
	// Determine display name
	const displayName = customer?.display_name
		|| (customer?.first_name && customer?.last_name
			? `${customer.first_name} ${customer.last_name}`
			: customer?.first_name || customer?.last_name)
		|| fallbackName
		|| "Unknown";

	const email = customer?.email || fallbackEmail;
	const phone = customer?.phone || fallbackPhone;
	const hasCustomerProfile = !!customer?.id;

	// Get initials for avatar
	const initials = displayName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={cn(
						"inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/50 hover:bg-muted transition-colors cursor-pointer",
						size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
						className
					)}
				>
					<span className="font-medium truncate max-w-[150px]">{displayName}</span>
					<ChevronDown className={cn("text-muted-foreground", size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-72 p-0" align="start">
				<div className="p-4">
					{/* Header with avatar */}
					<div className="flex items-start gap-3 mb-3">
						<div className={cn(
							"flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold",
							size === "sm" ? "h-10 w-10 text-sm" : "h-12 w-12 text-base"
						)}>
							{initials || <User className="h-5 w-5" />}
						</div>
						<div className="flex-1 min-w-0">
							<p className="font-semibold text-foreground truncate">{displayName}</p>
							{customer?.company_name && (
								<p className="text-xs text-muted-foreground truncate">{customer.company_name}</p>
							)}
							{!hasCustomerProfile && (
								<span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 mt-1">
									Not linked
								</span>
							)}
						</div>
					</div>

					{/* Contact details */}
					<div className="space-y-2">
						{email && (
							<div className="flex items-center gap-2 text-sm">
								<Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
								<a
									href={`mailto:${email}`}
									className="text-foreground hover:text-primary truncate transition-colors"
								>
									{email}
								</a>
							</div>
						)}
						{phone && (
							<div className="flex items-center gap-2 text-sm">
								<Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
								<a
									href={`tel:${phone}`}
									className="text-foreground hover:text-primary transition-colors"
								>
									{phone}
								</a>
							</div>
						)}
						{!email && !phone && (
							<p className="text-sm text-muted-foreground italic">No contact info available</p>
						)}
					</div>
				</div>

				{/* Footer with profile link */}
				{hasCustomerProfile && (
					<div className="border-t border-border px-4 py-3 bg-muted/30">
						<Button variant="outline" size="sm" className="w-full" asChild>
							<Link href={`/dashboard/customers/${customer.id}`}>
								<span>View Full Profile</span>
								<ExternalLink className="h-3.5 w-3.5 ml-1.5" />
							</Link>
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}

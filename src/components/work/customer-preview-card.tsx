"use client";

/**
 * CustomerPreviewCard - Keyboard-accessible customer info preview
 *
 * Provides both hover preview (for mouse users) and button-triggered
 * preview (for keyboard users) to meet WCAG 2.1 AA accessibility.
 */

import { Info, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { getCustomerDisplayName } from "@/lib/utils/customer-display";

type Customer = {
	id: string;
	first_name?: string | null;
	last_name?: string | null;
	company_name?: string | null;
	email?: string | null;
	phone?: string | null;
};

type CustomerPreviewCardProps = {
	customer: Customer;
	className?: string;
};

/**
 * Customer info card content (reusable in both HoverCard and Popover)
 */
function CustomerCardContent({ customer }: { customer: Customer }) {
	const customerName = getCustomerDisplayName(customer);

	return (
		<div className="space-y-3">
			<div className="flex items-start gap-3">
				<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full shrink-0">
					<User className="text-primary h-5 w-5" />
				</div>
				<div className="flex-1 min-w-0">
					<p className="font-semibold text-sm">{customerName}</p>
					{customer.company_name && (
						<p className="text-muted-foreground text-xs">
							{customer.company_name}
						</p>
					)}
				</div>
			</div>
			<div className="space-y-2">
				{customer.email && (
					<div className="flex items-center gap-2 text-xs">
						<Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
						<a
							href={`mailto:${customer.email}`}
							className="text-primary hover:underline truncate"
							onClick={(e) => e.stopPropagation()}
						>
							{customer.email}
						</a>
					</div>
				)}
				{customer.phone && (
					<div className="flex items-center gap-2 text-xs">
						<Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
						<a
							href={`tel:${customer.phone}`}
							className="text-primary hover:underline"
							onClick={(e) => e.stopPropagation()}
						>
							{customer.phone}
						</a>
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * Keyboard-accessible customer preview component
 * - Mouse users: hover over customer name to see preview
 * - Keyboard users: tab to info button and press Enter/Space to see preview
 */
export function CustomerPreviewCard({
	customer,
	className,
}: CustomerPreviewCardProps) {
	const [popoverOpen, setPopoverOpen] = useState(false);
	const customerName = getCustomerDisplayName(customer);

	return (
		<div className="flex items-center gap-1">
			{/* Mouse-accessible: Hover to preview */}
			<HoverCard>
				<HoverCardTrigger asChild>
					<Link
						href={`/dashboard/customers/${customer.id}`}
						onClick={(e) => e.stopPropagation()}
						className="text-sm hover:underline hover:text-primary flex items-center gap-1.5 truncate"
					>
						<User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
						<span className="truncate">{customerName}</span>
					</Link>
				</HoverCardTrigger>
				<HoverCardContent className="w-80" align="start">
					<CustomerCardContent customer={customer} />
				</HoverCardContent>
			</HoverCard>

			{/* Keyboard-accessible: Button to open preview */}
			<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="h-5 w-5 p-0 shrink-0"
						aria-label={`View ${customerName} contact information`}
						onClick={(e) => e.stopPropagation()}
					>
						<Info className="h-3.5 w-3.5 text-muted-foreground" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80" align="start">
					<CustomerCardContent customer={customer} />
				</PopoverContent>
			</Popover>
		</div>
	);
}

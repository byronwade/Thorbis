"use client";

/**
 * QuickAddDropdown - Client Component
 *
 * Quick access dropdown menu for creating new records across the application.
 * Provides one-click access to common creation actions from the main header.
 *
 * Client-side features:
 * - Dropdown menu with grouped actions by category
 * - Keyboard shortcuts display for power users
 * - Icon-based visual hierarchy
 * - Accessible with screen reader support
 *
 * Performance:
 * - Uses shadcn/ui DropdownMenu (Radix UI primitives)
 * - No data fetching - purely navigation-based
 * - Minimal bundle impact (~2KB)
 * - Client-only rendering to prevent hydration mismatch
 */

import {
	Briefcase,
	Calendar,
	DollarSign,
	FileSignature,
	FileSpreadsheet,
	FileText,
	Plus,
	Tag,
	UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type QuickAddAction = {
	label: string;
	href: string;
	icon: typeof Plus;
	shortcut?: string;
	description?: string;
};

const quickAddActions: Record<string, QuickAddAction[]> = {
	Work: [
		{
			label: "New Job",
			href: "/dashboard/work/new",
			icon: Briefcase,
			shortcut: "⌘J",
			description: "Create a new work order",
		},
		{
			label: "New Invoice",
			href: "/dashboard/work/invoices/new",
			icon: FileText,
			shortcut: "⌘I",
			description: "Generate an invoice",
		},
		{
			label: "New Estimate",
			href: "/dashboard/work/estimates/new",
			icon: FileSpreadsheet,
			shortcut: "⌘E",
			description: "Create a quote",
		},
		{
			label: "New Contract",
			href: "/dashboard/work/contracts/new",
			icon: FileSignature,
			description: "Draft a service contract",
		},
	],
	Customers: [
		{
			label: "New Customer",
			href: "/dashboard/customers/new",
			icon: UserPlus,
			shortcut: "⌘K",
			description: "Add a customer",
		},
	],
	Finance: [
		{
			label: "Record Payment",
			href: "/dashboard/finance/payments/new",
			icon: DollarSign,
			description: "Log a payment",
		},
	],
	Other: [
		{
			label: "Schedule Job",
			href: "/dashboard/schedule/new",
			icon: Calendar,
			description: "Add to schedule",
		},
		{
			label: "Price Book Item",
			href: "/dashboard/work/pricebook/new",
			icon: Tag,
			description: "Add inventory item",
		},
	],
};

export function QuickAddDropdown() {
	const [mounted, setMounted] = useState(false);

	// Only render on client to prevent hydration mismatch with Radix UI IDs
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		// Render placeholder button during SSR that matches client button dimensions
		return (
			<button
				className="hover-gradient hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:ring-ring/50 flex h-8 w-8 items-center justify-center rounded-md border border-transparent transition-all outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
				disabled
				title="Quick Add"
				type="button"
			>
				<Plus className="size-4" />
				<span className="sr-only">Quick Add Menu</span>
			</button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className="hover-gradient hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:ring-ring/50 flex h-8 w-8 items-center justify-center rounded-md border border-transparent transition-all outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
					title="Quick Add"
					type="button"
				>
					<Plus className="size-4" />
					<span className="sr-only">Quick Add Menu</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-64 rounded-lg">
				<DropdownMenuLabel className="font-semibold">Quick Add</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{Object.entries(quickAddActions).map(([category, actions], index) => (
					<div key={category}>
						{index > 0 && <DropdownMenuSeparator />}
						<DropdownMenuLabel className="text-muted-foreground text-xs">
							{category}
						</DropdownMenuLabel>
						<DropdownMenuGroup>
							{actions.map((action) => {
								const Icon = action.icon;
								return (
									<DropdownMenuItem asChild key={action.href}>
										<Link className="flex items-center gap-2" href={action.href}>
											<Icon className="size-4" />
											<div className="flex flex-1 flex-col">
												<span className="text-sm">{action.label}</span>
												{action.description && (
													<span className="text-muted-foreground text-xs">
														{action.description}
													</span>
												)}
											</div>
											{action.shortcut && (
												<DropdownMenuShortcut>{action.shortcut}</DropdownMenuShortcut>
											)}
										</Link>
									</DropdownMenuItem>
								);
							})}
						</DropdownMenuGroup>
					</div>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

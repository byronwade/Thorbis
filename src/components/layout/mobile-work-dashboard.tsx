"use client";

import {
	Briefcase,
	Calendar,
	Users,
	FileText,
	CreditCard,
	FileSignature,
	Receipt,
	Wrench,
	ShieldCheck,
	BookOpen,
	Building2,
	Box,
	Package,
	ClipboardList,
	ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

/**
 * MobileWorkDashboard - Mobile-optimized work management hub
 *
 * Provides quick access to all work management features:
 * - Jobs, Appointments, Team
 * - Financial documents (Invoices, Estimates, Payments, Contracts, POs)
 * - Service management (Maintenance, Service Agreements)
 * - Resources (Price Book, Vendors, Materials, Equipment)
 *
 * Designed for touch-friendly mobile interaction with large tap targets.
 */

type WorkSection = {
	id: string;
	title: string;
	description: string;
	icon: React.ElementType;
	items: {
		label: string;
		href: string;
		icon: React.ElementType;
		badge?: string;
	}[];
};

const workSections: WorkSection[] = [
	{
		id: "management",
		title: "Work Management",
		description: "Jobs, appointments, and team",
		icon: Briefcase,
		items: [
			{
				label: "Jobs",
				href: "/dashboard/work",
				icon: ClipboardList,
			},
			{
				label: "Appointments",
				href: "/dashboard/work/appointments",
				icon: Calendar,
			},
			{
				label: "Team Members",
				href: "/dashboard/work/team",
				icon: Users,
			},
			{
				label: "Customers",
				href: "/dashboard/customers",
				icon: Users,
			},
		],
	},
	{
		id: "financial",
		title: "Financial Documents",
		description: "Invoices, estimates, and payments",
		icon: CreditCard,
		items: [
			{
				label: "Invoices",
				href: "/dashboard/work/invoices",
				icon: FileText,
			},
			{
				label: "Estimates",
				href: "/dashboard/work/estimates",
				icon: FileText,
			},
			{
				label: "Payments",
				href: "/dashboard/work/payments",
				icon: CreditCard,
			},
			{
				label: "Contracts",
				href: "/dashboard/work/contracts",
				icon: FileSignature,
			},
			{
				label: "Purchase Orders",
				href: "/dashboard/work/purchase-orders",
				icon: Receipt,
			},
		],
	},
	{
		id: "service",
		title: "Service Management",
		description: "Maintenance plans and agreements",
		icon: Wrench,
		items: [
			{
				label: "Maintenance Plans",
				href: "/dashboard/work/maintenance-plans",
				icon: Wrench,
			},
			{
				label: "Service Agreements",
				href: "/dashboard/work/service-agreements",
				icon: ShieldCheck,
			},
		],
	},
	{
		id: "resources",
		title: "Company Resources",
		description: "Inventory and suppliers",
		icon: Box,
		items: [
			{
				label: "Price Book",
				href: "/dashboard/work/pricebook",
				icon: BookOpen,
			},
			{
				label: "Vendors",
				href: "/dashboard/work/vendors",
				icon: Building2,
			},
			{
				label: "Materials Inventory",
				href: "/dashboard/work/materials",
				icon: Box,
			},
			{
				label: "Equipment & Fleet",
				href: "/dashboard/work/equipment",
				icon: Package,
			},
		],
	},
];

export function MobileWorkDashboard() {
	return (
		<div className="flex h-full flex-col overflow-hidden bg-background">
			{/* Header */}
			<div className="shrink-0 border-b bg-card p-4 shadow-sm">
				<h1 className="text-2xl font-bold tracking-tight">Work Management</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Access all work features and resources
				</p>
			</div>

			{/* Scrollable sections */}
			<div className="flex-1 overflow-y-auto p-4 space-y-6 pb-safe">
				{workSections.map((section) => {
					const SectionIcon = section.icon;

					return (
						<div key={section.id} className="space-y-3">
							{/* Section header */}
							<div className="flex items-center gap-2">
								<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
									<SectionIcon className="h-5 w-5 text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<h2 className="font-semibold text-sm">{section.title}</h2>
									<p className="text-xs text-muted-foreground truncate">
										{section.description}
									</p>
								</div>
							</div>

							{/* Section items */}
							<div className="grid grid-cols-2 gap-2">
								{section.items.map((item) => {
									const ItemIcon = item.icon;

									return (
										<Link
											className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm active:scale-[0.98]"
											href={item.href}
											key={item.href}
										>
											<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50 transition-colors group-hover:bg-primary/10">
												<ItemIcon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
											</div>
											<div className="flex flex-col items-center gap-1">
												<span className="text-xs font-medium text-center leading-tight">
													{item.label}
												</span>
												{item.badge && (
													<Badge
														className="h-4 px-1.5 text-[0.65rem]"
														variant="secondary"
													>
														{item.badge}
													</Badge>
												)}
											</div>
											<ChevronRight className="h-3 w-3 text-muted-foreground/50 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
										</Link>
									);
								})}
							</div>
						</div>
					);
				})}

				{/* Quick stats card */}
				<div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-4">
					<div className="flex items-center gap-2 mb-3">
						<ClipboardList className="h-5 w-5 text-primary" />
						<h3 className="font-semibold text-sm">Quick Stats</h3>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1">
							<span className="text-2xl font-bold">--</span>
							<span className="text-xs text-muted-foreground">Active Jobs</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-2xl font-bold">--</span>
							<span className="text-xs text-muted-foreground">
								Today's Schedule
							</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-2xl font-bold">--</span>
							<span className="text-xs text-muted-foreground">Open Invoices</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-2xl font-bold">--</span>
							<span className="text-xs text-muted-foreground">Team Online</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

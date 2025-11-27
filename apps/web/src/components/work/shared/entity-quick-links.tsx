"use client";

import {
	Briefcase,
	Calendar,
	ChevronDown,
	CircleDollarSign,
	ClipboardList,
	ExternalLink,
	FileText,
	Package,
	Receipt,
	Settings,
	ShoppingCart,
	Store,
	Truck,
	User,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { EntityType, StatusConfig } from "./related-entity-card";

/**
 * Quick link item configuration
 */
export type QuickLinkItem = {
	type: EntityType;
	id: string;
	title: string;
	subtitle?: string;
	href: string;
	status?: StatusConfig;
};

/**
 * Grouped quick links by entity type
 */
export type QuickLinkGroup = {
	type: EntityType;
	label: string;
	items: QuickLinkItem[];
};

/**
 * Icon mapping for entity types (smaller version)
 */
const ENTITY_ICONS_SM: Record<EntityType, ReactNode> = {
	job: <Briefcase className="size-4" />,
	customer: <User className="size-4" />,
	estimate: <ClipboardList className="size-4" />,
	invoice: <Receipt className="size-4" />,
	contract: <FileText className="size-4" />,
	payment: <CircleDollarSign className="size-4" />,
	appointment: <Calendar className="size-4" />,
	equipment: <Wrench className="size-4" />,
	vendor: <Store className="size-4" />,
	"purchase-order": <ShoppingCart className="size-4" />,
	"service-agreement": <FileText className="size-4" />,
	"maintenance-plan": <Settings className="size-4" />,
	material: <Package className="size-4" />,
	property: <Truck className="size-4" />,
	"team-member": <User className="size-4" />,
};

/**
 * Entity type labels
 */
const ENTITY_LABELS: Record<EntityType, string> = {
	job: "Jobs",
	customer: "Customers",
	estimate: "Estimates",
	invoice: "Invoices",
	contract: "Contracts",
	payment: "Payments",
	appointment: "Appointments",
	equipment: "Equipment",
	vendor: "Vendors",
	"purchase-order": "Purchase Orders",
	"service-agreement": "Service Agreements",
	"maintenance-plan": "Maintenance Plans",
	material: "Materials",
	property: "Properties",
	"team-member": "Team Members",
};

/**
 * EntityQuickLink - A single inline quick link for navigation
 *
 * @example
 * <EntityQuickLink
 *   type="customer"
 *   title="John Smith"
 *   href="/dashboard/customers/123"
 * />
 */
export function EntityQuickLink({
	type,
	title,
	href,
	status,
	className,
}: {
	type: EntityType;
	title: string;
	href: string;
	status?: StatusConfig;
	className?: string;
}) {
	return (
		<Link
			className={cn(
				"inline-flex items-center gap-2 rounded-full px-3 py-1.5",
				"bg-muted/50 hover:bg-muted transition-colors",
				"text-sm font-medium",
				className
			)}
			href={href}
		>
			<span className="text-muted-foreground">{ENTITY_ICONS_SM[type]}</span>
			<span className="truncate">{title}</span>
			{status && (
				<Badge
					className={cn("text-xs", status.className)}
					variant={status.variant || "outline"}
				>
					{status.label}
				</Badge>
			)}
		</Link>
	);
}

/**
 * EntityQuickLinksBar - A horizontal bar of quick links
 *
 * @example
 * <EntityQuickLinksBar
 *   links={[
 *     { type: "customer", id: "1", title: "John Smith", href: "/dashboard/customers/1" },
 *     { type: "job", id: "2", title: "Job #1234", href: "/dashboard/work/2" },
 *   ]}
 * />
 */
export function EntityQuickLinksBar({
	links,
	maxVisible = 4,
	className,
}: {
	links: QuickLinkItem[];
	maxVisible?: number;
	className?: string;
}) {
	if (!links || links.length === 0) {
		return null;
	}

	const visibleLinks = links.slice(0, maxVisible);
	const hiddenLinks = links.slice(maxVisible);

	return (
		<div className={cn("flex flex-wrap items-center gap-2", className)}>
			{visibleLinks.map((link) => (
				<EntityQuickLink
					href={link.href}
					key={`${link.type}-${link.id}`}
					status={link.status}
					title={link.title}
					type={link.type}
				/>
			))}
			{hiddenLinks.length > 0 && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							className="h-8 rounded-full"
							size="sm"
							variant="outline"
						>
							+{hiddenLinks.length} more
							<ChevronDown className="ml-1 size-3" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-64">
						<DropdownMenuLabel>Related Items</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{hiddenLinks.map((link) => (
							<DropdownMenuItem asChild key={`${link.type}-${link.id}`}>
								<Link
									className="flex items-center gap-2"
									href={link.href}
								>
									<span className="text-muted-foreground">
										{ENTITY_ICONS_SM[link.type]}
									</span>
									<span className="flex-1 truncate">{link.title}</span>
									{link.status && (
										<Badge
											className={cn("text-xs", link.status.className)}
											variant={link.status.variant || "outline"}
										>
											{link.status.label}
										</Badge>
									)}
								</Link>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	);
}

/**
 * EntityQuickLinksDropdown - A dropdown menu with grouped quick links
 *
 * @example
 * <EntityQuickLinksDropdown
 *   groups={[
 *     {
 *       type: "estimate",
 *       label: "Estimates",
 *       items: [
 *         { type: "estimate", id: "1", title: "Estimate #100", href: "/..." },
 *       ]
 *     },
 *     {
 *       type: "invoice",
 *       label: "Invoices",
 *       items: [
 *         { type: "invoice", id: "2", title: "Invoice #200", href: "/..." },
 *       ]
 *     }
 *   ]}
 * />
 */
export function EntityQuickLinksDropdown({
	groups,
	triggerLabel = "Related Items",
	className,
}: {
	groups: QuickLinkGroup[];
	triggerLabel?: string;
	className?: string;
}) {
	const totalItems = groups.reduce((sum, group) => sum + group.items.length, 0);

	if (totalItems === 0) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className={cn("gap-2", className)}
					size="sm"
					variant="outline"
				>
					<ExternalLink className="size-4" />
					{triggerLabel}
					<Badge className="ml-1" variant="secondary">
						{totalItems}
					</Badge>
					<ChevronDown className="size-3" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-72">
				{groups.map((group, groupIndex) => (
					<div key={group.type}>
						{groupIndex > 0 && <DropdownMenuSeparator />}
						<DropdownMenuLabel className="flex items-center gap-2">
							{ENTITY_ICONS_SM[group.type]}
							{group.label}
							<Badge className="ml-auto" variant="secondary">
								{group.items.length}
							</Badge>
						</DropdownMenuLabel>
						{group.items.map((item) => (
							<DropdownMenuItem asChild key={item.id}>
								<Link
									className="flex items-center gap-2"
									href={item.href}
								>
									<span className="flex-1 truncate">{item.title}</span>
									{item.subtitle && (
										<span className="text-muted-foreground text-xs">
											{item.subtitle}
										</span>
									)}
									{item.status && (
										<Badge
											className={cn("text-xs", item.status.className)}
											variant={item.status.variant || "outline"}
										>
											{item.status.label}
										</Badge>
									)}
								</Link>
							</DropdownMenuItem>
						))}
					</div>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

/**
 * EntityNavigationBreadcrumb - Breadcrumb-style navigation showing entity hierarchy
 *
 * @example
 * <EntityNavigationBreadcrumb
 *   items={[
 *     { type: "customer", title: "John Smith", href: "/dashboard/customers/123" },
 *     { type: "job", title: "Job #1234", href: "/dashboard/work/456" },
 *   ]}
 *   current="Estimate #500"
 * />
 */
export function EntityNavigationBreadcrumb({
	items,
	current,
	className,
}: {
	items: { type: EntityType; title: string; href: string }[];
	current: string;
	className?: string;
}) {
	return (
		<nav
			aria-label="Entity navigation"
			className={cn("flex items-center gap-2 text-sm", className)}
		>
			{items.map((item, index) => (
				<div className="flex items-center gap-2" key={`${item.type}-${index}`}>
					<Link
						className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
						href={item.href}
					>
						{ENTITY_ICONS_SM[item.type]}
						<span>{item.title}</span>
					</Link>
					<span className="text-muted-foreground/50">/</span>
				</div>
			))}
			<span className="font-medium">{current}</span>
		</nav>
	);
}

/**
 * Helper function to build quick link groups from entity data
 */
export function buildQuickLinkGroups(data: {
	customer?: { id: string; name: string };
	job?: { id: string; job_number?: string; title?: string; status?: string };
	estimates?: Array<{ id: string; estimate_number?: string; status?: string; total_amount?: number }>;
	invoices?: Array<{ id: string; invoice_number?: string; status?: string; total_amount?: number }>;
	contracts?: Array<{ id: string; contract_number?: string; status?: string }>;
	payments?: Array<{ id: string; amount?: number; payment_method?: string; status?: string }>;
	appointments?: Array<{ id: string; title?: string; start_time?: string; status?: string }>;
	purchaseOrders?: Array<{ id: string; po_number?: string; status?: string; total_amount?: number }>;
}): QuickLinkGroup[] {
	const groups: QuickLinkGroup[] = [];

	if (data.estimates && data.estimates.length > 0) {
		groups.push({
			type: "estimate",
			label: ENTITY_LABELS.estimate,
			items: data.estimates.map((e) => ({
				type: "estimate" as EntityType,
				id: e.id,
				title: `Estimate #${e.estimate_number || e.id.slice(0, 8)}`,
				href: `/dashboard/work/estimates/${e.id}`,
				status: e.status ? { label: e.status } : undefined,
			})),
		});
	}

	if (data.invoices && data.invoices.length > 0) {
		groups.push({
			type: "invoice",
			label: ENTITY_LABELS.invoice,
			items: data.invoices.map((i) => ({
				type: "invoice" as EntityType,
				id: i.id,
				title: `Invoice #${i.invoice_number || i.id.slice(0, 8)}`,
				href: `/dashboard/work/invoices/${i.id}`,
				status: i.status ? { label: i.status } : undefined,
			})),
		});
	}

	if (data.contracts && data.contracts.length > 0) {
		groups.push({
			type: "contract",
			label: ENTITY_LABELS.contract,
			items: data.contracts.map((c) => ({
				type: "contract" as EntityType,
				id: c.id,
				title: `Contract #${c.contract_number || c.id.slice(0, 8)}`,
				href: `/dashboard/work/contracts/${c.id}`,
				status: c.status ? { label: c.status } : undefined,
			})),
		});
	}

	if (data.payments && data.payments.length > 0) {
		groups.push({
			type: "payment",
			label: ENTITY_LABELS.payment,
			items: data.payments.map((p) => ({
				type: "payment" as EntityType,
				id: p.id,
				title: p.payment_method || "Payment",
				subtitle: p.amount ? `$${(p.amount / 100).toFixed(2)}` : undefined,
				href: `/dashboard/work/payments/${p.id}`,
				status: p.status ? { label: p.status } : undefined,
			})),
		});
	}

	if (data.appointments && data.appointments.length > 0) {
		groups.push({
			type: "appointment",
			label: ENTITY_LABELS.appointment,
			items: data.appointments.map((a) => ({
				type: "appointment" as EntityType,
				id: a.id,
				title: a.title || "Appointment",
				subtitle: a.start_time
					? new Date(a.start_time).toLocaleDateString()
					: undefined,
				href: `/dashboard/work/appointments/${a.id}`,
				status: a.status ? { label: a.status } : undefined,
			})),
		});
	}

	if (data.purchaseOrders && data.purchaseOrders.length > 0) {
		groups.push({
			type: "purchase-order",
			label: ENTITY_LABELS["purchase-order"],
			items: data.purchaseOrders.map((po) => ({
				type: "purchase-order" as EntityType,
				id: po.id,
				title: `PO #${po.po_number || po.id.slice(0, 8)}`,
				href: `/dashboard/work/purchase-orders/${po.id}`,
				status: po.status ? { label: po.status } : undefined,
			})),
		});
	}

	return groups;
}

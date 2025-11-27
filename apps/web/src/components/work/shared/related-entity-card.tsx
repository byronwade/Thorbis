"use client";

import {
	Briefcase,
	Calendar,
	ChevronRight,
	CircleDollarSign,
	ClipboardList,
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
import { cn } from "@/lib/utils";

/**
 * Entity types supported by the RelatedEntityCard
 */
export type EntityType =
	| "job"
	| "customer"
	| "estimate"
	| "invoice"
	| "contract"
	| "payment"
	| "appointment"
	| "equipment"
	| "vendor"
	| "purchase-order"
	| "service-agreement"
	| "maintenance-plan"
	| "material"
	| "property"
	| "team-member";

/**
 * Status badge configuration
 */
export type StatusConfig = {
	label: string;
	variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
	className?: string;
};

/**
 * Props for RelatedEntityCard
 */
export type RelatedEntityCardProps = {
	/** Entity type for icon and styling */
	type: EntityType;
	/** Display title (e.g., "Job #1234" or "John Smith") */
	title: string;
	/** Optional subtitle (e.g., status, amount, date) */
	subtitle?: string;
	/** Link to entity detail page */
	href: string;
	/** Optional status badge */
	status?: StatusConfig;
	/** Optional secondary info (e.g., amount, date) */
	secondaryInfo?: string;
	/** Optional tertiary info */
	tertiaryInfo?: string;
	/** Custom icon override */
	icon?: ReactNode;
	/** Size variant */
	size?: "sm" | "md" | "lg";
	/** Additional className */
	className?: string;
	/** Disable link behavior */
	disabled?: boolean;
};

/**
 * Icon mapping for entity types
 */
const ENTITY_ICONS: Record<EntityType, ReactNode> = {
	job: <Briefcase className="size-5" />,
	customer: <User className="size-5" />,
	estimate: <ClipboardList className="size-5" />,
	invoice: <Receipt className="size-5" />,
	contract: <FileText className="size-5" />,
	payment: <CircleDollarSign className="size-5" />,
	appointment: <Calendar className="size-5" />,
	equipment: <Wrench className="size-5" />,
	vendor: <Store className="size-5" />,
	"purchase-order": <ShoppingCart className="size-5" />,
	"service-agreement": <FileText className="size-5" />,
	"maintenance-plan": <Settings className="size-5" />,
	material: <Package className="size-5" />,
	property: <Truck className="size-5" />,
	"team-member": <User className="size-5" />,
};

/**
 * Entity type labels
 */
const ENTITY_LABELS: Record<EntityType, string> = {
	job: "Job",
	customer: "Customer",
	estimate: "Estimate",
	invoice: "Invoice",
	contract: "Contract",
	payment: "Payment",
	appointment: "Appointment",
	equipment: "Equipment",
	vendor: "Vendor",
	"purchase-order": "Purchase Order",
	"service-agreement": "Service Agreement",
	"maintenance-plan": "Maintenance Plan",
	material: "Material",
	property: "Property",
	"team-member": "Team Member",
};

/**
 * Entity type colors for accent styling
 */
const ENTITY_COLORS: Record<EntityType, string> = {
	job: "text-blue-600 dark:text-blue-400",
	customer: "text-purple-600 dark:text-purple-400",
	estimate: "text-amber-600 dark:text-amber-400",
	invoice: "text-green-600 dark:text-green-400",
	contract: "text-indigo-600 dark:text-indigo-400",
	payment: "text-emerald-600 dark:text-emerald-400",
	appointment: "text-orange-600 dark:text-orange-400",
	equipment: "text-slate-600 dark:text-slate-400",
	vendor: "text-pink-600 dark:text-pink-400",
	"purchase-order": "text-cyan-600 dark:text-cyan-400",
	"service-agreement": "text-teal-600 dark:text-teal-400",
	"maintenance-plan": "text-lime-600 dark:text-lime-400",
	material: "text-stone-600 dark:text-stone-400",
	property: "text-sky-600 dark:text-sky-400",
	"team-member": "text-violet-600 dark:text-violet-400",
};

/**
 * Size configurations
 */
const SIZE_CLASSES = {
	sm: {
		container: "p-3",
		icon: "size-8",
		iconInner: "size-4",
		title: "text-sm",
		subtitle: "text-xs",
	},
	md: {
		container: "p-4",
		icon: "size-10",
		iconInner: "size-5",
		title: "text-base",
		subtitle: "text-sm",
	},
	lg: {
		container: "p-5",
		icon: "size-12",
		iconInner: "size-6",
		title: "text-lg",
		subtitle: "text-sm",
	},
};

/**
 * RelatedEntityCard - A prominent, clickable card for navigating to related entities
 *
 * Used across all detail pages to provide consistent interlinking between entities.
 * Shows entity type icon, title, status badge, and navigation chevron.
 *
 * @example
 * // Link to a customer
 * <RelatedEntityCard
 *   type="customer"
 *   title="John Smith"
 *   subtitle="john@example.com"
 *   href="/dashboard/customers/123"
 *   status={{ label: "Active", variant: "success" }}
 * />
 *
 * @example
 * // Link to a job
 * <RelatedEntityCard
 *   type="job"
 *   title="Job #1234"
 *   subtitle="HVAC Installation"
 *   href="/dashboard/work/123"
 *   status={{ label: "In Progress", variant: "default" }}
 *   secondaryInfo="$5,000"
 * />
 */
export function RelatedEntityCard({
	type,
	title,
	subtitle,
	href,
	status,
	secondaryInfo,
	tertiaryInfo,
	icon,
	size = "md",
	className,
	disabled = false,
}: RelatedEntityCardProps) {
	const sizeConfig = SIZE_CLASSES[size];
	const entityIcon = icon || ENTITY_ICONS[type];
	const entityColor = ENTITY_COLORS[type];
	const entityLabel = ENTITY_LABELS[type];

	const content = (
		<div
			className={cn(
				"group relative flex items-center gap-4 rounded-lg border transition-all",
				"bg-card hover:bg-muted/50 hover:border-primary/30",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
				disabled && "pointer-events-none opacity-50",
				sizeConfig.container,
				className
			)}
		>
			{/* Icon container */}
			<div
				className={cn(
					"flex items-center justify-center rounded-lg",
					"bg-muted/50 group-hover:bg-primary/10",
					sizeConfig.icon
				)}
			>
				<span className={cn(entityColor, sizeConfig.iconInner)}>
					{entityIcon}
				</span>
			</div>

			{/* Content */}
			<div className="min-w-0 flex-1">
				{/* Entity type label */}
				<p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
					{entityLabel}
				</p>

				{/* Title row with status */}
				<div className="flex items-center gap-2">
					<h4
						className={cn(
							"truncate font-semibold",
							sizeConfig.title
						)}
					>
						{title}
					</h4>
					{status && (
						<Badge
							className={cn("flex-shrink-0", status.className)}
							variant={status.variant || "outline"}
						>
							{status.label}
						</Badge>
					)}
				</div>

				{/* Subtitle / secondary info */}
				{(subtitle || secondaryInfo) && (
					<div className={cn("text-muted-foreground flex items-center gap-2", sizeConfig.subtitle)}>
						{subtitle && <span className="truncate">{subtitle}</span>}
						{subtitle && secondaryInfo && <span>·</span>}
						{secondaryInfo && <span className="font-medium">{secondaryInfo}</span>}
					</div>
				)}

				{/* Tertiary info */}
				{tertiaryInfo && (
					<p className={cn("text-muted-foreground/70 truncate", sizeConfig.subtitle)}>
						{tertiaryInfo}
					</p>
				)}
			</div>

			{/* Navigation chevron */}
			<ChevronRight className="text-muted-foreground size-5 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
		</div>
	);

	if (disabled) {
		return content;
	}

	return (
		<Link className="block focus:outline-none" href={href}>
			{content}
		</Link>
	);
}

/**
 * RelatedEntityCardGrid - A grid container for multiple RelatedEntityCards
 */
export function RelatedEntityCardGrid({
	children,
	columns = 2,
	className,
}: {
	children: ReactNode;
	columns?: 1 | 2 | 3;
	className?: string;
}) {
	const colsClass = {
		1: "grid-cols-1",
		2: "grid-cols-1 md:grid-cols-2",
		3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
	}[columns];

	return (
		<div className={cn("grid gap-4", colsClass, className)}>
			{children}
		</div>
	);
}

/**
 * RelatedEntityCardSkeleton - Loading state for RelatedEntityCard
 */
export function RelatedEntityCardSkeleton({
	size = "md",
}: {
	size?: "sm" | "md" | "lg";
}) {
	const sizeConfig = SIZE_CLASSES[size];

	return (
		<div
			className={cn(
				"flex items-center gap-4 rounded-lg border bg-card animate-pulse",
				sizeConfig.container
			)}
		>
			<div className={cn("rounded-lg bg-muted", sizeConfig.icon)} />
			<div className="min-w-0 flex-1 space-y-2">
				<div className="h-3 w-16 rounded bg-muted" />
				<div className="h-5 w-32 rounded bg-muted" />
				<div className="h-3 w-24 rounded bg-muted" />
			</div>
			<div className="size-5 rounded bg-muted" />
		</div>
	);
}

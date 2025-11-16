"use client";

/**
 * DetailPageToolbar - Unified Toolbar for All Detail Pages
 *
 * Features:
 * - Back button navigation
 * - Entity status badge
 * - Primary actions (2-3 most important)
 * - Secondary actions (grouped)
 * - Context menu (ellipsis) with entity-specific actions
 * - Mobile-responsive with progressive disclosure
 * - Perfect typography & spacing
 * - Accessible keyboard navigation
 *
 * Design System:
 * - Font: System font stack
 * - Spacing: Tailwind scale (gap-1.5, gap-2, p-1)
 * - Colors: Semantic (primary, destructive, success, warning)
 * - Icons: Lucide React (size-4 for buttons, size-3.5 for menu items)
 * - Transitions: duration-200 ease-in-out
 *
 * Performance:
 * - Client Component (interactive features)
 * - Uses React.memo for nested components
 * - Tooltips lazy-loaded
 */

import type { LucideIcon } from "lucide-react";
import {
	Archive,
	ArrowLeft,
	Copy,
	Download,
	Edit3,
	Eye,
	Mail,
	MoreVertical,
	Printer,
	Send,
	Share2,
	Trash2,
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
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

export type DetailToolbarAction = {
	/** Unique identifier */
	id: string;
	/** Display label */
	label: string;
	/** Icon component */
	icon: LucideIcon;
	/** Click handler */
	onClick?: () => void;
	/** Link href (alternative to onClick) */
	href?: string;
	/** Visual variant */
	variant?: "default" | "primary" | "destructive" | "success";
	/** Tooltip text */
	tooltip?: string;
	/** Show only on desktop */
	desktopOnly?: boolean;
	/** Disabled state */
	disabled?: boolean;
	/** Loading state */
	loading?: boolean;
};

export type DetailToolbarContextAction = {
	/** Unique identifier */
	id: string;
	/** Display label */
	label: string;
	/** Icon component */
	icon: LucideIcon;
	/** Click handler */
	onClick: () => void;
	/** Visual variant */
	variant?: "default" | "destructive";
	/** Disabled state */
	disabled?: boolean;
	/** Show separator before this item */
	separatorBefore?: boolean;
};

export type DetailToolbarProps = {
	/** Back button configuration */
	back: {
		/** Back link href */
		href: string;
		/** Back link label */
		label: string;
	};
	/** Entity title/name */
	title: string;
	/** Entity subtitle (optional) */
	subtitle?: string;
	/** Status badge */
	status?: {
		/** Status label */
		label: string;
		/** Status variant */
		variant: "default" | "success" | "warning" | "destructive" | "secondary";
	};
	/** Primary actions (2-3 most important, always visible) */
	primaryActions?: DetailToolbarAction[];
	/** Secondary actions (grouped, hidden on mobile) */
	secondaryActions?: DetailToolbarAction[];
	/** Context menu actions (ellipsis dropdown) */
	contextActions?: DetailToolbarContextAction[];
	/** Custom content to render (optional) */
	customContent?: ReactNode;
	/** Additional className */
	className?: string;
};

// ============================================================================
// COMPONENT
// ============================================================================

export function DetailPageToolbar({
	back,
	title,
	subtitle,
	status,
	primaryActions = [],
	secondaryActions = [],
	contextActions = [],
	customContent,
	className,
}: DetailToolbarProps) {
	return (
		<div
			className={cn(
				"sticky top-0 z-40 flex w-full flex-col border-border/50 border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90",
				className,
			)}
		>
			{/* Main Toolbar Row - Fixed height for consistency */}
			<div className="flex h-16 w-full items-center gap-3 px-4 md:px-6">
				{/* Left Section: Back Button + Title */}
				<div className="flex min-w-0 flex-1 items-center gap-3">
					{/* Back Button - Fixed dimensions */}
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									asChild
									className="h-9 w-9 shrink-0 hover:bg-muted" // Fixed dimensions
									size="icon"
									variant="ghost"
								>
									<Link href={back.href}>
										<ArrowLeft className="size-4" />
										<span className="sr-only">{back.label}</span>
									</Link>
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>{back.label}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					{/* Title + Status */}
					<div className="flex min-w-0 flex-1 items-center gap-3">
						<div className="min-w-0 flex-1">
							<h1 className="truncate font-semibold text-base text-foreground leading-tight tracking-tight md:text-lg">
								{title}
							</h1>
							{subtitle && (
								<p className="truncate text-muted-foreground text-sm leading-tight">
									{subtitle}
								</p>
							)}
						</div>

						{/* Status Badge */}
						{status && (
							<Badge
								className="shrink-0 font-medium"
								variant={
									status.variant === "success" || status.variant === "warning"
										? "default"
										: status.variant
								}
							>
								{status.label}
							</Badge>
						)}
					</div>
				</div>

				{/* Right Section: Actions */}
				<div className="flex shrink-0 items-center gap-1.5">
					{/* Primary Actions - Always Visible */}
					{primaryActions.length > 0 && (
						<>
							<div className="flex items-center gap-1.5">
								{primaryActions.map((action) => (
									<ActionButton action={action} key={action.id} />
								))}
							</div>
							{(secondaryActions.length > 0 || contextActions.length > 0) && (
								<Separator className="h-8" orientation="vertical" />
							)}
						</>
					)}

					{/* Secondary Actions - Grouped, Hidden on Mobile */}
					{secondaryActions.length > 0 && (
						<>
							<div className="hidden h-11 items-center gap-1.5 rounded-lg border bg-muted/30 p-1 md:flex">
								{secondaryActions.map((action) => (
									<ActionButton action={action} ghost key={action.id} />
								))}
							</div>
							{contextActions.length > 0 && (
								<Separator
									className="hidden h-8 md:block"
									orientation="vertical"
								/>
							)}
						</>
					)}

					{/* Context Menu (Ellipsis) */}
					{contextActions.length > 0 && (
						<ContextMenu actions={contextActions} />
					)}

					{/* Custom Content */}
					{customContent}
				</div>
			</div>
		</div>
	);
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Action Button - Individual action button with tooltip
 */
function ActionButton({
	action,
	ghost = false,
}: {
	action: DetailToolbarAction;
	ghost?: boolean;
}) {
	const buttonVariant = ghost
		? "ghost"
		: action.variant === "primary"
			? "default"
			: action.variant === "destructive"
				? "destructive"
				: "outline";

	const buttonClasses = cn(
		"h-9 gap-2", // Fixed height for consistency
		ghost && "hover:bg-background",
		!ghost &&
			action.variant === "primary" &&
			"bg-primary text-primary-foreground hover:bg-primary/90",
		!ghost &&
			action.variant === "destructive" &&
			"border-destructive/20 text-destructive hover:border-destructive/30 hover:bg-destructive/10",
		!ghost &&
			action.variant === "success" &&
			"border-success/20 bg-success/5 text-success hover:border-success/30 hover:bg-success/10 dark:text-success",
		action.desktopOnly && "hidden md:flex",
	);

	const button = (
		<Button
			asChild={!!action.href}
			className={buttonClasses}
			disabled={action.disabled || action.loading}
			onClick={action.onClick}
			size="sm"
			variant={buttonVariant}
		>
			{action.href ? (
				<Link href={action.href}>
					<action.icon className="size-4" />
					<span className={cn("font-medium", ghost && "hidden sm:inline")}>
						{action.loading ? "Loading..." : action.label}
					</span>
				</Link>
			) : (
				<>
					<action.icon className="size-4" />
					<span className={cn("font-medium", ghost && "hidden sm:inline")}>
						{action.loading ? "Loading..." : action.label}
					</span>
				</>
			)}
		</Button>
	);

	if (!action.tooltip) {
		return button;
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>{button}</TooltipTrigger>
				<TooltipContent side="bottom">
					<p>{action.tooltip}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

/**
 * Context Menu - Ellipsis dropdown with entity-specific actions
 */
function ContextMenu({ actions }: { actions: DetailToolbarContextAction[] }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className="h-9 w-9 hover:bg-muted" // Fixed dimensions for consistency
					size="icon"
					variant="ghost"
				>
					<MoreVertical className="size-4" />
					<span className="sr-only">More actions</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
					Actions
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{actions.map((action, index) => (
					<div key={action.id}>
						{action.separatorBefore && index > 0 && <DropdownMenuSeparator />}
						<DropdownMenuItem
							className={cn(
								"cursor-pointer gap-2",
								action.variant === "destructive" &&
									"text-destructive focus:text-destructive",
							)}
							disabled={action.disabled}
							onClick={action.onClick}
						>
							<action.icon className="size-3.5" />
							<span>{action.label}</span>
						</DropdownMenuItem>
					</div>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

// ============================================================================
// PRESET ACTION CONFIGURATIONS
// ============================================================================

/**
 * Common actions that can be reused across entity types
 */
export const COMMON_ACTIONS = {
	// Primary Actions
	edit: (onClick: () => void): DetailToolbarAction => ({
		id: "edit",
		label: "Edit",
		icon: Edit3,
		onClick,
		variant: "primary",
		tooltip: "Edit this record",
	}),

	send: (onClick: () => void): DetailToolbarAction => ({
		id: "send",
		label: "Send",
		icon: Send,
		onClick,
		variant: "primary",
		tooltip: "Send via email",
	}),

	viewMode: (onClick: () => void): DetailToolbarAction => ({
		id: "view",
		label: "View",
		icon: Eye,
		onClick,
		variant: "default",
		tooltip: "Switch to view mode",
	}),

	// Secondary Actions
	duplicate: (onClick: () => void): DetailToolbarAction => ({
		id: "duplicate",
		label: "Clone",
		icon: Copy,
		onClick,
		tooltip: "Duplicate this record",
	}),

	print: (onClick: () => void): DetailToolbarAction => ({
		id: "print",
		label: "Print",
		icon: Printer,
		onClick,
		tooltip: "Print",
		desktopOnly: true,
	}),

	download: (onClick: () => void): DetailToolbarAction => ({
		id: "download",
		label: "Download",
		icon: Download,
		onClick,
		tooltip: "Download PDF",
		desktopOnly: true,
	}),

	share: (onClick: () => void): DetailToolbarAction => ({
		id: "share",
		label: "Share",
		icon: Share2,
		onClick,
		tooltip: "Share link",
		desktopOnly: true,
	}),

	// Context Actions
	email: (onClick: () => void): DetailToolbarContextAction => ({
		id: "email",
		label: "Send Email",
		icon: Mail,
		onClick,
	}),

	archive: (onClick: () => void): DetailToolbarContextAction => ({
		id: "archive",
		label: "Archive",
		icon: Archive,
		onClick,
		variant: "destructive",
		separatorBefore: true,
	}),

	delete: (onClick: () => void): DetailToolbarContextAction => ({
		id: "delete",
		label: "Delete",
		icon: Trash2,
		onClick,
		variant: "destructive",
		separatorBefore: true,
	}),
};

/**
 * Collapsible Data Section - Unified Component
 *
 * Standardized collapsible section with:
 * - Consistent structure and styling
 * - Loading states with skeletons
 * - Optimistic updates support
 * - Empty, success, and error states
 * - Full-width datatable integration
 * - Consistent button variants
 */

"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type CollapsibleDataSectionProps = {
	/** Unique identifier for accordion */
	value: string;
	/** Section title */
	title: string;
	/** Icon component */
	icon?: ReactNode;
	/** Badge or count display */
	badge?: ReactNode;
	/** Item count (displays as badge if no badge provided) */
	count?: number;
	/** Summary text when collapsed */
	summary?: string;
	/** Action buttons (e.g., "Add Job", "Create Invoice") */
	actions?: ReactNode;
	/** Children content */
	children: ReactNode;
	/** If true, removes padding for full-width tables */
	fullWidthContent?: boolean;
	/** Loading state */
	isLoading?: boolean;
	/** Error state */
	error?: string | null;
	/** Empty state configuration */
	emptyState?: {
		show: boolean;
		icon?: ReactNode;
		title?: string;
		description?: string;
		action?: ReactNode;
	};
	/** Additional className */
	className?: string;
	/** Default open state */
	defaultOpen?: boolean;
	/** Storage key for persisting open state */
	storageKey?: string;
	/** Controlled open state (for non-accordion usage) */
	isOpen?: boolean;
	/** Controlled open state handler (for non-accordion usage) */
	onOpenChange?: (open: boolean) => void;
	/** Use standalone mode (not within Accordion component) */
	standalone?: boolean;
};

export function CollapsibleDataSection({
	value,
	title,
	icon,
	badge,
	count,
	summary,
	actions,
	children,
	fullWidthContent = false,
	isLoading = false,
	error = null,
	emptyState,
	className,
	defaultOpen = true,
	storageKey,
	isOpen: controlledIsOpen,
	onOpenChange,
	standalone = false,
}: CollapsibleDataSectionProps) {
	// Standalone mode state management
	const [localIsOpen, setLocalIsOpen] = useState(() => {
		if (!standalone) {
			return defaultOpen;
		}
		if (storageKey && typeof window !== "undefined") {
			const stored = localStorage.getItem(storageKey);
			return stored ? JSON.parse(stored) : defaultOpen;
		}
		return defaultOpen;
	});

	const isOpen = standalone ? (controlledIsOpen ?? localIsOpen) : undefined;

	const toggleOpen = () => {
		if (!standalone) {
			return;
		}
		const newValue = !isOpen;
		setLocalIsOpen(newValue);
		onOpenChange?.(newValue);
		if (storageKey && typeof window !== "undefined") {
			localStorage.setItem(storageKey, JSON.stringify(newValue));
		}
	};

	// Show empty state
	const showEmptyState = emptyState?.show && !isLoading && !error;

	// Render loading skeleton
	const renderLoadingSkeleton = () => (
		<div className="space-y-3">
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-3/4" />
			<Skeleton className="h-4 w-5/6" />
		</div>
	);

	// Render error state
	const renderError = () => (
		<div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
			<p className="text-destructive text-sm">{error}</p>
		</div>
	);

	// Render empty state
	const renderEmptyState = () => (
		<div className="flex h-full min-h-[50vh] items-center justify-center px-4 py-12 md:min-h-[60vh]">
			<div className="mx-auto w-full max-w-md space-y-4 text-center">
				{emptyState?.icon && (
					<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
						{emptyState.icon}
					</div>
				)}
				<div className="space-y-2">
					<h3 className="font-semibold text-lg">{emptyState?.title || "No items found"}</h3>
					<p className="text-muted-foreground text-sm">
						{emptyState?.description || "Get started by creating your first item."}
					</p>
					{emptyState?.action && <div className="flex justify-center pt-2">{emptyState.action}</div>}
				</div>
			</div>
		</div>
	);

	// Render content
	const renderContent = () => {
		if (isLoading) {
			return renderLoadingSkeleton();
		}
		if (error) {
			return renderError();
		}
		if (showEmptyState) {
			return renderEmptyState();
		}
		return fullWidthContent ? <div>{children}</div> : <div className="space-y-4">{children}</div>;
	};

	// Standalone mode (not within Accordion)
	if (standalone) {
		return (
			<div className={cn("rounded-lg border bg-card shadow-sm", className)}>
				<div className="flex w-full items-center justify-between gap-4 px-6 py-3.5">
					<button
						className="flex flex-1 items-center gap-3 rounded-md text-left transition-colors hover:bg-muted/50"
						onClick={toggleOpen}
						type="button"
					>
						{/* Icon with Background */}
						{icon && (
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
								<span className="text-primary [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
							</div>
						)}

						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2">
								<h3 className="font-medium text-sm">{title}</h3>
								{count !== undefined && !badge && (
									<Badge className="ml-1 text-xs" variant="secondary">
										{count}
									</Badge>
								)}
								{badge}
							</div>
							{summary && !isOpen && <p className="mt-0.5 text-muted-foreground text-xs">{summary}</p>}
						</div>

						{/* Collapse/Expand Chevron */}
						{isOpen ? (
							<ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform" />
						) : (
							<ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform" />
						)}
					</button>

					{/* Action Buttons - Always visible on far right */}
					{actions && (
						<div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
							{actions}
						</div>
					)}
				</div>

				{/* Content - Collapsible */}
				{isOpen && (
					<div
						className={cn(
							"fade-in slide-in-from-top-2 animate-in border-t p-6 duration-200",
							fullWidthContent && "p-0"
						)}
					>
						{renderContent()}
					</div>
				)}
			</div>
		);
	}

	// Accordion mode (default)
	return (
		<AccordionItem
			className={cn(
				"rounded-lg bg-card shadow-sm",
				fullWidthContent ? "overflow-hidden border-0" : "border",
				className
			)}
			value={value}
		>
			<div
				className={cn("flex items-center justify-between gap-4 py-3.5", fullWidthContent ? "border-b px-6" : "px-6")}
			>
				<AccordionTrigger className="flex-1 hover:no-underline">
					<div className="flex items-center gap-3">
						{icon && (
							<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
								<span className="text-primary [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
							</div>
						)}
						<span className="font-medium text-sm">{title}</span>
						{count !== undefined && !badge && (
							<Badge className="ml-1 text-xs" variant="secondary">
								{count}
							</Badge>
						)}
						{badge}
					</div>
				</AccordionTrigger>
				{actions && (
					<div
						className="flex shrink-0 items-center gap-2"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
					>
						{actions}
					</div>
				)}
			</div>
			<AccordionContent className={cn(fullWidthContent ? "p-0" : "px-6 pb-6")}>{renderContent()}</AccordionContent>
		</AccordionItem>
	);
}

/**
 * Standardized Action Button for Collapsible Sections
 * Ensures consistent styling across all collapsible section actions
 */
type CollapsibleActionButtonProps = {
	onClick: () => void;
	icon?: ReactNode;
	children: ReactNode;
	variant?: "default" | "secondary" | "outline" | "ghost";
	disabled?: boolean;
	isLoading?: boolean;
	className?: string;
};

export function CollapsibleActionButton({
	onClick,
	icon,
	children,
	variant = "secondary",
	disabled = false,
	isLoading = false,
	className,
}: CollapsibleActionButtonProps) {
	return (
		<Button
			className={cn("h-8 gap-1.5 px-3 text-xs", className)}
			disabled={disabled || isLoading}
			onClick={onClick}
			size="sm"
			variant={variant}
		>
			{icon}
			{children}
		</Button>
	);
}

/**
 * Standardized Empty State Action Button
 * Used within empty states for primary actions
 */
type EmptyStateActionButtonProps = {
	onClick: () => void;
	icon?: ReactNode;
	children: ReactNode;
	disabled?: boolean;
	className?: string;
};

export function EmptyStateActionButton({
	onClick,
	icon,
	children,
	disabled = false,
	className,
}: EmptyStateActionButtonProps) {
	return (
		<Button className={cn("gap-2", className)} disabled={disabled} onClick={onClick} size="sm">
			{icon}
			{children}
		</Button>
	);
}

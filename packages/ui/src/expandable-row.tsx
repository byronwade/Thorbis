"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "./utils";

/**
 * Expandable Row Component
 *
 * Provides a clean way to show nested data within tables.
 * Click the row to expand and see associated details.
 *
 * Pattern:
 * - Main row shows summary data
 * - Click anywhere to expand
 * - Expanded area shows nested associations
 * - Smooth animation
 * - Visual indicator (chevron)
 *
 * Usage:
 * <ExpandableRow
 *   summary={<div>Appointment #123</div>}
 *   details={<div>Team members, notes, etc.</div>}
 * />
 */

type ExpandableRowProps = {
	/** Summary content shown in collapsed state */
	summary: React.ReactNode;
	/** Detailed content shown when expanded */
	details: React.ReactNode;
	/** Optional className for the row */
	className?: string;
	/** Optional className for expanded content */
	detailsClassName?: string;
	/** Default expanded state */
	defaultExpanded?: boolean;
	/** Controlled expanded state */
	expanded?: boolean;
	/** Callback when expansion changes */
	onExpandedChange?: (expanded: boolean) => void;
	/** Show expand indicator (chevron) */
	showIndicator?: boolean;
	/** Disable expansion */
	disabled?: boolean;
};

export function ExpandableRow({
	summary,
	details,
	className,
	detailsClassName,
	defaultExpanded = false,
	expanded: controlledExpanded,
	onExpandedChange,
	showIndicator = true,
	disabled = false,
}: ExpandableRowProps) {
	const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

	const isExpanded =
		controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

	const handleToggle = () => {
		if (disabled) return;

		const newExpanded = !isExpanded;

		if (controlledExpanded === undefined) {
			setInternalExpanded(newExpanded);
		}

		onExpandedChange?.(newExpanded);
	};

	return (
		<div className="border-b last:border-b-0">
			{/* Summary Row */}
			<div
				className={cn(
					"group relative flex items-center gap-3 transition-colors",
					!disabled && "hover:bg-muted/50 cursor-pointer",
					disabled && "cursor-default opacity-60",
					className,
				)}
				onClick={handleToggle}
			>
				{/* Expand Indicator */}
				{showIndicator && (
					<div className="text-muted-foreground flex w-8 shrink-0 items-center justify-center">
						{isExpanded ? (
							<ChevronDown className="size-4 transition-transform" />
						) : (
							<ChevronRight className="size-4 transition-transform" />
						)}
					</div>
				)}

				{/* Summary Content */}
				<div className="flex-1">{summary}</div>
			</div>

			{/* Expanded Details */}
			{isExpanded && (
				<div
					className={cn(
						"animate-in slide-in-from-top-2 bg-muted/20 border-t",
						showIndicator && "ml-8",
						detailsClassName,
					)}
				>
					{details}
				</div>
			)}
		</div>
	);
}

/**
 * Expandable Row Section
 *
 * Used within expanded details to organize different types of data.
 */
type ExpandableRowSectionProps = {
	title: string;
	icon?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
};

export function ExpandableRowSection({
	title,
	icon,
	children,
	className,
}: ExpandableRowSectionProps) {
	return (
		<div className={cn("border-b p-4 last:border-b-0", className)}>
			<div className="mb-3 flex items-center gap-2">
				{icon && <div className="text-muted-foreground">{icon}</div>}
				<h4 className="text-sm font-medium">{title}</h4>
			</div>
			<div className="text-muted-foreground text-sm">{children}</div>
		</div>
	);
}

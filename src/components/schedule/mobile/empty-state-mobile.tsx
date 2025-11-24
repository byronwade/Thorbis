"use client";

import { Calendar, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * EmptyStateMobile - Mobile-optimized empty state component
 *
 * Shows helpful messages and CTAs when:
 * - No jobs scheduled
 * - No search/filter results
 * - No unassigned jobs
 * - Technician has no jobs today
 *
 * Design:
 * - Icon illustration
 * - Helpful message
 * - Call-to-action button(s)
 * - Centered layout
 * - Compact for mobile screens
 */

export type EmptyStateVariant =
	| "no_jobs"
	| "no_results"
	| "no_unassigned"
	| "no_jobs_today";

type EmptyStateMobileProps = {
	variant: EmptyStateVariant;
	onAction?: () => void;
	actionLabel?: string;
	className?: string;
};

const emptyStateConfig: Record<
	EmptyStateVariant,
	{
		icon: React.ElementType;
		title: string;
		description: string;
		defaultActionLabel: string;
	}
> = {
	no_jobs: {
		icon: Calendar,
		title: "No jobs scheduled",
		description: "Get started by scheduling your first appointment",
		defaultActionLabel: "Schedule Appointment",
	},
	no_results: {
		icon: Search,
		title: "No jobs found",
		description: "Try adjusting your search or filters",
		defaultActionLabel: "Clear Filters",
	},
	no_unassigned: {
		icon: Users,
		title: "All jobs assigned",
		description: "Great! All jobs have been assigned to technicians",
		defaultActionLabel: "View Schedule",
	},
	no_jobs_today: {
		icon: Calendar,
		title: "No jobs today",
		description: "This technician has no scheduled jobs for today",
		defaultActionLabel: "View Full Schedule",
	},
};

export function EmptyStateMobile({
	variant,
	onAction,
	actionLabel,
	className,
}: EmptyStateMobileProps) {
	const config = emptyStateConfig[variant];
	const Icon = config.icon;
	const finalActionLabel = actionLabel || config.defaultActionLabel;

	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-4 px-6 py-12 text-center",
				className
			)}
		>
			{/* Icon */}
			<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
				<Icon className="h-8 w-8 text-muted-foreground" />
			</div>

			{/* Title */}
			<div className="space-y-2">
				<h3 className="text-lg font-semibold">{config.title}</h3>
				<p className="text-sm text-muted-foreground max-w-sm">
					{config.description}
				</p>
			</div>

			{/* Action button (if provided) */}
			{onAction && (
				<Button className="mt-2" onClick={onAction}>
					{finalActionLabel}
				</Button>
			)}
		</div>
	);
}

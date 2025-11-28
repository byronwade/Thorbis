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
				"flex flex-col items-center justify-center gap-5 px-6 py-12 text-center",
				className,
			)}
		>
			{/* Icon illustration */}
			<div className="relative">
				{/* Decorative ring */}
				<div className="absolute inset-0 -m-2 rounded-full border border-dashed border-primary/10" />

				{/* Main icon container */}
				<div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-muted via-muted to-muted/80 shadow-sm ring-1 ring-border/50">
					<Icon className="h-7 w-7 text-muted-foreground/80" />

					{/* Decorative accent */}
					<div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border/50">
						<div className="h-2 w-2 rounded-full bg-primary/40" />
					</div>
				</div>
			</div>

			{/* Title and description */}
			<div className="space-y-1.5">
				<h3 className="text-base font-semibold text-foreground/90">{config.title}</h3>
				<p className="text-sm text-muted-foreground/80 max-w-[280px] leading-relaxed">
					{config.description}
				</p>
			</div>

			{/* Action button (if provided) */}
			{onAction && (
				<Button
					className="mt-1 shadow-sm"
					onClick={onAction}
					size="sm"
				>
					{finalActionLabel}
				</Button>
			)}
		</div>
	);
}

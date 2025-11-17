/**
 * Job Process Indicator - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static status visualization rendered on server
 * - CSS animations (animate-pulse, animate-ping) work without JavaScript
 * - Reduced JavaScript bundle size
 */

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type JobStatus = "quoted" | "scheduled" | "in_progress" | "completed" | "cancelled";

type JobProcessIndicatorProps = {
	currentStatus: JobStatus;
	className?: string;
	dates?: {
		quoted?: Date | null;
		scheduled?: Date | null;
		inProgress?: Date | null;
		completed?: Date | null;
	};
};

const statusSteps = [
	{ key: "quoted", label: "Quoted", dateKey: "quoted" as const },
	{ key: "scheduled", label: "Scheduled", dateKey: "scheduled" as const },
	{ key: "in_progress", label: "In Progress", dateKey: "inProgress" as const },
	{ key: "completed", label: "Completed", dateKey: "completed" as const },
] as const;

function formatStepDate(date: Date | null | undefined): string {
	if (!date) {
		return "";
	}
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

function formatStepTime(date: Date | null | undefined): string {
	if (!date) {
		return "";
	}
	return new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	}).format(date);
}

function getStatusIndex(status: JobStatus): number {
	if (status === "cancelled") {
		return -1;
	}
	return statusSteps.findIndex((step) => step.key === status);
}

export function JobProcessIndicator({ currentStatus, className, dates }: JobProcessIndicatorProps) {
	const currentIndex = getStatusIndex(currentStatus);
	const isCancelled = currentStatus === "cancelled";

	if (isCancelled) {
		return (
			<div className={cn("border-destructive bg-destructive/10 rounded-lg border p-4", className)}>
				<div className="flex items-center justify-center gap-2">
					<div className="bg-destructive/20 flex size-8 items-center justify-center rounded-full">
						<div className="bg-destructive size-2 rounded-full" />
					</div>
					<span className="text-destructive font-medium">Job Cancelled</span>
				</div>
			</div>
		);
	}

	return (
		<div className={cn("flex items-center gap-1", className)}>
			{statusSteps.map((step, index) => {
				const isCompleted = index < currentIndex;
				const isCurrent = index === currentIndex;
				const _isUpcoming = index > currentIndex;

				return (
					<div className="flex flex-1 items-center gap-1" key={step.key}>
						{/* Step */}
						<div className="flex flex-1 flex-col items-center gap-1">
							{/* Step Circle */}
							<div
								className={cn(
									"relative z-10 flex size-8 items-center justify-center rounded-full border transition-all",
									isCompleted || isCurrent ? "border-primary" : "border-muted"
								)}
							>
								{isCompleted ? (
									<div className="bg-primary flex size-full items-center justify-center rounded-full">
										<Check className="text-primary-foreground size-4" strokeWidth={2.5} />
									</div>
								) : isCurrent ? (
									<div className="bg-primary relative flex size-full items-center justify-center rounded-full">
										<div className="bg-primary-foreground size-2 animate-pulse rounded-full" />
									</div>
								) : (
									<div className="bg-muted size-2 rounded-full" />
								)}
							</div>

							{/* Step Label and Date */}
							<div className="text-center">
								<p
									className={cn(
										"text-xs font-medium",
										isCurrent
											? "text-foreground"
											: isCompleted
												? "text-muted-foreground"
												: "text-muted-foreground/60"
									)}
								>
									{step.label}
								</p>
								{dates?.[step.dateKey] && (
									<p
										className={cn(
											"text-[10px]",
											isCurrent ? "text-muted-foreground" : "text-muted-foreground/60"
										)}
									>
										{formatStepDate(dates[step.dateKey])}
									</p>
								)}
								{dates?.[step.dateKey] && (
									<p className="text-muted-foreground/50 text-[10px]">
										{formatStepTime(dates[step.dateKey])}
									</p>
								)}
							</div>
						</div>

						{/* Connecting Line */}
						{index < statusSteps.length - 1 && (
							<div
								className={cn(
									"h-[1px] flex-1 transition-all",
									isCompleted ? "bg-primary" : "bg-muted"
								)}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}

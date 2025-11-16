"use client";

/**
 * Empty State Components for Schedule Views
 */

import { AlertCircle, Calendar, CalendarX, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
	title: string;
	description: string;
	icon?: React.ReactNode;
	action?: {
		label: string;
		onClick: () => void;
	};
};

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center p-8">
			<div className="mb-4 text-muted-foreground">{icon || <Calendar className="size-12" />}</div>
			<h3 className="mb-2 font-semibold text-lg">{title}</h3>
			<p className="mb-6 max-w-md text-center text-muted-foreground text-sm">{description}</p>
			{action && (
				<Button onClick={action.onClick} size="sm" variant="default">
					{action.label}
				</Button>
			)}
		</div>
	);
}

export function NoTechniciansEmptyState({ onAddTechnician }: { onAddTechnician?: () => void }) {
	return (
		<EmptyState
			action={
				onAddTechnician
					? {
							label: "Add Technician",
							onClick: onAddTechnician,
						}
					: undefined
			}
			description="Add technicians to your team to start scheduling jobs."
			icon={<Users className="size-12" />}
			title="No Technicians"
		/>
	);
}

export function NoJobsEmptyState({ date, onNewJob }: { date: Date; onNewJob?: () => void }) {
	const formattedDate = date.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<EmptyState
			action={
				onNewJob
					? {
							label: "New Job",
							onClick: onNewJob,
						}
					: undefined
			}
			description={`No jobs are scheduled for ${formattedDate}. Create a new job to get started.`}
			icon={<CalendarX className="size-12" />}
			title="No Jobs Scheduled"
		/>
	);
}

export function ErrorState({ error, onRetry }: { error: string; onRetry?: () => void }) {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center p-8">
			<div className="mb-4 text-destructive">
				<AlertCircle className="size-12" />
			</div>
			<h3 className="mb-2 font-semibold text-destructive text-lg">Something went wrong</h3>
			<p className="mb-6 max-w-md text-center text-muted-foreground text-sm">{error}</p>
			{onRetry && (
				<Button onClick={onRetry} size="sm" variant="outline">
					Try Again
				</Button>
			)}
		</div>
	);
}

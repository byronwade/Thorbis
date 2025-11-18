/**
 * Activity Log Widget - Server Component
 *
 * Complete timeline of all job activities, changes, and events.
 * Provides audit trail and transparency for job history.
 *
 * Performance optimizations:
 * - Server Component by default
 * - Static rendering for better performance
 * - Efficient date formatting
 */

import {
	Calendar,
	CheckCircle2,
	Clock,
	DollarSign,
	FileText,
	MessageSquare,
	User,
	Wrench,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Job } from "@/lib/db/schema";

type ActivityLogWidgetProps = {
	job: Job;
	activities?: unknown[];
};

// Activity types and their icons/colors
const activityConfig = {
	status_change: {
		icon: CheckCircle2,
		color: "text-primary",
		bgColor: "bg-primary dark:bg-primary",
	},
	payment: {
		icon: DollarSign,
		color: "text-success",
		bgColor: "bg-success dark:bg-success",
	},
	schedule: {
		icon: Calendar,
		color: "text-accent-foreground",
		bgColor: "bg-accent dark:bg-accent",
	},
	communication: {
		icon: MessageSquare,
		color: "text-warning",
		bgColor: "bg-warning dark:bg-warning",
	},
	document: {
		icon: FileText,
		color: "text-muted-foreground",
		bgColor: "bg-muted dark:bg-foreground",
	},
	work: {
		icon: Wrench,
		color: "text-accent-foreground",
		bgColor: "bg-accent dark:bg-accent",
	},
	assignment: {
		icon: User,
		color: "text-teal-600",
		bgColor: "bg-teal-100 dark:bg-teal-950",
	},
} as const;

type ActivityType = keyof typeof activityConfig;

type Activity = {
	id: string;
	type: ActivityType;
	title: string;
	description?: string;
	user: string;
	timestamp: Date;
	metadata?: Record<string, unknown>;
};

export function ActivityLogWidget({
	job,
	activities: activitiesData = [],
}: ActivityLogWidgetProps) {
	// Transform activities from database
	const activities: Activity[] = (activitiesData as any[]).map((activity) => {
		const user = activity.user
			? Array.isArray(activity.user)
				? activity.user[0]
				: activity.user
			: null;

		const userName = user
			? `${user.first_name || ""} ${user.last_name || ""}`.trim()
			: "System";

		// Map activity_type from database to our widget types
		let type: ActivityType = "work";
		if (activity.activity_type?.includes("status")) {
			type = "status_change";
		} else if (activity.activity_type?.includes("payment")) {
			type = "payment";
		} else if (activity.activity_type?.includes("schedule")) {
			type = "schedule";
		} else if (activity.activity_type?.includes("communication")) {
			type = "communication";
		} else if (activity.activity_type?.includes("document")) {
			type = "document";
		} else if (activity.activity_type?.includes("assign")) {
			type = "assignment";
		}

		return {
			id: activity.id,
			type,
			title: activity.title || activity.activity_type || "Activity",
			description: activity.description || activity.details,
			user: userName,
			timestamp: new Date(activity.created_at),
			metadata: activity.metadata,
		};
	});

	function formatTimestamp(date: Date): string {
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffMins < 1) {
			return "Just now";
		}
		if (diffMins < 60) {
			return `${diffMins}m ago`;
		}
		if (diffHours < 24) {
			return `${diffHours}h ago`;
		}
		if (diffDays < 7) {
			return `${diffDays}d ago`;
		}

		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
		}).format(date);
	}

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h4 className="text-sm font-semibold">Recent Activity</h4>
				<Badge className="text-xs" variant="secondary">
					{activities.length} events
				</Badge>
			</div>

			{/* Activity Timeline */}
			<div className="relative space-y-4">
				{/* Timeline line */}
				<div className="bg-border absolute top-0 bottom-0 left-4 w-px" />

				{activities.map((activity, index) => {
					const config = activityConfig[activity.type];
					const Icon = config.icon;
					const isLast = index === activities.length - 1;

					return (
						<div className="relative flex gap-3" key={activity.id}>
							{/* Icon */}
							<div
								className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}
							>
								<Icon className={`size-4 ${config.color}`} />
							</div>

							{/* Content */}
							<div className={`flex-1 pb-4 ${isLast ? "" : "border-b"}`}>
								<div className="space-y-1">
									<div className="flex items-start justify-between gap-2">
										<h5 className="text-sm leading-tight font-medium">
											{activity.title}
										</h5>
										<span className="text-muted-foreground shrink-0 text-xs">
											{formatTimestamp(activity.timestamp)}
										</span>
									</div>

									{activity.description && (
										<p className="text-muted-foreground text-xs leading-relaxed">
											{activity.description}
										</p>
									)}

									<div className="text-muted-foreground flex items-center gap-1.5 text-xs">
										<User className="size-3" />
										<span>{activity.user}</span>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* View All Link */}
			{activities.length > 5 && (
				<>
					<Separator />
					<div>
						<Button asChild className="w-full" size="sm" variant="outline">
							<Link href={`/dashboard/work/${job.id}/activity`}>
								<Clock className="mr-2 size-4" />
								View Complete History
							</Link>
						</Button>
					</div>
				</>
			)}
		</div>
	);
}

"use client";

import { format } from "date-fns";
import { Clock, MapPin, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/lib/stores/schedule-store";
import { cn } from "@/lib/utils";

/**
 * JobCardMobile - Mobile-optimized job card component
 *
 * Design specifications:
 * - Height: 80px (comfortable touch target, 44px+ recommended)
 * - Full-width layout with clear visual hierarchy
 * - Large touch targets for tap interactions
 * - Displays: customer, time, location, technician, status
 * - Optimized for vertical list scrolling
 *
 * Usage:
 * - List view: Primary job card in vertical scrolling list
 * - Day view: Job card in technician timeline slots
 * - Week view: Job card in kanban columns
 *
 * Interactions:
 * - Tap card: Opens bottom sheet with job details and actions
 * - Long-press: Enters selection mode (future)
 * - Swipe: Quick actions like dispatch/unassign (future)
 */

type JobStatus =
	| "unscheduled"
	| "scheduled"
	| "dispatched"
	| "arrived"
	| "in_progress"
	| "closed"
	| "completed"
	| "cancelled";

type JobCardMobileProps = {
	job: Job;
	onClick?: () => void;
	className?: string;
	showTechnician?: boolean; // Hide technician info in day view (already grouped by tech)
	showDate?: boolean; // Show date in list/week views, hide in day view (already grouped by date)
};

// Status badge styles (consistent with desktop)
const statusStyles: Record<
	JobStatus,
	{ bg: string; text: string; label: string }
> = {
	unscheduled: {
		bg: "bg-gray-100 dark:bg-gray-800",
		text: "text-gray-700 dark:text-gray-300",
		label: "Unscheduled",
	},
	scheduled: {
		bg: "bg-blue-100 dark:bg-blue-900/30",
		text: "text-blue-700 dark:text-blue-300",
		label: "Scheduled",
	},
	dispatched: {
		bg: "bg-yellow-100 dark:bg-yellow-900/30",
		text: "text-yellow-700 dark:text-yellow-300",
		label: "Dispatched",
	},
	arrived: {
		bg: "bg-purple-100 dark:bg-purple-900/30",
		text: "text-purple-700 dark:text-purple-300",
		label: "Arrived",
	},
	in_progress: {
		bg: "bg-orange-100 dark:bg-orange-900/30",
		text: "text-orange-700 dark:text-orange-300",
		label: "In Progress",
	},
	closed: {
		bg: "bg-green-100 dark:bg-green-900/30",
		text: "text-green-700 dark:text-green-300",
		label: "Closed",
	},
	completed: {
		bg: "bg-emerald-100 dark:bg-emerald-900/30",
		text: "text-emerald-700 dark:text-emerald-300",
		label: "Completed",
	},
	cancelled: {
		bg: "bg-red-100 dark:bg-red-900/30",
		text: "text-red-700 dark:text-red-300",
		label: "Cancelled",
	},
};

export function JobCardMobile({
	job,
	onClick,
	className,
	showTechnician = true,
	showDate = true,
}: JobCardMobileProps) {
	const status = (job.status?.toLowerCase().replace(/ /g, "_") ||
		"unscheduled") as JobStatus;
	const statusStyle = statusStyles[status] || statusStyles.unscheduled;

	// Format time (9:00 AM - 10:30 AM)
	const startTime = job.startTime
		? format(new Date(job.startTime), "h:mm a")
		: "Not scheduled";
	const endTime = job.endTime ? format(new Date(job.endTime), "h:mm a") : "";
	const timeRange = endTime ? `${startTime} - ${endTime}` : startTime;

	// Format date (Jan 15)
	const dateDisplay = job.startTime
		? format(new Date(job.startTime), "MMM d")
		: "";

	// Get primary technician from assignments
	const primaryAssignment = job.assignments.find((a) => a.role === "primary");
	const techInitials = primaryAssignment?.displayName
		? primaryAssignment.displayName
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: "?";

	// Customer/property info
	const customerName = job.customer?.name || "No Customer";
	const locationDisplay = job.location?.address?.street || "No location";

	return (
		<button
			className={cn(
				// Base styles - more compact, full width
				"group relative flex w-full items-center gap-3 rounded-lg border bg-card p-3 text-left transition-all",
				// Reduced height for compact design
				"min-h-[64px]",
				// Hover/active states
				"hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm",
				"active:scale-[0.99]",
				// Focus states for accessibility
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				className,
			)}
			onClick={onClick}
			type="button"
		>
			{/* Left: Time */}
			<div className="flex flex-col items-center justify-center shrink-0 w-16 text-center">
				<span className="text-sm font-semibold leading-tight">
					{startTime === "Not scheduled"
						? "--:--"
						: format(new Date(job.startTime), "h:mm")}
				</span>
				<span className="text-[0.65rem] text-muted-foreground uppercase">
					{startTime === "Not scheduled"
						? ""
						: format(new Date(job.startTime), "a")}
				</span>
			</div>

			{/* Center: Job info */}
			<div className="flex-1 min-w-0 space-y-0.5">
				{/* Customer name */}
				<h3 className="text-sm font-semibold leading-tight truncate">
					{customerName}
				</h3>
				{/* Job title */}
				<p className="text-xs text-muted-foreground truncate">
					{job.title || "Untitled Job"}
				</p>
				{/* Location - only on mobile, very compact */}
				{locationDisplay !== "No location" && (
					<div className="flex items-center gap-1 text-[0.65rem] text-muted-foreground">
						<MapPin className="h-2.5 w-2.5" />
						<span className="truncate">{locationDisplay}</span>
					</div>
				)}
			</div>

			{/* Right: Status badge + Technician */}
			<div className="flex flex-col items-end gap-1.5 shrink-0">
				{/* Status badge - smaller */}
				<Badge
					className={cn(
						"text-[0.65rem] font-medium h-4 px-1.5",
						statusStyle.bg,
						statusStyle.text,
					)}
					variant="secondary"
				>
					{statusStyle.label}
				</Badge>

				{/* Technician avatar - only if showing */}
				{showTechnician && (
					<div className="flex items-center gap-1">
						<Avatar className="h-4 w-4">
							<AvatarImage
								alt={primaryAssignment?.displayName || "Unassigned"}
								src={primaryAssignment?.avatar || undefined}
							/>
							<AvatarFallback className="text-[0.5rem] font-medium">
								{techInitials}
							</AvatarFallback>
						</Avatar>
						<span className="text-[0.65rem] text-muted-foreground max-w-[60px] truncate">
							{primaryAssignment?.displayName || "Unassigned"}
						</span>
					</div>
				)}
			</div>
		</button>
	);
}

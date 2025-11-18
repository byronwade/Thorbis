"use client";

/**
 * Activity Timeline Component - Client Component
 *
 * Displays a comprehensive timeline of all activities for a job, customer, invoice, etc.
 * Features:
 * - Grouped by date
 * - Icon-based activity types
 * - Attachment previews
 * - Filtering by category
 * - Real-time updates
 */

import {
	AlignJustify,
	Bot,
	Calendar,
	CheckCircle2,
	FileText,
	Image as ImageIcon,
	Mail,
	MessageSquare,
	Settings,
	Sparkles,
	UserPlus,
	Zap,
} from "lucide-react";
import { useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	type TimelineDensity,
	useActivityTimelineStore,
} from "@/lib/stores/activity-timeline-store";
import { cn } from "@/lib/utils";
import {
	formatActivityTimestamp,
	groupActivitiesByDate,
} from "@/lib/utils/activity-tracker";
import type { Activity, ActivityCategory } from "@/types/activity";

type ActivityTimelineProps = {
	activities: Activity[];
	isLoading?: boolean;
};

export function ActivityTimeline({
	activities,
	isLoading = false,
}: ActivityTimelineProps) {
	const [filterCategory, setFilterCategory] = useState<
		ActivityCategory | "all"
	>("all");

	// Get density settings from store
	const density = useActivityTimelineStore((state) => state.density);
	const applyDensity = useActivityTimelineStore((state) => state.applyDensity);
	const _itemSpacing = useActivityTimelineStore((state) => state.itemSpacing);
	const _showIcons = useActivityTimelineStore((state) => state.showIcons);
	const _showAvatars = useActivityTimelineStore((state) => state.showAvatars);
	const showAttachmentPreviews = useActivityTimelineStore(
		(state) => state.showAttachmentPreviews,
	);
	const showMetadata = useActivityTimelineStore((state) => state.showMetadata);
	const _iconSize = useActivityTimelineStore((state) => state.iconSize);
	const textSize = useActivityTimelineStore((state) => state.textSize);

	const handleDensityChange = (newDensity: TimelineDensity) => {
		applyDensity(newDensity);
	};

	// Filter activities
	const filteredActivities =
		filterCategory === "all"
			? activities
			: activities.filter((activity) => activity.category === filterCategory);

	// Group by date
	const groupedActivities = groupActivitiesByDate(filteredActivities);

	// Sort dates in descending order
	const sortedDates = Array.from(groupedActivities.keys()).sort((a, b) => {
		const dateA = new Date(a);
		const dateB = new Date(b);
		return dateB.getTime() - dateA.getTime();
	});

	if (isLoading) {
		return (
			<div className="flex h-96 items-center justify-center">
				<div className="flex flex-col items-center gap-2">
					<div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
					<p className="text-muted-foreground text-sm">Loading activities...</p>
				</div>
			</div>
		);
	}

	if (activities.length === 0) {
		return (
			<div className="flex h-96 items-center justify-center">
				<div className="text-center">
					<MessageSquare className="text-muted-foreground mx-auto size-12" />
					<h3 className="mt-4 text-lg font-semibold">No activities yet</h3>
					<p className="text-muted-foreground mt-2 text-sm">
						Activities will appear here as changes are made
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{/* Filter Controls */}
			<div className="flex shrink-0 items-center justify-between gap-2 border-b p-4">
				<div className="flex flex-1 items-center gap-2">
					<Select
						onValueChange={(value) =>
							setFilterCategory(value as ActivityCategory | "all")
						}
						value={filterCategory}
					>
						<SelectTrigger className="h-8 w-[140px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Activities</SelectItem>
							<SelectItem value="user">User Actions</SelectItem>
							<SelectItem value="system">System Events</SelectItem>
							<SelectItem value="ai">AI Insights</SelectItem>
							<SelectItem value="automation">Automation</SelectItem>
						</SelectContent>
					</Select>

					{/* Density Control */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="sm" variant="ghost">
								<AlignJustify className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>View Density</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => handleDensityChange("text-only")}
							>
								<span
									className={cn(
										density === "text-only" && "text-primary font-semibold",
									)}
								>
									Text Only
								</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleDensityChange("small")}>
								<span
									className={cn(
										density === "small" && "text-primary font-semibold",
									)}
								>
									Small
								</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleDensityChange("medium")}>
								<span
									className={cn(
										density === "medium" && "text-primary font-semibold",
									)}
								>
									Medium
								</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleDensityChange("large")}>
								<span
									className={cn(
										density === "large" && "text-primary font-semibold",
									)}
								>
									Large
								</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<Badge variant="secondary">{filteredActivities.length}</Badge>
			</div>

			{/* Timeline */}
			<ScrollArea className="flex-1 overflow-auto p-4">
				<div className="relative mx-auto max-w-4xl">
					{/* Timeline items container with vertical line */}
					{sortedDates.length > 0 && (
						<div className="relative">
							{/* Vertical line - only extends through date groups */}
							<Separator
								className="bg-muted absolute top-4 bottom-0 left-2 w-px"
								orientation="vertical"
							/>

							{/* Timeline items */}
							{sortedDates.map((dateKey) => {
								const dateActivities = groupedActivities.get(dateKey)!;

								return (
									<div className="relative mb-10 pl-8" key={dateKey}>
										{/* Circle indicator */}
										<div className="bg-foreground absolute top-2 left-0 flex size-5 items-center justify-center rounded-full">
											<div className="bg-background size-3 rounded-full" />
										</div>

										{/* Date badge */}
										<Badge
											className="mb-3 rounded-xl px-3 py-2 text-sm"
											variant="secondary"
										>
											{dateKey}
										</Badge>

										{/* Activities list */}
										<ul className="flex flex-col gap-2">
											{dateActivities.map((activity) => (
												<ActivityTimelineItem
													activity={activity}
													key={activity.id}
													showAttachmentPreviews={showAttachmentPreviews}
													showMetadata={showMetadata}
													textSize={textSize}
												/>
											))}
										</ul>
									</div>
								);
							})}
						</div>
					)}

					{/* End of timeline indicator */}
					{sortedDates.length > 0 && (
						<div className="from-background via-muted/50 to-muted relative mt-12 rounded-xl bg-gradient-to-b py-16 text-center">
							{/* End message */}
							<div className="flex flex-col items-center gap-4">
								<div className="bg-muted/40 flex size-14 items-center justify-center rounded-full">
									<Sparkles className="text-muted-foreground/70 size-7" />
								</div>
								<div>
									<p className="text-foreground text-lg font-semibold">
										Start of Timeline
									</p>
									<p className="text-muted-foreground mt-2 text-sm">
										You've reached the beginning of this activity history
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
}

/**
 * Individual activity timeline item
 */
function ActivityTimelineItem({
	activity,
	showAttachmentPreviews,
	showMetadata,
	textSize = "text-sm",
}: {
	activity: Activity;
	showAttachmentPreviews: boolean;
	showMetadata: boolean;
	textSize?: string;
}) {
	return (
		<li className="flex gap-3">
			{/* Small bullet dot */}
			<span className="bg-foreground mt-1.5 h-2 w-2 flex-none rounded-full" />

			{/* Content */}
			<div className="flex-1 space-y-2">
				<div className="flex flex-wrap items-center gap-2">
					<span className={cn("text-foreground leading-relaxed", textSize)}>
						{activity.action}
					</span>

					{/* Actor metadata inline */}
					{showMetadata && activity.actorName && (
						<span
							className={cn(
								"text-muted-foreground",
								textSize === "text-lg" ? "text-base" : "text-sm",
							)}
						>
							by {activity.actorName}
						</span>
					)}

					{/* Timestamp inline */}
					<span
						className={cn(
							"text-muted-foreground",
							textSize === "text-lg" ? "text-base" : "text-sm",
						)}
					>
						{formatActivityTimestamp(activity.occurredAt)}
					</span>

					{/* AI Model badge inline */}
					{showMetadata && activity.aiModel && (
						<Badge variant="outline">{activity.aiModel}</Badge>
					)}

					{/* Important badge inline */}
					{showMetadata && activity.isImportant && (
						<Badge variant="default">
							<Sparkles className="mr-1 size-3" />
							Important
						</Badge>
					)}
				</div>

				{/* Description on new line if present */}
				{showMetadata && activity.description && (
					<p
						className={cn(
							"text-muted-foreground mt-1",
							textSize === "text-lg" ? "text-base" : "text-sm",
						)}
					>
						{activity.description}
					</p>
				)}

				{/* Field change details */}
				{showMetadata &&
					activity.fieldName &&
					(activity.oldValue || activity.newValue) && (
						<div
							className={cn(
								"bg-muted/50 mt-2 rounded-lg border p-2",
								textSize === "text-lg" ? "text-base" : "text-sm",
							)}
						>
							<div className="flex items-center gap-2">
								{activity.oldValue && (
									<div className="flex-1">
										<span className="text-muted-foreground">From: </span>
										<span className="font-medium line-through">
											{activity.oldValue}
										</span>
									</div>
								)}
								{activity.newValue && (
									<div className="flex-1">
										<span className="text-muted-foreground">To: </span>
										<span className="text-primary font-medium">
											{activity.newValue}
										</span>
									</div>
								)}
							</div>
						</div>
					)}

				{/* Attachments */}
				{showAttachmentPreviews &&
					activity.attachmentUrl &&
					activity.attachmentType === "photo" && (
						<div className="mt-2">
							<a
								className="block overflow-hidden rounded-lg border"
								href={activity.attachmentUrl}
								rel="noopener noreferrer"
								target="_blank"
							>
								<img
									alt={activity.attachmentName || "Attachment"}
									className="h-48 w-full object-cover"
									src={activity.attachmentUrl}
								/>
							</a>
							{activity.attachmentName && (
								<p
									className={cn(
										"text-muted-foreground mt-1",
										textSize === "text-lg" ? "text-base" : "text-sm",
									)}
								>
									{activity.attachmentName}
								</p>
							)}
						</div>
					)}

				{showAttachmentPreviews &&
					activity.attachmentUrl &&
					activity.attachmentType === "document" && (
						<div className="mt-2">
							<a
								className={cn(
									"hover:bg-muted flex items-center gap-2 rounded-lg border p-3 transition-colors",
									textSize === "text-lg" ? "text-base" : "text-sm",
								)}
								href={activity.attachmentUrl}
								rel="noopener noreferrer"
								target="_blank"
							>
								<FileText className="text-muted-foreground size-4" />
								<span>{activity.attachmentName || "Document"}</span>
							</a>
						</div>
					)}
			</div>
		</li>
	);
}

/**
 * Get the icon component for an activity type
 */
function _getActivityIconComponent(activityType: Activity["activityType"]) {
	const iconMap = {
		created: Sparkles,
		deleted: Zap,
		status_change: CheckCircle2,
		field_update: Settings,
		note_added: MessageSquare,
		photo_added: ImageIcon,
		document_added: FileText,
		ai_insight: Bot,
		automation: Zap,
		assignment_change: UserPlus,
		communication: Mail,
		payment: CheckCircle2,
		scheduled: Calendar,
		completed: CheckCircle2,
		cancelled: Zap,
	};

	return iconMap[activityType] || Settings;
}

/**
 * Get the color class for an activity category
 */
function _getActivityIconColorClass(category: ActivityCategory): string {
	const colorMap = {
		system: "text-primary",
		user: "text-success",
		ai: "text-accent-foreground",
		automation: "text-warning",
	};

	return colorMap[category] || "text-muted-foreground";
}

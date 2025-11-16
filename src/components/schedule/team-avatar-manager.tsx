"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { JobAssignment } from "./schedule-types";

export function TeamAvatar({
	assignment,
	onRemove,
	size = "sm",
}: {
	assignment: JobAssignment;
	onRemove?: () => void;
	size?: "sm" | "md";
}) {
	const [isHovered, setIsHovered] = useState(false);

	const sizeClasses = size === "md" ? "size-8" : "size-6";
	const textSize = size === "md" ? "text-[10px]" : "text-[8px]";

	return (
		<div
			className="relative"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Avatar
				className={cn(
					sizeClasses,
					"border-2 border-card transition-all",
					isHovered && "ring-2 ring-primary",
				)}
				title={assignment.displayName}
			>
				{assignment.avatar && (
					<img
						alt={assignment.displayName}
						className="size-full object-cover"
						src={assignment.avatar}
					/>
				)}
				<AvatarFallback
					className={cn("bg-muted font-bold text-foreground", textSize)}
				>
					{assignment.displayName
						.split(" ")
						.map((n) => n[0])
						.join("")
						.toUpperCase()}
				</AvatarFallback>
			</Avatar>

			{/* Remove button on hover */}
			{isHovered && onRemove && (
				<button
					className="-right-1 -top-1 absolute flex size-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md transition-transform hover:scale-110"
					onClick={(e) => {
						e.stopPropagation();
						onRemove();
					}}
					title="Remove from job"
				>
					<X className="size-3" />
				</button>
			)}
		</div>
	);
}

export function TeamAvatarGroup({
	assignments,
	maxVisible = 3,
	onRemove,
	onAddMember,
	size = "sm",
	jobId,
}: {
	assignments: JobAssignment[];
	maxVisible?: number;
	onRemove?: (technicianId: string) => void;
	onAddMember?: () => void;
	size?: "sm" | "md";
	jobId?: string;
}) {
	const [showAll, setShowAll] = useState(false);
	const visibleAssignments = showAll
		? assignments
		: assignments.slice(0, maxVisible);
	const remainingCount = assignments.length - maxVisible;

	return (
		<div className="flex shrink-0 items-center gap-1" data-job-id={jobId}>
			<div className="-space-x-1.5 flex">
				{visibleAssignments.map((assignment, idx) => (
					<TeamAvatar
						assignment={assignment}
						key={idx}
						onRemove={
							onRemove
								? () => onRemove(assignment.technicianId || "")
								: undefined
						}
						size={size}
					/>
				))}

				{!showAll && remainingCount > 0 && (
					<button
						className="flex size-6 items-center justify-center rounded-full border-2 border-card bg-muted font-bold text-[8px] text-muted-foreground transition-all hover:bg-muted/80 hover:ring-2 hover:ring-primary"
						onClick={(e) => {
							e.stopPropagation();
							setShowAll(true);
						}}
						title={`Show ${remainingCount} more`}
					>
						+{remainingCount}
					</button>
				)}
			</div>

			{/* Add member button */}
			{onAddMember && (
				<button
					className="flex size-6 items-center justify-center rounded-full border-2 border-muted-foreground/30 border-dashed bg-muted/50 text-muted-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
					onClick={(e) => {
						e.stopPropagation();
						onAddMember();
					}}
					title="Add team member"
				>
					<span
						className="relative flex items-center justify-center font-bold text-base leading-none"
						style={{ top: "-1px" }}
					>
						+
					</span>
				</button>
			)}
		</div>
	);
}

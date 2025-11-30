"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { JobAssignment } from "./schedule-types";

function TeamAvatar({
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
					"border-card border-2 transition-all",
					isHovered && "ring-primary ring-2",
				)}
				title={assignment.displayName}
			>
				{assignment.avatar && (
					<Image
						alt={assignment.displayName}
						className="size-full object-cover"
						fill
						src={assignment.avatar}
						unoptimized
					/>
				)}
				<AvatarFallback
					className={cn("bg-muted text-foreground font-bold", textSize)}
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
					className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full shadow-md transition-transform hover:scale-110"
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
			<div className="flex -space-x-1.5">
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
						className="border-card bg-muted text-muted-foreground hover:bg-muted/80 hover:ring-primary flex size-6 items-center justify-center rounded-full border-2 text-[8px] font-bold transition-all hover:ring-2"
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
					className="border-muted-foreground/30 bg-muted/50 text-muted-foreground hover:border-primary hover:bg-primary/10 hover:text-primary flex size-6 items-center justify-center rounded-full border-2 border-dashed transition-all"
					onClick={(e) => {
						e.stopPropagation();
						onAddMember();
					}}
					title="Add team member"
				>
					<span
						className="relative flex items-center justify-center text-base leading-none font-bold"
						style={{ top: "-1px" }}
					>
						+
					</span>
				</button>
			)}
		</div>
	);
}

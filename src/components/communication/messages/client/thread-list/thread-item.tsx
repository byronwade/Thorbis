"use client";

/**
 * Thread Item - Slack-inspired thread card
 *
 * Clean, minimal design with:
 * - Avatar with customer initials
 * - Name and phone number
 * - Last message preview
 * - Unread badge
 * - Assignment indicator
 * - Status/priority badges
 */

import { formatDistanceToNow } from "date-fns";
import { AlertCircle, CheckCircle2, Clock, UserCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { SmsThread } from "@/lib/stores/messages-store";
import { cn } from "@/lib/utils";

interface ThreadItemProps {
	thread: SmsThread;
	isSelected: boolean;
	onClick: () => void;
	currentUserId?: string | null;
}

export function ThreadItem({
	thread,
	isSelected,
	onClick,
	currentUserId,
}: ThreadItemProps) {
	const isAssignedToMe = currentUserId && thread.assignedTo === currentUserId;
	const isUnassigned = thread.assignedTo === null;

	// Get initials from name or phone
	const getInitials = (name: string | null, phone: string) => {
		if (name && name.trim()) {
			const parts = name
				.split(" ")
				.filter((n) => n.length > 0)
				.map((n) => n[0])
				.join("")
				.toUpperCase();
			return parts.slice(0, 2) || "??";
		}
		// Use last 2 digits of phone
		return phone && phone.length >= 2 ? phone.slice(-2) : "??";
	};

	const initials = getInitials(thread.remoteName, thread.remotePhoneNumber);

	// Status icon
	const StatusIcon = () => {
		switch (thread.status) {
			case "resolved":
				return <CheckCircle2 className="h-3 w-3 text-green-600" />;
			case "snoozed":
				return <Clock className="h-3 w-3 text-orange-600" />;
			case "pending":
				return <AlertCircle className="h-3 w-3 text-yellow-600" />;
			default:
				return null;
		}
	};

	return (
		<button
			onClick={onClick}
			className={cn(
				"w-full px-3 py-2.5 text-left transition-colors hover:bg-accent/50",
				"border-l-2 border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				isSelected && "bg-accent border-l-primary",
				thread.unreadCount > 0 && !isSelected && "bg-accent/30",
			)}
			aria-label={`Conversation with ${thread.remoteName || thread.remotePhoneNumber}`}
			aria-current={isSelected ? "true" : undefined}
		>
			<div className="flex items-start gap-3">
				{/* Avatar */}
				<div className="relative flex-shrink-0">
					<Avatar className="h-10 w-10">
						<AvatarImage
							src={undefined}
							alt={thread.remoteName || thread.remotePhoneNumber}
						/>
						<AvatarFallback className="bg-primary/10 text-primary font-medium">
							{initials}
						</AvatarFallback>
					</Avatar>
					{/* Unread indicator */}
					{thread.unreadCount > 0 && (
						<div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
							<span className="text-[10px] font-bold text-primary-foreground">
								{thread.unreadCount > 9 ? "9+" : thread.unreadCount}
							</span>
						</div>
					)}
				</div>

				{/* Content */}
				<div className="flex-1 min-w-0">
					{/* Header row */}
					<div className="flex items-center justify-between gap-2 mb-0.5">
						<div className="flex items-center gap-1.5 min-w-0">
							<span
								className={cn(
									"font-medium text-sm truncate",
									thread.unreadCount > 0 && "font-semibold",
								)}
							>
								{thread.remoteName || thread.remotePhoneNumber}
							</span>

							{/* Assignment indicator */}
							{isAssignedToMe && (
								<UserCheck
									className="h-3.5 w-3.5 text-primary flex-shrink-0"
									aria-label="Assigned to you"
								/>
							)}

							{/* Status icon */}
							<StatusIcon />
						</div>

						{/* Timestamp */}
						<span className="text-xs text-muted-foreground flex-shrink-0">
							{(() => {
								try {
									const date =
										thread.lastMessageAt instanceof Date
											? thread.lastMessageAt
											: new Date(thread.lastMessageAt);
									if (isNaN(date.getTime())) {
										return "Unknown";
									}
									return formatDistanceToNow(date, { addSuffix: false });
								} catch {
									return "Unknown";
								}
							})()}
						</span>
					</div>

					{/* Phone number (if name exists) */}
					{thread.remoteName && (
						<div className="text-xs text-muted-foreground mb-1">
							{thread.remotePhoneNumber}
						</div>
					)}

					{/* Last message preview */}
					<p
						className={cn(
							"text-sm text-muted-foreground line-clamp-1",
							thread.unreadCount > 0 && "text-foreground font-medium",
						)}
					>
						{thread.direction === "outbound" && (
							<span className="text-muted-foreground">You: </span>
						)}
						{thread.lastMessage}
					</p>

					{/* Badges row */}
					<div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
						{/* Priority badge */}
						{(thread.priority === "high" || thread.priority === "urgent") && (
							<Badge variant="destructive" className="h-5 text-[10px] px-1.5">
								{thread.priority === "urgent" ? "URGENT" : "High"}
							</Badge>
						)}

						{/* Unassigned badge */}
						{isUnassigned && (
							<Badge
								variant="outline"
								className="h-5 text-[10px] px-1.5 border-orange-600 text-orange-600"
							>
								Unassigned
							</Badge>
						)}

						{/* Assigned to name */}
						{thread.assignedToName && !isAssignedToMe && (
							<Badge variant="secondary" className="h-5 text-[10px] px-1.5">
								{thread.assignedToName}
							</Badge>
						)}

						{/* Status badge */}
						{thread.status === "resolved" && (
							<Badge
								variant="outline"
								className="h-5 text-[10px] px-1.5 border-green-600 text-green-600"
							>
								Resolved
							</Badge>
						)}

						{thread.status === "snoozed" && thread.snoozedUntil && (
							<Badge
								variant="outline"
								className="h-5 text-[10px] px-1.5 border-orange-600 text-orange-600"
							>
								Snoozed
							</Badge>
						)}
					</div>
				</div>
			</div>
		</button>
	);
}

"use client";

/**
 * Conversation Header - Customer info and actions
 *
 * Features:
 * - Customer name and phone
 * - Assignment dropdown
 * - Status dropdown
 * - Priority dropdown
 * - Archive/resolve actions
 */

import {
	Archive,
	CheckCircle2,
	Clock,
	Flag,
	Mail,
	MoreVertical,
	Phone,
	User,
	UserPlus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import type { SmsThread } from "@/lib/stores/messages-store";
import { cn } from "@/lib/utils";

interface ConversationHeaderProps {
	thread: SmsThread;
	onAssignClick: () => void;
	onStatusChange: (status: "open" | "pending" | "resolved" | "snoozed") => void;
	onPriorityChange: (priority: "low" | "normal" | "high" | "urgent") => void;
	onArchive: () => void;
}

export function ConversationHeader({
	thread,
	onAssignClick,
	onStatusChange,
	onPriorityChange,
	onArchive,
}: ConversationHeaderProps) {
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
		return phone && phone.length >= 2 ? phone.slice(-2) : "??";
	};

	const initials = getInitials(thread.remoteName, thread.remotePhoneNumber);

	return (
		<div className="bg-background border-b px-4 py-3">
			<div className="flex items-center justify-between gap-4">
				{/* Customer info */}
				<div className="flex min-w-0 items-center gap-3">
					<Avatar className="h-10 w-10 flex-shrink-0">
						<AvatarImage src={undefined} />
						<AvatarFallback className="bg-primary/10 text-primary font-medium">
							{initials}
						</AvatarFallback>
					</Avatar>

					<div className="min-w-0">
						<div className="flex items-center gap-2">
							<h2 className="truncate text-base font-semibold">
								{thread.remoteName || thread.remotePhoneNumber}
							</h2>

							{/* Status badge */}
							<Badge
								variant={thread.status === "resolved" ? "outline" : "secondary"}
								className={cn(
									"text-xs",
									thread.status === "resolved" &&
										"border-green-600 text-green-600",
									thread.status === "snoozed" &&
										"border-orange-600 text-orange-600",
									thread.status === "pending" &&
										"border-yellow-600 text-yellow-600",
								)}
							>
								{thread.status}
							</Badge>

							{/* Priority badge */}
							{(thread.priority === "high" || thread.priority === "urgent") && (
								<Badge variant="destructive" className="text-xs">
									{thread.priority}
								</Badge>
							)}
						</div>

						{thread.remoteName && (
							<p className="text-muted-foreground truncate text-sm">
								{thread.remotePhoneNumber}
							</p>
						)}
					</div>
				</div>

				{/* Actions */}
				<div className="flex flex-shrink-0 items-center gap-2">
					{/* Quick actions */}
					<Button variant="ghost" size="sm" className="h-8 gap-1.5">
						<Phone className="h-4 w-4" />
						<span className="hidden sm:inline">Call</span>
					</Button>

					{/* Assign button */}
					<Button
						variant="outline"
						size="sm"
						onClick={onAssignClick}
						className="h-8 gap-1.5"
					>
						<UserPlus className="h-4 w-4" />
						<span className="hidden sm:inline">
							{thread.assignedToName || "Assign"}
						</span>
					</Button>

					{/* More actions dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
								<MoreVertical className="h-4 w-4" />
								<span className="sr-only">More actions</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>Change status</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => onStatusChange("open")}>
								<Mail className="mr-2 h-4 w-4" />
								Mark as open
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onStatusChange("pending")}>
								<Clock className="mr-2 h-4 w-4" />
								Mark as pending
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onStatusChange("resolved")}>
								<CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
								Mark as resolved
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onStatusChange("snoozed")}>
								<Clock className="mr-2 h-4 w-4 text-orange-600" />
								Snooze
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<DropdownMenuLabel>Change priority</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => onPriorityChange("urgent")}>
								<Flag className="mr-2 h-4 w-4 text-red-600" />
								Urgent
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onPriorityChange("high")}>
								<Flag className="mr-2 h-4 w-4 text-orange-600" />
								High
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onPriorityChange("normal")}>
								<Flag className="mr-2 h-4 w-4" />
								Normal
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onPriorityChange("low")}>
								<Flag className="text-muted-foreground mr-2 h-4 w-4" />
								Low
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<DropdownMenuItem onClick={onArchive}>
								<Archive className="mr-2 h-4 w-4" />
								Archive conversation
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
}

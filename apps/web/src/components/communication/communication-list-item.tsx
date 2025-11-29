"use client";

import { memo } from "react";
import Link from "next/link";
import {
	Archive,
	AlertTriangle,
	Briefcase,
	Mail,
	MessageSquare,
	Phone,
	Star,
	StickyNote,
	User,
	Voicemail,
} from "lucide-react";
import type { Communication } from "@/lib/queries/communications";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CommunicationListItemProps {
	communication: Communication;
	isSelected: boolean;
	isStarred: boolean;
	onSelect: (communication: Communication) => void;
	onStar: (communicationId: string) => void;
	onArchive: (communicationId: string) => void;
	getContactDisplayName: (comm: Communication) => string;
}

function CommunicationListItemComponent({
	communication,
	isSelected,
	isStarred,
	onSelect,
	onStar,
	onArchive,
	getContactDisplayName,
}: CommunicationListItemProps) {
	const isUnread =
		communication.status === "unread" || communication.status === "new";
	
	const getTypeConfig = (type: string) => {
		switch (type) {
			case "email":
				return {
					icon: Mail,
					bg: "bg-blue-500 dark:bg-blue-600",
				};
			case "sms":
				return {
					icon: MessageSquare,
					bg: "bg-green-500 dark:bg-green-600",
				};
			case "call":
				return {
					icon: Phone,
					bg: "bg-purple-500 dark:bg-purple-600",
				};
			case "voicemail":
				return {
					icon: Voicemail,
					bg: "bg-orange-500 dark:bg-orange-600",
				};
			default:
				return {
					icon: Mail,
					bg: "bg-gray-500 dark:bg-gray-600",
				};
		}
	};

	const typeConfig = getTypeConfig(communication.type);
	const TypeIcon = typeConfig.icon;

	return (
		<div key={communication.id} className="select-none md:my-1">
			<div
				className={cn(
					"hover:bg-accent group flex cursor-pointer flex-col items-start rounded-lg py-2 text-left text-sm transition-all hover:opacity-100 relative",
					isSelected ? "bg-accent opacity-100" : "",
					isUnread ? "opacity-100" : "opacity-60",
				)}
				onClick={() => onSelect(communication)}
			>
				{/* Hover Action Toolbar */}
				<div
					className="dark:bg-panelDark absolute right-2 z-25 flex -translate-y-1/2 items-center gap-1 rounded-xl border bg-white p-1 opacity-0 shadow-sm group-hover:opacity-100 top-[-1] transition-opacity duration-200"
					onClick={(e) => e.stopPropagation()}
				>
					<Button
						variant="ghost"
						size="sm"
						className="h-6 w-6 overflow-visible p-0 hover:bg-accent group/star"
						onClick={(e) => {
							e.stopPropagation();
							onStar(communication.id);
						}}
						title="Star"
					>
						<Star
							className={cn(
								"h-4 w-4 transition-colors group-hover/star:text-yellow-500",
								isStarred
									? "fill-yellow-500 text-yellow-500"
									: "text-muted-foreground",
							)}
						/>
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="h-6 w-6 p-0 hover:bg-accent group/archive"
						onClick={(e) => {
							e.stopPropagation();
							onArchive(communication.id);
						}}
						title="Archive"
					>
						<Archive className="h-4 w-4 text-muted-foreground transition-colors group-hover/archive:text-blue-500" />
					</Button>
				</div>

				{/* Communication Card Content */}
				<div className="relative flex w-full items-center justify-between gap-4 px-2">
					{/* Avatar with type badge */}
					<div className="relative">
						<Avatar className="h-8 w-8 shrink-0 rounded-full border">
							<AvatarFallback className="bg-white dark:bg-[#373737] text-[#9F9F9D] font-bold text-xs">
								{getContactDisplayName(communication)[0]?.toUpperCase() || "?"}
							</AvatarFallback>
						</Avatar>
						<div
							className={cn(
								"absolute -bottom-1 -right-1 rounded-full p-1 flex items-center justify-center",
								typeConfig.bg,
								"shadow-sm ring-1 ring-background/50",
							)}
						>
							<TypeIcon className="h-2.5 w-2.5" style={{ color: 'white' }} />
						</div>
					</div>

					<div className="flex w-full justify-between">
						<div className="w-full">
							<div className="flex w-full flex-row items-center justify-between">
								<div className="flex flex-row items-center gap-[4px]">
									<span className="font-bold text-md flex items-baseline gap-1 group-hover:opacity-100">
										<div className="flex items-center gap-1">
											<span className="line-clamp-1 overflow-hidden text-sm">
												{getContactDisplayName(communication)}
											</span>
											{isUnread && (
												<span className="ml-0.5 size-2 rounded-full bg-[#006FFE]"></span>
											)}
										</div>
									</span>
								</div>
								<p className="text-muted-foreground text-nowrap text-xs font-normal opacity-70 transition-opacity group-hover:opacity-100 dark:text-[#8C8C8C]">
									{communication.createdAt
										? new Date(communication.createdAt).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})
										: ""}
								</p>
							</div>

							<div className="flex justify-between items-center gap-2">
								<p className="mt-1 line-clamp-1 min-w-0 overflow-hidden text-sm text-[#8C8C8C] flex-1">
									{communication.subject ||
										communication.body ||
										"No content"}
								</p>
								{/* Status badges */}
								<div className="flex items-center gap-1 shrink-0">
									{communication.customerId && (
										<Link
											href={`/dashboard/customers/${communication.customerId}`}
											onClick={(e) => e.stopPropagation()}
											className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-0.5"
											title="View customer profile"
										>
											<User className="h-2.5 w-2.5" />
										</Link>
									)}
									{communication.jobId && (
										<span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-600 flex items-center gap-0.5">
											<Briefcase className="h-2.5 w-2.5" />
										</span>
									)}
									{communication.internalNotes && (
										<span className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground flex items-center gap-0.5">
											<StickyNote className="h-2.5 w-2.5" />
										</span>
									)}
									{communication.status === "failed" && (
										<span className="px-1.5 py-0.5 rounded text-[10px] bg-destructive/10 text-destructive flex items-center gap-0.5">
											<AlertTriangle className="h-2.5 w-2.5" />
										</span>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// Memoized component - only re-renders when props change
export const CommunicationListItem = memo(CommunicationListItemComponent, (prev, next) => {
	// Custom comparison function - return true if props are equal (skip re-render)
	if (
		prev.communication.id !== next.communication.id ||
		prev.isSelected !== next.isSelected ||
		prev.isStarred !== next.isStarred
	) {
		return false; // Props changed, re-render
	}
	
	// Check if communication properties that affect display have changed
	if (
		prev.communication.status !== next.communication.status ||
		prev.communication.createdAt !== next.communication.createdAt ||
		JSON.stringify(prev.communication.tags || []) !== JSON.stringify(next.communication.tags || [])
	) {
		return false; // Communication changed, re-render
	}
	
	return true; // Props are equal, skip re-render
});

CommunicationListItem.displayName = "CommunicationListItem";


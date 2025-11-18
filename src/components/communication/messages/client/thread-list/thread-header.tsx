"use client";

/**
 * Thread Header - Search and filter controls
 *
 * Features:
 * - Search input with icon
 * - View mode buttons (All, Unassigned, etc.)
 * - Filter dropdown for advanced options
 */

import {
	CheckCircle2,
	Clock,
	Filter,
	Inbox,
	ListTodo,
	Search,
	Settings2,
	UserX,
	Volume2,
	VolumeX,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { MessageView } from "@/lib/stores/message-ui-store";
import { useMessagesStore } from "@/lib/stores/messages-store";
import { cn } from "@/lib/utils";

interface ThreadHeaderProps {
	activeView: MessageView;
	onViewChange: (view: MessageView) => void;
	soundEnabled?: boolean;
	onToggleSound?: () => void;
}

const viewConfig = [
	{ value: "inbox" as const, label: "Inbox", icon: Inbox },
	{ value: "unassigned" as const, label: "Unassigned", icon: UserX },
	{ value: "assigned" as const, label: "My Tasks", icon: ListTodo },
	{ value: "resolved" as const, label: "Resolved", icon: CheckCircle2 },
	{ value: "snoozed" as const, label: "Snoozed", icon: Clock },
];

export function ThreadHeader({
	activeView,
	onViewChange,
	soundEnabled,
	onToggleSound,
}: ThreadHeaderProps) {
	const filters = useMessagesStore((state) => state.filters);
	const setFilter = useMessagesStore((state) => state.setFilter);
	const threads = useMessagesStore((state) => state.threads);

	// Calculate unread count from threads
	const unreadCount = threads.reduce(
		(sum, thread) => sum + thread.unreadCount,
		0,
	);

	const handleSearchChange = (value: string) => {
		setFilter("search", value);
	};

	return (
		<div className="border-b bg-background">
			{/* Search bar */}
			<div className="p-3 pb-2">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search conversations..."
						value={filters.search}
						onChange={(e) => handleSearchChange(e.target.value)}
						className="pl-9 h-9"
						aria-label="Search conversations"
					/>
				</div>
			</div>

			{/* View tabs */}
			<div className="px-2 pb-2 flex items-center gap-1 overflow-x-auto">
				{viewConfig.map(({ value, label, icon: Icon }) => {
					const isActive = activeView === value;

					return (
						<Button
							key={value}
							variant={isActive ? "secondary" : "ghost"}
							size="sm"
							onClick={() => onViewChange(value)}
							className={cn(
								"h-8 gap-1.5 whitespace-nowrap",
								isActive && "bg-secondary",
							)}
						>
							<Icon className="h-3.5 w-3.5" />
							{label}
							{value === "inbox" && unreadCount > 0 && (
								<Badge
									variant="default"
									className="h-4 min-w-[16px] px-1 text-[10px]"
								>
									{unreadCount > 99 ? "99+" : unreadCount}
								</Badge>
							)}
						</Button>
					);
				})}

				{/* Settings */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2">
							<Settings2 className="h-3.5 w-3.5" />
							<span className="sr-only">Settings</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel>Notification Settings</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuCheckboxItem
							checked={soundEnabled}
							onCheckedChange={onToggleSound}
						>
							<div className="flex items-center gap-2">
								{soundEnabled ? (
									<Volume2 className="h-4 w-4" />
								) : (
									<VolumeX className="h-4 w-4" />
								)}
								Sound notifications
							</div>
						</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Advanced filters */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm" className="h-8 gap-1.5">
							<Filter className="h-3.5 w-3.5" />
							Filters
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel>Filter by</DropdownMenuLabel>
						<DropdownMenuSeparator />

						{/* Priority filters */}
						<DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
							Priority
						</DropdownMenuLabel>
						<DropdownMenuCheckboxItem
							checked={filters.priority === "all"}
							onCheckedChange={() => setFilter("priority", "all")}
						>
							All priorities
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={filters.priority === "urgent"}
							onCheckedChange={() => setFilter("priority", "urgent")}
						>
							Urgent only
						</DropdownMenuCheckboxItem>
						<DropdownMenuCheckboxItem
							checked={filters.priority === "high"}
							onCheckedChange={() => setFilter("priority", "high")}
						>
							High priority
						</DropdownMenuCheckboxItem>

						<DropdownMenuSeparator />

						{/* Other filters */}
						<DropdownMenuCheckboxItem
							checked={filters.hasAttachments === true}
							onCheckedChange={(checked) =>
								setFilter("hasAttachments", checked ? true : null)
							}
						>
							Has attachments
						</DropdownMenuCheckboxItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}

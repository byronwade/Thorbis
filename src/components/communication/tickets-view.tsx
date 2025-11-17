"use client";

/**
 * Tickets View Component - Client Component
 * Support ticket kanban/list layout
 *
 * Client-side features:
 * - Ticket list with status indicators
 * - Priority badges
 * - Assignment info
 */

import {
	AlertCircle,
	Archive,
	CheckCircle,
	Clock,
	MessageSquare,
	Ticket,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { type ColumnDef, FullWidthDataTable } from "@/components/ui/full-width-datatable";
import { useToast } from "@/hooks/use-toast";
import { useCommunicationStore } from "@/lib/stores/communication-store";

type TicketStatus = "new" | "open" | "pending" | "resolved" | "closed";

type TicketMessage = {
	id: string;
	from: string;
	fromEmail?: string;
	subject?: string;
	preview: string;
	timestamp: Date;
	status: "unread" | "read" | "replied" | "archived";
	priority: "low" | "normal" | "high" | "urgent";
	tags?: string[];
	assignedTo?: string;
	ticketStatus?: TicketStatus;
	responseTime?: number; // in hours
};

type TicketsViewProps = {
	messages: TicketMessage[];
};

export function TicketsView({ messages }: TicketsViewProps) {
	const router = useRouter();
	const { toast } = useToast();
	const setSelectedMessageId = useCommunicationStore((state) => state.setSelectedMessageId);
	const setIsDetailView = useCommunicationStore((state) => state.setIsDetailView);

	const handleOpenMessage = (message: TicketMessage) => {
		setSelectedMessageId(message.id);
		setIsDetailView(true);
		router.push(`/dashboard/communication/${message.id}`);
	};

	const getStatusIcon = (ticketStatus?: TicketStatus) => {
		switch (ticketStatus) {
			case "new":
				return <AlertCircle className="text-primary size-4" />;
			case "open":
				return <MessageSquare className="text-warning size-4" />;
			case "pending":
				return <Clock className="text-warning size-4" />;
			case "resolved":
				return <CheckCircle className="text-success size-4" />;
			case "closed":
				return <CheckCircle className="text-muted-foreground size-4" />;
			default:
				return <Ticket className="size-4" />;
		}
	};

	const getStatusLabel = (ticketStatus?: TicketStatus) => {
		if (!ticketStatus) {
			return "New";
		}
		return ticketStatus.charAt(0).toUpperCase() + ticketStatus.slice(1);
	};

	const getStatusVariant = (ticketStatus?: TicketStatus) => {
		switch (ticketStatus) {
			case "new":
				return "default";
			case "open":
				return "default";
			case "pending":
				return "secondary";
			case "resolved":
				return "outline";
			case "closed":
				return "outline";
			default:
				return "secondary";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "urgent":
				return "destructive";
			case "high":
				return "default";
			case "normal":
				return "secondary";
			case "low":
				return "outline";
			default:
				return "secondary";
		}
	};

	const formatTimestamp = (date: Date) => {
		const MINUTES_PER_HOUR = 60;
		const HOURS_PER_DAY = 24;
		const DAYS_IN_WEEK = 7;
		const MS_IN_SECOND = 1000;
		const SECONDS_IN_MINUTE = 60;
		const MS_IN_MINUTE = MS_IN_SECOND * SECONDS_IN_MINUTE;

		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / MS_IN_MINUTE);
		const hours = Math.floor(minutes / MINUTES_PER_HOUR);
		const days = Math.floor(hours / HOURS_PER_DAY);

		if (minutes < MINUTES_PER_HOUR) {
			return `${minutes}m ago`;
		}
		if (hours < HOURS_PER_DAY) {
			return `${hours}h ago`;
		}
		if (days < DAYS_IN_WEEK) {
			return `${days}d ago`;
		}
		return date.toLocaleDateString();
	};

	const columns: ColumnDef<TicketMessage>[] = [
		{
			key: "ticket",
			header: "Ticket",
			width: "w-56",
			render: (message) => (
				<div className="flex items-center gap-3">
					<div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
						{getStatusIcon(message.ticketStatus)}
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-semibold">#{message.id}</span>
						<span className="text-muted-foreground text-xs">{message.from}</span>
					</div>
				</div>
			),
		},
		{
			key: "subject",
			header: "Subject",
			width: "flex-1",
			render: (message) => (
				<div className="flex flex-col">
					<div className="flex items-center gap-2">
						<span className={`text-sm ${message.status === "unread" ? "font-semibold" : ""}`}>
							{message.subject || "Support Request"}
						</span>
						<Badge className="text-xs" variant={getStatusVariant(message.ticketStatus)}>
							{getStatusLabel(message.ticketStatus)}
						</Badge>
						<Badge className="text-xs" variant={getPriorityColor(message.priority)}>
							{message.priority}
						</Badge>
					</div>
					<p className="text-muted-foreground line-clamp-2 text-xs">{message.preview}</p>
				</div>
			),
		},
		{
			key: "assignments",
			header: "Assignments",
			width: "w-48",
			render: (message) => (
				<div className="text-muted-foreground flex flex-col gap-1 text-xs">
					<div className="flex items-center gap-1">
						<User className="size-3" />
						<span>{message.assignedTo ?? "Unassigned"}</span>
					</div>
					{message.responseTime ? (
						<div className="flex items-center gap-1">
							<Clock className="size-3" />
							<span>Response: {message.responseTime}h</span>
						</div>
					) : null}
				</div>
			),
		},
		{
			key: "tags",
			header: "Tags",
			width: "w-40",
			render: (message) =>
				message.tags && message.tags.length > 0 ? (
					<div className="flex flex-wrap gap-1">
						{message.tags.slice(0, 2).map((tag) => (
							<Badge className="text-xs" key={`${message.id}-${tag}`} variant="outline">
								{tag}
							</Badge>
						))}
						{message.tags.length > 2 && (
							<Badge className="text-xs" variant="outline">
								+{message.tags.length - 2}
							</Badge>
						)}
					</div>
				) : (
					<span className="text-muted-foreground text-xs">—</span>
				),
		},
		{
			key: "timestamp",
			header: "Updated",
			width: "w-32",
			align: "right",
			sortable: true,
			render: (message) => (
				<span className="text-muted-foreground text-xs">{formatTimestamp(message.timestamp)}</span>
			),
		},
	];

	const searchFilter = (message: TicketMessage, query: string) => {
		const needle = query.toLowerCase();
		return (
			String(message.id).toLowerCase().includes(needle) ||
			message.from.toLowerCase().includes(needle) ||
			(message.subject?.toLowerCase().includes(needle) ?? false) ||
			message.preview.toLowerCase().includes(needle) ||
			(message.assignedTo?.toLowerCase().includes(needle) ?? false) ||
			(message.ticketStatus ?? "new").toLowerCase().includes(needle)
		);
	};

	const handleBulkArchive = useCallback(
		(selectedIds: Set<string>) => {
			if (selectedIds.size === 0) {
				return;
			}
			const noun = selectedIds.size === 1 ? "ticket" : "tickets";
			toast.success(`Archive queued for ${selectedIds.size} ${noun}.`);
		},
		[toast]
	);

	const bulkActions = [
		{
			label: "Archive",
			icon: <Archive className="size-3.5" />,
			onClick: handleBulkArchive,
		},
	];

	return (
		<FullWidthDataTable
			bulkActions={bulkActions}
			columns={columns}
			data={messages}
			emptyIcon={<Ticket className="text-muted-foreground size-10" />}
			emptyMessage="No support tickets"
			enableSelection
			entity="communications-tickets"
			getHighlightClass={() => "bg-primary/10 dark:bg-primary/5"}
			getItemId={(item) => item.id}
			isHighlighted={(item) => item.status === "unread"}
			onRowClick={handleOpenMessage}
			searchFilter={searchFilter}
			searchPlaceholder="Search tickets"
			showRefresh={false}
		/>
	);
}

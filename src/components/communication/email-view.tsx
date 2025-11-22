"use client";

/**
 * Email View Component - Client Component
 * Uses shared FullWidthDataTable for consistent experience across modules
 */

import { Archive, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { useToast } from "@/hooks/use-toast";
import { useCommunicationStore } from "@/lib/stores/communication-store";

type EmailMessage = {
	id: string;
	from: string;
	fromEmail?: string;
	toEmail?: string;
	subject?: string;
	preview: string;
	timestamp: Date;
	status: "unread" | "read" | "replied" | "archived";
	priority: "low" | "normal" | "high" | "urgent";
	direction: "inbound" | "outbound";
	tags?: string[];
	attachments?: number;
	customerId?: string;
	sentAt?: string;
	deliveredAt?: string;
};

type EmailViewProps = {
	messages: EmailMessage[];
};

export function EmailView({ messages }: EmailViewProps) {
	const router = useRouter();
	const { toast } = useToast();
	const setSelectedMessageId = useCommunicationStore(
		(state) => state.setSelectedMessageId,
	);
	const setIsDetailView = useCommunicationStore(
		(state) => state.setIsDetailView,
	);

	const handleOpenMessage = (message: EmailMessage) => {
		setSelectedMessageId(message.id);
		setIsDetailView(true);
		router.push(`/dashboard/communication/${message.id}`);
	};

	const getPriorityVariant = (priority: string) => {
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

	const columns: ColumnDef<EmailMessage>[] = [
		{
			key: "from",
			header: "From",
			width: "w-64",
			shrink: true,
			sortable: true,
			render: (message) => (
				<div className="flex items-center gap-3">
					<Avatar className="h-8 w-8">
						<AvatarFallback className="text-xs">
							{message.from
								.split(" ")
								.filter(Boolean)
								.map((n) => n[0])
								.join("")
								.slice(0, 2)
								.toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="text-sm font-medium">{message.from}</span>
						{message.fromEmail && (
							<span className="text-muted-foreground text-xs">
								{message.fromEmail}
							</span>
						)}
					</div>
				</div>
			),
		},
		{
			key: "subject",
			header: "Subject",
			width: "flex-1",
			sortable: true,
			render: (message) => (
				<div className="flex flex-col">
					<div className="flex items-center gap-2">
						<Mail className="text-muted-foreground size-3.5" />
						<span
							className={`text-sm ${message.status === "unread" ? "font-semibold" : ""}`}
						>
							{message.subject || "(No subject)"}
						</span>
						{message.direction === "outbound" && (
							<span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
								Sent
							</span>
						)}
						{message.direction === "inbound" && (
							<span className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
								Received
							</span>
						)}
					</div>
					<p className="text-muted-foreground line-clamp-1 text-xs">
						{message.preview}
					</p>
				</div>
			),
		},
		{
			key: "direction",
			header: "Type",
			width: "w-24",
			render: (message) => (
				<Badge
					className="capitalize text-xs"
					variant={message.direction === "outbound" ? "default" : "secondary"}
				>
					{message.direction === "outbound" ? "Sent" : "Received"}
				</Badge>
			),
		},
		{
			key: "priority",
			header: "Priority",
			width: "w-28",
			render: (message) => (
				<Badge
					className="capitalize"
					variant={getPriorityVariant(message.priority)}
				>
					{message.priority}
				</Badge>
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
							<Badge
								className="text-xs"
								key={`${message.id}-${tag}`}
								variant="outline"
							>
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
			header: "Received",
			width: "w-32",
			align: "right",
			sortable: true,
			render: (message) => (
				<span className="text-muted-foreground text-xs">
					{formatTimestamp(message.timestamp)}
				</span>
			),
		},
	];

	const handleBulkArchive = useCallback(
		(selectedIds: Set<string>) => {
			if (selectedIds.size === 0) {
				return;
			}
			const noun = selectedIds.size === 1 ? "email" : "emails";
			toast.success(`Archive queued for ${selectedIds.size} ${noun}.`);
		},
		[toast],
	);

	const bulkActions = [
		{
			label: "Archive",
			icon: <Archive className="size-3.5" />,
			variant: "ghost" as const,
			onClick: handleBulkArchive,
		},
	];

	const searchFilter = (message: EmailMessage, query: string) => {
		const needle = query.toLowerCase();
		return (
			message.from.toLowerCase().includes(needle) ||
			(message.fromEmail?.toLowerCase().includes(needle) ?? false) ||
			(message.subject?.toLowerCase().includes(needle) ?? false) ||
			message.preview.toLowerCase().includes(needle)
		);
	};

	return (
		<FullWidthDataTable
			bulkActions={bulkActions}
			columns={columns}
			data={messages}
			emptyIcon={<Mail className="text-muted-foreground size-10" />}
			emptyMessage="No emails found"
			enableSelection
			entity="communications-email"
			getHighlightClass={() => "bg-primary/10 dark:bg-primary/5"}
			getItemId={(item) => item.id}
			isHighlighted={(item) => item.status === "unread"}
			onRowClick={handleOpenMessage}
			searchFilter={searchFilter}
			searchPlaceholder="Search emails"
			showRefresh={false}
		/>
	);
}

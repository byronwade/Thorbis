"use client";

/**
 * All Messages View Component - Client Component
 * Unified view for all communication types with type-specific icons.
 * Shows emails, SMS, calls, and tickets in a single view.
 */

import {
	Archive,
	Mail,
	MessageCircle,
	Phone,
	PhoneIncoming,
	PhoneMissed,
	PhoneOutgoing,
	Ticket,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import {
	type BulkAction,
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { useToast } from "@/hooks/use-toast";
import { useCommunicationStore } from "@/lib/stores/communication-store";

type MessageType = "email" | "sms" | "phone" | "ticket";
type MessageStatus = "unread" | "read" | "replied" | "archived";
type MessagePriority = "low" | "normal" | "high" | "urgent";
type CallType = "incoming" | "outgoing" | "missed" | "voicemail";

type UnifiedMessage = {
	id: string;
	type: MessageType;
	from: string;
	fromPhone?: string;
	toPhone?: string;
	fromEmail?: string;
	subject?: string;
	preview: string;
	timestamp: Date;
	status: MessageStatus;
	priority: MessagePriority;
	tags?: string[];
	direction?: "inbound" | "outbound";
	callType?: CallType;
	duration?: number;
	telnyxCallControlId?: string;
	callRecordingUrl?: string;
};

type AllMessagesViewProps = {
	messages: UnifiedMessage[];
	onResumeCall?: (callControlId: string) => void;
	onViewRecording?: (recordingUrl: string) => void;
};

export function AllMessagesView({
	messages,
	onResumeCall,
	onViewRecording,
}: AllMessagesViewProps) {
	const router = useRouter();
	const { toast } = useToast();
	const setSelectedMessageId = useCommunicationStore(
		(state) => state.setSelectedMessageId,
	);

	const handleOpenMessage = useCallback(
		(message: UnifiedMessage) => {
			setSelectedMessageId(message.id);
			router.push(`/dashboard/communication?id=${message.id}`);
		},
		[router, setSelectedMessageId],
	);

	// Get icon based on message type
	const getMessageIcon = (message: UnifiedMessage) => {
		switch (message.type) {
			case "email":
				return <Mail className="size-4 text-blue-600 dark:text-blue-400" />;
			case "sms":
				return (
					<MessageCircle className="size-4 text-green-600 dark:text-green-400" />
				);
			case "phone":
				if (message.callType === "incoming") {
					return (
						<PhoneIncoming className="size-4 text-purple-600 dark:text-purple-400" />
					);
				}
				if (message.callType === "outgoing") {
					return (
						<PhoneOutgoing className="size-4 text-blue-600 dark:text-blue-400" />
					);
				}
				if (message.callType === "missed") {
					return (
						<PhoneMissed className="size-4 text-red-600 dark:text-red-400" />
					);
				}
				return <Phone className="size-4 text-primary" />;
			case "ticket":
				return (
					<Ticket className="size-4 text-orange-600 dark:text-orange-400" />
				);
			default:
				return <Mail className="size-4 text-muted-foreground" />;
		}
	};

	// Get type label
	const getTypeLabel = (type: MessageType) => {
		switch (type) {
			case "email":
				return "Email";
			case "sms":
				return "SMS";
			case "phone":
				return "Call";
			case "ticket":
				return "Ticket";
			default:
				return type;
		}
	};

	const getPriorityVariant = (
		priority: MessagePriority,
	): "default" | "secondary" | "destructive" | "outline" => {
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

	const formatDuration = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
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

	const columns: ColumnDef<UnifiedMessage>[] = [
		{
			key: "from",
			header: "From",
			width: "w-72",
			sortable: true,
			render: (message) => (
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
						{getMessageIcon(message)}
					</div>
					<div className="flex flex-col">
						<div className="flex items-center gap-2">
							<span
								className={`font-medium text-sm ${message.status === "unread" ? "font-semibold" : ""}`}
							>
								{message.from}
							</span>
							<Badge className="text-xs" variant="outline">
								{getTypeLabel(message.type)}
							</Badge>
						</div>
						{(message.fromPhone || message.fromEmail) && (
							<span className="text-muted-foreground text-xs">
								{message.fromPhone || message.fromEmail}
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
				<div className="flex flex-col gap-1">
					<span
						className={`text-sm ${message.status === "unread" ? "font-semibold" : ""}`}
					>
						{message.subject || "(No subject)"}
					</span>
					{message.preview && (
						<p className="line-clamp-1 text-muted-foreground text-xs">
							{message.preview}
						</p>
					)}
					{message.type === "phone" && message.duration !== undefined && (
						<span className="text-muted-foreground text-xs">
							Duration: {formatDuration(message.duration)}
						</span>
					)}
				</div>
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
						{message.tags.map((tag) => (
							<Badge className="text-xs" key={tag} variant="outline">
								{tag}
							</Badge>
						))}
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

	const bulkActions: BulkAction[] = [
		{
			label: "Archive Selected",
			icon: <Archive className="size-4" />,
			onClick: handleBulkArchive,
		},
	];

	function handleBulkArchive(selectedIds: Set<string>) {
		if (selectedIds.size === 0) {
			return;
		}
		const noun = selectedIds.size === 1 ? "message" : "messages";
		toast.success(`Archived ${selectedIds.size} ${noun}`, {
			description: "The selected items have been archived.",
		});
	}

	const searchFilter = (message: UnifiedMessage, query: string) => {
		const needle = query.toLowerCase();
		return (
			message.from.toLowerCase().includes(needle) ||
			(message.fromPhone?.toLowerCase().includes(needle) ?? false) ||
			(message.fromEmail?.toLowerCase().includes(needle) ?? false) ||
			(message.subject?.toLowerCase().includes(needle) ?? false) ||
			message.preview.toLowerCase().includes(needle) ||
			message.type.toLowerCase().includes(needle)
		);
	};

	return (
		<FullWidthDataTable
			bulkActions={bulkActions}
			columns={columns}
			data={messages}
			emptyIcon={<Mail className="size-10 text-muted-foreground" />}
			emptyMessage="No messages"
			enableSelection
			entity="communications-all"
			getHighlightClass={() => "bg-primary/10 dark:bg-primary/5"}
			getItemId={(item) => item.id}
			isHighlighted={(item) => item.status === "unread"}
			onRowClick={handleOpenMessage}
			searchFilter={searchFilter}
			searchPlaceholder="Search all messages"
			showRefresh={false}
		/>
	);
}

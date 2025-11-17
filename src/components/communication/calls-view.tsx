"use client";

/**
 * Calls View Component - Client Component
 * Shared FullWidthDataTable implementation for call records.
 */

import {
	Archive,
	Phone,
	PhoneCall,
	PhoneIncoming,
	PhoneMissed,
	PhoneOutgoing,
	Voicemail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ColumnDef, FullWidthDataTable } from "@/components/ui/full-width-datatable";
import { useToast } from "@/hooks/use-toast";
import { useCommunicationStore } from "@/lib/stores/communication-store";

type CallType = "incoming" | "outgoing" | "missed" | "voicemail";

type CallMessage = {
	id: string;
	from: string;
	fromPhone?: string;
	preview: string;
	timestamp: Date;
	status: "unread" | "read" | "replied" | "archived";
	priority: "low" | "normal" | "high" | "urgent";
	tags?: string[];
	callType?: CallType;
	duration?: number;
	telnyxCallControlId?: string | null;
	callRecordingUrl?: string | null;
};

type CallsViewProps = {
	messages: CallMessage[];
	onResumeCall?: (callControlId: string) => void;
	onViewRecording?: (recordingUrl: string) => void;
};

export function CallsView({ messages, onResumeCall, onViewRecording }: CallsViewProps) {
	const router = useRouter();
	const { toast } = useToast();
	const setSelectedMessageId = useCommunicationStore((state) => state.setSelectedMessageId);
	const setIsDetailView = useCommunicationStore((state) => state.setIsDetailView);

	const handleOpenMessage = (message: CallMessage) => {
		setSelectedMessageId(message.id);
		setIsDetailView(true);
		router.push(`/dashboard/communication/${message.id}`);
	};

	const getCallIcon = (callType?: CallType) => {
		switch (callType) {
			case "incoming":
				return <PhoneIncoming className="text-success size-4" />;
			case "outgoing":
				return <PhoneOutgoing className="text-primary size-4" />;
			case "missed":
				return <PhoneMissed className="text-destructive size-4" />;
			case "voicemail":
				return <Voicemail className="text-accent-foreground size-4" />;
			default:
				return <Phone className="size-4" />;
		}
	};

	const getCallTypeLabel = (callType?: CallType) => {
		switch (callType) {
			case "incoming":
				return "Incoming";
			case "outgoing":
				return "Outgoing";
			case "missed":
				return "Missed";
			case "voicemail":
				return "Voicemail";
			default:
				return "Call";
		}
	};

	const formatDuration = (seconds?: number | null) => {
		if (!seconds) {
			return "—";
		}
		const SECONDS_PER_MINUTE = 60;
		const mins = Math.floor(seconds / SECONDS_PER_MINUTE);
		const secs = seconds % SECONDS_PER_MINUTE;
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

	const columns: ColumnDef<CallMessage>[] = [
		{
			key: "caller",
			header: "Caller",
			width: "w-72",
			render: (message) => (
				<div className="flex items-center gap-3">
					<div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
						{getCallIcon(message.callType)}
					</div>
					<div className="flex flex-col">
						<div className="flex items-center gap-2">
							<span
								className={`text-sm font-medium ${message.status === "unread" ? "font-semibold" : ""}`}
							>
								{message.from}
							</span>
							<Badge className="text-xs" variant="outline">
								{getCallTypeLabel(message.callType)}
							</Badge>
						</div>
						{message.fromPhone && (
							<span className="text-muted-foreground text-xs">{message.fromPhone}</span>
						)}
					</div>
				</div>
			),
		},
		{
			key: "details",
			header: "Details",
			width: "flex-1",
			render: (message) =>
				message.callType === "voicemail" ? (
					<p className="text-muted-foreground line-clamp-1 text-xs">{message.preview}</p>
				) : (
					<span className="text-muted-foreground text-xs">—</span>
				),
		},
		{
			key: "duration",
			header: "Duration",
			width: "w-24",
			align: "center",
			render: (message) => (
				<span className="text-muted-foreground text-xs">{formatDuration(message.duration)}</span>
			),
		},
		{
			key: "timestamp",
			header: "Timestamp",
			width: "w-32",
			align: "right",
			sortable: true,
			render: (message) => (
				<span className="text-muted-foreground text-xs">{formatTimestamp(message.timestamp)}</span>
			),
		},
		{
			key: "actions",
			header: "Actions",
			width: "w-40",
			align: "right",
			render: (message) => (
				<div className="flex items-center justify-end gap-2">
					{message.telnyxCallControlId && (
						<Button
							onClick={(event) => {
								event.stopPropagation();
								const controlId = message.telnyxCallControlId;
								if (!controlId) {
									return;
								}
								onResumeCall?.(controlId);
							}}
							size="sm"
							type="button"
							variant="ghost"
						>
							Resume
						</Button>
					)}
					{message.callRecordingUrl && (
						<Button
							onClick={(event) => {
								event.stopPropagation();
								const recordingUrl = message.callRecordingUrl;
								if (!recordingUrl) {
									return;
								}
								onViewRecording?.(recordingUrl);
							}}
							size="sm"
							type="button"
							variant="ghost"
						>
							Recording
						</Button>
					)}
				</div>
			),
		},
	];

	const handleBulkArchive = useCallback(
		(selectedIds: Set<string>) => {
			if (selectedIds.size === 0) {
				return;
			}
			const noun = selectedIds.size === 1 ? "call" : "calls";
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

	const searchFilter = (message: CallMessage, query: string) => {
		const needle = query.toLowerCase();
		return (
			message.from.toLowerCase().includes(needle) ||
			(message.fromPhone?.toLowerCase().includes(needle) ?? false) ||
			message.preview.toLowerCase().includes(needle) ||
			(message.callType ?? "call").toLowerCase().includes(needle)
		);
	};

	return (
		<FullWidthDataTable
			bulkActions={bulkActions}
			columns={columns}
			data={messages}
			emptyIcon={<PhoneCall className="text-muted-foreground size-10" />}
			emptyMessage="No call history"
			enableSelection
			entity="communications-calls"
			getHighlightClass={() => "bg-primary/10 dark:bg-primary/5"}
			getItemId={(item) => item.id}
			isHighlighted={(item) => item.status === "unread"}
			onRowClick={handleOpenMessage}
			searchFilter={searchFilter}
			searchPlaceholder="Search calls"
			showRefresh={false}
		/>
	);
}

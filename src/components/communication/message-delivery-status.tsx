"use client";

import { Check, CheckCheck, Clock, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	type MessageDeliveryStatus,
	useMessageStatus,
} from "@/hooks/use-message-status";

type MessageDeliveryStatusBadgeProps = {
	messageId: string | null | undefined;
	direction: "inbound" | "outbound";
	initialStatus?: string | null;
	sentAt?: string | null;
	deliveredAt?: string | null;
	failedAt?: string | null;
	compact?: boolean; // If true, show minimal text-only version
	showText?: boolean; // If true, show text instead of badge
};

export function MessageDeliveryStatusBadge({
	messageId,
	direction,
	initialStatus,
	sentAt,
	deliveredAt,
	failedAt,
	compact = false,
	showText = false,
}: MessageDeliveryStatusBadgeProps) {
	// Only poll for outbound messages with a Telnyx message ID
	const shouldPoll = direction === "outbound" && !!messageId;

	const { status, isPolling } = useMessageStatus(
		shouldPoll ? messageId : null,
		initialStatus,
	);

	// For inbound messages, just show received
	if (direction === "inbound") {
		if (showText) {
			return (
				<span className="text-muted-foreground flex items-center gap-1 text-xxs">
					Received
				</span>
			);
		}
		return (
			<Badge variant="secondary" className="gap-1">
				<Check className="size-3" />
				Received
			</Badge>
		);
	}

	// For outbound messages without message ID, show basic status
	if (!messageId) {
		if (showText) {
			return (
				<span className="text-muted-foreground flex items-center gap-1 text-xxs">
					{initialStatus || "Unknown"}
				</span>
			);
		}
		return (
			<Badge variant="outline" className="text-muted-foreground gap-1">
				<Clock className="size-3" />
				{initialStatus || "Unknown"}
			</Badge>
		);
	}

	// Determine actual status from timestamps if available
	let finalStatus: MessageDeliveryStatus = status;
	if (failedAt) {
		finalStatus = "failed";
	} else if (deliveredAt) {
		finalStatus = "delivered";
	} else if (sentAt) {
		finalStatus = "sent";
	}

	if (showText) {
		return getStatusText(finalStatus, isPolling);
	}

	return (
		<div className="flex items-center gap-2">
			{getStatusBadge(finalStatus, isPolling)}
		</div>
	);
}

function getStatusText(
	status: MessageDeliveryStatus,
	isPolling: boolean,
): JSX.Element {
	switch (status) {
		case "queued":
			return (
				<span className="flex items-center gap-1 text-xxs text-gray-500">
					Sending...
					{isPolling && <Loader2 className="size-2.5 animate-spin" />}
				</span>
			);

		case "sending":
		case "sent":
			return (
				<span className="flex items-center gap-1 text-xxs text-blue-500">
					Sent
					{isPolling && <Loader2 className="ml-0.5 size-2.5 animate-spin" />}
				</span>
			);

		case "delivered":
			return (
				<span className="flex items-center gap-1 text-xxs text-green-600">
					Delivered
				</span>
			);

		case "read":
			return (
				<span className="flex items-center gap-1 text-xxs text-green-700">
					Read
				</span>
			);

		case "failed":
			return (
				<span className="flex items-center gap-1 text-xxs text-red-500">
					Not Delivered
				</span>
			);

		default:
			return (
				<span className="text-muted-foreground flex items-center gap-1 text-xxs">
					Unknown
				</span>
			);
	}
}

function getStatusBadge(
	status: MessageDeliveryStatus,
	isPolling: boolean,
): JSX.Element {
	switch (status) {
		case "queued":
			return (
				<Badge
					variant="outline"
					className="gap-1 border-gray-500 text-gray-500"
				>
					<Clock className="size-3" />
					Queued
					{isPolling && <Loader2 className="ml-1 size-3 animate-spin" />}
				</Badge>
			);

		case "sending":
		case "sent":
			return (
				<Badge
					variant="outline"
					className="gap-1 border-blue-500 text-blue-500"
				>
					<Check className="size-3" />
					Sent
					{isPolling && <Loader2 className="ml-1 size-3 animate-spin" />}
				</Badge>
			);

		case "delivered":
			return (
				<Badge
					variant="outline"
					className="gap-1 border-green-500 text-green-500"
				>
					<CheckCheck className="size-3" />
					Delivered
				</Badge>
			);

		case "read":
			return (
				<Badge
					variant="outline"
					className="gap-1 border-green-700 text-green-700"
				>
					<CheckCheck className="size-3" />
					Read
				</Badge>
			);

		case "failed":
			return (
				<Badge variant="outline" className="gap-1 border-red-500 text-red-500">
					<X className="size-3" />
					Failed
				</Badge>
			);

		default:
			return (
				<Badge variant="outline" className="text-muted-foreground gap-1">
					<Clock className="size-3" />
					Unknown
				</Badge>
			);
	}
}

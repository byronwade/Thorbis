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
};

export function MessageDeliveryStatusBadge({
	messageId,
	direction,
	initialStatus,
	sentAt,
	deliveredAt,
	failedAt,
}: MessageDeliveryStatusBadgeProps) {
	// Only poll for outbound messages with a Telnyx message ID
	const shouldPoll = direction === "outbound" && !!messageId;

	const { status, isPolling } = useMessageStatus(
		shouldPoll ? messageId : null,
		initialStatus,
	);

	// For inbound messages, just show received
	if (direction === "inbound") {
		return (
			<Badge variant="secondary" className="gap-1">
				<Check className="size-3" />
				Received
			</Badge>
		);
	}

	// For outbound messages without message ID, show basic status
	if (!messageId) {
		return (
			<Badge variant="outline" className="gap-1 text-muted-foreground">
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

	return (
		<div className="flex items-center gap-2">
			{getStatusBadge(finalStatus, isPolling)}
		</div>
	);
}

function getStatusBadge(
	status: MessageDeliveryStatus,
	isPolling: boolean,
): JSX.Element {
	switch (status) {
		case "queued":
			return (
				<Badge variant="outline" className="gap-1 border-gray-500 text-gray-500">
					<Clock className="size-3" />
					Queued
					{isPolling && <Loader2 className="ml-1 size-3 animate-spin" />}
				</Badge>
			);

		case "sending":
		case "sent":
			return (
				<Badge variant="outline" className="gap-1 border-blue-500 text-blue-500">
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

		case "failed":
			return (
				<Badge variant="outline" className="gap-1 border-red-500 text-red-500">
					<X className="size-3" />
					Failed
				</Badge>
			);

		default:
			return (
				<Badge variant="outline" className="gap-1 text-muted-foreground">
					<Clock className="size-3" />
					Unknown
				</Badge>
			);
	}
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MessageDeliveryStatus =
	| "queued"
	| "sending"
	| "sent"
	| "delivered"
	| "failed"
	| "unknown";

export type MessageStatusData = {
	status: MessageDeliveryStatus;
	isPolling: boolean;
	error: string | null;
};

/**
 * Hook to poll Telnyx API for message delivery status
 * Polls every 3 seconds until message is delivered or failed
 */
export function useMessageStatus(
	messageId: string | null | undefined,
	initialStatus?: string | null,
): MessageStatusData {
	const [status, setStatus] = useState<MessageDeliveryStatus>(
		mapStatus(initialStatus),
	);
	const [isPolling, setIsPolling] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const fetchStatus = useCallback(async () => {
		if (!messageId) return;

		try {
			abortControllerRef.current = new AbortController();

			const response = await fetch(
				`/api/telnyx/message-status?messageId=${messageId}`,
				{
					signal: abortControllerRef.current.signal,
				},
			);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}

			const data = await response.json();

			if (data.error) {
				setError(data.error);
				setIsPolling(false);
				return;
			}

			const newStatus = mapStatus(data.data?.status);
			setStatus(newStatus);

			// Stop polling if message is in terminal state
			if (newStatus === "delivered" || newStatus === "failed") {
				setIsPolling(false);
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
					intervalRef.current = null;
				}
			}
		} catch (err) {
			if (err instanceof Error && err.name !== "AbortError") {
				setError(err.message);
				setIsPolling(false);
			}
		}
	}, [messageId]);

	useEffect(() => {
		// Only poll for outbound SMS messages with a Telnyx message ID
		if (!messageId || status === "delivered" || status === "failed") {
			return;
		}

		// Start polling
		setIsPolling(true);
		setError(null);

		// Immediate first check
		void fetchStatus();

		// Poll every 3 seconds
		intervalRef.current = setInterval(() => {
			void fetchStatus();
		}, 3000);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, [messageId, status, fetchStatus]);

	return { status, isPolling, error };
}

/**
 * Map various status strings to normalized delivery status
 */
function mapStatus(status: string | null | undefined): MessageDeliveryStatus {
	if (!status) return "unknown";

	const normalized = status.toLowerCase();

	if (normalized === "queued") return "queued";
	if (normalized === "sending" || normalized === "sent") return "sent";
	if (normalized === "delivered") return "delivered";
	if (normalized === "failed") return "failed";

	return "unknown";
}

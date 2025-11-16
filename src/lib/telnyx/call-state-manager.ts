/**
 * Telnyx Call State Manager
 *
 * Syncs Telnyx webhook events with UI store and broadcasts to call window.
 * Handles real-time call state updates from Telnyx WebRTC and webhook events.
 */

import { useUIStore } from "@/lib/stores/ui-store";
import type { CallState } from "@/types/call-window";

/**
 * Telnyx webhook event types
 */
export type TelnyxCallEvent =
	| "call.initiated"
	| "call.answered"
	| "call.hangup"
	| "call.recording.saved"
	| "call.machine.detection.ended";

/**
 * Telnyx call event payload
 */
export type TelnyxCallEventPayload = {
	call_control_id: string;
	call_session_id: string;
	from: string;
	to: string;
	direction: "incoming" | "outgoing";
	state?: string;
};

/**
 * Initialize call state from Telnyx webhook
 */
export function initializeCallFromWebhook(eventType: TelnyxCallEvent, payload: TelnyxCallEventPayload): void {
	const store = useUIStore.getState();

	switch (eventType) {
		case "call.initiated": {
			// Set incoming call state
			store.setIncomingCall({
				number: payload.direction === "incoming" ? payload.from : payload.to,
				name: "", // Will be enriched by customer data fetch
			});

			// Update Telnyx state
			if (store.setTelnyxCallState) {
				store.setTelnyxCallState("ringing");
			}

			break;
		}

		case "call.answered": {
			// Update call to active
			store.answerCall();

			// Update Telnyx state
			if (store.setTelnyxCallState) {
				store.setTelnyxCallState("active");
			}

			break;
		}

		case "call.hangup": {
			// End call
			store.endCall();

			// Update Telnyx state
			if (store.setTelnyxCallState) {
				store.setTelnyxCallState("ended");
			}

			// Clear customer data
			if (store.clearCustomerData) {
				store.clearCustomerData();
			}

			break;
		}

		case "call.recording.saved": {
			break;
		}

		case "call.machine.detection.ended": {
			break;
		}
	}
}

/**
 * Broadcast call state to call window via PostMessage
 */
export function broadcastCallStateToWindow(callId: string, state: Partial<CallState>): void {
	// Find call window by callId
	const _callWindows = Array.from(window.opener ? [window.opener] : []);

	// Also check for child windows
	if (typeof window !== "undefined") {
		// Broadcast to all windows (they'll filter by callId)
		window.postMessage(
			{
				type: "CALL_STATE_SYNC",
				callId,
				callData: state,
				timestamp: Date.now(),
			},
			window.location.origin
		);
	}
}

/**
 * Handle Telnyx error
 */
export function handleTelnyxError(error: Error, _context: string): void {
	const store = useUIStore.getState();
	if (store.setTelnyxError) {
		store.setTelnyxError(error.message);
	}

	// Show user notification
	store.addNotification({
		type: "error",
		message: `Call error: ${error.message}`,
		duration: 5000,
	});
}

/**
 * Sync call control state (mute, hold, record)
 */
export function syncCallControlState(
	action: "mute" | "unmute" | "hold" | "unhold" | "record_start" | "record_stop",
	callId: string
): void {
	const store = useUIStore.getState();

	switch (action) {
		case "mute":
		case "unmute":
			store.toggleMute();
			break;
		case "hold":
		case "unhold":
			store.toggleHold();
			break;
		case "record_start":
		case "record_stop":
			store.toggleRecording();
			break;
	}

	// Broadcast to call window
	broadcastCallStateToWindow(callId, {
		isMuted: store.call.isMuted,
		isOnHold: store.call.isOnHold,
		isRecording: store.call.isRecording,
	});
}

/**
 * Update call with customer data
 */
export function updateCallWithCustomerData(callId: string, customerData: any): void {
	const store = useUIStore.getState();

	if (store.setCustomerData) {
		store.setCustomerData(customerData);
	}

	// Update caller info
	if (customerData.customer) {
		const customer = customerData.customer;
		const callerName = `${customer.first_name || ""} ${customer.last_name || ""}`.trim();

		if (callerName) {
			// Update call state with customer name
			store.setIncomingCall({
				number: customer.phone || store.call.caller?.number || "",
				name: callerName,
				avatar: customer.avatar_url,
			});
		}
	}

	// Broadcast to call window
	broadcastCallStateToWindow(callId, {
		customerData,
		customerId: customerData.customer?.id || null,
	});
}

/**
 * Listen for Telnyx events from WebRTC
 */
export function setupTelnyxEventListeners(): void {
	if (typeof window === "undefined") {
		return;
	}

	// Listen for custom Telnyx events
	window.addEventListener("telnyx:call:initiated", (event: any) => {
		initializeCallFromWebhook("call.initiated", event.detail);
	});

	window.addEventListener("telnyx:call:answered", (event: any) => {
		initializeCallFromWebhook("call.answered", event.detail);
	});

	window.addEventListener("telnyx:call:hangup", (event: any) => {
		initializeCallFromWebhook("call.hangup", event.detail);
	});

	window.addEventListener("telnyx:call:error", (event: any) => {
		handleTelnyxError(event.detail.error, event.detail.context);
	});
}

/**
 * Cleanup Telnyx event listeners
 */
export function cleanupTelnyxEventListeners(): void {
	if (typeof window === "undefined") {
		return;
	}

	window.removeEventListener("telnyx:call:initiated", () => {});
	window.removeEventListener("telnyx:call:answered", () => {});
	window.removeEventListener("telnyx:call:hangup", () => {});
	window.removeEventListener("telnyx:call:error", () => {});
}

/**
 * React Hook: useWebRTCService
 *
 * Provides safe access to the isolated WebRTC service with graceful degradation.
 * If the WebRTC service is unavailable, components will still render - telephony
 * features will simply be disabled without breaking the UI.
 *
 * @module useWebRTCService
 */

"use client";

import { useEffect, useState } from "react";
import type { WebRTCServiceStatus } from "@/services/webrtc";

/**
 * WebRTC service hook return type
 */
export type UseWebRTCServiceReturn = {
	/** Whether the service is available and ready */
	isAvailable: boolean;

	/** Current service status */
	status: WebRTCServiceStatus;

	/** Whether the service is currently connecting/initializing */
	isConnecting: boolean;

	/** Last error from the service */
	error: Error | null;

	/** Make an outgoing call */
	makeCall: (phoneNumber: string) => Promise<void>;

	/** End an active call */
	endCall: (callId: string) => Promise<void>;

	/** Answer an incoming call */
	answerCall: (callId: string) => Promise<void>;

	/** Generate WebRTC credentials */
	generateCredential: (username: string, ttl?: number) => Promise<any>;

	/** Active calls */
	activeCalls: any[];
};

/**
 * Hook to access the isolated WebRTC service
 *
 * Usage:
 * ```tsx
 * const { isAvailable, makeCall, status } = useWebRTCService();
 *
 * if (!isAvailable) {
 *   return <div>Telephony unavailable</div>;
 * }
 *
 * return <button onClick={() => makeCall("+1234567890")}>Call</button>;
 * ```
 */
export function useWebRTCService(): UseWebRTCServiceReturn {
	const [status, setStatus] = useState<WebRTCServiceStatus>("idle");
	const [error, setError] = useState<Error | null>(null);
	const [activeCalls, setActiveCalls] = useState<any[]>([]);

	useEffect(() => {
		// Check if we're in browser environment
		if (typeof window === "undefined") {
			return;
		}

		// Try to get service status from API route (safe - won't crash if unavailable)
		const checkStatus = async () => {
			try {
				const response = await fetch("/api/webrtc/status", {
					method: "GET",
					cache: "no-store",
				});

				if (response.ok) {
					const data = await response.json();
					setStatus(data.status || "idle");
					setError(null);
				} else {
					// Service not available - graceful degradation
					setStatus("error");
					setError(new Error("WebRTC service unavailable"));
				}
			} catch (err) {
				// Service not available - graceful degradation
				setStatus("error");
				setError(err instanceof Error ? err : new Error("WebRTC service unavailable"));
			}
		};

		checkStatus();

		// Poll status every 30 seconds
		const interval = setInterval(checkStatus, 30000);

		return () => clearInterval(interval);
	}, []);

	/**
	 * Make an outgoing call (safe - won't crash if service unavailable)
	 */
	const makeCall = async (phoneNumber: string): Promise<void> => {
		if (status !== "ready") {
			throw new Error("WebRTC service not ready");
		}

		try {
			const response = await fetch("/api/webrtc/call", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "make", phoneNumber }),
			});

			if (!response.ok) {
				throw new Error("Failed to make call");
			}

			const data = await response.json();
			setActiveCalls((prev) => [...prev, data.call]);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Failed to make call"));
			throw err;
		}
	};

	/**
	 * End an active call (safe - won't crash if service unavailable)
	 */
	const endCall = async (callId: string): Promise<void> => {
		try {
			const response = await fetch("/api/webrtc/call", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "end", callId }),
			});

			if (!response.ok) {
				throw new Error("Failed to end call");
			}

			setActiveCalls((prev) => prev.filter((call) => call.id !== callId));
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Failed to end call"));
			throw err;
		}
	};

	/**
	 * Answer an incoming call (safe - won't crash if service unavailable)
	 */
	const answerCall = async (callId: string): Promise<void> => {
		try {
			const response = await fetch("/api/webrtc/call", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "answer", callId }),
			});

			if (!response.ok) {
				throw new Error("Failed to answer call");
			}

			setActiveCalls((prev) =>
				prev.map((call) => (call.id === callId ? { ...call, status: "active" } : call)),
			);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Failed to answer call"));
			throw err;
		}
	};

	/**
	 * Generate WebRTC credentials (safe - won't crash if service unavailable)
	 */
	const generateCredential = async (username: string, ttl?: number): Promise<any> => {
		if (status !== "ready") {
			throw new Error("WebRTC service not ready");
		}

		try {
			const response = await fetch("/api/webrtc/credential", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, ttl }),
			});

			if (!response.ok) {
				throw new Error("Failed to generate credential");
			}

			const data = await response.json();
			return data.credential;
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Failed to generate credential"));
			throw err;
		}
	};

	return {
		isAvailable: status === "ready",
		status,
		isConnecting: status === "starting",
		error,
		makeCall,
		endCall,
		answerCall,
		generateCredential,
		activeCalls,
	};
}

/**
 * Hook to safely render telephony UI with fallback
 *
 * Usage:
 * ```tsx
 * const telephonyUI = useWebRTCFallback(
 *   <CallButton />,  // Render when service available
 *   <div>Calls unavailable</div>  // Render when service down
 * );
 *
 * return telephonyUI;
 * ```
 */
export function useWebRTCFallback(
	telephonyComponent: React.ReactNode,
	fallbackComponent?: React.ReactNode,
): React.ReactNode {
	const { isAvailable, status } = useWebRTCService();

	if (status === "error" || !isAvailable) {
		return fallbackComponent || null;
	}

	return telephonyComponent;
}

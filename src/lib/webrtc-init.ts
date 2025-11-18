/**
 * WebRTC Service Auto-Initialization
 *
 * This module automatically starts the isolated WebRTC service when the Next.js
 * server boots up. If startup fails, the error is logged but the app continues.
 *
 * IMPORTANT: This runs server-side only during Next.js server initialization.
 * Client-side code should use the useWebRTCService hook instead.
 *
 * @module WebRTCInit
 */

import { startWebRTCService } from "@/services/webrtc";

let isInitialized = false;
let initializationPromise: Promise<boolean> | null = null;

/**
 * Initialize WebRTC service (called automatically on server startup)
 *
 * This function is idempotent - calling it multiple times is safe.
 * It will only initialize the service once, even if called concurrently.
 */
export async function initializeWebRTC(): Promise<boolean> {
	// Already initialized
	if (isInitialized) {
		return true;
	}

	// Initialization in progress
	if (initializationPromise) {
		return initializationPromise;
	}

	// Start initialization
	initializationPromise = (async () => {
		try {
			console.log("[WebRTC Init] Starting isolated WebRTC service...");

			const success = await startWebRTCService();

			if (success) {
				console.log("[WebRTC Init] ✓ WebRTC service started successfully");
				console.log("[WebRTC Init] Telephony features are now available");
				isInitialized = true;
				return true;
			}
			console.warn("[WebRTC Init] ⚠ WebRTC service failed to start");
			console.warn("[WebRTC Init] Telephony features will be unavailable");
			console.warn(
				"[WebRTC Init] Main application continues to function normally",
			);
			return false;
		} catch (error) {
			console.error(
				"[WebRTC Init] ✗ WebRTC service initialization error:",
				error,
			);
			console.error("[WebRTC Init] Telephony features will be unavailable");
			console.error(
				"[WebRTC Init] Main application continues to function normally",
			);
			return false;
		} finally {
			initializationPromise = null;
		}
	})();

	return initializationPromise;
}

/**
 * Check if WebRTC service is initialized
 */
export function isWebRTCInitialized(): boolean {
	return isInitialized;
}

// Auto-initialize on module load (server-side only)
if (typeof window === "undefined") {
	// Run in background - don't block server startup
	initializeWebRTC().catch((error) => {
		console.error("[WebRTC Init] Background initialization failed:", error);
	});
}

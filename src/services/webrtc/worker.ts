/**
 * WebRTC Worker Thread
 *
 * This file runs in a separate worker thread, completely isolated from the main app.
 * Any crashes, errors, or failures here will NOT affect the main application.
 *
 * Responsibilities:
 * - WebRTC credential generation
 * - Call management (make, answer, end)
 * - Connection monitoring
 * - Health checks
 *
 * @module WebRTCWorker
 */

import { parentPort, workerData } from "node:worker_threads";
import type { WebRTCServiceCommand, WebRTCServiceMessage } from "./index";

// Worker state
let isRunning = true;
let isInitialized = false;
const activeCalls = new Map<string, any>();

/**
 * Send message to parent thread
 */
function sendMessage(message: WebRTCServiceMessage): void {
	if (parentPort) {
		parentPort.postMessage(message);
	}
}

/**
 * Send status update
 */
function sendStatus(
	status: "idle" | "starting" | "ready" | "error" | "stopped",
): void {
	sendMessage({ type: "status", status });
}

/**
 * Send error message
 */
function sendError(error: string): void {
	sendMessage({ type: "error", error });
	console.error(`[WebRTC Worker] Error: ${error}`);
}

/**
 * Initialize the worker
 */
async function initialize(): Promise<void> {
	try {
		sendStatus("starting");

		// Validate environment
		if (!workerData?.telnyxApiKey) {
			throw new Error("TELNYX_API_KEY not provided to worker");
		}

		// TODO: Initialize Telnyx WebRTC client here
		// For now, just mark as ready
		isInitialized = true;
		sendStatus("ready");

		console.log("[WebRTC Worker] Initialized successfully");
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Initialization failed";
		sendError(errorMessage);
		sendStatus("error");
		throw error;
	}
}

/**
 * Generate WebRTC credentials
 */
async function generateCredential(
	username: string,
	ttl = 86400,
): Promise<void> {
	try {
		// Sanitize username - Telnyx requires only letters and numbers
		const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, "");
		const baseName = sanitizedUsername.length > 0 ? sanitizedUsername : "user";
		const uniqueSuffix = Date.now().toString(36);
		const credentialName = `${baseName}${uniqueSuffix}`;

		// Generate password
		const password = generateRandomPassword(32);

		// Call Telnyx API to create credential
		const response = await fetch(
			"https://api.telnyx.com/v2/credential_connections",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${workerData.telnyxApiKey}`,
				},
				body: JSON.stringify({
					connection_name: credentialName,
					user_name: credentialName,
					password,
					ttl,
				}),
			},
		);

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Telnyx API error: ${response.status} - ${errorText}`);
		}

		const data = await response.json();

		// Build credential response
		const credential = {
			username: data.data?.user_name || credentialName,
			password: data.data?.password || password,
			expires_at: data.data?.expires_at
				? new Date(data.data.expires_at).getTime()
				: Date.now() + ttl * 1000,
			realm: data.data?.realm || "sip.telnyx.com",
			sip_uri: data.data?.sip_uri || `sip:${credentialName}@sip.telnyx.com`,
			stun_servers: data.data?.ice_servers?.stun || [
				"stun:stun.telnyx.com:3478",
				"stun:stun.telnyx.com:3479",
			],
			turn_servers: data.data?.ice_servers?.turn || [
				{
					urls: [
						"turn:turn.telnyx.com:3478?transport=udp",
						"turn:turn.telnyx.com:3478?transport=tcp",
					],
					username: data.data?.user_name || credentialName,
					credential: data.data?.password || password,
				},
			],
		};

		sendMessage({ type: "credential_ready", credential });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Failed to generate credential";
		sendError(errorMessage);
	}
}

/**
 * Make an outgoing call
 */
async function makeCall(phoneNumber: string): Promise<void> {
	try {
		if (!isInitialized) {
			throw new Error("Worker not initialized");
		}

		// TODO: Implement actual call logic with Telnyx WebRTC SDK
		console.log(`[WebRTC Worker] Making call to ${phoneNumber}`);

		const callId = `call-${Date.now()}`;
		activeCalls.set(callId, {
			id: callId,
			phoneNumber,
			direction: "outgoing",
			status: "dialing",
			startTime: Date.now(),
		});

		sendMessage({
			type: "call_outgoing",
			data: {
				callId,
				phoneNumber,
				status: "dialing",
			},
		});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Failed to make call";
		sendError(errorMessage);
	}
}

/**
 * End an active call
 */
async function endCall(callId: string): Promise<void> {
	try {
		const call = activeCalls.get(callId);
		if (!call) {
			throw new Error(`Call ${callId} not found`);
		}

		// TODO: Implement actual call hangup logic
		console.log(`[WebRTC Worker] Ending call ${callId}`);

		activeCalls.delete(callId);

		sendMessage({
			type: "call_ended",
			data: {
				callId,
				duration: Date.now() - call.startTime,
			},
		});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Failed to end call";
		sendError(errorMessage);
	}
}

/**
 * Answer an incoming call
 */
async function answerCall(callId: string): Promise<void> {
	try {
		const call = activeCalls.get(callId);
		if (!call) {
			throw new Error(`Call ${callId} not found`);
		}

		// TODO: Implement actual call answer logic
		console.log(`[WebRTC Worker] Answering call ${callId}`);

		call.status = "active";
		activeCalls.set(callId, call);

		sendMessage({
			type: "call_incoming",
			data: {
				callId,
				status: "active",
			},
		});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Failed to answer call";
		sendError(errorMessage);
	}
}

/**
 * Perform health check
 */
function healthCheck(): void {
	const healthy = isInitialized && isRunning;
	sendMessage({ type: "health_check", healthy });
}

/**
 * Shutdown the worker
 */
function shutdown(): void {
	console.log("[WebRTC Worker] Shutting down...");
	isRunning = false;

	// End all active calls
	for (const [callId] of activeCalls) {
		endCall(callId);
	}

	// Clean up resources
	activeCalls.clear();

	sendStatus("stopped");
	process.exit(0);
}

/**
 * Handle commands from parent thread
 */
function handleCommand(command: WebRTCServiceCommand): void {
	try {
		switch (command.type) {
			case "initialize":
				initialize();
				break;

			case "generate_credential":
				generateCredential(command.username, command.ttl);
				break;

			case "make_call":
				makeCall(command.phoneNumber);
				break;

			case "end_call":
				endCall(command.callId);
				break;

			case "answer_call":
				answerCall(command.callId);
				break;

			case "health_check":
				healthCheck();
				break;

			case "shutdown":
				shutdown();
				break;

			default:
				console.warn(
					`[WebRTC Worker] Unknown command: ${(command as any).type}`,
				);
		}
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Command failed";
		sendError(errorMessage);
	}
}

/**
 * Generate random password
 */
function generateRandomPassword(length = 32): string {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
	let password = "";
	for (let i = 0; i < length; i++) {
		password += characters.charAt(
			Math.floor(Math.random() * characters.length),
		);
	}
	return password;
}

// Set up message handler
if (parentPort) {
	parentPort.on("message", handleCommand);
}

// Auto-initialize on startup
initialize().catch((error) => {
	console.error("[WebRTC Worker] Failed to auto-initialize:", error);
	process.exit(1);
});

// Handle uncaught errors (isolated - won't crash main app)
process.on("uncaughtException", (error) => {
	console.error("[WebRTC Worker] Uncaught exception:", error);
	sendError(`Uncaught exception: ${error.message}`);
	sendStatus("error");
	// Don't exit - let parent decide whether to restart
});

process.on("unhandledRejection", (reason) => {
	console.error("[WebRTC Worker] Unhandled rejection:", reason);
	sendError(`Unhandled rejection: ${reason}`);
	sendStatus("error");
});

console.log("[WebRTC Worker] Started");

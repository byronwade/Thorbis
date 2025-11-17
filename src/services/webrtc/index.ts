/**
 * WebRTC Service - Isolated Process Management
 *
 * This service runs WebRTC/telephony functionality in a completely isolated process
 * to ensure that any failures, errors, or API issues NEVER affect the main application.
 *
 * Architecture:
 * - Runs in separate Node.js worker thread
 * - Uses IPC (Inter-Process Communication) for messaging
 * - Graceful degradation if service fails
 * - Health monitoring and automatic restart
 * - Error boundaries prevent crashes from propagating
 *
 * @module WebRTCService
 */

import { Worker } from "node:worker_threads";
import { EventEmitter } from "node:events";
import path from "node:path";

export type WebRTCServiceStatus = "idle" | "starting" | "ready" | "error" | "stopped";

export type WebRTCServiceMessage =
	| { type: "status"; status: WebRTCServiceStatus }
	| { type: "error"; error: string }
	| { type: "call_incoming"; data: any }
	| { type: "call_outgoing"; data: any }
	| { type: "call_ended"; data: any }
	| { type: "credential_ready"; credential: any }
	| { type: "health_check"; healthy: boolean };

export type WebRTCServiceCommand =
	| { type: "initialize"; config: any }
	| { type: "generate_credential"; username: string; ttl?: number }
	| { type: "make_call"; phoneNumber: string }
	| { type: "end_call"; callId: string }
	| { type: "answer_call"; callId: string }
	| { type: "health_check" }
	| { type: "shutdown" };

/**
 * WebRTC Service Manager
 *
 * Manages the isolated WebRTC worker thread and handles all IPC communication.
 * Ensures the main application is never blocked or crashed by telephony issues.
 */
export class WebRTCService extends EventEmitter {
	private worker: Worker | null = null;
	private status: WebRTCServiceStatus = "idle";
	private restartAttempts = 0;
	private maxRestartAttempts = 3;
	private healthCheckInterval: NodeJS.Timeout | null = null;

	constructor() {
		super();
	}

	/**
	 * Start the WebRTC service worker
	 */
	async start(): Promise<void> {
		if (this.worker) {
			console.warn("[WebRTC Service] Service already running");
			return;
		}

		try {
			this.setStatus("starting");

			// Create worker thread with the WebRTC worker script
			const workerPath = path.join(__dirname, "worker.js");
			this.worker = new Worker(workerPath, {
				workerData: {
					telnyxApiKey: process.env.TELNYX_API_KEY,
				},
			});

			// Set up message handling
			this.worker.on("message", (message: WebRTCServiceMessage) => {
				this.handleWorkerMessage(message);
			});

			// Handle worker errors (isolated - won't crash main app)
			this.worker.on("error", (error) => {
				console.error("[WebRTC Service] Worker error:", error);
				this.setStatus("error");
				this.emit("error", error);

				// Attempt restart
				this.attemptRestart();
			});

			// Handle worker exit
			this.worker.on("exit", (code) => {
				if (code !== 0) {
					console.error(`[WebRTC Service] Worker stopped with exit code ${code}`);
					this.setStatus("error");
					this.attemptRestart();
				} else {
					console.log("[WebRTC Service] Worker stopped gracefully");
					this.setStatus("stopped");
				}
				this.worker = null;
			});

			// Start health monitoring
			this.startHealthMonitoring();

			// Wait for worker to be ready
			await this.waitForReady();

			console.log("[WebRTC Service] Started successfully");
		} catch (error) {
			console.error("[WebRTC Service] Failed to start:", error);
			this.setStatus("error");
			throw error;
		}
	}

	/**
	 * Stop the WebRTC service worker
	 */
	async stop(): Promise<void> {
		if (!this.worker) {
			return;
		}

		try {
			// Send shutdown command
			this.sendCommand({ type: "shutdown" });

			// Stop health monitoring
			if (this.healthCheckInterval) {
				clearInterval(this.healthCheckInterval);
				this.healthCheckInterval = null;
			}

			// Wait for graceful shutdown
			await this.worker.terminate();
			this.worker = null;
			this.setStatus("stopped");

			console.log("[WebRTC Service] Stopped");
		} catch (error) {
			console.error("[WebRTC Service] Error during shutdown:", error);
			// Force terminate
			if (this.worker) {
				await this.worker.terminate();
				this.worker = null;
			}
		}
	}

	/**
	 * Generate WebRTC credentials
	 */
	async generateCredential(username: string, ttl?: number): Promise<any> {
		return this.sendCommandAndWait({
			type: "generate_credential",
			username,
			ttl,
		});
	}

	/**
	 * Make an outgoing call
	 */
	async makeCall(phoneNumber: string): Promise<void> {
		this.sendCommand({
			type: "make_call",
			phoneNumber,
		});
	}

	/**
	 * End an active call
	 */
	async endCall(callId: string): Promise<void> {
		this.sendCommand({
			type: "end_call",
			callId,
		});
	}

	/**
	 * Answer an incoming call
	 */
	async answerCall(callId: string): Promise<void> {
		this.sendCommand({
			type: "answer_call",
			callId,
		});
	}

	/**
	 * Get current service status
	 */
	getStatus(): WebRTCServiceStatus {
		return this.status;
	}

	/**
	 * Check if service is healthy
	 */
	async healthCheck(): Promise<boolean> {
		if (!this.worker || this.status !== "ready") {
			return false;
		}

		try {
			const result = await this.sendCommandAndWait({ type: "health_check" }, 5000);
			return result?.healthy ?? false;
		} catch {
			return false;
		}
	}

	/**
	 * Private: Send command to worker
	 */
	private sendCommand(command: WebRTCServiceCommand): void {
		if (!this.worker) {
			console.warn("[WebRTC Service] Cannot send command - worker not running");
			return;
		}

		this.worker.postMessage(command);
	}

	/**
	 * Private: Send command and wait for response
	 */
	private async sendCommandAndWait(command: WebRTCServiceCommand, timeout = 10000): Promise<any> {
		return new Promise((resolve, reject) => {
			if (!this.worker) {
				reject(new Error("WebRTC service not running"));
				return;
			}

			const timer = setTimeout(() => {
				reject(new Error("WebRTC service command timeout"));
			}, timeout);

			const handler = (message: WebRTCServiceMessage) => {
				if (message.type === "credential_ready" && command.type === "generate_credential") {
					clearTimeout(timer);
					resolve(message.credential);
				} else if (message.type === "health_check" && command.type === "health_check") {
					clearTimeout(timer);
					resolve({ healthy: message.healthy });
				} else if (message.type === "error") {
					clearTimeout(timer);
					reject(new Error(message.error));
				}
			};

			this.worker.once("message", handler);
			this.sendCommand(command);
		});
	}

	/**
	 * Private: Handle messages from worker
	 */
	private handleWorkerMessage(message: WebRTCServiceMessage): void {
		switch (message.type) {
			case "status":
				this.setStatus(message.status);
				break;

			case "error":
				console.error("[WebRTC Service] Worker error:", message.error);
				this.emit("error", new Error(message.error));
				break;

			case "call_incoming":
				this.emit("call:incoming", message.data);
				break;

			case "call_outgoing":
				this.emit("call:outgoing", message.data);
				break;

			case "call_ended":
				this.emit("call:ended", message.data);
				break;

			case "credential_ready":
				this.emit("credential:ready", message.credential);
				break;

			case "health_check":
				this.emit("health_check", message.healthy);
				break;

			default:
				console.warn("[WebRTC Service] Unknown message type:", (message as any).type);
		}
	}

	/**
	 * Private: Update service status
	 */
	private setStatus(status: WebRTCServiceStatus): void {
		if (this.status !== status) {
			this.status = status;
			this.emit("status", status);
			console.log(`[WebRTC Service] Status: ${status}`);
		}
	}

	/**
	 * Private: Wait for worker to be ready
	 */
	private async waitForReady(timeout = 30000): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.status === "ready") {
				resolve();
				return;
			}

			const timer = setTimeout(() => {
				reject(new Error("WebRTC service startup timeout"));
			}, timeout);

			const handler = (status: WebRTCServiceStatus) => {
				if (status === "ready") {
					clearTimeout(timer);
					this.off("status", handler);
					resolve();
				} else if (status === "error") {
					clearTimeout(timer);
					this.off("status", handler);
					reject(new Error("WebRTC service failed to start"));
				}
			};

			this.on("status", handler);
		});
	}

	/**
	 * Private: Attempt to restart the service
	 */
	private async attemptRestart(): Promise<void> {
		if (this.restartAttempts >= this.maxRestartAttempts) {
			console.error("[WebRTC Service] Max restart attempts reached - giving up");
			this.emit("fatal_error", new Error("Max restart attempts reached"));
			return;
		}

		this.restartAttempts++;
		console.log(
			`[WebRTC Service] Attempting restart (${this.restartAttempts}/${this.maxRestartAttempts})`
		);

		// Wait before restarting
		await new Promise((resolve) => setTimeout(resolve, 5000));

		try {
			await this.start();
			this.restartAttempts = 0; // Reset on success
		} catch (error) {
			console.error("[WebRTC Service] Restart failed:", error);
			// Will try again if under max attempts
		}
	}

	/**
	 * Private: Start health monitoring
	 */
	private startHealthMonitoring(): void {
		// Check health every 30 seconds
		this.healthCheckInterval = setInterval(async () => {
			const healthy = await this.healthCheck();
			if (!healthy && this.status === "ready") {
				console.warn("[WebRTC Service] Health check failed");
				this.setStatus("error");
				this.attemptRestart();
			}
		}, 30000);
	}
}

/**
 * Singleton instance of WebRTC service
 */
let webrtcServiceInstance: WebRTCService | null = null;

/**
 * Get the WebRTC service instance
 *
 * This is safe to call from anywhere in the app - if the service is down,
 * it will gracefully degrade without affecting the main application.
 */
export function getWebRTCService(): WebRTCService {
	if (!webrtcServiceInstance) {
		webrtcServiceInstance = new WebRTCService();
	}
	return webrtcServiceInstance;
}

/**
 * Start the WebRTC service
 *
 * Should be called during application startup, but failures won't block the app.
 */
export async function startWebRTCService(): Promise<boolean> {
	try {
		const service = getWebRTCService();
		await service.start();
		return true;
	} catch (error) {
		console.error("[WebRTC Service] Failed to start:", error);
		// Graceful degradation - app continues without telephony
		return false;
	}
}

/**
 * Stop the WebRTC service
 *
 * Should be called during application shutdown.
 */
export async function stopWebRTCService(): Promise<void> {
	if (webrtcServiceInstance) {
		await webrtcServiceInstance.stop();
		webrtcServiceInstance = null;
	}
}

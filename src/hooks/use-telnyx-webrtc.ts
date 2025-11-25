/**
 * Telnyx WebRTC Hook
 *
 * Provides WebRTC calling functionality using the Telnyx WebRTC SDK.
 * Compatible with both web browsers and React Native.
 *
 * Features:
 * - Make and receive calls
 * - Call controls (mute, hold, end)
 * - Real-time call state management
 * - Audio device selection
 * - Connection status monitoring
 * - Auto-reconnection with exponential backoff
 */

"use client";

import type { Call, INotification } from "@telnyx/webrtc";
import { TelnyxRTC } from "@telnyx/webrtc";
import { useCallback, useEffect, useRef, useState } from "react";

// =============================================================================
// AUTO-RECONNECTION CONFIGURATION
// =============================================================================

const RECONNECT_CONFIG = {
	// Maximum number of reconnection attempts
	maxAttempts: 5,
	// Base delay in milliseconds (doubles with each attempt)
	baseDelayMs: 1000,
	// Maximum delay between attempts
	maxDelayMs: 30000,
	// Jitter factor (0-1) to add randomness
	jitterFactor: 0.3,
};

/**
 * Call state types
 */
export type CallState =
	| "idle"
	| "connecting"
	| "ringing"
	| "active"
	| "held"
	| "ended";

/**
 * Call direction
 */
export type CallDirection = "inbound" | "outbound";

/**
 * WebRTC call information
 */
export type WebRTCCall = {
	id: string;
	state: CallState;
	direction: CallDirection;
	remoteNumber: string;
	remoteName?: string;
	localNumber: string;
	startTime?: Date;
	duration: number;
	isMuted: boolean;
	isHeld: boolean;
	isRecording: boolean;
};

/**
 * Hook options
 */
export type UseTelnyxWebRTCOptions = {
	username: string;
	password: string;
	autoConnect?: boolean;
	debug?: boolean;
	onIncomingCall?: (call: WebRTCCall) => void;
	onCallEnded?: (call: WebRTCCall) => void;
};

/**
 * Hook return type
 */
export type UseTelnyxWebRTCReturn = {
	// Connection state
	isConnected: boolean;
	isConnecting: boolean;
	isReconnecting: boolean;
	connectionError: string | null;
	reconnectAttempts: number;

	// Current call
	currentCall: WebRTCCall | null;

	// Call actions
	makeCall: (destination: string, callerIdNumber?: string) => Promise<Call>;
	answerCall: () => Promise<void>;
	endCall: () => Promise<void>;
	muteCall: () => Promise<void>;
	unmuteCall: () => Promise<void>;
	holdCall: () => Promise<void>;
	unholdCall: () => Promise<void>;
	sendDTMF: (digit: string) => Promise<void>;

	// Connection actions
	connect: () => Promise<void>;
	disconnect: () => void;
	reconnect: () => Promise<void>;

	// Audio devices
	audioDevices: MediaDeviceInfo[];
	setAudioDevice: (deviceId: string) => Promise<void>;
};

/**
 * Telnyx WebRTC Hook
 *
 * Manages WebRTC connection and call state
 */
export function useTelnyxWebRTC(
	options: UseTelnyxWebRTCOptions,
): UseTelnyxWebRTCReturn {
	// Connection state
	const [isConnected, setIsConnected] = useState(false);
	const [isConnecting, setIsConnecting] = useState(false);
	const [isReconnecting, setIsReconnecting] = useState(false);
	const [connectionError, setConnectionError] = useState<string | null>(null);
	const [reconnectAttempts, setReconnectAttempts] = useState(0);

	// Call state
	const [currentCall, setCurrentCall] = useState<WebRTCCall | null>(null);

	// Audio devices
	const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);

	// Refs
	const clientRef = useRef<TelnyxRTC | null>(null);
	const activeCallRef = useRef<Call | null>(null);
	const optionsRef = useRef(options);
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const shouldReconnectRef = useRef(true);

	// Keep options ref up to date
	useEffect(() => {
		optionsRef.current = options;
	}, [options]);

	/**
	 * Calculate reconnection delay with exponential backoff and jitter
	 */
	const calculateReconnectDelay = useCallback((attempt: number): number => {
		// Exponential backoff: baseDelay * 2^attempt
		const exponentialDelay =
			RECONNECT_CONFIG.baseDelayMs * Math.pow(2, attempt);

		// Cap at maxDelay
		const cappedDelay = Math.min(exponentialDelay, RECONNECT_CONFIG.maxDelayMs);

		// Add jitter to prevent thundering herd
		const jitter =
			cappedDelay * RECONNECT_CONFIG.jitterFactor * Math.random();

		return Math.round(cappedDelay + jitter);
	}, []);

	/**
	 * Schedule a reconnection attempt
	 */
	const scheduleReconnect = useCallback(() => {
		// Clear any existing timeout
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
		}

		setReconnectAttempts((prev) => {
			const nextAttempt = prev + 1;

			if (nextAttempt > RECONNECT_CONFIG.maxAttempts) {
				console.error(
					`❌ WebRTC: Max reconnection attempts (${RECONNECT_CONFIG.maxAttempts}) reached`
				);
				setIsReconnecting(false);
				setConnectionError(
					`Connection lost. Max reconnection attempts (${RECONNECT_CONFIG.maxAttempts}) exceeded.`
				);
				return prev;
			}

			const delay = calculateReconnectDelay(nextAttempt - 1);
			console.log(
				`🔄 WebRTC: Scheduling reconnection attempt ${nextAttempt}/${RECONNECT_CONFIG.maxAttempts} in ${delay}ms`
			);

			setIsReconnecting(true);

			reconnectTimeoutRef.current = setTimeout(async () => {
				console.log(
					`🔄 WebRTC: Attempting reconnection ${nextAttempt}/${RECONNECT_CONFIG.maxAttempts}`
				);

				// Clear the old client before reconnecting
				if (clientRef.current) {
					try {
						clientRef.current.disconnect();
					} catch {
						// Ignore disconnect errors
					}
					clientRef.current = null;
				}

				// Attempt to reconnect
				try {
					const currentOptions = optionsRef.current;
					if (currentOptions.username && currentOptions.password) {
						// Create new client and connect
						const client = new TelnyxRTC({
							login: currentOptions.username,
							password: currentOptions.password,
							debug: currentOptions.debug,
						});

						// Re-setup event handlers
						client.on("telnyx.ready", () => {
							console.log("🎉 WebRTC: Reconnection successful!");
							setIsConnected(true);
							setIsConnecting(false);
							setIsReconnecting(false);
							setConnectionError(null);
							setReconnectAttempts(0);
						});

						client.on("telnyx.error", (error: any) => {
							console.error("❌ WebRTC: Reconnection error:", error);
							scheduleReconnect();
						});

						client.on("telnyx.socket.error", () => {
							if (shouldReconnectRef.current) {
								scheduleReconnect();
							}
						});

						client.on("telnyx.socket.close", () => {
							setIsConnected(false);
							if (shouldReconnectRef.current) {
								scheduleReconnect();
							}
						});

						clientRef.current = client;
						await client.connect();
					}
				} catch (error) {
					console.error("❌ WebRTC: Reconnection attempt failed:", error);
					// Will be retried by the socket close handler
				}
			}, delay);

			return nextAttempt;
		});
	}, [calculateReconnectDelay]);

	/**
	 * Manual reconnect function
	 */
	const reconnect = useCallback(async () => {
		console.log("🔄 WebRTC: Manual reconnection requested");
		setReconnectAttempts(0);
		shouldReconnectRef.current = true;

		// Clear existing client
		if (clientRef.current) {
			try {
				clientRef.current.disconnect();
			} catch {
				// Ignore disconnect errors
			}
			clientRef.current = null;
		}

		// Clear any pending reconnect timeout
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
			reconnectTimeoutRef.current = null;
		}

		setIsReconnecting(false);

		// Use the normal connect flow
		const currentOptions = optionsRef.current;
		if (currentOptions.username && currentOptions.password) {
			setIsConnecting(true);
			setConnectionError(null);

			try {
				const client = initializeClient();
				if (client) {
					await client.connect();
				}
			} catch (error) {
				console.error("❌ WebRTC: Manual reconnection failed:", error);
				setConnectionError(
					error instanceof Error ? error.message : "Reconnection failed"
				);
				setIsConnecting(false);
			}
		}
	}, []);

	/**
	 * Initialize WebRTC client
	 * Uses ref to avoid circular dependencies
	 */
	const initializeClient = useCallback(() => {
		if (clientRef.current) {
			console.log("🔧 WebRTC: Reusing existing client instance");
			return clientRef.current;
		}

		const currentOptions = optionsRef.current;
		const hasCredentials =
			Boolean(currentOptions.username) && Boolean(currentOptions.password);

		console.log("🔧 WebRTC: Initializing client with credentials:", {
			hasUsername: Boolean(currentOptions.username),
			hasPassword: Boolean(currentOptions.password),
			username: currentOptions.username,
			debug: currentOptions.debug,
		});

		if (!hasCredentials) {
			console.error("❌ WebRTC: Missing credentials, cannot initialize");
			// Don't initialize if credentials are missing
			return null;
		}

		console.log("🔧 WebRTC: Creating new TelnyxRTC instance...");
		const client = new TelnyxRTC({
			login: currentOptions.username,
			password: currentOptions.password,
			ringtoneFile: undefined, // Use browser default
			ringbackFile: undefined,
			debug: currentOptions.debug,
		});
		console.log(
			"🔧 WebRTC: TelnyxRTC instance created, SDK version:",
			(client as any).version || "unknown",
		);

		// Handle ready event
		client.on("telnyx.ready", () => {
			console.log("🎉 WebRTC: telnyx.ready event - Connection successful!");
			setIsConnected(true);
			setIsConnecting(false);
			setIsReconnecting(false);
			setConnectionError(null);
			setReconnectAttempts(0); // Reset on successful connection
		});

		// Handle error event
		client.on("telnyx.error", (error: any) => {
			console.error("❌ WebRTC: telnyx.error event:", error);
			const errorMessage =
				error?.error?.message ||
				error?.message ||
				error?.description ||
				"Connection error";
			console.error("❌ WebRTC: Error message:", errorMessage);
			setConnectionError(errorMessage);
			setIsConnecting(false);
		});

		// Handle socket error - trigger reconnection
		client.on("telnyx.socket.error", (socketError: any) => {
			console.error("❌ WebRTC: telnyx.socket.error event:", socketError);
			setConnectionError("Socket connection failed");
			setIsConnecting(false);
			setIsConnected(false);

			// Trigger auto-reconnection
			if (shouldReconnectRef.current) {
				scheduleReconnect();
			}
		});

		// Handle socket close - trigger reconnection
		client.on("telnyx.socket.close", (closeEvent: any) => {
			console.warn("⚠️ WebRTC: telnyx.socket.close event:", closeEvent);
			setIsConnected(false);

			// Trigger auto-reconnection (unless manually disconnected)
			if (shouldReconnectRef.current) {
				scheduleReconnect();
			}
		});

		// Handle incoming call
		client.on("telnyx.notification", (notification: INotification) => {
			if (notification.type !== "callUpdate") {
				return;
			}

			const call = notification.call as Call | undefined;

			if (!call) {
				// Guard against undefined call object
				return;
			}

			// Update call state
			const callState = mapTelnyxCallState(call.state);
			const callInfo: WebRTCCall = {
				id: call.id || "unknown",
				state: callState,
				direction: call.direction === "inbound" ? "inbound" : "outbound",
				remoteNumber:
					(call as any).remoteNumber || (call as any).to || "Unknown",
				remoteName: (call as any).remoteName,
				localNumber: ((call as any).localNumber as string) || "",
				startTime: callState === "active" ? new Date() : undefined,
				duration: 0,
				isMuted: false,
				isHeld: call.state === "held",
				isRecording: false,
			};

			setCurrentCall(callInfo);
			activeCallRef.current = call;

			// Notify parent component
			if (call.direction === "inbound" && call.state === "ringing") {
				optionsRef.current.onIncomingCall?.(callInfo);
			}

			// Handle call ended
			if (call.state === "destroy" || call.state === "hangup") {
				optionsRef.current.onCallEnded?.(callInfo);
				setCurrentCall(null);
				activeCallRef.current = null;
			}
		});

		clientRef.current = client;
		return client;
	}, []); // ✅ No dependencies - uses ref

	/**
	 * Connect to Telnyx
	 */
	const connect = useCallback(async () => {
		try {
			console.log("🔌 WebRTC: Starting connection...");
			setIsConnecting(true);
			setConnectionError(null);

			const client = initializeClient();

			// If client is null (no credentials), silently fail
			if (!client) {
				console.warn("⚠️ WebRTC: No credentials available, aborting connection");
				setIsConnecting(false);
				return;
			}

			console.log("🔌 WebRTC: Client initialized, calling connect()...");
			await client.connect();
			console.log("🔌 WebRTC: client.connect() completed");
		} catch (error) {
			console.error("❌ WebRTC: Connection error in connect():", error);
			setConnectionError(
				error instanceof Error ? error.message : "Connection failed",
			);
			setIsConnecting(false);
		}
	}, [initializeClient]);

	/**
	 * Disconnect from Telnyx
	 */
	const disconnect = useCallback(() => {
		// Disable auto-reconnection
		shouldReconnectRef.current = false;

		// Clear any pending reconnect timeout
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
			reconnectTimeoutRef.current = null;
		}

		if (clientRef.current) {
			clientRef.current.disconnect();
			clientRef.current = null;
		}
		setIsConnected(false);
		setIsConnecting(false);
		setIsReconnecting(false);
		setReconnectAttempts(0);
		setCurrentCall(null);
		activeCallRef.current = null;
	}, []);

	/**
	 * Make an outbound call
	 */
	const makeCall = useCallback(
		async (destination: string, callerIdNumber?: string) => {
			if (!(clientRef.current && isConnected)) {
				throw new Error("Not connected to Telnyx");
			}
			const call = await clientRef.current.newCall({
				destinationNumber: destination,
				callerNumber: callerIdNumber,
			});

			activeCallRef.current = call;

			// Set initial call state immediately
			const callInfo: WebRTCCall = {
				id: call.id,
				state: "connecting",
				direction: "outbound",
				remoteNumber: destination,
				localNumber: callerIdNumber || "",
				duration: 0,
				isMuted: false,
				isHeld: false,
				isRecording: false,
			};
			setCurrentCall(callInfo);

			return call;
		},
		[isConnected],
	);

	/**
	 * Answer incoming call
	 */
	const answerCall = useCallback(async () => {
		if (!activeCallRef.current) {
			throw new Error("No active call to answer");
		}
		await activeCallRef.current.answer();
	}, []);

	/**
	 * End active call
	 */
	const endCall = useCallback(async () => {
		if (!activeCallRef.current) {
			throw new Error("No active call to end");
		}
		await activeCallRef.current.hangup();
		setCurrentCall(null);
		activeCallRef.current = null;
	}, []);

	/**
	 * Mute call
	 */
	const muteCall = useCallback(async () => {
		if (!activeCallRef.current) {
			throw new Error("No active call to mute");
		}
		await activeCallRef.current.muteAudio();
		setCurrentCall((prev) => (prev ? { ...prev, isMuted: true } : null));
	}, []);

	/**
	 * Unmute call
	 */
	const unmuteCall = useCallback(async () => {
		if (!activeCallRef.current) {
			throw new Error("No active call to unmute");
		}
		await activeCallRef.current.unmuteAudio();
		setCurrentCall((prev) => (prev ? { ...prev, isMuted: false } : null));
	}, []);

	/**
	 * Hold call
	 */
	const holdCall = useCallback(async () => {
		if (!activeCallRef.current) {
			throw new Error("No active call to hold");
		}
		await activeCallRef.current.hold();
		setCurrentCall((prev) => (prev ? { ...prev, isHeld: true } : null));
	}, []);

	/**
	 * Unhold call
	 */
	const unholdCall = useCallback(async () => {
		if (!activeCallRef.current) {
			throw new Error("No active call to unhold");
		}
		await activeCallRef.current.unhold();
		setCurrentCall((prev) => (prev ? { ...prev, isHeld: false } : null));
	}, []);

	/**
	 * Send DTMF tone
	 */
	const sendDTMF = useCallback(async (digit: string) => {
		if (!activeCallRef.current) {
			throw new Error("No active call");
		}
		await activeCallRef.current.dtmf(digit);
	}, []);

	/**
	 * Set audio output device
	 */
	const setAudioDevice = useCallback(async (deviceId: string) => {
		if (!activeCallRef.current) {
			throw new Error("No active call");
		}
		await activeCallRef.current.setAudioOutDevice(deviceId);
	}, []);

	/**
	 * Load audio devices
	 */
	const loadAudioDevices = useCallback(async () => {
		// Check if MediaDevices API is available
		if (
			typeof navigator === "undefined" ||
			!navigator.mediaDevices ||
			!navigator.mediaDevices.enumerateDevices
		) {
			return;
		}

		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const audioOutputDevices = devices.filter(
				(d) => d.kind === "audiooutput",
			);
			setAudioDevices(audioOutputDevices);
		} catch {
			// Ignore audio device loading errors
		}
	}, []);

	/**
	 * Auto-connect on mount if enabled
	 * Uses ref pattern to prevent infinite loop from dependency chain
	 */
	useEffect(() => {
		// Check if MediaDevices API is available
		if (
			typeof navigator === "undefined" ||
			!navigator.mediaDevices ||
			!navigator.mediaDevices.enumerateDevices
		) {
			return () => {
				// No-op cleanup when MediaDevices API is not available
			};
		}

		// Load audio devices on mount
		loadAudioDevices();

		// Listen for device changes
		const deviceChangeHandler = () => {
			loadAudioDevices();
		};
		navigator.mediaDevices.addEventListener(
			"devicechange",
			deviceChangeHandler,
		);

		return () => {
			if (navigator.mediaDevices) {
				navigator.mediaDevices.removeEventListener(
					"devicechange",
					deviceChangeHandler,
				);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		// Load audio devices on mount
		loadAudioDevices,
	]); // ✅ Runs once on mount only - loadAudioDevices is stable (useCallback with no deps)

	/**
	 * Separate effect for auto-connect to prevent dependency loop
	 */
	useEffect(() => {
		if (optionsRef.current.autoConnect) {
			connect();
		}

		return () => {
			// Cleanup on unmount
			disconnect();
		};
	}, [
		connect, // Cleanup on unmount
		disconnect,
	]); // ✅ Runs once - uses ref for options

	return {
		// Connection state
		isConnected,
		isConnecting,
		isReconnecting,
		connectionError,
		reconnectAttempts,

		// Current call
		currentCall,

		// Call actions
		makeCall,
		answerCall,
		endCall,
		muteCall,
		unmuteCall,
		holdCall,
		unholdCall,
		sendDTMF,

		// Connection actions
		connect,
		disconnect,
		reconnect,

		// Audio devices
		audioDevices,
		setAudioDevice,
	};
}

/**
 * Map Telnyx call state to our call state
 */
function mapTelnyxCallState(telnyxState: string): CallState {
	switch (telnyxState) {
		case "new":
		case "requesting":
			return "connecting";
		case "trying":
		case "recovering":
		case "ringing":
			return "ringing";
		case "active":
			return "active";
		case "held":
			return "held";
		case "hangup":
		case "destroy":
			return "ended";
		default:
			return "idle";
	}
}

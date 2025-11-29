/**
 * Twilio Voice SDK Hook
 *
 * Provides WebRTC calling functionality using the Twilio Voice SDK.
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
export type UseTwilioVoiceOptions = {
	accessToken: string;
	autoConnect?: boolean;
	debug?: boolean;
	onIncomingCall?: (call: WebRTCCall) => void;
	onCallEnded?: (call: WebRTCCall) => void;
};

/**
 * Hook return type
 */
export type UseTwilioVoiceReturn = {
	// Connection state
	isConnected: boolean;
	isConnecting: boolean;
	isReconnecting: boolean;
	connectionError: string | null;
	reconnectAttempts: number;

	// Current call
	currentCall: WebRTCCall | null;

	// Call actions
	makeCall: (destination: string, callerIdNumber?: string) => Promise<any>;
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
 * Twilio Voice SDK Hook
 *
 * Manages WebRTC connection and call state using Twilio Voice SDK
 */
export function useTwilioVoice(
	options: UseTwilioVoiceOptions,
): UseTwilioVoiceReturn {
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
	const deviceRef = useRef<any>(null);
	const activeCallRef = useRef<any>(null);
	const optionsRef = useRef(options);
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const shouldReconnectRef = useRef(true);

	// Keep options ref up to date
	useEffect(() => {
		optionsRef.current = options;
	}, [options]);

	// Debug logger that only logs when debug mode is enabled
	const debugLog = useCallback(
		(message: string, ...args: unknown[]) => {
			if (optionsRef.current.debug) {
				console.log(`[Twilio] ${message}`, ...args);
			}
		},
		[],
	);

	const debugError = useCallback(
		(message: string, ...args: unknown[]) => {
			// Errors always log, but without emoji in production
			console.error(`[Twilio] ${message}`, ...args);
		},
		[],
	);

	const debugWarn = useCallback(
		(message: string, ...args: unknown[]) => {
			if (optionsRef.current.debug) {
				console.warn(`[Twilio] ${message}`, ...args);
			}
		},
		[],
	);

	/**
	 * Calculate reconnection delay with exponential backoff and jitter
	 */
	const calculateReconnectDelay = useCallback((attempt: number): number => {
		// Exponential backoff: baseDelay * 2^attempt
		const exponentialDelay = RECONNECT_CONFIG.baseDelayMs * 2 ** attempt;

		// Cap at maxDelay
		const cappedDelay = Math.min(exponentialDelay, RECONNECT_CONFIG.maxDelayMs);

		// Add jitter to prevent thundering herd
		const jitter = cappedDelay * RECONNECT_CONFIG.jitterFactor * Math.random();

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
				debugError(`Max reconnection attempts (${RECONNECT_CONFIG.maxAttempts}) reached`);
				setIsReconnecting(false);
				setConnectionError(
					`Connection lost. Max reconnection attempts (${RECONNECT_CONFIG.maxAttempts}) exceeded.`,
				);
				return prev;
			}

			const delay = calculateReconnectDelay(nextAttempt - 1);
			debugLog(`Scheduling reconnection attempt ${nextAttempt}/${RECONNECT_CONFIG.maxAttempts} in ${delay}ms`);

			setIsReconnecting(true);

			reconnectTimeoutRef.current = setTimeout(async () => {
				debugLog(`Attempting reconnection ${nextAttempt}/${RECONNECT_CONFIG.maxAttempts}`);

				// Clear the old device before reconnecting
				if (deviceRef.current) {
					try {
						deviceRef.current.destroy();
					} catch {
						// Ignore destroy errors
					}
					deviceRef.current = null;
				}

				// Attempt to reconnect
				try {
					const currentOptions = optionsRef.current;
					if (currentOptions.accessToken) {
						// Dynamic import to avoid SSR issues
						const { Device } = await import("@twilio/voice-sdk");

						// Create new device and register
						const device = new Device(currentOptions.accessToken, {
							logLevel: currentOptions.debug ? 1 : 0,
							codecPreferences: ["opus", "pcmu"] as any,
						});

						// Re-setup event handlers
						device.on("registered", () => {
							debugLog("Reconnection successful");
							setIsConnected(true);
							setIsConnecting(false);
							setIsReconnecting(false);
							setConnectionError(null);
							setReconnectAttempts(0);
						});

						device.on("error", (error: any) => {
							debugError("Reconnection error:", error);
							scheduleReconnect();
						});

						device.on("unregistered", () => {
							setIsConnected(false);
							if (shouldReconnectRef.current) {
								scheduleReconnect();
							}
						});

						deviceRef.current = device;
						await device.register();
					}
				} catch (error) {
					debugError("Reconnection attempt failed:", error);
					// Will be retried by the unregistered handler
				}
			}, delay);

			return nextAttempt;
		});
	}, [calculateReconnectDelay]);

	/**
	 * Manual reconnect function
	 */
	const reconnect = useCallback(async () => {
		debugLog("Manual reconnection requested");
		setReconnectAttempts(0);
		shouldReconnectRef.current = true;

		// Clear existing device
		if (deviceRef.current) {
			try {
				deviceRef.current.destroy();
			} catch {
				// Ignore destroy errors
			}
			deviceRef.current = null;
		}

		// Clear any pending reconnect timeout
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
			reconnectTimeoutRef.current = null;
		}

		setIsReconnecting(false);

		// Use the normal connect flow
		const currentOptions = optionsRef.current;
		if (currentOptions.accessToken) {
			setIsConnecting(true);
			setConnectionError(null);

			try {
				const device = await initializeDevice();
				if (device) {
					await device.register();
				}
			} catch (error) {
				debugError("Manual reconnection failed:", error);
				setConnectionError(
					error instanceof Error ? error.message : "Reconnection failed",
				);
				setIsConnecting(false);
			}
		}
	}, []);

	/**
	 * Initialize Twilio Device
	 * Uses ref to avoid circular dependencies
	 */
	const initializeDevice = useCallback(async () => {
		if (deviceRef.current) {
			debugLog("Reusing existing device instance");
			return deviceRef.current;
		}

		const currentOptions = optionsRef.current;
		const hasToken = Boolean(currentOptions.accessToken);

		debugLog("Initializing device with token:", { hasToken, debug: currentOptions.debug });

		if (!hasToken) {
			debugError("Missing access token, cannot initialize");
			return null;
		}

		try {
			// Dynamic import to avoid SSR issues
			const { Device } = await import("@twilio/voice-sdk");

			debugLog("Creating new Device instance...");
			const device = new Device(currentOptions.accessToken, {
				logLevel: currentOptions.debug ? 1 : 0,
				codecPreferences: ["opus", "pcmu"] as any,
			});

			// Handle registered event (connection successful)
			device.on("registered", () => {
				debugLog("Registered - Connection successful");
				setIsConnected(true);
				setIsConnecting(false);
				setIsReconnecting(false);
				setConnectionError(null);
				setReconnectAttempts(0);
			});

			// Handle error event
			device.on("error", (error: any) => {
				debugError("Device error:", error);
				const errorMessage =
					error?.message || error?.description || "Connection error";
				setConnectionError(errorMessage);
				setIsConnecting(false);
			});

			// Handle unregistered event - trigger reconnection
			device.on("unregistered", () => {
				debugWarn("Unregistered event");
				setIsConnected(false);

				// Trigger auto-reconnection (unless manually disconnected)
				if (shouldReconnectRef.current) {
					scheduleReconnect();
				}
			});

			// Handle incoming call
			device.on("incoming", (call: any) => {
				debugLog("Incoming call notification");

				if (!call) {
					debugWarn("Incoming notification with undefined call");
					return;
				}

				// Update call state
				const callInfo: WebRTCCall = {
					id: call.parameters?.CallSid || "unknown",
					state: "ringing",
					direction: "inbound",
					remoteNumber: call.parameters?.From || "Unknown",
					localNumber: call.parameters?.To || "",
					startTime: undefined,
					duration: 0,
					isMuted: false,
					isHeld: false,
					isRecording: false,
				};

				setCurrentCall(callInfo);
				activeCallRef.current = call;

				// Setup call event handlers
				setupCallEventHandlers(call);

				// Notify parent component
				optionsRef.current.onIncomingCall?.(callInfo);
			});

			deviceRef.current = device;
			return device;
		} catch (error) {
			debugError("Failed to initialize device:", error);
			return null;
		}
	}, [scheduleReconnect]);

	/**
	 * Setup event handlers for a call
	 */
	const setupCallEventHandlers = useCallback((call: any) => {
		call.on("accept", () => {
			debugLog("Call accepted");
			setCurrentCall((prev) =>
				prev
					? {
							...prev,
							state: "active",
							startTime: new Date(),
						}
					: null,
			);
		});

		call.on("disconnect", () => {
			debugLog("Call disconnected");
			const callInfo = currentCall;
			if (callInfo) {
				optionsRef.current.onCallEnded?.({ ...callInfo, state: "ended" });
			}
			setCurrentCall(null);
			activeCallRef.current = null;
		});

		call.on("cancel", () => {
			debugLog("Call cancelled");
			setCurrentCall(null);
			activeCallRef.current = null;
		});

		call.on("reject", () => {
			debugLog("Call rejected");
			setCurrentCall(null);
			activeCallRef.current = null;
		});

		call.on("error", (error: any) => {
			debugError("Call error:", error);
		});
	}, [currentCall]);

	/**
	 * Connect to Twilio
	 */
	const connect = useCallback(async () => {
		try {
			debugLog("Starting connection...");
			const device = await initializeDevice();

			// If device is null (no token), silently fail
			if (!device) {
				debugWarn("No access token available, aborting connection");
				return;
			}

			// Don't try to register if we are already registered or in the process of registering
			if (device.state !== "unregistered") {
				debugLog(`Skipping registration, device state is: ${device.state}`);
				if (device.state === "registered") {
					setIsConnected(true);
					setIsConnecting(false);
				}
				return;
			}

			setIsConnecting(true);
			setConnectionError(null);

			debugLog("Device initialized, calling register()...");
			await device.register();
			debugLog("device.register() completed");
		} catch (error) {
			debugError("Connection error in connect():", error);
			setConnectionError(
				error instanceof Error ? error.message : "Connection failed",
			);
			setIsConnecting(false);
		}
	}, [initializeDevice]);

	/**
	 * Disconnect from Twilio
	 */
	const disconnect = useCallback(() => {
		// Disable auto-reconnection
		shouldReconnectRef.current = false;

		// Clear any pending reconnect timeout
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
			reconnectTimeoutRef.current = null;
		}

		if (deviceRef.current) {
			deviceRef.current.destroy();
			deviceRef.current = null;
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
			// Normalize phone numbers to E.164 format
			const normalizeToE164 = (phone: string): string => {
				const digits = phone.replace(/\D/g, "");
				if (digits.length === 10) {
					return `+1${digits}`;
				}
				if (digits.length === 11 && digits.startsWith("1")) {
					return `+${digits}`;
				}
				if (digits.length > 10 && !phone.startsWith("+")) {
					return `+${digits}`;
				}
				return phone.startsWith("+") ? phone : `+${digits}`;
			};

			const normalizedDestination = normalizeToE164(destination);
			const normalizedCallerId = callerIdNumber
				? normalizeToE164(callerIdNumber)
				: undefined;

			debugLog("makeCall:", {
				destination,
				normalizedDestination,
				callerIdNumber,
				normalizedCallerId,
				isConnected,
				hasDevice: !!deviceRef.current,
			});

			if (!(deviceRef.current && isConnected)) {
				debugError("makeCall: Not connected to Twilio");
				throw new Error("Not connected to Twilio");
			}

			try {
				debugLog("Calling connect()...");
				const call = await deviceRef.current.connect({
					params: {
						To: normalizedDestination,
						From: normalizedCallerId,
					},
				});

				debugLog("connect() returned:", { callSid: call?.parameters?.CallSid });

				activeCallRef.current = call;

				// Set initial call state immediately
				const callInfo: WebRTCCall = {
					id: call.parameters?.CallSid || "unknown",
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

				// Setup call event handlers
				setupCallEventHandlers(call);

				return call;
			} catch (error) {
				debugError("makeCall error:", error);
				throw error;
			}
		},
		[isConnected, setupCallEventHandlers],
	);

	/**
	 * Answer incoming call
	 */
	const answerCall = useCallback(async () => {
		if (!activeCallRef.current) {
			throw new Error("No active call to answer");
		}
		await activeCallRef.current.accept();
	}, []);

	/**
	 * End active call
	 */
	const endCall = useCallback(async () => {
		if (!activeCallRef.current) {
			throw new Error("No active call to end");
		}
		await activeCallRef.current.disconnect();
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
		activeCallRef.current.mute(true);
		setCurrentCall((prev) => (prev ? { ...prev, isMuted: true } : null));
	}, []);

	/**
	 * Unmute call
	 */
	const unmuteCall = useCallback(async () => {
		if (!activeCallRef.current) {
			throw new Error("No active call to unmute");
		}
		activeCallRef.current.mute(false);
		setCurrentCall((prev) => (prev ? { ...prev, isMuted: false } : null));
	}, []);

	/**
	 * Hold call (note: Twilio Client SDK doesn't have native hold support)
	 * This would need to be implemented via server-side call control
	 */
	const holdCall = useCallback(async () => {
		if (!activeCallRef.current) {
			throw new Error("No active call to hold");
		}
		// Twilio Voice SDK doesn't have native hold - mute as workaround
		activeCallRef.current.mute(true);
		setCurrentCall((prev) => (prev ? { ...prev, isHeld: true, isMuted: true } : null));
		debugWarn("Hold is simulated via mute - use server-side control for real hold");
	}, []);

	/**
	 * Unhold call
	 */
	const unholdCall = useCallback(async () => {
		if (!activeCallRef.current) {
			throw new Error("No active call to unhold");
		}
		activeCallRef.current.mute(false);
		setCurrentCall((prev) => (prev ? { ...prev, isHeld: false, isMuted: false } : null));
	}, []);

	/**
	 * Send DTMF tone
	 */
	const sendDTMF = useCallback(async (digit: string) => {
		if (!activeCallRef.current) {
			throw new Error("No active call");
		}
		activeCallRef.current.sendDigits(digit);
	}, []);

	/**
	 * Set audio output device
	 */
	const setAudioDevice = useCallback(async (deviceId: string) => {
		if (!deviceRef.current) {
			throw new Error("No device initialized");
		}
		// Twilio Device has audio device management
		await deviceRef.current.audio?.speakerDevices?.set(deviceId);
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
	}, [loadAudioDevices]);

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
	}, [connect, disconnect]);

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

// Re-export types for backwards compatibility
export type { CallState as TwilioCallState, CallDirection as TwilioCallDirection };

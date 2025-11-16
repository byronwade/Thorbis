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
 */

"use client";

import type { Call, INotification } from "@telnyx/webrtc";
import { TelnyxRTC } from "@telnyx/webrtc";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Call state types
 */
export type CallState = "idle" | "connecting" | "ringing" | "active" | "held" | "ended";

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
	connectionError: string | null;

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

	// Audio devices
	audioDevices: MediaDeviceInfo[];
	setAudioDevice: (deviceId: string) => Promise<void>;
};

/**
 * Telnyx WebRTC Hook
 *
 * Manages WebRTC connection and call state
 */
export function useTelnyxWebRTC(options: UseTelnyxWebRTCOptions): UseTelnyxWebRTCReturn {
	// Connection state
	const [isConnected, setIsConnected] = useState(false);
	const [isConnecting, setIsConnecting] = useState(false);
	const [connectionError, setConnectionError] = useState<string | null>(null);

	// Call state
	const [currentCall, setCurrentCall] = useState<WebRTCCall | null>(null);

	// Audio devices
	const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);

	// Refs
	const clientRef = useRef<TelnyxRTC | null>(null);
	const activeCallRef = useRef<Call | null>(null);
	const optionsRef = useRef(options);

	// Keep options ref up to date
	useEffect(() => {
		optionsRef.current = options;
	}, [options]);

	/**
	 * Initialize WebRTC client
	 * Uses ref to avoid circular dependencies
	 */
	const initializeClient = useCallback(() => {
		if (clientRef.current) {
			return clientRef.current;
		}

		const currentOptions = optionsRef.current;
		const hasCredentials = Boolean(currentOptions.username) && Boolean(currentOptions.password);

		if (!hasCredentials) {
			// Don't initialize if credentials are missing
			return null;
		}

		const client = new TelnyxRTC({
			login: currentOptions.username,
			password: currentOptions.password,
			ringtoneFile: undefined, // Use browser default
			ringbackFile: undefined,
			debug: currentOptions.debug,
		});

		// Handle ready event
		client.on("telnyx.ready", () => {
			setIsConnected(true);
			setIsConnecting(false);
			setConnectionError(null);
		});

		// Handle error event
		client.on("telnyx.error", (error: any) => {
			const errorMessage = error?.error?.message || error?.message || error?.description || "Connection error";
			setConnectionError(errorMessage);
			setIsConnecting(false);
		});

		// Handle socket error
		client.on("telnyx.socket.error", () => {
			setConnectionError("Socket connection failed");
			setIsConnecting(false);
			setIsConnected(false);
		});

		// Handle socket close
		client.on("telnyx.socket.close", () => {
			setIsConnected(false);
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
				remoteNumber: (call as any).remoteNumber || (call as any).to || "Unknown",
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
			setIsConnecting(true);
			setConnectionError(null);

			const client = initializeClient();

			// If client is null (no credentials), silently fail
			if (!client) {
				setIsConnecting(false);
				return;
			}

			await client.connect();
		} catch (error) {
    console.error("Error:", error);
			setConnectionError(error instanceof Error ? error.message : "Connection failed");
			setIsConnecting(false);
		}
	}, [initializeClient]);

	/**
	 * Disconnect from Telnyx
	 */
	const disconnect = useCallback(() => {
		if (clientRef.current) {
			clientRef.current.disconnect();
			clientRef.current = null;
		}
		setIsConnected(false);
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
		[isConnected]
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
		if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
			return;
		}

		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const audioOutputDevices = devices.filter((d) => d.kind === "audiooutput");
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
		if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
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
		navigator.mediaDevices.addEventListener("devicechange", deviceChangeHandler);

		return () => {
			if (navigator.mediaDevices) {
				navigator.mediaDevices.removeEventListener("devicechange", deviceChangeHandler);
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
		isConnected,
		isConnecting,
		connectionError,
		currentCall,
		makeCall,
		answerCall,
		endCall,
		muteCall,
		unmuteCall,
		holdCall,
		unholdCall,
		sendDTMF,
		connect,
		disconnect,
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

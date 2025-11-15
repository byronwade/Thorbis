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
export interface WebRTCCall {
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
}

/**
 * Hook options
 */
export interface UseTelnyxWebRTCOptions {
  username: string;
  password: string;
  autoConnect?: boolean;
  debug?: boolean;
  onIncomingCall?: (call: WebRTCCall) => void;
  onCallEnded?: (call: WebRTCCall) => void;
}

/**
 * Hook return type
 */
export interface UseTelnyxWebRTCReturn {
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
}

/**
 * Telnyx WebRTC Hook
 *
 * Manages WebRTC connection and call state
 */
export function useTelnyxWebRTC(
  options: UseTelnyxWebRTCOptions
): UseTelnyxWebRTCReturn {
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
    const client = new TelnyxRTC({
      login: currentOptions.username,
      password: currentOptions.password,
      ringtoneFile: undefined, // Use browser default
      ringbackFile: undefined,
      debug: currentOptions.debug,
    });

    // Handle ready event
    client.on("telnyx.ready", () => {
      console.log("[useTelnyxWebRTC] ✅ Telnyx WebRTC client ready!");
      setIsConnected(true);
      setIsConnecting(false);
      setConnectionError(null);
    });

    // Handle error event
    client.on("telnyx.error", (error: any) => {
      console.error("[useTelnyxWebRTC] ❌ Telnyx WebRTC error:", error);
      console.error("[useTelnyxWebRTC] ❌ Error details:", {
        message: error.message,
        error: error.error,
        code: error.code,
        full: JSON.stringify(error, null, 2),
      });
      
      const errorMessage = error.error?.message || error.message || "Connection error";
      setConnectionError(errorMessage);
      setIsConnecting(false);
    });

    // Handle socket error
    client.on("telnyx.socket.error", (error: any) => {
      console.error("[useTelnyxWebRTC] ❌ Telnyx socket error:", error);
      setConnectionError("Socket connection failed");
      setIsConnecting(false);
      setIsConnected(false);
    });

    // Handle socket close
    client.on("telnyx.socket.close", () => {
      console.log("[useTelnyxWebRTC] ⚠️ Telnyx socket closed");
      setIsConnected(false);
    });

    // Handle incoming call
    client.on("telnyx.notification", (notification: INotification) => {
      if (notification.type === "callUpdate") {
        const call = notification.call as Call & any;

        console.log("[useTelnyxWebRTC] 🔔 Call update:", {
          state: call.state,
          direction: call.direction,
          remoteNumber: call.remoteNumber,
          cause: call.cause,
          causeCode: call.causeCode,
        });

        // Update call state
        const callState = mapTelnyxCallState(call.state);
        const callInfo: WebRTCCall = {
          id: call.id,
          state: callState,
          direction: call.direction === "inbound" ? "inbound" : "outbound",
          remoteNumber: call.remoteNumber || "Unknown",
          remoteName: call.remoteName,
          localNumber: call.localNumber || "",
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
          console.error("[useTelnyxWebRTC] ❌ Call ended!", {
            state: call.state,
            cause: call.cause,
            causeCode: call.causeCode,
            remoteSDP: call.remoteSdp ? "present" : "missing",
            full: call,
          });
          
          optionsRef.current.onCallEnded?.(callInfo);
          setCurrentCall(null);
          activeCallRef.current = null;
        }
      }
    });

    clientRef.current = client;
    return client;
  }, []); // ✅ No dependencies - uses ref

  /**
   * Connect to Telnyx
   */
  const connect = useCallback(async () => {
    console.log("[useTelnyxWebRTC] Attempting to connect...", {
      username: optionsRef.current.username,
      hasPassword: Boolean(optionsRef.current.password),
    });
    
    try {
      setIsConnecting(true);
      setConnectionError(null);

      const client = initializeClient();
      console.log("[useTelnyxWebRTC] Client initialized, calling connect...");
      await client.connect();
      console.log("[useTelnyxWebRTC] Connect method called, waiting for ready event...");
    } catch (error) {
      console.error("[useTelnyxWebRTC] Failed to connect:", error);
      setConnectionError(
        error instanceof Error ? error.message : "Connection failed"
      );
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

      try {
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
      } catch (error) {
        console.error("Failed to make call:", error);
        throw error;
      }
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

    try {
      await activeCallRef.current.answer();
    } catch (error) {
      console.error("Failed to answer call:", error);
      throw error;
    }
  }, []);

  /**
   * End active call
   */
  const endCall = useCallback(async () => {
    if (!activeCallRef.current) {
      throw new Error("No active call to end");
    }

    try {
      await activeCallRef.current.hangup();
      setCurrentCall(null);
      activeCallRef.current = null;
    } catch (error) {
      console.error("Failed to end call:", error);
      throw error;
    }
  }, []);

  /**
   * Mute call
   */
  const muteCall = useCallback(async () => {
    if (!activeCallRef.current) {
      throw new Error("No active call to mute");
    }

    try {
      await activeCallRef.current.muteAudio();
      setCurrentCall((prev) => (prev ? { ...prev, isMuted: true } : null));
    } catch (error) {
      console.error("Failed to mute call:", error);
      throw error;
    }
  }, []);

  /**
   * Unmute call
   */
  const unmuteCall = useCallback(async () => {
    if (!activeCallRef.current) {
      throw new Error("No active call to unmute");
    }

    try {
      await activeCallRef.current.unmuteAudio();
      setCurrentCall((prev) => (prev ? { ...prev, isMuted: false } : null));
    } catch (error) {
      console.error("Failed to unmute call:", error);
      throw error;
    }
  }, []);

  /**
   * Hold call
   */
  const holdCall = useCallback(async () => {
    if (!activeCallRef.current) {
      throw new Error("No active call to hold");
    }

    try {
      await activeCallRef.current.hold();
      setCurrentCall((prev) => (prev ? { ...prev, isHeld: true } : null));
    } catch (error) {
      console.error("Failed to hold call:", error);
      throw error;
    }
  }, []);

  /**
   * Unhold call
   */
  const unholdCall = useCallback(async () => {
    if (!activeCallRef.current) {
      throw new Error("No active call to unhold");
    }

    try {
      await activeCallRef.current.unhold();
      setCurrentCall((prev) => (prev ? { ...prev, isHeld: false } : null));
    } catch (error) {
      console.error("Failed to unhold call:", error);
      throw error;
    }
  }, []);

  /**
   * Send DTMF tone
   */
  const sendDTMF = useCallback(async (digit: string) => {
    if (!activeCallRef.current) {
      throw new Error("No active call");
    }

    try {
      await activeCallRef.current.dtmf(digit);
    } catch (error) {
      console.error("Failed to send DTMF:", error);
      throw error;
    }
  }, []);

  /**
   * Set audio output device
   */
  const setAudioDevice = useCallback(async (deviceId: string) => {
    if (!activeCallRef.current) {
      throw new Error("No active call");
    }

    try {
      await activeCallRef.current.setAudioOutDevice(deviceId);
    } catch (error) {
      console.error("Failed to set audio device:", error);
      throw error;
    }
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
      console.warn("MediaDevices API not available");
      return;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioOutputDevices = devices.filter(
        (d) => d.kind === "audiooutput"
      );
      setAudioDevices(audioOutputDevices);
    } catch (error) {
      console.error("Failed to load audio devices:", error);
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
      deviceChangeHandler
    );

    return () => {
      if (navigator.mediaDevices) {
        navigator.mediaDevices.removeEventListener(
          "devicechange",
          deviceChangeHandler
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ Runs once on mount only - loadAudioDevices is stable (useCallback with no deps)

  /**
   * Separate effect for auto-connect to prevent dependency loop
   */
  useEffect(() => {
    console.log("[useTelnyxWebRTC] Mount effect, autoConnect:", optionsRef.current.autoConnect);
    
    if (optionsRef.current.autoConnect) {
      console.log("[useTelnyxWebRTC] Auto-connecting...");
      connect();
    } else {
      console.log("[useTelnyxWebRTC] Auto-connect disabled, waiting for manual connect");
    }

    return () => {
      // Cleanup on unmount
      console.log("[useTelnyxWebRTC] Unmounting, disconnecting...");
      disconnect();
    };
  }, []); // ✅ Runs once - uses ref for options

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

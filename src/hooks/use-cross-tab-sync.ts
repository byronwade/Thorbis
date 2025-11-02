/**
 * useCrossTabSync Hook
 *
 * Synchronizes call state and position across browser tabs
 *
 * Features:
 * - BroadcastChannel API for efficient cross-tab communication
 * - Fallback to localStorage events for older browsers
 * - Syncs call state (incoming, active, ended)
 * - Syncs call actions (answer, end, mute, hold, etc.)
 * - Syncs popover position and size changes
 * - Automatic cleanup on unmount
 *
 * Browser Support:
 * - BroadcastChannel: Chrome 54+, Firefox 38+, Safari 15.4+
 * - localStorage events: All browsers
 */

"use client";

import { useCallback, useEffect, useRef } from "react";
import { useUIStore } from "@/lib/store";
import { useCallPreferencesStore } from "@/lib/stores/call-preferences-store";

type CallSyncMessage = {
  type:
    | "CALL_INCOMING"
    | "CALL_ANSWERED"
    | "CALL_ENDED"
    | "CALL_ACTION"
    | "POSITION_UPDATE"
    | "SIZE_UPDATE";
  timestamp: number;
  data?: unknown;
};

type CallAction =
  | "mute"
  | "unmute"
  | "hold"
  | "unhold"
  | "record_start"
  | "record_stop";

const CHANNEL_NAME = "thorbis-call-sync";
const STORAGE_KEY = "thorbis-call-sync-fallback";

export function useCrossTabSync() {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const isProcessingSyncRef = useRef(false); // Prevent echo when processing sync messages

  // Get store actions
  const {
    call,
    answerCall,
    endCall,
    toggleMute,
    toggleHold,
    toggleRecording,
    setIncomingCall,
  } = useUIStore();
  const { position, popoverWidth, setPosition, setPopoverWidth } =
    useCallPreferencesStore();

  // Handle incoming sync messages
  const handleSyncMessage = useCallback(
    (message: CallSyncMessage) => {
      // Ignore old messages (more than 5 seconds old)
      if (Date.now() - message.timestamp > 5000) {
        return;
      }

      // Set flag to prevent broadcasting while processing sync
      isProcessingSyncRef.current = true;

      try {
        switch (message.type) {
          case "CALL_INCOMING": {
            const callData = message.data as {
              caller: { name?: string; number: string; avatar?: string };
            };
            if (call.status === "idle") {
              setIncomingCall({
                number: callData.caller.number,
                name: callData.caller.name || "Unknown",
                avatar: callData.caller.avatar,
              });
            }
            break;
          }

          case "CALL_ANSWERED": {
            if (call.status === "incoming") {
              answerCall();
            }
            break;
          }

          case "CALL_ENDED": {
            if (call.status !== "idle" && call.status !== "ended") {
              endCall();
            }
            break;
          }

          case "CALL_ACTION": {
            const action = message.data as CallAction;
            switch (action) {
              case "mute":
                if (!call.isMuted) toggleMute();
                break;
              case "unmute":
                if (call.isMuted) toggleMute();
                break;
              case "hold":
                if (!call.isOnHold) toggleHold();
                break;
              case "unhold":
                if (call.isOnHold) toggleHold();
                break;
              case "record_start":
                if (!call.isRecording) toggleRecording();
                break;
              case "record_stop":
                if (call.isRecording) toggleRecording();
                break;
            }
            break;
          }

          case "POSITION_UPDATE": {
            const newPosition = message.data as { x: number; y: number };
            if (
              position !== "default" &&
              (position.x !== newPosition.x || position.y !== newPosition.y)
            ) {
              setPosition(newPosition);
            }
            break;
          }

          case "SIZE_UPDATE": {
            const newWidth = message.data as number;
            if (popoverWidth !== newWidth) {
              setPopoverWidth(newWidth);
            }
            break;
          }
        }
      } finally {
        // Always reset the flag after processing
        isProcessingSyncRef.current = false;
      }
    },
    [
      call,
      answerCall,
      endCall,
      toggleMute,
      toggleHold,
      toggleRecording,
      setIncomingCall,
      position,
      popoverWidth,
      setPosition,
      setPopoverWidth,
    ]
  );

  // Setup localStorage fallback for older browsers
  const setupLocalStorageFallback = useCallback(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const message: CallSyncMessage = JSON.parse(e.newValue);
          handleSyncMessage(message);
        } catch (error) {
          console.error("Failed to parse sync message:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [handleSyncMessage]);

  // Initialize BroadcastChannel or fallback
  useEffect(() => {
    // Try BroadcastChannel (modern browsers)
    if (typeof BroadcastChannel !== "undefined") {
      try {
        channelRef.current = new BroadcastChannel(CHANNEL_NAME);

        channelRef.current.onmessage = (
          event: MessageEvent<CallSyncMessage>
        ) => {
          handleSyncMessage(event.data);
        };
      } catch (error) {
        console.warn(
          "BroadcastChannel not available, falling back to localStorage",
          error
        );
        setupLocalStorageFallback();
      }
    } else {
      setupLocalStorageFallback();
    }

    // Listen for localStorage changes to sync persisted preferences across tabs
    const handleStorageChange = (e: StorageEvent) => {
      // Zustand persist uses this key for call preferences
      if (e.key === "call-preferences-storage" && e.newValue) {
        try {
          const newState = JSON.parse(e.newValue);
          // Update position if changed
          if (
            newState.state?.position &&
            JSON.stringify(newState.state.position) !== JSON.stringify(position)
          ) {
            setPosition(newState.state.position);
          }
          // Update width if changed
          if (
            newState.state?.popoverWidth &&
            newState.state.popoverWidth !== popoverWidth
          ) {
            setPopoverWidth(newState.state.popoverWidth);
          }
        } catch (error) {
          console.error("Failed to sync preferences:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      if (channelRef.current) {
        channelRef.current.close();
      }
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [
    handleSyncMessage,
    setupLocalStorageFallback,
    position,
    popoverWidth,
    setPosition,
    setPopoverWidth,
  ]);

  // Broadcast a message to other tabs
  const broadcast = useCallback((message: CallSyncMessage) => {
    // Don't broadcast if we're currently processing a sync message (prevents infinite loops)
    if (isProcessingSyncRef.current) {
      return;
    }

    if (channelRef.current) {
      // Use BroadcastChannel (doesn't echo back to sender)
      channelRef.current.postMessage(message);
    } else {
      // Use localStorage fallback (will echo back, but we ignore it via timestamp check)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(message));
      // Clear immediately to allow same message to be sent again
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Public API for broadcasting events
  return {
    broadcastIncomingCall: useCallback(
      (caller: { name?: string; number: string; avatar?: string }) => {
        broadcast({
          type: "CALL_INCOMING",
          timestamp: Date.now(),
          data: { caller },
        });
      },
      [broadcast]
    ),

    broadcastCallAnswered: useCallback(() => {
      broadcast({
        type: "CALL_ANSWERED",
        timestamp: Date.now(),
      });
    }, [broadcast]),

    broadcastCallEnded: useCallback(() => {
      broadcast({
        type: "CALL_ENDED",
        timestamp: Date.now(),
      });
    }, [broadcast]),

    broadcastCallAction: useCallback(
      (action: CallAction) => {
        broadcast({
          type: "CALL_ACTION",
          timestamp: Date.now(),
          data: action,
        });
      },
      [broadcast]
    ),

    broadcastPositionUpdate: useCallback(
      (x: number, y: number) => {
        broadcast({
          type: "POSITION_UPDATE",
          timestamp: Date.now(),
          data: { x, y },
        });
      },
      [broadcast]
    ),

    broadcastSizeUpdate: useCallback(
      (width: number) => {
        broadcast({
          type: "SIZE_UPDATE",
          timestamp: Date.now(),
          data: width,
        });
      },
      [broadcast]
    ),
  };
}

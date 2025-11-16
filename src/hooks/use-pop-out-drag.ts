/**
 * usePopOutDrag Hook
 *
 * Manages pop-out window creation when call UI is dragged beyond window bounds
 *
 * Features:
 * - Detects when drag exceeds threshold (50px beyond edge)
 * - Shows visual indicator when in pop-out zone
 * - Creates pop-out window on release
 * - Manages pop-out state and communication
 * - Handles returning call to main window
 *
 * Works with useDraggablePosition hook for drag detection
 */

import { useCallback, useEffect, useRef, useState } from "react";

type PopOutState = {
  isPopOutZone: boolean; // User is dragging in pop-out zone
  isPopOutActive: boolean; // Call is currently popped out
  popOutWindow: Window | null; // Reference to pop-out window
};

type UsePopOutDragOptions = {
  callId: string;
  onPopOutCreated?: () => void;
  onPopOutClosed?: () => void;
};

export function usePopOutDrag(options: UsePopOutDragOptions) {
  const { callId, onPopOutCreated, onPopOutClosed } = options;

  const [state, setState] = useState<PopOutState>({
    isPopOutZone: false,
    isPopOutActive: false,
    popOutWindow: null,
  });

  const popOutWindowRef = useRef<Window | null>(null);
  const messageHandlerRef = useRef<((event: MessageEvent) => void) | null>(
    null
  );

  // Handle when user drags into/out of pop-out zone
  const handleBeyondBounds = useCallback((isBeyond: boolean) => {
    setState((prev) => ({
      ...prev,
      isPopOutZone: isBeyond && !prev.isPopOutActive,
    }));
  }, []);

  // Handle when pop-out window is closed
  const handlePopOutClosed = useCallback(() => {
    popOutWindowRef.current = null;

    setState((prev) => ({
      ...prev,
      isPopOutActive: false,
      popOutWindow: null,
    }));

    onPopOutClosed?.();
  }, [onPopOutClosed]);

  // Create call window in new tab
  const createPopOut = useCallback(() => {
    if (state.isPopOutActive || popOutWindowRef.current) {
      return;
    }

    // Open in new tab (much simpler and more reliable)
    const popOut = window.open(
      `/call-window?callId=${callId}`,
      "_blank",
      "noopener,noreferrer"
    );

    if (!popOut) {
      return;
    }

    popOutWindowRef.current = popOut;

    setState((prev) => ({
      ...prev,
      isPopOutActive: true,
      isPopOutZone: false,
      popOutWindow: popOut,
    }));

    // Wait for pop-out to load, then send call data
    const checkInterval = setInterval(() => {
      if (popOut.closed) {
        clearInterval(checkInterval);
        handlePopOutClosed();
        return;
      }

      try {
        // Send call state to pop-out window
        popOut.postMessage(
          {
            type: "CALL_STATE_INIT",
            callId,
            timestamp: Date.now(),
          },
          window.location.origin
        );

        // Successfully sent, stop checking
        clearInterval(checkInterval);
        onPopOutCreated?.();
      } catch (_error) {
        // Pop-out not ready yet, continue checking
      }
    }, 100);

    // Stop checking after 5 seconds
    setTimeout(() => clearInterval(checkInterval), 5000);

    // Monitor for pop-out window close
    const closeInterval = setInterval(() => {
      if (popOut.closed) {
        clearInterval(closeInterval);
        handlePopOutClosed();
      }
    }, 500);

    return () => {
      clearInterval(checkInterval);
      clearInterval(closeInterval);
    };
  }, [callId, state.isPopOutActive, onPopOutCreated, handlePopOutClosed]);

  // Close pop-out and return call to main window
  const returnToMain = useCallback(() => {
    if (popOutWindowRef.current && !popOutWindowRef.current.closed) {
      popOutWindowRef.current.close();
    }

    handlePopOutClosed();
  }, [handlePopOutClosed]);

  // Bring pop-out window to front
  const focusPopOut = useCallback(() => {
    if (popOutWindowRef.current && !popOutWindowRef.current.closed) {
      popOutWindowRef.current.focus();
    }
  }, []);

  // Handle messages from pop-out window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Verify origin
      if (event.origin !== window.location.origin) {
        return;
      }

      const { type, callId: messageCallId } = event.data;

      // Only handle messages for this call
      if (messageCallId !== callId) {
        return;
      }

      switch (type) {
        case "CALL_POP_OUT_READY":
          // Pop-out window is ready to receive data
          if (popOutWindowRef.current) {
            popOutWindowRef.current.postMessage(
              {
                type: "CALL_STATE_SYNC",
                callId,
                timestamp: Date.now(),
              },
              window.location.origin
            );
          }
          break;

        case "CALL_POP_OUT_CLOSED":
          // Pop-out requested to close
          handlePopOutClosed();
          break;

        case "CALL_ACTION":
          break;

        default:
          break;
      }
    };

    messageHandlerRef.current = handleMessage;
    window.addEventListener("message", handleMessage);

    return () => {
      if (messageHandlerRef.current) {
        window.removeEventListener("message", messageHandlerRef.current);
      }
    };
  }, [callId, handlePopOutClosed]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (popOutWindowRef.current && !popOutWindowRef.current.closed) {
        popOutWindowRef.current.close();
      }
    },
    []
  );

  return {
    // State
    isPopOutZone: state.isPopOutZone,
    isPopOutActive: state.isPopOutActive,
    popOutWindow: state.popOutWindow,

    // Actions
    handleBeyondBounds,
    createPopOut,
    returnToMain,
    focusPopOut,
  };
}

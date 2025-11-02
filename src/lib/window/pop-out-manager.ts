/**
 * Pop-Out Window Manager
 *
 * Centralized utilities for managing pop-out windows
 *
 * Features:
 * - Window lifecycle management (create, close, focus)
 * - Message passing between main and pop-out windows
 * - State synchronization
 * - Security verification
 *
 * Used by:
 * - use-pop-out-drag.ts hook
 * - incoming-call-notification.tsx
 * - call-window/page.tsx
 */

// Window configuration
export const POP_OUT_CONFIG = {
  width: 900,
  height: 800,
  features:
    "menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes",
} as const;

// Message types for window communication
export type PopOutMessage =
  | {
      type: "CALL_STATE_INIT";
      callId: string;
      timestamp: number;
    }
  | {
      type: "CALL_STATE_SYNC";
      callId: string;
      callData: {
        status: "ringing" | "active" | "ended";
        isMuted: boolean;
        isOnHold: boolean;
        isRecording: boolean;
        isVideoEnabled: boolean;
        duration: number;
        customerName: string;
        customerPhone: string;
      };
      timestamp: number;
    }
  | {
      type: "CALL_POP_OUT_READY";
      callId: string;
      timestamp: number;
    }
  | {
      type: "CALL_POP_OUT_CLOSED";
      callId: string;
      timestamp: number;
    }
  | {
      type: "CALL_ACTION";
      callId: string;
      action:
        | "mute"
        | "unmute"
        | "hold"
        | "unhold"
        | "record_start"
        | "record_stop"
        | "video_on"
        | "video_off"
        | "end";
      timestamp: number;
    }
  | {
      type: "TRANSCRIPT_ENTRY";
      callId: string;
      entry: {
        id: string;
        speaker: "csr" | "customer";
        text: string;
        timestamp: number;
      };
    }
  | {
      type: "AI_EXTRACTION_UPDATE";
      callId: string;
      extraction: {
        customerInfo?: {
          name?: string;
          email?: string;
          phone?: string;
          company?: string;
        };
        issueCategories?: string[];
        actionItems?: string[];
        sentiment?: "positive" | "neutral" | "negative";
        confidence?: number;
      };
    };

/**
 * Creates a pop-out window for a call
 */
export function createPopOutWindow(callId: string): Window | null {
  const { width, height, features } = POP_OUT_CONFIG;

  // Calculate center position
  const left = Math.max(0, window.screen.width / 2 - width / 2);
  const top = Math.max(0, window.screen.height / 2 - height / 2);

  const windowFeatures = `${features},width=${width},height=${height},left=${left},top=${top}`;

  try {
    const popOut = window.open(
      `/call-window?callId=${callId}`,
      `call-${callId}`,
      windowFeatures
    );

    if (!popOut) {
      console.error("Failed to open pop-out window. Popup may be blocked.");
      return null;
    }

    return popOut;
  } catch (error) {
    console.error("Error creating pop-out window:", error);
    return null;
  }
}

/**
 * Sends a message to a pop-out window with security verification
 */
export function sendToPopOut(
  popOutWindow: Window | null,
  message: PopOutMessage
): boolean {
  if (!popOutWindow || popOutWindow.closed) {
    console.warn("Cannot send message: pop-out window is closed");
    return false;
  }

  try {
    popOutWindow.postMessage(message, window.location.origin);
    return true;
  } catch (error) {
    console.error("Error sending message to pop-out:", error);
    return false;
  }
}

/**
 * Sends a message to the main window (called from pop-out)
 */
export function sendToMain(message: PopOutMessage): boolean {
  if (!window.opener || window.opener.closed) {
    console.warn("Cannot send message: main window is closed");
    return false;
  }

  try {
    window.opener.postMessage(message, window.location.origin);
    return true;
  } catch (error) {
    console.error("Error sending message to main window:", error);
    return false;
  }
}

/**
 * Verifies that a message event is from a trusted source
 */
export function verifyMessageOrigin(event: MessageEvent): boolean {
  return event.origin === window.location.origin;
}

/**
 * Checks if a message is a valid PopOutMessage
 */
export function isPopOutMessage(data: unknown): data is PopOutMessage {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const message = data as Record<string, unknown>;

  return (
    typeof message.type === "string" &&
    typeof message.callId === "string" &&
    [
      "CALL_STATE_INIT",
      "CALL_STATE_SYNC",
      "CALL_POP_OUT_READY",
      "CALL_POP_OUT_CLOSED",
      "CALL_ACTION",
      "TRANSCRIPT_ENTRY",
      "AI_EXTRACTION_UPDATE",
    ].includes(message.type)
  );
}

/**
 * Monitors a pop-out window and calls callback when it closes
 */
export function monitorPopOutWindow(
  popOutWindow: Window,
  onClose: () => void,
  intervalMs = 500
): () => void {
  const checkInterval = setInterval(() => {
    if (popOutWindow.closed) {
      clearInterval(checkInterval);
      onClose();
    }
  }, intervalMs);

  // Return cleanup function
  return () => clearInterval(checkInterval);
}

/**
 * Waits for pop-out window to be ready and sends initial data
 */
export function waitForPopOutReady(
  popOutWindow: Window,
  callId: string,
  onReady: () => void,
  timeoutMs = 5000
): () => void {
  const checkInterval = setInterval(() => {
    if (popOutWindow.closed) {
      clearInterval(checkInterval);
      return;
    }

    try {
      // Try to send ready check message
      sendToPopOut(popOutWindow, {
        type: "CALL_STATE_INIT",
        callId,
        timestamp: Date.now(),
      });

      // If successful, stop checking
      clearInterval(checkInterval);
      onReady();
    } catch (error) {
      // Pop-out not ready yet, continue checking
    }
  }, 100);

  // Stop checking after timeout
  const timeout = setTimeout(() => {
    clearInterval(checkInterval);
    console.warn(`Pop-out window ready timeout after ${timeoutMs}ms`);
  }, timeoutMs);

  // Return cleanup function
  return () => {
    clearInterval(checkInterval);
    clearTimeout(timeout);
  };
}

/**
 * Closes a pop-out window safely
 */
export function closePopOutWindow(popOutWindow: Window | null): void {
  if (popOutWindow && !popOutWindow.closed) {
    try {
      popOutWindow.close();
    } catch (error) {
      console.error("Error closing pop-out window:", error);
    }
  }
}

/**
 * Focuses a pop-out window (brings to front)
 */
export function focusPopOutWindow(popOutWindow: Window | null): void {
  if (popOutWindow && !popOutWindow.closed) {
    try {
      popOutWindow.focus();
    } catch (error) {
      console.error("Error focusing pop-out window:", error);
    }
  }
}

/**
 * Returns whether the current window is a pop-out (has an opener)
 */
export function isPopOutWindow(): boolean {
  return window.opener !== null && window.opener !== window;
}

/**
 * Gets the call ID from the pop-out window URL
 */
export function getCallIdFromUrl(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  return params.get("callId");
}

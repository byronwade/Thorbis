/**
 * useCallWindowSync Hook
 *
 * Synchronizes form data between main application and call window
 *
 * Features:
 * - Detects if call window is open
 * - Receives auto-fill data from call window
 * - Sends current form data to call window
 * - Handles merge conflicts
 *
 * Usage: Add to customer/new, job/new, appointment/new pages
 */

import { useCallback, useEffect, useState } from "react";
import {
  isPopOutMessage,
  type PopOutMessage,
  sendToPopOut,
  verifyMessageOrigin,
} from "@/lib/window/pop-out-manager";

type FormType = "customer" | "job" | "appointment";

export function useCallWindowSync(
  formType: FormType,
  currentFormData: Record<string, any>,
  onDataReceived: (data: Record<string, any>) => void
) {
  const [hasCallWindow, setHasCallWindow] = useState(false);
  const [callWindowId, setCallWindowId] = useState<string | null>(null);
  const [popOutWindow, _setPopOutWindow] = useState<Window | null>(null);
  const [pendingSync, setPendingSync] = useState<Record<string, any> | null>(
    null
  );
  const [showMergeDialog, setShowMergeDialog] = useState(false);

  /**
   * Send form data to call window
   */
  const sendFormDataToCallWindow = useCallback(
    (callId: string, data: Record<string, any>) => {
      sendToPopOut(popOutWindow, {
        type: "FORM_DATA_SYNC",
        callId,
        formType,
        formData: data,
        timestamp: Date.now(),
      });
    },
    [formType, popOutWindow]
  );

  // Detect if call window is open
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!verifyMessageOrigin(event)) {
        return;
      }
      if (!isPopOutMessage(event.data)) {
        return;
      }

      const message = event.data as PopOutMessage;

      switch (message.type) {
        case "CALL_POP_OUT_READY":
          setHasCallWindow(true);
          setCallWindowId(message.callId);
          // Send current form data to call window
          sendFormDataToCallWindow(message.callId, currentFormData);
          break;

        case "CALL_POP_OUT_CLOSED":
          setHasCallWindow(false);
          setCallWindowId(null);
          break;

        case "FORM_DATA_UPDATE":
          if (message.formType === formType) {
            // Check if we have conflicts
            const hasLocalData = Object.keys(currentFormData).length > 0;
            if (hasLocalData) {
              // Show merge dialog
              setPendingSync(message.formData);
              setShowMergeDialog(true);
            } else {
              // No conflicts, apply directly
              onDataReceived(message.formData);
            }
          }
          break;

        case "REQUEST_FORM_DATA":
          if (message.formType === formType && callWindowId) {
            sendFormDataToCallWindow(message.callId, currentFormData);
          }
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [
    formType,
    currentFormData,
    callWindowId,
    onDataReceived,
    sendFormDataToCallWindow,
  ]);

  /**
   * Use call window data (accept incoming data)
   */
  const useCallData = useCallback(() => {
    if (pendingSync) {
      onDataReceived(pendingSync);
      setPendingSync(null);
      setShowMergeDialog(false);
    }
  }, [pendingSync, onDataReceived]);

  /**
   * Use page data (keep current data)
   */
  const usePageData = useCallback(() => {
    if (callWindowId) {
      sendFormDataToCallWindow(callWindowId, currentFormData);
    }
    setPendingSync(null);
    setShowMergeDialog(false);
  }, [callWindowId, currentFormData, sendFormDataToCallWindow]);

  /**
   * Merge data (combine both)
   */
  const mergeData = useCallback(() => {
    if (pendingSync) {
      // Merge strategy: Call window data takes precedence for non-empty fields
      const merged = { ...currentFormData };
      Object.entries(pendingSync).forEach(([key, value]) => {
        if (value && value !== "") {
          merged[key] = value;
        }
      });
      onDataReceived(merged);
      setPendingSync(null);
      setShowMergeDialog(false);
    }
  }, [pendingSync, currentFormData, onDataReceived]);

  /**
   * Send current form data to call window
   */
  const syncToCallWindow = useCallback(() => {
    if (callWindowId) {
      sendFormDataToCallWindow(callWindowId, currentFormData);
    }
  }, [callWindowId, currentFormData, sendFormDataToCallWindow]);

  return {
    hasCallWindow,
    showMergeDialog,
    pendingSync,
    useCallData,
    usePageData,
    mergeData,
    syncToCallWindow,
  };
}

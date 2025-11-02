"use client";

/**
 * Call Window Page - Pop-out Window Route
 *
 * Dedicated page for popped-out call interface
 *
 * Features:
 * - Full-screen call UI in separate window
 * - Syncs with main window via postMessage
 * - Can control call (mute, hold, end, etc.)
 * - Shows transcript and AI auto-fill
 * - Returns to main window on close
 *
 * Performance optimizations:
 * - Client component (requires window APIs)
 * - Lightweight header for pop-out context
 * - Reuses existing call UI components
 * - Dynamic rendering (uses search params)
 */

// Force dynamic rendering since this page uses search params
export const dynamic = "force-dynamic";

import { ArrowLeft, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { AIAutofillPreview } from "@/components/communication/ai-autofill-preview";
import { TranscriptPanel } from "@/components/communication/transcript-panel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUIStore } from "@/lib/store";
import { useTranscriptStore } from "@/lib/stores/transcript-store";
import {
  getCallIdFromUrl,
  isPopOutMessage,
  type PopOutMessage,
  sendToMain,
  verifyMessageOrigin,
} from "@/lib/window/pop-out-manager";

function CallWindowContent() {
  const searchParams = useSearchParams();
  const callId = searchParams.get("callId") || getCallIdFromUrl();

  const { call, answerCall, endCall, toggleMute, toggleHold, toggleRecording } =
    useUIStore();
  const { entries, addEntry, clearTranscript } = useTranscriptStore();

  const [isReady, setIsReady] = useState(false);
  const [syncedData, setSyncedData] = useState<any>(null);

  // Send ready message to main window
  useEffect(() => {
    if (!callId) return;

    // Notify main window that pop-out is ready
    sendToMain({
      type: "CALL_POP_OUT_READY",
      callId,
      timestamp: Date.now(),
    });

    setIsReady(true);
  }, [callId]);

  // Handle messages from main window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify origin
      if (!verifyMessageOrigin(event)) {
        return;
      }

      // Verify message format
      if (!isPopOutMessage(event.data)) {
        return;
      }

      const message = event.data as PopOutMessage;

      // Only handle messages for this call
      if (message.callId !== callId) {
        return;
      }

      switch (message.type) {
        case "CALL_STATE_INIT":
          // Initial call state received
          console.log("Call state initialized:", message);
          break;

        case "CALL_STATE_SYNC":
          // Full state sync from main window
          setSyncedData(message.callData);
          break;

        case "TRANSCRIPT_ENTRY":
          // New transcript entry
          if ("entry" in message) {
            addEntry(message.entry);
          }
          break;

        case "AI_EXTRACTION_UPDATE":
          // AI extraction update
          console.log("AI extraction update:", message);
          break;

        default:
          break;
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, [callId, addEntry]);

  // Handle return to main window
  const handleReturnToMain = useCallback(() => {
    if (!callId) return;

    // Notify main window
    sendToMain({
      type: "CALL_POP_OUT_CLOSED",
      callId,
      timestamp: Date.now(),
    });

    // Close this window
    window.close();
  }, [callId]);

  // Handle call actions
  const handleCallAction = useCallback(
    (
      action:
        | "mute"
        | "unmute"
        | "hold"
        | "unhold"
        | "record_start"
        | "record_stop"
        | "end"
    ) => {
      if (!callId) return;

      // Execute action locally
      switch (action) {
        case "mute":
        case "unmute":
          toggleMute();
          break;
        case "hold":
        case "unhold":
          toggleHold();
          break;
        case "record_start":
        case "record_stop":
          toggleRecording();
          break;
        case "end":
          endCall();
          // Close pop-out after ending call
          setTimeout(() => window.close(), 500);
          break;
      }

      // Notify main window
      sendToMain({
        type: "CALL_ACTION",
        callId,
        action,
        timestamp: Date.now(),
      });
    },
    [callId, toggleMute, toggleHold, toggleRecording, endCall]
  );

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Show loading if not ready
  if (!(callId && isReady)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Pop-out header */}
      <div className="flex items-center justify-between border-border border-b bg-card px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <div className="h-3 w-3 animate-pulse rounded-full bg-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">Active Call</h1>
            <p className="text-muted-foreground text-sm">
              {call.caller?.name || "Unknown Caller"}
            </p>
          </div>
          {call.status === "active" && call.startTime && (
            <div className="ml-4 rounded-lg bg-primary/10 px-3 py-1 font-mono font-semibold text-primary text-sm">
              {formatDuration(Math.floor((Date.now() - call.startTime) / 1000))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleReturnToMain} size="sm" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Main
          </Button>
          <Button onClick={() => window.close()} size="icon" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Call content */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="grid h-full gap-6 lg:grid-cols-2">
          {/* Left column - Call controls and customer info */}
          <div className="space-y-6 overflow-y-auto">
            {/* Call controls */}
            <Card className="p-6">
              <h2 className="mb-4 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                Call Controls
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="h-12"
                  onClick={() =>
                    handleCallAction(call.isMuted ? "unmute" : "mute")
                  }
                  variant={call.isMuted ? "default" : "outline"}
                >
                  {call.isMuted ? "Unmute" : "Mute"}
                </Button>
                <Button
                  className="h-12"
                  onClick={() =>
                    handleCallAction(call.isOnHold ? "unhold" : "hold")
                  }
                  variant={call.isOnHold ? "default" : "outline"}
                >
                  {call.isOnHold ? "Resume" : "Hold"}
                </Button>
                <Button
                  className="col-span-2 h-12"
                  onClick={() =>
                    handleCallAction(
                      call.isRecording ? "record_stop" : "record_start"
                    )
                  }
                  variant={call.isRecording ? "destructive" : "outline"}
                >
                  {call.isRecording ? "Stop Recording" : "Record"}
                </Button>
              </div>
              <Button
                className="mt-4 h-12 w-full"
                onClick={() => handleCallAction("end")}
                variant="destructive"
              >
                End Call
              </Button>
            </Card>

            {/* Customer info */}
            <Card className="p-6">
              <h2 className="mb-4 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                Customer Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="font-medium text-muted-foreground text-xs">
                    Name
                  </label>
                  <p className="font-semibold text-sm">
                    {call.caller?.name || "Unknown"}
                  </p>
                </div>
                <div>
                  <label className="font-medium text-muted-foreground text-xs">
                    Phone
                  </label>
                  <p className="font-mono text-sm">
                    {call.caller?.number || "N/A"}
                  </p>
                </div>
              </div>
            </Card>

            {/* AI Auto-fill */}
            <AIAutofillPreview />
          </div>

          {/* Right column - Transcript */}
          <div className="overflow-hidden">
            <TranscriptPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CallWindowPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading call...</p>
          </div>
        </div>
      }
    >
      <CallWindowContent />
    </Suspense>
  );
}

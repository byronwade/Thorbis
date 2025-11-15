"use client";

/**
 * Call Window Page - Modern Redesign
 *
 * Beautiful, professional call interface optimized for CSRs
 *
 * Features:
 * - Modern gradient design with status indicators
 * - Large, accessible call control buttons
 * - Real-time transcript with smooth animations
 * - Customer information with avatar
 * - AI-powered suggestions and auto-fill
 * - Notes section for call context
 * - Live call timer with visual feedback
 * - Syncs with main window via postMessage
 *
 * Performance optimizations:
 * - Client component (requires window APIs)
 * - Efficient state management
 * - Smooth 60fps animations
 * - Dynamic rendering (uses search params)
 */

// Force dynamic rendering since this page uses search params
export const dynamic = "force-dynamic";

import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Pause,
  Play,
  Circle,
  Square,
  User,
  Clock,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Minimize2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { AIAutofillPreview } from "@/components/communication/ai-autofill-preview";
import { TranscriptPanel } from "@/components/communication/transcript-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useUIStore } from "@/lib/stores";
import { useTranscriptStore } from "@/lib/stores/transcript-store";
import {
  getCallIdFromUrl,
  isPopOutMessage,
  type PopOutMessage,
  sendToMain,
  verifyMessageOrigin,
} from "@/lib/window/pop-out-manager";
import { cn } from "@/lib/utils";

function CallWindowContent() {
  const searchParams = useSearchParams();
  const callId = searchParams?.get("callId") || getCallIdFromUrl();

  const { call, answerCall, endCall, toggleMute, toggleHold, toggleRecording } =
    useUIStore();
  const { entries, addEntry, clearTranscript } = useTranscriptStore();

  const [isReady, setIsReady] = useState(false);
  const [syncedData, setSyncedData] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [showAI, setShowAI] = useState(true);

  // Send ready message to main window
  useEffect(() => {
    if (!callId) return;

    sendToMain({
      type: "CALL_POP_OUT_READY",
      callId,
      timestamp: Date.now(),
    });

    setIsReady(true);
  }, [callId]);

  // Update call timer
  useEffect(() => {
    if (call.status !== "active" || !call.startTime) return;

    const interval = setInterval(() => {
      setCurrentTime(Math.floor((Date.now() - call.startTime!) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [call.status, call.startTime]);

  // Handle messages from main window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!verifyMessageOrigin(event)) return;
      if (!isPopOutMessage(event.data)) return;

      const message = event.data as PopOutMessage;
      if (message.callId !== callId) return;

      switch (message.type) {
        case "CALL_STATE_INIT":
          console.log("Call state initialized:", message);
          break;
        case "CALL_STATE_SYNC":
          setSyncedData(message.callData);
          break;
        case "TRANSCRIPT_ENTRY":
          if ("entry" in message) {
            addEntry(message.entry);
          }
          break;
        case "AI_EXTRACTION_UPDATE":
          console.log("AI extraction update:", message);
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [callId, addEntry]);

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
          setTimeout(() => window.close(), 500);
          break;
      }

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
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Get initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Show loading if not ready
  if (!(callId && isReady)) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center">
          <div className="relative mx-auto mb-6 h-20 w-20">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
            <Phone className="absolute inset-0 m-auto h-8 w-8 animate-pulse text-primary" />
          </div>
          <p className="font-medium text-lg text-foreground">Connecting call...</p>
          <p className="mt-2 text-muted-foreground text-sm">Please wait</p>
        </div>
      </div>
    );
  }

  const callStatus = call.status || "connecting";
  const isActive = callStatus === "active";

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Modern Header with Gradient */}
      <div className="relative overflow-hidden border-border border-b bg-gradient-to-r from-primary/10 via-primary/5 to-background shadow-lg backdrop-blur-sm">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Status & Customer Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full border-2 font-bold text-lg transition-all",
                  isActive 
                    ? "border-green-500/50 bg-gradient-to-br from-green-500/20 to-green-600/20 text-green-600 dark:text-green-400" 
                    : "border-primary/50 bg-gradient-to-br from-primary/20 to-primary/30 text-primary"
                )}>
                  <User className="h-6 w-6" />
                </div>
                {isActive && (
                  <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-foreground text-xl">
                    {call.caller?.name || "Unknown Caller"}
                  </h1>
                  <Badge 
                    variant={isActive ? "default" : "secondary"}
                    className={cn(
                      "font-medium text-xs",
                      isActive && "animate-pulse bg-green-500/20 text-green-600 dark:bg-green-500/30 dark:text-green-400"
                    )}
                  >
                    {isActive ? "Active" : callStatus}
                  </Badge>
                </div>
                <p className="font-mono text-muted-foreground text-sm">
                  {call.caller?.number || "No number"}
                </p>
              </div>
            </div>

            {/* Right: Timer & Close */}
            <div className="flex items-center gap-3">
              {isActive && (
                <div className="flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 shadow-sm backdrop-blur-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-mono font-semibold text-foreground text-lg tabular-nums">
                    {formatDuration(currentTime)}
                  </span>
                </div>
              )}
              <Button
                onClick={() => window.close()}
                size="icon"
                variant="ghost"
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Controls & Info */}
        <div className="w-96 space-y-4 overflow-y-auto border-border border-r bg-card/30 p-4 backdrop-blur-sm">
          {/* Call Controls */}
          <Card className="border-border/50 bg-card/50 shadow-sm backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                Call Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Primary Controls */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleCallAction(call.isMuted ? "unmute" : "mute")}
                  variant={call.isMuted ? "default" : "outline"}
                  className={cn(
                    "h-16 flex-col gap-1",
                    call.isMuted && "bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30 dark:text-yellow-400"
                  )}
                >
                  {call.isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  <span className="font-medium text-xs">{call.isMuted ? "Unmute" : "Mute"}</span>
                </Button>
                <Button
                  onClick={() => handleCallAction(call.isOnHold ? "unhold" : "hold")}
                  variant={call.isOnHold ? "default" : "outline"}
                  className={cn(
                    "h-16 flex-col gap-1",
                    call.isOnHold && "bg-orange-500/20 text-orange-600 hover:bg-orange-500/30 dark:text-orange-400"
                  )}
                >
                  {call.isOnHold ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                  <span className="font-medium text-xs">{call.isOnHold ? "Resume" : "Hold"}</span>
                </Button>
              </div>

              {/* Recording Control */}
              <Button
                onClick={() => handleCallAction(call.isRecording ? "record_stop" : "record_start")}
                variant={call.isRecording ? "default" : "outline"}
                className={cn(
                  "h-14 w-full gap-2",
                  call.isRecording && "animate-pulse bg-red-500/20 text-red-600 hover:bg-red-500/30 dark:text-red-400"
                )}
              >
                {call.isRecording ? <Square className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                <span className="font-medium">{call.isRecording ? "Stop Recording" : "Start Recording"}</span>
              </Button>

              {/* End Call */}
              <Button
                onClick={() => handleCallAction("end")}
                variant="destructive"
                className="h-14 w-full gap-2 font-semibold"
              >
                <PhoneOff className="h-5 w-5" />
                End Call
              </Button>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="border-border/50 bg-card/50 shadow-sm backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 font-bold text-primary">
                  {getInitials(call.caller?.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">
                    {call.caller?.name || "Unknown Customer"}
                  </p>
                  <p className="font-mono text-muted-foreground text-sm">
                    {call.caller?.number || "No phone number"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call Notes */}
          <Card className="border-border/50 bg-card/50 shadow-sm backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4" />
                Call Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes during the call..."
                className="min-h-[120px] resize-none"
              />
            </CardContent>
          </Card>

          {/* AI Suggestions - Collapsible */}
          <Card className="border-border/50 bg-card/50 shadow-sm backdrop-blur-sm">
            <CardHeader className="cursor-pointer pb-3" onClick={() => setShowAI(!showAI)}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  AI Suggestions
                </CardTitle>
                {showAI ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardHeader>
            {showAI && (
              <CardContent>
                <AIAutofillPreview />
              </CardContent>
            )}
          </Card>
        </div>

        {/* Right Main Area - Transcript */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
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
        <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
          <div className="text-center">
            <div className="relative mx-auto mb-6 h-20 w-20">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
              <Phone className="absolute inset-0 m-auto h-8 w-8 animate-pulse text-primary" />
            </div>
            <p className="font-medium text-lg text-foreground">Initializing call window...</p>
            <p className="mt-2 text-muted-foreground text-sm">Please wait</p>
          </div>
        </div>
      }
    >
      <CallWindowContent />
    </Suspense>
  );
}

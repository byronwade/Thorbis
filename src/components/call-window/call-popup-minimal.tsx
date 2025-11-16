"use client";

/**
 * Minimal Call Popup - Bottom Right Corner
 *
 * Appears for ALL calls (incoming and outgoing) with:
 * - Caller ID and customer info
 * - Core call controls (accept, end, mute, transfer, video)
 * - Expand button to open full customer intake in new tab
 *
 * Minimalistic design that doesn't interrupt workflow.
 */

import {
  ArrowRightLeft,
  Maximize2,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CustomerCallData } from "@/types/call-window";

type CallPopupMinimalProps = {
  // Call state
  callId: string;
  status: "incoming" | "active" | "ended";
  direction: "inbound" | "outbound";

  // Caller info
  callerName: string;
  callerNumber: string;
  customerData?: CustomerCallData | null;

  // Call controls state
  isMuted: boolean;
  isOnHold: boolean;
  videoStatus: "off" | "requesting" | "ringing" | "connected" | "declined";

  // Call duration
  duration?: string;

  // Actions
  onAnswer?: () => void;
  onEnd: () => void;
  onMuteToggle: () => void;
  onVideoToggle: () => void;
  onTransfer: () => void;
  onExpand: () => void; // Opens full customer intake in new tab
  onClose: () => void;
};

export function CallPopupMinimal({
  callId,
  status,
  direction,
  callerName,
  callerNumber,
  customerData,
  isMuted,
  isOnHold,
  videoStatus,
  duration,
  onAnswer,
  onEnd,
  onMuteToggle,
  onVideoToggle,
  onTransfer,
  onExpand,
  onClose,
}: CallPopupMinimalProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Animate in
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name || name === "Unknown Caller") {
      return "?";
    }
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case "incoming":
        return "bg-blue-500";
      case "active":
        return "bg-emerald-500";
      case "ended":
        return "bg-muted-foreground";
      default:
        return "bg-muted-foreground";
    }
  };

  const customerAvatar =
    customerData?.customer &&
    typeof customerData.customer === "object" &&
    "avatar_url" in customerData.customer
      ? ((customerData.customer as { avatar_url?: string }).avatar_url ??
        undefined)
      : undefined;

  return (
    <div
      className={cn(
        "fixed right-4 bottom-4 z-50 w-80 rounded-lg border bg-card shadow-2xl transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-card/50 p-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-2 w-2 animate-pulse rounded-full",
              getStatusColor()
            )}
          />
          <span className="font-medium text-sm capitalize">{status}</span>
          {duration && (
            <span className="font-mono text-muted-foreground text-xs">
              {duration}
            </span>
          )}
        </div>
        <Button
          className="h-6 w-6"
          onClick={onClose}
          size="icon"
          variant="ghost"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Caller Info */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={customerAvatar} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(callerName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold text-sm">{callerName}</h3>
              {customerData?.isKnownCustomer && (
                <Badge className="h-4 px-1.5 text-[10px]" variant="outline">
                  Customer
                </Badge>
              )}
            </div>
            <p className="font-mono text-muted-foreground text-xs">
              {callerNumber}
            </p>
            {customerData?.customer?.email && (
              <p className="truncate text-muted-foreground text-xs">
                {customerData.customer.email}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Call Controls */}
      <div className="border-t bg-muted/30 p-3">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Primary actions */}
          <div className="flex items-center gap-1">
            {status === "incoming" && onAnswer ? (
              <Button
                className="h-9 w-9 rounded-full bg-emerald-500 hover:bg-emerald-600"
                onClick={onAnswer}
                size="icon"
              >
                <Phone className="h-4 w-4" />
              </Button>
            ) : null}

            <Button
              className="h-9 w-9 rounded-full"
              onClick={onMuteToggle}
              size="icon"
              variant={isMuted ? "destructive" : "ghost"}
            >
              {isMuted ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>

            <Button
              className="h-9 w-9 rounded-full"
              onClick={onVideoToggle}
              size="icon"
              variant={videoStatus === "connected" ? "default" : "ghost"}
            >
              {videoStatus === "connected" ? (
                <Video className="h-4 w-4" />
              ) : (
                <VideoOff className="h-4 w-4" />
              )}
            </Button>

            <Button
              className="h-9 w-9 rounded-full"
              onClick={onTransfer}
              size="icon"
              variant="ghost"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Right: Secondary actions */}
          <div className="flex items-center gap-1">
            <Button
              className="h-9 w-9 rounded-full"
              onClick={onExpand}
              size="icon"
              title="Open customer intake"
              variant="outline"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>

            <Button
              className="h-9 w-9 rounded-full"
              onClick={onEnd}
              size="icon"
              variant="destructive"
            >
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

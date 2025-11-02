"use client";

/**
 * Calls View Component - Client Component
 * Call log style layout for phone calls and voicemails
 *
 * Client-side features:
 * - Call log table
 * - Call type indicators (incoming, outgoing, missed, voicemail)
 * - Duration and status
 */

import {
  Clock,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneMissed,
  PhoneOutgoing,
  Voicemail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommunicationStore } from "@/lib/stores/communication-store";

type CallType = "incoming" | "outgoing" | "missed" | "voicemail";

type CallMessage = {
  id: string;
  from: string;
  fromPhone?: string;
  preview: string;
  timestamp: Date;
  status: "unread" | "read" | "replied" | "archived";
  priority: "low" | "normal" | "high" | "urgent";
  tags?: string[];
  callType?: CallType;
  duration?: number; // in seconds
};

type CallsViewProps = {
  messages: CallMessage[];
};

export function CallsView({ messages }: CallsViewProps) {
  const router = useRouter();
  const setSelectedMessageId = useCommunicationStore(
    (state) => state.setSelectedMessageId
  );
  const setIsDetailView = useCommunicationStore(
    (state) => state.setIsDetailView
  );

  const handleOpenMessage = (message: CallMessage) => {
    setSelectedMessageId(message.id);
    setIsDetailView(true);
    router.push(`/dashboard/communication/${message.id}`);
  };

  const getCallIcon = (callType?: CallType) => {
    switch (callType) {
      case "incoming":
        return <PhoneIncoming className="size-4 text-green-600" />;
      case "outgoing":
        return <PhoneOutgoing className="size-4 text-blue-600" />;
      case "missed":
        return <PhoneMissed className="size-4 text-red-600" />;
      case "voicemail":
        return <Voicemail className="size-4 text-purple-600" />;
      default:
        return <Phone className="size-4" />;
    }
  };

  const getCallTypeLabel = (callType?: CallType) => {
    switch (callType) {
      case "incoming":
        return "Incoming";
      case "outgoing":
        return "Outgoing";
      case "missed":
        return "Missed";
      case "voicemail":
        return "Voicemail";
      default:
        return "Call";
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "-";
    const SECONDS_PER_MINUTE = 60;
    const mins = Math.floor(seconds / SECONDS_PER_MINUTE);
    const secs = seconds % SECONDS_PER_MINUTE;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTimestamp = (date: Date) => {
    const MINUTES_PER_HOUR = 60;
    const HOURS_PER_DAY = 24;
    const DAYS_IN_WEEK = 7;
    const MS_IN_SECOND = 1000;
    const SECONDS_IN_MINUTE = 60;
    const MS_IN_MINUTE = MS_IN_SECOND * SECONDS_IN_MINUTE;

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / MS_IN_MINUTE);
    const hours = Math.floor(minutes / MINUTES_PER_HOUR);
    const days = Math.floor(hours / HOURS_PER_DAY);

    if (minutes < MINUTES_PER_HOUR) {
      return `${minutes}m ago`;
    }
    if (hours < HOURS_PER_DAY) {
      return `${hours}h ago`;
    }
    if (days < DAYS_IN_WEEK) {
      return `${days}d ago`;
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Call Log */}
      <div className="flex-1 overflow-auto">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="space-y-2 text-center">
              <PhoneCall className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="font-medium">No call history</p>
              <p className="text-muted-foreground text-sm">
                Your calls will appear here
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {messages.map((message) => (
              <div
                className={`group flex cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50 ${
                  message.status === "unread"
                    ? "bg-blue-50/30 dark:bg-blue-950/10"
                    : ""
                }`}
                key={message.id}
                onClick={() => handleOpenMessage(message)}
              >
                {/* Call Type Icon */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  {getCallIcon(message.callType)}
                </div>

                {/* Caller Info */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={`font-medium text-sm ${
                        message.status === "unread" ? "font-semibold" : ""
                      }`}
                    >
                      {message.from}
                    </span>
                    <Badge className="text-xs" variant="outline">
                      {getCallTypeLabel(message.callType)}
                    </Badge>
                  </div>

                  {message.fromPhone && (
                    <div className="mb-1 text-muted-foreground text-xs">
                      {message.fromPhone}
                    </div>
                  )}

                  {message.callType === "voicemail" && (
                    <p className="line-clamp-1 text-muted-foreground text-sm">
                      {message.preview}
                    </p>
                  )}
                </div>

                {/* Call Details */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-muted-foreground text-xs">
                    {formatTimestamp(message.timestamp)}
                  </span>
                  {message.duration && (
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Clock className="size-3" />
                      <span>{formatDuration(message.duration)}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="icon" variant="ghost">
                    <PhoneCall className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

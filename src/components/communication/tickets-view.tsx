"use client";

/**
 * Tickets View Component - Client Component
 * Support ticket kanban/list layout
 *
 * Client-side features:
 * - Ticket list with status indicators
 * - Priority badges
 * - Assignment info
 */

import {
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  Ticket,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useCommunicationStore } from "@/lib/stores/communication-store";

type TicketStatus = "new" | "open" | "pending" | "resolved" | "closed";

type TicketMessage = {
  id: string;
  from: string;
  fromEmail?: string;
  subject?: string;
  preview: string;
  timestamp: Date;
  status: "unread" | "read" | "replied" | "archived";
  priority: "low" | "normal" | "high" | "urgent";
  tags?: string[];
  assignedTo?: string;
  ticketStatus?: TicketStatus;
  responseTime?: number; // in hours
};

type TicketsViewProps = {
  messages: TicketMessage[];
};

export function TicketsView({ messages }: TicketsViewProps) {
  const router = useRouter();
  const setSelectedMessageId = useCommunicationStore(
    (state) => state.setSelectedMessageId
  );
  const setIsDetailView = useCommunicationStore(
    (state) => state.setIsDetailView
  );

  const handleOpenMessage = (message: TicketMessage) => {
    setSelectedMessageId(message.id);
    setIsDetailView(true);
    router.push(`/dashboard/communication/${message.id}`);
  };

  const getStatusIcon = (ticketStatus?: TicketStatus) => {
    switch (ticketStatus) {
      case "new":
        return <AlertCircle className="size-4 text-blue-600" />;
      case "open":
        return <MessageSquare className="size-4 text-orange-600" />;
      case "pending":
        return <Clock className="size-4 text-yellow-600" />;
      case "resolved":
        return <CheckCircle className="size-4 text-green-600" />;
      case "closed":
        return <CheckCircle className="size-4 text-muted-foreground" />;
      default:
        return <Ticket className="size-4" />;
    }
  };

  const getStatusLabel = (ticketStatus?: TicketStatus) => {
    if (!ticketStatus) return "New";
    return ticketStatus.charAt(0).toUpperCase() + ticketStatus.slice(1);
  };

  const getStatusVariant = (ticketStatus?: TicketStatus) => {
    switch (ticketStatus) {
      case "new":
        return "default";
      case "open":
        return "default";
      case "pending":
        return "secondary";
      case "resolved":
        return "outline";
      case "closed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "default";
      case "normal":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
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
      {/* Tickets List */}
      <div className="flex-1 overflow-auto">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="space-y-2 text-center">
              <Ticket className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="font-medium">No support tickets</p>
              <p className="text-muted-foreground text-sm">
                All tickets will appear here
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {messages.map((message) => (
              <div
                className={`group flex cursor-pointer items-start gap-4 px-4 py-3 transition-colors hover:bg-muted/50 ${
                  message.status === "unread"
                    ? "bg-blue-50/30 dark:bg-blue-950/10"
                    : ""
                }`}
                key={message.id}
                onClick={() => handleOpenMessage(message)}
              >
                {/* Status Icon */}
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  {getStatusIcon(message.ticketStatus)}
                </div>

                {/* Ticket Content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-medium text-sm">
                          #{message.id}
                        </span>
                        <Badge
                          className="text-xs"
                          variant={getStatusVariant(message.ticketStatus)}
                        >
                          {getStatusLabel(message.ticketStatus)}
                        </Badge>
                        <Badge
                          className="text-xs"
                          variant={getPriorityColor(message.priority)}
                        >
                          {message.priority}
                        </Badge>
                      </div>
                      <h3
                        className={`mb-1 text-sm ${
                          message.status === "unread" ? "font-semibold" : ""
                        }`}
                      >
                        {message.subject || "Support Request"}
                      </h3>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>

                  <p className="mb-2 line-clamp-2 text-muted-foreground text-sm">
                    {message.preview}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-muted-foreground text-xs">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px]">
                            {message.from
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{message.from}</span>
                      </div>
                      {message.assignedTo && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <User className="size-3" />
                            <span>Assigned to {message.assignedTo}</span>
                          </div>
                        </>
                      )}
                      {message.responseTime && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="size-3" />
                            <span>Response: {message.responseTime}h</span>
                          </div>
                        </>
                      )}
                    </div>

                    {message.tags && message.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {message.tags.slice(0, 2).map((tag) => (
                          <Badge
                            className="text-xs"
                            key={tag}
                            variant="outline"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

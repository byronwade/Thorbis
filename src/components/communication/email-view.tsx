"use client";

/**
 * Email View Component - Client Component
 * Gmail-style table layout for email messages
 *
 * Client-side features:
 * - Table view with checkboxes
 * - Bulk selection
 * - Search and filters
 */

import { Archive, Mail, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCommunicationStore } from "@/lib/stores/communication-store";

type EmailMessage = {
  id: string;
  from: string;
  fromEmail?: string;
  subject?: string;
  preview: string;
  timestamp: Date;
  status: "unread" | "read" | "replied" | "archived";
  priority: "low" | "normal" | "high" | "urgent";
  tags?: string[];
  attachments?: number;
};

type EmailViewProps = {
  messages: EmailMessage[];
};

export function EmailView({ messages }: EmailViewProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const setSelectedMessageId = useCommunicationStore(
    (state) => state.setSelectedMessageId
  );
  const setIsDetailView = useCommunicationStore(
    (state) => state.setIsDetailView
  );

  const handleSelectAll = () => {
    if (selectedIds.size === messages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(messages.map((m) => m.id)));
    }
  };

  const handleSelectMessage = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleOpenMessage = (message: EmailMessage) => {
    setSelectedMessageId(message.id);
    setIsDetailView(true);
    router.push(`/dashboard/communication/${message.id}`);
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
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <Checkbox
          checked={selectedIds.size === messages.length && messages.length > 0}
          onCheckedChange={handleSelectAll}
        />

        {selectedIds.size > 0 && (
          <>
            <div className="mx-2 h-4 w-px bg-border" />
            <Button
              className="text-destructive hover:text-destructive"
              size="sm"
              variant="ghost"
            >
              <Archive className="mr-2 size-4" />
              Archive
            </Button>
            <Button
              className="text-destructive hover:text-destructive"
              size="sm"
              variant="ghost"
            >
              <Trash2 className="mr-2 size-4" />
              Delete
            </Button>
            <Button size="sm" variant="ghost">
              <Star className="mr-2 size-4" />
              Star
            </Button>
            <span className="ml-2 text-muted-foreground text-sm">
              {selectedIds.size} selected
            </span>
          </>
        )}
      </div>

      {/* Email Table */}
      <div className="flex-1 overflow-auto">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="space-y-2 text-center">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="font-medium">No emails found</p>
              <p className="text-muted-foreground text-sm">
                Try adjusting your filters
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {messages.map((message) => (
              <div
                className={`group flex cursor-pointer items-center gap-4 px-4 py-2 transition-colors hover:bg-muted/50 ${
                  message.status === "unread"
                    ? "bg-primary/30 dark:bg-primary/10"
                    : ""
                } ${selectedIds.has(message.id) ? "bg-muted/50" : ""}`}
                key={message.id}
                onClick={() => handleOpenMessage(message)}
              >
                <div
                  className="flex items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={selectedIds.has(message.id)}
                    onCheckedChange={() => handleSelectMessage(message.id)}
                  />
                  <button
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    type="button"
                  >
                    <Star className="h-4 w-4 text-muted-foreground hover:text-warning" />
                  </button>
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="flex w-48 shrink-0 items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {message.from
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`truncate text-sm ${
                        message.status === "unread" ? "font-semibold" : ""
                      }`}
                    >
                      {message.from}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Mail className="size-4" />
                      {message.subject && (
                        <span
                          className={`text-sm ${
                            message.status === "unread" ? "font-semibold" : ""
                          }`}
                        >
                          {message.subject}
                        </span>
                      )}
                      <span className="text-muted-foreground text-sm">
                        - {message.preview.substring(0, 80)}...
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {message.tags?.slice(0, 2).map((tag) => (
                      <Badge className="text-xs" key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                    {message.attachments && (
                      <span className="text-muted-foreground text-xs">📎</span>
                    )}
                    <span className="w-20 text-right text-muted-foreground text-xs">
                      {formatTimestamp(message.timestamp)}
                    </span>
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

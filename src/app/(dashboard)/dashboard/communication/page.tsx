"use client";

/**
 * Communication Page - Client Component
 * Gmail-style table layout
 *
 * Client-side features:
 * - Gmail-style table view with checkboxes
 * - Bulk actions toolbar
 * - Message selection and filtering
 * - Context provider for toolbar integration
 */

import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Mail,
  MessageSquare,
  MoreVertical,
  Phone,
  RefreshCw,
  Search,
  Star,
  Ticket,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCommunicationStore } from "@/lib/stores/communication-store";
type MessageType = "email" | "sms" | "phone" | "ticket";
type MessageStatus = "unread" | "read" | "replied" | "archived";

type UnifiedMessage = {
  id: string;
  type: MessageType;
  from: string;
  fromEmail?: string;
  fromPhone?: string;
  subject?: string;
  preview: string;
  fullContent?: string;
  timestamp: Date;
  status: MessageStatus;
  priority: "low" | "normal" | "high" | "urgent";
  assignedTo?: string;
  tags?: string[];
  attachments?: number;
};

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE;
const MINUTES_AGO_15 = 15;
const MINUTES_AGO_45 = 45;
const MINUTES_AGO_120 = 120;
const MINUTES_AGO_180 = 180;
const MINUTES_AGO_240 = 240;
const MINUTES_AGO_300 = 300;

// Calculate timestamps once at module load time to prevent re-renders
const NOW = Date.now();

const MOCK_MESSAGES: UnifiedMessage[] = [
  {
    id: "1",
    type: "email",
    from: "John Smith",
    fromEmail: "john.smith@example.com",
    subject: "Question about invoice #1234",
    preview:
      "Hi, I have a question regarding the invoice I received yesterday. The total seems to be higher than expected...",
    timestamp: new Date(NOW - MS_PER_MINUTE * MINUTES_AGO_15),
    status: "unread",
    priority: "normal",
    tags: ["billing", "customer"],
    attachments: 1,
  },
  {
    id: "2",
    type: "phone",
    from: "Sarah Johnson",
    fromPhone: "(555) 123-4567",
    subject: "Voicemail - Service Inquiry",
    preview:
      "Left voicemail asking about availability for AC installation next week. Mentioned they were referred by Mike Thompson.",
    timestamp: new Date(NOW - MS_PER_MINUTE * MINUTES_AGO_45),
    status: "unread",
    priority: "high",
    tags: ["sales", "new-lead"],
  },
  {
    id: "3",
    type: "ticket",
    from: "Mike Davis",
    fromEmail: "mike.davis@example.com",
    subject: "Work order not showing up",
    preview:
      "I scheduled a service for tomorrow but I can't see it in my customer portal. Can you help me confirm the appointment?",
    timestamp: new Date(NOW - MS_PER_MINUTE * MINUTES_AGO_120),
    status: "read",
    priority: "urgent",
    assignedTo: "Support Team",
    tags: ["technical", "customer-portal"],
  },
  {
    id: "4",
    type: "sms",
    from: "Emma Wilson",
    fromPhone: "(555) 987-6543",
    preview:
      "Thanks for the great service yesterday! The technician was very professional. Do you offer annual maintenance plans?",
    timestamp: new Date(NOW - MS_PER_MINUTE * MINUTES_AGO_180),
    status: "replied",
    priority: "normal",
    tags: ["customer", "upsell"],
  },
  {
    id: "5",
    type: "email",
    from: "Robert Brown",
    fromEmail: "robert.brown@example.com",
    subject: "Reschedule request for Friday appointment",
    preview:
      "I need to reschedule my Friday 2pm appointment due to a work conflict. Would Monday or Tuesday work instead?",
    timestamp: new Date(NOW - MS_PER_MINUTE * MINUTES_AGO_240),
    status: "read",
    priority: "normal",
    tags: ["scheduling"],
  },
  {
    id: "6",
    type: "phone",
    from: "Lisa Anderson",
    fromPhone: "(555) 456-7890",
    subject: "Missed Call",
    preview:
      "Missed call - no voicemail left. Number shows previous customer from 3 months ago.",
    timestamp: new Date(NOW - MS_PER_MINUTE * MINUTES_AGO_300),
    status: "unread",
    priority: "low",
    tags: ["follow-up"],
  },
];

export default function CommunicationPage() {
  const [selectedMessage, setSelectedMessage] = useState<UnifiedMessage | null>(
    null
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  // Use Zustand store for active filter (shared with toolbar)
  const activeFilter = useCommunicationStore((state) => state.activeFilter);
  const setActiveFilter = useCommunicationStore((state) => state.setActiveFilter);

  // Filter messages by type and search query
  const filteredMessages = MOCK_MESSAGES.filter((msg) => {
    // Filter by type
    if (activeFilter !== "all" && msg.type !== activeFilter) {
      return false;
    }

    // Filter by search query
    if (searchQuery === "") return true;
    const query = searchQuery.toLowerCase();
    return (
      msg.from.toLowerCase().includes(query) ||
      msg.subject?.toLowerCase().includes(query) ||
      msg.preview.toLowerCase().includes(query)
    );
  });

  // Get message counts by type
  const messageCounts = {
    all: MOCK_MESSAGES.length,
    email: MOCK_MESSAGES.filter((m) => m.type === "email").length,
    sms: MOCK_MESSAGES.filter((m) => m.type === "sms").length,
    phone: MOCK_MESSAGES.filter((m) => m.type === "phone").length,
    ticket: MOCK_MESSAGES.filter((m) => m.type === "ticket").length,
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredMessages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMessages.map((m) => m.id)));
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

  const handleOpenMessage = (message: UnifiedMessage) => {
    setSelectedMessage(message);
    setIsMessageOpen(true);
  };

  const getMessageIcon = (type: MessageType) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      case "ticket":
        return <Ticket className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
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
    <>
      <div className="flex h-full flex-col">
        {/* Filter Tabs */}
        <div className="border-b bg-background">
          <div className="grid grid-cols-5 divide-x">
            <button
              className={`relative flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all hover:bg-muted/50 ${
                activeFilter === "all"
                  ? "bg-muted/30 text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveFilter("all")}
              type="button"
            >
              <Inbox className="h-4 w-4" />
              All Messages
              <span className="ml-1 rounded-full bg-background px-2 py-0.5 text-xs tabular-nums">
                {messageCounts.all}
              </span>
              {activeFilter === "all" && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
              )}
            </button>

            <button
              className={`relative flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all hover:bg-muted/50 ${
                activeFilter === "email"
                  ? "bg-muted/30 text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveFilter("email")}
              type="button"
            >
              <Mail className="h-4 w-4" />
              Email
              <span className="ml-1 rounded-full bg-background px-2 py-0.5 text-xs tabular-nums">
                {messageCounts.email}
              </span>
              {activeFilter === "email" && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
              )}
            </button>

            <button
              className={`relative flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all hover:bg-muted/50 ${
                activeFilter === "sms"
                  ? "bg-muted/30 text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveFilter("sms")}
              type="button"
            >
              <MessageSquare className="h-4 w-4" />
              Texts
              <span className="ml-1 rounded-full bg-background px-2 py-0.5 text-xs tabular-nums">
                {messageCounts.sms}
              </span>
              {activeFilter === "sms" && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
              )}
            </button>

            <button
              className={`relative flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all hover:bg-muted/50 ${
                activeFilter === "phone"
                  ? "bg-muted/30 text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveFilter("phone")}
              type="button"
            >
              <Phone className="h-4 w-4" />
              Calls
              <span className="ml-1 rounded-full bg-background px-2 py-0.5 text-xs tabular-nums">
                {messageCounts.phone}
              </span>
              {activeFilter === "phone" && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
              )}
            </button>

            <button
              className={`relative flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all hover:bg-muted/50 ${
                activeFilter === "ticket"
                  ? "bg-muted/30 text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveFilter("ticket")}
              type="button"
            >
              <Ticket className="h-4 w-4" />
              Support
              <span className="ml-1 rounded-full bg-background px-2 py-0.5 text-xs tabular-nums">
                {messageCounts.ticket}
              </span>
              {activeFilter === "ticket" && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b px-4 py-2">

          <Checkbox
            checked={
              selectedIds.size === filteredMessages.length &&
              filteredMessages.length > 0
            }
            onCheckedChange={handleSelectAll}
          />
          <Button size="icon" variant="ghost">
            <RefreshCw className="h-4 w-4" />
          </Button>

          {selectedIds.size > 0 && (
            <>
              <div className="mx-2 h-4 w-px bg-border" />
              <Button size="sm" variant="ghost">
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </Button>
              <Button size="sm" variant="ghost">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <Button size="sm" variant="ghost">
                <Star className="mr-2 h-4 w-4" />
                Star
              </Button>
              <span className="ml-2 text-muted-foreground text-sm">
                {selectedIds.size} selected
              </span>
            </>
          )}

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
              <Input
                className="h-9 w-64 pl-8"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                value={searchQuery}
              />
            </div>
            <Button size="icon" variant="ghost">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">1-{filteredMessages.length}</span>
            <Button size="icon" variant="ghost">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Message Table */}
        <div className="flex-1 overflow-auto">
          {filteredMessages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="space-y-2 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="font-medium">No messages found</p>
                <p className="text-muted-foreground text-sm">
                  Try adjusting your search
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y">
              {filteredMessages.map((message) => (
                <div
                  className={`group flex cursor-pointer items-center gap-4 px-4 py-2 transition-colors hover:bg-muted/50 ${
                    message.status === "unread"
                      ? "bg-blue-50/30 dark:bg-blue-950/10"
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
                      <Star className="h-4 w-4 text-muted-foreground hover:text-yellow-500" />
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
                        {getMessageIcon(message.type)}
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

      {/* Message Detail Sheet */}
      <Sheet onOpenChange={setIsMessageOpen} open={isMessageOpen}>
        <SheetContent className="w-full sm:max-w-2xl">
          {selectedMessage && (
            <>
              <SheetHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getMessageIcon(selectedMessage.type)}
                      <SheetTitle>
                        {selectedMessage.subject ||
                          `${selectedMessage.type.charAt(0).toUpperCase() + selectedMessage.type.slice(1)} from ${selectedMessage.from}`}
                      </SheetTitle>
                      <Badge
                        variant={getPriorityColor(selectedMessage.priority)}
                      >
                        {selectedMessage.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {selectedMessage.from
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{selectedMessage.from}</span>
                        {selectedMessage.fromEmail && (
                          <span className="text-xs">
                            ({selectedMessage.fromEmail})
                          </span>
                        )}
                      </div>
                      <span>•</span>
                      <span>{selectedMessage.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Star className="mr-2 h-4 w-4" />
                    Star
                  </Button>
                  <Button size="sm" variant="outline">
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>

                <div className="prose dark:prose-invert">
                  <p>{selectedMessage.preview}</p>
                  <p className="text-muted-foreground">
                    This is additional message content that would display the
                    full message body in a real application.
                  </p>
                </div>

                {selectedMessage.tags && selectedMessage.tags.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-medium text-sm">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMessage.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

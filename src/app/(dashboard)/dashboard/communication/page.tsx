"use client";

/**
 * Communication Page - Client Component
 * Hub for all communication types with type-specific views
 *
 * Client-side features:
 * - Type-specific views (email, SMS, calls, tickets)
 * - Filtering by message type
 * - Search functionality
 * - Next.js routing to detail pages
 */

import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Ticket,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CallsView } from "@/components/communication/calls-view";
import { EmailView } from "@/components/communication/email-view";
import { SMSView } from "@/components/communication/sms-view";
import { TicketsView } from "@/components/communication/tickets-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);

  // Use Zustand store for active filter (shared with toolbar)
  const activeFilter = useCommunicationStore((state) => state.activeFilter);
  const setActiveFilter = useCommunicationStore(
    (state) => state.setActiveFilter
  );

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
    setSelectedMessageId(message.id);
    setIsDetailView(true);
    router.push(`/dashboard/communication/${message.id}`);
  };

  const getMessageIcon = (type: MessageType) => {
    switch (type) {
      case "email":
        return <Mail className="size-4" />;
      case "sms":
        return <MessageSquare className="size-4" />;
      case "phone":
        return <Phone className="size-4" />;
      case "ticket":
        return <Ticket className="size-4" />;
      default:
        return <MessageSquare className="size-4" />;
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

  // Render different views based on activeFilter
  const renderView = () => {
    switch (activeFilter) {
      case "email":
        return <EmailView messages={filteredMessages} />;
      case "sms":
        return <SMSView messages={filteredMessages} />;
      case "phone":
        return <CallsView messages={filteredMessages} />;
      case "ticket":
        return <TicketsView messages={filteredMessages} />;
      default:
        // For "all", show email view (could be a combined view in the future)
        return <EmailView messages={filteredMessages} />;
    }
  };

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Filter Tabs */}
        <div className="border-b bg-background">
          <div className="grid grid-cols-5 divide-x">
            <button
              className={`relative flex items-center justify-center gap-2 py-3 font-medium text-sm transition-all hover:bg-muted/50 ${
                activeFilter === "all"
                  ? "bg-muted/30 text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveFilter("all")}
              type="button"
            >
              <Inbox className="size-4" />
              All Messages
              <span className="ml-1 rounded-full bg-background px-2 py-0.5 text-xs tabular-nums">
                {messageCounts.all}
              </span>
              {activeFilter === "all" && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
              )}
            </button>

            <button
              className={`relative flex items-center justify-center gap-2 py-3 font-medium text-sm transition-all hover:bg-muted/50 ${
                activeFilter === "email"
                  ? "bg-muted/30 text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveFilter("email")}
              type="button"
            >
              <Mail className="size-4" />
              Email
              <span className="ml-1 rounded-full bg-background px-2 py-0.5 text-xs tabular-nums">
                {messageCounts.email}
              </span>
              {activeFilter === "email" && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
              )}
            </button>

            <button
              className={`relative flex items-center justify-center gap-2 py-3 font-medium text-sm transition-all hover:bg-muted/50 ${
                activeFilter === "sms"
                  ? "bg-muted/30 text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveFilter("sms")}
              type="button"
            >
              <MessageSquare className="size-4" />
              Texts
              <span className="ml-1 rounded-full bg-background px-2 py-0.5 text-xs tabular-nums">
                {messageCounts.sms}
              </span>
              {activeFilter === "sms" && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
              )}
            </button>

            <button
              className={`relative flex items-center justify-center gap-2 py-3 font-medium text-sm transition-all hover:bg-muted/50 ${
                activeFilter === "phone"
                  ? "bg-muted/30 text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveFilter("phone")}
              type="button"
            >
              <Phone className="size-4" />
              Calls
              <span className="ml-1 rounded-full bg-background px-2 py-0.5 text-xs tabular-nums">
                {messageCounts.phone}
              </span>
              {activeFilter === "phone" && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
              )}
            </button>

            <button
              className={`relative flex items-center justify-center gap-2 py-3 font-medium text-sm transition-all hover:bg-muted/50 ${
                activeFilter === "ticket"
                  ? "bg-muted/30 text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveFilter("ticket")}
              type="button"
            >
              <Ticket className="size-4" />
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

        {/* Search Bar */}
        <div className="flex items-center gap-2 border-b px-4 py-2">
          <Button size="icon" variant="ghost">
            <RefreshCw className="size-4" />
          </Button>
          <div className="relative max-w-md flex-1">
            <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
            <Input
              className="h-9 pl-8"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              value={searchQuery}
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button size="icon" variant="ghost">
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm">1-{filteredMessages.length}</span>
            <Button size="icon" variant="ghost">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Type-specific View */}
        {renderView()}
      </div>
    </>
  );
}

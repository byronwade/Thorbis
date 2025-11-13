"use client";

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
import { useMemo, useState } from "react";
import { CallsView } from "@/components/communication/calls-view";
import { EmailView } from "@/components/communication/email-view";
import { SMSView } from "@/components/communication/sms-view";
import { TicketsView } from "@/components/communication/tickets-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCommunicationStore } from "@/lib/stores/communication-store";
import type { ConversationThread, ThreadMessage } from "./sms-thread-view";

type MessageType = "email" | "sms" | "phone" | "ticket";
type MessageStatus = "unread" | "read" | "replied" | "archived";
type MessagePriority = "low" | "normal" | "high" | "urgent";

export type CommunicationRecord = {
  id: string;
  type: string;
  direction: "inbound" | "outbound";
  status: string;
  priority: string | null;
  subject: string | null;
  body: string | null;
  created_at: string;
  read_at: string | null;
  from_address: string | null;
  to_address: string | null;
  call_duration: number | null;
  customer: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
};

type UnifiedMessage = {
  id: string;
  type: MessageType;
  from: string;
  fromPhone?: string;
  subject?: string;
  preview: string;
  timestamp: Date;
  status: MessageStatus;
  priority: MessagePriority;
  direction: "inbound" | "outbound";
  callDuration?: number;
  callType?: "incoming" | "outgoing" | "missed" | "voicemail";
};

interface CommunicationPageClientProps {
  communications: CommunicationRecord[];
}

export function CommunicationPageClient({
  communications,
}: CommunicationPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const activeFilter = useCommunicationStore((state) => state.activeFilter);
  const setActiveFilter = useCommunicationStore(
    (state) => state.setActiveFilter
  );

  const unifiedMessages = useMemo(
    () => communications.map(convertCommunicationToMessage),
    [communications]
  );

  const smsThreads = useMemo(
    () => buildSmsThreads(communications),
    [communications]
  );

  const messageCounts = useMemo(
    () => ({
      all: unifiedMessages.length,
      email: unifiedMessages.filter((m) => m.type === "email").length,
      sms: unifiedMessages.filter((m) => m.type === "sms").length,
      phone: unifiedMessages.filter((m) => m.type === "phone").length,
      ticket: unifiedMessages.filter((m) => m.type === "ticket").length,
    }),
    [unifiedMessages]
  );

  const filteredMessages = useMemo(() => {
    return unifiedMessages.filter((msg) => {
      if (activeFilter !== "all" && msg.type !== activeFilter) {
        return false;
      }

      if (!searchQuery) {
        return true;
      }

      const query = searchQuery.toLowerCase();
      return (
        msg.from.toLowerCase().includes(query) ||
        msg.subject?.toLowerCase().includes(query) ||
        msg.preview.toLowerCase().includes(query)
      );
    });
  }, [unifiedMessages, activeFilter, searchQuery]);

  const filteredSmsThreads = useMemo(() => {
    if (!searchQuery) {
      return smsThreads;
    }
    const query = searchQuery.toLowerCase();
    return smsThreads.filter((thread) => {
      return (
        thread.contactName.toLowerCase().includes(query) ||
        thread.contactNumber.toLowerCase().includes(query) ||
        (thread.lastMessage?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [smsThreads, searchQuery]);

  const renderView = () => {
    switch (activeFilter) {
      case "email":
      case "all":
        return <EmailView messages={filteredMessages} />;
      case "sms":
        return <SMSView threads={filteredSmsThreads} />;
      case "phone":
        return <CallsView messages={filteredMessages} />;
      case "ticket":
        return <TicketsView messages={filteredMessages} />;
      default:
        return <EmailView messages={filteredMessages} />;
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Filter Tabs */}
      <div className="border-b bg-background">
        <div className="grid grid-cols-5 divide-x">
          {[
            { key: "all", label: "All Messages", icon: Inbox },
            { key: "email", label: "Email", icon: Mail },
            { key: "sms", label: "Texts", icon: MessageSquare },
            { key: "phone", label: "Calls", icon: Phone },
            { key: "ticket", label: "Support", icon: Ticket },
          ].map(({ key, label, icon: Icon }) => (
            <button
              className={`relative flex items-center justify-center gap-2 py-3 font-medium text-sm transition-all hover:bg-muted/50 ${
                activeFilter === key
                  ? "bg-muted/30 text-foreground"
                  : "text-muted-foreground"
              }`}
              key={key}
              onClick={() => setActiveFilter(key as MessageType | "all")}
              type="button"
            >
              <Icon className="size-4" />
              {label}
              <span className="ml-1 rounded-full bg-background px-2 py-0.5 text-xs tabular-nums">
                {messageCounts[key as keyof typeof messageCounts] ?? 0}
              </span>
              {activeFilter === key && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
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
        <div className="ml-auto flex items-center gap-2 text-muted-foreground text-sm">
          <Button size="icon" variant="ghost">
            <ChevronLeft className="size-4" />
          </Button>
          <span>
            {filteredMessages.length === 0
              ? "0"
              : `1-${filteredMessages.length}`}
          </span>
          <Button size="icon" variant="ghost">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Type-specific View */}
      <div className="flex-1 overflow-auto">{renderView()}</div>
    </div>
  );
}

function convertCommunicationToMessage(record: CommunicationRecord): UnifiedMessage {
  const type = mapMessageType(record.type);
  const customerName = getCustomerName(record);
  const phone =
    record.direction === "inbound"
      ? record.from_address
      : record.to_address;

  const status = mapMessageStatus(record);
  const callType =
    type === "phone"
      ? mapCallType(record.direction, status, record.call_duration)
      : undefined;

  return {
    id: record.id,
    type,
    from: customerName ?? formatDisplayPhoneNumber(phone ?? ""),
    fromPhone: phone ?? undefined,
    subject: record.subject ?? undefined,
    preview: record.body || "",
    timestamp: new Date(record.created_at),
    status,
    priority: mapPriority(record.priority),
    direction: record.direction,
    callDuration: record.call_duration ?? undefined,
    callType,
  };
}

function buildSmsThreads(
  records: CommunicationRecord[]
): ConversationThread[] {
  const threads = new Map<string, ConversationThread>();

  records
    .filter((record) => mapMessageType(record.type) === "sms")
    .forEach((record) => {
      const contactId =
        record.customer?.id ||
        (record.direction === "inbound"
          ? record.from_address
          : record.to_address) ||
        record.id;

      if (!threads.has(contactId)) {
        const contactName =
          getCustomerName(record) ||
          formatDisplayPhoneNumber(
            record.direction === "inbound"
              ? record.from_address ?? ""
              : record.to_address ?? ""
          );
        const contactNumber =
          record.direction === "inbound"
            ? formatDisplayPhoneNumber(record.from_address ?? "")
            : formatDisplayPhoneNumber(record.to_address ?? "");

        threads.set(contactId, {
          id: contactId,
          contactName,
          contactNumber,
          contactInitials: getInitials(contactName),
          lastMessage: "",
          lastMessageTime: undefined,
          unreadCount: 0,
          messages: [],
        });
      }

      const thread = threads.get(contactId)!;
      const message: ThreadMessage = {
        id: record.id,
        conversationId: contactId,
        direction: record.direction === "inbound" ? "received" : "sent",
        content: record.body || "",
        timestamp: record.created_at,
        status: mapSmsDeliveryStatus(record.status),
      };

      thread.messages.push(message);
      thread.lastMessage = record.body || thread.lastMessage;
      thread.lastMessageTime = record.created_at;

      if (record.direction === "inbound" && !record.read_at) {
        thread.unreadCount += 1;
      }
    });

  return Array.from(threads.values()).map((thread) => ({
    ...thread,
    messages: thread.messages.sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp)
    ),
  }));
}

function mapMessageType(type: string): MessageType {
  if (type === "sms" || type === "phone" || type === "ticket") {
    return type;
  }
  return "email";
}

function mapMessageStatus(record: CommunicationRecord): MessageStatus {
  if (record.status === "failed") {
    return "archived";
  }
  if (record.direction === "outbound") {
    return "replied";
  }
  if (record.read_at) {
    return "read";
  }
  return "unread";
}

function mapPriority(priority?: string | null): MessagePriority {
  if (priority === "urgent" || priority === "high" || priority === "low") {
    return priority;
  }
  return "normal";
}

function mapCallType(
  direction: "inbound" | "outbound",
  status: MessageStatus,
  duration?: number | null
): "incoming" | "outgoing" | "missed" | "voicemail" {
  if (direction === "outbound") {
    return "outgoing";
  }
  if (status === "unread" && (!duration || duration === 0)) {
    return "missed";
  }
  return "incoming";
}

function mapSmsDeliveryStatus(status: string): ThreadMessage["status"] {
  switch (status) {
    case "queued":
      return "sending";
    case "sent":
      return "sent";
    case "delivered":
      return "delivered";
    case "read":
      return "read";
    case "failed":
      return "failed";
    default:
      return "sent";
  }
}

function getCustomerName(record: CommunicationRecord): string | null {
  const first = record.customer?.first_name ?? "";
  const last = record.customer?.last_name ?? "";
  const name = `${first} ${last}`.trim();
  return name || null;
}

function getInitials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDisplayPhoneNumber(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phoneNumber || "Unknown";
}


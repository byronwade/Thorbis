/**
 * SMS Thread View Component
 *
 * WhatsApp-style threaded conversation view:
 * - Message bubbles (sent/received)
 * - Real-time message status (sending, sent, delivered, read)
 * - Media attachments (MMS)
 * - Typing indicators
 * - Message reactions
 * - Quick replies
 * - Search within conversation
 */

"use client";

import {
  Check,
  CheckCheck,
  Clock,
  File,
  Loader2,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Video,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { sendTextMessage } from "@/actions/telnyx";
import type {
  CommunicationRecord,
  CompanyPhone,
} from "@/components/communication/communication-page-client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCommunicationStore } from "@/lib/stores/communication-store";
import { cn } from "@/lib/utils";

export type MessageStatus =
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed";
export type MessageDirection = "sent" | "received";
type MediaType = "image" | "video" | "file";

export type ThreadMessage = {
  id: string;
  conversationId: string;
  direction: MessageDirection;
  content: string;
  timestamp: string;
  status: MessageStatus;
  media?: {
    type: MediaType;
    url: string;
    fileName?: string;
    fileSize?: number;
    thumbnail?: string;
  }[];
  isTyping?: boolean;
};

export type ConversationThread = {
  id: string;
  contactName: string;
  contactNumber: string;
  contactNumberRaw: string;
  contactInitials: string;
  customerId?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  messages: ThreadMessage[];
};

interface SMSThreadViewProps {
  threads: ConversationThread[];
  companyId: string;
  companyPhones: CompanyPhone[];
  onMessageCreated: (record: CommunicationRecord) => void;
}

export function SMSThreadView({
  threads,
  companyId,
  companyPhones,
  onMessageCreated,
}: SMSThreadViewProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(threads[0]?.id ?? null);
  const [messageText, setMessageText] = useState("");
  const [conversationFilter, setConversationFilter] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSender, setSelectedSender] = useState(
    companyPhones[0]?.number ?? ""
  );
  const [isSending, startSending] = useTransition();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const addPendingMessage = useCommunicationStore(
    (state) => state.addPendingMessage
  );
  useEffect(() => {
    if (!companyPhones.find((phone) => phone.number === selectedSender)) {
      setSelectedSender(companyPhones[0]?.number ?? "");
    }
  }, [companyPhones, selectedSender]);

  const resolvePendingMessage = useCommunicationStore(
    (state) => state.resolvePendingMessage
  );
  const setActiveThreadId = useCommunicationStore(
    (state) => state.setActiveThreadId
  );

  const filteredThreads = useMemo(() => {
    if (!conversationFilter.trim()) {
      return threads;
    }
    const query = conversationFilter.toLowerCase();
    return threads.filter(
      (thread) =>
        thread.contactName.toLowerCase().includes(query) ||
        thread.contactNumber.toLowerCase().includes(query)
    );
  }, [threads, conversationFilter]);

  const selectedConversation =
    threads.find((thread) => thread.id === selectedConversationId) ??
    filteredThreads[0] ??
    threads[0];

  useEffect(() => {
    if (selectedConversationId) {
      setActiveThreadId(selectedConversationId);
      return () => setActiveThreadId(null);
    }
    return;
  }, [selectedConversationId, setActiveThreadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation, threads]);

  useEffect(() => {
    if (!selectedConversation && filteredThreads.length > 0) {
      setSelectedConversationId(filteredThreads[0].id);
    }
  }, [filteredThreads, selectedConversation]);

  const handleSendMessage = () => {
    if (
      !(selectedConversation && messageText.trim() && selectedSender) ||
      isSending
    ) {
      return;
    }

    const draft = messageText.trim();
    const normalizedTo =
      selectedConversation.contactNumberRaw.replace(/\D/g, "") ||
      selectedConversation.contactNumber.replace(/\D/g, "");

    if (!normalizedTo) {
      toast.error("Conversation is missing a valid phone number.");
      return;
    }

    const tempId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? `temp-${crypto.randomUUID()}`
        : `temp-${Date.now()}`;

    const timestamp = new Date().toISOString();

    addPendingMessage({
      id: tempId,
      conversationId: selectedConversation.id,
      direction: "sent",
      content: draft,
      timestamp,
      status: "sending",
      contactName: selectedConversation.contactName,
      contactNumber: selectedConversation.contactNumber,
      contactNumberRaw: selectedConversation.contactNumberRaw,
      customerId: selectedConversation.customerId,
    });

    setMessageText("");
    setIsTyping(false);

    startSending(async () => {
      const result = await sendTextMessage({
        to: normalizedTo,
        from: selectedSender,
        text: draft,
        companyId,
        customerId: selectedConversation.customerId,
      });

      if (result.success && "data" in result && result.data) {
        resolvePendingMessage(selectedConversation.id, tempId);
        onMessageCreated(
          mapOutboundCommunicationRecord(
            result.data as Record<string, unknown>,
            selectedConversation,
            selectedSender
          )
        );
      } else {
        resolvePendingMessage(selectedConversation.id, tempId);
        setMessageText(draft);
        toast.error(result.error || "Failed to send text message");
      }
    });
  };
  const messages = selectedConversation?.messages ?? [];

  return (
    <div className="flex h-full">
      {/* Conversations List */}
      <div className="w-80 border-r">
        {/* Search */}
        <div className="border-b p-3">
          <div className="relative">
            <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              onChange={(e) => setConversationFilter(e.target.value)}
              placeholder="Search conversations..."
              value={conversationFilter}
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="divide-y overflow-auto">
          {filteredThreads.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">
              No text conversations yet.
            </div>
          ) : (
            filteredThreads.map((conv) => (
              <button
                className={cn(
                  "flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-muted/50",
                  selectedConversation?.id === conv.id && "bg-muted"
                )}
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                type="button"
              >
                <Avatar className="mt-1">
                  <AvatarFallback>{conv.contactInitials}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium">{conv.contactName}</span>
                    {conv.lastMessageTime && (
                      <span className="text-muted-foreground text-xs">
                        {formatTime(conv.lastMessageTime)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="line-clamp-1 text-muted-foreground text-sm">
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <Badge className="ml-2 size-5 rounded-full p-0 text-xs">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Conversation Thread */}
      {selectedConversation ? (
        <div className="flex flex-1 flex-col">
          {/* Conversation Header */}
          <div className="flex items-center justify-between border-b bg-background px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {selectedConversation.contactInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {selectedConversation.contactName}
                </div>
                <div className="text-muted-foreground text-xs">
                  {selectedConversation.contactNumber}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost">
                <Phone className="size-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Video className="size-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Contact</DropdownMenuItem>
                  <DropdownMenuItem>Search Messages</DropdownMenuItem>
                  <DropdownMenuItem>Export Conversation</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto bg-muted/20 p-4">
            <div className="mx-auto max-w-4xl space-y-4">
              {messages.map((message, index) => (
                <MessageBubble
                  contactInitials={selectedConversation.contactInitials}
                  key={message.id}
                  message={message}
                  showAvatar={
                    index === 0 ||
                    messages[index - 1].direction !== message.direction
                  }
                />
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-end gap-2">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">
                      {selectedConversation.contactInitials}
                    </AvatarFallback>
                  </Avatar>
                  <Card className="bg-background">
                    <CardContent className="flex items-center gap-1 p-3">
                      <div className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                      <div className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                      <div className="size-2 animate-bounce rounded-full bg-muted-foreground" />
                    </CardContent>
                  </Card>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="border-t bg-background p-4">
            <div className="mx-auto flex max-w-4xl flex-col gap-3">
              {companyPhones.length === 0 && (
                <div className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-warning text-xs dark:border-warning/60 dark:bg-warning/15">
                  Add a company phone number in Settings → Communications →
                  Phone Numbers to send text messages.
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost">
                  <Paperclip className="size-4" />
                </Button>
                <Input
                  className="flex-1"
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    setIsTyping(Boolean(e.target.value));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  value={messageText}
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="w-full sm:w-56">
                  <Label className="mb-1 block font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Send From
                  </Label>
                  <Select
                    disabled={companyPhones.length === 0}
                    onValueChange={setSelectedSender}
                    value={selectedSender}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      {companyPhones.map((phone) => (
                        <SelectItem key={phone.id} value={phone.number}>
                          {phone.label ?? phone.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-1 justify-end">
                  <Button
                    disabled={
                      !(
                        messageText.trim() &&
                        selectedConversation &&
                        selectedSender
                      ) ||
                      companyPhones.length === 0 ||
                      isSending
                    }
                    onClick={handleSendMessage}
                    type="button"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Sending
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 size-4" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mb-2 text-muted-foreground">
              Select a conversation to start messaging
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MessageBubble({
  message,
  showAvatar,
  contactInitials,
}: {
  message: ThreadMessage;
  showAvatar: boolean;
  contactInitials: string;
}) {
  const isSent = message.direction === "sent";

  return (
    <div className={cn("flex items-end gap-2", isSent && "flex-row-reverse")}>
      {/* Avatar (for received messages) */}
      {!isSent && (
        <Avatar className="size-8">
          {showAvatar ? (
            <AvatarFallback className="text-xs">
              {contactInitials}
            </AvatarFallback>
          ) : (
            <div className="size-8" />
          )}
        </Avatar>
      )}

      {/* Message Content */}
      <div className={cn("max-w-[70%] space-y-1", isSent && "items-end")}>
        {/* Media Attachments */}
        {message.media && message.media.length > 0 && (
          <div className="space-y-2">
            {message.media.map((item, index) => (
              <MediaAttachment key={index} media={item} />
            ))}
          </div>
        )}

        {/* Text Message */}
        {message.content && (
          <Card
            className={cn(
              "relative",
              isSent ? "bg-primary text-primary-foreground" : "bg-background"
            )}
          >
            <CardContent className="p-3">
              <p className="whitespace-pre-wrap break-words text-sm">
                {message.content}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Message Footer */}
        <div
          className={cn(
            "flex items-center gap-1 px-1 text-muted-foreground text-xs",
            isSent && "justify-end"
          )}
        >
          <span>{formatMessageTime(message.timestamp)}</span>
          {isSent && <MessageStatusIcon status={message.status} />}
        </div>
      </div>

      {/* Spacer for sent messages */}
      {isSent && <div className="size-8" />}
    </div>
  );
}

function MediaAttachment({
  media,
}: {
  media: NonNullable<ThreadMessage["media"]>[0];
}) {
  if (media.type === "image") {
    return (
      <Card className="overflow-hidden">
        <Image
          alt="Attachment"
          className="max-h-64 w-full object-cover"
          height={360}
          src={media.thumbnail || media.url}
          width={640}
        />
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        {media.type === "video" ? (
          <Video className="size-10 text-muted-foreground" />
        ) : (
          <File className="size-10 text-muted-foreground" />
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium text-sm">
            {media.fileName || "Attachment"}
          </div>
          {media.fileSize && (
            <div className="text-muted-foreground text-xs">
              {formatFileSize(media.fileSize)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MessageStatusIcon({ status }: { status: MessageStatus }) {
  switch (status) {
    case "sending":
      return <Clock className="size-3" />;
    case "sent":
      return <Check className="size-3" />;
    case "delivered":
      return <CheckCheck className="size-3" />;
    case "read":
      return <CheckCheck className="size-3 text-primary" />;
    case "failed":
      return <span className="text-destructive">!</span>;
  }
}

// Helper functions
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "Now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)
    return date.toLocaleDateString("en-US", { weekday: "short" });

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / k ** i) * 100) / 100 + " " + sizes[i];
}

function mapOutboundCommunicationRecord(
  data: Record<string, unknown>,
  thread: ConversationThread,
  fromNumber: string
): CommunicationRecord {
  const createdAt =
    (data.created_at as string | undefined) ?? new Date().toISOString();
  const fromAddress =
    (data.from_address as string | undefined) ?? fromNumber ?? null;
  const toAddress =
    (data.to_address as string | undefined) ??
    thread.contactNumberRaw ??
    thread.contactNumber;

  return {
    id: String(data.id),
    type: (data.type as string) ?? "sms",
    direction:
      ((data.direction as string) ?? "outbound") === "inbound"
        ? "inbound"
        : "outbound",
    status: (data.status as string) ?? "queued",
    priority: ((data.priority as string) ?? null) as string | null,
    subject: (data.subject as string) ?? null,
    body: (data.body as string) ?? "",
    created_at: createdAt,
    read_at: (data.read_at as string | null) ?? null,
    from_address: fromAddress,
    to_address: toAddress,
    customer_id:
      thread.customerId ?? (data.customer_id as string | null) ?? null,
    phone_number_id: (data.phone_number_id as string | null) ?? null,
    job_id: (data.job_id as string | null) ?? null,
    property_id: (data.property_id as string | null) ?? null,
    invoice_id: (data.invoice_id as string | null) ?? null,
    estimate_id: (data.estimate_id as string | null) ?? null,
    call_duration: (data.call_duration as number | null) ?? null,
    customer: thread.customerId
      ? {
          id: thread.customerId,
          first_name: thread.contactName,
          last_name: null,
        }
      : null,
    telnyx_call_control_id:
      (data.telnyx_call_control_id as string | null) ?? null,
    telnyx_call_session_id:
      (data.telnyx_call_session_id as string | null) ?? null,
    call_recording_url: (data.call_recording_url as string | null) ?? null,
    provider_metadata:
      (data.provider_metadata as Record<string, unknown> | null) ?? null,
  };
}

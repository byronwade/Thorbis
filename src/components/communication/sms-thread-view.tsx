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

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Search,
  Image as ImageIcon,
  File,
  Check,
  CheckCheck,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Message types
type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";
type MessageDirection = "sent" | "received";
type MediaType = "image" | "video" | "file";

type Message = {
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

type Conversation = {
  id: string;
  contactName: string;
  contactNumber: string;
  contactInitials: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isPinned?: boolean;
};

// Mock data
const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    contactName: "Sarah Johnson",
    contactNumber: "+18314306011",
    contactInitials: "SJ",
    lastMessage: "Thanks for the quick response!",
    lastMessageTime: "2025-01-31T10:30:00Z",
    unreadCount: 2,
    isPinned: true,
  },
  {
    id: "conv-2",
    contactName: "John Smith",
    contactNumber: "+14155551234",
    contactInitials: "JS",
    lastMessage: "What time works for you tomorrow?",
    lastMessageTime: "2025-01-31T09:15:00Z",
    unreadCount: 0,
  },
  {
    id: "conv-3",
    contactName: "Mike Davis",
    contactNumber: "+12125555678",
    contactInitials: "MD",
    lastMessage: "Perfect, see you then!",
    lastMessageTime: "2025-01-30T16:45:00Z",
    unreadCount: 0,
  },
];

const mockMessages: Message[] = [
  {
    id: "msg-1",
    conversationId: "conv-1",
    direction: "received",
    content: "Hi, I'm interested in scheduling an AC maintenance appointment.",
    timestamp: "2025-01-31T10:00:00Z",
    status: "read",
  },
  {
    id: "msg-2",
    conversationId: "conv-1",
    direction: "sent",
    content: "Hello Sarah! We'd be happy to help. What day works best for you?",
    timestamp: "2025-01-31T10:05:00Z",
    status: "read",
  },
  {
    id: "msg-3",
    conversationId: "conv-1",
    direction: "received",
    content: "Would next Tuesday work? Around 2 PM?",
    timestamp: "2025-01-31T10:10:00Z",
    status: "read",
  },
  {
    id: "msg-4",
    conversationId: "conv-1",
    direction: "sent",
    content: "Tuesday at 2 PM works great! I've scheduled you with our technician.",
    timestamp: "2025-01-31T10:15:00Z",
    status: "read",
  },
  {
    id: "msg-5",
    conversationId: "conv-1",
    direction: "sent",
    content: "Here's a photo of what we'll be checking:",
    timestamp: "2025-01-31T10:16:00Z",
    status: "delivered",
    media: [
      {
        type: "image",
        url: "/demo/ac-unit.jpg",
        thumbnail: "/demo/ac-unit-thumb.jpg",
      },
    ],
  },
  {
    id: "msg-6",
    conversationId: "conv-1",
    direction: "received",
    content: "Thanks for the quick response!",
    timestamp: "2025-01-31T10:30:00Z",
    status: "read",
  },
];

export function SMSThreadView() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    mockConversations[0]
  );
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    // Here you would send the message via server action
    console.log("Sending message:", messageText);

    setMessageText("");
  };

  const messages = selectedConversation
    ? mockMessages.filter((m) => m.conversationId === selectedConversation.id)
    : [];

  return (
    <div className="flex h-full">
      {/* Conversations List */}
      <div className="w-80 border-r">
        {/* Search */}
        <div className="border-b p-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-9" />
          </div>
        </div>

        {/* Conversation List */}
        <div className="divide-y overflow-auto">
          {mockConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={cn(
                "flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-muted/50",
                selectedConversation?.id === conv.id && "bg-muted"
              )}
            >
              <Avatar className="mt-1">
                <AvatarFallback>{conv.contactInitials}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium">{conv.contactName}</span>
                  {conv.lastMessageTime && (
                    <span className="text-xs text-muted-foreground">
                      {formatTime(conv.lastMessageTime)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <p className="line-clamp-1 text-sm text-muted-foreground">
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
          ))}
        </div>
      </div>

      {/* Conversation Thread */}
      {selectedConversation ? (
        <div className="flex flex-1 flex-col">
          {/* Conversation Header */}
          <div className="flex items-center justify-between border-b bg-background px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{selectedConversation.contactInitials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{selectedConversation.contactName}</div>
                <div className="text-xs text-muted-foreground">
                  {selectedConversation.contactNumber}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="size-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="size-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Contact</DropdownMenuItem>
                  <DropdownMenuItem>Search Messages</DropdownMenuItem>
                  <DropdownMenuItem>Export Conversation</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Delete Conversation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto bg-muted/20 p-4">
            <div className="mx-auto max-w-4xl space-y-4">
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  showAvatar={
                    index === 0 ||
                    messages[index - 1].direction !== message.direction
                  }
                  contactInitials={selectedConversation.contactInitials}
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
            <div className="mx-auto flex max-w-4xl items-end gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="size-4" />
              </Button>

              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1"
              />

              <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mb-2 text-muted-foreground">Select a conversation to start messaging</div>
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
  message: Message;
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
            <AvatarFallback className="text-xs">{contactInitials}</AvatarFallback>
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
              isSent
                ? "bg-primary text-primary-foreground"
                : "bg-background"
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
            "flex items-center gap-1 px-1 text-xs text-muted-foreground",
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

function MediaAttachment({ media }: { media: NonNullable<Message["media"]>[0] }) {
  if (media.type === "image") {
    return (
      <Card className="overflow-hidden">
        <img
          src={media.thumbnail || media.url}
          alt="Attachment"
          className="max-h-64 w-full object-cover"
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
          <div className="truncate font-medium text-sm">{media.fileName || "Attachment"}</div>
          {media.fileSize && (
            <div className="text-xs text-muted-foreground">
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
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return date.toLocaleDateString("en-US", { weekday: "short" });

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
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

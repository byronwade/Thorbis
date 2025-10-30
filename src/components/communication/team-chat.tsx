"use client";

/**
 * Team Chat Component - Client Component
 *
 * Client-side features:
 * - Real-time messaging interface
 * - Message sending and receiving
 * - User presence and typing indicators
 */

import { Hash, MoreVertical, Paperclip, Send, Smile } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type Message = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  reactions?: { emoji: string; count: number; users: string[] }[];
};

type TeamChatProps = {
  channelName: string;
  channelDescription?: string;
};

// Calculate timestamps once at module load time to prevent re-renders
const NOW = Date.now();

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    userId: "1",
    userName: "John Smith",
    content: "Good morning team! Ready for the busy day ahead?",
    timestamp: new Date(NOW - 3_600_000 * 2),
    reactions: [{ emoji: "👍", count: 3, users: ["2", "3", "4"] }],
  },
  {
    id: "2",
    userId: "2",
    userName: "Sarah Johnson",
    content:
      "Morning! I've updated the schedule for today's appointments. Everyone should check their calendars.",
    timestamp: new Date(NOW - 3_600_000 * 1.5),
  },
  {
    id: "3",
    userId: "3",
    userName: "Mike Davis",
    content:
      "Thanks Sarah! I see I have 3 appointments today. All confirmed with customers.",
    timestamp: new Date(NOW - 3_600_000),
    reactions: [{ emoji: "✅", count: 1, users: ["2"] }],
  },
  {
    id: "4",
    userId: "4",
    userName: "Emma Wilson",
    content:
      "Quick question - has anyone seen the new price book updates? I can't find the labor rates for HVAC installation.",
    timestamp: new Date(NOW - 1_800_000),
  },
  {
    id: "5",
    userId: "1",
    userName: "John Smith",
    content:
      "Emma - check the settings page. We moved all pricebook management there last week. The labor rates should be under Services > HVAC.",
    timestamp: new Date(NOW - 900_000),
    reactions: [{ emoji: "🙏", count: 1, users: ["4"] }],
  },
];

export function TeamChat({ channelName, channelDescription }: TeamChatProps) {
  const [message, setMessage] = useState("");
  const [messages] = useState<Message[]>(MOCK_MESSAGES);

  const handleSend = () => {
    if (!message.trim()) return;
    // Handle message send
    setMessage("");
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3_600_000);

    if (hours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Channel Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="font-semibold text-lg">{channelName}</h2>
              {channelDescription && (
                <p className="text-muted-foreground text-sm">
                  {channelDescription}
                </p>
              )}
            </div>
          </div>
          <Button size="icon" variant="ghost">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, index) => {
            const showAvatar =
              index === 0 ||
              messages[index - 1]?.userId !== msg.userId ||
              msg.timestamp.getTime() -
                messages[index - 1]?.timestamp.getTime() >
                300_000;

            return (
              <div
                className={`flex gap-3 ${showAvatar ? "mt-4" : "mt-1"}`}
                key={msg.id}
              >
                {showAvatar ? (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {msg.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-8" />
                )}

                <div className="min-w-0 flex-1">
                  {showAvatar && (
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {msg.userName}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {formatTimestamp(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  <div className="group relative">
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="mt-1 flex gap-1">
                        {msg.reactions.map((reaction, idx) => (
                          <button
                            className="flex items-center gap-1 rounded-full border bg-muted/50 px-2 py-0.5 text-xs transition-colors hover:bg-muted"
                            key={idx}
                            type="button"
                          >
                            <span>{reaction.emoji}</span>
                            <span>{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <Separator />

      {/* Message Input */}
      <div className="p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <Input
              className="resize-none"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Message #${channelName}`}
              value={message}
            />
            <div className="flex items-center gap-1">
              <Button size="icon" type="button" variant="ghost">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button size="icon" type="button" variant="ghost">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

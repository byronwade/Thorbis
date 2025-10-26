"use client";

export const dynamic = "force-dynamic";

import {
  Archive,
  Forward,
  Inbox,
  Mail,
  MessageSquare,
  MoreVertical,
  Phone,
  Reply,
  Search,
  Send,
  Star,
  Tag,
  Ticket,
  Trash2,
  Users,
  Hash,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { usePageLayout } from "@/hooks/use-page-layout";
import { CompanyFeed } from "@/components/communication/company-feed";

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

const MOCK_MESSAGES: UnifiedMessage[] = [
  {
    id: "1",
    type: "email",
    from: "John Smith",
    fromEmail: "john.smith@example.com",
    subject: "Question about invoice #1234",
    preview:
      "Hi, I have a question regarding the invoice I received yesterday. The total seems to be higher than expected...",
    timestamp: new Date(Date.now() - MS_PER_MINUTE * MINUTES_AGO_15),
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
    timestamp: new Date(Date.now() - MS_PER_MINUTE * MINUTES_AGO_45),
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
    timestamp: new Date(Date.now() - MS_PER_MINUTE * MINUTES_AGO_120),
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
    timestamp: new Date(Date.now() - MS_PER_MINUTE * MINUTES_AGO_180),
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
    timestamp: new Date(Date.now() - MS_PER_MINUTE * MINUTES_AGO_240),
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
    timestamp: new Date(Date.now() - MS_PER_MINUTE * MINUTES_AGO_300),
    status: "unread",
    priority: "low",
    tags: ["follow-up"],
  },
];

type CommunicationMode = "inbox" | "feed";

export default function CommunicationPage() {
  const [communicationMode, setCommunicationMode] = useState<CommunicationMode>("inbox");
  const [selectedMessage, setSelectedMessage] = useState<UnifiedMessage | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MessageStatus | "all">(
    "all"
  );
  const [typeFilter, setTypeFilter] = useState<MessageType | "all">("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  // Calculate counts for filters
  const statusCounts = {
    all: MOCK_MESSAGES.length,
    unread: MOCK_MESSAGES.filter((m) => m.status === "unread").length,
    read: MOCK_MESSAGES.filter((m) => m.status === "read").length,
    replied: MOCK_MESSAGES.filter((m) => m.status === "replied").length,
    archived: MOCK_MESSAGES.filter((m) => m.status === "archived").length,
  };

  const typeCounts = {
    all: MOCK_MESSAGES.length,
    email: MOCK_MESSAGES.filter((m) => m.type === "email").length,
    sms: MOCK_MESSAGES.filter((m) => m.type === "sms").length,
    phone: MOCK_MESSAGES.filter((m) => m.type === "phone").length,
    ticket: MOCK_MESSAGES.filter((m) => m.type === "ticket").length,
  };

  const tagCounts = {
    customer: MOCK_MESSAGES.filter((m) => m.tags?.includes("customer")).length,
    sales: MOCK_MESSAGES.filter((m) => m.tags?.includes("sales")).length,
    billing: MOCK_MESSAGES.filter((m) => m.tags?.includes("billing")).length,
    technical: MOCK_MESSAGES.filter((m) => m.tags?.includes("technical"))
      .length,
  };

  // Configure layout with sidebar filters
  usePageLayout({
    maxWidth: "full",
    padding: "md",
    gap: "none",
    showToolbar: true,
    sidebar: {
      groups: [
        // Communication Mode Selector (always visible)
        {
          label: undefined,
          items: [
            {
              mode: "filter" as const,
              title: "Inbox",
              value: "mode:inbox",
              icon: Inbox,
              count: statusCounts.unread,
            },
            {
              mode: "filter" as const,
              title: "Company Feed",
              value: "mode:feed",
              icon: Hash,
            },
          ],
        },
        // Inbox filters (only show in inbox mode)
        ...(communicationMode === "inbox" ? [
        {
          label: "Status",
          items: [
            {
              mode: "filter" as const,
              title: "All Messages",
              value: "status:all",
              icon: Inbox,
              count: statusCounts.all,
            },
            {
              mode: "filter" as const,
              title: "Unread",
              value: "status:unread",
              icon: Mail,
              count: statusCounts.unread,
            },
            {
              mode: "filter" as const,
              title: "Read",
              value: "status:read",
              icon: Mail,
              count: statusCounts.read,
            },
            {
              mode: "filter" as const,
              title: "Replied",
              value: "status:replied",
              icon: Send,
              count: statusCounts.replied,
            },
            {
              mode: "filter" as const,
              title: "Archived",
              value: "status:archived",
              icon: Archive,
              count: statusCounts.archived,
            },
          ],
        },
        {
          label: "Message Type",
          items: [
            {
              mode: "filter" as const,
              title: "All Types",
              value: "type:all",
              icon: MessageSquare,
              count: typeCounts.all,
            },
            {
              mode: "filter" as const,
              title: "Email",
              value: "type:email",
              icon: Mail,
              count: typeCounts.email,
            },
            {
              mode: "filter" as const,
              title: "SMS",
              value: "type:sms",
              icon: MessageSquare,
              count: typeCounts.sms,
            },
            {
              mode: "filter" as const,
              title: "Calls",
              value: "type:phone",
              icon: Phone,
              count: typeCounts.phone,
            },
            {
              mode: "filter" as const,
              title: "Tickets",
              value: "type:ticket",
              icon: Ticket,
              count: typeCounts.ticket,
            },
          ],
        },
        {
          label: "Tags",
          items: [
            {
              mode: "filter" as const,
              title: "Customer",
              value: "tag:customer",
              icon: Tag,
              count: tagCounts.customer,
            },
            {
              mode: "filter" as const,
              title: "Sales",
              value: "tag:sales",
              icon: Tag,
              count: tagCounts.sales,
            },
            {
              mode: "filter" as const,
              title: "Billing",
              value: "tag:billing",
              icon: Tag,
              count: tagCounts.billing,
            },
            {
              mode: "filter" as const,
              title: "Technical",
              value: "tag:technical",
              icon: Tag,
              count: tagCounts.technical,
            },
          ],
        },
        ] : [
          // Feed Mode - Show Channels
          {
            label: "Channels",
            items: [
              {
                mode: "filter" as const,
                title: "# company-feed",
                value: "channel:company-feed",
                icon: Hash,
                count: 127,
              },
              {
                mode: "filter" as const,
                title: "# announcements",
                value: "channel:announcements",
                icon: Hash,
                count: 45,
              },
              {
                mode: "filter" as const,
                title: "# general",
                value: "channel:general",
                icon: Hash,
                count: 89,
              },
              {
                mode: "filter" as const,
                title: "# training",
                value: "channel:training",
                icon: Hash,
                count: 34,
              },
              {
                mode: "filter" as const,
                title: "# field-tips",
                value: "channel:field-tips",
                icon: Hash,
                count: 56,
              },
            ],
          },
          {
            label: "Direct Messages",
            items: [
              {
                mode: "filter" as const,
                title: "Sarah Johnson",
                value: "dm:sarah",
                icon: Users,
                count: 3,
              },
              {
                mode: "filter" as const,
                title: "Mike Chen",
                value: "dm:mike",
                icon: Users,
              },
              {
                mode: "filter" as const,
                title: "David Martinez",
                value: "dm:david",
                icon: Users,
                count: 1,
              },
            ],
          },
        ]),
      ],
      defaultValue: communicationMode === "inbox" ? "status:all" : "channel:company-feed",
      activeValue: (() => {
        if (communicationMode === "feed") {
          return "mode:feed";
        }
        if (tagFilter) {
          return `tag:${tagFilter}`;
        }
        if (typeFilter !== "all") {
          return `type:${typeFilter}`;
        }
        return `status:${statusFilter}`;
      })(),
      onValueChange: (value) => {
        // Parse filter type from value
        if (value.startsWith("mode:")) {
          const mode = value.replace("mode:", "") as CommunicationMode;
          setCommunicationMode(mode);
        } else if (value.startsWith("status:")) {
          const status = value.replace("status:", "") as MessageStatus | "all";
          setStatusFilter(status);
          setTypeFilter("all");
          setTagFilter(null);
        } else if (value.startsWith("type:")) {
          const type = value.replace("type:", "") as MessageType | "all";
          setTypeFilter(type);
          setTagFilter(null);
        } else if (value.startsWith("tag:")) {
          setTagFilter(value.replace("tag:", ""));
        }
      },
    },
  });

  const filteredMessages = MOCK_MESSAGES.filter((msg) => {
    const searchMatch =
      searchQuery === "" ||
      msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = statusFilter === "all" || msg.status === statusFilter;
    const typeMatch = typeFilter === "all" || msg.type === typeFilter;
    const tagMatch = tagFilter === null || msg.tags?.includes(tagFilter);
    return searchMatch && statusMatch && typeMatch && tagMatch;
  });

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
    <div className="flex h-full flex-col">
      {communicationMode === "inbox" ? (
        // Inbox View
        <div className="flex flex-1 overflow-hidden">
        <div className="flex w-96 flex-col border-r">
          <div className="border-b p-4">
            <div className="relative">
              <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                value={searchQuery}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="flex h-full items-center justify-center p-8 text-center">
                <div className="space-y-2">
                  <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="font-medium text-sm">No messages found</p>
                  <p className="text-muted-foreground text-xs">
                    Try adjusting your filters
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y">
                {filteredMessages.map((message) => (
                  <button
                    className={`w-full p-4 text-left transition-colors hover:bg-muted/50 ${selectedMessage?.id === message.id ? "bg-muted" : ""} ${message.status === "unread" ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}`}
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    type="button"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {message.from
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          {getMessageIcon(message.type)}
                          <span
                            className={`truncate font-medium text-sm ${message.status === "unread" ? "font-semibold" : ""}`}
                          >
                            {message.from}
                          </span>
                          <span className="ml-auto whitespace-nowrap text-muted-foreground text-xs">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>

                        {message.subject && (
                          <p
                            className={`truncate text-sm ${message.status === "unread" ? "font-semibold" : ""}`}
                          >
                            {message.subject}
                          </p>
                        )}

                        <p className="line-clamp-2 text-muted-foreground text-xs">
                          {message.preview}
                        </p>

                        <div className="flex flex-wrap items-center gap-1 pt-1">
                          <Badge
                            className="text-xs"
                            variant={getPriorityColor(message.priority)}
                          >
                            {message.priority}
                          </Badge>
                          {message.tags?.map((tag) => (
                            <Badge
                              className="text-xs"
                              key={tag}
                              variant="outline"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {message.attachments && (
                            <span className="ml-auto text-muted-foreground text-xs">
                              📎 {message.attachments}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col bg-background">
          {selectedMessage ? (
            <>
              <div className="border-b p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getMessageIcon(selectedMessage.type)}
                      <h2 className="font-semibold text-lg">
                        {selectedMessage.subject ||
                          `${selectedMessage.type.charAt(0).toUpperCase() + selectedMessage.type.slice(1)} from ${selectedMessage.from}`}
                      </h2>
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
                        {selectedMessage.fromPhone && (
                          <span className="text-xs">
                            ({selectedMessage.fromPhone})
                          </span>
                        )}
                      </div>
                      <span>•</span>
                      <span>{selectedMessage.timestamp.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <Card>
                  <CardContent className="p-6">
                    <p className="leading-relaxed">{selectedMessage.preview}</p>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      This is additional message content that would typically
                      contain the full message body. In a real application, this
                      would display the complete email, SMS message, voicemail
                      transcription, or ticket details based on the message
                      type.
                    </p>

                    {selectedMessage.attachments && (
                      <div className="mt-6">
                        <Separator className="mb-4" />
                        <h3 className="mb-2 font-medium text-sm">
                          Attachments ({selectedMessage.attachments})
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 rounded-md border p-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                              📄
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                invoice-1234.pdf
                              </p>
                              <p className="text-muted-foreground text-xs">
                                245 KB
                              </p>
                            </div>
                            <Button size="sm" variant="ghost">
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedMessage.tags &&
                      selectedMessage.tags.length > 0 && (
                        <div className="mt-6">
                          <Separator className="mb-4" />
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
                  </CardContent>
                </Card>
              </div>

              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Reply className="mr-2 h-4 w-4" />
                    Reply
                  </Button>
                  <Button className="flex-1" variant="outline">
                    <Forward className="mr-2 h-4 w-4" />
                    Forward
                  </Button>
                  <Button variant="outline">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center">
              <div className="space-y-4">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">No message selected</h3>
                  <p className="text-muted-foreground text-sm">
                    Select a message from the list to view its contents
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      ) : (
        // Company Feed View
        <CompanyFeed />
      )}
    </div>
  );
}

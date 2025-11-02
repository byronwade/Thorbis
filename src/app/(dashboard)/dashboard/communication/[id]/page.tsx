/**
 * Email Detail Page - Server Component
 *
 * Shows full email/message details with actions
 *
 * Performance optimizations:
 * - Server Component by default
 * - Direct async/await for data fetching
 * - URL-based navigation (shareable/bookmarkable)
 */

import {
  Archive,
  Mail,
  MessageSquare,
  Phone,
  Star,
  Ticket,
  Trash2,
} from "lucide-react";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

// Mock data - in production, this would come from database
const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE;
const MINUTES_AGO_15 = 15;
const MINUTES_AGO_45 = 45;
const MINUTES_AGO_120 = 120;
const MINUTES_AGO_180 = 180;
const MINUTES_AGO_240 = 240;
const MINUTES_AGO_300 = 300;

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
    fullContent: `Hi,

I have a question regarding the invoice I received yesterday. The total seems to be higher than expected.

Could you please provide a breakdown of the charges? I want to make sure everything is correct before I process the payment.

Also, I noticed there's a line item for "emergency service fee" - I wasn't aware this appointment was classified as an emergency call. Could you clarify this?

Thank you for your help!

Best regards,
John Smith`,
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
    fullContent: `Voicemail transcription:

"Hi, this is Sarah Johnson. I got your number from Mike Thompson who said you did great work on his AC system. I'm looking to get a new AC unit installed in my home, and I was wondering if you have any availability next week? My old unit finally died, and with this heat wave, we really need to get something installed soon. Please give me a call back at (555) 123-4567. Thanks!"

Call received: ${new Date(NOW - MS_PER_MINUTE * MINUTES_AGO_45).toLocaleString()}
Duration: 52 seconds`,
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
    fullContent: `I scheduled a service for tomorrow but I can't see it in my customer portal. Can you help me confirm the appointment?

I received a confirmation email right after booking, but when I log into the customer portal, it shows no upcoming appointments. I want to make sure my technician visit for tomorrow at 2 PM is still scheduled.

My account email is mike.davis@example.com and the confirmation number was #WO-45612.

Please let me know as soon as possible so I can make arrangements to be home.`,
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
    fullContent: `Thanks for the great service yesterday! The technician was very professional. Do you offer annual maintenance plans?

I'd like to make sure my HVAC system is checked regularly to avoid any issues like the one we just had. Let me know what options you have!`,
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
    fullContent: `Hi,

I need to reschedule my Friday 2pm appointment due to a work conflict that just came up.

Would you have any availability on Monday or Tuesday next week? I'm flexible with the time, preferably afternoon if possible.

Please let me know what times work for you.

Thanks,
Robert Brown
(555) 234-5678`,
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
    fullContent: `Missed call - no voicemail left

Phone: (555) 456-7890
Time: ${new Date(NOW - MS_PER_MINUTE * MINUTES_AGO_300).toLocaleString()}

Customer history: Lisa Anderson - Previous service 3 months ago (AC tune-up)

No voicemail was left. May want to follow up to see if they need additional service.`,
    timestamp: new Date(NOW - MS_PER_MINUTE * MINUTES_AGO_300),
    status: "unread",
    priority: "low",
    tags: ["follow-up"],
  },
];

function getMessageIcon(type: MessageType) {
  switch (type) {
    case "email":
      return <Mail className="size-5" />;
    case "sms":
      return <MessageSquare className="size-5" />;
    case "phone":
      return <Phone className="size-5" />;
    case "ticket":
      return <Ticket className="size-5" />;
    default:
      return <MessageSquare className="size-5" />;
  }
}

function getPriorityColor(priority: string) {
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
}

export default async function EmailDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // In production, fetch from database
  // const message = await fetchMessageById(id);
  const message = MOCK_MESSAGES.find((m) => m.id === id);

  if (!message) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col">
      {/* Message Header */}
      <div className="border-b bg-background p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              {getMessageIcon(message.type)}
              <h1 className="font-semibold text-2xl">
                {message.subject ||
                  `${message.type.charAt(0).toUpperCase() + message.type.slice(1)} from ${message.from}`}
              </h1>
              <Badge variant={getPriorityColor(message.priority)}>
                {message.priority}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {message.from
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-foreground">
                    {message.from}
                  </div>
                  {message.fromEmail && (
                    <div className="text-xs">{message.fromEmail}</div>
                  )}
                  {message.fromPhone && (
                    <div className="text-xs">{message.fromPhone}</div>
                  )}
                </div>
              </div>
              <span>•</span>
              <span>{message.timestamp.toLocaleString()}</span>
              {message.assignedTo && (
                <>
                  <span>•</span>
                  <span>Assigned to: {message.assignedTo}</span>
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Star className="mr-2 size-4" />
              Star
            </Button>
            <Button size="sm" variant="outline">
              <Archive className="mr-2 size-4" />
              Archive
            </Button>
            <Button size="sm" variant="outline">
              <Trash2 className="mr-2 size-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Tags */}
          {message.tags && message.tags.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium text-sm">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {message.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {message.attachments && message.attachments > 0 && (
            <div>
              <h3 className="mb-2 font-medium text-sm">
                Attachments ({message.attachments})
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">📎 invoice.pdf</Badge>
              </div>
            </div>
          )}

          {/* Message body */}
          <div className="rounded-lg border bg-card p-6">
            <div className="whitespace-pre-wrap font-normal text-sm leading-relaxed">
              {message.fullContent || message.preview}
            </div>
          </div>

          {/* Reply section */}
          <div className="border-t pt-6">
            <h3 className="mb-4 font-medium">Reply</h3>
            <div className="space-y-3">
              <textarea
                className="min-h-32 w-full rounded-lg border bg-background p-3 text-sm"
                placeholder="Type your reply..."
              />
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Attach File
                  </Button>
                  <Button size="sm" variant="outline">
                    Add Template
                  </Button>
                </div>
                <Button size="sm">Send Reply</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

/**
 * SMS View Component - Client Component
 * WhatsApp-style threaded messaging interface
 *
 * Client-side features:
 * - Threaded conversations
 * - Send/receive SMS and MMS
 * - Message status indicators
 * - Media attachments
 */

import { SMSThreadView } from "./sms-thread-view";

type SMSMessage = {
  id: string;
  from: string;
  fromPhone?: string;
  preview: string;
  timestamp: Date;
  status: "unread" | "read" | "replied" | "archived";
  priority: "low" | "normal" | "high" | "urgent";
  tags?: string[];
  unreadCount?: number;
};

type SMSViewProps = {
  messages: SMSMessage[];
};

export function SMSView({ messages }: SMSViewProps) {
  // Use the new threaded view instead of the old list view
  return <SMSThreadView />;
}

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

import { SMSThreadView, type ConversationThread } from "./sms-thread-view";

type SMSViewProps = {
  threads: ConversationThread[];
};

export function SMSView({ threads }: SMSViewProps) {
  return <SMSThreadView threads={threads} />;
}

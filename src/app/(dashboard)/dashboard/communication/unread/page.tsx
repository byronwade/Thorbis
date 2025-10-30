/**
 * Unread Messages Page - Client Component
 *
 * Client-side features:
 * - Interactive message filtering for unread items
 * - State management for message selection
 */

import { MessageSquare } from "lucide-react";

export default function UnreadMessagesPage() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="space-y-4 text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Unread Messages</h3>
          <p className="text-muted-foreground text-sm">
            View all your unread messages from email, SMS, phone calls, and
            tickets
          </p>
        </div>
      </div>
    </div>
  );
}

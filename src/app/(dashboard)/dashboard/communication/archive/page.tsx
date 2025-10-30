/**
 * Archived Messages Page - Client Component
 *
 * Client-side features:
 * - Interactive message filtering for archived items
 * - State management for message selection
 */

import { Archive } from "lucide-react";

export default function ArchivedMessagesPage() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="space-y-4 text-center">
        <Archive className="mx-auto h-12 w-12 text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Archived Messages</h3>
          <p className="text-muted-foreground text-sm">
            Messages you've archived to keep your inbox clean
          </p>
        </div>
      </div>
    </div>
  );
}

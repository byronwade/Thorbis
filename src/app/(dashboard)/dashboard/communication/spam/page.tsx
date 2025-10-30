/**
 * Spam Page - Client Component
 *
 * Client-side features:
 * - Interactive message filtering for spam items
 * - State management for message restoration
 */

import { ShieldAlert } from "lucide-react";

export default function SpamPage() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="space-y-4 text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Spam</h3>
          <p className="text-muted-foreground text-sm">
            Messages marked as spam are automatically filtered here
          </p>
        </div>
      </div>
    </div>
  );
}

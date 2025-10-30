/**
 * Trash Page - Client Component
 *
 * Client-side features:
 * - Interactive message filtering for deleted items
 * - State management for message restoration
 */

import { Trash2 } from "lucide-react";

export default function TrashPage() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="space-y-4 text-center">
        <Trash2 className="mx-auto h-12 w-12 text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Trash</h3>
          <p className="text-muted-foreground text-sm">
            Deleted messages will be permanently removed after 30 days
          </p>
        </div>
      </div>
    </div>
  );
}

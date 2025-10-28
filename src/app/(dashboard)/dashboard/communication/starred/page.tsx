"use client";

/**
 * Starred Messages Page - Client Component
 *
 * Client-side features:
 * - Interactive message filtering for starred items
 * - State management for message selection
 */

import { Star } from "lucide-react";

export default function StarredMessagesPage() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="space-y-4 text-center">
        <Star className="mx-auto h-12 w-12 text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Starred Messages</h3>
          <p className="text-muted-foreground text-sm">
            Important messages you've starred for quick access
          </p>
        </div>
      </div>
    </div>
  );
}

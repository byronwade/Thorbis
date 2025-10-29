"use client";

/**
 * Communication Toolbar Actions - Client Component
 * Displays context-aware action buttons in the global toolbar
 *
 * Client-side features:
 * - Uses Zustand store to determine active tab
 * - Shows different action button based on active filter
 * - Renders in global app-toolbar, not in page content
 * - Automatic re-render only when activeFilter changes
 */

import { MessageSquare, Pencil, Phone, Plus, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommunicationStore } from "@/lib/stores/communication-store";

export function CommunicationToolbarActions() {
  const activeFilter = useCommunicationStore((state) => state.activeFilter);

  // Return appropriate button based on active filter
  switch (activeFilter) {
    case "email":
      return (
        <Button size="sm" variant="default">
          <Pencil className="mr-2 h-4 w-4" />
          Compose
        </Button>
      );
    case "sms":
      return (
        <Button size="sm" variant="default">
          <MessageSquare className="mr-2 h-4 w-4" />
          New Text
        </Button>
      );
    case "phone":
      return (
        <Button size="sm" variant="default">
          <Phone className="mr-2 h-4 w-4" />
          New Call
        </Button>
      );
    case "ticket":
      return (
        <Button size="sm" variant="default">
          <Ticket className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      );
    default:
      return (
        <Button size="sm" variant="default">
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      );
  }
}

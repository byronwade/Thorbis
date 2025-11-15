"use client";

/**
 * SMS View Component - Client Component
 * Displays SMS conversations using shared FullWidthDataTable
 */

import { Archive, MessageCircle, MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type ColumnDef,
  FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { useToast } from "@/hooks/use-toast";
import { useCommunicationStore } from "@/lib/stores/communication-store";

type SMSMessage = {
  id: string;
  from: string;
  fromPhone?: string;
  toPhone?: string;
  preview: string;
  timestamp: Date;
  status: "unread" | "read" | "replied" | "archived";
  direction: "inbound" | "outbound";
  customerId?: string | null;
};

type SMSViewProps = {
  messages: SMSMessage[];
};

export function SMSView({ messages }: SMSViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const setSelectedMessageId = useCommunicationStore(
    (state) => state.setSelectedMessageId
  );
  const setIsDetailView = useCommunicationStore(
    (state) => state.setIsDetailView
  );
  const openComposer = useCommunicationStore((state) => state.openComposer);

  const handleOpenMessage = (message: SMSMessage) => {
    setSelectedMessageId(message.id);
    setIsDetailView(true);
    router.push(`/dashboard/communication/${message.id}`);
  };

  const handleReply = (event: React.MouseEvent, message: SMSMessage) => {
    event.stopPropagation();
    const phoneNumber =
      message.direction === "inbound"
        ? message.fromPhone || message.from
        : message.toPhone || message.from;
    openComposer("sms", {
      customerId: message.customerId || undefined,
      phone: phoneNumber,
      customerName: message.from,
    });
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

  const columns: ColumnDef<SMSMessage>[] = [
    {
      key: "contact",
      header: "Contact",
      width: "w-64",
      render: (message) => (
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <MessageCircle className="size-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-medium text-sm ${message.status === "unread" ? "font-semibold" : ""}`}
            >
              {message.from}
            </span>
            {(message.fromPhone || message.toPhone) && (
              <span className="text-muted-foreground text-xs">
                {message.direction === "inbound"
                  ? message.fromPhone
                  : message.toPhone}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "message",
      header: "Message",
      width: "flex-1",
      render: (message) => (
        <p className="line-clamp-1 text-muted-foreground text-xs">
          {message.preview}
        </p>
      ),
    },
    {
      key: "direction",
      header: "Direction",
      width: "w-28",
      render: (message) => (
        <Badge
          className="capitalize"
          variant={message.direction === "inbound" ? "secondary" : "outline"}
        >
          {message.direction}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-24",
      render: (message) => (
        <span className="text-muted-foreground text-xs capitalize">
          {message.status}
        </span>
      ),
    },
    {
      key: "timestamp",
      header: "Received",
      width: "w-32",
      align: "right",
      sortable: true,
      render: (message) => (
        <span className="text-muted-foreground text-xs">
          {formatTimestamp(message.timestamp)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "w-32",
      align: "right",
      render: (message) => (
        <Button
          onClick={(event) => handleReply(event, message)}
          size="sm"
          type="button"
          variant="ghost"
        >
          <MessageSquareText className="mr-2 size-4" />
          Reply
        </Button>
      ),
    },
  ];

  const handleBulkArchive = useCallback(
    (selectedIds: Set<string>) => {
      if (selectedIds.size === 0) {
        return;
      }
      const noun = selectedIds.size === 1 ? "conversation" : "conversations";
      toast.success(`Archive queued for ${selectedIds.size} ${noun}.`);
    },
    [toast]
  );

  const bulkActions = [
    {
      label: "Archive",
      icon: <Archive className="size-3.5" />,
      onClick: handleBulkArchive,
    },
  ];

  const searchFilter = (message: SMSMessage, query: string) => {
    const needle = query.toLowerCase();
    return (
      message.from.toLowerCase().includes(needle) ||
      (message.fromPhone?.toLowerCase().includes(needle) ?? false) ||
      (message.toPhone?.toLowerCase().includes(needle) ?? false) ||
      message.preview.toLowerCase().includes(needle) ||
      message.status.toLowerCase().includes(needle)
    );
  };

  return (
    <FullWidthDataTable
      bulkActions={bulkActions}
      columns={columns}
      data={messages}
      emptyIcon={
        <MessageSquareText className="size-10 text-muted-foreground" />
      }
      emptyMessage="No text messages"
      enableSelection
      entity="communications-sms"
      getHighlightClass={() => "bg-primary/10 dark:bg-primary/5"}
      getItemId={(item) => item.id}
      isHighlighted={(item) => item.status === "unread"}
      onRowClick={handleOpenMessage}
      searchFilter={searchFilter}
      searchPlaceholder="Search texts"
      showRefresh={false}
    />
  );
}

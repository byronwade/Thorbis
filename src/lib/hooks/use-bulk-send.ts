/**
 * useBulkSend Hook - Handles bulk sending with sync status tracking
 *
 * Features:
 * - Integrates with sync store for real-time progress
 * - Shows progress in header status indicator
 * - Handles offline queueing
 * - Manages operation lifecycle
 */

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSyncStore } from "@/lib/stores/sync-store";
import { bulkSendInvoices } from "@/actions/bulk-communications";

export function useBulkSendInvoices() {
  const [isSending, setIsSending] = useState(false);
  const startOperation = useSyncStore((state) => state.startOperation);
  const updateOperation = useSyncStore((state) => state.updateOperation);
  const completeOperation = useSyncStore((state) => state.completeOperation);
  const isOnline = useSyncStore((state) => state.isOnline);
  const queueOperation = useSyncStore((state) => state.queueOperation);

  const send = async (invoiceIds: string[]) => {
    // Check if online
    if (!isOnline) {
      // Queue for later
      queueOperation({
        type: "bulk_send_invoices",
        action: `Send ${invoiceIds.length} invoice${invoiceIds.length > 1 ? "s" : ""}`,
        payload: { invoiceIds },
      });

      toast.info("Queued for sync", {
        description: `${invoiceIds.length} invoice${invoiceIds.length > 1 ? "s" : ""} will be sent when you're back online`,
      });

      return {
        success: true,
        message: "Queued for sync",
      };
    }

    setIsSending(true);

    // Start sync operation
    const operationId = startOperation({
      type: "bulk_send_invoices",
      title: `Sending ${invoiceIds.length} invoice${invoiceIds.length > 1 ? "s" : ""}`,
      description: "Preparing emails with payment links...",
      total: invoiceIds.length,
      current: 0,
    });

    try {
      const result = await bulkSendInvoices(invoiceIds);

      if (result.success) {
        completeOperation(operationId, true);
        toast.success("Invoices sent", {
          description: result.message,
        });
      } else {
        completeOperation(operationId, false, result.error || result.message);
        toast.error("Failed to send invoices", {
          description: result.error || result.message,
        });
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      completeOperation(operationId, false, errorMessage);
      toast.error("Failed to send invoices", {
        description: "An unexpected error occurred",
      });

      return {
        success: false,
        message: "Failed to send invoices",
        error: errorMessage,
      };
    } finally {
      setIsSending(false);
    }
  };

  return {
    send,
    isSending,
  };
}


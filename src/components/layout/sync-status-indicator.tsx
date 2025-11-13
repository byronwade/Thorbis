/**
 * Sync Status Indicator - Header badge showing sync operations
 *
 * Features:
 * - Rotating icon when syncing
 * - Badge count for active/queued operations
 * - Click to open details panel
 * - Online/offline indicator
 */

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  useSyncStore,
  useActiveOperationsCount,
  useQueuedOperationsCount,
  useIsSyncing,
} from "@/lib/stores/sync-store";
import {
  Cloud,
  CloudOff,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export function SyncStatusIndicator() {
  const isSyncing = useIsSyncing();
  const activeCount = useActiveOperationsCount();
  const queuedCount = useQueuedOperationsCount();
  const isOnline = useSyncStore((state) => state.isOnline);
  const setOnlineStatus = useSyncStore((state) => state.setOnlineStatus);
  const togglePanel = useSyncStore((state) => state.togglePanel);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnlineStatus]);

  // Don't show if nothing is happening
  if (!isSyncing && !queuedCount && isOnline) {
    return null;
  }

  const totalCount = activeCount + queuedCount;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={togglePanel}
      className="relative h-9 gap-2"
    >
      {/* Icon */}
      <div className="relative">
        {isSyncing ? (
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        ) : !isOnline ? (
          <CloudOff className="h-4 w-4 text-amber-600" />
        ) : queuedCount > 0 ? (
          <Clock className="h-4 w-4 text-amber-600" />
        ) : null}
      </div>

      {/* Status text */}
      <span className="text-xs font-medium">
        {isSyncing
          ? "Syncing"
          : !isOnline
          ? "Offline"
          : queuedCount > 0
          ? "Queued"
          : "Sync"}
      </span>

      {/* Count badge */}
      {totalCount > 0 && (
        <Badge
          variant="secondary"
          className={cn(
            "h-5 min-w-5 px-1 text-xs",
            isSyncing && "bg-blue-100 text-blue-700",
            !isOnline && "bg-amber-100 text-amber-700"
          )}
        >
          {totalCount}
        </Badge>
      )}
    </Button>
  );
}


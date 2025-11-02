/**
 * Offline Indicator Component
 *
 * Displays network status and pending sync operations in the AppToolbar.
 * Critical for field workers to understand offline mode and sync status.
 *
 * States:
 * - Online with no pending: Hidden
 * - Offline: Shows "Offline Mode"
 * - Pending operations: Shows count and sync status
 * - Syncing: Shows spinner
 */

"use client";

import { AlertCircle, CheckCircle2, RefreshCw, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNetworkStatus } from "@/lib/offline/network-status";
import { cn } from "@/lib/utils";

export function OfflineIndicator() {
  const { isOnline, pendingOperations, isSyncing, lastSync } =
    useNetworkStatus();
  const [isMounted, setIsMounted] = useState(false);

  // Wait for client-side mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything on server to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

  // Don't show anything if online and no pending operations
  if (isOnline && pendingOperations === 0 && !isSyncing) {
    return null;
  }

  // Offline mode
  if (!isOnline) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-yellow-500/10 px-3 py-1 text-sm text-yellow-700 dark:text-yellow-400">
        <WifiOff className="size-4" />
        <span className="hidden sm:inline">Offline Mode</span>
        {pendingOperations > 0 && (
          <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 font-medium text-xs">
            {pendingOperations}
          </span>
        )}
      </div>
    );
  }

  // Syncing
  if (isSyncing) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-blue-500/10 px-3 py-1 text-blue-700 text-sm dark:text-blue-400">
        <RefreshCw className="size-4 animate-spin" />
        <span className="hidden sm:inline">Syncing...</span>
        {pendingOperations > 0 && (
          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 font-medium text-xs">
            {pendingOperations}
          </span>
        )}
      </div>
    );
  }

  // Pending operations (online but not syncing)
  if (pendingOperations > 0) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-orange-500/10 px-3 py-1 text-orange-700 text-sm dark:text-orange-400">
        <AlertCircle className="size-4" />
        <span className="hidden sm:inline">{pendingOperations} pending</span>
        <span className="sm:hidden">{pendingOperations}</span>
      </div>
    );
  }

  // Recently synced (show for 5 seconds)
  if (lastSync && Date.now() - lastSync.getTime() < 5000) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-green-500/10 px-3 py-1 text-green-700 text-sm dark:text-green-400">
        <CheckCircle2 className="size-4" />
        <span className="hidden sm:inline">Synced</span>
      </div>
    );
  }

  return null;
}

/**
 * Detailed sync status for settings/debug pages
 */
export function SyncStatusDetail() {
  const { isOnline, pendingOperations, isSyncing, lastSync } =
    useNetworkStatus();
  const [isMounted, setIsMounted] = useState(false);

  // Wait for client-side mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading state on server
  if (!isMounted) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Network Status</span>
          <span className="text-muted-foreground text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">Network Status</span>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <div className="size-2 rounded-full bg-green-500" />
              <span className="font-medium text-sm">Online</span>
            </>
          ) : (
            <>
              <div className="size-2 rounded-full bg-yellow-500" />
              <span className="font-medium text-sm">Offline</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          Pending Operations
        </span>
        <span className="font-medium text-sm">
          {pendingOperations === 0 ? "None" : `${pendingOperations}`}
        </span>
      </div>

      {isSyncing && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Sync Status</span>
          <div className="flex items-center gap-2">
            <RefreshCw className="size-4 animate-spin text-blue-500" />
            <span className="font-medium text-sm">Syncing...</span>
          </div>
        </div>
      )}

      {lastSync && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Last Sync</span>
          <span className="font-medium text-sm">
            {new Date(lastSync).toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Badge variant for compact display
 */
export function OfflineBadge() {
  const { isOnline, pendingOperations } = useNetworkStatus();
  const [isMounted, setIsMounted] = useState(false);

  // Wait for client-side mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything on server to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

  if (isOnline && pendingOperations === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex size-6 items-center justify-center rounded-full font-bold text-xs",
        isOnline ? "bg-orange-500 text-white" : "bg-yellow-500 text-white"
      )}
    >
      {pendingOperations > 0 ? (
        pendingOperations
      ) : (
        <WifiOff className="size-3" />
      )}
    </div>
  );
}

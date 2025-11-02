/**
 * Network Status Detection Hook
 *
 * Monitors online/offline state and triggers sync when connection is restored.
 * Critical for field workers with spotty internet connections.
 *
 * Usage:
 * ```typescript
 * const { isOnline, pendingOperations } = useNetworkStatus();
 * ```
 */

"use client";

import { useEffect, useState } from "react";
import { countRecords } from "./indexed-db";
import { processSyncQueue } from "./sync-queue";

export interface NetworkStatus {
  isOnline: boolean;
  pendingOperations: number;
  lastSync: Date | null;
  isSyncing: boolean;
}

/**
 * Hook to monitor network status and pending sync operations
 */
export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [pendingOperations, setPendingOperations] = useState(0);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Update pending operations count
  const updatePendingCount = async () => {
    // SSR guard - only run in browser
    if (typeof window === "undefined") return;

    try {
      const count = await countRecords("sync-queue");
      setPendingOperations(count);
    } catch (error) {
      console.error("Failed to count pending operations:", error);
    }
  };

  useEffect(() => {
    // SSR guard - only run in browser
    if (typeof window === "undefined") return;

    // Initial pending count
    updatePendingCount();

    // Poll for pending operations every 10 seconds
    const interval = setInterval(updatePendingCount, 10_000);

    const handleOnline = async () => {
      console.log("Network connection restored");
      setIsOnline(true);

      // Trigger sync queue processing
      try {
        setIsSyncing(true);
        await processSyncQueue();
        setLastSync(new Date());
        await updatePendingCount();
      } catch (error) {
        console.error("Failed to process sync queue:", error);
      } finally {
        setIsSyncing(false);
      }
    };

    const handleOffline = () => {
      console.log("Network connection lost - entering offline mode");
      setIsOnline(false);
    };

    // Listen for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for visibility change (page becomes visible after being hidden)
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        // Trigger sync when user returns to the tab
        try {
          setIsSyncing(true);
          await processSyncQueue();
          setLastSync(new Date());
          await updatePendingCount();
        } catch (error) {
          console.error(
            "Failed to process sync queue on visibility change:",
            error
          );
        } finally {
          setIsSyncing(false);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  return {
    isOnline,
    pendingOperations,
    lastSync,
    isSyncing,
  };
}

/**
 * Get current online status (synchronous)
 */
export function isOnline(): boolean {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}

/**
 * Wait for network connection
 */
export function waitForOnline(): Promise<void> {
  return new Promise((resolve) => {
    if (navigator.onLine) {
      resolve();
    } else {
      const handler = () => {
        window.removeEventListener("online", handler);
        resolve();
      };
      window.addEventListener("online", handler);
    }
  });
}

/**
 * Execute a function when online
 */
export async function executeWhenOnline<T>(fn: () => Promise<T>): Promise<T> {
  if (!navigator.onLine) {
    console.log("Waiting for network connection...");
    await waitForOnline();
  }
  return fn();
}

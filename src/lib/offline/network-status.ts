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

import { useEffect, useRef, useState } from "react";
import { countRecords } from "./indexed-db";
import { processSyncQueue } from "./sync-queue";

export type NetworkStatus = {
	isOnline: boolean;
	pendingOperations: number;
	lastSync: Date | null;
	isSyncing: boolean;
};

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
		if (typeof window === "undefined") {
			return;
		}

		try {
			const count = await countRecords("sync-queue");
			setPendingOperations(count);
		} catch (_error) {}
	};

	// Use ref to prevent concurrent sync operations (CRITICAL FIX)
	const isSyncingRef = useRef(false);

	useEffect(() => {
		// SSR guard - only run in browser
		if (typeof window === "undefined") {
			return;
		}

		// Initial pending count
		updatePendingCount();

		// Poll for pending operations every 10 seconds
		const interval = setInterval(() => {
			// Don't update count if sync is in progress to avoid race conditions
			if (!isSyncingRef.current) {
				updatePendingCount();
			}
		}, 10_000);

		const handleOnline = async () => {
			// Guard: prevent concurrent sync operations
			if (isSyncingRef.current) {
				return;
			}
			setIsOnline(true);
			isSyncingRef.current = true;

			// Trigger sync queue processing
			try {
				setIsSyncing(true);
				await processSyncQueue();
				setLastSync(new Date());
				await updatePendingCount();
			} catch (_error) {
			} finally {
				setIsSyncing(false);
				isSyncingRef.current = false;
			}
		};

		const handleOffline = () => {
			setIsOnline(false);
		};

		// Listen for visibility change (page becomes visible after being hidden)
		const handleVisibilityChange = async () => {
			// Guard: prevent concurrent sync operations
			if (document.visibilityState === "visible" && navigator.onLine && !isSyncingRef.current) {
				isSyncingRef.current = true;

				// Trigger sync when user returns to the tab
				try {
					setIsSyncing(true);
					await processSyncQueue();
					setLastSync(new Date());
					await updatePendingCount();
				} catch (_error) {
				} finally {
					setIsSyncing(false);
					isSyncingRef.current = false;
				}
			}
		};

		// Listen for online/offline events
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);
		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			clearInterval(interval);
		};
	}, [
		// Initial pending count
		updatePendingCount,
	]);

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
		await waitForOnline();
	}
	return fn();
}

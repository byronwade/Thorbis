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
			<div className="bg-warning/10 text-warning dark:text-warning flex items-center gap-2 rounded-md px-3 py-1 text-sm">
				<WifiOff className="size-4" />
				<span className="hidden sm:inline">Offline Mode</span>
				{pendingOperations > 0 && (
					<span className="bg-warning/20 rounded-full px-2 py-0.5 text-xs font-medium">
						{pendingOperations}
					</span>
				)}
			</div>
		);
	}

	// Syncing
	if (isSyncing) {
		return (
			<div className="bg-primary/10 text-primary dark:text-primary flex items-center gap-2 rounded-md px-3 py-1 text-sm">
				<RefreshCw className="size-4 animate-spin" />
				<span className="hidden sm:inline">Syncing...</span>
				{pendingOperations > 0 && (
					<span className="bg-primary/20 rounded-full px-2 py-0.5 text-xs font-medium">
						{pendingOperations}
					</span>
				)}
			</div>
		);
	}

	// Pending operations (online but not syncing)
	if (pendingOperations > 0) {
		return (
			<div className="bg-warning/10 text-warning dark:text-warning flex items-center gap-2 rounded-md px-3 py-1 text-sm">
				<AlertCircle className="size-4" />
				<span className="hidden sm:inline">{pendingOperations} pending</span>
				<span className="sm:hidden">{pendingOperations}</span>
			</div>
		);
	}

	// Recently synced (show for 5 seconds)
	if (lastSync && Date.now() - lastSync.getTime() < 5000) {
		return (
			<div className="bg-success/10 text-success dark:text-success flex items-center gap-2 rounded-md px-3 py-1 text-sm">
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
function SyncStatusDetail() {
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
							<div className="bg-success size-2 rounded-full" />
							<span className="text-sm font-medium">Online</span>
						</>
					) : (
						<>
							<div className="bg-warning size-2 rounded-full" />
							<span className="text-sm font-medium">Offline</span>
						</>
					)}
				</div>
			</div>

			<div className="flex items-center justify-between">
				<span className="text-muted-foreground text-sm">
					Pending Operations
				</span>
				<span className="text-sm font-medium">
					{pendingOperations === 0 ? "None" : `${pendingOperations}`}
				</span>
			</div>

			{isSyncing && (
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground text-sm">Sync Status</span>
					<div className="flex items-center gap-2">
						<RefreshCw className="text-primary size-4 animate-spin" />
						<span className="text-sm font-medium">Syncing...</span>
					</div>
				</div>
			)}

			{lastSync && (
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground text-sm">Last Sync</span>
					<span className="text-sm font-medium">
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
function OfflineBadge() {
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
				"flex size-6 items-center justify-center rounded-full text-xs font-bold",
				isOnline ? "bg-warning text-white" : "bg-warning text-white",
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

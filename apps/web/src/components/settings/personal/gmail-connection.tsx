"use client";

/**
 * Gmail Connection Component
 *
 * Allows team members to connect their personal Gmail accounts for inbox
 * synchronization. Displays connection status, connected email, and sync info.
 *
 * Features:
 * - Connect/disconnect Gmail
 * - View connection status
 * - Manual sync trigger
 * - Display last sync time
 * - Show connected email address
 */

import {
	AlertCircle,
	CheckCircle2,
	Loader2,
	Mail,
	RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

interface GmailConnectionData {
	isConnected: boolean;
	emailAddress?: string;
	lastSyncedAt?: string;
	syncEnabled?: boolean;
	scopes?: string[];
}

interface GmailConnectionProps {
	data: GmailConnectionData;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function GmailConnection({ data }: GmailConnectionProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [isSyncing, setIsSyncing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);

	// Handle connect Gmail button click
	const handleConnect = () => {
		setError(null);
		setSuccess(null);
		// Redirect to OAuth authorization endpoint
		window.location.href = "/api/gmail/oauth/user/authorize";
	};

	// Execute disconnect Gmail
	const executeDisconnect = async () => {
		setShowDisconnectDialog(false);
		startTransition(async () => {
			try {
				const response = await fetch("/api/gmail/user/disconnect", {
					method: "POST",
				});

				const result = await response.json();

				if (!response.ok) {
					throw new Error(result.error || "Failed to disconnect Gmail");
				}

				setSuccess("Gmail disconnected successfully");
				router.refresh();
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to disconnect Gmail",
				);
			}
		});
	};

	// Handle disconnect Gmail
	const handleDisconnect = () => {
		setError(null);
		setSuccess(null);
		setShowDisconnectDialog(true);
	};

	// Handle manual sync
	const handleSync = async () => {
		setError(null);
		setSuccess(null);
		setIsSyncing(true);

		try {
			const response = await fetch("/api/gmail/user/sync", {
				method: "POST",
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to sync inbox");
			}

			setSuccess(
				`Synced ${result.messagesFetched} messages (${result.messagesStored} new)`,
			);
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to sync inbox");
		} finally {
			setIsSyncing(false);
		}
	};

	// Format last sync time
	const formatLastSync = (timestamp?: string) => {
		if (!timestamp) return "Never";

		const date = new Date(timestamp);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);

		if (minutes < 1) return "Just now";
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		return `${days}d ago`;
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="space-y-1.5">
						<CardTitle className="flex items-center gap-2">
							<Mail className="size-5" />
							Gmail Connection
						</CardTitle>
						<CardDescription>
							Connect your personal Gmail account to sync your inbox
						</CardDescription>
					</div>
					{data.isConnected && (
						<Badge
							className={cn(
								data.syncEnabled
									? "bg-success/10 text-success hover:bg-success/20"
									: "bg-muted text-muted-foreground",
							)}
						>
							{data.syncEnabled ? (
								<>
									<CheckCircle2 className="mr-1 size-3" />
									Connected
								</>
							) : (
								"Disabled"
							)}
						</Badge>
					)}
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Error Alert */}
				{error && (
					<Alert variant="destructive">
						<AlertCircle className="size-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{/* Success Alert */}
				{success && (
					<Alert className="border-success/50 text-success">
						<CheckCircle2 className="size-4" />
						<AlertTitle>Success</AlertTitle>
						<AlertDescription>{success}</AlertDescription>
					</Alert>
				)}

				{/* Connection Status */}
				{data.isConnected ? (
					<div className="space-y-3">
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">Connected Email</p>
								<p className="text-muted-foreground text-sm">
									{data.emailAddress}
								</p>
							</div>
						</div>

						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">Last Sync</p>
								<p className="text-muted-foreground text-sm">
									{formatLastSync(data.lastSyncedAt)}
								</p>
							</div>
							<Button
								disabled={isSyncing || isPending}
								onClick={handleSync}
								size="sm"
								variant="outline"
							>
								{isSyncing ? (
									<>
										<Loader2 className="mr-2 size-4 animate-spin" />
										Syncing...
									</>
								) : (
									<>
										<RefreshCw className="mr-2 size-4" />
										Sync Now
									</>
								)}
							</Button>
						</div>

						{data.scopes && (
							<div className="rounded-lg border p-3">
								<p className="text-sm font-medium">Permissions</p>
								<div className="mt-2 flex flex-wrap gap-2">
									{data.scopes.map((scope) => {
										const label = scope.includes("readonly")
											? "Read Inbox"
											: scope.includes("send")
												? "Send Email"
												: scope.split(".").pop() || scope;
										return (
											<Badge key={scope} variant="secondary">
												{label}
											</Badge>
										);
									})}
								</div>
							</div>
						)}
					</div>
				) : (
					<div className="rounded-lg border border-dashed p-6 text-center">
						<Mail className="text-muted-foreground mx-auto mb-3 size-12" />
						<p className="text-muted-foreground mb-2 text-sm">
							No Gmail account connected
						</p>
						<p className="text-muted-foreground mb-4 text-xs">
							Connect your Gmail to sync your inbox and send emails from your
							personal account
						</p>
					</div>
				)}

				{/* Help Text */}
				<div className="rounded-lg bg-muted/50 p-3">
					<p className="text-muted-foreground text-xs">
						<strong>What happens when you connect?</strong>
						<br />
						Your Gmail inbox will sync automatically every hour. You can also
						manually sync at any time. All emails will be visible to you and can
						be shared with your team based on your permissions.
					</p>
				</div>
			</CardContent>

			<CardFooter className="flex gap-2">
				{data.isConnected ? (
					<Button
						disabled={isPending}
						onClick={handleDisconnect}
						variant="outline"
					>
						{isPending ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								Disconnecting...
							</>
						) : (
							"Disconnect Gmail"
						)}
					</Button>
				) : (
					<Button onClick={handleConnect}>
						<Mail className="mr-2 size-4" />
						Connect Gmail
					</Button>
				)}
			</CardFooter>

			{/* Disconnect Confirmation Dialog */}
			<AlertDialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Disconnect Gmail?</AlertDialogTitle>
						<AlertDialogDescription>
							Your inbox will no longer sync. Any unsynced emails will not be available.
							You can reconnect at any time.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={executeDisconnect}
						>
							Disconnect
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Card>
	);
}

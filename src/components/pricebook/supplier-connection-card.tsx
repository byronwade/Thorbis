"use client";

/**
 * Supplier Connection Card
 *
 * Shows supplier integration status with actions:
 * - Connect/Disconnect
 * - Manual sync
 * - View sync history
 * - Configure settings
 */

import {
	AlertCircle,
	CheckCircle2,
	ExternalLink,
	MoreVertical,
	RefreshCw,
	Settings,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SupplierStatus } from "@/lib/stores/pricebook-store";
import { cn } from "@/lib/utils";

type SupplierConnectionCardProps = {
	supplier: SupplierStatus;
};

const statusConfig = {
	connected: {
		icon: CheckCircle2,
		badge: "Connected",
		badgeClassName: "border-success/50 bg-success/10 text-success dark:text-success",
		iconClassName: "text-success dark:text-success",
	},
	syncing: {
		icon: RefreshCw,
		badge: "Syncing...",
		badgeClassName: "border-primary/50 bg-primary/10 text-primary dark:text-primary",
		iconClassName: "text-primary dark:text-primary animate-spin",
	},
	error: {
		icon: XCircle,
		badge: "Error",
		badgeClassName:
			"border-destructive/50 bg-destructive/10 text-destructive dark:text-destructive",
		iconClassName: "text-destructive dark:text-destructive",
	},
	warning: {
		icon: AlertCircle,
		badge: "Warning",
		badgeClassName: "border-warning/50 bg-warning/10 text-warning dark:text-warning",
		iconClassName: "text-warning dark:text-warning",
	},
	disconnected: {
		icon: XCircle,
		badge: "Not Connected",
		badgeClassName: "border-border/50 bg-background text-muted-foreground",
		iconClassName: "text-muted-foreground",
	},
};

function formatLastSync(date: Date | null): string {
	if (!date) {
		return "Never";
	}

	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffMins < 1) {
		return "Just now";
	}
	if (diffMins < 60) {
		return `${diffMins}m ago`;
	}
	if (diffHours < 24) {
		return `${diffHours}h ago`;
	}
	return `${diffDays}d ago`;
}

export function SupplierConnectionCard({ supplier }: SupplierConnectionCardProps) {
	const [isSyncing, setIsSyncing] = useState(false);
	const config = statusConfig[supplier.status];
	const StatusIcon = config.icon;

	const handleSync = async () => {
		setIsSyncing(true);
		// TODO: Call actual sync API
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setIsSyncing(false);
	};

	const handleConnect = () => {};

	const handleDisconnect = () => {};

	const handleSettings = () => {};

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-3">
						<div
							className={cn(
								"bg-muted flex h-10 w-10 items-center justify-center rounded-lg",
								supplier.status === "connected" && "bg-success/10",
								supplier.status === "error" && "bg-destructive/10"
							)}
						>
							<StatusIcon className={cn("h-5 w-5", config.iconClassName)} />
						</div>
						<div>
							<CardTitle className="text-base">{supplier.displayName}</CardTitle>
							<CardDescription className="text-xs">
								{supplier.apiEnabled ? "API Enabled" : "API Not Configured"}
							</CardDescription>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Badge className={cn("text-xs font-medium", config.badgeClassName)} variant="outline">
							{config.badge}
						</Badge>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className="h-8 w-8" size="icon" variant="ghost">
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{supplier.status === "connected" && (
									<>
										<DropdownMenuItem onClick={handleSync}>
											<RefreshCw className="mr-2 h-4 w-4" />
											Sync Now
										</DropdownMenuItem>
										<DropdownMenuItem onClick={handleSettings}>
											<Settings className="mr-2 h-4 w-4" />
											Settings
										</DropdownMenuItem>
										<DropdownMenuSeparator />
									</>
								)}
								{supplier.status === "disconnected" && (
									<DropdownMenuItem onClick={handleConnect}>
										<CheckCircle2 className="mr-2 h-4 w-4" />
										Connect
									</DropdownMenuItem>
								)}
								{supplier.status === "connected" && (
									<DropdownMenuItem className="text-destructive" onClick={handleDisconnect}>
										<XCircle className="mr-2 h-4 w-4" />
										Disconnect
									</DropdownMenuItem>
								)}
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<ExternalLink className="mr-2 h-4 w-4" />
									View Documentation
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-3">
				{/* Error Message */}
				{supplier.errorMessage && (
					<div className="border-destructive bg-destructive dark:border-destructive/50 dark:bg-destructive/30 rounded-md border p-3">
						<p className="text-destructive dark:text-destructive text-sm">
							{supplier.errorMessage}
						</p>
					</div>
				)}

				{/* Stats */}
				<div className="grid grid-cols-2 gap-3">
					<div className="bg-muted/30 rounded-lg border p-3">
						<p className="text-muted-foreground text-xs">Items Imported</p>
						<p className="text-lg font-semibold">{supplier.itemsImported.toLocaleString()}</p>
					</div>

					<div className="bg-muted/30 rounded-lg border p-3">
						<p className="text-muted-foreground text-xs">Last Sync</p>
						<p className="text-lg font-semibold">{formatLastSync(supplier.lastSyncAt)}</p>
					</div>
				</div>

				{/* Actions */}
				<div className="flex gap-2">
					{supplier.status === "connected" ? (
						<>
							<Button
								className="flex-1"
								disabled={isSyncing}
								onClick={handleSync}
								size="sm"
								variant="outline"
							>
								{isSyncing ? (
									<>
										<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
										Syncing...
									</>
								) : (
									<>
										<RefreshCw className="mr-2 h-4 w-4" />
										Sync Now
									</>
								)}
							</Button>
							<Button onClick={handleSettings} size="sm" variant="outline">
								<Settings className="h-4 w-4" />
							</Button>
						</>
					) : (
						<Button className="flex-1" onClick={handleConnect} size="sm">
							<CheckCircle2 className="mr-2 h-4 w-4" />
							Connect Account
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

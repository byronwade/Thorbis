/**
 * WebRTC Health Monitor Component
 *
 * Displays the current status and health of the isolated WebRTC service.
 * Useful for admin dashboards and debugging.
 *
 * Usage:
 * ```tsx
 * <WebRTCHealthMonitor />
 * ```
 */

"use client";

import {
	Activity,
	AlertCircle,
	CheckCircle,
	Loader2,
	XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { WebRTCServiceStatus } from "@/services/webrtc";

export function WebRTCHealthMonitor() {
	const [status, setStatus] = useState<WebRTCServiceStatus>("idle");
	const [healthy, setHealthy] = useState(false);
	const [lastCheck, setLastCheck] = useState<Date | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkHealth = async () => {
			try {
				const response = await fetch("/api/webrtc/status", {
					cache: "no-store",
				});

				if (response.ok) {
					const data = await response.json();
					setStatus(data.status);
					setHealthy(data.healthy);
					setLastCheck(new Date(data.timestamp));
				} else {
					setStatus("error");
					setHealthy(false);
				}
			} catch (error) {
				console.error("[WebRTC Health Monitor] Failed to check health:", error);
				setStatus("error");
				setHealthy(false);
			} finally {
				setIsLoading(false);
			}
		};

		// Check immediately
		checkHealth();

		// Check every 10 seconds
		const interval = setInterval(checkHealth, 10000);

		return () => clearInterval(interval);
	}, []);

	const getStatusBadge = () => {
		switch (status) {
			case "ready":
				return (
					<Badge className="gap-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
						<CheckCircle className="size-3" />
						Ready
					</Badge>
				);

			case "starting":
				return (
					<Badge className="gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
						<Loader2 className="size-3 animate-spin" />
						Starting
					</Badge>
				);

			case "error":
				return (
					<Badge className="gap-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
						<XCircle className="size-3" />
						Error
					</Badge>
				);

			case "stopped":
				return (
					<Badge className="gap-1 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
						<XCircle className="size-3" />
						Stopped
					</Badge>
				);

			default:
				return (
					<Badge className="gap-1 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
						<Activity className="size-3" />
						Idle
					</Badge>
				);
		}
	};

	const getHealthStatus = () => {
		if (isLoading) {
			return (
				<div className="text-muted-foreground flex items-center gap-2 text-sm">
					<Loader2 className="size-4 animate-spin" />
					<span>Checking health...</span>
				</div>
			);
		}

		if (healthy && status === "ready") {
			return (
				<div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
					<CheckCircle className="size-4" />
					<span>Service is healthy and operational</span>
				</div>
			);
		}

		if (status === "error") {
			return (
				<div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400">
					<AlertCircle className="size-4" />
					<span>Service is unavailable - main app continues normally</span>
				</div>
			);
		}

		return (
			<div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
				<AlertCircle className="size-4" />
				<span>Service is not ready</span>
			</div>
		);
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<Activity className="size-5" />
							WebRTC Service Health
						</CardTitle>
						<CardDescription>
							Isolated telephony service monitoring - failures won't affect the
							main app
						</CardDescription>
					</div>
					{getStatusBadge()}
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{getHealthStatus()}

				{lastCheck && (
					<div className="text-muted-foreground text-xs">
						Last checked: {lastCheck.toLocaleTimeString()}
					</div>
				)}

				{status === "error" && (
					<div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900/30 dark:bg-amber-900/20">
						<p className="font-medium text-amber-900 dark:text-amber-400">
							Graceful Degradation Active
						</p>
						<p className="mt-1 text-xs text-amber-800 dark:text-amber-500">
							Telephony features are currently unavailable, but all other
							application features continue to work normally. The service will
							automatically attempt to restart.
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

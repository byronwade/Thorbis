"use client";

import {
	AlertTriangle,
	Bell,
	Calendar,
	Clock,
	DollarSign,
	Mail,
	Shield,
	User,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	checkIsCompanyOwner,
	getCompanyPendingActions,
	type PendingAction,
} from "@/actions/ai-approval";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Module-level cache to prevent duplicate polling across component instances
let cachedData: {
	isOwner: boolean;
	pendingActions: PendingAction[];
	lastFetched: number;
} | null = null;

const CACHE_DURATION = 30000; // 30 seconds
const POLL_INTERVAL = 60000; // 60 seconds (doubled from 30s to reduce load)

// Global interval ID to ensure only one polling loop runs
let globalIntervalId: ReturnType<typeof setInterval> | null = null;
let instanceCount = 0;

interface PendingActionsIndicatorProps {
	className?: string;
	showPopover?: boolean;
	onActionClick?: (action: PendingAction) => void;
}

const riskLevelColors = {
	low: "bg-blue-500",
	medium: "bg-yellow-500",
	high: "bg-orange-500",
	critical: "bg-red-500",
};

const actionTypeIcons: Record<string, typeof Mail> = {
	send_communication: Mail,
	financial: DollarSign,
	scheduling: Calendar,
	customer: User,
};

function getActionIcon(actionType: string) {
	return actionTypeIcons[actionType] || AlertTriangle;
}

function formatTimeRemaining(expiresAt: string): string {
	const now = new Date();
	const expires = new Date(expiresAt);
	const diff = expires.getTime() - now.getTime();

	if (diff <= 0) return "Expired";

	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

	if (hours > 0) return `${hours}h ${minutes}m`;
	return `${minutes}m`;
}

export function PendingActionsIndicator({
	className,
	showPopover = true,
	onActionClick,
}: PendingActionsIndicatorProps) {
	const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
	const [isOwner, setIsOwner] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const isMountedRef = useRef(true);

	// Shared fetch function that updates cache
	const fetchData = useCallback(async (force = false) => {
		// Use cached data if available and fresh
		if (
			!force &&
			cachedData &&
			Date.now() - cachedData.lastFetched < CACHE_DURATION
		) {
			if (isMountedRef.current) {
				setIsOwner(cachedData.isOwner);
				setPendingActions(cachedData.pendingActions);
				setIsLoading(false);
			}
			return;
		}

		try {
			const [ownerResult, actionsResult] = await Promise.all([
				checkIsCompanyOwner(),
				getCompanyPendingActions({ status: "pending", limit: 10 }),
			]);

			const newIsOwner = ownerResult.success ? ownerResult.data ?? false : false;
			const newActions = actionsResult.success ? actionsResult.data ?? [] : [];

			// Update cache
			cachedData = {
				isOwner: newIsOwner,
				pendingActions: newActions,
				lastFetched: Date.now(),
			};

			if (isMountedRef.current) {
				setIsOwner(newIsOwner);
				setPendingActions(newActions);
			}
		} catch (error) {
			console.error("Failed to fetch pending actions:", error);
		} finally {
			if (isMountedRef.current) {
				setIsLoading(false);
			}
		}
	}, []);

	// Fetch pending actions with deduplication
	useEffect(() => {
		isMountedRef.current = true;
		instanceCount++;

		// Initial fetch
		fetchData();

		// Only set up polling if this is the first instance
		if (instanceCount === 1 && !globalIntervalId) {
			globalIntervalId = setInterval(() => {
				fetchData(true); // Force refresh on interval
			}, POLL_INTERVAL);
		}

		return () => {
			isMountedRef.current = false;
			instanceCount--;

			// Clean up global interval if this is the last instance
			if (instanceCount === 0 && globalIntervalId) {
				clearInterval(globalIntervalId);
				globalIntervalId = null;
			}
		};
	}, [fetchData]);

	// Don't show if not owner or no pending actions
	if (!isOwner || pendingActions.length === 0) {
		return null;
	}

	const criticalCount = pendingActions.filter(
		(a) => a.riskLevel === "critical",
	).length;
	const highCount = pendingActions.filter((a) => a.riskLevel === "high").length;

	const indicatorContent = (
		<div className={cn("relative inline-flex", className)}>
			<Button variant="ghost" size="icon" className="relative h-9 w-9">
				<Shield className="h-5 w-5" />
				<span
					className={cn(
						"absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white",
						criticalCount > 0
							? "bg-red-500"
							: highCount > 0
								? "bg-orange-500"
								: "bg-yellow-500",
					)}
				>
					{pendingActions.length}
				</span>
			</Button>
		</div>
	);

	if (!showPopover) {
		return indicatorContent;
	}

	return (
		<Popover>
			<PopoverTrigger asChild>{indicatorContent}</PopoverTrigger>
			<PopoverContent className="w-80 p-0" align="end">
				<div className="flex items-center justify-between p-3 border-b">
					<div className="flex items-center gap-2">
						<Shield className="h-4 w-4 text-primary" />
						<span className="font-semibold text-sm">Pending Approvals</span>
					</div>
					<Badge variant="secondary">{pendingActions.length}</Badge>
				</div>

				<ScrollArea className="max-h-[300px]">
					<div className="divide-y">
						{pendingActions.map((action) => {
							const ActionIcon = getActionIcon(action.actionType);
							return (
								<button
									key={action.id}
									className="w-full p-3 text-left hover:bg-muted/50 transition-colors"
									onClick={() => onActionClick?.(action)}
								>
									<div className="flex items-start gap-3">
										<div
											className={cn(
												"rounded-full p-1.5",
												riskLevelColors[action.riskLevel] + "/10",
											)}
										>
											<ActionIcon
												className={cn(
													"h-4 w-4",
													riskLevelColors[action.riskLevel].replace(
														"bg-",
														"text-",
													),
												)}
											/>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium truncate">
												{action.toolName
													.replace(/([A-Z])/g, " $1")
													.replace(/^./, (s) => s.toUpperCase())}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												{action.affectedEntityType.replace(/_/g, " ")}
											</p>
											<div className="flex items-center gap-2 mt-1">
												<Badge
													variant="outline"
													className={cn(
														"text-[10px] px-1.5 py-0",
														riskLevelColors[action.riskLevel].replace(
															"bg-",
															"border-",
														),
														riskLevelColors[action.riskLevel].replace(
															"bg-",
															"text-",
														),
													)}
												>
													{action.riskLevel}
												</Badge>
												<span className="flex items-center gap-1 text-[10px] text-muted-foreground">
													<Clock className="h-3 w-3" />
													{formatTimeRemaining(action.expiresAt)}
												</span>
											</div>
										</div>
									</div>
								</button>
							);
						})}
					</div>
				</ScrollArea>

				{pendingActions.length > 0 && (
					<>
						<Separator />
						<div className="p-2">
							<Button
								variant="ghost"
								size="sm"
								className="w-full text-xs"
								onClick={() => {
									// Navigate to AI settings or pending actions page
									window.location.href = "/dashboard/settings/ai";
								}}
							>
								View All Pending Actions
							</Button>
						</div>
					</>
				)}
			</PopoverContent>
		</Popover>
	);
}

/**
 * Simple badge indicator for use in navigation items
 * Uses shared cache with PendingActionsIndicator to prevent duplicate polling
 */
export function PendingActionsBadge({ className }: { className?: string }) {
	const [count, setCount] = useState(0);
	const [isOwner, setIsOwner] = useState(false);
	const isMountedRef = useRef(true);

	useEffect(() => {
		isMountedRef.current = true;

		// Use cached data if available and fresh
		const updateFromCache = () => {
			if (
				cachedData &&
				Date.now() - cachedData.lastFetched < CACHE_DURATION
			) {
				if (isMountedRef.current) {
					setIsOwner(cachedData.isOwner);
					setCount(cachedData.pendingActions.length);
				}
				return true;
			}
			return false;
		};

		// Try to use cache first
		if (updateFromCache()) {
			return;
		}

		// If no cache, fetch data
		const fetchData = async () => {
			try {
				const [ownerResult, actionsResult] = await Promise.all([
					checkIsCompanyOwner(),
					getCompanyPendingActions({ status: "pending", limit: 100 }),
				]);

				const newIsOwner = ownerResult.success ? ownerResult.data ?? false : false;
				const newActions = actionsResult.success ? actionsResult.data ?? [] : [];

				// Update cache
				cachedData = {
					isOwner: newIsOwner,
					pendingActions: newActions,
					lastFetched: Date.now(),
				};

				if (isMountedRef.current) {
					setIsOwner(newIsOwner);
					setCount(newActions.length);
				}
			} catch (error) {
				console.error("Failed to fetch pending action count:", error);
			}
		};

		fetchData();

		// No separate interval here - the main indicator handles polling
		// Just sync with cache periodically
		const syncInterval = setInterval(() => {
			updateFromCache();
		}, 5000); // Check cache every 5 seconds

		return () => {
			isMountedRef.current = false;
			clearInterval(syncInterval);
		};
	}, []);

	if (!isOwner || count === 0) return null;

	return (
		<Badge
			variant="destructive"
			className={cn("ml-auto h-5 min-w-5 px-1.5 text-[10px]", className)}
		>
			{count}
		</Badge>
	);
}

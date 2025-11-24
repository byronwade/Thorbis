"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import {
	AlertTriangle,
	CheckCircle2,
	ChevronDown,
	Clock,
	Filter,
	RotateCcw,
	Shield,
	Sparkles,
	Trash2,
	Edit3,
	Plus,
	Database,
	Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
	getActivityLogAction,
	getActivityStatsAction,
	previewUndoAction,
	undoActionAction,
	type ActivityLogEntry,
} from "@/actions/ai-activity";

type SeverityFilter = "low" | "medium" | "high" | "critical";
type ActionFilter = "create" | "update" | "delete" | "query" | "tool_call";

const SEVERITY_CONFIG: Record<SeverityFilter, { label: string; color: string; icon: typeof Shield }> = {
	low: { label: "Low", color: "bg-slate-500", icon: CheckCircle2 },
	medium: { label: "Medium", color: "bg-blue-500", icon: Clock },
	high: { label: "High", color: "bg-amber-500", icon: AlertTriangle },
	critical: { label: "Critical", color: "bg-red-500", icon: Shield },
};

const ACTION_CONFIG: Record<string, { label: string; icon: typeof Edit3 }> = {
	create: { label: "Created", icon: Plus },
	update: { label: "Updated", icon: Edit3 },
	delete: { label: "Deleted", icon: Trash2 },
	query: { label: "Queried", icon: Database },
	tool_call: { label: "Tool Call", icon: Zap },
};

export function ActivityLogContent() {
	const [entries, setEntries] = useState<ActivityLogEntry[]>([]);
	const [total, setTotal] = useState(0);
	const [stats, setStats] = useState<{
		totalActions: number;
		bySeverity: Record<string, number>;
		criticalActionsCount: number;
		reversalRate: number;
	} | null>(null);
	const [isPending, startTransition] = useTransition();
	const [severityFilters, setSeverityFilters] = useState<SeverityFilter[]>([]);
	const [actionFilters, setActionFilters] = useState<ActionFilter[]>([]);
	const [page, setPage] = useState(0);
	const [undoDialog, setUndoDialog] = useState<{ entry: ActivityLogEntry; preview: Awaited<ReturnType<typeof previewUndoAction>>["preview"] } | null>(null);
	const [undoReason, setUndoReason] = useState("");
	const [isUndoing, setIsUndoing] = useState(false);

	const fetchData = useCallback(() => {
		startTransition(async () => {
			const [logResult, statsResult] = await Promise.all([
				getActivityLogAction({
					limit: 50,
					offset: page * 50,
					severityFilter: severityFilters.length > 0 ? severityFilters : undefined,
					actionFilter: actionFilters.length > 0 ? actionFilters : undefined,
				}),
				getActivityStatsAction(),
			]);

			if (!logResult.error) {
				setEntries(logResult.entries);
				setTotal(logResult.total);
			}

			if (!statsResult.error && statsResult.stats) {
				setStats({
					totalActions: statsResult.stats.totalActions,
					bySeverity: statsResult.stats.bySeverity,
					criticalActionsCount: statsResult.stats.criticalActionsCount,
					reversalRate: statsResult.stats.reversalRate,
				});
			}
		});
	}, [page, severityFilters, actionFilters]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleUndo = async (entry: ActivityLogEntry) => {
		const { preview } = await previewUndoAction(entry.id);
		setUndoDialog({ entry, preview });
		setUndoReason("");
	};

	const confirmUndo = async () => {
		if (!undoDialog) return;
		setIsUndoing(true);

		const result = await undoActionAction(undoDialog.entry.id, undoReason || "User requested undo");

		if (result.success) {
			setUndoDialog(null);
			fetchData();
		}

		setIsUndoing(false);
	};

	const toggleSeverityFilter = (severity: SeverityFilter) => {
		setSeverityFilters((prev) => (prev.includes(severity) ? prev.filter((s) => s !== severity) : [...prev, severity]));
		setPage(0);
	};

	const toggleActionFilter = (action: ActionFilter) => {
		setActionFilters((prev) => (prev.includes(action) ? prev.filter((a) => a !== action) : [...prev, action]));
		setPage(0);
	};

	return (
		<div className="flex flex-col h-full p-4 space-y-4">
			{/* Stats */}
			{stats && (
				<div className="grid grid-cols-4 gap-4">
					<div className="p-4 border rounded-lg bg-card">
						<div className="text-xs text-muted-foreground">Total Actions (7d)</div>
						<div className="text-2xl font-semibold">{stats.totalActions.toLocaleString()}</div>
					</div>
					<div className="p-4 border rounded-lg bg-card">
						<div className="text-xs text-muted-foreground">Critical Actions</div>
						<div className="text-2xl font-semibold text-red-500">{stats.criticalActionsCount}</div>
					</div>
					<div className="p-4 border rounded-lg bg-card">
						<div className="text-xs text-muted-foreground">Reversal Rate</div>
						<div className="text-2xl font-semibold">{stats.reversalRate.toFixed(1)}%</div>
					</div>
					<div className="p-4 border rounded-lg bg-card">
						<div className="text-xs text-muted-foreground">High Severity</div>
						<div className="text-2xl font-semibold text-amber-500">{(stats.bySeverity["high"] || 0) + (stats.bySeverity["critical"] || 0)}</div>
					</div>
				</div>
			)}

			{/* Filters */}
			<div className="flex items-center gap-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm" className="gap-2">
							<Filter className="size-4" />
							Severity
							{severityFilters.length > 0 && <Badge variant="secondary" className="ml-1">{severityFilters.length}</Badge>}
							<ChevronDown className="size-3" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Filter by Severity</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{(Object.keys(SEVERITY_CONFIG) as SeverityFilter[]).map((severity) => (
							<DropdownMenuCheckboxItem key={severity} checked={severityFilters.includes(severity)} onCheckedChange={() => toggleSeverityFilter(severity)}>
								<span className={cn("size-2 rounded-full mr-2", SEVERITY_CONFIG[severity].color)} />
								{SEVERITY_CONFIG[severity].label}
							</DropdownMenuCheckboxItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm" className="gap-2">
							<Zap className="size-4" />
							Action
							{actionFilters.length > 0 && <Badge variant="secondary" className="ml-1">{actionFilters.length}</Badge>}
							<ChevronDown className="size-3" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Filter by Action</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{(Object.keys(ACTION_CONFIG) as ActionFilter[]).map((action) => (
							<DropdownMenuCheckboxItem key={action} checked={actionFilters.includes(action)} onCheckedChange={() => toggleActionFilter(action)}>
								{ACTION_CONFIG[action].label}
							</DropdownMenuCheckboxItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				{(severityFilters.length > 0 || actionFilters.length > 0) && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => {
							setSeverityFilters([]);
							setActionFilters([]);
						}}
					>
						Clear filters
					</Button>
				)}

				<div className="flex-1" />
				<span className="text-sm text-muted-foreground">{total.toLocaleString()} entries</span>
			</div>

			{/* Activity list */}
			<div className="flex-1 border rounded-lg overflow-hidden">
				<div className="divide-y overflow-auto h-full">
					{isPending && entries.length === 0 ? (
						<div className="flex items-center justify-center h-40 text-muted-foreground">
							<Sparkles className="size-5 animate-pulse mr-2" />
							Loading activity...
						</div>
					) : entries.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
							<Database className="size-8 mb-2 opacity-40" />
							<p className="text-sm">No activity found</p>
							<p className="text-xs">AI actions will appear here when performed</p>
						</div>
					) : (
						entries.map((entry) => {
							const severity = SEVERITY_CONFIG[entry.severity as SeverityFilter] || SEVERITY_CONFIG.low;
							const action = ACTION_CONFIG[entry.action] || { label: entry.action, icon: Zap };
							const ActionIcon = action.icon;
							const SeverityIcon = severity.icon;

							return (
								<div key={entry.id} className={cn("p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors", entry.reversed && "opacity-50")}>
									<div className={cn("size-8 rounded-full flex items-center justify-center shrink-0", severity.color, "bg-opacity-20")}>
										<ActionIcon className={cn("size-4", `text-${severity.color.replace("bg-", "")}`)} />
									</div>

									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<span className="font-medium">{action.label}</span>
											<span className="text-muted-foreground">{entry.entityType}</span>
											{entry.entityId && <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{entry.entityId.slice(0, 8)}...</code>}
											{entry.reversed && <Badge variant="outline" className="text-xs">Reversed</Badge>}
										</div>

										<div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
											<SeverityIcon className="size-3" />
											<span>{severity.label}</span>
											{entry.toolName && (
												<>
													<span>•</span>
													<span>Tool: {entry.toolName}</span>
												</>
											)}
											{entry.changedFields.length > 0 && (
												<>
													<span>•</span>
													<span>Fields: {entry.changedFields.join(", ")}</span>
												</>
											)}
										</div>
									</div>

									<div className="flex items-center gap-2 shrink-0">
										<span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}</span>

										{entry.isReversible && !entry.reversed && (
											<Button variant="ghost" size="sm" onClick={() => handleUndo(entry)} className="gap-1.5 h-7 text-xs">
												<RotateCcw className="size-3" />
												Undo
											</Button>
										)}
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>

			{/* Pagination */}
			{total > 50 && (
				<div className="flex items-center justify-center gap-2">
					<Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
						Previous
					</Button>
					<span className="text-sm text-muted-foreground">
						Page {page + 1} of {Math.ceil(total / 50)}
					</span>
					<Button variant="outline" size="sm" disabled={(page + 1) * 50 >= total} onClick={() => setPage((p) => p + 1)}>
						Next
					</Button>
				</div>
			)}

			{/* Undo confirmation dialog */}
			<Dialog open={!!undoDialog} onOpenChange={(open) => !open && setUndoDialog(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Undo AI Action</DialogTitle>
						<DialogDescription>This will restore the entity to its previous state. This action is logged.</DialogDescription>
					</DialogHeader>

					{undoDialog?.preview && (
						<div className="space-y-4">
							<div className="p-3 bg-muted rounded-lg space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Entity Type</span>
									<span className="font-medium">{undoDialog.preview.entityType}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Operation</span>
									<span className="font-medium">{undoDialog.preview.operation}</span>
								</div>
								{undoDialog.preview.changedFields.length > 0 && (
									<div className="flex justify-between">
										<span className="text-muted-foreground">Fields to Restore</span>
										<span className="font-medium">{undoDialog.preview.changedFields.join(", ")}</span>
									</div>
								)}
							</div>

							{!undoDialog.preview.canRevert && (
								<div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
									<AlertTriangle className="size-4 inline mr-2" />
									{undoDialog.preview.reason || "Cannot revert this action"}
								</div>
							)}

							<Textarea placeholder="Reason for undo (optional)" value={undoReason} onChange={(e) => setUndoReason(e.target.value)} rows={2} />
						</div>
					)}

					<DialogFooter>
						<Button variant="outline" onClick={() => setUndoDialog(null)}>
							Cancel
						</Button>
						<Button onClick={confirmUndo} disabled={isUndoing || !undoDialog?.preview?.canRevert} variant="destructive">
							{isUndoing ? "Reverting..." : "Confirm Undo"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

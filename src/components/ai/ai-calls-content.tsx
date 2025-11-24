"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
	Phone,
	PhoneCall,
	PhoneIncoming,
	PhoneOutgoing,
	PhoneMissed,
	Play,
	Pause,
	Settings,
	Bot,
	Clock,
	CheckCircle2,
	XCircle,
	AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CallStatus = "completed" | "in_progress" | "missed" | "failed" | "scheduled";
type CallType = "inbound" | "outbound";

type AICall = {
	id: string;
	type: CallType;
	status: CallStatus;
	customerName: string;
	customerPhone: string;
	duration: number | null;
	summary: string | null;
	sentiment: "positive" | "neutral" | "negative" | null;
	actionsTaken: string[];
	scheduledFor: string | null;
	createdAt: string;
};

const STATUS_CONFIG: Record<CallStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
	completed: { label: "Completed", color: "text-green-500", icon: CheckCircle2 },
	in_progress: { label: "In Progress", color: "text-blue-500", icon: PhoneCall },
	missed: { label: "Missed", color: "text-amber-500", icon: PhoneMissed },
	failed: { label: "Failed", color: "text-red-500", icon: XCircle },
	scheduled: { label: "Scheduled", color: "text-purple-500", icon: Clock },
};

// Demo data
const DEMO_CALLS: AICall[] = [
	{
		id: "1",
		type: "inbound",
		status: "completed",
		customerName: "John Smith",
		customerPhone: "+1 (555) 123-4567",
		duration: 245,
		summary: "Customer inquired about service pricing. AI provided quotes and scheduled a follow-up appointment.",
		sentiment: "positive",
		actionsTaken: ["Provided pricing info", "Created appointment", "Sent confirmation email"],
		scheduledFor: null,
		createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "2",
		type: "outbound",
		status: "completed",
		customerName: "Sarah Johnson",
		customerPhone: "+1 (555) 234-5678",
		duration: 180,
		summary: "Reminder call for scheduled maintenance. Customer confirmed appointment.",
		sentiment: "positive",
		actionsTaken: ["Confirmed appointment", "Updated job status"],
		scheduledFor: null,
		createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "3",
		type: "inbound",
		status: "missed",
		customerName: "Mike Davis",
		customerPhone: "+1 (555) 345-6789",
		duration: null,
		summary: null,
		sentiment: null,
		actionsTaken: [],
		scheduledFor: null,
		createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "4",
		type: "outbound",
		status: "scheduled",
		customerName: "Emily Wilson",
		customerPhone: "+1 (555) 456-7890",
		duration: null,
		summary: null,
		sentiment: null,
		actionsTaken: [],
		scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
		createdAt: new Date().toISOString(),
	},
];

function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AICallsContent() {
	const [aiEnabled, setAiEnabled] = useState(true);
	const [calls] = useState<AICall[]>(DEMO_CALLS);

	const stats = {
		total: calls.length,
		completed: calls.filter((c) => c.status === "completed").length,
		avgDuration: Math.round(calls.filter((c) => c.duration).reduce((acc, c) => acc + (c.duration || 0), 0) / calls.filter((c) => c.duration).length) || 0,
	};

	return (
		<div className="flex flex-col h-full p-4 space-y-4">
			{/* AI Toggle Card */}
			<Card>
				<CardHeader className="py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className={cn("size-10 rounded-full flex items-center justify-center", aiEnabled ? "bg-primary/10" : "bg-muted")}>
								<Bot className={cn("size-5", aiEnabled ? "text-primary" : "text-muted-foreground")} />
							</div>
							<div>
								<CardTitle className="text-base">AI Call Assistant</CardTitle>
								<CardDescription>Automatically handles inbound and outbound calls</CardDescription>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<span className={cn("text-sm", aiEnabled ? "text-primary" : "text-muted-foreground")}>{aiEnabled ? "Active" : "Paused"}</span>
							<Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Stats */}
			<div className="grid grid-cols-3 gap-4">
				<div className="p-4 border rounded-lg bg-card">
					<div className="text-xs text-muted-foreground">Total Calls (Today)</div>
					<div className="text-2xl font-semibold">{stats.total}</div>
				</div>
				<div className="p-4 border rounded-lg bg-card">
					<div className="text-xs text-muted-foreground">Completed</div>
					<div className="text-2xl font-semibold text-green-500">{stats.completed}</div>
				</div>
				<div className="p-4 border rounded-lg bg-card">
					<div className="text-xs text-muted-foreground">Avg Duration</div>
					<div className="text-2xl font-semibold">{formatDuration(stats.avgDuration)}</div>
				</div>
			</div>

			{/* Calls list */}
			<div className="flex-1 border rounded-lg overflow-hidden">
				<div className="divide-y overflow-auto h-full">
					{calls.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
							<Phone className="size-8 mb-2 opacity-40" />
							<p className="text-sm">No AI calls yet</p>
							<p className="text-xs">Calls will appear here when AI handles them</p>
						</div>
					) : (
						calls.map((call) => {
							const status = STATUS_CONFIG[call.status];
							const StatusIcon = status.icon;
							const TypeIcon = call.type === "inbound" ? PhoneIncoming : PhoneOutgoing;

							return (
								<div key={call.id} className="p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors">
									<div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0">
										<TypeIcon className="size-5 text-muted-foreground" />
									</div>

									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<span className="font-medium">{call.customerName}</span>
											<span className="text-sm text-muted-foreground">{call.customerPhone}</span>
											<Badge variant="outline" className={cn("text-xs", status.color)}>
												<StatusIcon className="size-3 mr-1" />
												{status.label}
											</Badge>
										</div>

										{call.summary && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{call.summary}</p>}

										{call.actionsTaken.length > 0 && (
											<div className="flex flex-wrap gap-1 mt-2">
												{call.actionsTaken.map((action, i) => (
													<Badge key={i} variant="secondary" className="text-xs">
														{action}
													</Badge>
												))}
											</div>
										)}

										{call.scheduledFor && (
											<div className="flex items-center gap-1 mt-2 text-xs text-purple-500">
												<Clock className="size-3" />
												Scheduled for {formatDistanceToNow(new Date(call.scheduledFor), { addSuffix: true })}
											</div>
										)}
									</div>

									<div className="flex flex-col items-end gap-2 shrink-0">
										<span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(call.createdAt), { addSuffix: true })}</span>

										{call.duration && <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{formatDuration(call.duration)}</span>}

										{call.sentiment && (
											<Badge
												variant="outline"
												className={cn(
													"text-xs",
													call.sentiment === "positive" && "text-green-500 border-green-500/30",
													call.sentiment === "negative" && "text-red-500 border-red-500/30",
													call.sentiment === "neutral" && "text-muted-foreground"
												)}
											>
												{call.sentiment}
											</Badge>
										)}
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>

			{/* Coming Soon Notice */}
			<Card className="border-dashed">
				<CardContent className="py-4">
					<div className="flex items-center gap-3">
						<AlertCircle className="size-5 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">AI Calling Coming Soon</p>
							<p className="text-xs text-muted-foreground">Full AI phone integration with Telnyx is under development. Demo data shown above.</p>
						</div>
						<Button variant="outline" size="sm" className="ml-auto gap-2">
							<Settings className="size-4" />
							Configure
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

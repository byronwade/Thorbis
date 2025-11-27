"use client";

import { formatDistanceToNow } from "date-fns";
import {
	AlertCircle,
	ArrowDown,
	ArrowUp,
	Bot,
	CheckCircle2,
	Clock,
	Inbox,
	MessageSquare,
	Reply,
	Send,
	Settings,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type TextStatus = "delivered" | "sent" | "pending" | "failed" | "received";
type TextDirection = "inbound" | "outbound";

type AIText = {
	id: string;
	direction: TextDirection;
	status: TextStatus;
	customerName: string;
	customerPhone: string;
	content: string;
	aiGenerated: boolean;
	autoReplied: boolean;
	intent: string | null;
	sentiment: "positive" | "neutral" | "negative" | null;
	createdAt: string;
};

const STATUS_CONFIG: Record<
	TextStatus,
	{ label: string; color: string; icon: typeof CheckCircle2 }
> = {
	delivered: {
		label: "Delivered",
		color: "text-green-500",
		icon: CheckCircle2,
	},
	sent: { label: "Sent", color: "text-blue-500", icon: Send },
	pending: { label: "Pending", color: "text-amber-500", icon: Clock },
	failed: { label: "Failed", color: "text-red-500", icon: XCircle },
	received: { label: "Received", color: "text-purple-500", icon: Inbox },
};

// Demo data
const DEMO_TEXTS: AIText[] = [
	{
		id: "1",
		direction: "inbound",
		status: "received",
		customerName: "John Smith",
		customerPhone: "+1 (555) 123-4567",
		content:
			"Hi, I'd like to schedule an appointment for tomorrow if possible.",
		aiGenerated: false,
		autoReplied: true,
		intent: "appointment_request",
		sentiment: "positive",
		createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
	},
	{
		id: "2",
		direction: "outbound",
		status: "delivered",
		customerName: "John Smith",
		customerPhone: "+1 (555) 123-4567",
		content:
			"Hi John! I've checked our schedule and we have availability tomorrow at 10am or 2pm. Which works better for you?",
		aiGenerated: true,
		autoReplied: true,
		intent: "appointment_response",
		sentiment: "positive",
		createdAt: new Date(Date.now() - 29 * 60 * 1000).toISOString(),
	},
	{
		id: "3",
		direction: "outbound",
		status: "delivered",
		customerName: "Sarah Johnson",
		customerPhone: "+1 (555) 234-5678",
		content:
			"Hi Sarah! This is a reminder about your scheduled service appointment tomorrow at 9:00 AM. Reply CONFIRM to confirm or RESCHEDULE to change.",
		aiGenerated: true,
		autoReplied: false,
		intent: "appointment_reminder",
		sentiment: "neutral",
		createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "4",
		direction: "inbound",
		status: "received",
		customerName: "Sarah Johnson",
		customerPhone: "+1 (555) 234-5678",
		content: "CONFIRM",
		aiGenerated: false,
		autoReplied: true,
		intent: "confirmation",
		sentiment: "positive",
		createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: "5",
		direction: "outbound",
		status: "delivered",
		customerName: "Sarah Johnson",
		customerPhone: "+1 (555) 234-5678",
		content:
			"Great! Your appointment is confirmed for tomorrow at 9:00 AM. See you then!",
		aiGenerated: true,
		autoReplied: true,
		intent: "confirmation_response",
		sentiment: "positive",
		createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000 + 5000).toISOString(),
	},
	{
		id: "6",
		direction: "inbound",
		status: "received",
		customerName: "Mike Davis",
		customerPhone: "+1 (555) 345-6789",
		content: "I have a leak in my bathroom, can someone come out today?",
		aiGenerated: false,
		autoReplied: false,
		intent: "emergency_request",
		sentiment: "negative",
		createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
	},
];

export function AITextsContent() {
	const [aiEnabled, setAiEnabled] = useState(true);
	const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
	const [texts] = useState<AIText[]>(DEMO_TEXTS);

	const stats = {
		total: texts.length,
		aiGenerated: texts.filter((t) => t.aiGenerated).length,
		autoReplied: texts.filter((t) => t.autoReplied).length,
		inbound: texts.filter((t) => t.direction === "inbound").length,
	};

	return (
		<div className="flex flex-col h-full p-4 space-y-4">
			{/* AI Toggle Card */}
			<Card>
				<CardHeader className="py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div
								className={cn(
									"size-10 rounded-full flex items-center justify-center",
									aiEnabled ? "bg-primary/10" : "bg-muted",
								)}
							>
								<Bot
									className={cn(
										"size-5",
										aiEnabled ? "text-primary" : "text-muted-foreground",
									)}
								/>
							</div>
							<div>
								<CardTitle className="text-base">AI Text Assistant</CardTitle>
								<CardDescription>
									Automatically responds to incoming messages
								</CardDescription>
							</div>
						</div>
						<div className="flex items-center gap-6">
							<div className="flex items-center gap-2">
								<span className="text-sm text-muted-foreground">
									Auto-Reply
								</span>
								<Switch
									checked={autoReplyEnabled}
									onCheckedChange={setAutoReplyEnabled}
									disabled={!aiEnabled}
								/>
							</div>
							<div className="flex items-center gap-2">
								<span
									className={cn(
										"text-sm",
										aiEnabled ? "text-primary" : "text-muted-foreground",
									)}
								>
									{aiEnabled ? "Active" : "Paused"}
								</span>
								<Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
							</div>
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Stats */}
			<div className="grid grid-cols-4 gap-4">
				<div className="p-4 border rounded-lg bg-card">
					<div className="text-xs text-muted-foreground">
						Total Messages (Today)
					</div>
					<div className="text-2xl font-semibold">{stats.total}</div>
				</div>
				<div className="p-4 border rounded-lg bg-card">
					<div className="text-xs text-muted-foreground">AI Generated</div>
					<div className="text-2xl font-semibold text-primary">
						{stats.aiGenerated}
					</div>
				</div>
				<div className="p-4 border rounded-lg bg-card">
					<div className="text-xs text-muted-foreground">Auto-Replied</div>
					<div className="text-2xl font-semibold text-green-500">
						{stats.autoReplied}
					</div>
				</div>
				<div className="p-4 border rounded-lg bg-card">
					<div className="text-xs text-muted-foreground">Inbound</div>
					<div className="text-2xl font-semibold">{stats.inbound}</div>
				</div>
			</div>

			{/* Messages list */}
			<div className="flex-1 border rounded-lg overflow-hidden">
				<div className="divide-y overflow-auto h-full">
					{texts.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
							<MessageSquare className="size-8 mb-2 opacity-40" />
							<p className="text-sm">No AI texts yet</p>
							<p className="text-xs">
								Text messages will appear here when AI processes them
							</p>
						</div>
					) : (
						texts.map((text) => {
							const status = STATUS_CONFIG[text.status];
							const StatusIcon = status.icon;
							const DirectionIcon =
								text.direction === "inbound" ? ArrowDown : ArrowUp;

							return (
								<div
									key={text.id}
									className="p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors"
								>
									<div
										className={cn(
											"size-10 rounded-full flex items-center justify-center shrink-0",
											text.direction === "inbound"
												? "bg-purple-500/10"
												: "bg-blue-500/10",
										)}
									>
										<DirectionIcon
											className={cn(
												"size-5",
												text.direction === "inbound"
													? "text-purple-500"
													: "text-blue-500",
											)}
										/>
									</div>

									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<span className="font-medium">{text.customerName}</span>
											<span className="text-sm text-muted-foreground">
												{text.customerPhone}
											</span>
											{text.aiGenerated && (
												<Badge variant="outline" className="text-xs gap-1">
													<Bot className="size-3" />
													AI
												</Badge>
											)}
											{text.autoReplied && (
												<Badge variant="secondary" className="text-xs gap-1">
													<Reply className="size-3" />
													Auto
												</Badge>
											)}
										</div>

										<p className="text-sm mt-1 text-foreground/80">
											{text.content}
										</p>

										<div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
											<span
												className={cn("flex items-center gap-1", status.color)}
											>
												<StatusIcon className="size-3" />
												{status.label}
											</span>

											{text.intent && (
												<>
													<span>•</span>
													<span>Intent: {text.intent.replace(/_/g, " ")}</span>
												</>
											)}

											{text.sentiment && (
												<>
													<span>•</span>
													<span
														className={cn(
															text.sentiment === "positive" && "text-green-500",
															text.sentiment === "negative" && "text-red-500",
														)}
													>
														{text.sentiment}
													</span>
												</>
											)}
										</div>
									</div>

									<span className="text-xs text-muted-foreground shrink-0">
										{formatDistanceToNow(new Date(text.createdAt), {
											addSuffix: true,
										})}
									</span>
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
							<p className="text-sm font-medium">AI Texting Coming Soon</p>
							<p className="text-xs text-muted-foreground">
								Full AI SMS automation with Twilio is under development. Demo
								data shown above.
							</p>
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

"use client";

import {
	Mail,
	MessageSquare,
	Phone,
	Users,
	Inbox,
	Send,
	Archive,
	Star,
	ChevronRight,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

/**
 * MobileCommunicationDashboard - Mobile-optimized communication hub
 *
 * Provides quick access to all communication channels:
 * - Email (Inbox, Sent, Archived, Starred)
 * - SMS / Text Messages
 * - Phone Calls
 * - Teams Chat
 * - Quick stats and recent activity
 *
 * Designed for touch-friendly mobile interaction with large tap targets.
 */

type CommunicationChannel = {
	id: string;
	label: string;
	href: string;
	icon: React.ElementType;
	count?: number;
	color: string;
	bgColor: string;
};

type QuickAction = {
	label: string;
	href: string;
	icon: React.ElementType;
	description: string;
};

const channels: CommunicationChannel[] = [
	{
		id: "email",
		label: "Email",
		href: "/dashboard/communication/email?folder=inbox",
		icon: Mail,
		color: "text-blue-600 dark:text-blue-400",
		bgColor: "bg-blue-500/10 dark:bg-blue-400/10",
	},
	{
		id: "sms",
		label: "SMS",
		href: "/dashboard/communication/sms",
		icon: MessageSquare,
		color: "text-green-600 dark:text-green-400",
		bgColor: "bg-green-500/10 dark:bg-green-400/10",
	},
	{
		id: "calls",
		label: "Calls",
		href: "/dashboard/communication/calls",
		icon: Phone,
		color: "text-purple-600 dark:text-purple-400",
		bgColor: "bg-purple-500/10 dark:bg-purple-400/10",
	},
	{
		id: "teams",
		label: "Teams",
		href: "/dashboard/communication/teams?channel=general",
		icon: Users,
		color: "text-orange-600 dark:text-orange-400",
		bgColor: "bg-orange-500/10 dark:bg-orange-400/10",
	},
];

const emailActions: QuickAction[] = [
	{
		label: "Inbox",
		href: "/dashboard/communication/email?folder=inbox",
		icon: Inbox,
		description: "Unread messages",
	},
	{
		label: "Sent",
		href: "/dashboard/communication/email?folder=sent",
		icon: Send,
		description: "Sent emails",
	},
	{
		label: "Archived",
		href: "/dashboard/communication/email?folder=archived",
		icon: Archive,
		description: "Archived items",
	},
	{
		label: "Starred",
		href: "/dashboard/communication/email?folder=starred",
		icon: Star,
		description: "Important",
	},
];

export function MobileCommunicationDashboard() {
	return (
		<div className="flex h-full flex-col overflow-hidden bg-background">
			{/* Header */}
			<div className="shrink-0 border-b bg-card p-4 shadow-sm">
				<h1 className="text-2xl font-bold tracking-tight">Communication Hub</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Manage all your conversations
				</p>
			</div>

			{/* Scrollable content */}
			<div className="flex-1 overflow-y-auto p-4 space-y-6 pb-safe">
				{/* Main channels - Large cards */}
				<div className="space-y-3">
					<h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
						Channels
					</h2>
					<div className="grid grid-cols-2 gap-3">
						{channels.map((channel) => {
							const Icon = channel.icon;

							return (
								<Link
									className="group flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.98]"
									href={channel.href}
									key={channel.id}
								>
									<div className="flex w-full items-center justify-between">
										<div
											className={`flex h-12 w-12 items-center justify-center rounded-lg ${channel.bgColor}`}
										>
											<Icon className={`h-6 w-6 ${channel.color}`} />
										</div>
										{channel.count !== undefined && channel.count > 0 && (
											<Badge className="h-6 px-2" variant="destructive">
												{channel.count > 99 ? "99+" : channel.count}
											</Badge>
										)}
									</div>
									<div className="flex w-full items-center justify-between">
										<span className="font-semibold text-sm">{channel.label}</span>
										<ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
									</div>
								</Link>
							);
						})}
					</div>
				</div>

				{/* Email quick actions */}
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
							Email Folders
						</h2>
						<Link
							className="text-xs text-primary hover:underline"
							href="/dashboard/communication/email"
						>
							View All
						</Link>
					</div>
					<div className="grid grid-cols-2 gap-2">
						{emailActions.map((action) => {
							const Icon = action.icon;

							return (
								<Link
									className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98]"
									href={action.href}
									key={action.href}
								>
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/50 transition-colors group-hover:bg-primary/10">
										<Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="font-medium text-sm">{action.label}</div>
										<div className="text-xs text-muted-foreground truncate">
											{action.description}
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				</div>

				{/* Quick stats */}
				<div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-4">
					<div className="flex items-center gap-2 mb-3">
						<TrendingUp className="h-5 w-5 text-primary" />
						<h3 className="font-semibold text-sm">Today's Activity</h3>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1">
							<span className="text-2xl font-bold">--</span>
							<span className="text-xs text-muted-foreground">
								Emails Received
							</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-2xl font-bold">--</span>
							<span className="text-xs text-muted-foreground">SMS Sent</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-2xl font-bold">--</span>
							<span className="text-xs text-muted-foreground">Calls Made</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-2xl font-bold">--</span>
							<span className="text-xs text-muted-foreground">Team Messages</span>
						</div>
					</div>
				</div>

				{/* View analytics link */}
				<Link
					className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98]"
					href="/dashboard/communication"
				>
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
							<TrendingUp className="h-5 w-5 text-primary" />
						</div>
						<div>
							<div className="font-medium text-sm">View Analytics</div>
							<div className="text-xs text-muted-foreground">
								Detailed stats and reports
							</div>
						</div>
					</div>
					<ChevronRight className="h-5 w-5 text-muted-foreground" />
				</Link>
			</div>
		</div>
	);
}

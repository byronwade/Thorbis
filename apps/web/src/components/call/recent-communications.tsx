"use client";

/**
 * Recent Communications Widget
 *
 * Compact inline display of the last 3 communications with a customer.
 * Shows communication type icon, preview, and timestamp.
 * Designed for the call window sidebar to provide quick context.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
    ChevronRight,
    ExternalLink,
    Mail,
    MessageSquare,
    Phone,
    Voicemail,
} from "lucide-react";
import Link from "next/link";

type CommunicationType = "sms" | "email" | "call" | "voicemail";

type RecentCommunication = {
	id: string;
	type: CommunicationType;
	direction: "inbound" | "outbound";
	subject?: string | null;
	body?: string | null;
	from_number?: string | null;
	to_number?: string | null;
	from_email?: string | null;
	to_email?: string | null;
	created_at: string;
	status?: string;
};

type RecentCommunicationsProps = {
	communications: RecentCommunication[];
	customerId?: string;
	maxItems?: number;
	showViewAll?: boolean;
	className?: string;
};

const getTypeConfig = (type: CommunicationType) => {
	switch (type) {
		case "email":
			return {
				icon: Mail,
				color: "text-blue-500",
				bg: "bg-blue-500/10",
				label: "Email",
			};
		case "sms":
			return {
				icon: MessageSquare,
				color: "text-green-500",
				bg: "bg-green-500/10",
				label: "SMS",
			};
		case "call":
			return {
				icon: Phone,
				color: "text-purple-500",
				bg: "bg-purple-500/10",
				label: "Call",
			};
		case "voicemail":
			return {
				icon: Voicemail,
				color: "text-orange-500",
				bg: "bg-orange-500/10",
				label: "Voicemail",
			};
		default:
			return {
				icon: Mail,
				color: "text-slate-500",
				bg: "bg-slate-500/10",
				label: "Message",
			};
	}
};

const getPreview = (comm: RecentCommunication): string => {
	if (comm.subject) return comm.subject;
	if (comm.body) {
		// Strip HTML and truncate
		const text = comm.body.replace(/<[^>]*>/g, "").trim();
		return text.length > 60 ? text.substring(0, 60) + "…" : text;
	}
	// Fallback based on type
	switch (comm.type) {
		case "call":
			return comm.direction === "inbound" ? "Incoming call" : "Outgoing call";
		case "sms":
			return "Text message";
		case "voicemail":
			return "Voicemail";
		default:
			return "No preview";
	}
};

export function RecentCommunications({
	communications,
	customerId,
	maxItems = 3,
	showViewAll = true,
	className,
}: RecentCommunicationsProps) {
	const recentComms = communications.slice(0, maxItems);

	if (recentComms.length === 0) {
		return (
			<div className={cn("space-y-2", className)}>
				<div className="flex items-center justify-between">
					<h4 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
						Recent Activity
					</h4>
				</div>
				<p className="text-muted-foreground py-4 text-center text-xs">
					No recent communications
				</p>
			</div>
		);
	}

	return (
		<div className={cn("space-y-2", className)}>
			<div className="flex items-center justify-between">
				<h4 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
					Recent Activity
				</h4>
				{showViewAll && customerId && (
					<Button
						variant="ghost"
						size="sm"
						className="h-6 gap-1 px-2 text-xs"
						asChild
					>
						<Link href={`/dashboard/communication?customerId=${customerId}`}>
							View All
							<ExternalLink className="h-3 w-3" />
						</Link>
					</Button>
				)}
			</div>

			<div className="space-y-1.5">
				{recentComms.map((comm) => {
					const config = getTypeConfig(comm.type);
					const TypeIcon = config.icon;

					return (
						<Link
							key={comm.id}
							href={`/dashboard/communication?id=${comm.id}`}
							className={cn(
								"group flex items-start gap-2 rounded-lg border p-2 transition-colors",
								"hover:bg-accent/50",
							)}
						>
							{/* Type Icon */}
							<div className={cn("mt-0.5 rounded-full p-1.5", config.bg)}>
								<TypeIcon className={cn("h-3 w-3", config.color)} />
							</div>

							{/* Content */}
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-1.5">
									<span className="text-muted-foreground text-[10px] uppercase">
										{config.label}
									</span>
									<span className="text-muted-foreground/50 text-[10px]">
										{comm.direction === "inbound" ? "received" : "sent"}
									</span>
								</div>
								<p className="text-foreground line-clamp-1 text-xs font-medium">
									{getPreview(comm)}
								</p>
								<p className="text-muted-foreground text-[10px]">
									{formatDistanceToNow(new Date(comm.created_at), {
										addSuffix: true,
									})}
								</p>
							</div>

							{/* Arrow */}
							<ChevronRight className="text-muted-foreground mt-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
						</Link>
					);
				})}
			</div>

			{/* Show count if there are more */}
			{communications.length > maxItems && (
				<p className="text-muted-foreground/60 text-center text-[10px]">
					+{communications.length - maxItems} more communications
				</p>
			)}
		</div>
	);
}

/**
 * Compact Communication Badge
 *
 * Single-line indicator showing last communication type and time.
 * Good for table cells or very tight spaces.
 */
type CommunicationBadgeProps = {
	communication: RecentCommunication | null;
	className?: string;
};

function LastCommunicationBadge({
	communication,
	className,
}: CommunicationBadgeProps) {
	if (!communication) {
		return (
			<Badge variant="outline" className={cn("text-xs", className)}>
				No contact
			</Badge>
		);
	}

	const config = getTypeConfig(communication.type);
	const TypeIcon = config.icon;

	return (
		<Badge
			variant="outline"
			className={cn("gap-1 text-xs", config.bg, className)}
		>
			<TypeIcon className={cn("h-3 w-3", config.color)} />
			{formatDistanceToNow(new Date(communication.created_at), {
				addSuffix: true,
			})}
		</Badge>
	);
}

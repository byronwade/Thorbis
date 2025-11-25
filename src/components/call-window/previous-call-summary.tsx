"use client";

/**
 * Previous Call Summary
 *
 * Shows the last call's summary to give CSRs context about
 * prior interactions with the customer.
 *
 * Includes:
 * - Date/time of last call
 * - Call disposition
 * - CSR who handled the call
 * - Notes/summary
 * - Topics discussed (from AI analysis)
 */

import {
	Calendar,
	ChevronDown,
	ChevronUp,
	Clock,
	FileText,
	MessageSquare,
	Phone,
	Sparkles,
	User,
	AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CallSummary = {
	id: string;
	date: string;
	duration: number; // in seconds
	disposition: string;
	csrName: string;
	notes?: string;
	topics?: string[];
	sentiment?: "positive" | "neutral" | "negative";
	followUpScheduled?: boolean;
	issueResolved?: boolean;
};

type PreviousCallSummaryProps = {
	lastCall: CallSummary | null;
	recentCalls?: CallSummary[];
	onViewAllCalls?: () => void;
	className?: string;
};

const dispositionColors: Record<string, string> = {
	resolved: "bg-success/10 text-success border-success/30",
	callback_scheduled: "bg-warning/10 text-warning border-warning/30",
	escalated: "bg-orange-500/10 text-orange-500 border-orange-500/30",
	voicemail_left: "bg-muted text-muted-foreground border-muted",
	transferred: "bg-muted text-muted-foreground border-muted",
	customer_hung_up: "bg-muted text-muted-foreground border-muted",
	appointment_booked: "bg-primary/10 text-primary border-primary/30",
	quote_provided: "bg-primary/10 text-primary border-primary/30",
	payment_taken: "bg-success/10 text-success border-success/30",
	other: "bg-muted text-muted-foreground border-muted",
};

const sentimentColors: Record<string, string> = {
	positive: "text-success",
	neutral: "text-muted-foreground",
	negative: "text-destructive",
};

const sentimentIcons: Record<string, string> = {
	positive: "😊",
	neutral: "😐",
	negative: "😠",
};

export function PreviousCallSummary({
	lastCall,
	recentCalls = [],
	onViewAllCalls,
	className,
}: PreviousCallSummaryProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	if (!lastCall) {
		return (
			<div
				className={cn(
					"border-primary/20 bg-primary/5 rounded-xl border p-4",
					className,
				)}
			>
				<div className="flex items-start gap-3">
					<div className="bg-primary/10 rounded-full p-2">
						<Phone className="text-primary h-4 w-4" />
					</div>
					<div className="flex-1">
						<h4 className="text-sm font-semibold">First Call</h4>
						<p className="text-muted-foreground mt-1 text-xs">
							This is the first call with this customer. No previous call
							history available.
						</p>
					</div>
				</div>
			</div>
		);
	}

	// Format duration
	const formatDuration = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		if (mins === 0) return `${secs}s`;
		return `${mins}m ${secs}s`;
	};

	// Format date
	const formatDate = (dateStr: string): string => {
		const date = new Date(dateStr);
		const now = new Date();
		const diffDays = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
		);

		if (diffDays === 0) {
			return `Today at ${date.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
			})}`;
		}
		if (diffDays === 1) {
			return `Yesterday at ${date.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
			})}`;
		}
		if (diffDays < 7) {
			return `${diffDays} days ago`;
		}
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
		});
	};

	// Format disposition for display
	const formatDisposition = (disposition: string): string => {
		return disposition
			.replace(/_/g, " ")
			.replace(/\b\w/g, (l) => l.toUpperCase());
	};

	const dispositionClass =
		dispositionColors[lastCall.disposition] || dispositionColors.other;

	return (
		<div
			className={cn(
				"bg-muted/30 overflow-hidden rounded-xl border transition-all",
				className,
			)}
		>
			{/* Header */}
			<button
				className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
				onClick={() => setIsExpanded(!isExpanded)}
				type="button"
			>
				<div className="flex items-center gap-3">
					<div className="bg-muted rounded-full p-2">
						<Phone className="text-muted-foreground h-4 w-4" />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h4 className="text-sm font-semibold">Previous Call</h4>
							{lastCall.sentiment && (
								<span title={`Customer was ${lastCall.sentiment}`}>
									{sentimentIcons[lastCall.sentiment]}
								</span>
							)}
						</div>
						<p className="text-muted-foreground text-xs">
							{formatDate(lastCall.date)} • {formatDuration(lastCall.duration)}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Badge className={cn("text-xs", dispositionClass)} variant="outline">
						{formatDisposition(lastCall.disposition)}
					</Badge>
					{isExpanded ? (
						<ChevronUp className="text-muted-foreground h-4 w-4" />
					) : (
						<ChevronDown className="text-muted-foreground h-4 w-4" />
					)}
				</div>
			</button>

			{/* Expanded Content */}
			{isExpanded && (
				<div className="border-t p-4 pt-3">
					{/* Quick Stats */}
					<div className="mb-3 grid grid-cols-3 gap-2">
						<div className="bg-card rounded-lg p-2 text-center">
							<div className="flex items-center justify-center gap-1">
								<User className="text-muted-foreground h-3 w-3" />
								<span className="text-xs font-medium">{lastCall.csrName}</span>
							</div>
							<span className="text-muted-foreground text-[10px]">
								Handled by
							</span>
						</div>
						<div className="bg-card rounded-lg p-2 text-center">
							<div className="flex items-center justify-center gap-1">
								<Clock className="text-muted-foreground h-3 w-3" />
								<span className="text-xs font-medium">
									{formatDuration(lastCall.duration)}
								</span>
							</div>
							<span className="text-muted-foreground text-[10px]">Duration</span>
						</div>
						<div className="bg-card rounded-lg p-2 text-center">
							<div className="flex items-center justify-center gap-1">
								{lastCall.issueResolved ? (
									<span className="text-success text-xs font-medium">Yes</span>
								) : (
									<span className="text-warning text-xs font-medium">No</span>
								)}
							</div>
							<span className="text-muted-foreground text-[10px]">Resolved</span>
						</div>
					</div>

					{/* Topics discussed */}
					{lastCall.topics && lastCall.topics.length > 0 && (
						<div className="mb-3">
							<div className="mb-1.5 flex items-center gap-1">
								<Sparkles className="text-primary h-3 w-3" />
								<span className="text-muted-foreground text-xs font-medium">
									Topics Discussed
								</span>
							</div>
							<div className="flex flex-wrap gap-1">
								{lastCall.topics.map((topic, index) => (
									<Badge
										className="text-[10px]"
										key={index}
										variant="secondary"
									>
										{topic}
									</Badge>
								))}
							</div>
						</div>
					)}

					{/* Notes */}
					{lastCall.notes && (
						<div className="mb-3">
							<div className="mb-1.5 flex items-center gap-1">
								<FileText className="text-muted-foreground h-3 w-3" />
								<span className="text-muted-foreground text-xs font-medium">
									Notes
								</span>
							</div>
							<p className="bg-card rounded-lg border p-2 text-xs">
								{lastCall.notes}
							</p>
						</div>
					)}

					{/* Follow-up alert */}
					{lastCall.followUpScheduled && !lastCall.issueResolved && (
						<div className="bg-warning/10 border-warning/30 flex items-start gap-2 rounded-lg border p-2">
							<AlertTriangle className="text-warning mt-0.5 h-3.5 w-3.5 shrink-0" />
							<p className="text-warning text-xs">
								Follow-up was scheduled for this customer. Check if issue was
								resolved.
							</p>
						</div>
					)}

					{/* View all button */}
					{onViewAllCalls && recentCalls.length > 0 && (
						<Button
							className="mt-3 w-full gap-1 text-xs"
							onClick={onViewAllCalls}
							size="sm"
							variant="outline"
						>
							<MessageSquare className="h-3 w-3" />
							View All {recentCalls.length + 1} Calls
						</Button>
					)}
				</div>
			)}
		</div>
	);
}

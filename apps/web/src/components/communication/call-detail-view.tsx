"use client";

/**
 * Call Detail View Component
 *
 * Displays detailed information about a phone call in the unified inbox.
 * Features:
 * - Call metadata (duration, direction, timestamp)
 * - Audio player for recordings
 * - Transcription display with sentiment
 * - Customer context and quick actions
 * - Transfer/assign to team member
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MediaPlayer } from "@/components/ui/media-player";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Communication } from "@/lib/queries/communications";
import { cn } from "@/lib/utils";
import {
    ArrowDownLeft,
    ArrowUpRight,
    Calendar,
    ChevronDown,
    ChevronUp,
    Clock,
    ExternalLink,
    MessageSquare,
    Phone,
    PhoneForwarded,
    PhoneOff,
    User,
    Volume2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CallDetailViewProps {
	communication: Communication;
	onSendText?: (phone: string) => void;
	onCallBack?: (phone: string) => void;
	onTransfer?: (communicationId: string) => void;
}

function formatDuration(seconds: number | null | undefined): string {
	if (!seconds) return "0:00";
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDateTime(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}

function getSentimentBadge(sentiment: string | null | undefined) {
	if (!sentiment) return null;

	const sentimentLower = sentiment.toLowerCase();
	let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
	let label = sentiment;

	if (sentimentLower.includes("positive") || sentimentLower.includes("happy")) {
		variant = "default";
		label = "Positive";
	} else if (sentimentLower.includes("negative") || sentimentLower.includes("angry") || sentimentLower.includes("frustrated")) {
		variant = "destructive";
		label = "Negative";
	} else if (sentimentLower.includes("neutral")) {
		variant = "secondary";
		label = "Neutral";
	}

	return <Badge variant={variant}>{label}</Badge>;
}

function getCallStatusInfo(communication: Communication) {
	const { status, hangupCause, hangupSource, callDuration, answeringMachineDetected } = communication;

	// Determine call outcome
	if (answeringMachineDetected) {
		return {
			label: "Voicemail",
			icon: Volume2,
			color: "text-orange-500",
			description: "Call went to voicemail",
		};
	}

	if (hangupCause === "no_answer" || status === "missed") {
		return {
			label: "Missed",
			icon: PhoneOff,
			color: "text-red-500",
			description: "Call was not answered",
		};
	}

	if (callDuration && callDuration > 0) {
		return {
			label: "Completed",
			icon: Phone,
			color: "text-green-500",
			description: `Call lasted ${formatDuration(callDuration)}`,
		};
	}

	if (status === "in_progress") {
		return {
			label: "In Progress",
			icon: Phone,
			color: "text-blue-500",
			description: "Call is currently active",
		};
	}

	return {
		label: "Call",
		icon: Phone,
		color: "text-muted-foreground",
		description: status || "Unknown status",
	};
}

export function CallDetailView({
	communication,
	onSendText,
	onCallBack,
	onTransfer,
}: CallDetailViewProps) {
	const [transcriptExpanded, setTranscriptExpanded] = useState(true);

	const isInbound = communication.direction === "inbound";
	const phoneNumber = isInbound
		? communication.fromAddress
		: communication.toAddress;
	const contactName =
		communication.fromName ||
		communication.customer?.firstName
			? `${communication.customer?.firstName || ""} ${communication.customer?.lastName || ""}`.trim()
			: null;

	const statusInfo = getCallStatusInfo(communication);
	const StatusIcon = statusInfo.icon;

	return (
		<ScrollArea className="h-full">
			<div className="p-6 space-y-6">
				{/* Header */}
				<div className="flex items-start justify-between">
					<div className="flex items-start gap-4">
						{/* Direction indicator */}
						<div
							className={cn(
								"flex h-12 w-12 items-center justify-center rounded-full",
								isInbound ? "bg-blue-500/10" : "bg-green-500/10"
							)}
						>
							{isInbound ? (
								<ArrowDownLeft className="h-6 w-6 text-blue-500" />
							) : (
								<ArrowUpRight className="h-6 w-6 text-green-500" />
							)}
						</div>

						<div>
							<h2 className="text-lg font-semibold">
								{isInbound ? "Incoming Call" : "Outgoing Call"}
							</h2>
							<div className="flex items-center gap-2 mt-1 text-muted-foreground">
								<StatusIcon className={cn("h-4 w-4", statusInfo.color)} />
								<span className="text-sm">{statusInfo.description}</span>
							</div>
						</div>
					</div>

					<Badge variant="outline" className={statusInfo.color}>
						{statusInfo.label}
					</Badge>
				</div>

				<Separator />

				{/* Contact Info */}
				<div className="space-y-4">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Contact
					</h3>

					<div className="flex items-center gap-4">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
							<User className="h-5 w-5 text-muted-foreground" />
						</div>
						<div className="flex-1">
							{contactName ? (
								<>
									<div className="font-medium">{contactName}</div>
									<div className="text-sm text-muted-foreground">
										{phoneNumber}
									</div>
								</>
							) : (
								<div className="font-medium">{phoneNumber || "Unknown"}</div>
							)}
						</div>
						{communication.customerId && (
							<Link
								href={`/dashboard/customers/${communication.customerId}`}
								className="text-sm text-primary hover:underline flex items-center gap-1"
							>
								View Profile
								<ExternalLink className="h-3 w-3" />
							</Link>
						)}
					</div>
				</div>

				{/* Call Details */}
				<div className="space-y-4">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Call Details
					</h3>

					<div className="grid grid-cols-2 gap-4">
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4 text-muted-foreground" />
							<div>
								<div className="text-sm text-muted-foreground">Duration</div>
								<div className="font-medium">
									{formatDuration(communication.callDuration)}
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<div>
								<div className="text-sm text-muted-foreground">Date & Time</div>
								<div className="font-medium">
									{formatDateTime(communication.createdAt)}
								</div>
							</div>
						</div>
					</div>

					{communication.callSentiment && (
						<div className="flex items-center gap-2">
							<span className="text-sm text-muted-foreground">Sentiment:</span>
							{getSentimentBadge(communication.callSentiment)}
						</div>
					)}
				</div>

				{/* Recording */}
				{communication.callRecordingUrl && (
					<div className="space-y-4">
						<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
							Recording
						</h3>
						<MediaPlayer
							src={communication.callRecordingUrl}
							type="audio"
							title="Call Recording"
						/>
					</div>
				)}

				{/* Transcription */}
				{communication.callTranscript && (
					<div className="space-y-4">
						<Collapsible
							open={transcriptExpanded}
							onOpenChange={setTranscriptExpanded}
						>
							<CollapsibleTrigger asChild>
								<button
									type="button"
									className="flex items-center justify-between w-full group"
								>
									<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
										Transcription
									</h3>
									{transcriptExpanded ? (
										<ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
									) : (
										<ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
									)}
								</button>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<div className="mt-4 rounded-lg border bg-muted/50 p-4">
									<p className="text-sm whitespace-pre-wrap leading-relaxed">
										{communication.callTranscript}
									</p>
								</div>
							</CollapsibleContent>
						</Collapsible>
					</div>
				)}

				{/* Quick Actions */}
				<div className="space-y-4">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Actions
					</h3>

					<div className="flex flex-wrap gap-2">
						{phoneNumber && (
							<>
								<Button
									variant="outline"
									size="sm"
									onClick={() => onCallBack?.(phoneNumber)}
								>
									<Phone className="h-4 w-4 mr-2" />
									Call Back
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => onSendText?.(phoneNumber)}
								>
									<MessageSquare className="h-4 w-4 mr-2" />
									Send Text
								</Button>
							</>
						)}
						<Button
							variant="outline"
							size="sm"
							onClick={() => onTransfer?.(communication.id)}
						>
							<PhoneForwarded className="h-4 w-4 mr-2" />
							Transfer
						</Button>
					</div>
				</div>

				{/* Technical Details (collapsed by default) */}
				{(communication.hangupCause || communication.twilioCallSid) && (
					<Collapsible>
						<CollapsibleTrigger asChild>
							<button
								type="button"
								className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
							>
								<ChevronDown className="h-3 w-3" />
								Technical Details
							</button>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<div className="mt-2 rounded-lg border bg-muted/50 p-3 text-xs space-y-1">
								{communication.hangupCause && (
									<div>
										<span className="text-muted-foreground">Hangup Cause:</span>{" "}
										{communication.hangupCause}
									</div>
								)}
								{communication.hangupSource && (
									<div>
										<span className="text-muted-foreground">Hangup Source:</span>{" "}
										{communication.hangupSource}
									</div>
								)}
								{communication.twilioCallSid && (
									<div>
										<span className="text-muted-foreground">Call SID:</span>{" "}
										<code className="text-[10px]">{communication.twilioCallSid}</code>
									</div>
								)}
							</div>
						</CollapsibleContent>
					</Collapsible>
				)}
			</div>
		</ScrollArea>
	);
}

"use client";

/**
 * Voicemail Detail View Component
 *
 * Displays detailed information about a voicemail in the unified inbox.
 * Features:
 * - Prominent audio player
 * - Transcription display with confidence
 * - Duration and timestamp
 * - Mark as read/unread
 * - Quick actions (call back, send text, transfer)
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaPlayer } from "@/components/ui/media-player";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Communication } from "@/lib/queries/communications";
import {
    AlertCircle,
    Calendar,
    Check,
    Clock,
    ExternalLink,
    Mail,
    MailOpen,
    MessageSquare,
    Phone,
    PhoneForwarded,
    User,
    Voicemail,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface VoicemailDetailViewProps {
	communication: Communication;
	isRead?: boolean;
	transcriptionConfidence?: number;
	isUrgent?: boolean;
	onMarkAsRead?: (id: string, read: boolean) => void;
	onSendText?: (phone: string) => void;
	onCallBack?: (phone: string) => void;
	onTransfer?: (communicationId: string) => void;
	onDelete?: (id: string) => void;
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

function formatRelativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return "Just now";
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;
	return formatDateTime(dateString);
}

export function VoicemailDetailView({
	communication,
	isRead = false,
	transcriptionConfidence,
	isUrgent = false,
	onMarkAsRead,
	onSendText,
	onCallBack,
	onTransfer,
	onDelete,
}: VoicemailDetailViewProps) {
	const [localIsRead, setLocalIsRead] = useState(isRead);

	const phoneNumber = communication.fromAddress;
	const contactName =
		communication.fromName ||
		(communication.customer?.firstName
			? `${communication.customer.firstName} ${communication.customer.lastName || ""}`.trim()
			: null);

	const handleToggleRead = () => {
		const newReadState = !localIsRead;
		setLocalIsRead(newReadState);
		onMarkAsRead?.(communication.id, newReadState);
	};

	return (
		<ScrollArea className="h-full">
			<div className="p-6 space-y-6">
				{/* Header */}
				<div className="flex items-start justify-between">
					<div className="flex items-start gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
							<Voicemail className="h-6 w-6 text-orange-500" />
						</div>

						<div>
							<div className="flex items-center gap-2">
								<h2 className="text-lg font-semibold">Voicemail</h2>
								{isUrgent && (
									<Badge variant="destructive" className="gap-1">
										<AlertCircle className="h-3 w-3" />
										Urgent
									</Badge>
								)}
							</div>
							<div className="flex items-center gap-2 mt-1 text-muted-foreground">
								<Clock className="h-4 w-4" />
								<span className="text-sm">
									{formatRelativeTime(communication.createdAt)}
								</span>
							</div>
						</div>
					</div>

					<Button
						variant="ghost"
						size="sm"
						onClick={handleToggleRead}
						className="gap-2"
					>
						{localIsRead ? (
							<>
								<MailOpen className="h-4 w-4" />
								Mark Unread
							</>
						) : (
							<>
								<Mail className="h-4 w-4" />
								Mark Read
							</>
						)}
					</Button>
				</div>

				<Separator />

				{/* Contact Info */}
				<div className="space-y-4">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						From
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
								<div className="font-medium">{phoneNumber || "Unknown Caller"}</div>
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

				{/* Audio Player - Prominent */}
				<div className="space-y-4">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Message ({formatDuration(communication.callDuration)})
					</h3>

					{communication.callRecordingUrl ? (
						<MediaPlayer
							src={communication.callRecordingUrl}
							type="audio"
							title="Voicemail Message"
						/>
					) : (
						<div className="rounded-lg border border-dashed bg-muted/50 p-6 text-center">
							<Voicemail className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
							<p className="text-sm text-muted-foreground">
								No audio available
							</p>
						</div>
					)}
				</div>

				{/* Transcription */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
							Transcription
						</h3>
						{transcriptionConfidence !== undefined && (
							<div className="flex items-center gap-2">
								<span className="text-xs text-muted-foreground">
									Confidence: {Math.round(transcriptionConfidence * 100)}%
								</span>
								<Progress
									value={transcriptionConfidence * 100}
									className="w-16 h-1.5"
								/>
							</div>
						)}
					</div>

					{communication.callTranscript ? (
						<div className="rounded-lg border bg-card p-4">
							<p className="text-sm whitespace-pre-wrap leading-relaxed">
								{communication.callTranscript}
							</p>
						</div>
					) : (
						<div className="rounded-lg border border-dashed bg-muted/50 p-4 text-center">
							<p className="text-sm text-muted-foreground">
								Transcription not available
							</p>
							{communication.callRecordingUrl && (
								<p className="text-xs text-muted-foreground mt-1">
									Transcription may still be processing...
								</p>
							)}
						</div>
					)}
				</div>

				{/* Call Details */}
				<div className="space-y-4">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Details
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
								<div className="text-sm text-muted-foreground">Received</div>
								<div className="font-medium">
									{formatDateTime(communication.createdAt)}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="space-y-4">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Actions
					</h3>

					<div className="flex flex-wrap gap-2">
						{phoneNumber && (
							<>
								<Button
									variant="default"
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

				{/* Status indicator */}
				<div className="pt-2">
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						{localIsRead ? (
							<>
								<Check className="h-3 w-3 text-green-500" />
								Marked as read
							</>
						) : (
							<>
								<div className="h-2 w-2 rounded-full bg-blue-500" />
								Unread
							</>
						)}
					</div>
				</div>
			</div>
		</ScrollArea>
	);
}

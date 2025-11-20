"use client";

/**
 * Message Bubble - Individual message display
 *
 * Features:
 * - Inbound/outbound styling
 * - Attachment previews
 * - Timestamp
 * - Status indicators
 * - Clean, minimal design
 */

import { format } from "date-fns";
import {
	AlertCircle,
	Check,
	CheckCheck,
	Clock,
	Download,
	Paperclip,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/supabase";

type SmsMessage = Database["public"]["Tables"]["communications"]["Row"];

interface MessageBubbleProps {
	message: SmsMessage;
	isGroupedWithPrevious?: boolean;
	isGroupedWithNext?: boolean;
	senderName?: string | null;
	senderAvatar?: string | null;
}

export function MessageBubble({
	message,
	isGroupedWithPrevious = false,
	isGroupedWithNext = false,
	senderName,
	senderAvatar,
}: MessageBubbleProps) {
	const isOutbound = message.direction === "outbound";
	const hasAttachments =
		message.attachment_count && message.attachment_count > 0;

	// Parse attachments if they exist
	const attachments = message.attachments as any[] | null;

	// Get sender initials
	const getInitials = (name: string | null) => {
		if (!name || !name.trim()) return "?";
		const parts = name
			.split(" ")
			.filter((n) => n.length > 0)
			.map((n) => n[0])
			.join("")
			.toUpperCase();
		return parts.slice(0, 2) || "?";
	};

	// Status icon for outbound messages
	const StatusIcon = () => {
		if (!isOutbound) return null;

		switch (message.status) {
			case "sent":
				return <Check className="h-3 w-3" />;
			case "delivered":
				return <CheckCheck className="h-3 w-3" />;
			case "failed":
				return <AlertCircle className="text-destructive h-3 w-3" />;
			case "queued":
				return <Clock className="h-3 w-3" />;
			default:
				return null;
		}
	};

	return (
		<div
			className={cn(
				"flex gap-3 px-4 py-1.5",
				isOutbound ? "flex-row-reverse" : "flex-row",
				!isGroupedWithPrevious && "mt-3",
				!isGroupedWithNext && "mb-3",
			)}
		>
			{/* Avatar */}
			<div className="flex-shrink-0">
				{!isGroupedWithNext ? (
					<Avatar className="h-8 w-8">
						<AvatarImage
							src={isOutbound ? undefined : senderAvatar || undefined}
						/>
						<AvatarFallback
							className={cn(
								"text-xs font-medium",
								isOutbound ? "bg-primary text-primary-foreground" : "bg-muted",
							)}
						>
							{isOutbound ? "You" : getInitials(senderName)}
						</AvatarFallback>
					</Avatar>
				) : (
					<div className="h-8 w-8" /> // Spacer for grouped messages
				)}
			</div>

			{/* Message content */}
			<div
				className={cn(
					"flex max-w-[70%] flex-col gap-1",
					isOutbound && "items-end",
				)}
			>
				{/* Sender name (for inbound, if not grouped) */}
				{!isOutbound && !isGroupedWithPrevious && senderName && (
					<span className="text-muted-foreground px-3 text-xs font-medium">
						{senderName}
					</span>
				)}

				{/* Message bubble */}
				<div
					className={cn(
						"rounded-2xl px-4 py-2 break-words",
						isOutbound
							? "bg-primary text-primary-foreground"
							: "bg-muted text-foreground",
						!isGroupedWithPrevious &&
							(isOutbound ? "rounded-tr-sm" : "rounded-tl-sm"),
						!isGroupedWithNext &&
							(isOutbound ? "rounded-br-sm" : "rounded-bl-sm"),
					)}
				>
					{/* Message text */}
					<p className="text-sm whitespace-pre-wrap">{message.body}</p>

					{/* Attachments */}
					{!!(hasAttachments && attachments && attachments.length > 0) && (
						<div className="mt-2 space-y-2">
							{attachments.map((attachment: any, index: number) => {
								const isImage = attachment.content_type?.startsWith("image/");

								if (isImage) {
									return (
										<div key={index} className="overflow-hidden rounded-lg">
											<img
												src={attachment.url}
												alt={attachment.file_name || "Attachment"}
												className="h-auto max-w-full rounded-lg"
											/>
										</div>
									);
								}

								// Non-image attachments
								return (
									<div
										key={index}
										className={cn(
											"flex items-center gap-2 rounded-lg border p-2",
											isOutbound
												? "bg-primary-foreground/10 border-primary-foreground/20"
												: "bg-background border-border",
										)}
									>
										<Paperclip className="h-4 w-4 flex-shrink-0" />
										<div className="min-w-0 flex-1">
											<p className="truncate text-xs font-medium">
												{attachment.file_name || "File"}
											</p>
											{attachment.size && (
												<p className="text-xxs opacity-70">
													{(attachment.size / 1024).toFixed(1)} KB
												</p>
											)}
										</div>
										<Button
											size="sm"
											variant="ghost"
											className="h-6 w-6 p-0"
											asChild
										>
											<a
												href={attachment.url}
												download={attachment.file_name}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Download className="h-3 w-3" />
											</a>
										</Button>
									</div>
								);
							})}
						</div>
					)}
				</div>

				{/* Metadata row */}
				<div
					className={cn(
						"flex items-center gap-1.5 px-3",
						isOutbound && "flex-row-reverse",
					)}
				>
					{/* Timestamp */}
					<span className="text-muted-foreground text-xs">
						{(() => {
							try {
								const date = new Date(message.created_at);
								if (isNaN(date.getTime())) {
									return "Invalid date";
								}
								return format(date, "h:mm a");
							} catch {
								return "Invalid date";
							}
						})()}
					</span>

					{/* Status indicator */}
					<StatusIcon />

					{/* Read indicator */}
					{!isOutbound && message.read_at && (
						<span className="text-muted-foreground text-xs">• Read</span>
					)}
				</div>
			</div>
		</div>
	);
}

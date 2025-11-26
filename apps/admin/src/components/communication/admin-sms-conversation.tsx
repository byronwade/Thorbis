"use client";

/**
 * Admin SMS Conversation View Component
 *
 * iPhone-style chat bubble display for SMS conversations
 * Features:
 * - Chat bubbles (outbound = right/primary, inbound = left/muted)
 * - Message timestamps grouped by day
 * - Delivery status indicators
 * - Auto-scroll to latest message
 * - Typing indicator support
 */

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { Check, CheckCheck, Clock, AlertCircle, Building2, User } from "lucide-react";
import { useEffect, useRef } from "react";

type MessageDirection = "inbound" | "outbound";
type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export type SmsMessage = {
	id: string;
	direction: MessageDirection;
	content: string;
	timestamp: string;
	status?: MessageStatus;
	senderName?: string;
	senderAvatar?: string;
};

export type SmsConversation = {
	id: string;
	contactName: string;
	contactPhone: string;
	companyName?: string;
	companyId?: string;
	messages: SmsMessage[];
	isTyping?: boolean;
};

type AdminSmsConversationProps = {
	conversation: SmsConversation;
	className?: string;
};

function formatMessageTime(timestamp: string): string {
	const date = new Date(timestamp);
	return format(date, "h:mm a");
}

function formatDateDivider(timestamp: string): string {
	const date = new Date(timestamp);
	if (isToday(date)) return "Today";
	if (isYesterday(date)) return "Yesterday";
	return format(date, "EEEE, MMMM d");
}

function getStatusIcon(status?: MessageStatus) {
	switch (status) {
		case "sending":
			return <Clock className="size-3 text-muted-foreground" />;
		case "sent":
			return <Check className="size-3 text-muted-foreground" />;
		case "delivered":
			return <CheckCheck className="size-3 text-muted-foreground" />;
		case "read":
			return <CheckCheck className="size-3 text-primary" />;
		case "failed":
			return <AlertCircle className="size-3 text-destructive" />;
		default:
			return null;
	}
}

function MessageBubble({ message, isFirst, isLast, showAvatar }: { message: SmsMessage; isFirst: boolean; isLast: boolean; showAvatar: boolean }) {
	const isOutbound = message.direction === "outbound";

	return (
		<div className={cn("flex gap-2", isOutbound ? "flex-row-reverse" : "flex-row", !isFirst && "mt-0.5")}>
			{/* Avatar placeholder for alignment */}
			{!isOutbound && (
				<div className="w-7 shrink-0">
					{showAvatar && (
						<Avatar className="size-7">
							<AvatarFallback className="bg-muted text-[10px]">{message.senderName?.charAt(0) || "?"}</AvatarFallback>
						</Avatar>
					)}
				</div>
			)}

			{/* Message bubble */}
			<div
				className={cn(
					"max-w-[75%] px-3 py-2 text-sm",
					isOutbound ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
					// Rounded corners based on position in group
					isFirst && isLast && "rounded-2xl",
					isFirst && !isLast && (isOutbound ? "rounded-2xl rounded-br-md" : "rounded-2xl rounded-bl-md"),
					!isFirst && !isLast && (isOutbound ? "rounded-2xl rounded-r-md" : "rounded-2xl rounded-l-md"),
					!isFirst && isLast && (isOutbound ? "rounded-2xl rounded-tr-md" : "rounded-2xl rounded-tl-md")
				)}
			>
				<p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
			</div>

			{/* Outbound spacer for alignment */}
			{isOutbound && <div className="w-7 shrink-0" />}
		</div>
	);
}

function MessageGroup({ messages, showDateDivider, dateLabel }: { messages: SmsMessage[]; showDateDivider: boolean; dateLabel: string }) {
	const isOutbound = messages[0]?.direction === "outbound";
	const lastMessage = messages[messages.length - 1];

	return (
		<div className="space-y-0.5">
			{showDateDivider && (
				<div className="flex justify-center py-3">
					<span className="rounded-full bg-muted px-3 py-1 text-[10px] font-medium text-muted-foreground">{dateLabel}</span>
				</div>
			)}

			{messages.map((message, idx) => (
				<MessageBubble key={message.id} message={message} isFirst={idx === 0} isLast={idx === messages.length - 1} showAvatar={!isOutbound && idx === messages.length - 1} />
			))}

			{/* Timestamp and status for last message in group */}
			<div className={cn("flex items-center gap-1 px-9 pt-1", isOutbound ? "justify-end" : "justify-start")}>
				<span className="text-[10px] text-muted-foreground">{formatMessageTime(lastMessage?.timestamp || "")}</span>
				{isOutbound && getStatusIcon(lastMessage?.status)}
			</div>
		</div>
	);
}

function TypingIndicator() {
	return (
		<div className="flex gap-2">
			<div className="w-7 shrink-0">
				<Avatar className="size-7">
					<AvatarFallback className="bg-muted text-[10px]">...</AvatarFallback>
				</Avatar>
			</div>
			<div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
				<div className="flex gap-1">
					<span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
					<span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
					<span className="size-2 animate-bounce rounded-full bg-muted-foreground/50" />
				</div>
			</div>
		</div>
	);
}

export function AdminSmsConversation({ conversation, className }: AdminSmsConversationProps) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom when messages change
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [conversation.messages.length, conversation.isTyping]);

	// Group messages by sender and time proximity (within 2 minutes)
	const groupedMessages: { messages: SmsMessage[]; showDateDivider: boolean; dateLabel: string }[] = [];
	let currentGroup: SmsMessage[] = [];
	let lastDate: Date | null = null;

	conversation.messages.forEach((message, idx) => {
		const messageDate = new Date(message.timestamp);
		const prevMessage = conversation.messages[idx - 1];
		const showDateDivider = !lastDate || !isSameDay(messageDate, lastDate);

		// Start new group if:
		// - Different direction
		// - More than 2 minutes gap
		// - Different day
		const shouldStartNewGroup =
			!prevMessage ||
			prevMessage.direction !== message.direction ||
			messageDate.getTime() - new Date(prevMessage.timestamp).getTime() > 2 * 60 * 1000 ||
			showDateDivider;

		if (shouldStartNewGroup && currentGroup.length > 0) {
			groupedMessages.push({
				messages: currentGroup,
				showDateDivider: !lastDate || !isSameDay(new Date(currentGroup[0]?.timestamp || ""), lastDate),
				dateLabel: formatDateDivider(currentGroup[0]?.timestamp || ""),
			});
			lastDate = new Date(currentGroup[0]?.timestamp || "");
			currentGroup = [];
		}

		currentGroup.push(message);
	});

	// Push last group
	if (currentGroup.length > 0) {
		groupedMessages.push({
			messages: currentGroup,
			showDateDivider: !lastDate || !isSameDay(new Date(currentGroup[0]?.timestamp || ""), lastDate),
			dateLabel: formatDateDivider(currentGroup[0]?.timestamp || ""),
		});
	}

	return (
		<div className={cn("flex h-full flex-col", className)}>
			{/* Conversation Header */}
			<div className="flex items-center gap-3 border-b border-border/50 bg-card px-4 py-3">
				<Avatar className="size-10">
					<AvatarFallback className="bg-primary/10 text-primary">
						{conversation.contactName
							.split(" ")
							.map((n) => n[0])
							.join("")
							.substring(0, 2)}
					</AvatarFallback>
				</Avatar>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<h3 className="truncate font-semibold">{conversation.contactName}</h3>
						{conversation.companyName && (
							<Badge variant="outline" className="shrink-0 gap-1 text-[10px]">
								<Building2 className="size-2.5" />
								{conversation.companyName}
							</Badge>
						)}
					</div>
					<p className="truncate text-xs text-muted-foreground">{conversation.contactPhone}</p>
				</div>
			</div>

			{/* Messages Area */}
			<ScrollArea ref={scrollRef} className="flex-1">
				<div className="space-y-4 p-4">
					{groupedMessages.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<div className="mb-3 rounded-full bg-muted p-4">
								<User className="size-8 text-muted-foreground" />
							</div>
							<h4 className="font-medium">No messages yet</h4>
							<p className="mt-1 text-sm text-muted-foreground">Start the conversation by sending a message below</p>
						</div>
					) : (
						groupedMessages.map((group, idx) => <MessageGroup key={`group-${idx}`} messages={group.messages} showDateDivider={group.showDateDivider} dateLabel={group.dateLabel} />)
					)}

					{/* Typing indicator */}
					{conversation.isTyping && (
						<div className="pt-2">
							<TypingIndicator />
						</div>
					)}

					{/* Scroll anchor */}
					<div ref={bottomRef} />
				</div>
			</ScrollArea>
		</div>
	);
}

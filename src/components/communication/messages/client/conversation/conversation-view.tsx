"use client";

/**
 * Conversation View - Main chat area
 *
 * Features:
 * - Virtualized message list
 * - Auto-scroll to bottom
 * - Grouped messages
 * - Typing indicators
 * - Empty states
 */

import { useVirtualizer } from "@tanstack/react-virtual";
import { format, isSameDay, isToday, isYesterday } from "date-fns";
import { MessageCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMessagesStore } from "@/lib/stores/messages-store";
import { useTeamPresenceStore } from "@/lib/stores/team-presence-store";
import { MessageBubble } from "./message-bubble";

interface ConversationViewProps {
	threadId: string;
}

export function ConversationView({ threadId }: ConversationViewProps) {
	const parentRef = useRef<HTMLDivElement>(null);

	// Get thread and messages from store
	const threads = useMessagesStore((state) => state.threads);
	const isLoading = useMessagesStore((state) => state.isLoadingConversation);
	const thread = threads.find((t) => t.threadId === threadId) || null;

	// Get typing indicators
	const typingUsers = useTeamPresenceStore((state) => state.typingUsers);
	const currentUserId = useTeamPresenceStore((state) => state.currentUserId);

	// Filter typing users for this thread
	const threadTypingUsers = Array.from(typingUsers.values()).filter(
		(indicator) =>
			indicator.threadId === threadId && indicator.userId !== currentUserId,
	);

	const messages = thread?.messages || [];

	// Virtual scrolling setup
	const rowVirtualizer = useVirtualizer({
		count: messages.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 80,
		overscan: 5,
	});

	// Auto-scroll to bottom on new messages
	useEffect(() => {
		if (messages.length > 0 && parentRef.current) {
			// Scroll to bottom
			rowVirtualizer.scrollToIndex(messages.length - 1, {
				align: "end",
			});
		}
	}, [messages.length, rowVirtualizer]);

	// Check if we should show a date separator
	const shouldShowDateSeparator = (currentIndex: number) => {
		if (currentIndex === 0) return true; // Always show for first message

		const current = messages[currentIndex];
		const previous = messages[currentIndex - 1];

		if (!current || !previous) return false;

		try {
			const currentDate = new Date(current.created_at);
			const previousDate = new Date(previous.created_at);

			if (isNaN(currentDate.getTime()) || isNaN(previousDate.getTime())) {
				return false;
			}

			// Show separator if messages are from different days
			return !isSameDay(currentDate, previousDate);
		} catch {
			return false;
		}
	};

	// Format date for separator
	const formatDateSeparator = (date: string | Date) => {
		try {
			const d = new Date(date);
			if (isNaN(d.getTime())) return "";

			if (isToday(d)) return "Today";
			if (isYesterday(d)) return "Yesterday";
			return format(d, "EEEE, MMMM d, yyyy");
		} catch {
			return "";
		}
	};

	// Check if messages should be grouped
	const shouldGroupWithPrevious = (currentIndex: number) => {
		if (currentIndex === 0) return false;

		const current = messages[currentIndex];
		const previous = messages[currentIndex - 1];

		if (!current || !previous) return false;

		// Group if same direction and within 5 minutes
		const isSameDirection = current.direction === previous.direction;

		// Safely calculate time difference with error handling
		let timeDiff = 0;
		try {
			const currentTime = new Date(current.created_at).getTime();
			const previousTime = new Date(previous.created_at).getTime();
			if (!isNaN(currentTime) && !isNaN(previousTime)) {
				timeDiff = currentTime - previousTime;
			}
		} catch {
			// If date parsing fails, don't group messages
			return false;
		}

		const withinTimeWindow = timeDiff < 5 * 60 * 1000; // 5 minutes

		return isSameDirection && withinTimeWindow;
	};

	const shouldGroupWithNext = (currentIndex: number) => {
		if (currentIndex === messages.length - 1) return false;

		const current = messages[currentIndex];
		const next = messages[currentIndex + 1];

		if (!current || !next) return false;

		const isSameDirection = current.direction === next.direction;

		// Safely calculate time difference with error handling
		let timeDiff = 0;
		try {
			const currentTime = new Date(current.created_at).getTime();
			const nextTime = new Date(next.created_at).getTime();
			if (!isNaN(currentTime) && !isNaN(nextTime)) {
				timeDiff = nextTime - currentTime;
			}
		} catch {
			// If date parsing fails, don't group messages
			return false;
		}

		const withinTimeWindow = timeDiff < 5 * 60 * 1000;

		return isSameDirection && withinTimeWindow;
	};

	// Empty state - no thread selected
	if (!thread) {
		return (
			<div className="bg-muted/30 flex h-full flex-col items-center justify-center p-8 text-center">
				<MessageCircle className="text-muted-foreground/50 mb-4 h-16 w-16" />
				<h3 className="mb-2 text-xl font-semibold">No conversation selected</h3>
				<p className="text-muted-foreground max-w-sm text-sm">
					Select a conversation from the list to start messaging
				</p>
			</div>
		);
	}

	// Loading state
	if (isLoading) {
		return (
			<div className="flex h-full flex-col gap-4 p-4">
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className={`flex animate-pulse gap-3 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
					>
						<div className="bg-muted h-8 w-8 rounded-full" />
						<div className="space-y-2">
							<div
								className={`bg-muted h-16 rounded-2xl ${i % 2 === 0 ? "w-64" : "w-48"}`}
							/>
						</div>
					</div>
				))}
			</div>
		);
	}

	// Empty conversation
	if (messages.length === 0) {
		return (
			<div className="flex h-full flex-col items-center justify-center p-8 text-center">
				<MessageCircle className="text-muted-foreground/50 mb-4 h-12 w-12" />
				<h3 className="mb-1 text-lg font-semibold">No messages yet</h3>
				<p className="text-muted-foreground text-sm">
					Start the conversation by sending a message below
				</p>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col">
			{/* Messages area */}
			<div
				ref={parentRef}
				className="flex-1 overflow-auto"
				style={{ contain: "strict" }}
			>
				<div
					style={{
						height: `${rowVirtualizer.getTotalSize()}px`,
						width: "100%",
						position: "relative",
					}}
				>
					{rowVirtualizer.getVirtualItems().map((virtualItem) => {
						const message = messages[virtualItem.index];
						const isGroupedWithPrevious = shouldGroupWithPrevious(
							virtualItem.index,
						);
						const isGroupedWithNext = shouldGroupWithNext(virtualItem.index);
						const showDateSeparator = shouldShowDateSeparator(
							virtualItem.index,
						);
						const dateSeparatorText = showDateSeparator
							? formatDateSeparator(message.created_at)
							: "";

						return (
							<div
								key={virtualItem.key}
								data-index={virtualItem.index}
								ref={rowVirtualizer.measureElement}
								className="absolute top-0 left-0 w-full"
								style={{
									transform: `translateY(${virtualItem.start}px)`,
								}}
							>
								{showDateSeparator && dateSeparatorText && (
									<div className="flex items-center justify-center px-4 py-4">
										<div className="flex w-full max-w-md items-center gap-3">
											<div className="bg-border h-px flex-1" />
											<span className="text-muted-foreground bg-muted rounded-full px-3 py-1 text-xs font-medium">
												{dateSeparatorText}
											</span>
											<div className="bg-border h-px flex-1" />
										</div>
									</div>
								)}
								<MessageBubble
									message={message}
									isGroupedWithPrevious={isGroupedWithPrevious}
									isGroupedWithNext={isGroupedWithNext}
									senderName={thread.remoteName}
									senderAvatar={null}
								/>
							</div>
						);
					})}
				</div>

				{/* Typing indicator */}
				{threadTypingUsers.length > 0 && (
					<div className="flex items-center gap-2 px-4 py-3">
						<Avatar className="h-6 w-6">
							<AvatarFallback className="bg-muted text-[10px]">
								{threadTypingUsers[0].userName.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="bg-muted rounded-2xl px-4 py-2">
							<div className="flex gap-1">
								<div className="bg-muted-foreground/50 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]" />
								<div className="bg-muted-foreground/50 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]" />
								<div className="bg-muted-foreground/50 h-2 w-2 animate-bounce rounded-full" />
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

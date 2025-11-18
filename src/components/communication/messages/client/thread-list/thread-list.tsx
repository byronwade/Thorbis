"use client";

/**
 * Thread List - Virtualized list of message threads
 *
 * Features:
 * - Virtual scrolling for 1000+ threads
 * - Smooth animations
 * - Keyboard navigation
 * - Empty states
 */

import { useVirtualizer } from "@tanstack/react-virtual";
import { MessageCircle } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessagesStore } from "@/lib/stores/messages-store";
import { cn } from "@/lib/utils";
import { ThreadItem } from "./thread-item";

interface ThreadListProps {
	currentUserId?: string | null;
	onThreadSelect: (threadId: string) => void;
}

export function ThreadList({ currentUserId, onThreadSelect }: ThreadListProps) {
	const parentRef = useRef<HTMLDivElement>(null);

	// Get data from store (use stable selectors)
	const rawThreads = useMessagesStore((state) => state.threads);
	const filters = useMessagesStore((state) => state.filters);
	const selectedThreadId = useMessagesStore((state) => state.selectedThreadId);
	const isLoadingThreads = useMessagesStore((state) => state.isLoadingThreads);

	// Memoize filtered threads
	const threads = useMemo(() => {
		return rawThreads.filter((thread) => {
			// Status filter
			if (filters.status !== "all") {
				if (filters.status === "unassigned") {
					if (thread.assignedTo !== null) return false;
				} else if (thread.status !== filters.status) {
					return false;
				}
			}

			// Assigned to filter
			if (filters.assignedTo !== "all") {
				if (filters.assignedTo === "unassigned") {
					if (thread.assignedTo !== null) return false;
				} else if (filters.assignedTo === "me") {
					if (thread.assignedTo === null) return false;
				} else if (thread.assignedTo !== filters.assignedTo) {
					return false;
				}
			}

			// Priority filter
			if (filters.priority !== "all" && thread.priority !== filters.priority) {
				return false;
			}

			// Search filter
			if (filters.search) {
				const searchLower = filters.search.toLowerCase();
				const matchesName = thread.remoteName
					?.toLowerCase()
					.includes(searchLower);
				const matchesPhone = thread.remotePhoneNumber.includes(filters.search);
				const matchesMessage = thread.lastMessage
					.toLowerCase()
					.includes(searchLower);

				if (!matchesName && !matchesPhone && !matchesMessage) {
					return false;
				}
			}

			// Has attachments filter
			if (filters.hasAttachments !== null) {
				const hasAttachments = thread.messages.some(
					(msg) => msg.attachment_count && msg.attachment_count > 0,
				);
				if (filters.hasAttachments !== hasAttachments) {
					return false;
				}
			}

			return true;
		});
	}, [rawThreads, filters]);

	// Virtual scrolling setup
	const rowVirtualizer = useVirtualizer({
		count: threads.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 85, // Approximate height of each thread item
		overscan: 10, // Render 10 items above and below viewport
	});

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!selectedThreadId) return;

			const currentIndex = threads.findIndex(
				(t) => t.threadId === selectedThreadId,
			);
			if (currentIndex === -1) return;

			if (e.key === "ArrowDown" && currentIndex < threads.length - 1) {
				e.preventDefault();
				const nextThread = threads[currentIndex + 1];
				onThreadSelect(nextThread.threadId);

				// Scroll to item
				rowVirtualizer.scrollToIndex(currentIndex + 1, {
					align: "center",
				});
			} else if (e.key === "ArrowUp" && currentIndex > 0) {
				e.preventDefault();
				const prevThread = threads[currentIndex - 1];
				onThreadSelect(prevThread.threadId);

				// Scroll to item
				rowVirtualizer.scrollToIndex(currentIndex - 1, {
					align: "center",
				});
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectedThreadId, threads, onThreadSelect, rowVirtualizer]);

	// Empty state
	if (!isLoadingThreads && threads.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full p-8 text-center">
				<MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
				<h3 className="font-semibold text-lg mb-1">No conversations</h3>
				<p className="text-sm text-muted-foreground">
					Start a new message or adjust your filters
				</p>
			</div>
		);
	}

	// Loading state
	if (isLoadingThreads) {
		return (
			<div className="flex flex-col h-full">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={i} className="px-3 py-3 border-b animate-pulse">
						<div className="flex items-start gap-3">
							<div className="h-10 w-10 rounded-full bg-muted" />
							<div className="flex-1 space-y-2">
								<div className="h-4 bg-muted rounded w-3/4" />
								<div className="h-3 bg-muted rounded w-1/2" />
								<div className="h-3 bg-muted rounded w-full" />
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div
			ref={parentRef}
			className="h-full overflow-auto"
			style={{ contain: "strict" }}
			role="listbox"
			aria-label="Message threads"
		>
			<div
				style={{
					height: `${rowVirtualizer.getTotalSize()}px`,
					width: "100%",
					position: "relative",
				}}
			>
				{rowVirtualizer.getVirtualItems().map((virtualItem) => {
					const thread = threads[virtualItem.index];
					const isSelected = thread.threadId === selectedThreadId;

					return (
						<div
							key={virtualItem.key}
							data-index={virtualItem.index}
							ref={rowVirtualizer.measureElement}
							className={cn(
								"absolute top-0 left-0 w-full border-b",
								isSelected && "border-l-2 border-l-primary",
							)}
							style={{
								transform: `translateY(${virtualItem.start}px)`,
							}}
						>
							<ThreadItem
								thread={thread}
								isSelected={isSelected}
								onClick={() => onThreadSelect(thread.threadId)}
								currentUserId={currentUserId}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}

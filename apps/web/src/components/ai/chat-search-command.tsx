"use client";

import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	type Chat,
	chatSelectors,
	type Message,
	useChatStore,
} from "@/lib/stores/chat-store";

type ChatSearchCommandProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

type SearchResult = {
	chat: Chat;
	matchedSnippet: string | null;
	score: number;
};

/**
 * Compact search through chat history
 */
function searchChats(chats: Chat[], query: string): SearchResult[] {
	if (!query.trim()) {
		return chats
			.map((chat) => ({
				chat,
				matchedSnippet: null,
				score:
					chat.messages.length > 0
						? new Date(
								chat.messages[chat.messages.length - 1].timestamp,
							).getTime()
						: new Date(chat.createdAt).getTime(),
			}))
			.sort((a, b) => b.score - a.score);
	}

	const normalizedQuery = query.toLowerCase().trim();
	const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
	const results: SearchResult[] = [];

	for (const chat of chats) {
		let score = 0;
		let matchedSnippet: string | null = null;

		// Title match (highest weight)
		const titleLower = chat.title.toLowerCase();
		if (queryWords.every((word) => titleLower.includes(word))) {
			score += titleLower === normalizedQuery ? 150 : 100;
		}

		// Message content match
		for (const message of chat.messages) {
			const contentLower = message.content.toLowerCase();
			if (queryWords.every((word) => contentLower.includes(word))) {
				score += message.role === "user" ? 20 : 10;
				if (!matchedSnippet) {
					const idx = contentLower.indexOf(queryWords[0]);
					const start = Math.max(0, idx - 20);
					const end = Math.min(message.content.length, idx + 60);
					matchedSnippet =
						(start > 0 ? "..." : "") +
						message.content.slice(start, end) +
						(end < message.content.length ? "..." : "");
				}
			}
		}

		if (score > 0) {
			const lastActivity =
				chat.messages.length > 0
					? new Date(
							chat.messages[chat.messages.length - 1].timestamp,
						).getTime()
					: new Date(chat.createdAt).getTime();
			results.push({
				chat,
				matchedSnippet,
				score:
					score +
					Math.min(20, (lastActivity - Date.now() + 604800000) / 86400000),
			});
		}
	}

	return results.sort((a, b) => b.score - a.score);
}

export function ChatSearchCommand({
	open,
	onOpenChange,
}: ChatSearchCommandProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const chats = useChatStore(chatSelectors.chats);
	const { setActiveChat } = useChatStore();

	useEffect(() => {
		if (open) setSearchQuery("");
	}, [open]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				onOpenChange(!open);
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open, onOpenChange]);

	const searchResults = useMemo(
		() => searchChats(chats, searchQuery),
		[chats, searchQuery],
	);

	const handleSelectChat = useCallback(
		(chatId: string) => {
			setActiveChat(chatId);
			onOpenChange(false);
		},
		[setActiveChat, onOpenChange],
	);

	const getTimeAgo = (chat: Chat) => {
		const date =
			chat.messages.length > 0
				? new Date(chat.messages[chat.messages.length - 1].timestamp)
				: new Date(chat.createdAt);
		return formatDistanceToNow(date, { addSuffix: false });
	};

	return (
		<CommandDialog open={open} onOpenChange={onOpenChange}>
			<CommandInput
				placeholder="Search chats..."
				value={searchQuery}
				onValueChange={setSearchQuery}
				className="h-9 text-sm"
			/>
			<CommandList className="max-h-[320px]">
				<CommandEmpty>
					<div className="flex flex-col items-center py-6">
						<Search className="size-5 text-muted-foreground/40 mb-2" />
						<p className="text-xs text-muted-foreground">No chats found</p>
					</div>
				</CommandEmpty>

				{searchResults.length > 0 && (
					<CommandGroup>
						{searchResults.slice(0, 15).map((result) => (
							<CommandItem
								key={result.chat.id}
								value={result.chat.id}
								onSelect={() => handleSelectChat(result.chat.id)}
								className="py-2 px-2 cursor-pointer"
							>
								<MessageSquare className="size-3.5 text-muted-foreground/60 mr-2 shrink-0" />
								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between gap-2">
										<span className="text-sm truncate">
											{result.chat.title}
										</span>
										<span className="text-[10px] text-muted-foreground/60 shrink-0">
											{getTimeAgo(result.chat)}
										</span>
									</div>
									{result.matchedSnippet && searchQuery && (
										<p className="text-[11px] text-muted-foreground/70 truncate mt-0.5">
											{result.matchedSnippet}
										</p>
									)}
								</div>
							</CommandItem>
						))}
					</CommandGroup>
				)}
			</CommandList>

			<div className="border-t border-border/40 px-2 py-1.5 flex items-center justify-between">
				<div className="flex items-center gap-3 text-[10px] text-muted-foreground/60">
					<span>
						<kbd className="bg-muted/60 px-1 py-0.5 rounded font-mono">↵</kbd>{" "}
						select
					</span>
					<span>
						<kbd className="bg-muted/60 px-1 py-0.5 rounded font-mono">↑↓</kbd>{" "}
						navigate
					</span>
				</div>
				<span className="text-[10px] text-muted-foreground/60">
					<kbd className="bg-muted/60 px-1 py-0.5 rounded font-mono">esc</kbd>{" "}
					close
				</span>
			</div>
		</CommandDialog>
	);
}

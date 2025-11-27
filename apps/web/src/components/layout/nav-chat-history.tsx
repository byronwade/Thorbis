"use client";

import type { ChatSession } from "@ai-sdk-tools/memory";
import { PenLine, Search, Trash2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { getChats, deleteChat as deleteChatAction } from "@/actions/chats";
import { ChatSearchCommand } from "@/components/ai/chat-search-command";
import { Button } from "@/components/ui/button";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

// Lightweight client cache to avoid spamming server actions on every rerender/navigation
const CHAT_CACHE_TTL = 30_000;
let cachedChats: ChatSession[] | null = null;
let cachedChatsAt = 0;
let inflightChatRequest: Promise<ChatSession[]> | null = null;

async function loadChatCache(limit: number, force = false): Promise<ChatSession[]> {
	const now = Date.now();

	// Return cached data when still fresh
	if (!force && cachedChats && now - cachedChatsAt < CHAT_CACHE_TTL) {
		return cachedChats.slice(0, limit);
	}

	// Deduplicate concurrent requests between button + history
	if (inflightChatRequest) {
		return inflightChatRequest.then((data) => data.slice(0, limit));
	}

	inflightChatRequest = (async () => {
		try {
			const result = await getChats({ limit });
			if (result.success && result.data) {
				cachedChats = result.data;
				cachedChatsAt = Date.now();
				return result.data;
			}
		} catch (error) {
			console.error("[NavChatHistory] Failed to load chats", error);
		} finally {
			inflightChatRequest = null;
		}

		// On failure, return empty list and clear cache timestamp to retry later
		cachedChats = null;
		cachedChatsAt = 0;
		return [];
	})();

	return inflightChatRequest;
}

function updateChatCache(nextChats: ChatSession[]) {
	cachedChats = nextChats;
	cachedChatsAt = Date.now();
}

// New Chat button + Search bar - rendered above AI nav items
export function AiNewChatButton() {
	const router = useRouter();
	const [searchOpen, setSearchOpen] = useState(false);
	const [hasChats, setHasChats] = useState(false);

	// Check if there are any chats for showing search
	useEffect(() => {
		const checkChats = async () => {
			const chats = await loadChatCache(1);
			setHasChats(chats.length > 0);
		};
		checkChats();
	}, []);

	const handleNewChat = () => {
		// Navigate to the AI landing page to start a new chat
		router.push("/dashboard/ai");
	};

	return (
		<>
			<SidebarGroup className="pb-0">
				<div className="px-2 space-y-3">
					{/* New Chat button */}
					<Button
						className="w-full h-9 font-medium gap-2"
						variant="default"
						onClick={handleNewChat}
					>
						<PenLine className="size-4" />
						<span>New Chat</span>
					</Button>

					{/* Search bar - only shown when there are chats */}
					{hasChats && (
						<Button
							variant="outline"
							className="w-full h-8 gap-2 justify-start text-sm font-normal bg-muted/50 border-transparent hover:bg-muted hover:border-border"
							onClick={() => setSearchOpen(true)}
						>
							<Search className="size-4 text-muted-foreground" />
							<span className="text-muted-foreground">Search chats...</span>
							<kbd className="ml-auto hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
								⌘K
							</kbd>
						</Button>
					)}
				</div>
			</SidebarGroup>

			{/* Search command dialog */}
			<ChatSearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
		</>
	);
}

// Chat history list - rendered below AI Assistant nav
export function NavChatHistory() {
	const router = useRouter();
	const pathname = usePathname();
	const [chats, setChats] = useState<ChatSession[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isPending, startTransition] = useTransition();

	// Extract active chat ID from pathname
	const activeChatId = pathname?.match(/\/dashboard\/ai\/([^/]+)/)?.[1] ?? null;

	// Load chats from database on mount
	useEffect(() => {
		const loadChats = async () => {
			setIsLoading(true);
			const data = await loadChatCache(10);
			setChats(data);
			setIsLoading(false);
		};
		loadChats();
	}, []);

	// Refresh chats when navigating AWAY and BACK to AI pages (not on every pathname change)
	// This prevents the looping POST requests caused by router.replace and revalidatePath
	const [prevWasAiPage, setPrevWasAiPage] = useState(false);
	useEffect(() => {
		const isAiPage = pathname?.startsWith("/dashboard/ai") ?? false;
		// Only refresh when transitioning INTO an AI page (not on every pathname change within AI)
		if (isAiPage && !prevWasAiPage) {
			const refreshChats = async () => {
				const data = await loadChatCache(10, true);
				setChats(data);
			};
			refreshChats();
		}
		setPrevWasAiPage(isAiPage);
	}, [pathname, prevWasAiPage]);

	const handleSelectChat = useCallback((chatId: string) => {
		router.push(`/dashboard/ai/${chatId}`);
	}, [router]);

	const handleDeleteChat = useCallback(async (e: React.MouseEvent, chatId: string) => {
		e.preventDefault();
		e.stopPropagation();

		startTransition(async () => {
			const result = await deleteChatAction(chatId);
			if (result.success) {
				setChats((prev) => {
					const next = prev.filter((c) => c.chatId !== chatId);
					updateChatCache(next);
					return next;
				});
				toast.success("Chat deleted");
				// Navigate away if we deleted the active chat
				if (activeChatId === chatId) {
					router.push("/dashboard/ai");
				}
			} else {
				toast.error("Failed to delete chat");
			}
		});
	}, [activeChatId, router]);

	// Loading skeleton
	if (isLoading) {
		return (
			<SidebarGroup>
				<SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
				<div className="space-y-1 px-2">
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-8 w-full" />
				</div>
			</SidebarGroup>
		);
	}

	// Don't render anything if no chats
	if (chats.length === 0) {
		return null;
	}

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
			<SidebarMenu>
				{chats.map((chat) => {
					const isActive = activeChatId === chat.chatId;

					return (
						<SidebarMenuItem key={chat.chatId}>
							<SidebarMenuButton
								isActive={isActive}
								onClick={() => handleSelectChat(chat.chatId)}
								title={chat.title}
								disabled={isPending}
							>
								<span className="flex-1 truncate text-left">{chat.title}</span>
							</SidebarMenuButton>
							<SidebarMenuAction
								aria-label="Delete chat"
								onClick={(e) => handleDeleteChat(e, chat.chatId)}
								showOnHover
								title="Delete chat"
							>
								<Trash2 className="h-3.5 w-3.5" />
							</SidebarMenuAction>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}

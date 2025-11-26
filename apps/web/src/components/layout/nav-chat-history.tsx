"use client";

import { PenLine, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { chatSelectors, useChatStore } from "@/lib/stores/chat-store";

// New Chat button + Search bar - rendered above AI nav items
export function AiNewChatButton() {
	const router = useRouter();
	const chats = useChatStore(chatSelectors.chats);
	const { createChat, setActiveChat } = useChatStore();
	const [searchOpen, setSearchOpen] = useState(false);

	const handleNewChat = () => {
		// Create a new temporary chat and navigate to the AI landing page
		const newChatId = createChat("New Chat");
		if (newChatId) {
			setActiveChat(newChatId);
		}
		// Navigate to the AI landing page (Thorbis AI)
		router.push("/dashboard/ai");
	};

	const hasChats = chats.length > 0;

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
	const chats = useChatStore(chatSelectors.chats);
	const activeChatId = useChatStore(chatSelectors.activeChatId);
	const { setActiveChat, deleteChat } = useChatStore();

	const handleSelectChat = (chatId: string) => {
		setActiveChat(chatId);
	};

	const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
		e.preventDefault();
		e.stopPropagation();
		deleteChat(chatId);
	};

	// Don't render anything if no chats
	if (chats.length === 0) {
		return null;
	}

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
			<SidebarMenu>
				{chats.slice(0, 10).map((chat) => {
					const isActive = activeChatId === chat.id;

					return (
						<SidebarMenuItem key={chat.id}>
							<SidebarMenuButton
								isActive={isActive}
								onClick={() => handleSelectChat(chat.id)}
								title={chat.title}
							>
								<span className="flex-1 truncate text-left">{chat.title}</span>
							</SidebarMenuButton>
							<SidebarMenuAction
								aria-label="Delete chat"
								onClick={(e) => handleDeleteChat(e, chat.id)}
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

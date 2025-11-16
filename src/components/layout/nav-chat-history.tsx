"use client";

import { Trash2 } from "lucide-react";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { chatSelectors, useChatStore } from "@/lib/stores/chat-store";

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
							<SidebarMenuButton isActive={isActive} onClick={() => handleSelectChat(chat.id)} title={chat.title}>
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

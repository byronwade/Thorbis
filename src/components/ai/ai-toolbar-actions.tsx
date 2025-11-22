"use client";

import { useChatStore } from "@/lib/stores/chat-store";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AiToolbarActions() {
	const { createChat } = useChatStore();

	const handleNewChat = () => {
		createChat("New Chat");
	};

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={handleNewChat}
			type="button"
		>
			<Plus className="size-4" />
			<span className="hidden md:inline-block">New Chat</span>
		</Button>
	);
}



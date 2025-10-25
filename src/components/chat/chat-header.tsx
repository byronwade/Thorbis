"use client";

import { PlusIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { ModelSelector } from "./model-selector";

interface ChatHeaderProps {
	onNewChat?: () => void;
	onModelChange?: (modelId: string) => void;
	selectedModel?: string;
}

export function ChatHeader({ onNewChat, onModelChange, selectedModel }: ChatHeaderProps) {
	return (
		<header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex items-center gap-2">
				{/* New chat button */}
				<Button variant="ghost" size="icon" onClick={onNewChat} title="New chat">
					<PlusIcon />
				</Button>
				<h1 className="text-lg font-semibold">AI Chat</h1>
			</div>

			{/* Model selector */}
			<ModelSelector value={selectedModel} onValueChange={onModelChange} />
		</header>
	);
}

"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "./icons";
import { ModelSelector } from "./model-selector";

type ChatHeaderProps = {
  onNewChat?: () => void;
  onModelChange?: (modelId: string) => void;
  selectedModel?: string;
};

export function ChatHeader({
  onNewChat,
  onModelChange,
  selectedModel,
}: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        {/* New chat button */}
        <Button
          onClick={onNewChat}
          size="icon"
          title="New chat"
          variant="ghost"
        >
          <PlusIcon />
        </Button>
        <h1 className="font-semibold text-lg">AI Chat</h1>
      </div>

      {/* Model selector */}
      <ModelSelector onValueChange={onModelChange} value={selectedModel} />
    </header>
  );
}

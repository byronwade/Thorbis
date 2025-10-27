"use client";

import type { UIMessage } from "@ai-sdk/react";
import { cn } from "@/lib/utils";
import { BotIcon, SparklesIcon, UserIcon } from "./icons";
import { Weather } from "./weather";

type MessageProps = {
  message: UIMessage;
  isLoading?: boolean;
};

export function ChatMessage({ message, isLoading = false }: MessageProps) {
  const isUser = message.role === "user";

  // Handle tool calls
  const toolInvocations = (message as any).toolInvocations || [];
  const hasContent =
    (message as any).content && (message as any).content.trim().length > 0;

  return (
    <div className="group/message relative mx-auto flex w-full max-w-3xl items-start gap-3 px-4 py-4 md:gap-4 md:px-8 md:py-6">
      {/* Avatar */}
      <div
        className={cn(
          "flex size-8 shrink-0 select-none items-center justify-center rounded-full",
          isUser ? "bg-blue-600 text-white" : "bg-zinc-100 dark:bg-zinc-800"
        )}
      >
        {isUser ? <UserIcon /> : <BotIcon />}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {/* Text content */}
        {hasContent && (
          <div className="prose dark:prose-invert max-w-none break-words text-sm leading-relaxed">
            <div className="whitespace-pre-wrap">
              {(message as any).content}
            </div>
          </div>
        )}

        {/* Tool invocations */}
        {toolInvocations.map((toolInvocation: any) => {
          const { toolName, toolCallId, state, result } = toolInvocation;

          if (state === "result") {
            if (toolName === "getWeather") {
              return <Weather data={result} key={toolCallId} />;
            }

            if (toolName === "createDocument") {
              return (
                <div
                  className="not-prose rounded-xl border bg-zinc-50 p-4 dark:bg-zinc-900"
                  key={toolCallId}
                >
                  <div className="mb-2 font-medium">
                    Document Created: {result.title}
                  </div>
                  <div className="rounded bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-800">
                    <div className="text-zinc-500">Type: {result.kind}</div>
                    <div className="mt-2 max-h-40 overflow-auto">
                      {result.content}
                    </div>
                  </div>
                </div>
              );
            }
          }

          return null;
        })}

        {isLoading && !isUser && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <SparklesIcon size={12} />
            <span>Thinking...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ThinkingMessage() {
  return (
    <div className="group/message relative mx-auto flex w-full max-w-3xl items-start gap-3 px-4 py-4 md:gap-4 md:px-8 md:py-6">
      <div className="flex size-8 shrink-0 select-none items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
        <BotIcon />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <SparklesIcon size={14} />
          <span>Thinking...</span>
        </div>
      </div>
    </div>
  );
}

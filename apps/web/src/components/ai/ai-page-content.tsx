"use client";

import type { UIMessage as AiMessage } from "ai";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load the AI chat interface - saves ~200KB from initial bundle
const AiChatInterface = dynamic(
	() => import("./ai-chat-interface").then((mod) => mod.AiChatInterface),
	{
		ssr: false,
		loading: () => (
			<div className="flex h-full flex-col gap-4 p-4">
				<Skeleton className="h-12 w-full" />
				<div className="flex-1 space-y-4">
					<Skeleton className="h-20 w-3/4" />
					<Skeleton className="ml-auto h-16 w-2/3" />
					<Skeleton className="h-24 w-4/5" />
				</div>
				<Skeleton className="h-14 w-full" />
			</div>
		),
	}
);

interface AiPageContentProps {
	companyId?: string;
	/** User ID for message persistence */
	userId?: string;
	/** Optional chat ID for existing chat */
	chatId?: string;
	/** Messages fetched on the server to avoid client refetch */
	initialMessages?: AiMessage[];
}

export function AiPageContent({
	companyId,
	userId,
	chatId,
	initialMessages,
}: AiPageContentProps) {
	const router = useRouter();

	// Handle chat creation - update URL when new chat is created
	const handleChatCreated = useCallback(
		(newChatId: string) => {
			router.replace(`/dashboard/ai/${newChatId}`, { scroll: false });
		},
		[router]
	);

	return (
		<div className="h-full">
			<AiChatInterface
				companyId={companyId}
				userId={userId}
				chatId={chatId}
				initialMessages={initialMessages}
				onChatCreated={handleChatCreated}
			/>
		</div>
	);
}

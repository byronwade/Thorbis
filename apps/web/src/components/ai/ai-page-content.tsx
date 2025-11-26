"use client";

import dynamic from "next/dynamic";
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
	},
);

interface AiPageContentProps {
	companyId?: string;
}

export function AiPageContent({ companyId }: AiPageContentProps) {
	return (
		<div className="h-full">
			<AiChatInterface companyId={companyId} />
		</div>
	);
}

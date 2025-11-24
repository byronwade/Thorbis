"use client";

import { AiChatInterface } from "./ai-chat-interface";

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

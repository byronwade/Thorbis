import { notFound } from "next/navigation";
import { getChat, getChatMessages } from "@/actions/chats";
import { AiPageContent } from "@/components/ai/ai-page-content";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { getCurrentUser } from "@/lib/auth/session";

// Force dynamic rendering since this page requires auth context
export const dynamic = "force-dynamic";

interface AiChatPageProps {
	params: Promise<{ chatId: string }>;
}

export default async function AiChatPage({ params }: AiChatPageProps) {
	const { chatId } = await params;

	const [user, activeCompanyId] = await Promise.all([
		getCurrentUser(),
		getActiveCompanyId(),
	]);
	const fallbackCompanyId = process.env.DEFAULT_COMPANY_ID;
	const companyId = activeCompanyId || fallbackCompanyId;

	// Verify the chat exists
	const chatResult = await getChat(chatId);
	if (!chatResult.success || !chatResult.data) {
		// Chat not found - redirect to 404
		notFound();
	}

	// Pre-fetch messages for SSR to avoid a second client round-trip on navigation
	const messagesResult = await getChatMessages(chatId);
	const initialMessages = messagesResult.success ? messagesResult.data : undefined;

	return (
		<AiPageContent
			companyId={companyId}
			userId={user?.id}
			chatId={chatId}
			initialMessages={initialMessages}
		/>
	);
}

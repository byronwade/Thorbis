import { Suspense } from "react";
import { MessagesDataV2 } from "@/components/communication/messages/messages-data-v2";
import { MessagesSkeleton } from "@/components/communication/messages/messages-skeleton";

/**
 * Messages Page - New Slack-inspired messaging UI
 *
 * Features:
 * - Clean 3-column layout (threads, conversation, customer panel)
 * - Virtual scrolling for performance
 * - Real-time updates
 * - Team collaboration (assignments, notes, presence)
 * - Mobile responsive
 */
export default function MessagesPage() {
	return (
		<div className="h-screen flex flex-col">
			<Suspense fallback={<MessagesSkeleton />}>
				<MessagesDataV2 />
			</Suspense>
		</div>
	);
}

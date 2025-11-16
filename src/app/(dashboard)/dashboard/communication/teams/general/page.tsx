/**
 * General Team Channel Page - Client Component
 *
 * Client-side features:
 * - Real-time team messaging
 * - Message history and search
 */

import { TeamChat } from "@/components/communication/team-chat";

export default function GeneralChannelPage() {
	return <TeamChat channelDescription="Company-wide announcements and general discussion" channelName="general" />;
}

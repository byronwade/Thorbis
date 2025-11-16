/**
 * Support Team Channel Page - Client Component
 *
 * Client-side features:
 * - Support team messaging
 * - Customer issue discussions and ticket coordination
 */

import { TeamChat } from "@/components/communication/team-chat";

export default function SupportChannelPage() {
	return <TeamChat channelDescription="Customer support coordination and ticket discussions" channelName="support" />;
}

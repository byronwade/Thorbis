/**
 * Management Team Channel Page - Client Component
 *
 * Client-side features:
 * - Management team messaging
 * - Strategic discussions and planning
 */

import { TeamChat } from "@/components/communication/team-chat";

export default function ManagementChannelPage() {
	return <TeamChat channelDescription="Management team discussions and strategic planning" channelName="management" />;
}

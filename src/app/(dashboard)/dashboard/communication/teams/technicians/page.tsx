/**
 * Technicians Team Channel Page - Client Component
 *
 * Client-side features:
 * - Technician team messaging
 * - Field service coordination and job discussions
 */

import { TeamChat } from "@/components/communication/team-chat";

export default function TechniciansChannelPage() {
	return <TeamChat channelDescription="Field technician coordination and job discussions" channelName="technicians" />;
}

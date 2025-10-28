"use client";

/**
 * Sales Team Channel Page - Client Component
 *
 * Client-side features:
 * - Sales team messaging
 * - Lead and opportunity discussions
 */

import { TeamChat } from "@/components/communication/team-chat";

export default function SalesChannelPage() {
  return (
    <TeamChat
      channelDescription="Sales team coordination, leads, and opportunities"
      channelName="sales"
    />
  );
}

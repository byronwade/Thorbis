"use client";

/**
 * Communication > Feed Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { useState } from "react";
import { CompanyFeed } from "@/components/communication/company-feed";

type ChannelType = "channel" | "dm";

export default function CompanyFeedPage() {
	const [selectedChannel, _setSelectedChannel] = useState<string>("company-feed");
	const [selectedChannelType, _setSelectedChannelType] = useState<ChannelType>("channel");

	// Configure layout with channels sidebar
	return <CompanyFeed channel={selectedChannel} channelType={selectedChannelType} />;
}

"use client";

import { CommunicationSidebar } from "@/components/communication/communication-sidebar";
import { teamsSidebarConfig } from "@/lib/communication/teams-sidebar-config";
import type { ComponentProps } from "react";
import type { Sidebar } from "@/components/ui/sidebar";

/**
 * TeamsSidebar - Teams communication sidebar
 *
 * Uses the shared CommunicationSidebar component with teams-specific configuration.
 */
export function TeamsSidebar(props: ComponentProps<typeof Sidebar>) {
	return <CommunicationSidebar config={teamsSidebarConfig} {...props} />;
}












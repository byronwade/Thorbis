"use client";

import type { ComponentProps } from "react";
import { CommunicationSidebar } from "@/components/communication/communication-sidebar";
import type { Sidebar } from "@/components/ui/sidebar";
import { teamsSidebarConfig } from "@/lib/communication/teams-sidebar-config";

/**
 * TeamsSidebar - Teams communication sidebar
 *
 * Uses the shared CommunicationSidebar component with teams-specific configuration.
 */
export function TeamsSidebar(props: ComponentProps<typeof Sidebar>) {
	return <CommunicationSidebar config={teamsSidebarConfig} {...props} />;
}

"use client";

import { CommunicationSidebar } from "@/components/communication/communication-sidebar";
import { ticketsSidebarConfig } from "@/lib/communication/tickets-sidebar-config";
import type { ComponentProps } from "react";
import type { Sidebar } from "@/components/ui/sidebar";

/**
 * TicketsSidebar - Support tickets communication sidebar
 *
 * Uses the shared CommunicationSidebar component with tickets-specific configuration.
 */
export function TicketsSidebar(props: ComponentProps<typeof Sidebar>) {
	return <CommunicationSidebar config={ticketsSidebarConfig} {...props} />;
}


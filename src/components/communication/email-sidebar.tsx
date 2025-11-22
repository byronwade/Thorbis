"use client";

import { CommunicationSidebar } from "@/components/communication/communication-sidebar";
import { emailSidebarConfig } from "@/lib/communication/email-sidebar-config";
import type { ComponentProps } from "react";
import type { Sidebar } from "@/components/ui/sidebar";

/**
 * EmailSidebar - Email communication sidebar
 *
 * Uses the shared CommunicationSidebar component with email-specific configuration.
 * This ensures consistent layout and behavior across all communication pages.
 */
export function EmailSidebar(
	props: ComponentProps<typeof Sidebar>
) {
	return <CommunicationSidebar config={emailSidebarConfig} {...props} />;
}

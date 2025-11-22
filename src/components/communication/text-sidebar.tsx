"use client";

import { CommunicationSidebar } from "@/components/communication/communication-sidebar";
import { textSidebarConfig } from "@/lib/communication/text-sidebar-config";
import type { ComponentProps } from "react";
import type { Sidebar } from "@/components/ui/sidebar";

/**
 * TextSidebar - Text/SMS communication sidebar
 *
 * Uses the shared CommunicationSidebar component with text-specific configuration.
 */
export function TextSidebar(props: ComponentProps<typeof Sidebar>) {
	return <CommunicationSidebar config={textSidebarConfig} {...props} />;
}


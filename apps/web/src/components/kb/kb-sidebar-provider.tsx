/**
 * KB Sidebar Provider - Client Component
 *
 * Provides sidebar context and layout structure
 */

"use client";

import React, { type ReactNode } from "react";
import {
	Sidebar,
	SidebarInset,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
} from "@/components/ui/sidebar";

type KBSidebarProviderProps = {
	children: ReactNode;
};

export function KBSidebarProvider({ children }: KBSidebarProviderProps) {
	// Extract sidebar content and main content from children
	// The first child should be the sidebar content, rest is main content
	const childrenArray = React.Children.toArray(children);
	const sidebarContent = childrenArray[0];
	const mainContent = childrenArray.slice(1);

	return (
		<SidebarProvider>
			<Sidebar collapsible="offcanvas" variant="sidebar">
				{sidebarContent}
				<SidebarRail />
			</Sidebar>
			<SidebarInset>
				<div className="flex h-full flex-col">
					{/* Sidebar Trigger for mobile */}
					<div className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:hidden">
						<SidebarTrigger />
						<span className="font-semibold">Knowledge Base</span>
					</div>
					{/* Main Content */}
					<div className="flex-1 overflow-auto">{mainContent}</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

"use client";

/**
 * Communication Section Layout
 *
 * Uses a dedicated communication sidebar for navigation
 * within the communication section.
 */

import type { ReactNode } from "react";
import { AdminCommunicationSidebar } from "@/components/communication/admin-communication-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function CommunicationLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<SidebarProvider defaultOpen>
			<div
				className="fixed inset-0 top-14 flex w-full overflow-hidden"
				data-admin-layout
			>
				<AdminCommunicationSidebar />

				<SidebarInset className="relative w-full bg-sidebar">
					<main className="flex h-full w-full flex-col overflow-hidden">
						{children}
					</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}

"use client";

/**
 * SectionLayout - Admin Panel Section Layout
 *
 * Wraps content with SidebarProvider and provides toolbar + sidebar
 * Matches web dashboard patterns for consistent UX
 */

import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AppToolbar } from "@/components/layout/app-toolbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type SectionLayoutProps = {
	children: ReactNode;
	title?: string;
	subtitle?: string;
	actions?: ReactNode;
	showSidebar?: boolean;
	showToolbar?: boolean;
	className?: string;
};

export function SectionLayout({
	children,
	title,
	subtitle,
	actions,
	showSidebar = true,
	showToolbar = true,
	className,
}: SectionLayoutProps) {
	return (
		<SidebarProvider defaultOpen>
			<div
				className="fixed inset-0 top-14 flex w-full overflow-hidden"
				data-admin-layout
			>
				{showSidebar && <AdminSidebar />}

				<SidebarInset className="relative w-full bg-background">
					{showToolbar && (
						<AppToolbar
							title={title}
							subtitle={subtitle}
							actions={actions}
							showSidebarTrigger={showSidebar}
						/>
					)}

					<main className={cn("flex w-full flex-1 flex-col overflow-y-auto", className)}>
						{children}
					</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}

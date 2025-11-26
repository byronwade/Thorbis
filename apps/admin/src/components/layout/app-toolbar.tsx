"use client";

/**
 * AppToolbar - Admin Panel Toolbar
 *
 * Matches the web dashboard toolbar design:
 * - Sidebar toggle button
 * - Title and subtitle
 * - Actions on the right
 */

import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type AppToolbarProps = {
	title?: string;
	subtitle?: string;
	actions?: ReactNode;
	showSidebarTrigger?: boolean;
	className?: string;
};

export function AppToolbar({
	title,
	subtitle,
	actions,
	showSidebarTrigger = true,
	className,
}: AppToolbarProps) {
	return (
		<header
			className={cn(
				"bg-background/80 sticky top-0 z-40 flex w-full shrink-0 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
				className
			)}
			data-app-toolbar
		>
			<div className="flex h-14 w-full items-center gap-3 px-4 md:px-6">
				{/* Left Section: Sidebar Toggle + Title */}
				<div className="flex items-center gap-3 min-w-0 flex-1">
					{showSidebarTrigger && (
						<SidebarTrigger className="-ml-1">
							<Menu className="h-4 w-4" />
							<span className="sr-only">Toggle sidebar</span>
						</SidebarTrigger>
					)}

					{/* Title */}
					{title && (
						<div className="flex min-w-0 flex-col">
							<h1 className="truncate text-sm font-semibold lg:text-base">
								{title}
							</h1>
							{subtitle && (
								<p className="text-muted-foreground truncate text-xs">
									{subtitle}
								</p>
							)}
						</div>
					)}
				</div>

				{/* Right Section: Actions */}
				{actions && (
					<div className="flex shrink-0 items-center gap-2">
						{actions}
					</div>
				)}
			</div>
		</header>
	);
}

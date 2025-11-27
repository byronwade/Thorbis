"use client";

/**
 * AppToolbar - Responsive Toolbar Component
 *
 * Desktop (md+): Shows all actions inline with proper grouping
 * Mobile (<md): Shows compact layout with dropdown menu for actions
 */

import { Menu, MoreVertical } from "lucide-react";
import type { ReactNode } from "react";
import { isValidElement } from "react";
import { OfflineIndicator } from "@/components/layout/offline-indicator";
import { ToolbarClientActions } from "@/components/layout/toolbar-client-actions";
import { ToolbarClientStats } from "@/components/layout/toolbar-client-stats";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ToolbarStatsButton } from "@/components/ui/toolbar-stats-button";
import { ToolbarStatsInline } from "@/components/ui/toolbar-stats-inline";
import type { ToolbarConfig } from "@/lib/layout/unified-layout-config";

type AppToolbarProps = {
	pathname?: string;
	config: ToolbarConfig;
	showLeftSidebar?: boolean;
	showRightSidebar?: boolean;
	scope?: "layout" | "page";
};

export function AppToolbar({
	pathname,
	config,
	showLeftSidebar = true,
	showRightSidebar = false,
	scope = "page",
}: AppToolbarProps) {
	const safePathname = pathname || "/dashboard";

	// Check if stats is a ReactNode component or StatCard[] array
	const isStatsReactNode = config.stats && isValidElement(config.stats);
	const isStatsArray = config.stats && Array.isArray(config.stats);

	// Determine stats display mode
	const statsMode =
		config.statsMode || (config.showInlineStats ? "inline" : "hidden");

	// Determine sections presence
	const hasTitle = Boolean(config.title || config.subtitle);
	const hasStats = Boolean(config.stats && statsMode !== "hidden");
	const hasSearch = Boolean(config.search);
	const hasPagination = Boolean(config.pagination);

	// Parse actions into structured groups
	const actionGroups = parseActions(config.actions);
	const hasActions =
		actionGroups.primary.length > 0 || actionGroups.secondary.length > 0;

	// Hide completely on mobile if specified
	const mobileHiddenClass = config.hideOnMobile ? "hidden md:flex" : "flex";

	return (
		<header
			className={`bg-background/80 sticky top-0 z-40 ${mobileHiddenClass} w-full shrink-0 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60`}
			data-app-toolbar
			data-app-toolbar-scope={scope}
		>
			{/* Desktop Layout (md+) */}
			<div className="hidden h-14 w-full items-center gap-3 px-6 md:flex">
				{/* Left Section: Navigation + Context */}
				<div className="flex min-w-0 flex-1 items-center gap-3">
					{/* Navigation */}
					<div className="flex shrink-0 items-center gap-2">
						{showLeftSidebar && <SidebarTrigger className="-ml-1" />}
						{config.back && (
							<div className="flex items-center">{config.back}</div>
						)}
					</div>

					{/* Context (Title/Breadcrumbs) */}
					{!config.breadcrumbs && hasTitle && (
						<div className="flex min-w-0 shrink-0 flex-col">
							{config.title && (
								<div className="flex items-baseline gap-2">
									{typeof config.title === "string" ? (
										<h1 className="truncate text-sm font-semibold lg:text-base">
											{config.title}
										</h1>
									) : (
										<div className="text-sm font-semibold lg:text-base">
											{config.title}
										</div>
									)}
								</div>
							)}
							{config.subtitle && (
								<p className="text-muted-foreground truncate text-xs">
									{config.subtitle}
								</p>
							)}
						</div>
					)}
					{config.breadcrumbs && (
						<div className="flex min-w-0 items-center">{config.breadcrumbs}</div>
					)}

					{/* Inline Stats (Desktop only - xl+) */}
					{hasStats && statsMode === "inline" && (
						<div
							className="hidden items-center xl:flex"
							data-toolbar-default-stats={safePathname}
						>
							<div className="bg-border/40 mx-3 h-5 w-px" />
							{isStatsReactNode && config.stats}
							{isStatsArray && config.stats.length > 0 && (
								<ToolbarStatsInline stats={config.stats} />
							)}
						</div>
					)}
				</div>

				{/* Right Section: Actions + Controls */}
				<div className="flex shrink-0 items-center gap-2">
					{/* Search */}
					{hasSearch && (
						<div className="flex max-w-md items-center">{config.search}</div>
					)}

					{/* Stats Button (when not inline) */}
					{hasStats && statsMode === "button" && (
						<>
							{isStatsArray && config.stats.length > 0 && (
								<ToolbarStatsButton stats={config.stats} />
							)}
							{isStatsReactNode && config.stats}
						</>
					)}

					<ToolbarClientStats pathname={safePathname} />

					{/* Pagination */}
					{hasPagination && (
						<>
							<div className="bg-border/40 h-5 w-px" />
							{config.pagination}
						</>
					)}

					{/* Primary Actions */}
					{actionGroups.primary.length > 0 && (
						<>
							{!config.hideActionSeparator && (
								<div className="bg-border/40 h-5 w-px" />
							)}
							<div className="flex items-center gap-1.5">
								{actionGroups.primary.map((action, idx) => (
									<div key={idx}>{action}</div>
								))}
							</div>
						</>
					)}

					{/* Secondary Actions Dropdown */}
					{actionGroups.secondary.length > 0 && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
									<MoreVertical className="h-4 w-4" />
									<span className="sr-only">More actions</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{actionGroups.secondary.map((action, idx) => (
									<DropdownMenuItem key={idx} asChild>
										{action}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					)}

					{/* Dynamic Actions */}
					<ToolbarClientActions pathname={safePathname} />

					{/* Offline Indicator */}
					<OfflineIndicator />
				</div>
			</div>

			{/* Mobile Layout (<md) */}
			<div className="flex h-14 w-full items-center gap-2 px-4 md:hidden">
				{/* Left: Sidebar trigger + Back button */}
				<div className="flex shrink-0 items-center gap-1">
					{showLeftSidebar && <SidebarTrigger className="-ml-1" />}
					{config.back && (
						<div className="flex items-center">{config.back}</div>
					)}
				</div>

				{/* Center: Title (truncated) */}
				{hasTitle && (
					<div className="min-w-0 flex-1">
						{typeof config.title === "string" ? (
							<h1 className="truncate text-sm font-semibold">{config.title}</h1>
						) : (
							<div className="truncate text-sm font-semibold">
								{config.title}
							</div>
						)}
					</div>
				)}

				{/* Right: Actions */}
				<div className="flex shrink-0 items-center gap-1">
					{/* Search (inline on mobile if provided) */}
					{hasSearch && (
						<div className="hidden xs:flex">{config.search}</div>
					)}

					{/* Stats Button on mobile */}
					{hasStats && isStatsArray && config.stats.length > 0 && (
						<ToolbarStatsButton stats={config.stats} />
					)}

					{/* Offline Indicator */}
					<OfflineIndicator />

					{/* Mobile Actions Dropdown */}
					{hasActions && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
									<Menu className="h-4 w-4" />
									<span className="sr-only">Actions menu</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{[...actionGroups.primary, ...actionGroups.secondary].map(
									(action, idx) => (
										<DropdownMenuItem key={idx} asChild className="p-0">
											<div className="w-full [&>*]:w-full [&>*]:justify-start [&>*]:rounded-none [&>*]:border-0 [&>*]:px-2 [&>*]:py-1.5 [&>*]:font-normal [&>*]:shadow-none">
												{action}
											</div>
										</DropdownMenuItem>
									),
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</header>
	);
}

/**
 * Parse actions into primary (always visible) and secondary (dropdown) groups
 */
function parseActions(actions: ReactNode): {
	primary: ReactNode[];
	secondary: ReactNode[];
} {
	if (!actions) {
		return { primary: [], secondary: [] };
	}

	// If actions is a single element, treat as primary
	if (!Array.isArray(actions)) {
		return { primary: [actions], secondary: [] };
	}

	// Split array: first 2 are primary, rest are secondary
	return {
		primary: actions.slice(0, 2),
		secondary: actions.slice(2),
	};
}

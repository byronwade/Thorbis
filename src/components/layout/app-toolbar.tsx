"use client";

/**
 * AppToolbar - Redesigned Responsive Toolbar
 *
 * Modern, intelligent toolbar with:
 * - Responsive design (desktop → tablet → mobile)
 * - Smart action grouping with dropdowns
 * - Context-aware buttons
 * - Mobile-first hamburger menu
 * - Keyboard shortcuts
 */

import {
	ChevronDown,
	Download,
	Filter,
	Menu,
	MoreVertical,
	Plus,
	Search,
	Settings,
	Upload,
	X,
} from "lucide-react";
import type { ReactNode } from "react";
import { isValidElement, useState } from "react";
import { ToolbarClientActions } from "@/components/layout/toolbar-client-actions";
import { ToolbarClientStats } from "@/components/layout/toolbar-client-stats";
import { OfflineIndicator } from "@/components/offline/offline-indicator";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
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
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
	const hasActions = Boolean(config.actions);

	// Parse actions into structured groups
	const actionGroups = parseActions(config.actions);

	return (
		<header
			className="border-border-subtle bg-background/80 sticky top-0 z-40 flex w-full shrink-0 border-b-hairline backdrop-blur-xl shadow-overlay-xs md:rounded-t-2xl supports-[backdrop-filter]:bg-background/60"
			data-app-toolbar
			data-app-toolbar-scope={scope}
		>
			{/* Desktop/Tablet Layout */}
			<div className="hidden md:flex h-14 w-full items-center gap-3 px-4 lg:px-6">
				{/* Left Section: Navigation + Context */}
				<div className="flex items-center gap-3 min-w-0 flex-1">
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
						<div className="flex min-w-0 items-center">
							{config.breadcrumbs}
						</div>
					)}

					{/* Inline Stats (Desktop only) */}
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
						<div className="flex items-center max-w-md">{config.search}</div>
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
							<div className="bg-border/40 h-5 w-px" />
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

			{/* Mobile Layout */}
			<div className="flex md:hidden h-14 w-full items-center gap-2 px-3">
				{/* Left: Sidebar + Title */}
				<div className="flex items-center gap-2 min-w-0 flex-1">
					{showLeftSidebar && <SidebarTrigger className="-ml-1" />}

					{config.back && (
						<div className="flex items-center">{config.back}</div>
					)}

					{hasTitle && typeof config.title === "string" && (
						<h1 className="truncate text-sm font-semibold">{config.title}</h1>
					)}
					{hasTitle && typeof config.title !== "string" && (
						<div className="text-sm font-semibold truncate">{config.title}</div>
					)}
				</div>

				{/* Right: Search Icon + Mobile Menu */}
				<div className="flex shrink-0 items-center gap-1">
					{hasSearch && (
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
									<Search className="h-4 w-4" />
									<span className="sr-only">Search</span>
								</Button>
							</SheetTrigger>
							<SheetContent side="top" className="h-[200px]">
								<SheetHeader>
									<SheetTitle>Search</SheetTitle>
								</SheetHeader>
								<div className="mt-4">{config.search}</div>
							</SheetContent>
						</Sheet>
					)}

					<OfflineIndicator />

					{/* Mobile Menu */}
					<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
								<Menu className="h-4 w-4" />
								<span className="sr-only">Menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[300px] sm:w-[400px]">
							<SheetHeader>
								<SheetTitle className="flex items-center justify-between">
									<span>Actions</span>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										<X className="h-4 w-4" />
									</Button>
								</SheetTitle>
							</SheetHeader>

							<div className="mt-6 space-y-4">
								{/* Stats */}
								{hasStats && isStatsArray && config.stats.length > 0 && (
									<div className="space-y-2">
										<p className="text-sm font-medium text-muted-foreground">
											Statistics
										</p>
										<div className="grid gap-2">
											{config.stats.map((stat, idx) => (
												<div
													key={idx}
													className="rounded-lg border p-3 space-y-1"
												>
													<p className="text-xs text-muted-foreground">
														{stat.label}
													</p>
													<div className="flex items-baseline gap-2">
														<p className="text-2xl font-bold">{stat.value}</p>
														{stat.icon && (
															<span className="text-muted-foreground">
																{stat.icon}
															</span>
														)}
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Actions */}
								{(actionGroups.primary.length > 0 ||
									actionGroups.secondary.length > 0) && (
									<div className="space-y-2">
										<p className="text-sm font-medium text-muted-foreground">
											Actions
										</p>
										<div className="grid gap-2">
											{[...actionGroups.primary, ...actionGroups.secondary].map(
												(action, idx) => (
													<div
														key={idx}
														className="w-full"
														onClick={() => setIsMobileMenuOpen(false)}
													>
														{action}
													</div>
												),
											)}
										</div>
									</div>
								)}

								{/* Pagination */}
								{hasPagination && (
									<div className="space-y-2">
										<p className="text-sm font-medium text-muted-foreground">
											Navigation
										</p>
										<div className="flex items-center justify-center">
											{config.pagination}
										</div>
									</div>
								)}
							</div>
						</SheetContent>
					</Sheet>
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

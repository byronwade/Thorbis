/**
 * AppToolbar - Page-specific toolbar component
 *
 * Renders at the top of the main content area with:
 * - Left sidebar trigger button (when left sidebar exists)
 * - Right sidebar trigger button (when right sidebar exists)
 * - Page title and subtitle
 * - Action buttons (save, export, etc.)
 *
 * Now fully config-driven from unified-layout-config.tsx
 * No route matching logic - receives config as prop
 *
 * Matches sidebar styling: semi-transparent background with backdrop blur
 */

import { ToolbarClientActions } from "@/components/layout/toolbar-client-actions";
import { ToolbarClientStats } from "@/components/layout/toolbar-client-stats";
import { OfflineIndicator } from "@/components/offline/offline-indicator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ToolbarStats } from "@/components/ui/toolbar-stats";
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
	const actionsJustify =
		config.actionsJustify ??
		(config.title || config.breadcrumbs || config.back
			? "flex-end"
			: "space-between");
	const actionsClassName =
		actionsJustify === "space-between"
			? "flex flex-1 items-center gap-1.5"
			: "ml-auto flex items-center gap-1.5";

	return (
		<header
			className="border-border/50 bg-background/90 sticky top-0 z-40 flex w-full shrink-0 border-b backdrop-blur-md md:rounded-t-2xl"
			data-app-toolbar
			data-app-toolbar-scope={scope}
		>
			<div className="flex h-14 w-full items-center gap-2 px-4 md:px-6">
				{/* Left Sidebar Toggle */}
				{showLeftSidebar && <SidebarTrigger className="-ml-1 shrink-0" />}

				{/* Back Button */}
				{config.back && <div className="flex items-center">{config.back}</div>}

				{/* Breadcrumbs or Title and Subtitle */}
				{config.breadcrumbs ? (
					<div className="flex items-center">{config.breadcrumbs}</div>
				) : (
					(config.title || config.subtitle) && (
						<div className="flex shrink-0 flex-col">
							{config.title &&
								(typeof config.title === "string" ? (
									<h1 className="text-lg font-semibold">{config.title}</h1>
								) : (
									<div className="text-lg font-semibold">{config.title}</div>
								))}
							{config.subtitle && (
								<p className="text-muted-foreground hidden text-sm md:block">
									{config.subtitle}
								</p>
							)}
						</div>
					)
				)}

				{/* Statistics - Inline in toolbar */}
				{config.stats && config.stats.length > 0 && (
					<div data-toolbar-default-stats={safePathname}>
						<ToolbarStats stats={config.stats} />
					</div>
				)}
				<ToolbarClientStats pathname={safePathname} />

				{/* Action Buttons and Right Sidebar Toggle */}
				<div className={actionsClassName}>
					{/* Offline Status Indicator */}
					<OfflineIndicator />

					{/* Custom Action Buttons */}
					{config.actions && (
						<div data-toolbar-default-actions={safePathname}>
							{config.actions}
						</div>
					)}
					<ToolbarClientActions pathname={safePathname} />

					{/* Right Sidebar Toggle Button */}
				</div>
			</div>
		</header>
	);
}

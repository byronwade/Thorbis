"use client";

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

import { Settings } from "lucide-react";
import { OfflineIndicator } from "@/components/offline/offline-indicator";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ToolbarStats } from "@/components/ui/toolbar-stats";
import type { ToolbarConfig } from "@/lib/layout/unified-layout-config";

type AppToolbarProps = {
  config: ToolbarConfig;
  showLeftSidebar?: boolean;
  showRightSidebar?: boolean;
  onToggleRightSidebar?: () => void;
  isRightSidebarOpen?: boolean;
};

export function AppToolbar({
  config,
  showLeftSidebar = true,
  showRightSidebar = false,
  onToggleRightSidebar,
  isRightSidebarOpen = false,
}: AppToolbarProps) {
  return (
    <header className="sticky top-0 z-40 flex w-full shrink-0 border-border/50 border-b bg-background/90 backdrop-blur-md md:rounded-t-2xl">
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
              {config.title && (
                <h1 className="font-semibold text-lg">{config.title}</h1>
              )}
              {config.subtitle && (
                <p className="hidden text-muted-foreground text-sm md:block">
                  {config.subtitle}
                </p>
              )}
            </div>
          )
        )}

        {/* Statistics - Inline in toolbar */}
        {config.stats && config.stats.length > 0 && (
          <ToolbarStats stats={config.stats} />
        )}

        {/* Action Buttons and Right Sidebar Toggle */}
        <div className="ml-auto flex items-center gap-1.5">
          {/* Offline Status Indicator */}
          <OfflineIndicator />

          {/* Custom Action Buttons */}
          {config.actions}

          {/* Right Sidebar Toggle Button */}
          {showRightSidebar && onToggleRightSidebar && (
            <Button
              className="h-8 w-8 shrink-0"
              data-sidebar="trigger"
              data-slot="sidebar-trigger-right"
              onClick={onToggleRightSidebar}
              size="icon"
              variant="ghost"
            >
              <Settings />
              <span className="sr-only">
                {isRightSidebarOpen ? "Close settings" : "Open settings"}
              </span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

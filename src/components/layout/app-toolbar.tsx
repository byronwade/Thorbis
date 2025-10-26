"use client";

import { usePathname } from "next/navigation";
import {
  getPaddingClass,
  useLayoutConfig,
} from "@/components/layout/layout-config-provider";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getToolbarConfig } from "@/lib/toolbar-config";

/**
 * App Toolbar - displays at the top of main content area
 * Automatically configures based on current route using toolbar-config.tsx
 * Uses consistent padding with main content area
 */
export function AppToolbar() {
  const pathname = usePathname();
  const { config: layoutConfig } = useLayoutConfig();
  const toolbarConfig = getToolbarConfig(pathname);

  // Get horizontal padding from layout config (matches main content)
  const paddingClass = getPaddingClass(layoutConfig.padding);
  // Extract only horizontal padding (px-*) from the full padding class
  const horizontalPadding = paddingClass.replace("p-", "px-");

  // If no config found, show minimal toolbar with just sidebar trigger
  if (!toolbarConfig) {
    return (
      <header className="sticky top-14 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className={`flex h-14 items-center gap-4 ${horizontalPadding}`}>
          <SidebarTrigger className="-ml-1" />
        </div>
      </header>
    );
  }

  // Show toolbar with route-specific configuration
  return (
    <header className="sticky top-14 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className={`flex h-14 items-center gap-4 ${horizontalPadding}`}>
        <SidebarTrigger className="-ml-1" />
        <h1 className="font-semibold text-lg">{toolbarConfig.title}</h1>
        {toolbarConfig.actions && (
          <div className="ml-auto flex items-center gap-2">
            {toolbarConfig.actions}
          </div>
        )}
      </div>
    </header>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getToolbarConfig } from "@/lib/toolbar-config";

/**
 * App Toolbar - displays at the top of main content area
 * Automatically configures based on current route using toolbar-config.tsx
 * Matches app header styling: px-2, h-14, gap-2, bg-sidebar with shadow
 */
export function AppToolbar() {
  const pathname = usePathname();
  const toolbarConfig = getToolbarConfig(pathname);

  // If no config found, show minimal toolbar with just sidebar trigger
  if (!toolbarConfig) {
    return (
      <header className="sticky top-14 z-40 w-full rounded-tl-xl bg-toolbar-bg shadow-[0_4px_12px_-2px_rgba(0,0,0,0.2)]">
        <div className="flex h-14 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </div>
      </header>
    );
  }

  // Show toolbar with route-specific configuration
  return (
    <header className="sticky top-14 z-40 w-full rounded-tl-xl bg-toolbar-bg shadow-[0_4px_12px_-2px_rgba(0,0,0,0.2)]">
      <div className="flex h-14 items-center gap-2 px-4">
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

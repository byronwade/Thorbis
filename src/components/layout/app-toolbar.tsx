"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getToolbarConfig } from "@/lib/toolbar-config";

/**
 * App Toolbar - displays at the top of main content area
 * Automatically configures based on current route using toolbar-config.tsx
 * Matches sidebar styling: semi-transparent background with backdrop blur
 */
export function AppToolbar() {
  const pathname = usePathname();
  const toolbarConfig = getToolbarConfig(pathname);

  // If no config found, show minimal toolbar with just sidebar trigger
  if (!toolbarConfig) {
    return (
      <header className="sticky top-0 z-40 flex w-full shrink-0 border-border/50 border-b bg-background/90 backdrop-blur-md md:rounded-t-2xl">
        <div className="flex h-14 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </div>
      </header>
    );
  }

  // Show toolbar with route-specific configuration
  return (
    <header className="sticky top-0 z-40 flex w-full shrink-0 border-border/50 border-b bg-background/90 backdrop-blur-md md:rounded-t-2xl">
      <div className="flex min-h-14 w-full items-center gap-4 px-4 py-2">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <div className="flex shrink-0 flex-col">
          <h1 className="font-semibold text-lg">{toolbarConfig.title}</h1>
          {toolbarConfig.subtitle && (
            <p className="text-muted-foreground text-sm">
              {toolbarConfig.subtitle}
            </p>
          )}
        </div>
        {toolbarConfig.actions && (
          <div className="ml-auto flex items-center gap-4">
            {toolbarConfig.actions}
          </div>
        )}
      </div>
    </header>
  );
}

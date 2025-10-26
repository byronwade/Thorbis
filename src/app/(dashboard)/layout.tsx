"use client";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppToolbar } from "@/components/layout/app-toolbar";
import { IncomingCallNotification } from "@/components/layout/incoming-call-notification";
import {
  getGapClass,
  getMaxWidthClass,
  getPaddingClass,
  LayoutConfigProvider,
  useLayoutConfig,
} from "@/components/layout/layout-config-provider";
import {
  SidebarInset,
  SidebarProvider as UISidebarProvider,
} from "@/components/ui/sidebar";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { config } = useLayoutConfig();

  const maxWidthClass = getMaxWidthClass(config.maxWidth);
  const paddingClass = getPaddingClass(config.padding);
  const gapClass = getGapClass(config.gap);
  const isFullWidth = config.maxWidth === "full";
  const showSidebar = config.showSidebar !== false;

  return (
    <UISidebarProvider>
      <div className="flex min-h-[calc(100vh-3.5rem)] w-full">
        {showSidebar && <AppSidebar />}
        <SidebarInset className="w-full">
          {config.showToolbar && <AppToolbar />}
          {isFullWidth ? (
            <main className="flex w-full flex-1 flex-col">{children}</main>
          ) : (
            <main
              className={`flex w-full flex-1 flex-col ${gapClass} ${paddingClass}`}
            >
              <div className={maxWidthClass}>{children}</div>
            </main>
          )}
        </SidebarInset>
      </div>
    </UISidebarProvider>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutConfigProvider>
      <AppHeader />
      <DashboardContent>{children}</DashboardContent>
      <IncomingCallNotification />
    </LayoutConfigProvider>
  );
}

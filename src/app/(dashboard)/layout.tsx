"use client";

export const dynamic = "force-dynamic";

import { usePathname } from "next/navigation";
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
import { ScheduleViewProvider } from "@/components/schedule/schedule-view-provider";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { config } = useLayoutConfig();
  const pathname = usePathname();

  const maxWidthClass = getMaxWidthClass(config.maxWidth);
  const paddingClass = getPaddingClass(
    config.padding,
    config.paddingX,
    config.paddingY
  );
  const gapClass = getGapClass(config.gap);
  const isFullWidth = config.maxWidth === "full";
  const showSidebar = config.showSidebar !== false;
  const heightClass = config.fixedHeight
    ? "h-[calc(100vh-3.5rem)]"
    : "min-h-[calc(100vh-3.5rem)]";

  const isSchedulePage = pathname.startsWith("/dashboard/schedule");

  const content = (
    <UISidebarProvider>
      <div className={`flex ${heightClass} w-full`}>
        {showSidebar && <AppSidebar />}
        <SidebarInset className="w-full">
          {config.showToolbar && <AppToolbar />}
          {isFullWidth ? (
            <main className={`flex w-full flex-1 flex-col ${gapClass} ${paddingClass}`}>{children}</main>
          ) : (
            <main
              className={`flex w-full flex-1 flex-col ${gapClass} ${paddingClass}`}
            >
              <div className={`w-full ${maxWidthClass}`}>{children}</div>
            </main>
          )}
        </SidebarInset>
      </div>
    </UISidebarProvider>
  );

  // Wrap schedule pages with ScheduleViewProvider
  if (isSchedulePage) {
    return <ScheduleViewProvider>{content}</ScheduleViewProvider>;
  }

  return content;
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

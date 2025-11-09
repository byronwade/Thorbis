"use client";

/**
 * LayoutWrapper - Unified Layout System (Client Component)
 *
 * Renders page layout based on unified configuration:
 * - Toolbar (page-specific title/actions)
 * - Left sidebar (navigation)
 * - Main content area
 * - Right sidebar (contextual tools)
 *
 * Note: AppHeader (server component) is rendered in dashboard layout,
 * not here, because client components can't import server components.
 *
 * All layout elements are config-driven from unified-layout-config.tsx
 * No hardcoded route patterns or duplicate logic!
 */

import { usePathname } from "next/navigation";
import { InvoiceOptionsSidebar } from "@/components/invoices/invoice-options-sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppToolbar } from "@/components/layout/app-toolbar";
import { PriceBookSidebar } from "@/components/pricebook/pricebook-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  getGapClass,
  getMaxWidthClass,
  getPaddingClass,
  getUnifiedLayoutConfig,
} from "@/lib/layout/unified-layout-config";
import { useSidebarStateStore } from "@/lib/stores/sidebar-state-store";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

// Right sidebar component registry
const RIGHT_SIDEBAR_COMPONENTS = {
  invoice: InvoiceOptionsSidebar,
  pricebook: PriceBookSidebar,
  // Add more sidebar types here as needed
} as const;

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Get unified configuration for this route
  const config = getUnifiedLayoutConfig(pathname);

  // Extract configuration sections
  const { structure, header, toolbar, sidebar, rightSidebar } = config;

  // Left sidebar state (per-route)
  const sidebarOpen = useSidebarStateStore((state) =>
    state.getSidebarState(pathname)
  );
  const setSidebarOpen = useSidebarStateStore((state) => state.setSidebarState);

  // Right sidebar state (per-route)
  // Subscribe directly to the state value so component re-renders on change
  const rightSidebarStates = useSidebarStateStore(
    (state) => state.rightSidebarStates
  );
  const setRightSidebarState = useSidebarStateStore(
    (state) => state.setRightSidebarState
  );

  // Routes with no layout chrome
  if (pathname === "/dashboard/tv" || pathname === "/dashboard/welcome") {
    return <>{children}</>;
  }

  // Calculate CSS classes from structure config
  const maxWidthClass = getMaxWidthClass(structure.maxWidth);
  const paddingClass = getPaddingClass(
    structure.padding,
    structure.paddingX,
    structure.paddingY
  );
  const gapClass = getGapClass(structure.gap);
  const isFullWidth = structure.maxWidth === "full";

  // Right sidebar rendering - calculate from subscribed state
  const isRightSidebarOpen = rightSidebar?.show
    ? (rightSidebarStates[pathname] ?? rightSidebar.defaultOpen ?? true)
    : false;

  const renderRightSidebar = () => {
    if (!(rightSidebar?.show && rightSidebar.component)) {
      return null;
    }

    // Get component from registry
    const SidebarComponent =
      RIGHT_SIDEBAR_COMPONENTS[
        rightSidebar.component as keyof typeof RIGHT_SIDEBAR_COMPONENTS
      ];

    if (!SidebarComponent) {
      console.warn(
        `Right sidebar component "${rightSidebar.component}" not found in registry`
      );
      return null;
    }

    return (
      <SidebarProvider
        className="!w-auto flex-shrink-0"
        onOpenChange={(open) => setRightSidebarState(pathname, open)}
        open={isRightSidebarOpen}
      >
        <SidebarComponent />
      </SidebarProvider>
    );
  };

  return (
    <>
      {/* Main Layout Container */}
      <SidebarProvider
        onOpenChange={(open) => setSidebarOpen(pathname, open)}
        open={sidebarOpen}
        style={
          sidebar.customConfig?.width
            ? ({
                "--sidebar-width": sidebar.customConfig.width,
              } as React.CSSProperties)
            : undefined
        }
      >
        <div
          className="fixed inset-0 top-14 flex w-full overflow-hidden"
          data-dashboard-layout
        >
          {/* Left Sidebar */}
          {sidebar.show && <AppSidebar />}

          {/* Main Content Area */}
          <SidebarInset
            className="relative w-full"
            data-has-right-sidebar={isRightSidebarOpen ? "true" : undefined}
          >
            {/* Page Toolbar (title, actions) */}
            {toolbar.show && (
              <AppToolbar
                config={toolbar}
                isRightSidebarOpen={isRightSidebarOpen}
                onToggleRightSidebar={
                  rightSidebar?.show
                    ? () => setRightSidebarState(pathname, !isRightSidebarOpen)
                    : undefined
                }
                showLeftSidebar={sidebar.show}
                showRightSidebar={rightSidebar?.show}
              />
            )}

            {/* Page Content */}
            {isFullWidth ? (
              <main
                className={`flex w-full flex-1 flex-col overflow-y-auto ${gapClass} ${paddingClass}`}
              >
                {children}
              </main>
            ) : (
              <main
                className={`flex w-full flex-1 flex-col overflow-y-auto ${gapClass} ${paddingClass}`}
              >
                <div className={`w-full ${maxWidthClass}`}>{children}</div>
              </main>
            )}
          </SidebarInset>

          {/* Right Sidebar (contextual tools) */}
          {renderRightSidebar()}
        </div>
      </SidebarProvider>
    </>
  );
}

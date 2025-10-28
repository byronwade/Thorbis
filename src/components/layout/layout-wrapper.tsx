"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppToolbar } from "@/components/layout/app-toolbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getLayoutConfig, getMaxWidthClass, getPaddingClass, getGapClass } from "@/lib/layout/layout-config";

interface LayoutWrapperProps {
	children: React.ReactNode;
	showHeader: boolean;
}

export function LayoutWrapper({ children, showHeader }: LayoutWrapperProps) {
	const pathname = usePathname();
	const config = getLayoutConfig(pathname);

	// Calculate classes
	const maxWidthClass = getMaxWidthClass(config.maxWidth);
	const paddingClass = getPaddingClass(config.padding, config.paddingX, config.paddingY);
	const gapClass = getGapClass(config.gap);
	const isFullWidth = config.maxWidth === "full";
	const showSidebar = config.showSidebar !== false;
	const showToolbar = config.showToolbar !== false;

	const heightClass = config.fixedHeight ? (showHeader ? "h-[calc(100vh-3.5rem)]" : "h-screen") : showHeader ? "min-h-[calc(100vh-3.5rem)]" : "min-h-screen";

	return (
		<SidebarProvider>
			<div className={`flex ${heightClass} w-full`}>
				{showSidebar && <AppSidebar />}
				<SidebarInset className="w-full">
					{showToolbar && <AppToolbar />}
					{isFullWidth ? (
						<main className={`flex w-full flex-1 flex-col ${gapClass} ${paddingClass}`}>{children}</main>
					) : (
						<main className={`flex w-full flex-1 flex-col ${gapClass} ${paddingClass}`}>
							<div className={`w-full ${maxWidthClass}`}>{children}</div>
						</main>
					)}
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}

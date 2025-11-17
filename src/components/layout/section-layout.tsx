import type { CSSProperties, ReactNode } from "react";
import { InvoiceOptionsSidebar } from "@/components/invoices/invoice-options-sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppToolbar } from "@/components/layout/app-toolbar";
import { PriceBookSidebar } from "@/components/pricebook/pricebook-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";
import { cn } from "@/lib/utils";

type SectionLayoutProps = {
	children: ReactNode;
	config: UnifiedLayoutConfig;
	pathname: string;
};

const RIGHT_SIDEBAR_COMPONENTS = {
	invoice: InvoiceOptionsSidebar,
	pricebook: PriceBookSidebar,
} as const;

/**
 * SectionLayout - Reusable Server Component
 *
 * Takes a layout config and renders the appropriate structure.
 * Used by section-specific layouts to avoid code duplication.
 *
 * This is a pure server component - no client JS needed.
 */
export function SectionLayout({ children, config, pathname }: SectionLayoutProps) {
	const { structure, toolbar, sidebar, rightSidebar } = config;

	// Compute layout classes based on structure config
	const maxWidthClass =
		structure.maxWidth === "full" ? "w-full" : `mx-auto w-full max-w-${structure.maxWidth}`;

	const paddingMap = {
		none: "",
		sm: "p-4",
		md: "p-6",
		lg: "p-8",
	};
	const paddingClass = paddingMap[structure.padding || "none"];

	const gapMap = {
		none: "",
		sm: "gap-4",
		md: "gap-6",
		lg: "gap-8",
	};
	const gapClass = gapMap[structure.gap || "none"];

	const isFullWidth = structure.maxWidth === "full";
	const variant = structure.variant ?? "default";

	const backgroundMap: Record<string, string> = {
		default: "bg-background",
		muted: "bg-muted/50",
		card: "bg-card",
	};
	const backgroundClass = backgroundMap[structure.background || "default"] ?? backgroundMap.default;

	const insetClassName = cn(
		"relative w-full",
		backgroundClass,
		variant === "detail" && "flex flex-col gap-0"
	);

	const mainBaseClass = "flex w-full flex-1 flex-col overflow-y-auto";
	const detailTopPadding =
		{
			none: "pt-4",
			sm: "pt-6",
			md: "pt-8",
			lg: "pt-10",
		}[structure.padding || "none"] ?? "pt-4";

	const mainClassName = cn(
		mainBaseClass,
		gapClass,
		paddingClass,
		variant === "detail" && "pb-24",
		variant === "detail" ? cn("px-0", detailTopPadding) : undefined
	);

	const RightSidebarComponent =
		rightSidebar?.component &&
		RIGHT_SIDEBAR_COMPONENTS[rightSidebar.component as keyof typeof RIGHT_SIDEBAR_COMPONENTS];

	return (
		<SidebarProvider
			defaultOpen
			style={
				sidebar.customConfig?.width
					? ({
							"--sidebar-width": sidebar.customConfig.width,
						} as CSSProperties)
					: undefined
			}
		>
			<div
				className="fixed inset-0 top-14 flex w-full overflow-hidden"
				data-dashboard-layout
				data-pathname={pathname}
			>
				{sidebar.show && <AppSidebar pathname={pathname} />}

				<SidebarInset
					className={insetClassName}
					data-has-right-sidebar={rightSidebar?.show ? "true" : undefined}
					data-layout-variant={variant}
				>
					{toolbar.show && (
						<AppToolbar
							config={toolbar}
							pathname={pathname}
							showLeftSidebar={sidebar.show}
							showRightSidebar={rightSidebar?.show}
						/>
					)}

					{isFullWidth ? (
						<main className={mainClassName}>{children}</main>
					) : (
						<main className={mainClassName}>
							<div className={maxWidthClass}>{children}</div>
						</main>
					)}
				</SidebarInset>

				{rightSidebar?.show && RightSidebarComponent && (
					<div
						className={cn(
							"hidden",
							"border-l",
							"border-border/50",
							"bg-muted/20",
							"xl:flex",
							"xl:w-80"
						)}
					>
						<RightSidebarComponent />
					</div>
				)}
			</div>
		</SidebarProvider>
	);
}

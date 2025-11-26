import { AdminHeader } from "@/components/layout/admin-header";

/**
 * Admin Dashboard Layout
 *
 * Uses the same structure as contractor dashboard:
 * - Header at top (sticky, 56px)
 * - Main content area (sections handle their own sidebars)
 *
 * Each section uses SectionLayout to wrap its content with
 * the appropriate sidebar and toolbar configuration.
 */
export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div data-dashboard-layout className="flex h-screen flex-col overflow-hidden">
			{/* Header */}
			<AdminHeader />

			{/* Page content - sections handle their own layout */}
			{children}
		</div>
	);
}

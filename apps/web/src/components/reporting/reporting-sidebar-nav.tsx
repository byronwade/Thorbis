"use client";

/**
 * Reporting Sidebar Navigation V2 - Client Component
 *
 * Clean, focused design:
 * - Preset reports in a compact dropdown menu
 * - Custom reports take center stage
 * - More space for user's personal reports
 */

import {
	BarChart3,
	DollarSign,
	Plus,
	Trash2,
	TrendingUp,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavGrouped } from "@/components/layout/nav-grouped";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	reportingSelectors,
	useReportingStore,
} from "@/lib/stores/reporting-store";
import { PresetReportsDropdown } from "./preset-reports-dropdown";

// Top 4 reports every business owner needs
const topReports = [
	{
		title: "Profit & Loss",
		href: "/dashboard/reporting/finance/profit-loss",
		icon: DollarSign,
		description: "Essential financial overview",
	},
	{
		title: "Revenue Analysis",
		href: "/dashboard/reporting/finance/revenue",
		icon: TrendingUp,
		description: "Track income trends",
	},
	{
		title: "Team Performance",
		href: "/dashboard/reporting/team/leaderboard",
		icon: Users,
		description: "Technician rankings",
	},
	{
		title: "Job Performance",
		href: "/dashboard/reporting/operations/jobs",
		icon: BarChart3,
		description: "Operations metrics",
	},
];

export function ReportingSidebarNav() {
	const pathname = usePathname();
	const customReports = useReportingStore(reportingSelectors.customReports);
	const { deleteCustomReport, setIsCreatingReport } = useReportingStore();

	const handleDeleteReport = (e: React.MouseEvent, reportId: string) => {
		e.preventDefault();
		e.stopPropagation();
		deleteCustomReport(reportId);
	};

	const handleCreateReport = () => {
		setIsCreatingReport(true);
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Preset Reports Dropdown */}
			<SidebarGroup>
				<SidebarGroupLabel>All reports</SidebarGroupLabel>
				<PresetReportsDropdown />
			</SidebarGroup>

			{/* Top Reports for Business Owners */}
			<NavGrouped
				groups={[
					{
						label: "Quick access",
						items: topReports.map((report) => ({
							title: report.title,
							url: report.href,
							icon: report.icon,
						})),
					},
				]}
				pathname={pathname}
			/>

			{/* Custom Reports Section - Takes Center Stage */}
			<SidebarGroup>
				<SidebarGroupLabel>
					<div className="flex items-center justify-between w-full">
						<span>My custom reports</span>
						<button
							className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex h-5 w-5 items-center justify-center rounded-md transition-colors"
							onClick={handleCreateReport}
							title="Create new report"
							type="button"
						>
							<Plus className="h-3.5 w-3.5" />
						</button>
					</div>
				</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
					{customReports.length === 0 ? (
						<div className="px-2 py-8 text-center">
							<p className="text-muted-foreground mb-2 text-sm">
								No custom reports yet
							</p>
							<button
								className="text-primary text-xs hover:underline"
								onClick={handleCreateReport}
								type="button"
							>
								Create your first report
							</button>
						</div>
					) : (
						customReports.map((report) => {
							const isActive = pathname === report.href;
							return (
								<SidebarMenuItem key={report.id}>
									<SidebarMenuButton asChild isActive={isActive}>
										<Link href={report.href}>
											<span className="flex-1 truncate text-left">
												{report.title}
											</span>
										</Link>
									</SidebarMenuButton>
									<SidebarMenuAction
										aria-label="Delete report"
										onClick={(e) => handleDeleteReport(e, report.id)}
										showOnHover
										title="Delete report"
									>
										<Trash2 className="h-3.5 w-3.5" />
									</SidebarMenuAction>
								</SidebarMenuItem>
							);
						})
					)}
				</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>

			{/* Quick Tips / Help Section */}
			<SidebarGroup>
				<div className="border-border bg-muted/30 rounded-lg border p-3">
					<p className="mb-1 text-xs font-medium">💡 Pro Tip</p>
					<p className="text-muted-foreground text-xs leading-relaxed">
						Create custom reports with your own filters and metrics. Save time
						by building reports you check frequently.
					</p>
				</div>
			</SidebarGroup>
		</div>
	);
}

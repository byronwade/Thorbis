/**
 * Reports Sidebar Configuration
 *
 * Defines the sidebar navigation structure for the analytics/reports section.
 * Modeled after the AI sidebar with collapsible sections and custom reports.
 */

import {
	Activity,
	AlertTriangle,
	BarChart3,
	Bell,
	Briefcase,
	Building2,
	Calendar,
	Clock,
	CreditCard,
	DollarSign,
	Download,
	FileText,
	Gauge,
	LineChart,
	Mail,
	MessageSquare,
	Package,
	Phone,
	PieChart,
	Plus,
	Receipt,
	Settings,
	Shield,
	Sparkles,
	Star,
	Target,
	TrendingUp,
	Truck,
	UserCheck,
	Users,
	Wallet,
	Wrench,
} from "lucide-react";
import type { SidebarConfig } from "@/lib/layout/sidebar-types";

export type ReportCategory = {
	id: string;
	title: string;
	description: string;
	icon: React.ElementType;
	href: string;
	badge?: string;
	isNew?: boolean;
};

export type ReportSection = {
	id: string;
	title: string;
	icon: React.ElementType;
	reports: ReportCategory[];
	defaultOpen?: boolean;
};

// All available report sections
const REPORT_SECTIONS: ReportSection[] = [
	{
		id: "overview",
		title: "Overview",
		icon: BarChart3,
		defaultOpen: true,
		reports: [
			{
				id: "dashboard",
				title: "Analytics Dashboard",
				description: "Real-time KPIs and trends",
				icon: Gauge,
				href: "/dashboard/reports",
			},
			{
				id: "executive",
				title: "Executive Summary",
				description: "High-level business metrics",
				icon: TrendingUp,
				href: "/dashboard/reports/executive",
				badge: "PDF",
			},
		],
	},
	{
		id: "financial",
		title: "Financial",
		icon: DollarSign,
		defaultOpen: true,
		reports: [
			{
				id: "revenue",
				title: "Revenue Report",
				description: "Income and revenue trends",
				icon: DollarSign,
				href: "/dashboard/reports/financial",
			},
			{
				id: "profit-loss",
				title: "Profit & Loss",
				description: "P&L statement and margins",
				icon: PieChart,
				href: "/dashboard/reports/financial/profit-loss",
			},
			{
				id: "cash-flow",
				title: "Cash Flow",
				description: "Cash inflows and outflows",
				icon: Wallet,
				href: "/dashboard/reports/financial/cash-flow",
			},
			{
				id: "ar-aging",
				title: "AR Aging",
				description: "Outstanding receivables",
				icon: Receipt,
				href: "/dashboard/reports/financial/ar-aging",
			},
			{
				id: "expenses",
				title: "Expense Report",
				description: "Cost breakdown and analysis",
				icon: CreditCard,
				href: "/dashboard/reports/financial/expenses",
			},
		],
	},
	{
		id: "operations",
		title: "Operations",
		icon: Briefcase,
		reports: [
			{
				id: "jobs",
				title: "Job Performance",
				description: "Completion rates and efficiency",
				icon: Briefcase,
				href: "/dashboard/reports/jobs",
			},
			{
				id: "service-types",
				title: "Service Types",
				description: "Performance by service category",
				icon: Wrench,
				href: "/dashboard/reports/operational/service-types",
			},
			{
				id: "dispatch",
				title: "Dispatch Efficiency",
				description: "Route optimization metrics",
				icon: Truck,
				href: "/dashboard/reports/operational/dispatch",
			},
			{
				id: "equipment",
				title: "Equipment Analytics",
				description: "Utilization and maintenance",
				icon: Package,
				href: "/dashboard/reports/operational/equipment",
			},
		],
	},
	{
		id: "team",
		title: "Team Performance",
		icon: Users,
		reports: [
			{
				id: "leaderboard",
				title: "Team Leaderboard",
				description: "Rankings by revenue and jobs",
				icon: UserCheck,
				href: "/dashboard/reports/technicians",
			},
			{
				id: "productivity",
				title: "Productivity Report",
				description: "Utilization and efficiency",
				icon: Activity,
				href: "/dashboard/reports/technicians/productivity",
			},
			{
				id: "revenue-per-tech",
				title: "Revenue per Tech",
				description: "Individual revenue contribution",
				icon: DollarSign,
				href: "/dashboard/reports/technicians/revenue",
			},
			{
				id: "training",
				title: "Training & Certs",
				description: "Certifications and training",
				icon: Shield,
				href: "/dashboard/reports/technicians/training",
			},
		],
	},
	{
		id: "customers",
		title: "Customer Analytics",
		icon: Target,
		reports: [
			{
				id: "customer-analytics",
				title: "Customer Overview",
				description: "Retention and LTV analysis",
				icon: Target,
				href: "/dashboard/reports/customers",
			},
			{
				id: "acquisition",
				title: "Acquisition Report",
				description: "New customer trends",
				icon: TrendingUp,
				href: "/dashboard/reports/customers/acquisition",
			},
			{
				id: "churn",
				title: "Churn Analysis",
				description: "At-risk customers",
				icon: AlertTriangle,
				href: "/dashboard/reports/customers/churn",
			},
			{
				id: "segments",
				title: "Customer Segments",
				description: "Segment performance",
				icon: PieChart,
				href: "/dashboard/reports/customers/segments",
			},
		],
	},
	{
		id: "communications",
		title: "Communications",
		icon: MessageSquare,
		reports: [
			{
				id: "comm-overview",
				title: "Communication Stats",
				description: "All channels overview",
				icon: MessageSquare,
				href: "/dashboard/reports/communications",
			},
			{
				id: "email",
				title: "Email Analytics",
				description: "Open rates and engagement",
				icon: Mail,
				href: "/dashboard/reports/communications/email",
			},
			{
				id: "calls",
				title: "Call Analytics",
				description: "Call volume and duration",
				icon: Phone,
				href: "/dashboard/reports/communications/calls",
			},
		],
	},
	{
		id: "scheduling",
		title: "Scheduling",
		icon: Calendar,
		reports: [
			{
				id: "schedule-utilization",
				title: "Schedule Utilization",
				description: "Capacity and booking rates",
				icon: Calendar,
				href: "/dashboard/reports/scheduling/utilization",
			},
			{
				id: "first-time-fix",
				title: "First Time Fix Rate",
				description: "Resolution efficiency",
				icon: Target,
				href: "/dashboard/reports/scheduling/first-time-fix",
			},
			{
				id: "callbacks",
				title: "Callback Report",
				description: "Return visit analysis",
				icon: Clock,
				href: "/dashboard/reports/scheduling/callbacks",
			},
		],
	},
	{
		id: "ai",
		title: "AI & Insights",
		icon: Sparkles,
		reports: [
			{
				id: "ai-insights",
				title: "AI Insights",
				description: "AI-generated recommendations",
				icon: Sparkles,
				href: "/dashboard/reports/ai/insights",
				isNew: true,
			},
			{
				id: "predictions",
				title: "Predictive Analytics",
				description: "Forecasts and trends",
				icon: LineChart,
				href: "/dashboard/reports/ai/predictions",
				isNew: true,
			},
		],
	},
];

// Quick access reports (shown at top of sidebar)
const QUICK_ACCESS_REPORTS: ReportCategory[] = [
	{
		id: "dashboard",
		title: "Analytics Dashboard",
		description: "Real-time overview",
		icon: Gauge,
		href: "/dashboard/reports",
	},
	{
		id: "revenue",
		title: "Revenue Report",
		description: "Financial performance",
		icon: DollarSign,
		href: "/dashboard/reports/financial",
	},
	{
		id: "jobs",
		title: "Job Performance",
		description: "Operations metrics",
		icon: Briefcase,
		href: "/dashboard/reports/jobs",
	},
	{
		id: "leaderboard",
		title: "Team Leaderboard",
		description: "Top performers",
		icon: UserCheck,
		href: "/dashboard/reports/technicians",
	},
];

// Report categories for the builder
export const REPORT_BUILDER_CATEGORIES = [
	{
		id: "financial",
		label: "Financial",
		icon: DollarSign,
		color: "bg-emerald-500",
	},
	{
		id: "operations",
		label: "Operations",
		icon: Briefcase,
		color: "bg-blue-500",
	},
	{ id: "customers", label: "Customers", icon: Users, color: "bg-violet-500" },
	{ id: "team", label: "Team", icon: UserCheck, color: "bg-amber-500" },
];

// Available metrics for custom reports
export const AVAILABLE_METRICS = {
	financial: [
		{ id: "revenue", label: "Revenue", type: "currency" },
		{ id: "profit", label: "Profit", type: "currency" },
		{ id: "expenses", label: "Expenses", type: "currency" },
		{ id: "avg_ticket", label: "Average Ticket", type: "currency" },
		{ id: "collection_rate", label: "Collection Rate", type: "percentage" },
	],
	operations: [
		{ id: "jobs_completed", label: "Jobs Completed", type: "number" },
		{ id: "completion_rate", label: "Completion Rate", type: "percentage" },
		{ id: "avg_job_duration", label: "Avg Job Duration", type: "duration" },
		{ id: "first_time_fix", label: "First Time Fix Rate", type: "percentage" },
		{ id: "callbacks", label: "Callbacks", type: "number" },
	],
	customers: [
		{ id: "total_customers", label: "Total Customers", type: "number" },
		{ id: "new_customers", label: "New Customers", type: "number" },
		{ id: "retention_rate", label: "Retention Rate", type: "percentage" },
		{ id: "avg_ltv", label: "Avg Lifetime Value", type: "currency" },
		{ id: "churn_rate", label: "Churn Rate", type: "percentage" },
	],
	team: [
		{ id: "tech_utilization", label: "Utilization Rate", type: "percentage" },
		{ id: "revenue_per_tech", label: "Revenue per Tech", type: "currency" },
		{ id: "jobs_per_tech", label: "Jobs per Tech", type: "number" },
		{ id: "avg_rating", label: "Avg Customer Rating", type: "rating" },
		{ id: "on_time_rate", label: "On-Time Rate", type: "percentage" },
	],
};

// Chart types available in builder
export const CHART_TYPES = [
	{
		id: "line",
		label: "Line Chart",
		icon: LineChart,
		description: "Best for trends over time",
	},
	{
		id: "bar",
		label: "Bar Chart",
		icon: BarChart3,
		description: "Best for comparisons",
	},
	{
		id: "pie",
		label: "Pie Chart",
		icon: PieChart,
		description: "Best for distributions",
	},
	{
		id: "area",
		label: "Area Chart",
		icon: TrendingUp,
		description: "Best for cumulative data",
	},
];

// Time range presets
export const TIME_RANGE_PRESETS = [
	{ id: "today", label: "Today", days: 1 },
	{ id: "yesterday", label: "Yesterday", days: 1 },
	{ id: "7d", label: "Last 7 Days", days: 7 },
	{ id: "14d", label: "Last 2 Weeks", days: 14 },
	{ id: "30d", label: "Last 30 Days", days: 30 },
	{ id: "90d", label: "Last 90 Days", days: 90 },
	{ id: "ytd", label: "Year to Date", days: 0 }, // Special handling
	{ id: "1y", label: "Last 12 Months", days: 365 },
	{ id: "custom", label: "Custom Range", days: 0 },
];

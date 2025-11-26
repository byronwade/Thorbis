import {
	Building2,
	DollarSign,
	TrendingUp,
	Users,
	Activity,
	AlertCircle,
} from "lucide-react";
import { SectionLayout } from "@/components/layout/section-layout";

/**
 * Admin Dashboard - Today Page
 *
 * Shows platform overview with key metrics.
 * No sidebar on this page - full width content.
 */
export default function AdminDashboardPage() {
	return (
		<SectionLayout
			title="Today"
			subtitle="Platform Overview"
			showSidebar={false}
		>
			<div className="mx-auto max-w-7xl p-6">
				{/* Page Header */}
				<div className="mb-8">
					<h1 className="text-2xl font-bold tracking-tight">
						Welcome back, Admin
					</h1>
					<p className="text-muted-foreground">
						Here's what's happening on the Stratos platform today.
					</p>
				</div>

				{/* Stats Grid */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
					<StatsCard
						title="Total Companies"
						value="--"
						change="+-- this month"
						icon={Building2}
					/>
					<StatsCard
						title="Active Users"
						value="--"
						change="+-- this week"
						icon={Users}
					/>
					<StatsCard
						title="Monthly Revenue"
						value="$--"
						change="+--% from last month"
						icon={DollarSign}
					/>
					<StatsCard
						title="Platform Health"
						value="--"
						change="All systems operational"
						icon={Activity}
						positive
					/>
				</div>

				{/* Quick Actions */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
					<QuickActionCard
						title="Recent Signups"
						description="-- new companies this week"
						href="/dashboard/work/companies"
						icon={Building2}
					/>
					<QuickActionCard
						title="Support Tickets"
						description="-- open tickets"
						href="/dashboard/work/support"
						icon={AlertCircle}
					/>
					<QuickActionCard
						title="Revenue Growth"
						description="View detailed analytics"
						href="/dashboard/analytics"
						icon={TrendingUp}
					/>
				</div>

				{/* Recent Activity */}
				<div className="rounded-lg border bg-card">
					<div className="p-6 border-b">
						<h2 className="text-lg font-semibold">Recent Activity</h2>
						<p className="text-sm text-muted-foreground">
							Latest platform events
						</p>
					</div>
					<div className="p-6">
						<div className="text-center py-8 text-muted-foreground">
							<Activity className="size-12 mx-auto mb-4 opacity-20" />
							<p>Activity feed coming soon</p>
						</div>
					</div>
				</div>
			</div>
		</SectionLayout>
	);
}

function StatsCard({
	title,
	value,
	change,
	icon: Icon,
	positive,
}: {
	title: string;
	value: string;
	change: string;
	icon: React.ComponentType<{ className?: string }>;
	positive?: boolean;
}) {
	return (
		<div className="rounded-lg border bg-card p-6">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium text-muted-foreground">
					{title}
				</span>
				<Icon className="size-4 text-muted-foreground" />
			</div>
			<div className="mt-2">
				<span className="text-2xl font-bold">{value}</span>
			</div>
			<p
				className={`text-xs mt-1 ${positive ? "text-green-600" : "text-muted-foreground"}`}
			>
				{change}
			</p>
		</div>
	);
}

function QuickActionCard({
	title,
	description,
	href,
	icon: Icon,
}: {
	title: string;
	description: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
}) {
	return (
		<a
			href={href}
			className="flex items-start gap-4 rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
		>
			<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
				<Icon className="size-5 text-primary" />
			</div>
			<div>
				<h3 className="font-medium">{title}</h3>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
		</a>
	);
}

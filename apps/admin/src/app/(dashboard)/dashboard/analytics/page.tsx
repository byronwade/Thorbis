import { BarChart, Building2, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";

/**
 * Analytics Overview Page
 */
export default function AnalyticsPage() {
	return (
		<div className="p-6">
			<div className="mb-8">
				<h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
				<p className="text-muted-foreground">
					Platform and company performance metrics
				</p>
			</div>

			{/* Platform Stats */}
			<div className="grid gap-4 md:grid-cols-4 mb-8">
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
					title="API Requests"
					value="--"
					change="Last 24 hours"
					icon={Zap}
				/>
				<StatsCard
					title="Uptime"
					value="--.-%"
					change="Last 30 days"
					icon={TrendingUp}
					positive
				/>
			</div>

			{/* Quick Links */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
				<SectionCard
					title="Usage Metrics"
					description="API calls, storage, and feature usage"
					href="/dashboard/analytics/usage"
					icon={BarChart}
				/>
				<SectionCard
					title="Performance"
					description="System health and response times"
					href="/dashboard/analytics/performance"
					icon={Zap}
				/>
				<SectionCard
					title="Company Analytics"
					description="Individual company performance"
					href="/dashboard/analytics/companies"
					icon={Building2}
				/>
				<SectionCard
					title="Growth Metrics"
					description="Revenue and user growth trends"
					href="/dashboard/analytics/growth"
					icon={TrendingUp}
				/>
				<SectionCard
					title="Retention"
					description="Customer retention and churn"
					href="/dashboard/analytics/retention"
					icon={Users}
				/>
			</div>

			{/* Charts Placeholder */}
			<div className="grid gap-6 md:grid-cols-2">
				<div className="rounded-lg border bg-card p-6">
					<h3 className="font-semibold mb-4">User Growth</h3>
					<div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
						<p className="text-muted-foreground">Chart coming soon</p>
					</div>
				</div>
				<div className="rounded-lg border bg-card p-6">
					<h3 className="font-semibold mb-4">Revenue Trend</h3>
					<div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
						<p className="text-muted-foreground">Chart coming soon</p>
					</div>
				</div>
			</div>
		</div>
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
		<div className="rounded-lg border bg-card p-4">
			<div className="flex items-center justify-between mb-2">
				<span className="text-sm text-muted-foreground">{title}</span>
				<Icon className="size-4 text-muted-foreground" />
			</div>
			<p className="text-2xl font-bold">{value}</p>
			<p
				className={`text-xs ${positive ? "text-green-600" : "text-muted-foreground"}`}
			>
				{change}
			</p>
		</div>
	);
}

function SectionCard({
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
		<Link
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
		</Link>
	);
}

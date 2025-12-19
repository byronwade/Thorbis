import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, Mail, MessageSquare, Phone, PhoneIncoming, Building2, Users, Clock, TrendingUp } from "lucide-react";
import { getPlatformCommunicationStats } from "@/actions/communications";

function StatCard({
	title,
	value,
	change,
	icon: Icon,
	description,
}: {
	title: string;
	value: string | number;
	change?: number;
	icon: React.ElementType;
	description?: string;
}) {
	const isPositive = change && change > 0;
	const isNegative = change && change < 0;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Icon className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</div>
				{change !== undefined && (
					<div className="flex items-center text-xs text-muted-foreground">
						{isPositive && <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />}
						{isNegative && <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />}
						<span className={isPositive ? "text-green-500" : isNegative ? "text-red-500" : ""}>
							{Math.abs(change)}%
						</span>
						<span className="ml-1">from last month</span>
					</div>
				)}
				{description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
			</CardContent>
		</Card>
	);
}

function ChannelCard({
	title,
	total,
	unread,
	icon: Icon,
	color,
}: {
	title: string;
	total: number;
	unread: number;
	icon: React.ElementType;
	color: string;
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<div className="flex items-center gap-2">
					<div className={`rounded-md p-2 ${color}`}>
						<Icon className="h-4 w-4 text-white" />
					</div>
					<CardTitle className="text-sm font-medium">{title}</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{total.toLocaleString()}</div>
				<div className="flex items-center justify-between mt-2">
					<span className="text-xs text-muted-foreground">{unread} unread</span>
				</div>
			</CardContent>
		</Card>
	);
}

/**
 * Communication Statistics Page
 *
 * Shows platform-wide communication metrics and analytics
 */
export default async function CommunicationStatsPage() {
	// Fetch real stats
	const result = await getPlatformCommunicationStats();
	const stats = result.data || {
		totalCommunications: 0,
		totalCommunicationsChange: 0,
		activeCompanies: 0,
		avgResponseTimeHours: 0,
		totalVolumeLast30Days: 0,
		byChannel: {
			email: { total: 0, unread: 0 },
			sms: { total: 0, unread: 0 },
			call: { total: 0, unread: 0 },
			voicemail: { total: 0, unread: 0 },
		},
		topCompanies: [],
		recentActivity: [],
	};

	return (
		<div className="flex flex-col gap-6 p-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Communication Statistics</h1>
				<p className="text-muted-foreground">Platform-wide communication metrics and analytics</p>
			</div>

			{/* Overview Stats */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Communications"
					value={stats.totalCommunications}
					change={stats.totalCommunicationsChange}
					icon={TrendingUp}
				/>
				<StatCard
					title="Active Companies"
					value={stats.activeCompanies}
					icon={Building2}
				/>
				<StatCard
					title="Avg Response Time"
					value={`${stats.avgResponseTimeHours}h`}
					icon={Clock}
					description="Across all channels"
				/>
				<StatCard
					title="Volume (30 days)"
					value={stats.totalVolumeLast30Days}
					icon={Users}
				/>
			</div>

			{/* Channel Breakdown */}
			<div>
				<h2 className="text-lg font-semibold mb-4">By Channel</h2>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<ChannelCard
						title="Email"
						total={stats.byChannel.email.total}
						unread={stats.byChannel.email.unread}
						icon={Mail}
						color="bg-blue-500"
					/>
					<ChannelCard
						title="SMS"
						total={stats.byChannel.sms.total}
						unread={stats.byChannel.sms.unread}
						icon={MessageSquare}
						color="bg-green-500"
					/>
					<ChannelCard
						title="Calls"
						total={stats.byChannel.call.total}
						unread={stats.byChannel.call.unread}
						icon={Phone}
						color="bg-purple-500"
					/>
					<ChannelCard
						title="Voicemail"
						total={stats.byChannel.voicemail.total}
						unread={stats.byChannel.voicemail.unread}
						icon={PhoneIncoming}
						color="bg-orange-500"
					/>
				</div>
			</div>

			{/* Top Companies and Activity */}
			<div className="grid gap-4 lg:grid-cols-2">
				{/* Top Companies */}
				<Card>
					<CardHeader>
						<CardTitle>Top Companies by Volume</CardTitle>
						<CardDescription>Companies with highest communication volume</CardDescription>
					</CardHeader>
					<CardContent>
						{stats.topCompanies.length > 0 ? (
							<div className="space-y-4">
								{stats.topCompanies.map((company, index) => (
									<div key={company.id} className="flex items-center">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
											{index + 1}
										</div>
										<div className="ml-4 flex-1 space-y-1">
											<p className="text-sm font-medium leading-none">{company.name}</p>
											<p className="text-sm text-muted-foreground">{company.communications.toLocaleString()} communications</p>
										</div>
										<div className="text-sm text-muted-foreground">{company.percentage}%</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-sm text-muted-foreground text-center py-8">No communication data available</p>
						)}
					</CardContent>
				</Card>

				{/* Recent Activity Table */}
				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
						<CardDescription>Daily communication volume by channel</CardDescription>
					</CardHeader>
					<CardContent>
						{stats.recentActivity.length > 0 ? (
							<div className="space-y-2">
								<div className="grid grid-cols-4 text-xs font-medium text-muted-foreground">
									<div>Date</div>
									<div className="text-right">Email</div>
									<div className="text-right">SMS</div>
									<div className="text-right">Calls</div>
								</div>
								{stats.recentActivity.map((day) => (
									<div key={day.date} className="grid grid-cols-4 text-sm">
										<div>{day.date}</div>
										<div className="text-right">{day.emails}</div>
										<div className="text-right">{day.sms}</div>
										<div className="text-right">{day.calls}</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

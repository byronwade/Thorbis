import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, Mail, MessageSquare, Phone, PhoneIncoming, Building2, Users, Clock, TrendingUp } from "lucide-react";

// Mock stats data - replace with real data fetching
const platformStats = {
	totalCommunications: 15420,
	totalCommunicationsChange: 12.5,
	activeCompanies: 156,
	activeCompaniesChange: 8.2,
	avgResponseTime: 2.4, // hours
	avgResponseTimeChange: -15.3,
	totalVolumeLast30Days: 45680,
	totalVolumeChange: 18.7,
	byChannel: {
		email: { total: 8250, unread: 124, change: 15.2 },
		sms: { total: 4830, unread: 89, change: 22.1 },
		calls: { total: 1890, unread: 45, change: 8.7 },
		voicemail: { total: 450, unread: 23, change: -5.2 },
	},
	topCompanies: [
		{ name: "Acme Plumbing Co.", communications: 2340, percentage: 15.2 },
		{ name: "Elite HVAC Services", communications: 1890, percentage: 12.3 },
		{ name: "Quick Fix Electric", communications: 1650, percentage: 10.7 },
		{ name: "Johnson & Sons Roofing", communications: 1420, percentage: 9.2 },
		{ name: "Metro Landscaping", communications: 1180, percentage: 7.7 },
	],
	recentActivity: [
		{ date: "Nov 11", emails: 450, sms: 280, calls: 95 },
		{ date: "Nov 10", emails: 420, sms: 265, calls: 88 },
		{ date: "Nov 9", emails: 380, sms: 290, calls: 102 },
		{ date: "Nov 8", emails: 410, sms: 275, calls: 79 },
		{ date: "Nov 7", emails: 395, sms: 260, calls: 85 },
		{ date: "Nov 6", emails: 360, sms: 245, calls: 92 },
		{ date: "Nov 5", emails: 340, sms: 230, calls: 78 },
	],
};

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
	change,
	icon: Icon,
	color,
}: {
	title: string;
	total: number;
	unread: number;
	change: number;
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
					<span className={`text-xs ${change > 0 ? "text-green-500" : "text-red-500"}`}>
						{change > 0 ? "+" : ""}
						{change}%
					</span>
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
export default function CommunicationStatsPage() {
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
					value={platformStats.totalCommunications}
					change={platformStats.totalCommunicationsChange}
					icon={TrendingUp}
				/>
				<StatCard
					title="Active Companies"
					value={platformStats.activeCompanies}
					change={platformStats.activeCompaniesChange}
					icon={Building2}
				/>
				<StatCard
					title="Avg Response Time"
					value={`${platformStats.avgResponseTime}h`}
					change={platformStats.avgResponseTimeChange}
					icon={Clock}
					description="Across all channels"
				/>
				<StatCard
					title="Volume (30 days)"
					value={platformStats.totalVolumeLast30Days}
					change={platformStats.totalVolumeChange}
					icon={Users}
				/>
			</div>

			{/* Channel Breakdown */}
			<div>
				<h2 className="text-lg font-semibold mb-4">By Channel</h2>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<ChannelCard
						title="Email"
						total={platformStats.byChannel.email.total}
						unread={platformStats.byChannel.email.unread}
						change={platformStats.byChannel.email.change}
						icon={Mail}
						color="bg-blue-500"
					/>
					<ChannelCard
						title="SMS"
						total={platformStats.byChannel.sms.total}
						unread={platformStats.byChannel.sms.unread}
						change={platformStats.byChannel.sms.change}
						icon={MessageSquare}
						color="bg-green-500"
					/>
					<ChannelCard
						title="Calls"
						total={platformStats.byChannel.calls.total}
						unread={platformStats.byChannel.calls.unread}
						change={platformStats.byChannel.calls.change}
						icon={Phone}
						color="bg-purple-500"
					/>
					<ChannelCard
						title="Voicemail"
						total={platformStats.byChannel.voicemail.total}
						unread={platformStats.byChannel.voicemail.unread}
						change={platformStats.byChannel.voicemail.change}
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
						<div className="space-y-4">
							{platformStats.topCompanies.map((company, index) => (
								<div key={company.name} className="flex items-center">
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
					</CardContent>
				</Card>

				{/* Recent Activity Table */}
				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
						<CardDescription>Daily communication volume by channel</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="grid grid-cols-4 text-xs font-medium text-muted-foreground">
								<div>Date</div>
								<div className="text-right">Email</div>
								<div className="text-right">SMS</div>
								<div className="text-right">Calls</div>
							</div>
							{platformStats.recentActivity.map((day) => (
								<div key={day.date} className="grid grid-cols-4 text-sm">
									<div>{day.date}</div>
									<div className="text-right">{day.emails}</div>
									<div className="text-right">{day.sms}</div>
									<div className="text-right">{day.calls}</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

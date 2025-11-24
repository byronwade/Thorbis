import { getCommunicationStatsAction } from "@/actions/communication-stats-actions";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import {
	getRecentCommunications,
	getActiveThreads,
	type RecentCommunication,
	type ActiveThread,
} from "@/lib/queries/analytics";
import {
	MainChartCard,
	MetricCard,
	SmallChartCard,
} from "@/components/analytics/analytics-dashboard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, MessageSquare, Phone, Wifi } from "lucide-react";

function formatNumber(num: number): string {
	if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
	if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
	return num.toString();
}

function formatDuration(minutes: number): string {
	if (minutes < 1) return "< 1m";
	if (minutes < 60) return `${Math.round(minutes)}m`;
	const hours = Math.floor(minutes / 60);
	const mins = Math.round(minutes % 60);
	return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function formatSeconds(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = Math.round(seconds % 60);
	return `${mins}m ${secs}s`;
}

export async function AnalyticsData() {
	const companyId = await getActiveCompanyId();

	if (!companyId) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<p className="text-muted-foreground">Please select a company to view analytics</p>
			</div>
		);
	}

	// Fetch all data in parallel
	const [result, recentComms, activeThreads] = await Promise.all([
		getCommunicationStatsAction(90),
		getRecentCommunications(companyId, 5),
		getActiveThreads(companyId, 5),
	]);

	if (!result.success || !result.data) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<p className="text-muted-foreground">Unable to load analytics data</p>
			</div>
		);
	}

	const data = result.data;

	// Transform daily stats to chart format
	const chartData = data.dailyStats.map((d) => ({
		date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
		value: d.emails + d.sms + d.calls,
	}));

	// Inbound/Outbound trend data
	const inboundOutboundData = data.inboundOutboundTrend.map((d) => ({
		date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
		value: d.Inbound,
		value2: d.Outbound,
	}));

	// Response time data
	const responseData = data.responseTimeData.map((d) => ({
		date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
		value: Math.round(d.avgResponseTime),
		value2: Math.round(d.avgResponseTime),
	}));

	return (
		<div className="space-y-6">
			<header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="space-y-2">
					<div className="flex items-center gap-3">
						<h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
							Communications Analytics
						</h1>
						<Badge className="text-primary gap-1" variant="outline">
							<Wifi className="size-3.5" />
							Live
						</Badge>
					</div>
					<p className="text-muted-foreground text-sm md:text-base">
						Insights into your team's communication performance.
					</p>
				</div>
				<div className="text-muted-foreground flex items-center gap-2 text-xs md:text-sm">
					<span>Last updated</span>
					<Separator className="h-4" orientation="vertical" />
					<span>Just now</span>
				</div>
			</header>

			{/* Main Chart Section */}
			<div className="grid grid-cols-1">
				<MainChartCard title="Total Communications" data={chartData} />
			</div>

			{/* Secondary Charts Section */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<SmallChartCard
					title="Inbound vs Outbound"
					data={inboundOutboundData}
					type="line"
					dataKey="value"
					category="comms"
					color="#8b5cf6"
				/>
				<SmallChartCard
					title="Response Times"
					data={responseData}
					type="bar"
					dataKey="value2"
					category="response"
					color="#f43f5e"
				/>
			</div>

			{/* Metrics Grid Section */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
				<MetricCard
					label="Total Sent"
					value={formatNumber(data.totalOutbound)}
					change={data.totalOutbound > 0 ? 0 : 0}
					verified={true}
				/>
				<MetricCard
					label="Total Received"
					value={formatNumber(data.totalInbound)}
					change={0}
					changeLabel="inbound messages"
				/>
				<MetricCard
					label="Response Rate"
					value={`${Math.round(data.responseRate)}%`}
					change={data.responseRate >= 80 ? 5 : -5}
					changeLabel={data.responseRate >= 80 ? "good" : "needs improvement"}
				/>
				<MetricCard
					label="Avg Response Time"
					value={formatDuration(data.avgResponseTime)}
					change={data.avgResponseTime <= 30 ? 10 : -10}
					changeLabel={data.avgResponseTime <= 30 ? "fast" : "could be faster"}
				/>
				<MetricCard
					label="Unread Messages"
					value={data.totalUnread.toString()}
					change={data.totalUnread > 10 ? -10 : 0}
					changeLabel="need attention"
				/>

				<MetricCard
					label="Total Emails"
					value={formatNumber(data.totalEmails)}
					change={0}
					changeLabel="email threads"
				/>
				<MetricCard
					label="Total SMS"
					value={formatNumber(data.totalSms)}
					change={0}
					changeLabel="text messages"
				/>
				<MetricCard
					label="Avg Call Duration"
					value={formatSeconds(data.avgCallDuration)}
					change={0}
					changeLabel="per call"
				/>
				<MetricCard
					label="Total Calls"
					value={formatNumber(data.totalCalls)}
					change={0}
					changeLabel="phone calls"
				/>
				<MetricCard
					label="Read Rate"
					value={`${Math.round(data.readRate)}%`}
					subValue=""
					change={data.readRate >= 90 ? 5 : 0}
					changeLabel="messages read"
				/>
			</div>

			{/* Recent Communications & Active Threads Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<RecentCommunicationsList communications={recentComms} />
				<ActiveThreadsList threads={activeThreads} />
			</div>
		</div>
	);
}

function RecentCommunicationsList({ communications }: { communications: RecentCommunication[] }) {
	// Fall back to sample data if no real communications
	const displayComms = communications.length > 0 ? communications : [
		{ id: "1", type: "email" as const, direction: "inbound" as const, sender: "No recent communications", subject: "Start sending messages to see them here", time: "", status: "info" },
	];

	return (
		<div className="bg-card/50 border-border/50 backdrop-blur-sm rounded-xl border overflow-hidden">
			<div className="p-6 border-b border-border/50 flex items-center justify-between">
				<h3 className="font-semibold text-lg">Recent Communications</h3>
				<Badge variant="secondary" className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-0">
					{communications.length > 0 ? "Live Feed" : "No Data"}
				</Badge>
			</div>
			<div className="p-0">
				<div className="divide-y divide-border/50">
					{displayComms.map((comm) => (
						<div key={comm.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
									comm.type === 'email' ? 'bg-blue-500/10 text-blue-500' :
									comm.type === 'phone' ? 'bg-green-500/10 text-green-500' :
									'bg-orange-500/10 text-orange-500'
								}`}>
									{comm.type === 'email' ? <Mail className="h-4 w-4" /> :
									 comm.type === 'phone' ? <Phone className="h-4 w-4" /> :
									 <MessageSquare className="h-4 w-4" />}
								</div>
								<div className="space-y-0.5">
									<p className="text-sm font-medium">{comm.sender}</p>
									<p className="text-xs text-muted-foreground">{comm.subject}</p>
								</div>
							</div>
							<div className="text-right">
								{comm.status && comm.status !== "info" && (
									<Badge variant="outline" className="text-[10px] h-5 px-1.5 uppercase tracking-wider mb-1">
										{comm.status}
									</Badge>
								)}
								{comm.time && <p className="text-xs text-muted-foreground">{comm.time}</p>}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function ActiveThreadsList({ threads }: { threads: ActiveThread[] }) {
	// Fall back to sample data if no threads
	const displayThreads = threads.length > 0 ? threads : [
		{ id: "1", customer: "No active threads", lastMessage: "Start conversations to see them here", time: "", unread: 0 },
	];

	const unreadCount = threads.filter(t => t.unread > 0).length;

	return (
		<div className="bg-card/50 border-border/50 backdrop-blur-sm rounded-xl border overflow-hidden">
			<div className="p-6 border-b border-border/50 flex items-center justify-between">
				<h3 className="font-semibold text-lg">Active Threads</h3>
				<Badge variant="secondary" className="bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 border-0">
					{threads.length > 0 ? `${unreadCount} Unread` : "No Data"}
				</Badge>
			</div>
			<div className="p-0">
				<div className="divide-y divide-border/50">
					{displayThreads.map((thread) => (
						<div key={thread.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
									{thread.customer.split(" ").map(n => n[0]).join("").substring(0, 2)}
								</div>
								<div className="space-y-0.5">
									<p className="text-sm font-medium">{thread.customer}</p>
									<p className="text-xs text-muted-foreground truncate max-w-[200px]">{thread.lastMessage}</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								{thread.unread > 0 && (
									<div className="h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
										{thread.unread}
									</div>
								)}
								{thread.time && <p className="text-xs text-muted-foreground">{thread.time}</p>}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

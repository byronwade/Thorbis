"use client";

import { Mail, MessageSquare, Phone, ArrowRight, Clock, TrendingUp, Activity, Zap, CheckCircle2, BarChart3, Inbox, Calendar, Gauge, Timer, MessageCircle } from "lucide-react";
import { LazyAreaChart, LazyBarChart } from "@/components/lazy/chart";
import { ChartContainer } from "@/components/ui/chart";
import { Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "@/components/lazy/chart";
import Link from "next/link";
import { useMemo } from "react";

type CommunicationStatsData = {
	totalEmails: number;
	totalSms: number;
	totalCalls: number;
	unreadEmails: number;
	unreadSms: number;
	totalUnread: number;
	emailsToday: number;
	smsToday: number;
	callsToday: number;
	emailsInbound: number;
	emailsOutbound: number;
	smsInbound: number;
	smsOutbound: number;
	callsInbound: number;
	callsOutbound: number;
	dailyStats: Array<{
		date: string;
		emails: number;
		sms: number;
		calls: number;
	}>;
	channelDistribution: {
		email: number;
		sms: number;
		calls: number;
	};
	avgResponseTime: number;
	responseTimeData: Array<{
		date: string;
		avgResponseTime: number;
	}>;
	hourlyStats: Array<{
		hour: number;
		Emails: number;
		SMS: number;
		Calls: number;
	}>;
	directionData: Array<{
		name: string;
		Emails: number;
		SMS: number;
		Calls: number;
	}>;
	weeklyStats: Array<{
		week: string;
		Emails: number;
		SMS: number;
		Calls: number;
	}>;
	totalInbound: number;
	totalOutbound: number;
	readRate: number;
	peakHour: number;
	avgPerDay: number;
	responseRate: number;
	dayOfWeekStats: Array<{
		day: string;
		Emails: number;
		SMS: number;
		Calls: number;
	}>;
	unreadTrendData: Array<{
		date: string;
		"Unread Emails": number;
		"Unread SMS": number;
	}>;
	avgEmailResponseTime: number;
	avgSmsResponseTime: number;
	inboundOutboundTrend: Array<{
		date: string;
		Inbound: number;
		Outbound: number;
	}>;
	busiestDay: string;
	efficiencyScore: number;
	totalCallDuration: number;
	avgCallDuration: number;
};

type CommunicationOverviewReportProps = {
	stats: CommunicationStatsData;
};

export function CommunicationOverviewReport({ stats }: CommunicationOverviewReportProps) {
	// Color definitions matching the Vercel style
	const emailColor = "hsl(208, 100%, 66%)";
	const smsColor = "hsl(39, 100%, 57%)";
	const callColor = "hsl(358, 75%, 59%)";

	// Format daily stats for chart
	const chartData = stats.dailyStats.map((day) => ({
		date: new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
		Emails: day.emails,
		SMS: day.sms,
		Calls: day.calls,
	}));

	const channelData = [
		{ name: "Email", value: stats.channelDistribution.email, fill: emailColor },
		{ name: "SMS", value: stats.channelDistribution.sms, fill: smsColor },
		{ name: "Calls", value: stats.channelDistribution.calls, fill: callColor },
	];

	// Generate unique IDs for gradients
	const chartIds = useMemo(() => 
		Array.from({ length: 15 }, () => `chart-${Math.random().toString(36).substr(2, 9)}`),
		[]
	);

	// Format response time data
	const responseTimeChartData = stats.responseTimeData.map((day) => ({
		date: new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
		"Response Time": Math.round(day.avgResponseTime),
	}));

	// Format hourly data
	const hourlyChartData = stats.hourlyStats.map((hour) => ({
		hour: `${hour.hour}:00`,
		Emails: hour.Emails,
		SMS: hour.SMS,
		Calls: hour.Calls,
	}));

	// Format unread trend data
	const unreadTrendChartData = stats.unreadTrendData.map((day) => ({
		date: new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
		"Unread Emails": day["Unread Emails"],
		"Unread SMS": day["Unread SMS"],
	}));

	// Format inbound/outbound trend
	const inboundOutboundChartData = stats.inboundOutboundTrend.map((day) => ({
		date: new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
		Inbound: day.Inbound,
		Outbound: day.Outbound,
	}));

	return (
		<div className="flex w-full flex-col gap-4 p-4 md:p-6">
			<div>
				<h1 className="text-2xl md:text-3xl font-bold tracking-tight">Communication Dashboard</h1>
				<p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
					Overview of all communication channels and activity
				</p>
			</div>

			{/* All Charts Section - Grouped Together */}
			<div className="space-y-4">
				<h2 className="text-lg md:text-xl font-semibold">Charts & Analytics</h2>

				{/* Main Charts Grid - Vercel Style */}
			<div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
				{/* Daily Activity Chart */}
				<div className="bg-card border border-border relative w-full rounded-[10px] p-3 pb-2 group/chart h-[240px] min-h-[240px] shadow-sm">
					{/* Clickable Header */}
					<div className="-mx-3 -mt-3 p-1 pb-0 pr-0">
						<Link
							href="/dashboard/communication?report=time-series"
							className="link flex h-10 flex-row items-center px-[11.5px] pb-0.5 font-medium text-foreground group justify-between gap-x-2 no-underline hover:bg-accent/50 rounded transition-colors"
						>
							<div className="flex flex-col gap-y-0 leading-4">
								<span>Daily Activity</span>
							</div>
							<div className="rounded-sm p-1 transition-colors duration-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-800">
								<ArrowRight className="h-4 w-4" />
							</div>
						</Link>
					</div>

					{/* Chart Container */}
					<div className="-mt-0.5 h-[190px]">
						<ChartContainer
							config={{
								Emails: { label: "Emails", color: emailColor },
								SMS: { label: "SMS", color: smsColor },
								Calls: { label: "Calls", color: callColor },
							}}
							className="h-full w-full"
						>
							<LazyAreaChart
								data={chartData}
								margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
							>
								<defs>
									<linearGradient id={`${chartIds[0]}-emails`} x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor={emailColor} stopOpacity={0.6} />
										<stop offset="100%" stopColor={emailColor} stopOpacity={0.15} />
									</linearGradient>
									<linearGradient id={`${chartIds[0]}-sms`} x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor={smsColor} stopOpacity={0.6} />
										<stop offset="100%" stopColor={smsColor} stopOpacity={0.15} />
									</linearGradient>
									<linearGradient id={`${chartIds[0]}-calls`} x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor={callColor} stopOpacity={0.6} />
										<stop offset="100%" stopColor={callColor} stopOpacity={0.15} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
								<XAxis
									dataKey="date"
									tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
									axisLine={{ stroke: "hsl(var(--border))" }}
								/>
								<YAxis
									tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
									axisLine={{ stroke: "hsl(var(--border))" }}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--background))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "6px",
									}}
								/>
								<Legend
									wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }}
									iconType="circle"
									iconSize={6}
								/>
								<Area
									type="monotone"
									dataKey="Emails"
									stroke={emailColor}
									strokeWidth={1}
									fill={`url(#${chartIds[0]}-emails)`}
									fillOpacity={1}
								/>
								<Area
									type="monotone"
									dataKey="SMS"
									stroke={smsColor}
									strokeWidth={1}
									fill={`url(#${chartIds[0]}-sms)`}
									fillOpacity={1}
								/>
								<Area
									type="monotone"
									dataKey="Calls"
									stroke={callColor}
									strokeWidth={1}
									fill={`url(#${chartIds[0]}-calls)`}
									fillOpacity={1}
								/>
							</LazyAreaChart>
						</ChartContainer>
					</div>
				</div>

				{/* Channel Distribution */}
				<div className="bg-card border border-border relative w-full rounded-[10px] p-3 pb-2 group/chart h-[240px] min-h-[240px] shadow-sm">
					{/* Clickable Header */}
					<div className="-mx-3 -mt-3 p-1 pb-0 pr-0">
						<Link
							href="/dashboard/communication?report=distribution"
							className="link flex h-10 flex-row items-center px-[11.5px] pb-0.5 font-medium text-foreground group justify-between gap-x-2 no-underline hover:bg-accent/50 rounded transition-colors"
						>
							<div className="flex flex-col gap-y-0 leading-4">
								<span>Channel Distribution</span>
							</div>
							<div className="rounded-sm p-1 transition-colors duration-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-800">
								<ArrowRight className="h-4 w-4" />
							</div>
						</Link>
					</div>

					{/* Chart Container */}
					<div className="-mt-0.5 h-[190px]">
						<ChartContainer
							config={{
								value: { label: "Count", color: emailColor },
							}}
							className="h-full w-full"
						>
							<LazyBarChart
								data={channelData}
								margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
							>
								<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
								<XAxis
									dataKey="name"
									tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
									axisLine={{ stroke: "hsl(var(--border))" }}
								/>
								<YAxis
									tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
									axisLine={{ stroke: "hsl(var(--border))" }}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--background))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "6px",
									}}
								/>
								<Bar dataKey="value" radius={[4, 4, 0, 0]}>
									{channelData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.fill} />
									))}
								</Bar>
							</LazyBarChart>
						</ChartContainer>
					</div>
				</div>
			</div>

			{/* Additional Stats Grid - Vercel Style */}
			<div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{/* Email Stats */}
				<div className="bg-card border border-border relative w-full rounded-[10px] p-3 pb-2 group/chart h-[240px] min-h-[240px] shadow-sm">
					<div className="-mx-3 -mt-3 p-1 pb-0 pr-0">
						<Link
							href="/dashboard/communication?report=email"
							className="link flex h-10 flex-row items-center px-[11.5px] pb-0.5 font-medium text-foreground group justify-between gap-x-2 no-underline hover:bg-accent/50 rounded transition-colors"
						>
							<div className="flex items-center gap-2">
								<Mail className="h-4 w-4" />
								<span>Email Analytics</span>
							</div>
							<div className="rounded-sm p-1 transition-colors duration-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-800">
								<ArrowRight className="h-4 w-4" />
							</div>
						</Link>
					</div>
					<div className="mt-2 space-y-1">
						<div className="text-2xl font-bold">{stats.totalEmails.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">
							{stats.emailsInbound} inbound, {stats.emailsOutbound} outbound
						</p>
						<p className="text-xs text-muted-foreground">
							{stats.unreadEmails} unread
						</p>
					</div>
				</div>

				{/* SMS Stats */}
				<div className="bg-card border border-border relative w-full rounded-[10px] p-3 pb-2 group/chart h-[240px] min-h-[240px] shadow-sm">
					<div className="-mx-3 -mt-3 p-1 pb-0 pr-0">
						<Link
							href="/dashboard/communication?report=sms"
							className="link flex h-10 flex-row items-center px-[11.5px] pb-0.5 font-medium text-foreground group justify-between gap-x-2 no-underline hover:bg-accent/50 rounded transition-colors"
						>
							<div className="flex items-center gap-2">
								<MessageSquare className="h-4 w-4" />
								<span>SMS Analytics</span>
							</div>
							<div className="rounded-sm p-1 transition-colors duration-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-800">
								<ArrowRight className="h-4 w-4" />
							</div>
						</Link>
					</div>
					<div className="mt-2 space-y-1">
						<div className="text-2xl font-bold">{stats.totalSms.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">
							{stats.smsInbound} inbound, {stats.smsOutbound} outbound
						</p>
						<p className="text-xs text-muted-foreground">
							{stats.unreadSms} unread
						</p>
					</div>
				</div>

				{/* Call Stats */}
				<div className="bg-card border border-border relative w-full rounded-[10px] p-3 pb-2 group/chart h-[240px] min-h-[240px] shadow-sm">
					<div className="-mx-3 -mt-3 p-1 pb-0 pr-0">
						<Link
							href="/dashboard/communication?report=calls"
							className="link flex h-10 flex-row items-center px-[11.5px] pb-0.5 font-medium text-foreground group justify-between gap-x-2 no-underline hover:bg-accent/50 rounded transition-colors"
						>
							<div className="flex items-center gap-2">
								<Phone className="h-4 w-4" />
								<span>Call Analytics</span>
							</div>
							<div className="rounded-sm p-1 transition-colors duration-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-800">
								<ArrowRight className="h-4 w-4" />
							</div>
						</Link>
					</div>
					<div className="mt-2 space-y-1">
						<div className="text-2xl font-bold">{stats.totalCalls.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">
							{stats.callsInbound} inbound, {stats.callsOutbound} outbound
						</p>
					</div>
				</div>
			</div>

			{/* Additional Charts Grid - 10 More Statistics */}
			<div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
				{/* Response Time Trend */}
				<div className="bg-card border border-border relative w-full rounded-[10px] p-3 pb-2 group/chart h-[240px] min-h-[240px] shadow-sm">
					<div className="-mx-3 -mt-3 p-1 pb-0 pr-0">
						<Link
							href="/dashboard/communication?report=response-times"
							className="link flex h-10 flex-row items-center px-[11.5px] pb-0.5 font-medium text-foreground group justify-between gap-x-2 no-underline hover:bg-accent/50 rounded transition-colors"
						>
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4" />
								<span>Response Time Trend</span>
							</div>
							<div className="rounded-sm p-1 transition-colors duration-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-800">
								<ArrowRight className="h-4 w-4" />
							</div>
						</Link>
					</div>
					<div className="-mt-0.5 h-[190px]">
						<ChartContainer
							config={{
								"Response Time": { label: "Minutes", color: emailColor },
							}}
							className="h-full w-full"
						>
							<LazyAreaChart
								data={responseTimeChartData}
								margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
							>
								<defs>
									<linearGradient id={`${chartIds[2]}-response`} x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor={emailColor} stopOpacity={0.6} />
										<stop offset="100%" stopColor={emailColor} stopOpacity={0.15} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
								<XAxis
									dataKey="date"
									tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
									axisLine={{ stroke: "hsl(var(--border))" }}
								/>
								<YAxis
									tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
									axisLine={{ stroke: "hsl(var(--border))" }}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--background))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "6px",
									}}
								/>
								<Area
									type="monotone"
									dataKey="Response Time"
									stroke={emailColor}
									strokeWidth={1}
									fill={`url(#${chartIds[2]}-response)`}
									fillOpacity={1}
								/>
							</LazyAreaChart>
						</ChartContainer>
					</div>
				</div>

				{/* Inbound vs Outbound */}
				<div className="bg-card border border-border relative w-full rounded-[10px] p-3 pb-2 group/chart h-[240px] min-h-[240px] shadow-sm">
					<div className="-mx-3 -mt-3 p-1 pb-0 pr-0">
						<Link
							href="/dashboard/communication?report=activity"
							className="link flex h-10 flex-row items-center px-[11.5px] pb-0.5 font-medium text-foreground group justify-between gap-x-2 no-underline hover:bg-accent/50 rounded transition-colors"
						>
							<div className="flex items-center gap-2">
								<Activity className="h-4 w-4" />
								<span>Inbound vs Outbound</span>
							</div>
							<div className="rounded-sm p-1 transition-colors duration-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-800">
								<ArrowRight className="h-4 w-4" />
							</div>
						</Link>
					</div>
					<div className="-mt-0.5 h-[190px]">
						<ChartContainer
							config={{
								Emails: { label: "Emails", color: emailColor },
								SMS: { label: "SMS", color: smsColor },
								Calls: { label: "Calls", color: callColor },
							}}
							className="h-full w-full"
						>
							<LazyBarChart
								data={stats.directionData}
								margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
							>
								<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
								<XAxis
									dataKey="name"
									tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
									axisLine={{ stroke: "hsl(var(--border))" }}
								/>
								<YAxis
									tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
									axisLine={{ stroke: "hsl(var(--border))" }}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--background))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "6px",
									}}
								/>
								<Legend
									wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }}
									iconType="circle"
									iconSize={6}
								/>
								<Bar dataKey="Emails" fill={emailColor} radius={[4, 4, 0, 0]} />
								<Bar dataKey="SMS" fill={smsColor} radius={[4, 4, 0, 0]} />
								<Bar dataKey="Calls" fill={callColor} radius={[4, 4, 0, 0]} />
							</LazyBarChart>
						</ChartContainer>
					</div>
				</div>

				{/* Hourly Activity Pattern */}
				<div className="bg-card border border-border relative w-full rounded-[10px] p-3 pb-2 group/chart h-[240px] min-h-[240px] shadow-sm">
					<div className="-mx-3 -mt-3 p-1 pb-0 pr-0">
						<Link
							href="/dashboard/communication?report=trends"
							className="link flex h-10 flex-row items-center px-[11.5px] pb-0.5 font-medium text-foreground group justify-between gap-x-2 no-underline hover:bg-accent/50 rounded transition-colors"
						>
							<div className="flex items-center gap-2">
								<Zap className="h-4 w-4" />
								<span>Hourly Activity Pattern</span>
							</div>
							<div className="rounded-sm p-1 transition-colors duration-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-800">
								<ArrowRight className="h-4 w-4" />
							</div>
						</Link>
					</div>
					<div className="-mt-0.5 h-[190px]">
						<ChartContainer
							config={{
								Emails: { label: "Emails", color: emailColor },
								SMS: { label: "SMS", color: smsColor },
								Calls: { label: "Calls", color: callColor },
							}}
							className="h-full w-full"
						>
							<LazyAreaChart
								data={hourlyChartData}
								margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
							>
								<defs>
									<linearGradient id={`${chartIds[3]}-emails-hourly`} x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor={emailColor} stopOpacity={0.6} />
										<stop offset="100%" stopColor={emailColor} stopOpacity={0.15} />
									</linearGradient>
									<linearGradient id={`${chartIds[3]}-sms-hourly`} x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor={smsColor} stopOpacity={0.6} />
										<stop offset="100%" stopColor={smsColor} stopOpacity={0.15} />
									</linearGradient>
									<linearGradient id={`${chartIds[3]}-calls-hourly`} x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor={callColor} stopOpacity={0.6} />
										<stop offset="100%" stopColor={callColor} stopOpacity={0.15} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
								<XAxis
									dataKey="hour"
									tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
									axisLine={{ stroke: "hsl(var(--border))" }}
								/>
								<YAxis
									tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
									axisLine={{ stroke: "hsl(var(--border))" }}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--background))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "6px",
									}}
								/>
								<Legend
									wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }}
									iconType="circle"
									iconSize={6}
								/>
								<Area
									type="monotone"
									dataKey="Emails"
									stroke={emailColor}
									strokeWidth={1}
									fill={`url(#${chartIds[3]}-emails-hourly)`}
									fillOpacity={1}
								/>
								<Area
									type="monotone"
									dataKey="SMS"
									stroke={smsColor}
									strokeWidth={1}
									fill={`url(#${chartIds[3]}-sms-hourly)`}
									fillOpacity={1}
								/>
								<Area
									type="monotone"
									dataKey="Calls"
									stroke={callColor}
									strokeWidth={1}
									fill={`url(#${chartIds[3]}-calls-hourly)`}
									fillOpacity={1}
								/>
							</LazyAreaChart>
						</ChartContainer>
					</div>
				</div>

				{/* Weekly Trend */}
				<div className="bg-card border border-border relative w-full rounded-[10px] p-3 pb-2 group/chart h-[240px] min-h-[240px] shadow-sm">
					<div className="-mx-3 -mt-3 p-1 pb-0 pr-0">
						<Link
							href="/dashboard/communication?report=trends"
							className="link flex h-10 flex-row items-center px-[11.5px] pb-0.5 font-medium text-foreground group justify-between gap-x-2 no-underline hover:bg-accent/50 rounded transition-colors"
						>
							<div className="flex items-center gap-2">
								<TrendingUp className="h-4 w-4" />
								<span>Weekly Trend</span>
							</div>
							<div className="rounded-sm p-1 transition-colors duration-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-800">
								<ArrowRight className="h-4 w-4" />
							</div>
						</Link>
					</div>
					<div className="-mt-0.5 h-[190px]">
						<ChartContainer
							config={{
								Emails: { label: "Emails", color: emailColor },
								SMS: { label: "SMS", color: smsColor },
								Calls: { label: "Calls", color: callColor },
							}}
							className="h-full w-full"
						>
							<LazyAreaChart
								data={stats.weeklyStats}
								margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
							>
								<defs>
									<linearGradient id={`${chartIds[4]}-emails-weekly`} x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor={emailColor} stopOpacity={0.6} />
										<stop offset="100%" stopColor={emailColor} stopOpacity={0.15} />
									</linearGradient>
									<linearGradient id={`${chartIds[4]}-sms-weekly`} x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor={smsColor} stopOpacity={0.6} />
										<stop offset="100%" stopColor={smsColor} stopOpacity={0.15} />
									</linearGradient>
									<linearGradient id={`${chartIds[4]}-calls-weekly`} x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor={callColor} stopOpacity={0.6} />
										<stop offset="100%" stopColor={callColor} stopOpacity={0.15} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
								<XAxis
									dataKey="week"
									tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
									axisLine={{ stroke: "hsl(var(--border))" }}
								/>
								<YAxis
									tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
									axisLine={{ stroke: "hsl(var(--border))" }}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--background))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "6px",
									}}
								/>
								<Legend
									wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }}
									iconType="circle"
									iconSize={6}
								/>
								<Area
									type="monotone"
									dataKey="Emails"
									stroke={emailColor}
									strokeWidth={1}
									fill={`url(#${chartIds[4]}-emails-weekly)`}
									fillOpacity={1}
								/>
								<Area
									type="monotone"
									dataKey="SMS"
									stroke={smsColor}
									strokeWidth={1}
									fill={`url(#${chartIds[4]}-sms-weekly)`}
									fillOpacity={1}
								/>
								<Area
									type="monotone"
									dataKey="Calls"
									stroke={callColor}
									strokeWidth={1}
									fill={`url(#${chartIds[4]}-calls-weekly)`}
									fillOpacity={1}
								/>
							</LazyAreaChart>
						</ChartContainer>
					</div>
				</div>

				{/* Additional Charts Grid */}
				<div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
					{/* Unread Trend */}
					<div className="bg-card border border-border relative w-full rounded-[10px] p-3 pb-2 group/chart h-[240px] min-h-[240px] shadow-sm">
						<div className="-mx-3 -mt-3 p-1 pb-0 pr-0">
							<Link
								href="/dashboard/communication?report=activity"
								className="link flex h-10 flex-row items-center px-[11.5px] pb-0.5 font-medium text-foreground group justify-between gap-x-2 no-underline hover:bg-accent/50 rounded transition-colors"
							>
								<div className="flex items-center gap-2">
									<MessageCircle className="h-4 w-4" />
									<span>Unread Trend</span>
								</div>
								<div className="rounded-sm p-1 transition-colors duration-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-800">
									<ArrowRight className="h-4 w-4" />
								</div>
							</Link>
						</div>
						<div className="-mt-0.5 h-[190px]">
							<ChartContainer
								config={{
									"Unread Emails": { label: "Unread Emails", color: emailColor },
									"Unread SMS": { label: "Unread SMS", color: smsColor },
								}}
								className="h-full w-full"
							>
								<LazyAreaChart
									data={unreadTrendChartData}
									margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
								>
									<defs>
										<linearGradient id={`${chartIds[5]}-unread-emails`} x1="0" y1="0" x2="0" y2="1">
											<stop offset="0%" stopColor={emailColor} stopOpacity={0.6} />
											<stop offset="100%" stopColor={emailColor} stopOpacity={0.15} />
										</linearGradient>
										<linearGradient id={`${chartIds[5]}-unread-sms`} x1="0" y1="0" x2="0" y2="1">
											<stop offset="0%" stopColor={smsColor} stopOpacity={0.6} />
											<stop offset="100%" stopColor={smsColor} stopOpacity={0.15} />
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
									<XAxis
										dataKey="date"
										tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
										axisLine={{ stroke: "hsl(var(--border))" }}
									/>
									<YAxis
										tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
										axisLine={{ stroke: "hsl(var(--border))" }}
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: "hsl(var(--background))",
											border: "1px solid hsl(var(--border))",
											borderRadius: "6px",
										}}
									/>
									<Legend
										wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }}
										iconType="circle"
										iconSize={6}
									/>
									<Area
										type="monotone"
										dataKey="Unread Emails"
										stroke={emailColor}
										strokeWidth={1}
										fill={`url(#${chartIds[5]}-unread-emails)`}
										fillOpacity={1}
									/>
									<Area
										type="monotone"
										dataKey="Unread SMS"
										stroke={smsColor}
										strokeWidth={1}
										fill={`url(#${chartIds[5]}-unread-sms)`}
										fillOpacity={1}
									/>
								</LazyAreaChart>
							</ChartContainer>
						</div>
					</div>

					{/* Inbound/Outbound Trend */}
					<div className="bg-card border border-border relative w-full rounded-[10px] p-3 pb-2 group/chart h-[240px] min-h-[240px] shadow-sm">
						<div className="-mx-3 -mt-3 p-1 pb-0 pr-0">
							<Link
								href="/dashboard/communication?report=activity"
								className="link flex h-10 flex-row items-center px-[11.5px] pb-0.5 font-medium text-foreground group justify-between gap-x-2 no-underline hover:bg-accent/50 rounded transition-colors"
							>
								<div className="flex items-center gap-2">
									<Activity className="h-4 w-4" />
									<span>Inbound/Outbound Trend</span>
								</div>
								<div className="rounded-sm p-1 transition-colors duration-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-800">
									<ArrowRight className="h-4 w-4" />
								</div>
							</Link>
						</div>
						<div className="-mt-0.5 h-[190px]">
							<ChartContainer
								config={{
									Inbound: { label: "Inbound", color: emailColor },
									Outbound: { label: "Outbound", color: smsColor },
								}}
								className="h-full w-full"
							>
								<LazyAreaChart
									data={inboundOutboundChartData}
									margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
								>
									<defs>
										<linearGradient id={`${chartIds[6]}-inbound`} x1="0" y1="0" x2="0" y2="1">
											<stop offset="0%" stopColor={emailColor} stopOpacity={0.6} />
											<stop offset="100%" stopColor={emailColor} stopOpacity={0.15} />
										</linearGradient>
										<linearGradient id={`${chartIds[6]}-outbound`} x1="0" y1="0" x2="0" y2="1">
											<stop offset="0%" stopColor={smsColor} stopOpacity={0.6} />
											<stop offset="100%" stopColor={smsColor} stopOpacity={0.15} />
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
									<XAxis
										dataKey="date"
										tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
										axisLine={{ stroke: "hsl(var(--border))" }}
									/>
									<YAxis
										tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
										axisLine={{ stroke: "hsl(var(--border))" }}
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: "hsl(var(--background))",
											border: "1px solid hsl(var(--border))",
											borderRadius: "6px",
										}}
									/>
									<Legend
										wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }}
										iconType="circle"
										iconSize={6}
									/>
									<Area
										type="monotone"
										dataKey="Inbound"
										stroke={emailColor}
										strokeWidth={1}
										fill={`url(#${chartIds[6]}-inbound)`}
										fillOpacity={1}
									/>
									<Area
										type="monotone"
										dataKey="Outbound"
										stroke={smsColor}
										strokeWidth={1}
										fill={`url(#${chartIds[6]}-outbound)`}
										fillOpacity={1}
									/>
								</LazyAreaChart>
							</ChartContainer>
						</div>
					</div>

					{/* Day of Week Activity */}
					<div className="bg-card border border-border relative w-full rounded-[10px] p-3 pb-2 group/chart h-[240px] min-h-[240px] shadow-sm">
						<div className="-mx-3 -mt-3 p-1 pb-0 pr-0">
							<Link
								href="/dashboard/communication?report=trends"
								className="link flex h-10 flex-row items-center px-[11.5px] pb-0.5 font-medium text-foreground group justify-between gap-x-2 no-underline hover:bg-accent/50 rounded transition-colors"
							>
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4" />
									<span>Day of Week Activity</span>
								</div>
								<div className="rounded-sm p-1 transition-colors duration-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-800">
									<ArrowRight className="h-4 w-4" />
								</div>
							</Link>
						</div>
						<div className="-mt-0.5 h-[190px]">
							<ChartContainer
								config={{
									Emails: { label: "Emails", color: emailColor },
									SMS: { label: "SMS", color: smsColor },
									Calls: { label: "Calls", color: callColor },
								}}
								className="h-full w-full"
							>
								<LazyBarChart
									data={stats.dayOfWeekStats}
									margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
								>
									<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
									<XAxis
										dataKey="day"
										tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
										axisLine={{ stroke: "hsl(var(--border))" }}
									/>
									<YAxis
										tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
										axisLine={{ stroke: "hsl(var(--border))" }}
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: "hsl(var(--background))",
											border: "1px solid hsl(var(--border))",
											borderRadius: "6px",
										}}
									/>
									<Legend
										wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }}
										iconType="circle"
										iconSize={6}
									/>
									<Bar dataKey="Emails" fill={emailColor} radius={[4, 4, 0, 0]} />
									<Bar dataKey="SMS" fill={smsColor} radius={[4, 4, 0, 0]} />
									<Bar dataKey="Calls" fill={callColor} radius={[4, 4, 0, 0]} />
								</LazyBarChart>
							</ChartContainer>
						</div>
					</div>

					{/* Response Time by Channel */}
					<div className="bg-card border border-border relative w-full rounded-[10px] p-3 pb-2 group/chart h-[240px] min-h-[240px] shadow-sm">
						<div className="-mx-3 -mt-3 p-1 pb-0 pr-0">
							<Link
								href="/dashboard/communication?report=response-times"
								className="link flex h-10 flex-row items-center px-[11.5px] pb-0.5 font-medium text-foreground group justify-between gap-x-2 no-underline hover:bg-accent/50 rounded transition-colors"
							>
								<div className="flex items-center gap-2">
									<Timer className="h-4 w-4" />
									<span>Response Time by Channel</span>
								</div>
								<div className="rounded-sm p-1 transition-colors duration-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-800">
									<ArrowRight className="h-4 w-4" />
								</div>
							</Link>
						</div>
						<div className="-mt-0.5 h-[190px]">
							<ChartContainer
								config={{
									Email: { label: "Email", color: emailColor },
									SMS: { label: "SMS", color: smsColor },
								}}
								className="h-full w-full"
							>
								<LazyBarChart
									data={[
										{ name: "Email", value: Math.round(stats.avgEmailResponseTime) },
										{ name: "SMS", value: Math.round(stats.avgSmsResponseTime) },
									]}
									margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
								>
									<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
									<XAxis
										dataKey="name"
										tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
										axisLine={{ stroke: "hsl(var(--border))" }}
									/>
									<YAxis
										tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
										axisLine={{ stroke: "hsl(var(--border))" }}
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: "hsl(var(--background))",
											border: "1px solid hsl(var(--border))",
											borderRadius: "6px",
										}}
										formatter={(value: number) => `${value}m`}
									/>
									<Bar dataKey="value" radius={[4, 4, 0, 0]}>
										<Cell fill={emailColor} />
										<Cell fill={smsColor} />
									</Bar>
								</LazyBarChart>
							</ChartContainer>
						</div>
					</div>
				</div>
			</div>
			</div>
		</div>
	);
}


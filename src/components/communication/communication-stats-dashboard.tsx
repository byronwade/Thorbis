"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCommunicationStatsAction } from "@/actions/communication-stats-actions";
import { CommunicationStatsSkeleton } from "./communication-stats-skeleton";
import { CommunicationOverviewReport } from "./reports/communication-overview-report";
import { EmailAnalyticsReport } from "./reports/email-analytics-report";
import { SmsAnalyticsReport } from "./reports/sms-analytics-report";
import { CallAnalyticsReport } from "./reports/call-analytics-report";
import { ResponseTimesReport } from "./reports/response-times-report";
import { TeamPerformanceReport } from "./reports/team-performance-report";
import { TrendsReport } from "./reports/trends-report";
import { DistributionReport } from "./reports/distribution-report";
import { TimeSeriesReport } from "./reports/time-series-report";
import { ActivitySummaryReport } from "./reports/activity-summary-report";

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

export function CommunicationStatsDashboard() {
	const searchParams = useSearchParams();
	const report = searchParams.get("report") || "overview";
	const [stats, setStats] = useState<CommunicationStatsData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setLoading(true);
				const result = await getCommunicationStatsAction(30);
				
				if (result.success && result.data) {
					setStats(result.data);
					setError(null);
				} else {
					setError(result.error || "Failed to load statistics");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error");
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
		// Refresh every 60 seconds
		const interval = setInterval(fetchStats, 60000);
		return () => clearInterval(interval);
	}, []);

	if (loading) {
		return <CommunicationStatsSkeleton />;
	}

	if (error || !stats) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-center">
					<p className="text-lg font-semibold text-destructive">Error loading statistics</p>
					<p className="text-sm text-muted-foreground mt-2">{error || "No data available"}</p>
				</div>
			</div>
		);
	}

	// Render the appropriate report based on query parameter
	switch (report) {
		case "overview":
		case "":
			return <CommunicationOverviewReport stats={stats} />;
		case "activity":
			return <ActivitySummaryReport stats={stats} />;
		case "email":
			return <EmailAnalyticsReport stats={stats} />;
		case "sms":
			return <SmsAnalyticsReport stats={stats} />;
		case "calls":
			return <CallAnalyticsReport stats={stats} />;
		case "response-times":
			return <ResponseTimesReport stats={stats} />;
		case "team":
			return <TeamPerformanceReport stats={stats} />;
		case "trends":
			return <TrendsReport stats={stats} />;
		case "distribution":
			return <DistributionReport stats={stats} />;
		case "time-series":
			return <TimeSeriesReport stats={stats} />;
		default:
			return <CommunicationOverviewReport stats={stats} />;
	}
}


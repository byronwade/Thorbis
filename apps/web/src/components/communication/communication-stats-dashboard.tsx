"use client";

import { useSearchParams } from "next/navigation";
import { ActivitySummaryReport } from "./reports/activity-summary-report";
import { CallAnalyticsReport } from "./reports/call-analytics-report";
import { CommunicationOverviewReport } from "./reports/communication-overview-report";
import { DistributionReport } from "./reports/distribution-report";
import { EmailAnalyticsReport } from "./reports/email-analytics-report";
import { ResponseTimesReport } from "./reports/response-times-report";
import { SmsAnalyticsReport } from "./reports/sms-analytics-report";
import { TeamPerformanceReport } from "./reports/team-performance-report";
import { TimeSeriesReport } from "./reports/time-series-report";
import { TrendsReport } from "./reports/trends-report";

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

type CommunicationStatsDashboardProps = {
	initialStats: CommunicationStatsData;
	initialReport?: string;
};

export function CommunicationStatsDashboard({
	initialStats,
	initialReport,
}: CommunicationStatsDashboardProps) {
	const searchParams = useSearchParams();
	const report = searchParams.get("report") || initialReport || "overview";
	const stats = initialStats;

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

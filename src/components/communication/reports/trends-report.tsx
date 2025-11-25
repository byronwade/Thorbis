"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

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
};

type TrendsReportProps = {
	stats: CommunicationStatsData;
};

export function TrendsReport({ stats }: TrendsReportProps) {
	return (
		<div className="flex h-full w-full flex-col gap-6 p-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Trends & Growth</h1>
				<p className="text-muted-foreground mt-2">
					Communication trends and growth patterns
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						Trends & Growth
					</CardTitle>
					<CardDescription>Coming soon - Trend analysis</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						This report will show growth trends, seasonal patterns, and forecasting.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}









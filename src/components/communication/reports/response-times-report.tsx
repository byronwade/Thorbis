"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

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

type ResponseTimesReportProps = {
	stats: CommunicationStatsData;
};

export function ResponseTimesReport({ stats }: ResponseTimesReportProps) {
	return (
		<div className="flex h-full w-full flex-col gap-6 p-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Response Times</h1>
				<p className="text-muted-foreground mt-2">
					Average response times and trends
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Clock className="h-5 w-5" />
						Response Times
					</CardTitle>
					<CardDescription>Coming soon - Response time analytics</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Average response time: {Math.round(stats.avgResponseTime)} minutes
					</p>
					<p className="text-sm text-muted-foreground mt-2">
						This report will show detailed response time trends and benchmarks.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}








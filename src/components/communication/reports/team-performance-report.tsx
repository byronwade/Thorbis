"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

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

type TeamPerformanceReportProps = {
	stats: CommunicationStatsData;
};

export function TeamPerformanceReport({ stats }: TeamPerformanceReportProps) {
	return (
		<div className="flex h-full w-full flex-col gap-6 p-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Team Performance</h1>
				<p className="text-muted-foreground mt-2">
					Team member communication metrics and performance
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						Team Performance
					</CardTitle>
					<CardDescription>Coming soon - Team performance analytics</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						This report will show individual team member metrics, response times, and communication volume.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}








"use client";

/**
 * Usage Trends Chart - Client Component
 *
 * Client-side features:
 * - Interactive chart with Recharts
 * - Real-time data updates
 * - Time period selection
 */

import { useEffect, useState } from "react";
import {
	Bar,
	CartesianGrid,
	LazyBarChart,
	LazyLineChart,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "@/components/lazy/chart";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";

type TimeRange = "7d" | "30d" | "90d";

export function UsageTrendsChart({ companyId }: { companyId: string }) {
	const [timeRange, setTimeRange] = useState<TimeRange>("30d");
	const [data, setData] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchTrends() {
			setIsLoading(true);
			const supabase = createClient();
			if (!supabase) {
				setIsLoading(false);
				return;
			}

			// Calculate date range
			const endDate = new Date();
			const startDate = new Date();
			if (timeRange === "7d") {
				startDate.setDate(endDate.getDate() - 7);
			} else if (timeRange === "30d") {
				startDate.setDate(endDate.getDate() - 30);
			} else {
				startDate.setDate(endDate.getDate() - 90);
			}

			// Fetch communications data
			const { data: communications } = await supabase
				.from("communications")
				.select("*")
				.eq("company_id", companyId)
				.gte("created_at", startDate.toISOString())
				.lte("created_at", endDate.toISOString());

			// Fetch voicemails data
			const { data: voicemails } = await supabase
				.from("voicemails")
				.select("*")
				.eq("company_id", companyId)
				.gte("received_at", startDate.toISOString())
				.lte("received_at", endDate.toISOString());

			// Group by date
			const dateMap = new Map<string, any>();

			// Process communications
			communications?.forEach((comm) => {
				const date = new Date(comm.created_at).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				});

				if (!dateMap.has(date)) {
					dateMap.set(date, {
						date,
						calls: 0,
						callMinutes: 0,
						sms: 0,
						voicemails: 0,
						cost: 0,
					});
				}

				const entry = dateMap.get(date)!;

				if (comm.type === "phone") {
					entry.calls += 1;
					const minutes = comm.duration_seconds
						? Math.ceil(comm.duration_seconds / 60)
						: 0;
					entry.callMinutes += minutes;
					entry.cost += minutes * 0.012;
				} else if (comm.type === "sms" && comm.direction === "outbound") {
					entry.sms += 1;
					entry.cost += 0.0075;
				}
			});

			// Process voicemails
			voicemails?.forEach((vm) => {
				const date = new Date(vm.received_at).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				});

				if (!dateMap.has(date)) {
					dateMap.set(date, {
						date,
						calls: 0,
						callMinutes: 0,
						sms: 0,
						voicemails: 0,
						cost: 0,
					});
				}

				const entry = dateMap.get(date)!;
				entry.voicemails += 1;
				entry.cost += 0.05; // Transcription cost
			});

			// Convert to array and sort by date
			const chartData = Array.from(dateMap.values()).sort(
				(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
			);

			setData(chartData);
			setIsLoading(false);
		}

		fetchTrends();
	}, [companyId, timeRange]);

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Usage Trends</CardTitle>
					<CardDescription>Loading usage data...</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex h-[400px] items-center justify-center">
						<div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Usage Trends</CardTitle>
						<CardDescription>
							Daily usage over selected time period
						</CardDescription>
					</div>
					<Tabs
						onValueChange={(v) => setTimeRange(v as TimeRange)}
						value={timeRange}
					>
						<TabsList>
							<TabsTrigger value="7d">7 Days</TabsTrigger>
							<TabsTrigger value="30d">30 Days</TabsTrigger>
							<TabsTrigger value="90d">90 Days</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="volume">
					<TabsList className="mb-4">
						<TabsTrigger value="volume">Call & SMS Volume</TabsTrigger>
						<TabsTrigger value="cost">Daily Cost</TabsTrigger>
					</TabsList>

					<TabsContent value="volume">
						<ResponsiveContainer height={400} width="100%">
							<LazyLineChart data={data}>
								<CartesianGrid className="stroke-muted" strokeDasharray="3 3" />
								<XAxis className="text-xs" dataKey="date" />
								<YAxis className="text-xs" />
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--background))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "8px",
									}}
								/>
								<Legend />
								<Line
									dataKey="calls"
									name="Calls"
									stroke="#3b82f6"
									strokeWidth={2}
									type="monotone"
								/>
								<Line
									dataKey="sms"
									name="SMS"
									stroke="#10b981"
									strokeWidth={2}
									type="monotone"
								/>
								<Line
									dataKey="voicemails"
									name="Voicemails"
									stroke="#8b5cf6"
									strokeWidth={2}
									type="monotone"
								/>
							</LazyLineChart>
						</ResponsiveContainer>
					</TabsContent>

					<TabsContent value="cost">
						<ResponsiveContainer height={400} width="100%">
							<LazyBarChart data={data}>
								<CartesianGrid className="stroke-muted" strokeDasharray="3 3" />
								<XAxis className="text-xs" dataKey="date" />
								<YAxis className="text-xs" />
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--background))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "8px",
									}}
									formatter={(value: number) => `$${value.toFixed(2)}`}
								/>
								<Legend />
								<Bar dataKey="cost" fill="#10b981" name="Daily Cost" />
							</LazyBarChart>
						</ResponsiveContainer>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}

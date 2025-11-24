"use client";

/**
 * Analytics Charts Component - Client Component
 *
 * Interactive charts for revenue, jobs, and communications trends.
 * Uses Recharts for visualization with dark mode support.
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
	AreaChart,
	Area,
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import {
	DollarSign,
	Briefcase,
	MessageSquare,
	TrendingUp,
	BarChart3,
	LineChartIcon,
	Download,
} from "lucide-react";
import type { DailyMetric, AnalyticsTrendData } from "@/lib/queries/analytics";

type ChartType = "area" | "bar" | "line";
type MetricType = "revenue" | "jobs" | "communications";

interface AnalyticsChartsProps {
	trends: AnalyticsTrendData;
}

// Custom tooltip component
function CustomTooltip({ active, payload, label, valuePrefix = "", valueSuffix = "" }: any) {
	if (active && payload && payload.length) {
		return (
			<div className="rounded-lg border bg-background p-3 shadow-lg">
				<p className="mb-2 text-sm font-medium">{label}</p>
				{payload.map((entry: any, index: number) => (
					<div key={index} className="flex items-center gap-2 text-sm">
						<div
							className="h-2 w-2 rounded-full"
							style={{ backgroundColor: entry.color }}
						/>
						<span className="text-muted-foreground">{entry.name}:</span>
						<span className="font-medium">
							{valuePrefix}
							{typeof entry.value === "number"
								? entry.value.toLocaleString()
								: entry.value}
							{valueSuffix}
						</span>
					</div>
				))}
			</div>
		);
	}
	return null;
}

// Format date for display
function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Format currency for axis
function formatCurrencyAxis(value: number): string {
	if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
	if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
	return `$${value}`;
}

export function AnalyticsCharts({ trends }: AnalyticsChartsProps) {
	const [selectedMetric, setSelectedMetric] = useState<MetricType>("revenue");
	const [chartType, setChartType] = useState<ChartType>("area");
	const [timeRange, setTimeRange] = useState<"7" | "14" | "30" | "90">("30");

	// Get data based on selected metric
	const getChartData = () => {
		const days = parseInt(timeRange);
		let data: DailyMetric[];

		switch (selectedMetric) {
			case "revenue":
				data = trends.revenue;
				break;
			case "jobs":
				data = trends.jobs;
				break;
			case "communications":
				data = trends.communications;
				break;
			default:
				data = trends.revenue;
		}

		// Slice to selected time range
		const slicedData = data.slice(-days);

		// Format for chart
		return slicedData.map((item) => ({
			date: formatDate(item.date),
			value: item.value,
			...(item.value2 !== undefined ? { value2: item.value2 } : {}),
		}));
	};

	const chartData = getChartData();

	// Calculate summary stats
	const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
	const avgValue = chartData.length > 0 ? totalValue / chartData.length : 0;
	const maxValue = Math.max(...chartData.map((item) => item.value), 0);

	// Chart colors
	const primaryColor = "#0ea5e9"; // sky-500
	const secondaryColor = "#8b5cf6"; // violet-500
	const gradientId = `gradient-${selectedMetric}`;

	// Metric configurations
	const metricConfig = {
		revenue: {
			label: "Revenue",
			icon: DollarSign,
			valuePrefix: "$",
			color: "#10b981", // emerald-500
			description: "Daily revenue from completed payments",
		},
		jobs: {
			label: "Jobs",
			icon: Briefcase,
			valuePrefix: "",
			color: "#0ea5e9", // sky-500
			description: "Jobs completed per day",
		},
		communications: {
			label: "Communications",
			icon: MessageSquare,
			valuePrefix: "",
			color: "#8b5cf6", // violet-500
			description: "Outbound (blue) vs Inbound (purple)",
		},
	};

	const config = metricConfig[selectedMetric];

	// Render chart based on type
	const renderChart = () => {
		const commonProps = {
			data: chartData,
			margin: { top: 10, right: 30, left: 0, bottom: 0 },
		};

		const xAxisProps = {
			dataKey: "date",
			axisLine: false,
			tickLine: false,
			tick: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
			dy: 10,
		};

		const yAxisProps = {
			axisLine: false,
			tickLine: false,
			tick: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
			tickFormatter: selectedMetric === "revenue" ? formatCurrencyAxis : (v: number) => v.toLocaleString(),
			width: 60,
		};

		const gridProps = {
			strokeDasharray: "3 3",
			vertical: false,
			stroke: "hsl(var(--border))",
			opacity: 0.4,
		};

		if (chartType === "area") {
			return (
				<AreaChart {...commonProps}>
					<defs>
						<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
							<stop offset="95%" stopColor={config.color} stopOpacity={0} />
						</linearGradient>
						{selectedMetric === "communications" && (
							<linearGradient id={`${gradientId}-2`} x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor={secondaryColor} stopOpacity={0.3} />
								<stop offset="95%" stopColor={secondaryColor} stopOpacity={0} />
							</linearGradient>
						)}
					</defs>
					<CartesianGrid {...gridProps} />
					<XAxis {...xAxisProps} />
					<YAxis {...yAxisProps} />
					<Tooltip
						content={<CustomTooltip valuePrefix={config.valuePrefix} />}
					/>
					{selectedMetric === "communications" ? (
						<>
							<Area
								type="monotone"
								dataKey="value"
								name="Outbound"
								stroke={primaryColor}
								fill={`url(#${gradientId})`}
								strokeWidth={2}
							/>
							<Area
								type="monotone"
								dataKey="value2"
								name="Inbound"
								stroke={secondaryColor}
								fill={`url(#${gradientId}-2)`}
								strokeWidth={2}
							/>
							<Legend />
						</>
					) : (
						<Area
							type="monotone"
							dataKey="value"
							name={config.label}
							stroke={config.color}
							fill={`url(#${gradientId})`}
							strokeWidth={2}
						/>
					)}
				</AreaChart>
			);
		}

		if (chartType === "bar") {
			return (
				<BarChart {...commonProps}>
					<CartesianGrid {...gridProps} />
					<XAxis {...xAxisProps} />
					<YAxis {...yAxisProps} />
					<Tooltip
						content={<CustomTooltip valuePrefix={config.valuePrefix} />}
						cursor={{ fill: "hsl(var(--muted)/0.2)" }}
					/>
					{selectedMetric === "communications" ? (
						<>
							<Bar
								dataKey="value"
								name="Outbound"
								fill={primaryColor}
								radius={[4, 4, 0, 0]}
								maxBarSize={20}
							/>
							<Bar
								dataKey="value2"
								name="Inbound"
								fill={secondaryColor}
								radius={[4, 4, 0, 0]}
								maxBarSize={20}
							/>
							<Legend />
						</>
					) : (
						<Bar
							dataKey="value"
							name={config.label}
							fill={config.color}
							radius={[4, 4, 0, 0]}
							maxBarSize={20}
						/>
					)}
				</BarChart>
			);
		}

		// Line chart
		return (
			<LineChart {...commonProps}>
				<CartesianGrid {...gridProps} />
				<XAxis {...xAxisProps} />
				<YAxis {...yAxisProps} />
				<Tooltip
					content={<CustomTooltip valuePrefix={config.valuePrefix} />}
				/>
				{selectedMetric === "communications" ? (
					<>
						<Line
							type="monotone"
							dataKey="value"
							name="Outbound"
							stroke={primaryColor}
							strokeWidth={2}
							dot={false}
							activeDot={{ r: 4, strokeWidth: 2 }}
						/>
						<Line
							type="monotone"
							dataKey="value2"
							name="Inbound"
							stroke={secondaryColor}
							strokeWidth={2}
							dot={false}
							activeDot={{ r: 4, strokeWidth: 2 }}
						/>
						<Legend />
					</>
				) : (
					<Line
						type="monotone"
						dataKey="value"
						name={config.label}
						stroke={config.color}
						strokeWidth={2}
						dot={false}
						activeDot={{ r: 4, strokeWidth: 2 }}
					/>
				)}
			</LineChart>
		);
	};

	const MetricIcon = config.icon;

	return (
		<Card className="overflow-hidden">
			<CardHeader className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3">
					<div className="rounded-md bg-primary/10 p-2">
						<TrendingUp className="h-5 w-5 text-primary" />
					</div>
					<div>
						<CardTitle className="text-xl">Performance Trends</CardTitle>
						<CardDescription>{config.description}</CardDescription>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					{/* Metric Selector */}
					<Select value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricType)}>
						<SelectTrigger className="h-8 w-[140px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="revenue">
								<div className="flex items-center gap-2">
									<DollarSign className="h-4 w-4" />
									Revenue
								</div>
							</SelectItem>
							<SelectItem value="jobs">
								<div className="flex items-center gap-2">
									<Briefcase className="h-4 w-4" />
									Jobs
								</div>
							</SelectItem>
							<SelectItem value="communications">
								<div className="flex items-center gap-2">
									<MessageSquare className="h-4 w-4" />
									Communications
								</div>
							</SelectItem>
						</SelectContent>
					</Select>

					{/* Time Range Tabs */}
					<Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
						<TabsList className="h-8">
							<TabsTrigger value="7" className="h-6 px-2 text-xs">
								7D
							</TabsTrigger>
							<TabsTrigger value="14" className="h-6 px-2 text-xs">
								2W
							</TabsTrigger>
							<TabsTrigger value="30" className="h-6 px-2 text-xs">
								30D
							</TabsTrigger>
							<TabsTrigger value="90" className="h-6 px-2 text-xs">
								90D
							</TabsTrigger>
						</TabsList>
					</Tabs>

					{/* Chart Type Toggle */}
					<div className="flex items-center rounded-md border">
						<Button
							variant="ghost"
							size="sm"
							className={cn(
								"h-8 rounded-none rounded-l-md px-2",
								chartType === "area" && "bg-muted"
							)}
							onClick={() => setChartType("area")}
						>
							<TrendingUp className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className={cn(
								"h-8 rounded-none border-x px-2",
								chartType === "bar" && "bg-muted"
							)}
							onClick={() => setChartType("bar")}
						>
							<BarChart3 className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className={cn(
								"h-8 rounded-none rounded-r-md px-2",
								chartType === "line" && "bg-muted"
							)}
							onClick={() => setChartType("line")}
						>
							<LineChartIcon className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				{/* Summary Stats */}
				<div className="mb-6 flex flex-wrap gap-6">
					<div>
						<p className="text-sm text-muted-foreground">Total</p>
						<p className="text-2xl font-bold">
							{config.valuePrefix}
							{totalValue.toLocaleString()}
						</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Daily Average</p>
						<p className="text-2xl font-bold">
							{config.valuePrefix}
							{avgValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
						</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Peak Day</p>
						<p className="text-2xl font-bold">
							{config.valuePrefix}
							{maxValue.toLocaleString()}
						</p>
					</div>
				</div>

				{/* Chart */}
				<div className="h-[350px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						{renderChart()}
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}

"use client";

import {
	ArrowDownRight,
	ArrowUpRight,
	Calendar,
	Download,
	Info,
} from "lucide-react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Types
export type MetricCardProps = {
	label: string;
	value: string | number;
	change?: number;
	changeLabel?: string;
	subValue?: string;
	icon?: React.ReactNode;
	verified?: boolean;
};

export type ChartCardProps = {
	title: string;
	data: any[];
	type: "bar" | "line";
	dataKey: string;
	category: string;
	color?: string;
	height?: number;
};

// Metric Card Component
export function MetricCard({
	label,
	value,
	change,
	changeLabel,
	subValue,
	verified,
}: MetricCardProps) {
	const isPositive = change && change > 0;
	const isNegative = change && change < 0;

	return (
		<Card className="bg-card/50 border-border/50 overflow-hidden backdrop-blur-sm">
			<CardContent className="p-4 md:p-6">
				<div className="flex items-center gap-2 mb-1 md:mb-2">
					<span className="text-muted-foreground text-xs md:text-sm font-medium">
						{label}
					</span>
					{verified && (
						<div className="bg-blue-500/10 text-blue-500 rounded-full p-0.5">
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="w-3 h-3"
							>
								<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
							</svg>
						</div>
					)}
				</div>
				<div className="flex items-baseline gap-1 md:gap-2">
					<span className="text-xl md:text-2xl font-bold tracking-tight">
						{value}
					</span>
					{subValue && (
						<span className="text-muted-foreground text-xs md:text-sm">
							{subValue}
						</span>
					)}
				</div>
				{change !== undefined && (
					<div className="flex items-center gap-2 mt-2">
						<div
							className={cn(
								"flex items-center text-xs font-medium",
								isPositive && "text-green-500",
								isNegative && "text-red-500",
								!isPositive && !isNegative && "text-muted-foreground",
							)}
						>
							{isPositive ? (
								<ArrowUpRight className="w-3 h-3 mr-1" />
							) : isNegative ? (
								<ArrowDownRight className="w-3 h-3 mr-1" />
							) : null}
							{Math.abs(change)}%
						</div>
						{changeLabel && (
							<span className="text-muted-foreground text-xs">
								{changeLabel}
							</span>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

// Main Chart Component
export function MainChartCard({
	title,
	data,
	height = 350,
}: {
	title: string;
	data: any[];
	height?: number;
}) {
	return (
		<Card className="bg-card/50 border-border/50 col-span-full backdrop-blur-sm">
			<CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-4 md:p-6 pb-4">
				<div className="flex items-center gap-4">
					<CardTitle className="text-lg md:text-xl font-semibold">
						{title}
					</CardTitle>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="h-10 w-10 md:h-8 md:w-8 p-0"
					>
						<Calendar className="h-5 w-5 md:h-4 md:w-4" />
					</Button>
					<Tabs defaultValue="3M" className="w-auto">
						<TabsList className="h-10 md:h-8">
							<TabsTrigger
								value="7D"
								className="text-xs h-8 md:h-6 px-2.5 md:px-2"
							>
								7D
							</TabsTrigger>
							<TabsTrigger
								value="2W"
								className="text-xs h-8 md:h-6 px-2.5 md:px-2"
							>
								2W
							</TabsTrigger>
							<TabsTrigger
								value="4W"
								className="text-xs h-8 md:h-6 px-2.5 md:px-2"
							>
								4W
							</TabsTrigger>
							<TabsTrigger
								value="3M"
								className="text-xs h-8 md:h-6 px-2.5 md:px-2"
							>
								3M
							</TabsTrigger>
							<TabsTrigger
								value="1Y"
								className="text-xs h-8 md:h-6 px-2.5 md:px-2"
							>
								1Y
							</TabsTrigger>
						</TabsList>
					</Tabs>
					<Button
						variant="outline"
						size="sm"
						className="h-10 w-10 md:h-8 md:w-8 p-0"
					>
						<Download className="h-5 w-5 md:h-4 md:w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="p-4 md:p-6 pt-0">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
					<div className="flex items-center gap-2 flex-wrap">
						<Select defaultValue="impressions">
							<SelectTrigger className="w-[140px] h-10 md:h-8 text-base md:text-xs">
								<SelectValue placeholder="Metric" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="impressions">Impressions</SelectItem>
								<SelectItem value="revenue">Revenue</SelectItem>
								<SelectItem value="jobs">Jobs</SelectItem>
							</SelectContent>
						</Select>
						<Select defaultValue="secondary">
							<SelectTrigger className="w-[180px] h-10 md:h-8 text-base md:text-xs text-muted-foreground">
								<SelectValue placeholder="Select secondary metric" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="secondary">
									Select secondary metric
								</SelectItem>
								<SelectItem value="clicks">Clicks</SelectItem>
								<SelectItem value="conversions">Conversions</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center gap-2 flex-wrap">
						<Select defaultValue="daily">
							<SelectTrigger className="w-[100px] h-10 md:h-8 text-base md:text-xs">
								<SelectValue placeholder="Granularity" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="daily">Daily</SelectItem>
								<SelectItem value="weekly">Weekly</SelectItem>
								<SelectItem value="monthly">Monthly</SelectItem>
							</SelectContent>
						</Select>
						<div className="flex items-center border rounded-md h-10 md:h-8">
							<Button
								variant="ghost"
								size="sm"
								className="h-full px-3 md:px-2 rounded-none border-r hover:bg-muted"
							>
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<line x1="18" y1="20" x2="18" y2="10" />
									<line x1="12" y1="20" x2="12" y2="4" />
									<line x1="6" y1="20" x2="6" y2="14" />
								</svg>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="h-full px-3 md:px-2 rounded-none hover:bg-muted text-muted-foreground"
							>
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
								</svg>
							</Button>
						</div>
					</div>
				</div>
				<div style={{ height }}>
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={data}>
							<CartesianGrid
								strokeDasharray="3 3"
								vertical={false}
								stroke="hsl(var(--border))"
								opacity={0.4}
							/>
							<XAxis
								dataKey="date"
								axisLine={false}
								tickLine={false}
								tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
								dy={10}
							/>
							<YAxis
								axisLine={false}
								tickLine={false}
								tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
								tickFormatter={(value) =>
									value >= 1000 ? `${value / 1000}k` : value
								}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "hsl(var(--card))",
									borderColor: "hsl(var(--border))",
									borderRadius: "8px",
									color: "hsl(var(--foreground))",
								}}
								cursor={{ fill: "hsl(var(--muted)/0.2)" }}
							/>
							<Bar
								dataKey="value"
								fill="#0ea5e9"
								radius={[2, 2, 0, 0]}
								maxBarSize={8}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}

// Small Chart Component
export function SmallChartCard({
	title,
	data,
	type = "line",
	color = "#0ea5e9",
	dataKey = "value",
}: ChartCardProps) {
	return (
		<Card className="bg-card/50 border-border/50 backdrop-blur-sm">
			<CardHeader className="flex flex-row items-center justify-between p-4 md:p-6 pb-2">
				<CardTitle className="text-sm md:text-base font-medium">
					{title}
				</CardTitle>
				<Info className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent className="p-4 md:p-6 pt-0">
				<div className="h-[120px] md:h-[150px] w-full mt-4">
					<ResponsiveContainer width="100%" height="100%">
						{type === "line" ? (
							<LineChart data={data}>
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--card))",
										borderColor: "hsl(var(--border))",
										borderRadius: "8px",
										color: "hsl(var(--foreground))",
									}}
								/>
								<Line
									type="monotone"
									dataKey={dataKey}
									stroke={color}
									strokeWidth={2}
									dot={false}
								/>
							</LineChart>
						) : (
							<BarChart data={data}>
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--card))",
										borderColor: "hsl(var(--border))",
										borderRadius: "8px",
										color: "hsl(var(--foreground))",
									}}
									cursor={{ fill: "hsl(var(--muted)/0.2)" }}
								/>
								<Bar
									dataKey={dataKey}
									fill={color}
									radius={[2, 2, 0, 0]}
									maxBarSize={4}
								/>
							</BarChart>
						)}
					</ResponsiveContainer>
				</div>
				<div className="flex justify-between mt-4 text-xs text-muted-foreground">
					<span>Aug 25</span>
					<span>Sep 22</span>
					<span>Oct 19</span>
					<span>Nov 15</span>
				</div>
			</CardContent>
		</Card>
	);
}

// Mock Data Generator
export function generateMockData(days = 90) {
	const data = [];
	const now = new Date();
	for (let i = days; i >= 0; i--) {
		const date = new Date(now);
		date.setDate(date.getDate() - i);
		data.push({
			date: date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			}),
			value: Math.floor(Math.random() * 5000) + 1000,
			value2: Math.floor(Math.random() * 3000) + 500,
		});
	}
	return data;
}

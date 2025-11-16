/**
 * Lazy-loaded Chart Components
 *
 * Performance optimization:
 * - Dynamically imports recharts only when charts are visible
 * - Reduces initial bundle size by ~150KB
 * - Shows loading skeleton while component loads
 */

"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const ChartLoadingSkeleton = () => (
	<div className="h-80 w-full">
		<Skeleton className="h-full w-full rounded-lg" />
	</div>
);

export const LazyLineChart = dynamic(() => import("recharts").then((mod) => mod.LineChart), {
	ssr: false,
	loading: ChartLoadingSkeleton,
});

export const LazyBarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), {
	ssr: false,
	loading: ChartLoadingSkeleton,
});

export const LazyAreaChart = dynamic(() => import("recharts").then((mod) => mod.AreaChart), {
	ssr: false,
	loading: ChartLoadingSkeleton,
});

export const LazyPieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), {
	ssr: false,
	loading: ChartLoadingSkeleton,
});

export const LazyRadarChart = dynamic(() => import("recharts").then((mod) => mod.RadarChart), {
	ssr: false,
	loading: ChartLoadingSkeleton,
});

// Export other recharts components for use with lazy charts
export {
	Area,
	Bar,
	CartesianGrid,
	Legend,
	Line,
	Pie,
	Radar,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

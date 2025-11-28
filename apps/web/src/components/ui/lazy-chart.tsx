/**
 * Lazy-loaded Chart Components
 *
 * Performance optimization:
 * - Dynamically imports recharts only when charts are visible
 * - Reduces initial bundle size by ~150KB
 * - Shows loading skeleton while component loads
 *
 * IMPORTANT: Do NOT add direct exports from recharts here!
 * Each component that uses charts should import recharts components
 * in the same file where the chart is rendered, so they are tree-shaken
 * and code-split with the chart component.
 */

"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const ChartLoadingSkeleton = () => (
	<div className="h-80 w-full">
		<Skeleton className="h-full w-full rounded-lg" />
	</div>
);

const LazyLineChart = dynamic(
	() => import("recharts").then((mod) => mod.LineChart),
	{
		ssr: false,
		loading: ChartLoadingSkeleton,
	},
);

export const LazyBarChart = dynamic(
	() => import("recharts").then((mod) => mod.BarChart),
	{
		ssr: false,
		loading: ChartLoadingSkeleton,
	},
);

export const LazyAreaChart = dynamic(
	() => import("recharts").then((mod) => mod.AreaChart),
	{
		ssr: false,
		loading: ChartLoadingSkeleton,
	},
);

const LazyPieChart = dynamic(
	() => import("recharts").then((mod) => mod.PieChart),
	{
		ssr: false,
		loading: ChartLoadingSkeleton,
	},
);

const LazyRadarChart = dynamic(
	() => import("recharts").then((mod) => mod.RadarChart),
	{
		ssr: false,
		loading: ChartLoadingSkeleton,
	},
);

const LazyResponsiveContainer = dynamic(
	() => import("recharts").then((mod) => mod.ResponsiveContainer),
	{
		ssr: false,
		loading: ChartLoadingSkeleton,
	},
);

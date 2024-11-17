"use client";

import { useMemoizedValue } from "@/lib/utils/memoization";
import { useCallback } from "react";

export function DashboardMetrics() {
	const getMetrics = useCallback(
		() => ({
			totalWebsites: 0,
			activeDeployments: 0,
			totalUsers: 0,
		}),
		[]
	);

	const metrics = useMemoizedValue(getMetrics, [getMetrics]);

	return (
		<div className="grid gap-4 md:grid-cols-3">
			<MetricCard title="Total Websites" value={metrics.totalWebsites} />
			<MetricCard title="Active Deployments" value={metrics.activeDeployments} />
			<MetricCard title="Total Users" value={metrics.totalUsers} />
		</div>
	);
}

function MetricCard({ title, value }: { title: string; value: number }) {
	return (
		<div className="p-4 border rounded-lg">
			<h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
			<p className="text-2xl font-bold">{value}</p>
		</div>
	);
}

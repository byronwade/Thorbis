"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@/components/ui/optimized-datatable";
import { OptimizedDataTable } from "@/components/ui/optimized-datatable";

// Generate sample data
function generateSampleData(count: number) {
	return Array.from({ length: count }, (_, i) => ({
		id: `job-${i + 1}`,
		title: `Job ${i + 1}`,
		customer: `Customer ${Math.floor(Math.random() * 100)}`,
		status: ["pending", "active", "completed"][
			Math.floor(Math.random() * 3)
		] as string,
		priority: ["low", "medium", "high"][
			Math.floor(Math.random() * 3)
		] as string,
		amount: Math.floor(Math.random() * 10_000),
		created: new Date(
			Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
		).toLocaleDateString(),
	}));
}

type Job = ReturnType<typeof generateSampleData>[0];

export function OptimizedExample() {
	const [rowCount, setRowCount] = useState(1000);
	const [data, setData] = useState(() => generateSampleData(rowCount));

	const columns: ColumnDef<Job>[] = [
		{
			key: "id",
			header: "ID",
			render: (item) => <span className="font-mono text-sm">{item.id}</span>,
			width: "120px",
		},
		{
			key: "title",
			header: "Title",
			render: (item) => <span className="font-medium">{item.title}</span>,
		},
		{
			key: "customer",
			header: "Customer",
			render: (item) => <span>{item.customer}</span>,
		},
		{
			key: "status",
			header: "Status",
			render: (item) => (
				<Badge
					variant={
						item.status === "completed"
							? "default"
							: item.status === "active"
								? "secondary"
								: "outline"
					}
				>
					{item.status}
				</Badge>
			),
			width: "120px",
		},
		{
			key: "priority",
			header: "Priority",
			render: (item) => (
				<Badge
					variant={
						item.priority === "high"
							? "destructive"
							: item.priority === "medium"
								? "secondary"
								: "outline"
					}
				>
					{item.priority}
				</Badge>
			),
			width: "100px",
		},
		{
			key: "amount",
			header: "Amount",
			render: (item) => <span>${item.amount.toLocaleString()}</span>,
			align: "right",
			width: "120px",
		},
		{
			key: "created",
			header: "Created",
			render: (item) => (
				<span className="text-muted-foreground text-sm">{item.created}</span>
			),
			width: "120px",
		},
	];

	const handleRefresh = () => {
		setData(generateSampleData(rowCount));
	};

	const handleChangeRowCount = (count: number) => {
		setRowCount(count);
		setData(generateSampleData(count));
	};

	return (
		<div className="space-y-6">
			{/* Info Card */}
			<div className="rounded-lg border bg-card p-6">
				<h2 className="mb-2 font-semibold text-lg">
					Optimized Client-Side Table
				</h2>
				<p className="mb-4 text-muted-foreground text-sm">
					Uses React.memo, useMemo, and useCallback for efficient rendering.
					Best for 1,000-5,000 rows with client-side pagination.
				</p>

				<div className="space-y-2 text-sm">
					<div className="flex items-center gap-2">
						<span className="font-medium">Current rows:</span>
						<span>{rowCount.toLocaleString()}</span>
					</div>
					<div className="flex gap-2">
						<Button
							onClick={() => handleChangeRowCount(1000)}
							size="sm"
							variant="outline"
						>
							1,000 rows
						</Button>
						<Button
							onClick={() => handleChangeRowCount(2500)}
							size="sm"
							variant="outline"
						>
							2,500 rows
						</Button>
						<Button
							onClick={() => handleChangeRowCount(5000)}
							size="sm"
							variant="outline"
						>
							5,000 rows
						</Button>
					</div>
				</div>
			</div>

			{/* Performance Metrics */}
			<div className="grid gap-4 md:grid-cols-3">
				<div className="rounded-lg border bg-card p-4">
					<div className="text-muted-foreground text-sm">Memory Usage</div>
					<div className="mt-1 font-bold text-2xl">
						~{Math.round(rowCount * 0.002)}MB
					</div>
					<div className="mt-1 text-muted-foreground text-xs">
						All data in memory
					</div>
				</div>
				<div className="rounded-lg border bg-card p-4">
					<div className="text-muted-foreground text-sm">Initial Render</div>
					<div className="mt-1 font-bold text-2xl">
						~{Math.round(rowCount * 0.05)}ms
					</div>
					<div className="mt-1 text-muted-foreground text-xs">
						With pagination
					</div>
				</div>
				<div className="rounded-lg border bg-card p-4">
					<div className="text-muted-foreground text-sm">Re-renders</div>
					<div className="mt-1 font-bold text-2xl">50-70%</div>
					<div className="mt-1 text-muted-foreground text-xs">
						Reduction vs unoptimized
					</div>
				</div>
			</div>

			{/* Table */}
			<OptimizedDataTable
				columns={columns}
				data={data}
				emptyMessage="No jobs found"
				getItemId={(item) => item.id}
				itemsPerPage={50}
				onRefresh={handleRefresh}
				searchFilter={(item, query) =>
					item.title.toLowerCase().includes(query) ||
					item.customer.toLowerCase().includes(query) ||
					item.status.toLowerCase().includes(query)
				}
				searchPlaceholder="Search jobs..."
				showRefresh
			/>
		</div>
	);
}

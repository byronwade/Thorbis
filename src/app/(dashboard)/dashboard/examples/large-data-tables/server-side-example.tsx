"use client";

import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ServerColumnDef } from "@/components/ui/server-datatable";
import { ServerDataTable } from "@/components/ui/server-datatable";
import type { PaginationParams } from "@/lib/hooks/use-server-pagination";
import { useServerPagination } from "@/lib/hooks/use-server-pagination";

// Simulate server data
const TOTAL_ROWS = 100_000; // Simulating 100,000 rows in database

function generatePageData(params: PaginationParams) {
	const { page, pageSize, sortBy, sortDirection, filters, search } = params;

	// Simulate all data (in real app, this would be in database)
	let allData = Array.from({ length: TOTAL_ROWS }, (_, i) => ({
		id: `job-${i + 1}`,
		title: `Job ${i + 1}`,
		customer: `Customer ${Math.floor(Math.random() * 100)}`,
		status: ["pending", "active", "completed"][Math.floor(Math.random() * 3)] as string,
		priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as string,
		amount: Math.floor(Math.random() * 10_000),
		created: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
	}));

	// Apply filters
	if (filters?.status) {
		allData = allData.filter((item) => item.status === filters.status);
	}
	if (filters?.priority) {
		allData = allData.filter((item) => item.priority === filters.priority);
	}

	// Apply search
	if (search) {
		const query = search.toLowerCase();
		allData = allData.filter(
			(item) =>
				item.title.toLowerCase().includes(query) ||
				item.customer.toLowerCase().includes(query) ||
				item.status.toLowerCase().includes(query)
		);
	}

	// Apply sorting
	if (sortBy && sortDirection) {
		allData.sort((a: any, b: any) => {
			const aVal = a[sortBy];
			const bVal = b[sortBy];
			if (aVal < bVal) {
				return sortDirection === "asc" ? -1 : 1;
			}
			if (aVal > bVal) {
				return sortDirection === "asc" ? 1 : -1;
			}
			return 0;
		});
	}

	const totalCount = allData.length;

	// Apply pagination (only return current page)
	const start = (page - 1) * pageSize;
	const end = start + pageSize;
	const pageData = allData.slice(start, end);

	return { data: pageData, totalCount };
}

type Job = {
	id: string;
	title: string;
	customer: string;
	status: string;
	priority: string;
	amount: number;
	created: string;
};

export function ServerSideExample() {
	const [requestCount, setRequestCount] = useState(0);

	// Simulate server fetch with delay
	const fetchJobs = useCallback(async (params: PaginationParams) => {
		setRequestCount((prev) => prev + 1);

		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		return generatePageData(params);
	}, []);

	const pagination = useServerPagination<Job>({
		fetchFn: fetchJobs,
		pageSize: 50,
		searchDebounce: 300,
	});

	const columns: ServerColumnDef<Job>[] = [
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
			sortable: true,
		},
		{
			key: "customer",
			header: "Customer",
			render: (item) => <span>{item.customer}</span>,
			sortable: true,
		},
		{
			key: "status",
			header: "Status",
			render: (item) => (
				<Badge variant={item.status === "completed" ? "default" : item.status === "active" ? "secondary" : "outline"}>
					{item.status}
				</Badge>
			),
			width: "120px",
			sortable: true,
		},
		{
			key: "priority",
			header: "Priority",
			render: (item) => (
				<Badge
					variant={item.priority === "high" ? "destructive" : item.priority === "medium" ? "secondary" : "outline"}
				>
					{item.priority}
				</Badge>
			),
			width: "100px",
			sortable: true,
		},
		{
			key: "amount",
			header: "Amount",
			render: (item) => <span>${item.amount.toLocaleString()}</span>,
			align: "right",
			width: "120px",
			sortable: true,
		},
		{
			key: "created",
			header: "Created",
			render: (item) => (
				<span className="text-muted-foreground text-sm">{new Date(item.created).toLocaleDateString()}</span>
			),
			width: "120px",
			sortable: true,
		},
	];

	return (
		<div className="space-y-6">
			{/* Info Card */}
			<div className="rounded-lg border bg-card p-6">
				<h2 className="mb-2 font-semibold text-lg">Server-Side Pagination Table</h2>
				<p className="mb-4 text-muted-foreground text-sm">
					Fetches only current page from server. Database handles sorting/filtering with indexes. Scales to millions of
					rows with constant performance.
				</p>

				<div className="space-y-2 text-sm">
					<div className="flex items-center gap-2">
						<span className="font-medium">Total rows in database:</span>
						<span>{TOTAL_ROWS.toLocaleString()}</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="font-medium">Server requests made:</span>
						<span>{requestCount}</span>
					</div>
				</div>
			</div>

			{/* Performance Metrics */}
			<div className="grid gap-4 md:grid-cols-3">
				<div className="rounded-lg border bg-card p-4">
					<div className="text-muted-foreground text-sm">Client Memory</div>
					<div className="mt-1 font-bold text-2xl">~2MB</div>
					<div className="mt-1 text-muted-foreground text-xs">Only current page</div>
				</div>
				<div className="rounded-lg border bg-card p-4">
					<div className="text-muted-foreground text-sm">Page Load Time</div>
					<div className="mt-1 font-bold text-2xl">~500ms</div>
					<div className="mt-1 text-muted-foreground text-xs">Network + DB query</div>
				</div>
				<div className="rounded-lg border bg-card p-4">
					<div className="text-muted-foreground text-sm">Scalability</div>
					<div className="mt-1 font-bold text-2xl">Unlimited</div>
					<div className="mt-1 text-muted-foreground text-xs">Works with millions of rows</div>
				</div>
			</div>

			{/* Advantages */}
			<div className="rounded-lg border bg-muted p-6">
				<h3 className="mb-3 font-semibold">Why Server-Side Pagination?</h3>
				<div className="grid gap-4 md:grid-cols-2">
					<div>
						<div className="mb-2 font-medium text-sm">Performance</div>
						<ul className="space-y-1 text-sm">
							<li>✅ Constant page load time (50 rows vs 100K rows)</li>
							<li>✅ Low memory usage (only current page)</li>
							<li>✅ Fast database queries (with indexes)</li>
							<li>✅ No initial load delay</li>
						</ul>
					</div>
					<div>
						<div className="mb-2 font-medium text-sm">Features</div>
						<ul className="space-y-1 text-sm">
							<li>✅ Unlimited dataset size</li>
							<li>✅ Real-time data (always fresh)</li>
							<li>✅ Complex filtering & sorting</li>
							<li>✅ Row-level security (RLS)</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="flex gap-2">
				<Button
					onClick={() =>
						pagination.filters.setFilter(
							"status",
							pagination.filters.current.status === "active" ? undefined : "active"
						)
					}
					size="sm"
					variant={pagination.filters.current.status === "active" ? "default" : "outline"}
				>
					Active Only
				</Button>
				<Button
					onClick={() =>
						pagination.filters.setFilter(
							"status",
							pagination.filters.current.status === "completed" ? undefined : "completed"
						)
					}
					size="sm"
					variant={pagination.filters.current.status === "completed" ? "default" : "outline"}
				>
					Completed Only
				</Button>
				<Button
					onClick={() =>
						pagination.filters.setFilter(
							"priority",
							pagination.filters.current.priority === "high" ? undefined : "high"
						)
					}
					size="sm"
					variant={pagination.filters.current.priority === "high" ? "default" : "outline"}
				>
					High Priority
				</Button>
				{Object.keys(pagination.filters.current).length > 0 && (
					<Button onClick={pagination.filters.clearAllFilters} size="sm" variant="ghost">
						Clear Filters
					</Button>
				)}
			</div>

			{/* Table */}
			<ServerDataTable
				columns={columns}
				emptyMessage="No jobs found"
				getItemId={(item) => item.id}
				pageSizeOptions={[25, 50, 100, 200]}
				pagination={pagination}
				searchPlaceholder="Search jobs..."
				showPageSizeSelector
			/>
		</div>
	);
}

import { Suspense } from "react";
import { getDatabaseHealth } from "@/actions/data-management";
import { DataManagement } from "@/components/work/data-management";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Data Management Page
 *
 * Database health checks, orphaned data detection, and cleanup tools.
 */
async function DataManagementData() {
	const result = await getDatabaseHealth();

	if (result.error || !result.data) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{result.error || "Failed to load database health data"}
				</p>
			</div>
		);
	}

	return <DataManagement health={result.data} />;
}

export default function DataManagementPage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Data Management</h1>
				<p className="text-muted-foreground text-sm">
					Database health checks, orphaned data detection, and cleanup tools
				</p>
			</div>
			<Suspense fallback={<DataManagementSkeleton />}>
				<DataManagementData />
			</Suspense>
		</div>
	);
}

/**
 * Loading skeleton
 */
function DataManagementSkeleton() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<Skeleton className="h-4 w-24 mb-2" />
							<Skeleton className="h-8 w-16 mb-1" />
							<Skeleton className="h-3 w-20" />
						</CardContent>
					</Card>
				))}
			</div>
			{Array.from({ length: 2 }).map((_, i) => (
				<Card key={i}>
					<CardContent className="p-6">
						<Skeleton className="h-6 w-48 mb-4" />
						<div className="space-y-3">
							{Array.from({ length: 3 }).map((_, j) => (
								<Skeleton key={j} className="h-16 w-full" />
							))}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}




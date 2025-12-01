import { Suspense } from "react";
import { getAuditLogs, getAuditLogStats } from "@/actions/audit";
import { AuditLogViewer } from "@/components/work/audit-log-viewer";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Audit Log Viewer Page
 *
 * Platform-wide audit log viewer with filtering, search, and export capabilities.
 */
async function AuditLogData() {
	const [logsResult, statsResult] = await Promise.all([
		getAuditLogs({ limit: 100 }),
		getAuditLogStats(),
	]);

	if (logsResult.error || statsResult.error) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{logsResult.error || statsResult.error || "Failed to load audit logs"}
				</p>
			</div>
		);
	}

	return (
		<AuditLogViewer
			logs={logsResult.data || []}
			stats={statsResult.data || { total: 0, byAction: [], byAdmin: [], byResource: [], recentActivity: 0 }}
		/>
	);
}

export default function AuditLogPage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
				<p className="text-muted-foreground text-sm">
					View all admin actions, support session activity, and platform events
				</p>
			</div>
			<Suspense fallback={<AuditLogSkeleton />}>
				<AuditLogData />
			</Suspense>
		</div>
	);
}

/**
 * Loading skeleton for audit log viewer
 */
function AuditLogSkeleton() {
	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-4" />
							</div>
							<Skeleton className="h-8 w-16 mb-1" />
							<Skeleton className="h-3 w-20" />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="p-4">
					<div className="flex gap-4">
						<Skeleton className="h-10 flex-1" />
						<Skeleton className="h-10 w-[200px]" />
						<Skeleton className="h-10 w-[200px]" />
						<Skeleton className="h-10 w-24" />
					</div>
				</CardContent>
			</Card>

			{/* Log List */}
			<Card>
				<CardContent className="p-6">
					<Skeleton className="h-6 w-32 mb-4" />
					<div className="space-y-3">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-32 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}




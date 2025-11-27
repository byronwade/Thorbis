/**
 * Internal Analytics Dashboard Skeleton
 *
 * Loading state for the internal analytics dashboard.
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function InternalAnalyticsSkeleton() {
	return (
		<div className="space-y-6">
			{/* Overview Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-[100px]" />
							<Skeleton className="h-4 w-4 rounded" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-[80px] mb-2" />
							<Skeleton className="h-3 w-[140px]" />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Tabs */}
			<div className="space-y-4">
				<Skeleton className="h-10 w-full max-w-md" />

				{/* Overview Content */}
				<div className="grid gap-4 md:grid-cols-2">
					{/* Slow API Calls Card */}
					<Card>
						<CardHeader>
							<Skeleton className="h-5 w-[150px] mb-2" />
							<Skeleton className="h-4 w-[200px]" />
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{[...Array(5)].map((_, i) => (
									<div key={i} className="flex justify-between items-center">
										<Skeleton className="h-4 w-[200px]" />
										<Skeleton className="h-4 w-[60px]" />
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Failed Actions Card */}
					<Card>
						<CardHeader>
							<Skeleton className="h-5 w-[120px] mb-2" />
							<Skeleton className="h-4 w-[180px]" />
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{[...Array(5)].map((_, i) => (
									<div key={i} className="flex justify-between items-center">
										<div className="space-y-1">
											<Skeleton className="h-4 w-[120px]" />
											<Skeleton className="h-3 w-[80px]" />
										</div>
										<Skeleton className="h-4 w-[100px]" />
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

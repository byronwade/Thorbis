"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CommunicationStatsSkeleton() {
	return (
		<div className="flex h-full w-full flex-col gap-6 p-6">
			<div className="space-y-2">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-4 w-96" />
			</div>

			{/* Stats Cards Skeleton */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className="h-4 w-24" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-16" />
							<Skeleton className="mt-2 h-3 w-32" />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Charts Skeleton */}
			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-48" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-64 w-full" />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-48" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-64 w-full" />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}


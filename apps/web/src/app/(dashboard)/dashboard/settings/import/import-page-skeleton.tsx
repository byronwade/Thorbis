import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ImportPageSkeleton() {
	return (
		<div className="flex h-full flex-col">
			<div className="flex-1 overflow-auto">
				<div className="container max-w-7xl mx-auto py-6 space-y-6">
					{/* Header Skeleton */}
					<div className="space-y-2">
						<Skeleton className="h-9 w-48" />
						<Skeleton className="h-5 w-96" />
					</div>

					{/* Entity Cards Skeleton */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{[1, 2, 3, 4, 5].map((i) => (
							<Card key={i}>
								<CardHeader>
									<div className="flex items-start gap-4">
										<Skeleton className="h-10 w-10 rounded-lg" />
										<div className="flex-1 space-y-2">
											<Skeleton className="h-6 w-24" />
											<Skeleton className="h-4 w-full" />
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<Skeleton className="h-10 w-full" />
								</CardContent>
							</Card>
						))}
					</div>

					{/* History Card Skeleton */}
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-4 w-48" />
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-center py-12">
								<Skeleton className="h-32 w-32 rounded-full" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ApiUsageSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<Skeleton className="h-9 w-64" />
					<Skeleton className="mt-2 h-5 w-96" />
				</div>
				<Skeleton className="h-6 w-32" />
			</div>

			{/* Overview Stats */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					<Card key={i}>
						<CardHeader className="pb-3">
							<Skeleton className="h-4 w-32" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-9 w-24" />
							<Skeleton className="mt-2 h-3 w-40" />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Alert Card */}
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-64" />
					<Skeleton className="mt-2 h-4 w-96" />
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{[...Array(2)].map((_, i) => (
							<div
								key={i}
								className="flex items-center justify-between rounded-lg border p-4"
							>
								<div className="flex-1">
									<Skeleton className="h-5 w-40" />
									<Skeleton className="mt-2 h-4 w-32" />
								</div>
								<Skeleton className="h-2 w-32" />
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Health Status */}
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-48" />
					<Skeleton className="mt-2 h-4 w-72" />
				</CardHeader>
				<CardContent>
					<div className="mb-4 flex gap-4">
						<Skeleton className="h-5 w-24" />
						<Skeleton className="h-5 w-24" />
						<Skeleton className="h-5 w-24" />
					</div>
					<div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
						{[...Array(12)].map((_, i) => (
							<Skeleton key={i} className="h-10 w-full" />
						))}
					</div>
				</CardContent>
			</Card>

			{/* Usage Cards */}
			{[...Array(3)].map((_, i) => (
				<Card key={i}>
					<CardHeader>
						<Skeleton className="h-6 w-40" />
						<Skeleton className="mt-2 h-4 w-64" />
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{[...Array(3)].map((_, j) => (
								<div key={j} className="rounded-lg border p-4">
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<Skeleton className="h-5 w-48" />
											<Skeleton className="mt-2 h-4 w-64" />
										</div>
										<Skeleton className="h-2 w-40" />
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			))}

			{/* Cost Breakdown */}
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-48" />
					<Skeleton className="mt-2 h-4 w-56" />
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="flex items-center justify-between">
								<div className="flex-1">
									<Skeleton className="h-5 w-32" />
									<Skeleton className="mt-1 h-4 w-24" />
								</div>
								<div className="flex items-center gap-4">
									<Skeleton className="h-2 w-32" />
									<Skeleton className="h-5 w-20" />
								</div>
							</div>
						))}
						<div className="mt-4 flex items-center justify-between border-t pt-4">
							<Skeleton className="h-6 w-48" />
							<Skeleton className="h-6 w-24" />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

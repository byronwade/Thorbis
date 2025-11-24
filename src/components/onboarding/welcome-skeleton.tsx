import { Skeleton } from "@/components/ui/skeleton";

export function WelcomeSkeleton() {
	return (
		<div className="flex h-full flex-col bg-background">
			{/* Header with Progress */}
			<div className="bg-background/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-4">
				<div className="max-w-3xl mx-auto">
					<div className="flex items-center gap-4 mb-4">
						<Skeleton className="h-10 w-10 rounded-full" />
						<div className="flex-1">
							<Skeleton className="h-5 w-40 mb-1" />
							<Skeleton className="h-4 w-56" />
						</div>
					</div>

					{/* Progress Bar */}
					<div className="space-y-2">
						<Skeleton className="h-1.5 w-full rounded-full" />
						<div className="flex justify-between">
							{Array.from({ length: 7 }).map((_, i) => (
								<Skeleton key={i} className="h-4 w-16" />
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Step Content */}
			<div className="flex-1 overflow-y-auto">
				<div className="p-6 max-w-3xl mx-auto space-y-6">
					<div>
						<Skeleton className="h-7 w-64 mb-2" />
						<Skeleton className="h-4 w-96" />
					</div>

					<div className="space-y-4">
						<Skeleton className="h-10 w-full" />
						<div className="grid gap-4 sm:grid-cols-2">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>
						<Skeleton className="h-10 w-full" />
						<div className="grid gap-4 sm:grid-cols-3">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>
					</div>
				</div>
			</div>

			{/* Footer Navigation */}
			<div className="bg-background/80 backdrop-blur-xl sticky bottom-0 z-40 px-6 py-4">
				<div className="flex items-center justify-between max-w-3xl mx-auto">
					<Skeleton className="h-10 w-24" />
					<Skeleton className="h-10 w-32" />
				</div>
			</div>
		</div>
	);
}

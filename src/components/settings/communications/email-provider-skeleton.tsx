import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function EmailProviderSkeleton() {
	return (
		<div className="space-y-6">
			<div>
				<Skeleton className="h-8 w-64 mb-2" />
				<Skeleton className="h-4 w-96" />
			</div>

			{/* Current Status Card */}
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-48" />
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Skeleton className="h-12 w-12 rounded-full" />
							<div className="space-y-2">
								<Skeleton className="h-5 w-32" />
								<Skeleton className="h-4 w-48" />
							</div>
						</div>
						<Skeleton className="h-6 w-20" />
					</div>
				</CardContent>
			</Card>

			{/* Provider Selection Card */}
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-48 mb-2" />
					<Skeleton className="h-4 w-96" />
				</CardHeader>
				<CardContent className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="p-4 border-2 rounded-lg space-y-4">
							<div className="flex items-start gap-3">
								<Skeleton className="h-10 w-10 rounded-lg" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-5 w-48" />
									<Skeleton className="h-4 w-full" />
								</div>
							</div>
							<div className="space-y-2">
								{[1, 2, 3].map((j) => (
									<Skeleton key={j} className="h-4 w-full" />
								))}
							</div>
						</div>
					))}
				</CardContent>
			</Card>

			{/* Action Buttons */}
			<div className="flex justify-between">
				<Skeleton className="h-4 w-48" />
				<Skeleton className="h-10 w-32" />
			</div>
		</div>
	);
}

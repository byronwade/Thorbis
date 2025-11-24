import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PaymentSettingsSkeleton() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-4 w-96" />
			</div>

			{/* Payment processors skeleton */}
			<div className="grid gap-4 md:grid-cols-2">
				{[1, 2, 3].map((i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-4 w-48" />
						</CardHeader>
						<CardContent className="space-y-4">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-32" />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Payout settings skeleton */}
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-32" />
					<Skeleton className="h-4 w-64" />
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-3">
						{[1, 2, 3].map((i) => (
							<Skeleton key={i} className="h-24 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

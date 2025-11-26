import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AISettingsSkeleton() {
	return (
		<div className="space-y-6 p-6">
			<div>
				<Skeleton className="h-8 w-48 mb-2" />
				<Skeleton className="h-4 w-96" />
			</div>

			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-32" />
					<Skeleton className="h-4 w-64" />
				</CardHeader>
				<CardContent className="space-y-4">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="flex items-center justify-between">
							<div className="space-y-1">
								<Skeleton className="h-5 w-40" />
								<Skeleton className="h-4 w-56" />
							</div>
							<Skeleton className="h-10 w-32" />
						</div>
					))}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-32" />
				</CardHeader>
				<CardContent className="grid gap-4 sm:grid-cols-2">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<div
							key={i}
							className="flex items-center justify-between p-3 border rounded-lg"
						>
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-6 w-10" />
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WelcomeSkeleton() {
	return (
		<div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
			<Card>
				<CardHeader>
					<Skeleton className="h-8 w-48" />
					<Skeleton className="mt-2 h-4 w-64" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-4 w-full" />
					<Skeleton className="mt-2 h-4 w-3/4" />
				</CardContent>
			</Card>
		</div>
	);
}

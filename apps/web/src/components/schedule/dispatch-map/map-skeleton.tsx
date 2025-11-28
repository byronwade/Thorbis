import { Skeleton } from "@/components/ui/skeleton";

export function DispatchMapSkeleton() {
	return (
		<div className="relative h-full w-full bg-muted/30">
			<Skeleton className="absolute inset-0" />
			<div className="absolute left-4 top-4 w-80">
				<Skeleton className="h-[500px] rounded-lg" />
			</div>
		</div>
	);
}

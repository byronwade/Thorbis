import { Suspense } from "react";
import { AICallsContent } from "@/components/ai/ai-calls-content";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
	title: "AI Calls | Thorbis",
	description: "AI-powered phone call automation and management",
};

function AICallsSkeleton() {
	return (
		<div className="flex flex-col h-full p-4 space-y-4">
			<div className="grid grid-cols-3 gap-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="p-4 border rounded-lg">
						<Skeleton className="h-4 w-20 mb-2" />
						<Skeleton className="h-8 w-16" />
					</div>
				))}
			</div>
			<div className="border rounded-lg divide-y">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="p-4 flex items-center gap-4">
						<Skeleton className="size-10 rounded-full" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-4 w-40" />
							<Skeleton className="h-3 w-24" />
						</div>
						<Skeleton className="h-8 w-24" />
					</div>
				))}
			</div>
		</div>
	);
}

export default function AICallsPage() {
	return (
		<Suspense fallback={<AICallsSkeleton />}>
			<AICallsContent />
		</Suspense>
	);
}

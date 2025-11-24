import { Suspense } from "react";
import { AITextsContent } from "@/components/ai/ai-texts-content";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
	title: "AI Texts | Thorbis",
	description: "AI-powered SMS automation and management",
};

function AITextsSkeleton() {
	return (
		<div className="flex flex-col h-full p-4 space-y-4">
			<div className="grid grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="p-4 border rounded-lg">
						<Skeleton className="h-4 w-20 mb-2" />
						<Skeleton className="h-8 w-16" />
					</div>
				))}
			</div>
			<div className="border rounded-lg divide-y">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="p-4 flex items-center gap-4">
						<Skeleton className="size-10 rounded-full" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-4 w-40" />
							<Skeleton className="h-3 w-64" />
						</div>
						<Skeleton className="h-6 w-16" />
					</div>
				))}
			</div>
		</div>
	);
}

export default function AITextsPage() {
	return (
		<Suspense fallback={<AITextsSkeleton />}>
			<AITextsContent />
		</Suspense>
	);
}

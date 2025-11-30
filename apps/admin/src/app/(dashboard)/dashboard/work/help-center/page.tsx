import { Suspense } from "react";
import { getKBArticles, getKBCategories, getHelpCenterStats } from "@/actions/help-center";
import { HelpCenterManager } from "@/components/work/help-center-manager";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Help Center Management Page
 *
 * Manage knowledge base articles and categories.
 */
async function HelpCenterData() {
	const [articlesResult, categoriesResult, statsResult] = await Promise.all([
		getKBArticles(50),
		getKBCategories(),
		getHelpCenterStats(),
	]);

	if (articlesResult.error || categoriesResult.error || statsResult.error) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{articlesResult.error || categoriesResult.error || statsResult.error || "Failed to load help center data"}
				</p>
			</div>
		);
	}

	return (
		<HelpCenterManager
			initialArticles={articlesResult.data || []}
			initialCategories={categoriesResult.data || []}
			initialStats={statsResult.data || {
				total_articles: 0,
				published_articles: 0,
				total_views: 0,
				total_categories: 0,
			}}
		/>
	);
}

export default function HelpCenterPage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Help Center</h1>
				<p className="text-muted-foreground text-sm">
					Manage knowledge base articles, categories, and documentation
				</p>
			</div>
			<Suspense fallback={<HelpCenterSkeleton />}>
				<HelpCenterData />
			</Suspense>
		</div>
	);
}

/**
 * Loading skeleton
 */
function HelpCenterSkeleton() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<Skeleton className="h-4 w-24 mb-2" />
							<Skeleton className="h-8 w-16 mb-1" />
							<Skeleton className="h-3 w-20" />
						</CardContent>
					</Card>
				))}
			</div>
			<Card>
				<CardContent className="p-6">
					<Skeleton className="h-6 w-48 mb-4" />
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={i} className="h-20 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent className="p-6">
					<Skeleton className="h-10 w-full mb-4" />
					<div className="space-y-2">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-16 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

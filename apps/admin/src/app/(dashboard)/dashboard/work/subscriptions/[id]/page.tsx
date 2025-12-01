import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getSubscriptionById } from "@/actions/billing";
import { SubscriptionDetailTabs } from "@/components/work/subscription-detail-tabs";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Subscription Detail Page
 * 
 * Shows comprehensive subscription information with tabs.
 */
async function SubscriptionDetailData({ subscriptionId }: { subscriptionId: string }) {
	const result = await getSubscriptionById(subscriptionId);

	if (result.error || !result.data) {
		notFound();
	}

	return <SubscriptionDetailTabs subscription={result.data} />;
}

export default function SubscriptionDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	return (
		<div className="flex flex-col">
			<Suspense
				fallback={
					<div className="space-y-6">
						<div className="space-y-2">
							<Skeleton className="h-8 w-64" />
							<Skeleton className="h-4 w-96" />
						</div>
						<Skeleton className="h-96 w-full" />
					</div>
				}
			>
				<SubscriptionDetailDataWrapper params={params} />
			</Suspense>
		</div>
	);
}

async function SubscriptionDetailDataWrapper({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <SubscriptionDetailData subscriptionId={id} />;
}




import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getUserById } from "@/actions/users";
import { UserDetailTabs } from "@/components/work/user-detail-tabs";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * User Detail Page
 * 
 * Shows comprehensive user information with tabs for:
 * - Overview
 * - Activity
 * - Billing
 * - Security
 * - Settings
 */
async function UserDetailData({ userId }: { userId: string }) {
	const result = await getUserById(userId);

	if (result.error || !result.data) {
		notFound();
	}

	return <UserDetailTabs user={result.data} />;
}

export default function UserDetailPage({
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
				<UserDetailDataWrapper params={params} />
			</Suspense>
		</div>
	);
}

async function UserDetailDataWrapper({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <UserDetailData userId={id} />;
}


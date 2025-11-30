import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCompanyById } from "@/actions/companies";
import { CompanyDetailTabs } from "@/components/work/company-detail-tabs";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Company Detail Page
 * 
 * Shows comprehensive company information with tabs for:
 * - Overview
 * - Users
 * - Billing
 * - Activity
 * - Settings
 */
async function CompanyDetailData({ companyId }: { companyId: string }) {
	const result = await getCompanyById(companyId);

	if (result.error || !result.data) {
		notFound();
	}

	return <CompanyDetailTabs company={result.data} />;
}

export default function CompanyDetailPage({
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
				<CompanyDetailDataWrapper params={params} />
			</Suspense>
		</div>
	);
}

async function CompanyDetailDataWrapper({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <CompanyDetailData companyId={id} />;
}


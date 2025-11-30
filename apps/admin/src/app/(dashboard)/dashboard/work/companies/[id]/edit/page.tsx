import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getCompanyById, updateCompany } from "@/actions/companies";
import { CompanyEditForm } from "@/components/work/company-edit-form";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Company Edit Page
 * 
 * Allows admins to edit company information.
 */
async function CompanyEditData({ companyId }: { companyId: string }) {
	const result = await getCompanyById(companyId);

	if (result.error || !result.data) {
		notFound();
	}

	return <CompanyEditForm company={result.data} />;
}

export default function CompanyEditPage({
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
				<CompanyEditDataWrapper params={params} />
			</Suspense>
		</div>
	);
}

async function CompanyEditDataWrapper({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <CompanyEditData companyId={id} />;
}


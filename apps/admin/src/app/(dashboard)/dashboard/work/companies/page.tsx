import { Suspense } from "react";
import { CompaniesTable } from "@/components/work/companies-table";
import { getCompaniesWithStats } from "@/actions/companies";
import { CompaniesTableSkeleton } from "@/components/work/companies-table-skeleton";

/**
 * Companies Management Page
 * 
 * Displays all companies on the platform with stats and management capabilities.
 */
async function CompaniesData() {
	const result = await getCompaniesWithStats(100);

	if (result.error || !result.data) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{result.error || "Failed to load companies"}
				</p>
			</div>
		);
	}

	// Transform CompanyStats to Company type
	const companies = result.data.map((stats) => ({
		id: stats.id,
		name: stats.name,
		email: stats.email || "",
		phone: stats.phone,
		plan: stats.plan as "starter" | "professional" | "enterprise",
		status: stats.status as "active" | "trial" | "suspended" | "cancelled",
		usersCount: stats.users_count,
		jobsCount: stats.jobs_count,
		monthlyRevenue: stats.total_revenue / 100, // Convert cents to dollars
		createdAt: stats.created_at,
	}));

	return (
		<CompaniesTable
			companies={companies}
			totalCount={companies.length}
			showRefresh
		/>
	);
}

export default function CompaniesPage() {
	return (
		<div className="flex flex-col">
			<Suspense fallback={<CompaniesTableSkeleton />}>
				<CompaniesData />
			</Suspense>
		</div>
	);
}

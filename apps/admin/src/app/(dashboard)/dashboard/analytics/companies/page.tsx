import { Suspense } from "react";
import { getCompaniesWithStats } from "@/actions/companies";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { formatNumber } from "@/lib/formatters";

/**
 * Company Analytics Page
 *
 * Analytics overview across all companies.
 */
async function CompanyAnalyticsData() {
	const result = await getCompaniesWithStats(50);

	if (result.error || !result.data) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{result.error || "Failed to load company analytics"}
				</p>
			</div>
		);
	}

	const companies = result.data || [];
	const totalRevenue = companies.reduce((sum, c) => sum + c.total_revenue, 0);
	const totalJobs = companies.reduce((sum, c) => sum + c.jobs_count, 0);
	const totalInvoices = companies.reduce((sum, c) => sum + c.invoices_count, 0);
	const avgRevenuePerCompany = companies.length > 0 ? totalRevenue / companies.length : 0;

	return (
		<div className="space-y-6">
			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-muted-foreground">Total Companies</span>
							<Building2 className="h-4 w-4 text-muted-foreground" />
						</div>
						<p className="text-2xl font-bold">{companies.length}</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-muted-foreground">Total Revenue</span>
							<Building2 className="h-4 w-4 text-muted-foreground" />
						</div>
						<p className="text-2xl font-bold">${formatNumber(totalRevenue, { decimals: 0 })}</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-muted-foreground">Total Jobs</span>
							<Building2 className="h-4 w-4 text-muted-foreground" />
						</div>
						<p className="text-2xl font-bold">{formatNumber(totalJobs)}</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-muted-foreground">Avg Revenue/Company</span>
							<Building2 className="h-4 w-4 text-muted-foreground" />
						</div>
						<p className="text-2xl font-bold">${formatNumber(avgRevenuePerCompany, { decimals: 0 })}</p>
					</CardContent>
				</Card>
			</div>

			{/* Top Companies */}
			<Card>
				<CardContent className="p-6">
					<h3 className="text-lg font-semibold mb-4">Top Companies by Revenue</h3>
					<div className="space-y-3">
						{companies
							.sort((a, b) => b.total_revenue - a.total_revenue)
							.slice(0, 10)
							.map((company) => (
								<Link
									key={company.id}
									href={`/dashboard/work/companies/${company.id}`}
									className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
								>
									<div>
										<p className="font-medium">{company.name}</p>
										<p className="text-sm text-muted-foreground">
											{formatNumber(company.jobs_count)} jobs • {formatNumber(company.invoices_count)} invoices
										</p>
									</div>
									<div className="text-right">
										<p className="font-bold">${formatNumber(company.total_revenue, { decimals: 0 })}</p>
										<p className="text-xs text-muted-foreground">Revenue</p>
									</div>
								</Link>
							))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default function CompanyAnalyticsPage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Company Analytics</h1>
				<p className="text-muted-foreground text-sm">
					Analytics overview across all companies
				</p>
			</div>
			<Suspense fallback={<CompanyAnalyticsSkeleton />}>
				<CompanyAnalyticsData />
			</Suspense>
		</div>
	);
}

/**
 * Loading skeleton
 */
function CompanyAnalyticsSkeleton() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<Skeleton className="h-4 w-24 mb-2" />
							<Skeleton className="h-8 w-16" />
						</CardContent>
					</Card>
				))}
			</div>
			<Card>
				<CardContent className="p-6">
					<Skeleton className="h-6 w-48 mb-4" />
					<div className="space-y-3">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-16 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}




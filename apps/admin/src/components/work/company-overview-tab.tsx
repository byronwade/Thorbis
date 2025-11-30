import { Building2, Users, Briefcase, FileText, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatNumber } from "@/lib/formatters";
import { CompanyStatusBadge, PlanBadge } from "@/components/ui/status-badge";

type CompanyOverviewTabProps = {
	company: any;
};

/**
 * Company Overview Tab
 * 
 * Displays key company information and metrics.
 */
export function CompanyOverviewTab({ company }: CompanyOverviewTabProps) {
	return (
		<div className="space-y-6">
			{/* Key Metrics */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Users</CardTitle>
						<Users className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(company.users_count || 0)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Jobs</CardTitle>
						<Briefcase className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(company.jobs_count || 0)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Invoices</CardTitle>
						<FileText className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatNumber(company.invoices_count || 0)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatCurrency((company.total_revenue || 0) / 100, { decimals: 0 })}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Company Information */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Company Information</CardTitle>
						<CardDescription>Basic company details</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<label className="text-muted-foreground text-sm font-medium">Name</label>
							<p className="text-sm">{company.name}</p>
						</div>
						{company.owner_email && (
							<div className="space-y-2">
								<label className="text-muted-foreground text-sm font-medium">Email</label>
								<p className="text-sm">{company.owner_email}</p>
							</div>
						)}
						{company.owner_phone && (
							<div className="space-y-2">
								<label className="text-muted-foreground text-sm font-medium">Phone</label>
								<p className="text-sm">{company.owner_phone}</p>
							</div>
						)}
						<div className="space-y-2">
							<label className="text-muted-foreground text-sm font-medium">Status</label>
							<div>
								<CompanyStatusBadge status={company.status || "active"} />
							</div>
						</div>
						<div className="space-y-2">
							<label className="text-muted-foreground text-sm font-medium">Plan</label>
							<div>
								<PlanBadge plan={company.subscription_tier || "free"} />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Subscription Details</CardTitle>
						<CardDescription>Billing and subscription information</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{company.stripe_subscription_status && (
							<div className="space-y-2">
								<label className="text-muted-foreground text-sm font-medium">Subscription Status</label>
								<p className="text-sm capitalize">{company.stripe_subscription_status}</p>
							</div>
						)}
						{company.stripe_subscription_id && (
							<div className="space-y-2">
								<label className="text-muted-foreground text-sm font-medium">Stripe Subscription ID</label>
								<p className="font-mono text-xs">{company.stripe_subscription_id}</p>
							</div>
						)}
						{company.stripe_customer_id && (
							<div className="space-y-2">
								<label className="text-muted-foreground text-sm font-medium">Stripe Customer ID</label>
								<p className="font-mono text-xs">{company.stripe_customer_id}</p>
							</div>
						)}
						{company.trial_ends_at && (
							<div className="space-y-2">
								<label className="text-muted-foreground text-sm font-medium">Trial Ends</label>
								<p className="text-sm">{formatDate(company.trial_ends_at)}</p>
							</div>
						)}
						{company.subscription_current_period_end && (
							<div className="space-y-2">
								<label className="text-muted-foreground text-sm font-medium">Current Period Ends</label>
								<p className="text-sm">{formatDate(company.subscription_current_period_end)}</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Dates */}
			<Card>
				<CardHeader>
					<CardTitle>Timeline</CardTitle>
					<CardDescription>Important dates</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center gap-4">
						<Calendar className="text-muted-foreground h-4 w-4" />
						<div>
							<label className="text-muted-foreground text-sm font-medium">Created</label>
							<p className="text-sm">{formatDate(company.created_at)}</p>
						</div>
					</div>
					{company.updated_at && (
						<div className="flex items-center gap-4">
							<Calendar className="text-muted-foreground h-4 w-4" />
							<div>
								<label className="text-muted-foreground text-sm font-medium">Last Updated</label>
								<p className="text-sm">{formatDate(company.updated_at)}</p>
							</div>
						</div>
					)}
					{company.onboarding_completed_at && (
						<div className="flex items-center gap-4">
							<Calendar className="text-muted-foreground h-4 w-4" />
							<div>
								<label className="text-muted-foreground text-sm font-medium">Onboarding Completed</label>
								<p className="text-sm">{formatDate(company.onboarding_completed_at)}</p>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}


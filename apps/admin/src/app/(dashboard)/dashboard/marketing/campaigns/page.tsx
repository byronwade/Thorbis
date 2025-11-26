import { Plus, Target, Mail, MousePointer, Eye, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@stratos/ui";
import { CampaignsTable } from "@/components/marketing/campaigns-table";
import { getCampaigns, getCampaignStats } from "@/lib/queries/campaigns";

/**
 * Marketing Campaigns Page
 *
 * Lists all email campaigns with stats and actions.
 * Fetches real data from the database.
 */

export default async function CampaignsPage() {
	// Fetch real data in parallel
	const [campaigns, campaignStats] = await Promise.all([
		getCampaigns(),
		getCampaignStats(),
	]);

	const stats = {
		totalCampaigns: campaignStats.totalCampaigns,
		activeCampaigns: campaignStats.activeCampaigns,
		totalSent: campaignStats.totalSent,
		deliveryRate: campaignStats.totalSent > 0
			? ((campaignStats.totalDelivered / campaignStats.totalSent) * 100).toFixed(1)
			: "0",
		openRate: campaignStats.avgOpenRate.toFixed(1),
		clickRate: campaignStats.avgClickRate.toFixed(1),
		totalRevenue: campaignStats.totalRevenue,
	};

	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Email Campaigns</h1>
					<p className="text-muted-foreground">Create and manage email marketing campaigns</p>
				</div>
				<Button asChild>
					<Link href="/dashboard/marketing/campaigns/new">
						<Plus className="mr-2 size-4" />
						New Campaign
					</Link>
				</Button>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-2">
						<div className="rounded-md bg-blue-500/10 p-2">
							<Target className="h-4 w-4 text-blue-600" />
						</div>
						<p className="text-sm text-muted-foreground">Total Campaigns</p>
					</div>
					<p className="mt-2 text-2xl font-bold">{stats.totalCampaigns}</p>
					<p className="text-xs text-muted-foreground">{stats.activeCampaigns} active</p>
				</div>

				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-2">
						<div className="rounded-md bg-purple-500/10 p-2">
							<Mail className="h-4 w-4 text-purple-600" />
						</div>
						<p className="text-sm text-muted-foreground">Emails Sent</p>
					</div>
					<p className="mt-2 text-2xl font-bold">{stats.totalSent.toLocaleString()}</p>
					<p className="text-xs text-muted-foreground">{stats.deliveryRate}% delivered</p>
				</div>

				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-2">
						<div className="rounded-md bg-amber-500/10 p-2">
							<Eye className="h-4 w-4 text-amber-600" />
						</div>
						<p className="text-sm text-muted-foreground">Open Rate</p>
					</div>
					<p className="mt-2 text-2xl font-bold">{stats.openRate}%</p>
					<p className="text-xs text-muted-foreground">Industry avg: 21.5%</p>
				</div>

				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-2">
						<div className="rounded-md bg-emerald-500/10 p-2">
							<MousePointer className="h-4 w-4 text-emerald-600" />
						</div>
						<p className="text-sm text-muted-foreground">Click Rate</p>
					</div>
					<p className="mt-2 text-2xl font-bold">{stats.clickRate}%</p>
					<p className="text-xs text-muted-foreground">Industry avg: 2.3%</p>
				</div>

				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-2">
						<div className="rounded-md bg-green-500/10 p-2">
							<DollarSign className="h-4 w-4 text-green-600" />
						</div>
						<p className="text-sm text-muted-foreground">Revenue</p>
					</div>
					<p className="mt-2 text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
					<p className="text-xs text-muted-foreground">From campaigns</p>
				</div>
			</div>

			{/* Campaigns Table */}
			<div className="rounded-lg border bg-card">
				<CampaignsTable
					campaigns={campaigns}
					totalCount={campaigns.length}
					showRefresh
				/>
			</div>
		</div>
	);
}

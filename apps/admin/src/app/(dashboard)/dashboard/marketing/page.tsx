import {
	ArrowRight,
	BarChart3,
	Clock,
	Eye,
	Globe,
	Mail,
	MousePointer,
	Plus,
	Send,
	Target,
	Users,
} from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@stratos/ui";
import { getCampaigns, getCampaignStats } from "@/lib/queries/campaigns";
import { getWaitlistStats } from "@/actions/waitlist";

/**
 * Marketing Dashboard
 *
 * Overview of marketing activities including:
 * - Email campaigns
 * - Waitlist management
 * - Website analytics
 */

export default async function MarketingPage() {
	// Fetch real data in parallel
	const [campaigns, campaignStatsResult, waitlistStatsResult] = await Promise.all([
		getCampaigns({ limit: 3 }),
		getCampaignStats(),
		getWaitlistStats(),
	]);

	const waitlistStats = waitlistStatsResult.success && waitlistStatsResult.data
		? waitlistStatsResult.data
		: { totalSubscribers: 0, activeSubscribers: 0, recentSignups: 0, growthRate: 0, unsubscribedCount: 0 };

	const stats = {
		totalCampaigns: campaignStatsResult.totalCampaigns,
		activeCampaigns: campaignStatsResult.activeCampaigns,
		totalSent: campaignStatsResult.totalSent,
		deliveryRate: campaignStatsResult.totalSent > 0
			? ((campaignStatsResult.totalDelivered / campaignStatsResult.totalSent) * 100).toFixed(1)
			: "0",
		openRate: campaignStatsResult.avgOpenRate.toFixed(1),
		clickRate: campaignStatsResult.avgClickRate.toFixed(1),
		totalRevenue: campaignStatsResult.totalRevenue,
	};

	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Marketing</h1>
					<p className="text-muted-foreground">Platform marketing and email campaigns</p>
				</div>
				<Button asChild>
					<Link href="/dashboard/marketing/campaigns/new">
						<Plus className="mr-2 size-4" />
						New Campaign
					</Link>
				</Button>
			</div>

			{/* Main Stats */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-2">
						<div className="rounded-md bg-emerald-500/10 p-2">
							<Users className="h-4 w-4 text-emerald-600" />
						</div>
						<p className="text-sm text-muted-foreground">Waitlist Subscribers</p>
					</div>
					<p className="mt-2 text-2xl font-bold">{waitlistStats.totalSubscribers.toLocaleString()}</p>
					<p className="text-xs text-emerald-600">
						+{waitlistStats.recentSignups} this week ({waitlistStats.growthRate}%)
					</p>
				</div>

				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-2">
						<div className="rounded-md bg-purple-500/10 p-2">
							<Send className="h-4 w-4 text-purple-600" />
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
						<p className="text-sm text-muted-foreground">Avg. Open Rate</p>
					</div>
					<p className="mt-2 text-2xl font-bold">{stats.openRate}%</p>
					<p className="text-xs text-muted-foreground">Industry avg: 21.5%</p>
				</div>

				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-2">
						<div className="rounded-md bg-blue-500/10 p-2">
							<MousePointer className="h-4 w-4 text-blue-600" />
						</div>
						<p className="text-sm text-muted-foreground">Avg. Click Rate</p>
					</div>
					<p className="mt-2 text-2xl font-bold">{stats.clickRate}%</p>
					<p className="text-xs text-muted-foreground">Industry avg: 2.3%</p>
				</div>
			</div>

			{/* Quick Links */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{/* Campaigns Card */}
				<Link
					href="/dashboard/marketing/campaigns"
					className="group flex flex-col rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
				>
					<div className="flex items-start justify-between">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
							<Target className="size-5 text-primary" />
						</div>
						<ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
					</div>
					<h3 className="mt-4 font-semibold">Email Campaigns</h3>
					<p className="mt-1 text-sm text-muted-foreground">
						Create and manage email marketing campaigns
					</p>
					<div className="mt-4 flex items-center gap-4 text-sm">
						<span className="font-medium">{stats.totalCampaigns} total</span>
						{stats.activeCampaigns > 0 && (
							<span className="text-emerald-600">{stats.activeCampaigns} active</span>
						)}
					</div>
				</Link>

				{/* Waitlist Card */}
				<div className="flex flex-col rounded-lg border bg-card p-6">
					<div className="flex items-start justify-between">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
							<Clock className="size-5 text-emerald-600" />
						</div>
					</div>
					<h3 className="mt-4 font-semibold">Waitlist</h3>
					<p className="mt-1 text-sm text-muted-foreground">
						Manage waitlist subscribers via Resend
					</p>
					<div className="mt-4 flex items-center gap-4 text-sm">
						<span className="font-medium">{waitlistStats.activeSubscribers.toLocaleString()} active</span>
						<span className="text-emerald-600">+{waitlistStats.growthRate}% growth</span>
					</div>
					<Button variant="outline" size="sm" className="mt-4" asChild>
						<Link href="/dashboard/marketing/campaigns/new">
							<Mail className="mr-2 size-4" />
							Send to Waitlist
						</Link>
					</Button>
				</div>

				{/* Website Analytics Card */}
				<Link
					href="/dashboard/marketing/website"
					className="group flex flex-col rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
				>
					<div className="flex items-start justify-between">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
							<Globe className="size-5 text-blue-600" />
						</div>
						<ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
					</div>
					<h3 className="mt-4 font-semibold">Website</h3>
					<p className="mt-1 text-sm text-muted-foreground">
						Website analytics and performance
					</p>
					<div className="mt-4 flex items-center gap-4 text-sm">
						<span className="text-muted-foreground">Coming soon</span>
					</div>
				</Link>
			</div>

			{/* Recent Campaigns */}
			<div className="rounded-lg border bg-card">
				<div className="flex items-center justify-between border-b p-4">
					<div className="flex items-center gap-2">
						<BarChart3 className="size-5 text-muted-foreground" />
						<h2 className="font-semibold">Recent Campaigns</h2>
					</div>
					<Button variant="ghost" size="sm" asChild>
						<Link href="/dashboard/marketing/campaigns">
							View all
							<ArrowRight className="ml-2 size-4" />
						</Link>
					</Button>
				</div>
				<div className="divide-y">
					{campaigns.slice(0, 3).map((campaign) => {
						const openRate = campaign.deliveredCount > 0
							? ((campaign.uniqueOpens / campaign.deliveredCount) * 100).toFixed(1)
							: "0";
						const clickRate = campaign.deliveredCount > 0
							? ((campaign.uniqueClicks / campaign.deliveredCount) * 100).toFixed(1)
							: "0";

						return (
							<Link
								key={campaign.id}
								href={`/dashboard/marketing/campaigns/${campaign.id}`}
								className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
							>
								<div className="flex items-center gap-4">
									<div className="rounded-lg bg-muted p-2">
										<Mail className="size-4 text-muted-foreground" />
									</div>
									<div>
										<p className="font-medium">{campaign.name}</p>
										<p className="text-sm text-muted-foreground">{campaign.subject}</p>
									</div>
								</div>
								<div className="flex items-center gap-6 text-sm">
									<div className="text-right">
										<p className="font-medium">{campaign.sentCount.toLocaleString()}</p>
										<p className="text-xs text-muted-foreground">sent</p>
									</div>
									<div className="text-right">
										<p className="font-medium">{openRate}%</p>
										<p className="text-xs text-muted-foreground">opens</p>
									</div>
									<div className="text-right">
										<p className="font-medium">{clickRate}%</p>
										<p className="text-xs text-muted-foreground">clicks</p>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}

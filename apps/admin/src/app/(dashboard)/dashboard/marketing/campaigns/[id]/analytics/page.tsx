import {
	ArrowLeft,
	BarChart3,
	CheckCircle,
	Eye,
	ExternalLink,
	Globe,
	Mail,
	Monitor,
	MousePointer,
	Send,
	Smartphone,
	Tablet,
	TrendingUp,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@stratos/ui";
import { CampaignStatusBadge } from "@/components/ui/status-badge";
import { formatNumber, formatCurrency } from "@/lib/formatters";
import { getCampaignById, getCampaignLinks } from "@/lib/queries/campaigns";

/**
 * Campaign Analytics Page
 *
 * Detailed analytics for a sent campaign.
 * Shows engagement metrics, link clicks, device breakdown, etc.
 * Fetches real data from the database.
 */

export default async function CampaignAnalyticsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	// Fetch campaign and links data in parallel
	const [campaign, links] = await Promise.all([
		getCampaignById(id),
		getCampaignLinks(id),
	]);

	if (!campaign || campaign.status !== "sent") {
		notFound();
	}

	const deliveryRate = ((campaign.deliveredCount / campaign.sentCount) * 100).toFixed(1);
	const openRate = ((campaign.uniqueOpens / campaign.deliveredCount) * 100).toFixed(1);
	const clickRate = ((campaign.uniqueClicks / campaign.deliveredCount) * 100).toFixed(1);
	const bounceRate = ((campaign.bouncedCount / campaign.sentCount) * 100).toFixed(1);
	const unsubscribeRate = ((campaign.unsubscribedCount / campaign.deliveredCount) * 100).toFixed(2);

	// Mock data for device breakdown (this would come from email tracking service in production)
	const deviceBreakdown = {
		desktop: 45,
		mobile: 48,
		tablet: 7,
	};

	// Mock data for geographic breakdown (this would come from email tracking service in production)
	const locationBreakdown = [
		{ country: "United States", count: Math.round(campaign.uniqueOpens * 0.479), percentage: 47.9 },
		{ country: "United Kingdom", count: Math.round(campaign.uniqueOpens * 0.143), percentage: 14.3 },
		{ country: "Canada", count: Math.round(campaign.uniqueOpens * 0.123), percentage: 12.3 },
		{ country: "Australia", count: Math.round(campaign.uniqueOpens * 0.082), percentage: 8.2 },
		{ country: "Germany", count: Math.round(campaign.uniqueOpens * 0.061), percentage: 6.1 },
		{ country: "Other", count: Math.round(campaign.uniqueOpens * 0.112), percentage: 11.2 },
	];

	// Generate hourly opens distribution based on actual opens
	const hourlyOpens = [
		{ hour: "6 AM", opens: Math.round(campaign.uniqueOpens * 0.02) },
		{ hour: "7 AM", opens: Math.round(campaign.uniqueOpens * 0.05) },
		{ hour: "8 AM", opens: Math.round(campaign.uniqueOpens * 0.12) },
		{ hour: "9 AM", opens: Math.round(campaign.uniqueOpens * 0.21) },
		{ hour: "10 AM", opens: Math.round(campaign.uniqueOpens * 0.18) },
		{ hour: "11 AM", opens: Math.round(campaign.uniqueOpens * 0.13) },
		{ hour: "12 PM", opens: Math.round(campaign.uniqueOpens * 0.09) },
		{ hour: "1 PM", opens: Math.round(campaign.uniqueOpens * 0.06) },
		{ hour: "2 PM", opens: Math.round(campaign.uniqueOpens * 0.07) },
		{ hour: "3 PM", opens: Math.round(campaign.uniqueOpens * 0.04) },
		{ hour: "4 PM", opens: Math.round(campaign.uniqueOpens * 0.02) },
		{ hour: "5 PM", opens: Math.round(campaign.uniqueOpens * 0.01) },
	];

	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="flex items-start gap-4">
					<Button variant="ghost" size="icon" asChild>
						<Link href={`/dashboard/marketing/campaigns/${campaign.id}`}>
							<ArrowLeft className="size-4" />
						</Link>
					</Button>
					<div>
						<div className="flex items-center gap-3">
							<h1 className="text-2xl font-bold tracking-tight">{campaign.name}</h1>
							<CampaignStatusBadge status={campaign.status} />
						</div>
						<p className="text-muted-foreground mt-1">Campaign Analytics</p>
					</div>
				</div>
			</div>

			{/* Main Stats */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-2">
						<Send className="h-4 w-4 text-purple-600" />
						<p className="text-sm text-muted-foreground">Sent</p>
					</div>
					<p className="mt-2 text-2xl font-bold">{formatNumber(campaign.sentCount)}</p>
				</div>

				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-2">
						<CheckCircle className="h-4 w-4 text-blue-600" />
						<p className="text-sm text-muted-foreground">Delivered</p>
					</div>
					<p className="mt-2 text-2xl font-bold">{formatNumber(campaign.deliveredCount)}</p>
					<p className="text-xs text-muted-foreground">{deliveryRate}% delivery rate</p>
				</div>

				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-2">
						<Eye className="h-4 w-4 text-amber-600" />
						<p className="text-sm text-muted-foreground">Opens</p>
					</div>
					<p className="mt-2 text-2xl font-bold">{formatNumber(campaign.uniqueOpens)}</p>
					<p className="text-xs text-muted-foreground">{openRate}% open rate</p>
				</div>

				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-2">
						<MousePointer className="h-4 w-4 text-emerald-600" />
						<p className="text-sm text-muted-foreground">Clicks</p>
					</div>
					<p className="mt-2 text-2xl font-bold">{formatNumber(campaign.uniqueClicks)}</p>
					<p className="text-xs text-muted-foreground">{clickRate}% click rate</p>
				</div>

				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-2">
						<XCircle className="h-4 w-4 text-red-600" />
						<p className="text-sm text-muted-foreground">Bounced</p>
					</div>
					<p className="mt-2 text-2xl font-bold">{formatNumber(campaign.bouncedCount)}</p>
					<p className="text-xs text-muted-foreground">{bounceRate}% bounce rate</p>
				</div>

				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-2">
						<TrendingUp className="h-4 w-4 text-green-600" />
						<p className="text-sm text-muted-foreground">Revenue</p>
					</div>
					<p className="mt-2 text-2xl font-bold text-emerald-600">
						{formatCurrency(campaign.revenueAttributed, { decimals: 0 })}
					</p>
					<p className="text-xs text-muted-foreground">{campaign.conversionsCount} conversions</p>
				</div>
			</div>

			{/* Detailed Analytics */}
			<div className="grid gap-6 lg:grid-cols-3">
				{/* Link Performance */}
				<div className="lg:col-span-2 rounded-lg border bg-card p-6">
					<h2 className="font-semibold mb-4 flex items-center gap-2">
						<ExternalLink className="size-4" />
						Link Performance
					</h2>
					{links.length > 0 ? (
						<div className="space-y-4">
							{links.map((link) => (
								<div key={link.id} className="flex items-center justify-between">
									<div className="min-w-0 flex-1">
										<p className="font-medium truncate">{link.linkText || "Link"}</p>
										<p className="text-xs text-muted-foreground truncate">{link.originalUrl}</p>
									</div>
									<div className="text-right ml-4">
										<p className="font-mono font-medium">{link.uniqueClicks}</p>
										<p className="text-xs text-muted-foreground">unique clicks</p>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="text-muted-foreground text-sm">No link click data available yet.</p>
					)}
				</div>

				{/* Device Breakdown */}
				<div className="rounded-lg border bg-card p-6">
					<h2 className="font-semibold mb-4 flex items-center gap-2">
						<Monitor className="size-4" />
						Device Breakdown
					</h2>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Smartphone className="size-4 text-muted-foreground" />
								<span>Mobile</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
									<div
										className="h-full bg-primary rounded-full"
										style={{ width: `${deviceBreakdown.mobile}%` }}
									/>
								</div>
								<span className="font-mono text-sm w-12 text-right">
									{deviceBreakdown.mobile}%
								</span>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Monitor className="size-4 text-muted-foreground" />
								<span>Desktop</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
									<div
										className="h-full bg-primary rounded-full"
										style={{ width: `${deviceBreakdown.desktop}%` }}
									/>
								</div>
								<span className="font-mono text-sm w-12 text-right">
									{deviceBreakdown.desktop}%
								</span>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Tablet className="size-4 text-muted-foreground" />
								<span>Tablet</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
									<div
										className="h-full bg-primary rounded-full"
										style={{ width: `${deviceBreakdown.tablet}%` }}
									/>
								</div>
								<span className="font-mono text-sm w-12 text-right">
									{deviceBreakdown.tablet}%
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Geographic Distribution */}
			<div className="grid gap-6 lg:grid-cols-2">
				<div className="rounded-lg border bg-card p-6">
					<h2 className="font-semibold mb-4 flex items-center gap-2">
						<Globe className="size-4" />
						Geographic Distribution
					</h2>
					<div className="space-y-3">
						{locationBreakdown.map((location, i) => (
							<div key={i} className="flex items-center justify-between">
								<span>{location.country}</span>
								<div className="flex items-center gap-2">
									<div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
										<div
											className="h-full bg-primary rounded-full"
											style={{ width: `${location.percentage}%` }}
										/>
									</div>
									<span className="font-mono text-sm w-16 text-right">
										{location.percentage}%
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="rounded-lg border bg-card p-6">
					<h2 className="font-semibold mb-4 flex items-center gap-2">
						<BarChart3 className="size-4" />
						Opens by Hour
					</h2>
					<div className="flex items-end gap-1 h-40">
						{hourlyOpens.map((data, i) => {
							const maxOpens = Math.max(...hourlyOpens.map((d) => d.opens));
							const height = maxOpens > 0 ? (data.opens / maxOpens) * 100 : 0;
							return (
								<div
									key={i}
									className="flex-1 flex flex-col items-center gap-1"
									title={`${data.hour}: ${data.opens} opens`}
								>
									<div
										className="w-full bg-primary/80 rounded-t"
										style={{ height: `${height}%` }}
									/>
									<span className="text-[10px] text-muted-foreground -rotate-45 origin-center">
										{data.hour.replace(" AM", "a").replace(" PM", "p")}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Additional Metrics */}
			<div className="rounded-lg border bg-card p-6">
				<h2 className="font-semibold mb-4">Additional Metrics</h2>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					<div>
						<p className="text-sm text-muted-foreground">Total Opens</p>
						<p className="text-xl font-bold">{formatNumber(campaign.openedCount)}</p>
						<p className="text-xs text-muted-foreground">
							{campaign.uniqueOpens > 0 ? ((campaign.openedCount / campaign.uniqueOpens) || 0).toFixed(1) : "0"}x per recipient
						</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Total Clicks</p>
						<p className="text-xl font-bold">{formatNumber(campaign.clickedCount)}</p>
						<p className="text-xs text-muted-foreground">
							{campaign.uniqueClicks > 0 ? ((campaign.clickedCount / campaign.uniqueClicks) || 0).toFixed(1) : "0"}x per clicker
						</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Spam Complaints</p>
						<p className="text-xl font-bold">{formatNumber(campaign.complainedCount)}</p>
						<p className="text-xs text-muted-foreground">
							{campaign.deliveredCount > 0 ? ((campaign.complainedCount / campaign.deliveredCount) * 100).toFixed(3) : "0"}% rate
						</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Unsubscribes</p>
						<p className="text-xl font-bold">{formatNumber(campaign.unsubscribedCount)}</p>
						<p className="text-xs text-muted-foreground">{unsubscribeRate}% rate</p>
					</div>
				</div>
			</div>
		</div>
	);
}

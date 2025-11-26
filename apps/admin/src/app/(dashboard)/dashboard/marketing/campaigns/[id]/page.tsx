import {
	ArrowLeft,
	BarChart3,
	Calendar,
	Check,
	CheckCircle,
	Clock,
	Copy,
	Edit,
	Eye,
	Mail,
	MousePointer,
	Pause,
	Play,
	Send,
	Trash2,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@stratos/ui";
import {
	AudienceTypeBadge,
	CampaignStatusBadge,
} from "@/components/ui/status-badge";
import { formatDate, formatNumber, formatCurrency } from "@/lib/formatters";
import { getCampaignById } from "@/lib/queries/campaigns";

/**
 * Campaign Detail Page
 *
 * Shows campaign details, stats, and actions.
 * Fetches real data from the database.
 */

export default async function CampaignDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const campaign = await getCampaignById(id);

	if (!campaign) {
		notFound();
	}

	const deliveryRate = campaign.sentCount > 0
		? ((campaign.deliveredCount / campaign.sentCount) * 100).toFixed(1)
		: "0";
	const openRate = campaign.deliveredCount > 0
		? ((campaign.uniqueOpens / campaign.deliveredCount) * 100).toFixed(1)
		: "0";
	const clickRate = campaign.deliveredCount > 0
		? ((campaign.uniqueClicks / campaign.deliveredCount) * 100).toFixed(1)
		: "0";
	const bounceRate = campaign.sentCount > 0
		? ((campaign.bouncedCount / campaign.sentCount) * 100).toFixed(1)
		: "0";

	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="flex items-start gap-4">
					<Button variant="ghost" size="icon" asChild>
						<Link href="/dashboard/marketing/campaigns">
							<ArrowLeft className="size-4" />
						</Link>
					</Button>
					<div>
						<div className="flex items-center gap-3">
							<h1 className="text-2xl font-bold tracking-tight">{campaign.name}</h1>
							<CampaignStatusBadge status={campaign.status} />
						</div>
						<p className="text-muted-foreground mt-1">{campaign.subject}</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					{campaign.status === "draft" && (
						<>
							<Button variant="outline" asChild>
								<Link href={`/dashboard/marketing/campaigns/${campaign.id}/edit`}>
									<Edit className="mr-2 size-4" />
									Edit
								</Link>
							</Button>
							<Button>
								<Send className="mr-2 size-4" />
								Send Now
							</Button>
						</>
					)}
					{campaign.status === "scheduled" && (
						<>
							<Button variant="outline" asChild>
								<Link href={`/dashboard/marketing/campaigns/${campaign.id}/edit`}>
									<Edit className="mr-2 size-4" />
									Edit
								</Link>
							</Button>
							<Button variant="destructive">
								<XCircle className="mr-2 size-4" />
								Cancel
							</Button>
						</>
					)}
					{campaign.status === "sending" && (
						<Button variant="outline">
							<Pause className="mr-2 size-4" />
							Pause
						</Button>
					)}
					{campaign.status === "paused" && (
						<Button>
							<Play className="mr-2 size-4" />
							Resume
						</Button>
					)}
					{campaign.status === "sent" && (
						<Button variant="outline" asChild>
							<Link href={`/dashboard/marketing/campaigns/${campaign.id}/analytics`}>
								<BarChart3 className="mr-2 size-4" />
								Analytics
							</Link>
						</Button>
					)}
				</div>
			</div>

			{/* Stats Grid */}
			{campaign.status === "sent" && (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
					<div className="rounded-lg border bg-card p-4">
						<div className="flex items-center gap-2">
							<div className="rounded-md bg-purple-500/10 p-2">
								<Send className="h-4 w-4 text-purple-600" />
							</div>
							<p className="text-sm text-muted-foreground">Sent</p>
						</div>
						<p className="mt-2 text-2xl font-bold">{formatNumber(campaign.sentCount)}</p>
					</div>

					<div className="rounded-lg border bg-card p-4">
						<div className="flex items-center gap-2">
							<div className="rounded-md bg-blue-500/10 p-2">
								<CheckCircle className="h-4 w-4 text-blue-600" />
							</div>
							<p className="text-sm text-muted-foreground">Delivered</p>
						</div>
						<p className="mt-2 text-2xl font-bold">{formatNumber(campaign.deliveredCount)}</p>
						<p className="text-xs text-muted-foreground">{deliveryRate}%</p>
					</div>

					<div className="rounded-lg border bg-card p-4">
						<div className="flex items-center gap-2">
							<div className="rounded-md bg-amber-500/10 p-2">
								<Eye className="h-4 w-4 text-amber-600" />
							</div>
							<p className="text-sm text-muted-foreground">Opened</p>
						</div>
						<p className="mt-2 text-2xl font-bold">{formatNumber(campaign.uniqueOpens)}</p>
						<p className="text-xs text-muted-foreground">{openRate}%</p>
					</div>

					<div className="rounded-lg border bg-card p-4">
						<div className="flex items-center gap-2">
							<div className="rounded-md bg-emerald-500/10 p-2">
								<MousePointer className="h-4 w-4 text-emerald-600" />
							</div>
							<p className="text-sm text-muted-foreground">Clicked</p>
						</div>
						<p className="mt-2 text-2xl font-bold">{formatNumber(campaign.uniqueClicks)}</p>
						<p className="text-xs text-muted-foreground">{clickRate}%</p>
					</div>

					<div className="rounded-lg border bg-card p-4">
						<div className="flex items-center gap-2">
							<div className="rounded-md bg-red-500/10 p-2">
								<XCircle className="h-4 w-4 text-red-600" />
							</div>
							<p className="text-sm text-muted-foreground">Bounced</p>
						</div>
						<p className="mt-2 text-2xl font-bold">{formatNumber(campaign.bouncedCount)}</p>
						<p className="text-xs text-muted-foreground">{bounceRate}%</p>
					</div>

					<div className="rounded-lg border bg-card p-4">
						<div className="flex items-center gap-2">
							<div className="rounded-md bg-green-500/10 p-2">
								<Mail className="h-4 w-4 text-green-600" />
							</div>
							<p className="text-sm text-muted-foreground">Revenue</p>
						</div>
						<p className="mt-2 text-2xl font-bold text-emerald-600">
							{formatCurrency(campaign.revenueAttributed, { decimals: 0 })}
						</p>
					</div>
				</div>
			)}

			{/* Campaign Details */}
			<div className="grid gap-6 lg:grid-cols-3">
				{/* Main Details */}
				<div className="lg:col-span-2 space-y-6">
					<div className="rounded-lg border bg-card p-6">
						<h2 className="font-semibold mb-4">Campaign Details</h2>
						<dl className="grid gap-4 sm:grid-cols-2">
							<div>
								<dt className="text-sm text-muted-foreground">From</dt>
								<dd className="font-medium">{campaign.fromName} &lt;{campaign.fromEmail}&gt;</dd>
							</div>
							<div>
								<dt className="text-sm text-muted-foreground">Audience</dt>
								<dd className="font-medium flex items-center gap-2">
									<AudienceTypeBadge audienceType={campaign.audienceType} />
									<span className="text-muted-foreground text-sm">
										({formatNumber(campaign.totalRecipients)} recipients)
									</span>
								</dd>
							</div>
							<div className="sm:col-span-2">
								<dt className="text-sm text-muted-foreground">Subject Line</dt>
								<dd className="font-medium">{campaign.subject}</dd>
							</div>
							{campaign.previewText && (
								<div className="sm:col-span-2">
									<dt className="text-sm text-muted-foreground">Preview Text</dt>
									<dd className="text-muted-foreground">{campaign.previewText}</dd>
								</div>
							)}
							<div>
								<dt className="text-sm text-muted-foreground">Created</dt>
								<dd className="font-medium">{formatDate(campaign.createdAt, "long")}</dd>
							</div>
							{campaign.sentAt && (
								<div>
									<dt className="text-sm text-muted-foreground">Sent</dt>
									<dd className="font-medium">{formatDate(campaign.sentAt, "long")}</dd>
								</div>
							)}
							{campaign.scheduledFor && (
								<div>
									<dt className="text-sm text-muted-foreground">Scheduled For</dt>
									<dd className="font-medium flex items-center gap-2">
										<Calendar className="size-4 text-muted-foreground" />
										{formatDate(campaign.scheduledFor, "long")}
									</dd>
								</div>
							)}
							{campaign.tags.length > 0 && (
								<div className="sm:col-span-2">
									<dt className="text-sm text-muted-foreground mb-1">Tags</dt>
									<dd className="flex flex-wrap gap-1">
										{campaign.tags.map((tag) => (
											<span
												key={tag}
												className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
											>
												{tag}
											</span>
										))}
									</dd>
								</div>
							)}
						</dl>
					</div>

					{/* Email Preview */}
					{campaign.htmlContent && (
						<div className="rounded-lg border bg-card p-6">
							<h2 className="font-semibold mb-4">Email Preview</h2>
							<div className="rounded border bg-white p-4">
								<div
									className="prose prose-sm max-w-none"
									dangerouslySetInnerHTML={{ __html: campaign.htmlContent }}
								/>
							</div>
						</div>
					)}
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Quick Actions */}
					<div className="rounded-lg border bg-card p-6">
						<h2 className="font-semibold mb-4">Quick Actions</h2>
						<div className="space-y-2">
							<Button variant="outline" className="w-full justify-start" asChild>
								<Link href={`/dashboard/marketing/campaigns/${campaign.id}/analytics`}>
									<BarChart3 className="mr-2 size-4" />
									View Analytics
								</Link>
							</Button>
							<Button variant="outline" className="w-full justify-start">
								<Copy className="mr-2 size-4" />
								Duplicate Campaign
							</Button>
							{campaign.status === "draft" && (
								<Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
									<Trash2 className="mr-2 size-4" />
									Delete Campaign
								</Button>
							)}
						</div>
					</div>

					{/* Activity Timeline */}
					<div className="rounded-lg border bg-card p-6">
						<h2 className="font-semibold mb-4">Activity</h2>
						<div className="space-y-4">
							{campaign.sentAt && (
								<div className="flex gap-3">
									<div className="rounded-full bg-emerald-500/10 p-1.5">
										<Check className="size-3 text-emerald-600" />
									</div>
									<div>
										<p className="text-sm font-medium">Campaign sent</p>
										<p className="text-xs text-muted-foreground">
											{formatDate(campaign.sentAt, "long")}
										</p>
									</div>
								</div>
							)}
							{campaign.scheduledFor && campaign.status === "scheduled" && (
								<div className="flex gap-3">
									<div className="rounded-full bg-blue-500/10 p-1.5">
										<Calendar className="size-3 text-blue-600" />
									</div>
									<div>
										<p className="text-sm font-medium">Scheduled to send</p>
										<p className="text-xs text-muted-foreground">
											{formatDate(campaign.scheduledFor, "long")}
										</p>
									</div>
								</div>
							)}
							<div className="flex gap-3">
								<div className="rounded-full bg-muted p-1.5">
									<Clock className="size-3 text-muted-foreground" />
								</div>
								<div>
									<p className="text-sm font-medium">Campaign created</p>
									<p className="text-xs text-muted-foreground">
										{formatDate(campaign.createdAt, "long")}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

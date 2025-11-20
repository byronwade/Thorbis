"use cache";
export const cacheLife = "marketing";

import {
	ArrowLeftRight,
	CheckCircle2,
	DollarSign,
	FileText,
	RefreshCw,
	Shield,
	TrendingUp,
	Zap,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { RelatedContent } from "@/components/seo/related-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getRelatedFeatures } from "@/lib/seo/content-recommendations";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	generateServiceStructuredData,
	siteUrl,
} from "@/lib/seo/metadata";
import { generateSemanticKeywords } from "@/lib/seo/semantic-seo";
import {
	createFAQSchema,
	createItemListSchema,
} from "@/lib/seo/structured-data";

// Note: Caching is controlled by next.config.ts cacheLife configuration

const quickbooksKeywords = generateSemanticKeywords("quickbooks");

export const metadata = generateSEOMetadata({
	title: "QuickBooks Integration - Bidirectional Sync | Thorbis",
	section: "Features",
	description:
		"Seamless two-way sync between Thorbis and QuickBooks. Eliminate double entry, sync invoices instantly, and keep your books accurate without the headache.",
	path: "/features/quickbooks",
	keywords: [
		"quickbooks integration",
		"field service accounting",
		"quickbooks sync",
		"automated bookkeeping",
		"accounting integration",
		...quickbooksKeywords.slice(0, 5),
	],
});

// FAQ Schema - Optimized for AI Overviews
const faqSchema = createFAQSchema([
	{
		question: "How does the QuickBooks integration work?",
		answer:
			"Thorbis integrates bidirectionally with QuickBooks Online and QuickBooks Desktop via secure OAuth. When you create an invoice, estimate, or payment in Thorbis, it automatically syncs to QuickBooks and vice versa. Customers, jobs, payments, expenses, and chart of accounts sync in real-time. The integration runs automatically every hour or can be triggered manually. No duplicate data entry—changes made in either system reflect in both.",
	},
	{
		question: "What QuickBooks data syncs with Thorbis?",
		answer:
			"Thorbis syncs customers, invoices, estimates, payments, expenses, credit memos, chart of accounts, items/products, tax rates, and classes/departments. Customer data syncs including contact info, addresses, and custom fields. Invoices sync with line items, taxes, and payment status. Payments sync with method and deposit account. Expenses sync for job costing and profitability tracking. All data syncs bidirectionally—changes in either system update the other.",
	},
	{
		question: "Can I use QuickBooks Online or QuickBooks Desktop?",
		answer:
			"Yes. Thorbis integrates with both QuickBooks Online and QuickBooks Desktop. For QuickBooks Online, the integration is direct via OAuth API—just authorize once and sync starts automatically. For QuickBooks Desktop, you need the Web Connector application running on a Windows computer to sync. Both versions support the same data sync capabilities including invoices, payments, customers, and expenses.",
	},
	{
		question: "Will the integration duplicate my data?",
		answer:
			"No. Thorbis uses intelligent matching to prevent duplicates. When syncing customers, it matches by email, phone, and name to find existing records. Invoices match by invoice number. If a match is found, it updates the existing record instead of creating a duplicate. You can review and approve syncs before they happen, map custom fields, and set sync rules to control what data syncs. The system also detects and prevents duplicate payments.",
	},
	{
		question: "How often does data sync between Thorbis and QuickBooks?",
		answer:
			"Data syncs automatically every hour between Thorbis and QuickBooks. You can also trigger a manual sync anytime from the settings page. Critical data like new invoices and payments can be configured to sync immediately (within 5 minutes). The sync runs in the background and you receive notifications if errors occur. Sync history shows what data was synced and when, with detailed logs for troubleshooting.",
	},
	{
		question: "What happens if there's a sync error?",
		answer:
			"If a sync error occurs, Thorbis pauses the sync and notifies you via email and in-app notification with details about the error. Common issues include missing required fields, invalid tax rates, or deleted items in QuickBooks. The error dashboard shows exactly which records failed and why. You can fix the issue and retry the sync. Failed syncs don't affect other records—successful syncs continue while errors are resolved individually.",
	},
]);

// ItemList Schema - QuickBooks integration features
const featuresSchema = createItemListSchema({
	name: "QuickBooks Integration Features",
	description:
		"Bidirectional accounting sync with QuickBooks Online and Desktop",
	items: [
		{
			name: "Two-Way Sync",
			url: `${siteUrl}/features/quickbooks`,
			description:
				"Bidirectional sync of customers, invoices, payments, and expenses. Changes in Thorbis or QuickBooks update both systems automatically.",
		},
		{
			name: "Automatic Invoice Sync",
			url: `${siteUrl}/features/quickbooks`,
			description:
				"Invoices created in Thorbis appear in QuickBooks instantly with line items, taxes, and payment status. No manual export required.",
		},
		{
			name: "Payment Reconciliation",
			url: `${siteUrl}/features/quickbooks`,
			description:
				"Payments sync with method, deposit account, and date. Automatically marks invoices as paid in both systems with transaction matching.",
		},
		{
			name: "Duplicate Prevention",
			url: `${siteUrl}/features/quickbooks`,
			description:
				"Intelligent matching prevents duplicate customers, invoices, and payments. Matches by email, phone, invoice number, and transaction ID.",
		},
		{
			name: "Error Handling & Logs",
			url: `${siteUrl}/features/quickbooks`,
			description:
				"Detailed sync history with error notifications, failed record dashboard, and retry options. Fix issues without affecting other syncs.",
		},
		{
			name: "Custom Field Mapping",
			url: `${siteUrl}/features/quickbooks`,
			description:
				"Map Thorbis custom fields to QuickBooks custom fields, classes, and departments. Control what data syncs and where it appears.",
		},
	],
});

export default function QuickBooksPage() {
	const serviceStructuredData = generateServiceStructuredData({
		name: "QuickBooks Sync",
		description:
			"Bidirectional accounting integration for seamless financial management",
		offers: [
			{
				price: "100",
				currency: "USD",
				description: "Included in Thorbis platform starting at $200/month",
			},
		],
	});

	return (
		<>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbStructuredData([
							{ name: "Home", url: siteUrl },
							{ name: "Features", url: `${siteUrl}/features` },
							{
								name: "QuickBooks Sync",
								url: `${siteUrl}/features/quickbooks`,
							},
						]),
					),
				}}
				id="quickbooks-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(serviceStructuredData),
				}}
				id="quickbooks-service-ld"
				type="application/ld+json"
			/>

			{/* FAQ Schema - Optimized for AI Overviews */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqSchema),
				}}
				id="quickbooks-faq-ld"
				strategy="afterInteractive"
				type="application/ld+json"
			/>

			{/* Features List Schema */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(featuresSchema),
				}}
				id="quickbooks-features-ld"
				strategy="afterInteractive"
				type="application/ld+json"
			/>

			{/* Hero Section with Sync Visualization */}
			<section className="relative overflow-hidden py-20 sm:py-32">
				<div className="via-background absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/10 to-green-500/10" />
				<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.1),_transparent_50%)]" />

				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl text-center">
						<Badge className="mb-6 gap-1.5 px-3 py-1.5" variant="secondary">
							<RefreshCw className="size-3.5" />
							Two-Way Sync
						</Badge>
						<h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
							Your books, always in sync
						</h1>
						<p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg sm:text-xl">
							Stop wasting hours on double entry. Thorbis syncs bidirectionally
							with QuickBooks in real-time, keeping your financials accurate
							without the manual work.
						</p>
						<div className="flex flex-wrap items-center justify-center gap-4">
							<Button asChild className="shadow-primary/20 shadow-lg" size="lg">
								<Link href="/register">
									Connect QuickBooks
									<Zap className="ml-2 size-4" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/contact">Talk to Integration Expert</Link>
							</Button>
						</div>
					</div>

					{/* Sync Flow Visualization */}
					<div className="relative mx-auto mt-20 max-w-6xl">
						<div className="grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
							{/* Thorbis Side */}
							<div className="border-border/50 bg-background overflow-hidden rounded-2xl border shadow-xl">
								<div className="border-border/50 from-primary/10 border-b bg-gradient-to-r to-transparent px-6 py-4">
									<div className="flex items-center gap-3">
										<div className="bg-primary flex size-10 items-center justify-center rounded-lg">
											<span className="text-primary-foreground text-xl font-bold">
												T
											</span>
										</div>
										<div>
											<div className="font-semibold">Thorbis</div>
											<div className="text-muted-foreground text-xs">
												Field Service Platform
											</div>
										</div>
									</div>
								</div>
								<div className="space-y-3 p-6">
									<div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3">
										<div className="mb-2 flex items-center gap-2">
											<div className="flex size-6 items-center justify-center rounded-full bg-green-500">
												<CheckCircle2 className="size-3 text-white" />
											</div>
											<span className="text-sm font-semibold">
												Invoice Created
											</span>
										</div>
										<div className="text-muted-foreground text-xs">
											INV-2024-0847 • $621.36
										</div>
									</div>
									<div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3">
										<div className="mb-2 flex items-center gap-2">
											<div className="flex size-6 items-center justify-center rounded-full bg-blue-500">
												<DollarSign className="size-3 text-white" />
											</div>
											<span className="text-sm font-semibold">
												Payment Received
											</span>
										</div>
										<div className="text-muted-foreground text-xs">
											Credit Card • $621.36
										</div>
									</div>
									<div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-3">
										<div className="mb-2 flex items-center gap-2">
											<div className="flex size-6 items-center justify-center rounded-full bg-purple-500">
												<FileText className="size-3 text-white" />
											</div>
											<span className="text-sm font-semibold">
												Expense Logged
											</span>
										</div>
										<div className="text-muted-foreground text-xs">
											Parts & Materials • $245.00
										</div>
									</div>
								</div>
							</div>

							{/* Sync Arrows */}
							<div className="flex flex-col items-center justify-center gap-4">
								<div className="flex items-center gap-2">
									<div className="bg-primary shadow-primary/20 flex size-12 items-center justify-center rounded-full shadow-lg">
										<ArrowLeftRight className="text-primary-foreground size-6" />
									</div>
								</div>
								<div className="bg-muted rounded-full px-4 py-2">
									<div className="flex items-center gap-2">
										<div className="size-2 animate-pulse rounded-full bg-green-500" />
										<span className="text-xs font-semibold">Live Sync</span>
									</div>
								</div>
								<div className="text-muted-foreground text-center text-xs">
									Real-time
									<br />
									bidirectional sync
								</div>
							</div>

							{/* QuickBooks Side */}
							<div className="border-border/50 bg-background overflow-hidden rounded-2xl border shadow-xl">
								<div className="border-border/50 border-b bg-gradient-to-r from-green-500/10 to-transparent px-6 py-4">
									<div className="flex items-center gap-3">
										<div className="flex size-10 items-center justify-center rounded-lg bg-green-600">
											<span className="text-xl font-bold text-white">QB</span>
										</div>
										<div>
											<div className="font-semibold">QuickBooks</div>
											<div className="text-muted-foreground text-xs">
												Accounting Software
											</div>
										</div>
									</div>
								</div>
								<div className="space-y-3 p-6">
									<div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3">
										<div className="mb-2 flex items-center gap-2">
											<div className="flex size-6 items-center justify-center rounded-full bg-green-500">
												<CheckCircle2 className="size-3 text-white" />
											</div>
											<span className="text-sm font-semibold">
												Invoice Synced
											</span>
										</div>
										<div className="text-muted-foreground text-xs">
											Accounts Receivable Updated
										</div>
									</div>
									<div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3">
										<div className="mb-2 flex items-center gap-2">
											<div className="flex size-6 items-center justify-center rounded-full bg-blue-500">
												<DollarSign className="size-3 text-white" />
											</div>
											<span className="text-sm font-semibold">
												Payment Applied
											</span>
										</div>
										<div className="text-muted-foreground text-xs">
											Bank Deposit Created
										</div>
									</div>
									<div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-3">
										<div className="mb-2 flex items-center gap-2">
											<div className="flex size-6 items-center justify-center rounded-full bg-purple-500">
												<FileText className="size-3 text-white" />
											</div>
											<span className="text-sm font-semibold">
												Expense Recorded
											</span>
										</div>
										<div className="text-muted-foreground text-xs">
											Cost of Goods Sold Updated
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Sync Stats */}
						<div className="mt-8 grid gap-4 sm:grid-cols-3">
							<div className="bg-background rounded-xl border p-4 text-center">
								<div className="text-primary mb-1 text-2xl font-bold">
									Real-time
								</div>
								<div className="text-muted-foreground text-sm">Sync Speed</div>
							</div>
							<div className="bg-background rounded-xl border p-4 text-center">
								<div className="text-primary mb-1 text-2xl font-bold">100%</div>
								<div className="text-muted-foreground text-sm">
									Data Accuracy
								</div>
							</div>
							<div className="bg-background rounded-xl border p-4 text-center">
								<div className="text-primary mb-1 text-2xl font-bold">Zero</div>
								<div className="text-muted-foreground text-sm">
									Manual Entry
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="bg-muted/30 border-y py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">15 hrs</div>
							<div className="text-muted-foreground text-sm font-medium">
								Saved Per Month
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">99.9%</div>
							<div className="text-muted-foreground text-sm font-medium">
								Sync Accuracy
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">
								&lt; 5 min
							</div>
							<div className="text-muted-foreground text-sm font-medium">
								Setup Time
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">$0</div>
							<div className="text-muted-foreground text-sm font-medium">
								Extra Integration Fees
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* What Syncs Section */}
			<section className="py-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
							Everything syncs automatically
						</h2>
						<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
							Comprehensive two-way sync keeps your financial data perfectly
							aligned
						</p>
					</div>

					<div className="grid gap-8 lg:grid-cols-2">
						{/* Thorbis to QuickBooks */}
						<Card>
							<CardHeader className="from-primary/5 bg-gradient-to-br to-transparent">
								<div className="mb-4 flex items-center gap-3">
									<div className="bg-primary flex size-12 items-center justify-center rounded-lg">
										<span className="text-primary-foreground text-xl font-bold">
											T
										</span>
									</div>
									<div>
										<CardTitle>Thorbis → QuickBooks</CardTitle>
										<CardDescription>
											Data flowing to your books
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="pt-6">
								<div className="space-y-4">
									<div className="bg-muted/30 rounded-lg border p-4">
										<div className="mb-2 flex items-center gap-2">
											<FileText className="text-primary size-5" />
											<span className="text-sm font-semibold">
												Invoices & Estimates
											</span>
										</div>
										<ul className="text-muted-foreground ml-7 space-y-1 text-sm">
											<li>• Customer invoices with line items</li>
											<li>• Sales receipts and quotes</li>
											<li>• Service items and descriptions</li>
											<li>• Tax calculations and rates</li>
										</ul>
									</div>

									<div className="bg-muted/30 rounded-lg border p-4">
										<div className="mb-2 flex items-center gap-2">
											<DollarSign className="text-primary size-5" />
											<span className="text-sm font-semibold">
												Payments & Deposits
											</span>
										</div>
										<ul className="text-muted-foreground ml-7 space-y-1 text-sm">
											<li>• Credit card payments</li>
											<li>• ACH/bank transfers</li>
											<li>• Cash and check payments</li>
											<li>• Payment applications to invoices</li>
										</ul>
									</div>

									<div className="bg-muted/30 rounded-lg border p-4">
										<div className="mb-2 flex items-center gap-2">
											<FileText className="text-primary size-5" />
											<span className="text-sm font-semibold">
												Expenses & Bills
											</span>
										</div>
										<ul className="text-muted-foreground ml-7 space-y-1 text-sm">
											<li>• Parts and materials costs</li>
											<li>• Vendor bills and purchases</li>
											<li>• Job costing data</li>
											<li>• Expense categories</li>
										</ul>
									</div>

									<div className="bg-muted/30 rounded-lg border p-4">
										<div className="mb-2 flex items-center gap-2">
											<CheckCircle2 className="text-primary size-5" />
											<span className="text-sm font-semibold">
												Customers & Jobs
											</span>
										</div>
										<ul className="text-muted-foreground ml-7 space-y-1 text-sm">
											<li>• Customer profiles and contacts</li>
											<li>• Job/project details</li>
											<li>• Service addresses</li>
											<li>• Customer notes and tags</li>
										</ul>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* QuickBooks to Thorbis */}
						<Card>
							<CardHeader className="bg-gradient-to-br from-green-500/5 to-transparent">
								<div className="mb-4 flex items-center gap-3">
									<div className="flex size-12 items-center justify-center rounded-lg bg-green-600">
										<span className="text-xl font-bold text-white">QB</span>
									</div>
									<div>
										<CardTitle>QuickBooks → Thorbis</CardTitle>
										<CardDescription>Data flowing to the field</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="pt-6">
								<div className="space-y-4">
									<div className="bg-muted/30 rounded-lg border p-4">
										<div className="mb-2 flex items-center gap-2">
											<FileText className="size-5 text-green-600" />
											<span className="text-sm font-semibold">
												Chart of Accounts
											</span>
										</div>
										<ul className="text-muted-foreground ml-7 space-y-1 text-sm">
											<li>• Income accounts</li>
											<li>• Expense categories</li>
											<li>• Asset accounts</li>
											<li>• Account mappings</li>
										</ul>
									</div>

									<div className="bg-muted/30 rounded-lg border p-4">
										<div className="mb-2 flex items-center gap-2">
											<DollarSign className="size-5 text-green-600" />
											<span className="text-sm font-semibold">
												Products & Services
											</span>
										</div>
										<ul className="text-muted-foreground ml-7 space-y-1 text-sm">
											<li>• Service items and pricing</li>
											<li>• Inventory items</li>
											<li>• Product descriptions</li>
											<li>• Price levels and discounts</li>
										</ul>
									</div>

									<div className="bg-muted/30 rounded-lg border p-4">
										<div className="mb-2 flex items-center gap-2">
											<CheckCircle2 className="size-5 text-green-600" />
											<span className="text-sm font-semibold">
												Customer Updates
											</span>
										</div>
										<ul className="text-muted-foreground ml-7 space-y-1 text-sm">
											<li>• Customer information changes</li>
											<li>• Payment terms</li>
											<li>• Credit limits</li>
											<li>• Billing preferences</li>
										</ul>
									</div>

									<div className="bg-muted/30 rounded-lg border p-4">
										<div className="mb-2 flex items-center gap-2">
											<TrendingUp className="size-5 text-green-600" />
											<span className="text-sm font-semibold">
												Financial Data
											</span>
										</div>
										<ul className="text-muted-foreground ml-7 space-y-1 text-sm">
											<li>• Account balances</li>
											<li>• Outstanding invoices</li>
											<li>• Payment history</li>
											<li>• Tax settings</li>
										</ul>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="bg-muted/20 border-t py-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
							Integration that just works
						</h2>
						<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
							Built by accountants and field service experts who understand both
							worlds
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<RefreshCw className="text-primary size-6" />
								</div>
								<CardTitle>Real-Time Sync</CardTitle>
								<CardDescription>
									Changes sync instantly, not on a schedule
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Instant data updates</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>No batch processing delays</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Always up-to-date financials</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Live sync status monitoring</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<ArrowLeftRight className="text-primary size-6" />
								</div>
								<CardTitle>True Bidirectional</CardTitle>
								<CardDescription>
									Data flows both ways, keeping everything in sync
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Updates from either system</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Automatic conflict resolution</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Master record management</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Change tracking & audit logs</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Zap className="text-primary size-6" />
								</div>
								<CardTitle>5-Minute Setup</CardTitle>
								<CardDescription>
									Connect in minutes, not hours or days
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>OAuth secure connection</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Automatic field mapping</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Smart default settings</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Guided configuration wizard</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Shield className="text-primary size-6" />
								</div>
								<CardTitle>Bank-Level Security</CardTitle>
								<CardDescription>
									Your financial data is protected at every step
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>256-bit encryption</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>SOC 2 Type II certified</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>No data stored in transit</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Audit trail for all changes</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<FileText className="text-primary size-6" />
								</div>
								<CardTitle>Smart Field Mapping</CardTitle>
								<CardDescription>
									Intelligent matching of data fields and accounts
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Automatic account matching</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Custom field mapping</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Class and location tracking</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Tax code synchronization</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<TrendingUp className="text-primary size-6" />
								</div>
								<CardTitle>Error Prevention</CardTitle>
								<CardDescription>
									Catch issues before they become problems
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Validation before sync</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Duplicate detection</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Balance reconciliation</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Automated error notifications</span>
									</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Testimonial Section */}
			<section className="py-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-4xl">
						<Card className="border-primary/20 from-primary/5 overflow-hidden bg-gradient-to-br to-transparent">
							<CardContent className="p-8 sm:p-12">
								<div className="mb-6 flex items-center gap-4">
									<div className="bg-primary text-primary-foreground flex size-16 items-center justify-center rounded-full text-2xl font-bold">
										LT
									</div>
									<div>
										<div className="text-lg font-semibold">Lisa Thompson</div>
										<div className="text-muted-foreground text-sm">
											CFO, Thompson Electric
										</div>
									</div>
								</div>
								<blockquote className="text-lg leading-relaxed">
									"Before Thorbis, our bookkeeper spent 15 hours a month
									manually entering data into QuickBooks. Now it's all
									automatic. Our books are always current, our accountant is
									happy, and we saved enough to hire another technician."
								</blockquote>
								<div className="mt-6 flex items-center gap-4">
									<Badge variant="secondary">Electrical</Badge>
									<Badge variant="secondary">25 Employees</Badge>
									<Badge variant="secondary">Denver, CO</Badge>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Related Features Section */}
			<section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<RelatedContent
					title="Explore Related Features"
					description="Discover how these features work together to power your field service business"
					items={getRelatedFeatures("quickbooks", 3)}
					variant="grid"
					showDescription={true}
				/>
			</section>

			{/* CTA Section */}
			<section className="from-primary via-primary to-primary/90 text-primary-foreground bg-gradient-to-br py-20">
				<div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
					<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
						Connect QuickBooks in 5 minutes
					</h2>
					<p className="text-primary-foreground/90 mx-auto mb-8 max-w-2xl text-lg">
						Join service businesses saving 15+ hours per month on bookkeeping
						with Thorbis.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-4">
						<Button
							asChild
							className="bg-background text-foreground hover:bg-background/90 shadow-lg"
							size="lg"
						>
							<Link href="/register">
								Start 14-day Free Trial
								<Zap className="ml-2 size-4" />
							</Link>
						</Button>
						<Button
							asChild
							className="border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/20"
							size="lg"
							variant="outline"
						>
							<Link href="/contact">Talk to Integration Expert</Link>
						</Button>
					</div>
				</div>
			</section>
		</>
	);
}

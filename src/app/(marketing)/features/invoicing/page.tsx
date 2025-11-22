
import {
	ArrowDownRight,
	BadgePercent,
	CheckCircle2,
	CreditCard,
	DollarSign,
	FileText,
	Mail,
	Receipt,
	RefreshCw,
	Shield,
	Smartphone,
	TrendingUp,
	Wallet,
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

const invoicingKeywords = generateSemanticKeywords("invoicing");

export const metadata = generateSEOMetadata({
	title: "Automated Invoicing & Payment Processing Software",
	section: "Features",
	description:
		"Automated invoicing with integrated payment processing. Create, send, and track invoices in seconds. Accept credit cards, ACH, and mobile payments. Get paid 3x faster with automated reminders.",
	path: "/features/invoicing",
	keywords: [
		"automated invoicing software",
		"field service invoicing",
		"payment processing",
		"invoice automation",
		"mobile payment collection",
		...invoicingKeywords.slice(0, 5),
	],
});

// FAQ Schema - Optimized for AI Overviews
const faqSchema = createFAQSchema([
	{
		question: "How do I create and send invoices with Thorbis?",
		answer:
			"Thorbis automates invoice creation from completed jobs. Simply mark a job as complete, and the system automatically generates a professional invoice with all labor, materials, and taxes calculated. You can customize the invoice, add notes or photos, and send it via email or SMS with a single click. Customers receive a payment link and can pay instantly with credit card, ACH, or digital wallet.",
	},
	{
		question: "What are Thorbis payment processing fees?",
		answer:
			"Thorbis charges 0% payment processing fees on all transactions including credit cards, debit cards, ACH bank transfers, and digital wallets like Apple Pay and Google Pay. Unlike traditional processors that charge 2.9-3.5% per transaction, you keep 100% of every payment. The $200/month base fee includes unlimited payment processing with no hidden fees, monthly minimums, or per-transaction costs.",
	},
	{
		question: "Can customers pay invoices online?",
		answer:
			"Yes. Every invoice includes a secure payment link where customers can pay online instantly. They can pay with credit/debit cards, ACH bank transfers, Apple Pay, Google Pay, or even save payment methods for future use. The customer portal shows all invoices, payment history, and allows them to set up auto-pay for recurring services. Payments are deposited directly to your bank account within 24 hours.",
	},
	{
		question: "How does automated payment reminder work?",
		answer:
			"Thorbis automatically sends payment reminders via email and SMS based on your settings. You can configure reminders to send before the due date, on the due date, and at custom intervals after (e.g., 3 days, 7 days, 14 days overdue). Each reminder includes a one-click payment link. The system tracks payment status in real-time and stops reminders once paid. You can customize reminder messages and timing in settings.",
	},
	{
		question: "Does Thorbis support recurring billing and subscriptions?",
		answer:
			"Yes. Thorbis supports recurring billing for maintenance plans, subscriptions, and contract services. Set up automatic billing cycles (monthly, quarterly, annually) and the system automatically charges saved payment methods, sends invoices, and handles failed payment retry logic. You can track subscription revenue, manage dunning workflows for failed payments, and view analytics on subscription churn and revenue.",
	},
	{
		question: "Can I accept partial payments on invoices?",
		answer:
			"Yes. Thorbis supports partial payments, payment plans, and deposits. You can split invoices into multiple installments with different due dates, accept down payments before starting work, or allow customers to make partial payments over time. The system tracks all payments against the total balance and shows remaining amounts due. Payment plans can be configured with custom schedules and automatic reminders for each installment.",
	},
]);

// ItemList Schema - Invoice features
const featuresSchema = createItemListSchema({
	name: "Invoicing & Payment Processing Features",
	description:
		"Complete invoicing and payment features with 0% processing fees",
	items: [
		{
			name: "Zero Payment Processing Fees",
			url: `${siteUrl}/features/invoicing`,
			description:
				"0% fees on credit cards, ACH, and digital wallets. Keep 100% of every payment with no hidden costs or monthly minimums.",
		},
		{
			name: "Professional Invoice Templates",
			url: `${siteUrl}/features/invoicing`,
			description:
				"Branded invoice templates with custom logos, line items, tax calculations, photo attachments, and professional formatting.",
		},
		{
			name: "Instant Payment Links",
			url: `${siteUrl}/features/invoicing`,
			description:
				"Every invoice includes a secure payment link. Customers can pay instantly with credit cards, ACH, or digital wallets.",
		},
		{
			name: "Automated Payment Reminders",
			url: `${siteUrl}/features/invoicing`,
			description:
				"Smart reminders via email and SMS with customizable schedules. Automatic escalation workflows for overdue payments.",
		},
		{
			name: "Recurring Billing & Subscriptions",
			url: `${siteUrl}/features/invoicing`,
			description:
				"Automate subscription and maintenance plan billing with payment retry logic, dunning management, and revenue analytics.",
		},
		{
			name: "Partial Payments & Payment Plans",
			url: `${siteUrl}/features/invoicing`,
			description:
				"Support deposits, installments, and payment plans with flexible scheduling and automatic tracking of remaining balances.",
		},
	],
});

export default function InvoicingPage() {
	const serviceStructuredData = generateServiceStructuredData({
		name: "Invoicing & Payments",
		description:
			"Zero-fee payment processing with instant payouts for service businesses",
		offers: [
			{
				price: "100",
				currency: "USD",
				description:
					"Included in Thorbis platform starting at $200/month - 0% processing fees",
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
								name: "Invoicing & Payments",
								url: `${siteUrl}/features/invoicing`,
							},
						]),
					),
				}}
				id="invoicing-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(serviceStructuredData),
				}}
				id="invoicing-service-ld"
				type="application/ld+json"
			/>

			{/* FAQ Schema - Optimized for AI Overviews */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqSchema),
				}}
				id="invoicing-faq-ld"
				strategy="afterInteractive"
				type="application/ld+json"
			/>

			{/* Features List Schema */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(featuresSchema),
				}}
				id="invoicing-features-ld"
				strategy="afterInteractive"
				type="application/ld+json"
			/>

			{/* Hero Section with 0% Fees Emphasis */}
			<section className="relative overflow-hidden py-20 sm:py-32">
				<div className="via-background to-background absolute inset-0 -z-10 bg-gradient-to-br from-green-500/10" />
				<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.15),_transparent_50%)]" />

				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-4xl text-center">
						{/* 0% Fees Badge */}
						<div className="mb-8 inline-flex items-center gap-3 rounded-full border-2 border-green-500 bg-green-500/10 px-6 py-3">
							<BadgePercent className="size-6 text-green-600" />
							<span className="text-2xl font-bold text-green-600">
								0% Processing Fees
							</span>
						</div>

						<h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
							Keep every dollar you earn
						</h1>
						<p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg sm:text-xl">
							Stop losing 3-4% on every transaction. Thorbis charges zero
							payment processing fees. Create invoices, accept payments, and get
							paid instantly—all included.
						</p>

						{/* Savings Calculator */}
						<div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-green-500/30 bg-green-500/5 p-8">
							<div className="mb-4 text-center">
								<div className="text-muted-foreground text-sm">
									If you process $50K/month, you save:
								</div>
								<div className="mt-2 text-5xl font-bold text-green-600">
									$18,000
								</div>
								<div className="text-muted-foreground text-sm">
									per year vs. 3% fees
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4 text-center">
								<div className="bg-background/50 rounded-lg p-4">
									<div className="text-muted-foreground mb-1 text-xs">
										Traditional Processor
									</div>
									<div className="text-xl font-semibold text-red-600">
										-$1,500/mo
									</div>
								</div>
								<div className="bg-background/50 rounded-lg p-4">
									<div className="text-muted-foreground mb-1 text-xs">
										Thorbis
									</div>
									<div className="text-xl font-semibold text-green-600">
										$0/mo
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-wrap items-center justify-center gap-4">
							<Button
								asChild
								className="shadow-lg shadow-green-500/20"
								size="lg"
							>
								<Link href="/waitlist">
									Join Waitlist
									<Zap className="ml-2 size-4" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/demo">Watch Demo</Link>
							</Button>
						</div>
					</div>

					{/* Invoice Preview */}
					<div className="relative mx-auto mt-20 max-w-4xl">
						<div className="border-border/50 bg-background overflow-hidden rounded-2xl border shadow-2xl">
							{/* Invoice Header */}
							<div className="border-border/50 from-primary/5 border-b bg-gradient-to-r to-transparent px-8 py-6">
								<div className="flex items-start justify-between">
									<div>
										<div className="mb-2 flex items-center gap-3">
											<div className="bg-primary flex size-12 items-center justify-center rounded-lg">
												<span className="text-primary-foreground text-xl font-bold">
													T
												</span>
											</div>
											<div>
												<div className="text-xl font-bold">Rodriguez HVAC</div>
												<div className="text-muted-foreground text-sm">
													Invoice #INV-2024-0847
												</div>
											</div>
										</div>
									</div>
									<div className="text-right">
										<Badge className="mb-2 bg-green-500">Paid</Badge>
										<div className="text-muted-foreground text-sm">
											Due: Jan 15, 2024
										</div>
									</div>
								</div>
							</div>

							{/* Invoice Body */}
							<div className="p-8">
								<div className="mb-8 grid gap-6 md:grid-cols-2">
									<div>
										<div className="text-muted-foreground mb-1 text-sm font-semibold">
											Bill To
										</div>
										<div className="font-semibold">Sarah Johnson</div>
										<div className="text-muted-foreground text-sm">
											123 Oak Street
										</div>
										<div className="text-muted-foreground text-sm">
											Austin, TX 78701
										</div>
									</div>
									<div>
										<div className="text-muted-foreground mb-1 text-sm font-semibold">
											Service Details
										</div>
										<div className="text-sm">AC Repair & Maintenance</div>
										<div className="text-muted-foreground text-sm">
											Completed: Jan 12, 2024
										</div>
										<div className="text-muted-foreground text-sm">
											Tech: Mike Rodriguez
										</div>
									</div>
								</div>

								{/* Line Items */}
								<div className="mb-6 overflow-hidden rounded-lg border">
									<table className="w-full">
										<thead className="bg-muted/50">
											<tr>
												<th className="px-4 py-3 text-left text-sm font-semibold">
													Description
												</th>
												<th className="px-4 py-3 text-right text-sm font-semibold">
													Qty
												</th>
												<th className="px-4 py-3 text-right text-sm font-semibold">
													Price
												</th>
												<th className="px-4 py-3 text-right text-sm font-semibold">
													Total
												</th>
											</tr>
										</thead>
										<tbody className="divide-y">
											<tr>
												<td className="px-4 py-3 text-sm">
													AC System Diagnostic
												</td>
												<td className="px-4 py-3 text-right text-sm">1</td>
												<td className="px-4 py-3 text-right text-sm">$89.00</td>
												<td className="px-4 py-3 text-right text-sm">$89.00</td>
											</tr>
											<tr>
												<td className="px-4 py-3 text-sm">
													Refrigerant Recharge (R-410A)
												</td>
												<td className="px-4 py-3 text-right text-sm">2</td>
												<td className="px-4 py-3 text-right text-sm">
													$125.00
												</td>
												<td className="px-4 py-3 text-right text-sm">
													$250.00
												</td>
											</tr>
											<tr>
												<td className="px-4 py-3 text-sm">
													Air Filter Replacement
												</td>
												<td className="px-4 py-3 text-right text-sm">1</td>
												<td className="px-4 py-3 text-right text-sm">$45.00</td>
												<td className="px-4 py-3 text-right text-sm">$45.00</td>
											</tr>
											<tr>
												<td className="px-4 py-3 text-sm">Labor (2 hours)</td>
												<td className="px-4 py-3 text-right text-sm">2</td>
												<td className="px-4 py-3 text-right text-sm">$95.00</td>
												<td className="px-4 py-3 text-right text-sm">
													$190.00
												</td>
											</tr>
										</tbody>
									</table>
								</div>

								{/* Totals */}
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Subtotal</span>
										<span>$574.00</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Tax (8.25%)</span>
										<span>$47.36</span>
									</div>
									<div className="flex justify-between border-t pt-2 text-xl font-bold">
										<span>Total</span>
										<span>$621.36</span>
									</div>
									<div className="flex items-center justify-between rounded-lg bg-green-500/10 px-4 py-3">
										<div className="flex items-center gap-2">
											<CheckCircle2 className="size-5 text-green-600" />
											<span className="text-sm font-semibold">
												Paid via Credit Card
											</span>
										</div>
										<span className="font-semibold text-green-600">
											$621.36
										</span>
									</div>
								</div>
							</div>

							{/* Payment Methods */}
							<div className="border-border/50 bg-muted/20 border-t px-8 py-4">
								<div className="flex flex-wrap items-center justify-center gap-4">
									<div className="text-muted-foreground flex items-center gap-2 text-sm">
										<CreditCard className="size-4" />
										<span>Credit/Debit</span>
									</div>
									<div className="text-muted-foreground flex items-center gap-2 text-sm">
										<Smartphone className="size-4" />
										<span>Apple/Google Pay</span>
									</div>
									<div className="text-muted-foreground flex items-center gap-2 text-sm">
										<Wallet className="size-4" />
										<span>ACH/Bank</span>
									</div>
									<div className="text-muted-foreground flex items-center gap-2 text-sm">
										<DollarSign className="size-4" />
										<span>Cash/Check</span>
									</div>
								</div>
							</div>
						</div>

						{/* 0% Fee Callout */}
						<div className="bg-background absolute top-1/4 -right-4 hidden max-w-xs rounded-xl border-2 border-green-500 p-4 shadow-2xl lg:block">
							<div className="mb-2 flex items-center gap-2">
								<div className="flex size-8 items-center justify-center rounded-full bg-green-500">
									<BadgePercent className="size-4 text-white" />
								</div>
								<span className="font-bold text-green-600">$0 in Fees</span>
							</div>
							<p className="text-muted-foreground text-xs leading-relaxed">
								Traditional processors would charge{" "}
								<span className="font-semibold text-red-600">$18.64</span> on
								this transaction. With Thorbis, you keep{" "}
								<span className="font-semibold text-green-600">100%</span>.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="bg-muted/30 border-y py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
						<div className="text-center">
							<div className="mb-2 text-4xl font-bold text-green-600">0%</div>
							<div className="text-muted-foreground text-sm font-medium">
								Processing Fees
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">24 hrs</div>
							<div className="text-muted-foreground text-sm font-medium">
								Faster Payment Collection
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">
								Instant
							</div>
							<div className="text-muted-foreground text-sm font-medium">
								Deposit to Bank
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">$18K</div>
							<div className="text-muted-foreground text-sm font-medium">
								Avg. Annual Savings
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Comparison Section */}
			<section className="py-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
							See how much you'll save
						</h2>
						<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
							Compare Thorbis to traditional payment processors
						</p>
					</div>

					<div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border">
						<table className="w-full">
							<thead className="bg-muted/50">
								<tr>
									<th className="px-6 py-4 text-left font-semibold">
										Monthly Revenue
									</th>
									<th className="px-6 py-4 text-center font-semibold">
										Traditional (3%)
									</th>
									<th className="px-6 py-4 text-center font-semibold text-green-600">
										Thorbis (0%)
									</th>
									<th className="px-6 py-4 text-center font-semibold">
										You Save
									</th>
								</tr>
							</thead>
							<tbody className="divide-y">
								<tr className="hover:bg-muted/20">
									<td className="px-6 py-4 font-medium">$25,000</td>
									<td className="px-6 py-4 text-center text-red-600">-$750</td>
									<td className="px-6 py-4 text-center font-semibold text-green-600">
										$0
									</td>
									<td className="px-6 py-4 text-center font-bold text-green-600">
										$750/mo
									</td>
								</tr>
								<tr className="hover:bg-muted/20">
									<td className="px-6 py-4 font-medium">$50,000</td>
									<td className="px-6 py-4 text-center text-red-600">
										-$1,500
									</td>
									<td className="px-6 py-4 text-center font-semibold text-green-600">
										$0
									</td>
									<td className="px-6 py-4 text-center font-bold text-green-600">
										$1,500/mo
									</td>
								</tr>
								<tr className="hover:bg-muted/20">
									<td className="px-6 py-4 font-medium">$100,000</td>
									<td className="px-6 py-4 text-center text-red-600">
										-$3,000
									</td>
									<td className="px-6 py-4 text-center font-semibold text-green-600">
										$0
									</td>
									<td className="px-6 py-4 text-center font-bold text-green-600">
										$3,000/mo
									</td>
								</tr>
								<tr className="bg-green-500/5 hover:bg-green-500/10">
									<td className="px-6 py-4 font-bold">$250,000</td>
									<td className="px-6 py-4 text-center font-bold text-red-600">
										-$7,500
									</td>
									<td className="px-6 py-4 text-center font-bold text-green-600">
										$0
									</td>
									<td className="px-6 py-4 text-center text-xl font-bold text-green-600">
										$7,500/mo
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className="mt-8 text-center">
						<p className="text-muted-foreground text-sm">
							* Traditional processors typically charge 2.9% + $0.30 per
							transaction. Calculations based on 3% average.
						</p>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="bg-muted/20 border-t py-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
							Everything you need to get paid
						</h2>
						<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
							Professional invoicing and payment processing—all with zero fees
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-green-500/10">
									<BadgePercent className="size-6 text-green-600" />
								</div>
								<CardTitle>Zero Processing Fees</CardTitle>
								<CardDescription>
									Keep 100% of every payment—no hidden fees or surprises
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>0% on credit/debit cards</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>0% on ACH/bank transfers</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>0% on digital wallets</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>No monthly minimums</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<FileText className="text-primary size-6" />
								</div>
								<CardTitle>Professional Invoices</CardTitle>
								<CardDescription>
									Create beautiful, branded invoices in seconds
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Custom branding & logos</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Line item details</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Tax calculations</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Photo attachments</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Zap className="text-primary size-6" />
								</div>
								<CardTitle>Instant Deposits</CardTitle>
								<CardDescription>
									Money in your bank account immediately, not days later
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Same-day deposits</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>No waiting periods</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Direct bank transfer</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Real-time notifications</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<CreditCard className="text-primary size-6" />
								</div>
								<CardTitle>Accept Any Payment</CardTitle>
								<CardDescription>
									Credit cards, ACH, digital wallets, cash, and checks
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>All major credit cards</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Apple Pay & Google Pay</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>ACH bank transfers</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Cash & check tracking</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<RefreshCw className="text-primary size-6" />
								</div>
								<CardTitle>Recurring Billing</CardTitle>
								<CardDescription>
									Automate subscription and maintenance plan payments
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Automatic billing cycles</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Payment retry logic</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Dunning management</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Subscription analytics</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Mail className="text-primary size-6" />
								</div>
								<CardTitle>Smart Reminders</CardTitle>
								<CardDescription>
									Automated payment reminders that actually work
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Customizable schedules</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Email & SMS reminders</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Escalation workflows</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>One-click payment links</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Receipt className="text-primary size-6" />
								</div>
								<CardTitle>Digital Receipts</CardTitle>
								<CardDescription>
									Instant, professional receipts for every payment
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Auto-send on payment</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Branded templates</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>PDF downloads</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Customer portal access</span>
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
									PCI-compliant payment processing you can trust
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>PCI DSS Level 1 certified</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>256-bit encryption</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Fraud detection</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Chargeback protection</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<TrendingUp className="text-primary size-6" />
								</div>
								<CardTitle>Payment Analytics</CardTitle>
								<CardDescription>
									Track cash flow and payment trends in real-time
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Revenue dashboards</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>AR aging reports</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Payment method breakdown</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Collection rate tracking</span>
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
						<Card className="overflow-hidden border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
							<CardContent className="p-8 sm:p-12">
								<div className="mb-6 flex items-center gap-4">
									<div className="flex size-16 items-center justify-center rounded-full bg-green-500 text-2xl font-bold text-white">
										JC
									</div>
									<div>
										<div className="text-lg font-semibold">Jennifer Chen</div>
										<div className="text-muted-foreground text-sm">
											Owner, Chen Plumbing Services
										</div>
									</div>
								</div>
								<blockquote className="text-lg leading-relaxed">
									"We were paying $2,400/month in credit card fees. With
									Thorbis, that's $28,800 back in our pocket every year. The
									invoicing is faster, customers pay quicker, and we get the
									money instantly. It's a no-brainer."
								</blockquote>
								<div className="mt-6 flex items-center gap-4">
									<Badge className="bg-green-500">$28.8K Saved/Year</Badge>
									<Badge variant="secondary">Plumbing</Badge>
									<Badge variant="secondary">San Diego, CA</Badge>
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
					items={getRelatedFeatures("invoicing", 3)}
					variant="grid"
					showDescription={true}
				/>
			</section>

			{/* CTA Section */}
			<section className="bg-gradient-to-br from-green-500 via-green-600 to-green-500 py-20 text-white">
				<div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
					<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
						<BadgePercent className="size-5" />
						<span className="font-bold">0% Processing Fees Forever</span>
					</div>
					<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
						Stop losing money on payment fees
					</h2>
					<p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
						Join thousands of service businesses keeping 100% of every payment
						with Thorbis.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-4">
						<Button
							asChild
							className="bg-white text-green-600 shadow-lg hover:bg-white/90"
							size="lg"
						>
							<Link href="/waitlist">
								Join Waitlist
								<ArrowDownRight className="ml-2 size-4" />
							</Link>
						</Button>
						<Button
							asChild
							className="border-white/20 bg-white/10 hover:bg-white/20"
							size="lg"
							variant="outline"
						>
							<Link href="/demo">Watch Demo</Link>
						</Button>
					</div>
				</div>
			</section>
		</>
	);
}

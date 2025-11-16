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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	generateBreadcrumbStructuredData,
	generateMetadata as generateSEOMetadata,
	generateServiceStructuredData,
	siteUrl,
} from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
	title: "0% Fee Payment Processing & Invoicing | Thorbis",
	section: "Features",
	description:
		"Get paid faster with zero processing fees. Create professional invoices, accept payments anywhere, and get instant deposits. Save thousands on transaction fees every month.",
	path: "/features/invoicing",
	keywords: [
		"zero fee payment processing",
		"field service invoicing",
		"contractor payment software",
		"instant payment deposits",
		"mobile payment processing",
	],
});

export default function InvoicingPage() {
	const serviceStructuredData = generateServiceStructuredData({
		name: "Invoicing & Payments",
		description: "Zero-fee payment processing with instant payouts for service businesses",
		offers: [
			{
				price: "100",
				currency: "USD",
				description: "Included in Thorbis platform starting at $100/month - 0% processing fees",
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
						])
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

			{/* Hero Section with 0% Fees Emphasis */}
			<section className="relative overflow-hidden py-20 sm:py-32">
				<div className="-z-10 absolute inset-0 bg-gradient-to-br from-green-500/10 via-background to-background" />
				<div className="-z-10 absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.15),_transparent_50%)]" />

				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-4xl text-center">
						{/* 0% Fees Badge */}
						<div className="mb-8 inline-flex items-center gap-3 rounded-full border-2 border-green-500 bg-green-500/10 px-6 py-3">
							<BadgePercent className="size-6 text-green-600" />
							<span className="font-bold text-2xl text-green-600">0% Processing Fees</span>
						</div>

						<h1 className="mb-6 font-bold text-5xl tracking-tight sm:text-6xl lg:text-7xl">
							Keep every dollar you earn
						</h1>
						<p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
							Stop losing 3-4% on every transaction. Thorbis charges zero payment processing fees. Create invoices,
							accept payments, and get paid instantly—all included.
						</p>

						{/* Savings Calculator */}
						<div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-green-500/30 bg-green-500/5 p-8">
							<div className="mb-4 text-center">
								<div className="text-muted-foreground text-sm">If you process $50K/month, you save:</div>
								<div className="mt-2 font-bold text-5xl text-green-600">$18,000</div>
								<div className="text-muted-foreground text-sm">per year vs. 3% fees</div>
							</div>
							<div className="grid grid-cols-2 gap-4 text-center">
								<div className="rounded-lg bg-background/50 p-4">
									<div className="mb-1 text-muted-foreground text-xs">Traditional Processor</div>
									<div className="font-semibold text-red-600 text-xl">-$1,500/mo</div>
								</div>
								<div className="rounded-lg bg-background/50 p-4">
									<div className="mb-1 text-muted-foreground text-xs">Thorbis</div>
									<div className="font-semibold text-green-600 text-xl">$0/mo</div>
								</div>
							</div>
						</div>

						<div className="flex flex-wrap items-center justify-center gap-4">
							<Button asChild className="shadow-green-500/20 shadow-lg" size="lg">
								<Link href="/register">
									Start Saving Today
									<Zap className="ml-2 size-4" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/contact">Calculate Your Savings</Link>
							</Button>
						</div>
					</div>

					{/* Invoice Preview */}
					<div className="relative mx-auto mt-20 max-w-4xl">
						<div className="overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl">
							{/* Invoice Header */}
							<div className="border-border/50 border-b bg-gradient-to-r from-primary/5 to-transparent px-8 py-6">
								<div className="flex items-start justify-between">
									<div>
										<div className="mb-2 flex items-center gap-3">
											<div className="flex size-12 items-center justify-center rounded-lg bg-primary">
												<span className="font-bold text-primary-foreground text-xl">T</span>
											</div>
											<div>
												<div className="font-bold text-xl">Rodriguez HVAC</div>
												<div className="text-muted-foreground text-sm">Invoice #INV-2024-0847</div>
											</div>
										</div>
									</div>
									<div className="text-right">
										<Badge className="mb-2 bg-green-500">Paid</Badge>
										<div className="text-muted-foreground text-sm">Due: Jan 15, 2024</div>
									</div>
								</div>
							</div>

							{/* Invoice Body */}
							<div className="p-8">
								<div className="mb-8 grid gap-6 md:grid-cols-2">
									<div>
										<div className="mb-1 font-semibold text-muted-foreground text-sm">Bill To</div>
										<div className="font-semibold">Sarah Johnson</div>
										<div className="text-muted-foreground text-sm">123 Oak Street</div>
										<div className="text-muted-foreground text-sm">Austin, TX 78701</div>
									</div>
									<div>
										<div className="mb-1 font-semibold text-muted-foreground text-sm">Service Details</div>
										<div className="text-sm">AC Repair & Maintenance</div>
										<div className="text-muted-foreground text-sm">Completed: Jan 12, 2024</div>
										<div className="text-muted-foreground text-sm">Tech: Mike Rodriguez</div>
									</div>
								</div>

								{/* Line Items */}
								<div className="mb-6 overflow-hidden rounded-lg border">
									<table className="w-full">
										<thead className="bg-muted/50">
											<tr>
												<th className="px-4 py-3 text-left font-semibold text-sm">Description</th>
												<th className="px-4 py-3 text-right font-semibold text-sm">Qty</th>
												<th className="px-4 py-3 text-right font-semibold text-sm">Price</th>
												<th className="px-4 py-3 text-right font-semibold text-sm">Total</th>
											</tr>
										</thead>
										<tbody className="divide-y">
											<tr>
												<td className="px-4 py-3 text-sm">AC System Diagnostic</td>
												<td className="px-4 py-3 text-right text-sm">1</td>
												<td className="px-4 py-3 text-right text-sm">$89.00</td>
												<td className="px-4 py-3 text-right text-sm">$89.00</td>
											</tr>
											<tr>
												<td className="px-4 py-3 text-sm">Refrigerant Recharge (R-410A)</td>
												<td className="px-4 py-3 text-right text-sm">2</td>
												<td className="px-4 py-3 text-right text-sm">$125.00</td>
												<td className="px-4 py-3 text-right text-sm">$250.00</td>
											</tr>
											<tr>
												<td className="px-4 py-3 text-sm">Air Filter Replacement</td>
												<td className="px-4 py-3 text-right text-sm">1</td>
												<td className="px-4 py-3 text-right text-sm">$45.00</td>
												<td className="px-4 py-3 text-right text-sm">$45.00</td>
											</tr>
											<tr>
												<td className="px-4 py-3 text-sm">Labor (2 hours)</td>
												<td className="px-4 py-3 text-right text-sm">2</td>
												<td className="px-4 py-3 text-right text-sm">$95.00</td>
												<td className="px-4 py-3 text-right text-sm">$190.00</td>
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
									<div className="flex justify-between border-t pt-2 font-bold text-xl">
										<span>Total</span>
										<span>$621.36</span>
									</div>
									<div className="flex items-center justify-between rounded-lg bg-green-500/10 px-4 py-3">
										<div className="flex items-center gap-2">
											<CheckCircle2 className="size-5 text-green-600" />
											<span className="font-semibold text-sm">Paid via Credit Card</span>
										</div>
										<span className="font-semibold text-green-600">$621.36</span>
									</div>
								</div>
							</div>

							{/* Payment Methods */}
							<div className="border-border/50 border-t bg-muted/20 px-8 py-4">
								<div className="flex flex-wrap items-center justify-center gap-4">
									<div className="flex items-center gap-2 text-muted-foreground text-sm">
										<CreditCard className="size-4" />
										<span>Credit/Debit</span>
									</div>
									<div className="flex items-center gap-2 text-muted-foreground text-sm">
										<Smartphone className="size-4" />
										<span>Apple/Google Pay</span>
									</div>
									<div className="flex items-center gap-2 text-muted-foreground text-sm">
										<Wallet className="size-4" />
										<span>ACH/Bank</span>
									</div>
									<div className="flex items-center gap-2 text-muted-foreground text-sm">
										<DollarSign className="size-4" />
										<span>Cash/Check</span>
									</div>
								</div>
							</div>
						</div>

						{/* 0% Fee Callout */}
						<div className="-right-4 absolute top-1/4 hidden max-w-xs rounded-xl border-2 border-green-500 bg-background p-4 shadow-2xl lg:block">
							<div className="mb-2 flex items-center gap-2">
								<div className="flex size-8 items-center justify-center rounded-full bg-green-500">
									<BadgePercent className="size-4 text-white" />
								</div>
								<span className="font-bold text-green-600">$0 in Fees</span>
							</div>
							<p className="text-muted-foreground text-xs leading-relaxed">
								Traditional processors would charge <span className="font-semibold text-red-600">$18.64</span> on this
								transaction. With Thorbis, you keep <span className="font-semibold text-green-600">100%</span>.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="border-y bg-muted/30 py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
						<div className="text-center">
							<div className="mb-2 font-bold text-4xl text-green-600">0%</div>
							<div className="font-medium text-muted-foreground text-sm">Processing Fees</div>
						</div>
						<div className="text-center">
							<div className="mb-2 font-bold text-4xl text-primary">24 hrs</div>
							<div className="font-medium text-muted-foreground text-sm">Faster Payment Collection</div>
						</div>
						<div className="text-center">
							<div className="mb-2 font-bold text-4xl text-primary">Instant</div>
							<div className="font-medium text-muted-foreground text-sm">Deposit to Bank</div>
						</div>
						<div className="text-center">
							<div className="mb-2 font-bold text-4xl text-primary">$18K</div>
							<div className="font-medium text-muted-foreground text-sm">Avg. Annual Savings</div>
						</div>
					</div>
				</div>
			</section>

			{/* Comparison Section */}
			<section className="py-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">See how much you'll save</h2>
						<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
							Compare Thorbis to traditional payment processors
						</p>
					</div>

					<div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border">
						<table className="w-full">
							<thead className="bg-muted/50">
								<tr>
									<th className="px-6 py-4 text-left font-semibold">Monthly Revenue</th>
									<th className="px-6 py-4 text-center font-semibold">Traditional (3%)</th>
									<th className="px-6 py-4 text-center font-semibold text-green-600">Thorbis (0%)</th>
									<th className="px-6 py-4 text-center font-semibold">You Save</th>
								</tr>
							</thead>
							<tbody className="divide-y">
								<tr className="hover:bg-muted/20">
									<td className="px-6 py-4 font-medium">$25,000</td>
									<td className="px-6 py-4 text-center text-red-600">-$750</td>
									<td className="px-6 py-4 text-center font-semibold text-green-600">$0</td>
									<td className="px-6 py-4 text-center font-bold text-green-600">$750/mo</td>
								</tr>
								<tr className="hover:bg-muted/20">
									<td className="px-6 py-4 font-medium">$50,000</td>
									<td className="px-6 py-4 text-center text-red-600">-$1,500</td>
									<td className="px-6 py-4 text-center font-semibold text-green-600">$0</td>
									<td className="px-6 py-4 text-center font-bold text-green-600">$1,500/mo</td>
								</tr>
								<tr className="hover:bg-muted/20">
									<td className="px-6 py-4 font-medium">$100,000</td>
									<td className="px-6 py-4 text-center text-red-600">-$3,000</td>
									<td className="px-6 py-4 text-center font-semibold text-green-600">$0</td>
									<td className="px-6 py-4 text-center font-bold text-green-600">$3,000/mo</td>
								</tr>
								<tr className="bg-green-500/5 hover:bg-green-500/10">
									<td className="px-6 py-4 font-bold">$250,000</td>
									<td className="px-6 py-4 text-center font-bold text-red-600">-$7,500</td>
									<td className="px-6 py-4 text-center font-bold text-green-600">$0</td>
									<td className="px-6 py-4 text-center font-bold text-green-600 text-xl">$7,500/mo</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className="mt-8 text-center">
						<p className="text-muted-foreground text-sm">
							* Traditional processors typically charge 2.9% + $0.30 per transaction. Calculations based on 3% average.
						</p>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="border-t bg-muted/20 py-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">Everything you need to get paid</h2>
						<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
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
								<CardDescription>Keep 100% of every payment—no hidden fees or surprises</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>0% on credit/debit cards</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>0% on ACH/bank transfers</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>0% on digital wallets</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>No monthly minimums</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
									<FileText className="size-6 text-primary" />
								</div>
								<CardTitle>Professional Invoices</CardTitle>
								<CardDescription>Create beautiful, branded invoices in seconds</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Custom branding & logos</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Line item details</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Tax calculations</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Photo attachments</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
									<Zap className="size-6 text-primary" />
								</div>
								<CardTitle>Instant Deposits</CardTitle>
								<CardDescription>Money in your bank account immediately, not days later</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Same-day deposits</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>No waiting periods</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Direct bank transfer</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Real-time notifications</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
									<CreditCard className="size-6 text-primary" />
								</div>
								<CardTitle>Accept Any Payment</CardTitle>
								<CardDescription>Credit cards, ACH, digital wallets, cash, and checks</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>All major credit cards</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Apple Pay & Google Pay</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>ACH bank transfers</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Cash & check tracking</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
									<RefreshCw className="size-6 text-primary" />
								</div>
								<CardTitle>Recurring Billing</CardTitle>
								<CardDescription>Automate subscription and maintenance plan payments</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Automatic billing cycles</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Payment retry logic</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Dunning management</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Subscription analytics</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
									<Mail className="size-6 text-primary" />
								</div>
								<CardTitle>Smart Reminders</CardTitle>
								<CardDescription>Automated payment reminders that actually work</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Customizable schedules</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Email & SMS reminders</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Escalation workflows</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>One-click payment links</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
									<Receipt className="size-6 text-primary" />
								</div>
								<CardTitle>Digital Receipts</CardTitle>
								<CardDescription>Instant, professional receipts for every payment</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Auto-send on payment</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Branded templates</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>PDF downloads</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Customer portal access</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
									<Shield className="size-6 text-primary" />
								</div>
								<CardTitle>Bank-Level Security</CardTitle>
								<CardDescription>PCI-compliant payment processing you can trust</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>PCI DSS Level 1 certified</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>256-bit encryption</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Fraud detection</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Chargeback protection</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
									<TrendingUp className="size-6 text-primary" />
								</div>
								<CardTitle>Payment Analytics</CardTitle>
								<CardDescription>Track cash flow and payment trends in real-time</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Revenue dashboards</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>AR aging reports</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
										<span>Payment method breakdown</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
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
									<div className="flex size-16 items-center justify-center rounded-full bg-green-500 font-bold text-2xl text-white">
										JC
									</div>
									<div>
										<div className="font-semibold text-lg">Jennifer Chen</div>
										<div className="text-muted-foreground text-sm">Owner, Chen Plumbing Services</div>
									</div>
								</div>
								<blockquote className="text-lg leading-relaxed">
									"We were paying $2,400/month in credit card fees. With Thorbis, that's $28,800 back in our pocket
									every year. The invoicing is faster, customers pay quicker, and we get the money instantly. It's a
									no-brainer."
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

			{/* CTA Section */}
			<section className="bg-gradient-to-br from-green-500 via-green-600 to-green-500 py-20 text-white">
				<div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
					<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
						<BadgePercent className="size-5" />
						<span className="font-bold">0% Processing Fees Forever</span>
					</div>
					<h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">Stop losing money on payment fees</h2>
					<p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
						Join thousands of service businesses keeping 100% of every payment with Thorbis.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-4">
						<Button asChild className="bg-white text-green-600 shadow-lg hover:bg-white/90" size="lg">
							<Link href="/register">
								Start Saving Today
								<ArrowDownRight className="ml-2 size-4" />
							</Link>
						</Button>
						<Button asChild className="border-white/20 bg-white/10 hover:bg-white/20" size="lg" variant="outline">
							<Link href="/contact">Calculate Your Savings</Link>
						</Button>
					</div>
				</div>
			</section>
		</>
	);
}

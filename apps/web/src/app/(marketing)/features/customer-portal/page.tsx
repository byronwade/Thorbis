import {
	Calendar,
	CheckCircle2,
	CreditCard,
	FileText,
	MessageSquare,
	Phone,
	Shield,
	Smartphone,
	Star,
	Users,
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

const portalKeywords = generateSemanticKeywords("customer portal");

export const metadata = generateSEOMetadata({
	title: "Branded Customer Portal - Self-Service Hub | Thorbis",
	section: "Features",
	description:
		"Give customers 24/7 self-service access. Book appointments, pay invoices, track jobs, and communicate—all from a branded portal that makes you look professional.",
	path: "/features/customer-portal",
	keywords: [
		"customer portal",
		"self-service booking",
		"customer self-service",
		"online booking portal",
		"service business portal",
		...portalKeywords.slice(0, 5),
	],
});

// FAQ Schema - Optimized for AI Overviews
const faqSchema = createFAQSchema([
	{
		question: "What is a customer portal?",
		answer:
			"A customer portal is a secure online hub where your customers can access their account 24/7. With Thorbis, customers can book appointments, view job history, pay invoices, save payment methods, track ongoing jobs in real-time, communicate with your team, and download receipts and invoices. The portal is fully branded with your company logo and colors, making you look professional while reducing phone calls to your office.",
	},
	{
		question: "Can customers book appointments through the portal?",
		answer:
			"Yes. Customers can book appointments directly through the portal with real-time availability. They select a service, choose an available time slot, provide job details, and receive instant confirmation via email and SMS. The booking integrates with your scheduling system automatically—no manual entry needed. You can set booking rules like lead time requirements, blackout dates, and service area restrictions.",
	},
	{
		question: "How do customers pay invoices in the portal?",
		answer:
			"Customers can view all invoices (open and paid) in the portal and pay online instantly. They can pay with credit cards, debit cards, ACH bank transfers, or digital wallets like Apple Pay and Google Pay. Customers can save payment methods for one-click future payments or set up auto-pay for recurring services. All payments are processed with 0% fees and deposit directly to your bank account.",
	},
	{
		question: "Is the customer portal branded with my company logo?",
		answer:
			"Yes. The customer portal is fully white-labeled with your company branding. Add your logo, company name, brand colors, and custom domain (e.g., portal.yourcompany.com). Customers see your brand throughout the experience, not Thorbis. You can customize email notifications, welcome messages, and terms of service. The portal looks and feels like a professional, in-house solution.",
	},
	{
		question: "Can customers track job status in real-time?",
		answer:
			"Yes. Customers can see job status updates in real-time including scheduled, en route, in progress, and completed. When a technician is en route, customers see estimated arrival time and can track their location on a map. After completion, customers can view before/after photos, work performed, parts used, and time on site. Push notifications and email updates keep them informed throughout the job lifecycle.",
	},
	{
		question: "How does the portal reduce calls to my office?",
		answer:
			"The customer portal reduces calls by 40-60% by enabling self-service for common requests. Instead of calling to book appointments, check job status, request invoices, or make payments, customers can do it themselves 24/7. The portal includes a FAQ section, job history, saved payment methods, and messaging system so customers can get answers instantly without waiting on hold or calling during business hours.",
	},
]);

// ItemList Schema - Portal features
const featuresSchema = createItemListSchema({
	name: "Customer Portal Features",
	description:
		"Complete self-service portal with online booking, payments, and job tracking",
	items: [
		{
			name: "Online Appointment Booking",
			url: `${siteUrl}/features/customer-portal`,
			description:
				"24/7 self-service booking with real-time availability, service selection, job details, and instant confirmation via email and SMS.",
		},
		{
			name: "Invoice Payment & History",
			url: `${siteUrl}/features/customer-portal`,
			description:
				"View all invoices, pay online with credit cards or ACH, save payment methods, and set up auto-pay for recurring services.",
		},
		{
			name: "Real-Time Job Tracking",
			url: `${siteUrl}/features/customer-portal`,
			description:
				"Track job status from scheduled to completion, see technician en route with GPS, view before/after photos, and receive push notifications.",
		},
		{
			name: "Full White-Label Branding",
			url: `${siteUrl}/features/customer-portal`,
			description:
				"Custom logo, company colors, and domain (portal.yourcompany.com). Portal looks like your in-house solution, not a third-party tool.",
		},
		{
			name: "Service History & Equipment",
			url: `${siteUrl}/features/customer-portal`,
			description:
				"Complete job history with photos, equipment serviced, maintenance records, warranty info, and service recommendations.",
		},
		{
			name: "Secure Messaging & Support",
			url: `${siteUrl}/features/customer-portal`,
			description:
				"Direct messaging with your office, automated FAQ section, file attachments, and email notifications for new messages.",
		},
	],
});

export default function CustomerPortalPage() {
	const serviceStructuredData = generateServiceStructuredData({
		name: "Customer Portal",
		description: "Branded self-service booking, payments, and job updates",
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
								name: "Customer Portal",
								url: `${siteUrl}/features/customer-portal`,
							},
						]),
					),
				}}
				id="customer-portal-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(serviceStructuredData),
				}}
				id="customer-portal-service-ld"
				type="application/ld+json"
			/>

			{/* FAQ Schema - Optimized for AI Overviews */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqSchema),
				}}
				id="customer-portal-faq-ld"
				strategy="afterInteractive"
				type="application/ld+json"
			/>

			{/* Features List Schema */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(featuresSchema),
				}}
				id="customer-portal-features-ld"
				strategy="afterInteractive"
				type="application/ld+json"
			/>

			{/* Hero Section with Portal Preview */}
			<section className="relative overflow-hidden py-20 sm:py-32">
				<div className="via-background absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />
				<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.15),_transparent_50%)]" />

				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid items-center gap-12 lg:grid-cols-2">
						<div>
							<Badge className="mb-6 gap-1.5 px-3 py-1.5" variant="secondary">
								<Users className="size-3.5" />
								Self-Service Portal
							</Badge>
							<h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
								Your customers' command center
							</h1>
							<p className="text-muted-foreground mb-8 text-lg sm:text-xl">
								A beautiful, branded portal where customers can book, pay, and
								track jobs 24/7. Reduce phone calls, speed up payments, and look
								more professional—all at once.
							</p>
							<div className="flex flex-wrap items-center gap-4">
								<Button
									asChild
									className="shadow-primary/20 shadow-lg"
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

							{/* Key Benefits */}
							<div className="mt-8 grid gap-4 sm:grid-cols-2">
								<div className="flex items-center gap-3">
									<div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
										<CheckCircle2 className="text-primary size-5" />
									</div>
									<div>
										<div className="text-sm font-semibold">65% Fewer Calls</div>
										<div className="text-muted-foreground text-xs">
											Self-service booking
										</div>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="bg-primary/10 flex size-10 items-center justify-center rounded-full">
										<CreditCard className="text-primary size-5" />
									</div>
									<div>
										<div className="text-sm font-semibold">
											2x Faster Payment
										</div>
										<div className="text-muted-foreground text-xs">
											One-click pay
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Portal Preview */}
						<div className="relative">
							<div className="border-border/50 bg-background overflow-hidden rounded-2xl border-2 shadow-2xl">
								{/* Portal Header */}
								<div className="border-border/50 from-primary/10 border-b bg-gradient-to-r to-transparent px-6 py-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="bg-primary flex size-10 items-center justify-center rounded-lg">
												<span className="text-primary-foreground text-xl font-bold">
													R
												</span>
											</div>
											<div>
												<div className="font-semibold">Rodriguez HVAC</div>
												<div className="text-muted-foreground text-xs">
													Customer Portal
												</div>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<div className="bg-muted flex size-8 items-center justify-center rounded-full">
												<span className="text-xs font-semibold">SJ</span>
											</div>
										</div>
									</div>
								</div>

								{/* Portal Navigation */}
								<div className="border-border/50 bg-muted/20 flex border-b">
									<button
										className="border-primary bg-primary/5 border-b-2 px-4 py-3 text-sm font-medium"
										type="button"
									>
										Dashboard
									</button>
									<button
										className="text-muted-foreground hover:bg-muted/40 px-4 py-3 text-sm transition-colors"
										type="button"
									>
										Appointments
									</button>
									<button
										className="text-muted-foreground hover:bg-muted/40 px-4 py-3 text-sm transition-colors"
										type="button"
									>
										Invoices
									</button>
									<button
										className="text-muted-foreground hover:bg-muted/40 px-4 py-3 text-sm transition-colors"
										type="button"
									>
										History
									</button>
								</div>

								{/* Portal Content */}
								<div className="p-6">
									{/* Welcome Message */}
									<div className="border-primary/30 bg-primary/5 mb-6 rounded-lg border p-4">
										<div className="mb-2 text-sm font-semibold">
											Welcome back, Sarah!
										</div>
										<p className="text-muted-foreground text-xs">
											Your next maintenance is due in 3 weeks. Book now and save
											10%.
										</p>
										<Button className="mt-3" size="sm">
											Schedule Maintenance
										</Button>
									</div>

									{/* Quick Actions */}
									<div className="mb-6">
										<div className="mb-3 text-sm font-semibold">
											Quick Actions
										</div>
										<div className="grid grid-cols-2 gap-3">
											<button
												className="bg-background hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center gap-2 rounded-lg border p-4 transition-all"
												type="button"
											>
												<Calendar className="text-primary size-6" />
												<span className="text-xs font-medium">
													Book Service
												</span>
											</button>
											<button
												className="bg-background hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center gap-2 rounded-lg border p-4 transition-all"
												type="button"
											>
												<CreditCard className="text-primary size-6" />
												<span className="text-xs font-medium">Pay Invoice</span>
											</button>
											<button
												className="bg-background hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center gap-2 rounded-lg border p-4 transition-all"
												type="button"
											>
												<MessageSquare className="text-primary size-6" />
												<span className="text-xs font-medium">Contact Us</span>
											</button>
											<button
												className="bg-background hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center gap-2 rounded-lg border p-4 transition-all"
												type="button"
											>
												<FileText className="text-primary size-6" />
												<span className="text-xs font-medium">
													View History
												</span>
											</button>
										</div>
									</div>

									{/* Upcoming Appointment */}
									<div className="mb-4">
										<div className="mb-3 text-sm font-semibold">
											Upcoming Appointment
										</div>
										<div className="bg-background rounded-lg border p-4">
											<div className="mb-2 flex items-start justify-between">
												<div>
													<div className="mb-1 text-sm font-semibold">
														AC Maintenance
													</div>
													<div className="text-muted-foreground text-xs">
														Tomorrow, 2:00 PM - 4:00 PM
													</div>
												</div>
												<Badge className="bg-green-500" variant="secondary">
													Confirmed
												</Badge>
											</div>
											<div className="text-muted-foreground flex items-center gap-2 text-xs">
												<Users className="size-3" />
												<span>Tech: Mike Rodriguez</span>
											</div>
											<div className="mt-3 flex gap-2">
												<Button className="flex-1" size="sm" variant="outline">
													Reschedule
												</Button>
												<Button className="flex-1" size="sm" variant="outline">
													Cancel
												</Button>
											</div>
										</div>
									</div>

									{/* Outstanding Invoice */}
									<div>
										<div className="mb-3 text-sm font-semibold">
											Outstanding Balance
										</div>
										<div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-4">
											<div className="mb-2 flex items-start justify-between">
												<div>
													<div className="mb-1 text-sm font-semibold">
														Invoice #2847
													</div>
													<div className="text-muted-foreground text-xs">
														Due: Jan 15, 2024
													</div>
												</div>
												<div className="text-lg font-bold">$621.36</div>
											</div>
											<Button className="mt-3 w-full" size="sm">
												<CreditCard className="mr-2 size-4" />
												Pay Now
											</Button>
										</div>
									</div>
								</div>
							</div>

							{/* Floating Badge */}
							<div className="border-primary/50 bg-background absolute top-1/4 -right-4 hidden rounded-xl border p-4 shadow-2xl lg:block">
								<div className="mb-2 flex items-center gap-2">
									<div className="bg-primary flex size-6 items-center justify-center rounded-full">
										<Smartphone className="text-primary-foreground size-3" />
									</div>
									<span className="text-sm font-semibold">Mobile-First</span>
								</div>
								<p className="text-muted-foreground text-xs">
									Looks perfect on any device
								</p>
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
							<div className="text-primary mb-2 text-4xl font-bold">65%</div>
							<div className="text-muted-foreground text-sm font-medium">
								Fewer Phone Calls
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">2x</div>
							<div className="text-muted-foreground text-sm font-medium">
								Faster Payments
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">24/7</div>
							<div className="text-muted-foreground text-sm font-medium">
								Self-Service Access
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">4.9★</div>
							<div className="text-muted-foreground text-sm font-medium">
								Customer Satisfaction
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Self-Service Features */}
			<section className="py-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
							Everything customers need, nothing they don't
						</h2>
						<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
							A clean, intuitive interface that makes self-service actually work
						</p>
					</div>

					<div className="grid gap-8 lg:grid-cols-2">
						{/* Online Booking */}
						<Card className="overflow-hidden">
							<CardHeader className="from-primary/5 bg-gradient-to-br to-transparent">
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Calendar className="text-primary size-6" />
								</div>
								<CardTitle>24/7 Online Booking</CardTitle>
								<CardDescription>
									Let customers schedule appointments anytime, anywhere
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-6">
								<div className="mb-6 space-y-4">
									<div className="bg-muted/30 rounded-lg border p-4">
										<div className="mb-3 text-sm font-semibold">
											Real-Time Availability
										</div>
										<ul className="text-muted-foreground space-y-2 text-sm">
											<li>• See open slots instantly</li>
											<li>• Tech availability synced live</li>
											<li>• Service duration estimates</li>
											<li>• Preferred tech selection</li>
										</ul>
									</div>
									<div className="bg-muted/30 rounded-lg border p-4">
										<div className="mb-3 text-sm font-semibold">
											Smart Scheduling
										</div>
										<ul className="text-muted-foreground space-y-2 text-sm">
											<li>• Service-specific questions</li>
											<li>• Equipment history pre-filled</li>
											<li>• Automatic confirmations</li>
											<li>• Calendar integration</li>
										</ul>
									</div>
								</div>
								<div className="border-primary/30 bg-primary/5 rounded-lg border p-4">
									<div className="mb-1 text-sm font-semibold">Impact</div>
									<p className="text-muted-foreground text-xs">
										Customers book 65% more often when they can do it
										themselves, and 40% of bookings happen outside business
										hours.
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Payment Portal */}
						<Card className="overflow-hidden">
							<CardHeader className="bg-gradient-to-br from-green-500/5 to-transparent">
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-green-500/10">
									<CreditCard className="size-6 text-green-600" />
								</div>
								<CardTitle>One-Click Payments</CardTitle>
								<CardDescription>
									Get paid faster with instant payment options
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-6">
								<div className="mb-6 space-y-4">
									<div className="bg-muted/30 rounded-lg border p-4">
										<div className="mb-3 text-sm font-semibold">
											Instant Payment
										</div>
										<ul className="text-muted-foreground space-y-2 text-sm">
											<li>• One-click from email/SMS</li>
											<li>• Saved payment methods</li>
											<li>• Apple Pay & Google Pay</li>
											<li>• Automatic receipts</li>
										</ul>
									</div>
									<div className="bg-muted/30 rounded-lg border p-4">
										<div className="mb-3 text-sm font-semibold">
											Payment Plans
										</div>
										<ul className="text-muted-foreground space-y-2 text-sm">
											<li>• Flexible payment options</li>
											<li>• Automatic installments</li>
											<li>• Payment reminders</li>
											<li>• Balance tracking</li>
										</ul>
									</div>
								</div>
								<div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
									<div className="mb-1 text-sm font-semibold">Impact</div>
									<p className="text-muted-foreground text-xs">
										Customers pay 2x faster through the portal, and you collect
										92% of invoices within 7 days vs. 45 days with traditional
										billing.
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Service History */}
						<Card className="overflow-hidden">
							<CardHeader className="bg-gradient-to-br from-blue-500/5 to-transparent">
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-blue-500/10">
									<FileText className="size-6 text-blue-600" />
								</div>
								<CardTitle>Complete Service History</CardTitle>
								<CardDescription>
									Every job, invoice, and interaction in one place
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-6">
								<div className="mb-6 space-y-4">
									<div className="bg-muted/30 rounded-lg border p-4">
										<div className="mb-3 text-sm font-semibold">
											Job Records
										</div>
										<ul className="text-muted-foreground space-y-2 text-sm">
											<li>• Complete work history</li>
											<li>• Before/after photos</li>
											<li>• Service reports</li>
											<li>• Warranty information</li>
										</ul>
									</div>
									<div className="bg-muted/30 rounded-lg border p-4">
										<div className="mb-3 text-sm font-semibold">
											Equipment Tracking
										</div>
										<ul className="text-muted-foreground space-y-2 text-sm">
											<li>• Equipment age & model</li>
											<li>• Maintenance schedules</li>
											<li>• Parts replaced</li>
											<li>• Service recommendations</li>
										</ul>
									</div>
								</div>
								<div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
									<div className="mb-1 text-sm font-semibold">Impact</div>
									<p className="text-muted-foreground text-xs">
										Customers who can see their history are 3x more likely to
										book maintenance and 2x more likely to accept upsells.
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Communication Hub */}
						<Card className="overflow-hidden">
							<CardHeader className="bg-gradient-to-br from-purple-500/5 to-transparent">
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-purple-500/10">
									<MessageSquare className="size-6 text-purple-600" />
								</div>
								<CardTitle>Direct Messaging</CardTitle>
								<CardDescription>
									Two-way communication without phone tag
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-6">
								<div className="mb-6 space-y-4">
									<div className="bg-muted/30 rounded-lg border p-4">
										<div className="mb-3 text-sm font-semibold">
											Real-Time Chat
										</div>
										<ul className="text-muted-foreground space-y-2 text-sm">
											<li>• Ask questions anytime</li>
											<li>• Photo sharing</li>
											<li>• Notification alerts</li>
											<li>• Message history</li>
										</ul>
									</div>
									<div className="bg-muted/30 rounded-lg border p-4">
										<div className="mb-3 text-sm font-semibold">
											Job Updates
										</div>
										<ul className="text-muted-foreground space-y-2 text-sm">
											<li>• Tech on the way alerts</li>
											<li>• Job completion notices</li>
											<li>• Estimate approvals</li>
											<li>• Review requests</li>
										</ul>
									</div>
								</div>
								<div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
									<div className="mb-1 text-sm font-semibold">Impact</div>
									<p className="text-muted-foreground text-xs">
										Portal messaging reduces phone calls by 65% and improves
										customer satisfaction scores by 28%.
									</p>
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
							Built for modern customers
						</h2>
						<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
							Every feature designed to delight your customers and save your
							team time
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Smartphone className="text-primary size-6" />
								</div>
								<CardTitle>Mobile-First Design</CardTitle>
								<CardDescription>
									Perfect experience on any device
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Responsive layout</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Touch-optimized</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Fast loading</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Offline support</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Shield className="text-primary size-6" />
								</div>
								<CardTitle>Secure & Private</CardTitle>
								<CardDescription>
									Bank-level security for customer data
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
										<span>Two-factor authentication</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>PCI compliant</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>GDPR ready</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Star className="text-primary size-6" />
								</div>
								<CardTitle>Your Branding</CardTitle>
								<CardDescription>
									Fully customizable to match your brand
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Custom logo & colors</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Your domain name</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Custom messaging</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>White-label option</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Phone className="text-primary size-6" />
								</div>
								<CardTitle>Smart Notifications</CardTitle>
								<CardDescription>
									Keep customers informed automatically
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Appointment reminders</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Tech on the way alerts</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Payment confirmations</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Service reminders</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<FileText className="text-primary size-6" />
								</div>
								<CardTitle>Document Library</CardTitle>
								<CardDescription>
									All important files in one place
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Invoices & receipts</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Service reports</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Warranty documents</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Maintenance guides</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Users className="text-primary size-6" />
								</div>
								<CardTitle>Family Accounts</CardTitle>
								<CardDescription>Multiple users, one account</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Multiple properties</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Shared access</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Permission controls</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Unified billing</span>
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
										KM
									</div>
									<div>
										<div className="text-lg font-semibold">Karen Martinez</div>
										<div className="text-muted-foreground text-sm">
											Owner, Martinez Plumbing
										</div>
									</div>
								</div>
								<blockquote className="text-lg leading-relaxed">
									"Our phone used to ring 200 times a day with 'when can you
									come?' and 'did you get my payment?' Now customers book and
									pay themselves through the portal. Our office staff went from
									3 people to 1, and customer satisfaction is at an all-time
									high."
								</blockquote>
								<div className="mt-6 flex items-center gap-4">
									<Badge className="bg-cyan-500">65% Fewer Calls</Badge>
									<Badge variant="secondary">Plumbing</Badge>
									<Badge variant="secondary">Miami, FL</Badge>
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
					items={getRelatedFeatures("customer-portal", 3)}
					variant="grid"
					showDescription={true}
				/>
			</section>

			{/* CTA Section */}
			<section className="bg-gradient-to-br from-cyan-500 via-blue-500 to-cyan-500 py-20 text-white">
				<div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
					<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
						Launch your customer portal today
					</h2>
					<p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
						Join service businesses reducing calls by 65% and getting paid 2x
						faster with Thorbis.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-4">
						<Button
							asChild
							className="bg-white text-cyan-600 shadow-lg hover:bg-white/90"
							size="lg"
						>
							<Link href="/waitlist">
								Join Waitlist
								<Zap className="ml-2 size-4" />
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

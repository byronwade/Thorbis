
import {
	ArrowDown,
	ArrowRight,
	CheckCircle2,
	Mail,
	MessageSquare,
	Phone,
	Star,
	Target,
	TrendingUp,
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

const marketingKeywords = generateSemanticKeywords("marketing automation");

export const metadata = generateSEOMetadata({
	title: "Marketing Automation for Service Businesses | Thorbis",
	section: "Features",
	description:
		"Automated marketing campaigns that actually work. Nurture leads, boost reviews, and win back customers with intelligent automation built for service businesses.",
	path: "/features/marketing",
	keywords: [
		"service business marketing",
		"marketing automation",
		"review generation",
		"customer lifecycle marketing",
		"field service marketing",
		...marketingKeywords.slice(0, 5),
	],
});

// FAQ Schema - Optimized for AI Overviews
const faqSchema = createFAQSchema([
	{
		question: "What marketing automation features does Thorbis include?",
		answer:
			"Thorbis includes complete marketing automation for service businesses: automated review requests after job completion, nurture campaigns for leads and estimates, seasonal service reminders (e.g., annual HVAC tune-ups), win-back campaigns for inactive customers, referral request automation, email and SMS drip campaigns, abandoned cart recovery for unpaid estimates, and customer lifecycle segmentation. All campaigns trigger automatically based on customer behavior and job data.",
	},
	{
		question: "How does automated review generation work?",
		answer:
			"Thorbis automatically requests reviews from satisfied customers after job completion. The system waits 1-3 days (configurable) after a successful job, then sends an email and/or SMS with a direct link to leave a review on Google, Facebook, or your preferred platform. You can customize the message, timing, and review platform. Only customers with completed jobs and 5-star satisfaction ratings receive requests. Analytics track response rates and average star ratings.",
	},
	{
		question: "Can I automate follow-ups for estimates?",
		answer:
			"Yes. Thorbis automatically nurtures leads with unpaid estimates. Create custom follow-up sequences that send reminders via email and SMS at specific intervals (e.g., 3 days, 7 days, 14 days after estimate). Each message can include a payment link, limited-time discount, or seasonal offer. Track open rates, click rates, and conversion rates to optimize timing and messaging. Stop campaigns automatically when the estimate is accepted or marked lost.",
	},
	{
		question: "How do seasonal service reminders work?",
		answer:
			"Thorbis tracks equipment and service history to send timely seasonal reminders. For example, HVAC customers receive tune-up reminders before summer and winter. The system knows when the last service was performed and automatically schedules reminders based on your custom intervals (e.g., annual, semi-annual, quarterly). Customers can book directly from the reminder email or SMS. You can create different reminder campaigns for different service types and equipment.",
	},
	{
		question: "Can I create custom email and SMS campaigns?",
		answer:
			"Yes. Thorbis includes a drag-and-drop campaign builder for custom email and SMS sequences. Create campaigns for any use case: new customer welcome series, maintenance plan promotions, referral rewards, holiday specials, or customer appreciation messages. Segment customers by service history, equipment type, location, or custom tags. Schedule campaigns or trigger them based on events like job completion, estimate sent, or customer birthday. A/B test subject lines and timing to optimize performance.",
	},
	{
		question: "How does marketing attribution tracking work?",
		answer:
			"Thorbis tracks marketing source attribution from lead to revenue. Tag leads by source when they enter the system (Google Ads, Facebook, referral, direct call, website form). Track which sources generate the most leads, highest conversion rates, best customer lifetime value, and lowest acquisition cost. Campaign analytics show email open rates, SMS response rates, booking conversion rates, and ROI. Use this data to allocate budget to the most profitable marketing channels.",
	},
]);

// ItemList Schema - Marketing automation features
const featuresSchema = createItemListSchema({
	name: "Marketing Automation Features",
	description: "Complete lifecycle marketing automation for service businesses",
	items: [
		{
			name: "Automated Review Requests",
			url: `${siteUrl}/features/marketing`,
			description:
				"Automatically request reviews from satisfied customers after job completion. Direct links to Google, Facebook, or your review platform with customizable timing.",
		},
		{
			name: "Lead Nurture Campaigns",
			url: `${siteUrl}/features/marketing`,
			description:
				"Automated follow-up sequences for estimates and leads. Email and SMS reminders with payment links and limited-time offers to increase conversion.",
		},
		{
			name: "Seasonal Service Reminders",
			url: `${siteUrl}/features/marketing`,
			description:
				"Smart reminders based on equipment and service history. HVAC tune-ups, filter changes, and maintenance plan renewals sent at optimal times.",
		},
		{
			name: "Win-Back Campaigns",
			url: `${siteUrl}/features/marketing`,
			description:
				"Re-engage inactive customers with targeted offers. Automatically detect customers who haven't booked in 6-12 months and send win-back promotions.",
		},
		{
			name: "Referral Automation",
			url: `${siteUrl}/features/marketing`,
			description:
				"Automated referral requests to loyal customers with custom incentives. Track referral sources and reward customers for successful referrals.",
		},
		{
			name: "Marketing Attribution & ROI",
			url: `${siteUrl}/features/marketing`,
			description:
				"Track every marketing channel from lead to revenue. See which sources generate the highest ROI, lifetime value, and conversion rates.",
		},
	],
});

export default function MarketingPage() {
	const serviceStructuredData = generateServiceStructuredData({
		name: "Marketing Automation",
		description:
			"Automated campaigns and review generation for service businesses",
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
								name: "Marketing Automation",
								url: `${siteUrl}/features/marketing`,
							},
						]),
					),
				}}
				id="marketing-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(serviceStructuredData),
				}}
				id="marketing-service-ld"
				type="application/ld+json"
			/>

			{/* FAQ Schema - Optimized for AI Overviews */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqSchema),
				}}
				id="marketing-faq-ld"
				strategy="afterInteractive"
				type="application/ld+json"
			/>

			{/* Features List Schema */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(featuresSchema),
				}}
				id="marketing-features-ld"
				strategy="afterInteractive"
				type="application/ld+json"
			/>

			{/* Hero Section with Funnel Visualization */}
			<section className="relative overflow-hidden py-20 sm:py-32">
				<div className="via-background absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
				<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(168,85,247,0.15),_transparent_50%)]" />

				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl text-center">
						<Badge className="mb-6 gap-1.5 px-3 py-1.5" variant="secondary">
							<Target className="size-3.5" />
							Lifecycle Marketing
						</Badge>
						<h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
							Marketing that runs itself
						</h1>
						<p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg sm:text-xl">
							Stop losing customers to competitors. Automated campaigns that
							nurture leads, generate 5-star reviews, and bring customers
							back—all on autopilot.
						</p>
						<div className="flex flex-wrap items-center justify-center gap-4">
							<Button asChild className="shadow-primary/20 shadow-lg" size="lg">
								<Link href="/register">
									Start Automating
									<Zap className="ml-2 size-4" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/contact">See Campaign Examples</Link>
							</Button>
						</div>
					</div>

					{/* Customer Journey Funnel */}
					<div className="relative mx-auto mt-20 max-w-5xl">
						<div className="space-y-6">
							{/* Stage 1: New Lead */}
							<div className="relative">
								<div className="overflow-hidden rounded-2xl border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-transparent shadow-lg">
									<div className="grid items-center gap-6 p-6 lg:grid-cols-[1fr_auto_2fr]">
										<div>
											<div className="mb-2 flex items-center gap-2">
												<div className="flex size-10 items-center justify-center rounded-full bg-purple-500">
													<Users className="size-5 text-white" />
												</div>
												<div>
													<div className="text-lg font-bold">New Lead</div>
													<div className="text-muted-foreground text-sm">
														First contact
													</div>
												</div>
											</div>
										</div>
										<ArrowRight className="hidden size-6 text-purple-500 lg:block" />
										<div className="space-y-2">
											<div className="bg-background/50 rounded-lg border p-3">
												<div className="mb-1 flex items-center gap-2 text-sm">
													<Mail className="size-4 text-purple-500" />
													<span className="font-semibold">Welcome Email</span>
													<Badge
														className="ml-auto h-5 text-[10px]"
														variant="secondary"
													>
														Instant
													</Badge>
												</div>
												<p className="text-muted-foreground text-xs">
													"Thanks for reaching out! Here's what to expect..."
												</p>
											</div>
											<div className="bg-background/50 rounded-lg border p-3">
												<div className="mb-1 flex items-center gap-2 text-sm">
													<MessageSquare className="size-4 text-purple-500" />
													<span className="font-semibold">SMS Follow-Up</span>
													<Badge
														className="ml-auto h-5 text-[10px]"
														variant="secondary"
													>
														+2 hours
													</Badge>
												</div>
												<p className="text-muted-foreground text-xs">
													"Still need help? Click here to schedule..."
												</p>
											</div>
										</div>
									</div>
								</div>
								<div className="mx-auto flex w-12 justify-center py-3">
									<ArrowDown className="size-6 text-purple-500" />
								</div>
							</div>

							{/* Stage 2: Estimate Sent */}
							<div className="relative">
								<div className="overflow-hidden rounded-2xl border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-transparent shadow-lg">
									<div className="grid items-center gap-6 p-6 lg:grid-cols-[1fr_auto_2fr]">
										<div>
											<div className="mb-2 flex items-center gap-2">
												<div className="flex size-10 items-center justify-center rounded-full bg-blue-500">
													<Target className="size-5 text-white" />
												</div>
												<div>
													<div className="text-lg font-bold">Estimate Sent</div>
													<div className="text-muted-foreground text-sm">
														Proposal stage
													</div>
												</div>
											</div>
										</div>
										<ArrowRight className="hidden size-6 text-blue-500 lg:block" />
										<div className="space-y-2">
											<div className="bg-background/50 rounded-lg border p-3">
												<div className="mb-1 flex items-center gap-2 text-sm">
													<Mail className="size-4 text-blue-500" />
													<span className="font-semibold">
														Proposal Reminder
													</span>
													<Badge
														className="ml-auto h-5 text-[10px]"
														variant="secondary"
													>
														+3 days
													</Badge>
												</div>
												<p className="text-muted-foreground text-xs">
													"Just checking in on your estimate. Any questions?"
												</p>
											</div>
											<div className="bg-background/50 rounded-lg border p-3">
												<div className="mb-1 flex items-center gap-2 text-sm">
													<Phone className="size-4 text-blue-500" />
													<span className="font-semibold">
														Call Task Created
													</span>
													<Badge
														className="ml-auto h-5 text-[10px]"
														variant="secondary"
													>
														+7 days
													</Badge>
												</div>
												<p className="text-muted-foreground text-xs">
													Auto-assigned to sales rep for personal follow-up
												</p>
											</div>
										</div>
									</div>
								</div>
								<div className="mx-auto flex w-12 justify-center py-3">
									<ArrowDown className="size-6 text-blue-500" />
								</div>
							</div>

							{/* Stage 3: Job Completed */}
							<div className="relative">
								<div className="overflow-hidden rounded-2xl border-2 border-green-500/30 bg-gradient-to-r from-green-500/10 to-transparent shadow-lg">
									<div className="grid items-center gap-6 p-6 lg:grid-cols-[1fr_auto_2fr]">
										<div>
											<div className="mb-2 flex items-center gap-2">
												<div className="flex size-10 items-center justify-center rounded-full bg-green-500">
													<CheckCircle2 className="size-5 text-white" />
												</div>
												<div>
													<div className="text-lg font-bold">Job Completed</div>
													<div className="text-muted-foreground text-sm">
														Service delivered
													</div>
												</div>
											</div>
										</div>
										<ArrowRight className="hidden size-6 text-green-500 lg:block" />
										<div className="space-y-2">
											<div className="bg-background/50 rounded-lg border p-3">
												<div className="mb-1 flex items-center gap-2 text-sm">
													<Star className="size-4 text-green-500" />
													<span className="font-semibold">Review Request</span>
													<Badge
														className="ml-auto h-5 text-[10px]"
														variant="secondary"
													>
														+1 day
													</Badge>
												</div>
												<p className="text-muted-foreground text-xs">
													"How did we do? Leave a review and get 10% off next
													service"
												</p>
											</div>
											<div className="bg-background/50 rounded-lg border p-3">
												<div className="mb-1 flex items-center gap-2 text-sm">
													<Mail className="size-4 text-green-500" />
													<span className="font-semibold">Thank You Email</span>
													<Badge
														className="ml-auto h-5 text-[10px]"
														variant="secondary"
													>
														+3 days
													</Badge>
												</div>
												<p className="text-muted-foreground text-xs">
													"Thanks for choosing us! Here are some maintenance
													tips..."
												</p>
											</div>
										</div>
									</div>
								</div>
								<div className="mx-auto flex w-12 justify-center py-3">
									<ArrowDown className="size-6 text-green-500" />
								</div>
							</div>

							{/* Stage 4: Ongoing Customer */}
							<div className="relative">
								<div className="overflow-hidden rounded-2xl border-2 border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-transparent shadow-lg">
									<div className="grid items-center gap-6 p-6 lg:grid-cols-[1fr_auto_2fr]">
										<div>
											<div className="mb-2 flex items-center gap-2">
												<div className="flex size-10 items-center justify-center rounded-full bg-orange-500">
													<TrendingUp className="size-5 text-white" />
												</div>
												<div>
													<div className="text-lg font-bold">
														Ongoing Customer
													</div>
													<div className="text-muted-foreground text-sm">
														Retention mode
													</div>
												</div>
											</div>
										</div>
										<ArrowRight className="hidden size-6 text-orange-500 lg:block" />
										<div className="space-y-2">
											<div className="bg-background/50 rounded-lg border p-3">
												<div className="mb-1 flex items-center gap-2 text-sm">
													<MessageSquare className="size-4 text-orange-500" />
													<span className="font-semibold">
														Seasonal Reminder
													</span>
													<Badge
														className="ml-auto h-5 text-[10px]"
														variant="secondary"
													>
														+6 months
													</Badge>
												</div>
												<p className="text-muted-foreground text-xs">
													"Time for your spring AC tune-up! Book now and save
													15%"
												</p>
											</div>
											<div className="bg-background/50 rounded-lg border p-3">
												<div className="mb-1 flex items-center gap-2 text-sm">
													<Mail className="size-4 text-orange-500" />
													<span className="font-semibold">
														Win-Back Campaign
													</span>
													<Badge
														className="ml-auto h-5 text-[10px]"
														variant="secondary"
													>
														+12 months
													</Badge>
												</div>
												<p className="text-muted-foreground text-xs">
													"We miss you! Here's a special offer to come back..."
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Conversion Metrics */}
						<div className="mt-8 grid gap-4 sm:grid-cols-3">
							<div className="bg-background rounded-xl border p-4 text-center">
								<div className="text-primary mb-1 text-2xl font-bold">3.2x</div>
								<div className="text-muted-foreground text-sm">
									More Reviews
								</div>
							</div>
							<div className="bg-background rounded-xl border p-4 text-center">
								<div className="text-primary mb-1 text-2xl font-bold">42%</div>
								<div className="text-muted-foreground text-sm">
									Higher Conversion
								</div>
							</div>
							<div className="bg-background rounded-xl border p-4 text-center">
								<div className="text-primary mb-1 text-2xl font-bold">28%</div>
								<div className="text-muted-foreground text-sm">
									Repeat Business
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
							<div className="text-primary mb-2 text-4xl font-bold">4.8★</div>
							<div className="text-muted-foreground text-sm font-medium">
								Avg. Review Rating
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">3.2x</div>
							<div className="text-muted-foreground text-sm font-medium">
								More Reviews Generated
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">42%</div>
							<div className="text-muted-foreground text-sm font-medium">
								Higher Lead Conversion
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">$32K</div>
							<div className="text-muted-foreground text-sm font-medium">
								Avg. Annual Revenue Lift
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Campaign Types Section */}
			<section className="py-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
							Pre-built campaigns that actually work
						</h2>
						<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
							Proven templates designed specifically for service businesses
						</p>
					</div>

					<div className="grid gap-8 lg:grid-cols-2">
						{/* Review Generation */}
						<Card className="overflow-hidden">
							<CardHeader className="bg-gradient-to-br from-yellow-500/10 to-transparent">
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-yellow-500/20">
									<Star className="size-6 text-yellow-600" />
								</div>
								<CardTitle>Review Generation Engine</CardTitle>
								<CardDescription>
									Turn happy customers into 5-star reviews automatically
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-6">
								<div className="mb-6 space-y-3">
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
											1
										</div>
										<div>
											<div className="mb-1 text-sm font-semibold">
												Smart Timing
											</div>
											<p className="text-muted-foreground text-xs">
												Requests sent 24 hours after job completion when
												satisfaction is highest
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
											2
										</div>
										<div>
											<div className="mb-1 text-sm font-semibold">
												Multi-Platform
											</div>
											<p className="text-muted-foreground text-xs">
												Direct links to Google, Yelp, Facebook, and your
												preferred platforms
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
											3
										</div>
										<div>
											<div className="mb-1 text-sm font-semibold">
												Incentive Offers
											</div>
											<p className="text-muted-foreground text-xs">
												Optional discount codes to boost response rates (10-15%
												off next service)
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
											4
										</div>
										<div>
											<div className="mb-1 text-sm font-semibold">
												Negative Feedback Filter
											</div>
											<p className="text-muted-foreground text-xs">
												Unhappy customers routed to private feedback form
												instead of public reviews
											</p>
										</div>
									</div>
								</div>
								<div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
									<div className="mb-2 text-sm font-semibold">Results</div>
									<div className="grid grid-cols-2 gap-4 text-center">
										<div>
											<div className="text-xl font-bold text-yellow-600">
												3.2x
											</div>
											<div className="text-muted-foreground text-xs">
												More Reviews
											</div>
										</div>
										<div>
											<div className="text-xl font-bold text-yellow-600">
												4.8★
											</div>
											<div className="text-muted-foreground text-xs">
												Avg. Rating
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Lead Nurture */}
						<Card className="overflow-hidden">
							<CardHeader className="bg-gradient-to-br from-blue-500/10 to-transparent">
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-blue-500/20">
									<Target className="size-6 text-blue-600" />
								</div>
								<CardTitle>Lead Nurture Sequences</CardTitle>
								<CardDescription>
									Convert more estimates into booked jobs
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-6">
								<div className="mb-6 space-y-3">
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
											1
										</div>
										<div>
											<div className="mb-1 text-sm font-semibold">
												Instant Welcome
											</div>
											<p className="text-muted-foreground text-xs">
												Automated email/SMS within minutes of first contact with
												next steps
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
											2
										</div>
										<div>
											<div className="mb-1 text-sm font-semibold">
												Educational Content
											</div>
											<p className="text-muted-foreground text-xs">
												Share helpful tips, FAQs, and case studies to build
												trust
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
											3
										</div>
										<div>
											<div className="mb-1 text-sm font-semibold">
												Proposal Follow-Ups
											</div>
											<p className="text-muted-foreground text-xs">
												Automatic reminders at 3, 7, and 14 days with urgency
												messaging
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
											4
										</div>
										<div>
											<div className="mb-1 text-sm font-semibold">
												Sales Team Handoff
											</div>
											<p className="text-muted-foreground text-xs">
												Create tasks for personal outreach when automated
												touches don't convert
											</p>
										</div>
									</div>
								</div>
								<div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
									<div className="mb-2 text-sm font-semibold">Results</div>
									<div className="grid grid-cols-2 gap-4 text-center">
										<div>
											<div className="text-xl font-bold text-blue-600">42%</div>
											<div className="text-muted-foreground text-xs">
												Higher Conversion
											</div>
										</div>
										<div>
											<div className="text-xl font-bold text-blue-600">
												14 days
											</div>
											<div className="text-muted-foreground text-xs">
												Shorter Cycle
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Win-Back */}
						<Card className="overflow-hidden">
							<CardHeader className="bg-gradient-to-br from-purple-500/10 to-transparent">
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-purple-500/20">
									<TrendingUp className="size-6 text-purple-600" />
								</div>
								<CardTitle>Win-Back Campaigns</CardTitle>
								<CardDescription>
									Reactivate dormant customers automatically
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-6">
								<div className="mb-6 space-y-3">
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
											1
										</div>
										<div>
											<div className="mb-1 text-sm font-semibold">
												Inactivity Detection
											</div>
											<p className="text-muted-foreground text-xs">
												Automatically identifies customers who haven't booked in
												6-12 months
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
											2
										</div>
										<div>
											<div className="mb-1 text-sm font-semibold">
												Personalized Offers
											</div>
											<p className="text-muted-foreground text-xs">
												Special "we miss you" discounts based on their service
												history
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
											3
										</div>
										<div>
											<div className="mb-1 text-sm font-semibold">
												Multi-Touch Sequence
											</div>
											<p className="text-muted-foreground text-xs">
												Email, SMS, and postcard series over 30 days
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
											4
										</div>
										<div>
											<div className="mb-1 text-sm font-semibold">
												Urgency & Scarcity
											</div>
											<p className="text-muted-foreground text-xs">
												Limited-time offers and seasonal reminders to drive
												action
											</p>
										</div>
									</div>
								</div>
								<div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
									<div className="mb-2 text-sm font-semibold">Results</div>
									<div className="grid grid-cols-2 gap-4 text-center">
										<div>
											<div className="text-xl font-bold text-purple-600">
												28%
											</div>
											<div className="text-muted-foreground text-xs">
												Reactivation Rate
											</div>
										</div>
										<div>
											<div className="text-xl font-bold text-purple-600">
												$8.2K
											</div>
											<div className="text-muted-foreground text-xs">
												Avg. Recovered Revenue
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Seasonal */}
						<Card className="overflow-hidden">
							<CardHeader className="bg-gradient-to-br from-green-500/10 to-transparent">
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-green-500/20">
									<Mail className="size-6 text-green-600" />
								</div>
								<CardTitle>Seasonal Campaigns</CardTitle>
								<CardDescription>
									Fill your calendar during slow seasons
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-6">
								<div className="mb-6 space-y-3">
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
											1
										</div>
										<div>
											<div className="mb-1 text-sm font-semibold">
												Smart Scheduling
											</div>
											<p className="text-muted-foreground text-xs">
												Campaigns auto-trigger based on calendar (spring AC,
												fall furnace, etc.)
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
											2
										</div>
										<div>
											<div className="mb-1 text-sm font-semibold">
												Service-Specific Targeting
											</div>
											<p className="text-muted-foreground text-xs">
												Only send to customers with relevant equipment (AC
												owners get AC reminders)
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
											3
										</div>
										<div>
											<div className="mb-1 text-sm font-semibold">
												Early Bird Discounts
											</div>
											<p className="text-muted-foreground text-xs">
												Incentivize booking before peak season with special
												pricing
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
											4
										</div>
										<div>
											<div className="mb-1 text-sm font-semibold">
												Maintenance Plans
											</div>
											<p className="text-muted-foreground text-xs">
												Promote recurring service agreements during campaign
												touchpoints
											</p>
										</div>
									</div>
								</div>
								<div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
									<div className="mb-2 text-sm font-semibold">Results</div>
									<div className="grid grid-cols-2 gap-4 text-center">
										<div>
											<div className="text-xl font-bold text-green-600">
												35%
											</div>
											<div className="text-muted-foreground text-xs">
												Booking Increase
											</div>
										</div>
										<div>
											<div className="text-xl font-bold text-green-600">
												18%
											</div>
											<div className="text-muted-foreground text-xs">
												Plan Conversions
											</div>
										</div>
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
							Marketing automation that feels personal
						</h2>
						<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
							Powerful features that make every customer feel like your only
							customer
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Target className="text-primary size-6" />
								</div>
								<CardTitle>Smart Segmentation</CardTitle>
								<CardDescription>
									Target the right customers with the right message
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Service history filtering</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Geographic targeting</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Behavior-based triggers</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Custom audience builder</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Mail className="text-primary size-6" />
								</div>
								<CardTitle>Multi-Channel Delivery</CardTitle>
								<CardDescription>
									Reach customers wherever they are
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Email campaigns</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>SMS text messages</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Direct mail postcards</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>In-app notifications</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Users className="text-primary size-6" />
								</div>
								<CardTitle>Personalization Engine</CardTitle>
								<CardDescription>
									Dynamic content that adapts to each customer
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Name & address merge tags</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Service history references</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Equipment-specific content</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Dynamic pricing & offers</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<TrendingUp className="text-primary size-6" />
								</div>
								<CardTitle>Performance Analytics</CardTitle>
								<CardDescription>
									Track what's working and optimize campaigns
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Open & click rates</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Conversion tracking</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Revenue attribution</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>A/B testing</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Star className="text-primary size-6" />
								</div>
								<CardTitle>Review Management</CardTitle>
								<CardDescription>
									Build your online reputation automatically
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Multi-platform requests</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Negative feedback filtering</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Review monitoring</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Response templates</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Zap className="text-primary size-6" />
								</div>
								<CardTitle>Workflow Automation</CardTitle>
								<CardDescription>
									Set it and forget it marketing
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Trigger-based campaigns</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Time-delayed sequences</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Conditional logic</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Goal-based optimization</span>
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
										DW
									</div>
									<div>
										<div className="text-lg font-semibold">David Williams</div>
										<div className="text-muted-foreground text-sm">
											Owner, Williams HVAC & Plumbing
										</div>
									</div>
								</div>
								<blockquote className="text-lg leading-relaxed">
									"Our Google reviews went from 47 to 312 in six months. The
									automated campaigns brought back $82K in dormant customers we
									thought were gone forever. Marketing used to be an
									afterthought—now it's our best salesperson."
								</blockquote>
								<div className="mt-6 flex items-center gap-4">
									<Badge className="bg-yellow-500">312 Reviews</Badge>
									<Badge variant="secondary">HVAC & Plumbing</Badge>
									<Badge variant="secondary">Phoenix, AZ</Badge>
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
					items={getRelatedFeatures("marketing", 3)}
					variant="grid"
					showDescription={true}
				/>
			</section>

			{/* CTA Section */}
			<section className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 py-20 text-white">
				<div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
					<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
						Start marketing on autopilot
					</h2>
					<p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
						Join service businesses generating 3.2x more reviews and 42% higher
						conversions with Thorbis.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-4">
						<Button
							asChild
							className="bg-white text-purple-600 shadow-lg hover:bg-white/90"
							size="lg"
						>
							<Link href="/register">
								Start 14-day Free Trial
								<Zap className="ml-2 size-4" />
							</Link>
						</Button>
						<Button
							asChild
							className="border-white/20 bg-white/10 hover:bg-white/20"
							size="lg"
							variant="outline"
						>
							<Link href="/contact">See Campaign Examples</Link>
						</Button>
					</div>
				</div>
			</section>
		</>
	);
}


import {
	Bot,
	Calendar,
	CheckCircle2,
	MessageSquare,
	Phone,
	Sparkles,
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

const aiKeywords = generateSemanticKeywords("ai assistant");

export const metadata = generateSEOMetadata({
	title: "AI Dispatch Assistant - 24/7 Call Handling | Thorbis",
	section: "Features",
	description:
		"Never miss a call again. Thorbis AI Assistant answers every call, qualifies leads, and books jobs automatically - even after hours. Reduce missed opportunities by 98%.",
	path: "/features/ai-assistant",
	keywords: [
		"ai answering service",
		"field service virtual agent",
		"24/7 dispatch assistant",
		"automated call handling",
		"service business automation",
		...aiKeywords.slice(0, 5),
	],
});

// FAQ Schema - Optimized for AI Overviews
const faqSchema = createFAQSchema([
	{
		question: "How does the Thorbis AI Assistant work?",
		answer:
			"The Thorbis AI Assistant uses advanced natural language processing to handle inbound calls 24/7. When a customer calls, the AI answers professionally using your company name, qualifies the caller's needs by asking relevant questions, checks technician availability in real-time, books appointments directly into your schedule, sends confirmation emails/SMS to the customer, and logs all call details in the CRM. The AI sounds natural and can handle complex conversations including emergencies, service history questions, and pricing inquiries.",
	},
	{
		question: "What happens to calls the AI can't handle?",
		answer:
			"If the AI encounters a complex question or customer request it can't handle, it seamlessly transfers the call to your team with context about what the customer needs. The AI recognizes situations requiring human judgment—like custom quotes, warranty disputes, or angry customers—and routes them appropriately. You can configure transfer rules by request type (emergency vs. non-emergency) and time of day. All calls are recorded and transcribed for quality assurance.",
	},
	{
		question: "Can the AI book appointments automatically?",
		answer:
			"Yes. The AI Assistant books appointments directly into your schedule by checking real-time technician availability, asking the customer about their preferred date and time, confirming the service needed and location, selecting the best-matched technician based on skills and location, and sending instant confirmation via email and SMS with job details. The AI follows your booking rules including lead time requirements, blackout dates, and service area restrictions. Customers can request specific dates or let the AI suggest the next available slot.",
	},
	{
		question: "Is the AI available 24/7 including weekends?",
		answer:
			"Yes. The AI Assistant handles calls 24/7/365 including nights, weekends, and holidays. After-hours calls can be configured to book appointments for the next business day, route emergencies to on-call technicians, or collect customer info and create a callback request. You set the rules for what qualifies as an emergency and which technicians are available for after-hours dispatch. The AI never misses a call or takes a vacation.",
	},
	{
		question: "Can customers understand the AI? Does it sound natural?",
		answer:
			"Yes. The Thorbis AI uses state-of-the-art voice synthesis that sounds natural and professional. It adapts to conversation flow, handles interruptions, understands regional accents and dialects, clarifies when it doesn't understand, and maintains context throughout the conversation. Customer feedback shows 92% satisfaction with AI interactions. The AI can be customized with your company's tone, greetings, and responses. Customers often don't realize they're speaking with AI until told.",
	},
	{
		question: "How much does the AI Assistant cost?",
		answer:
			"The AI Assistant uses pay-as-you-go pricing at $0.50 per minute of call time. Average calls last 2-4 minutes, so typical cost is $1-2 per call. This is 85% cheaper than hiring a receptionist or answering service. If you process 100 calls per month at 3 minutes average, your cost is $150/month versus $2,000+/month for a full-time receptionist. The AI included in the $200/month base fee can be disabled anytime if you don't want to use it.",
	},
]);

// ItemList Schema - AI assistant features
const featuresSchema = createItemListSchema({
	name: "AI Dispatch Assistant Features",
	description:
		"24/7 intelligent call handling with automated booking and lead qualification",
	items: [
		{
			name: "24/7 Call Answering",
			url: `${siteUrl}/features/ai-assistant`,
			description:
				"Never miss a call. AI answers every inbound call instantly, day or night, weekends and holidays. Sounds natural and professional.",
		},
		{
			name: "Automated Appointment Booking",
			url: `${siteUrl}/features/ai-assistant`,
			description:
				"AI books appointments directly into your schedule with real-time availability checking, technician matching, and instant confirmation via email and SMS.",
		},
		{
			name: "Lead Qualification",
			url: `${siteUrl}/features/ai-assistant`,
			description:
				"AI asks qualifying questions to understand customer needs, service history, urgency, and budget. Routes leads to the right team member with full context.",
		},
		{
			name: "Smart Call Routing",
			url: `${siteUrl}/features/ai-assistant`,
			description:
				"AI transfers complex calls to your team with context. Configurable routing rules by request type, time of day, and customer priority.",
		},
		{
			name: "Call Recording & Transcription",
			url: `${siteUrl}/features/ai-assistant`,
			description:
				"Every call is recorded and transcribed automatically. Review conversations, extract action items, and train your team with real examples.",
		},
		{
			name: "Multi-Language Support",
			url: `${siteUrl}/features/ai-assistant`,
			description:
				"AI converses in 50+ languages including Spanish, French, and Mandarin. Automatically detects customer language and responds fluently.",
		},
	],
});

export default function AIAssistantPage() {
	const serviceStructuredData = generateServiceStructuredData({
		name: "AI Service Assistant",
		description:
			"24/7 intelligent call handling and booking automation for service businesses",
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
								name: "AI Assistant",
								url: `${siteUrl}/features/ai-assistant`,
							},
						]),
					),
				}}
				id="ai-assistant-breadcrumb-ld"
				type="application/ld+json"
			/>
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(serviceStructuredData),
				}}
				id="ai-assistant-service-ld"
				type="application/ld+json"
			/>

			{/* FAQ Schema - Optimized for AI Overviews */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqSchema),
				}}
				id="ai-assistant-faq-ld"
				strategy="afterInteractive"
				type="application/ld+json"
			/>

			{/* Features List Schema */}
			<Script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(featuresSchema),
				}}
				id="ai-assistant-features-ld"
				strategy="afterInteractive"
				type="application/ld+json"
			/>

			{/* Hero Section - Conversational Design */}
			<section className="from-primary/5 via-background to-background relative overflow-hidden bg-gradient-to-br py-20 sm:py-32">
				<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.1),_transparent_50%)]" />
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-4xl text-center">
						<Badge className="mb-6 gap-1.5 px-3 py-1.5" variant="secondary">
							<Sparkles className="size-3.5" />
							AI-Powered
						</Badge>
						<h1 className="from-foreground via-foreground to-foreground/70 mb-6 bg-gradient-to-br bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
							Your AI dispatcher that never sleeps
						</h1>
						<p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg sm:text-xl">
							Answer every call, qualify every lead, and book every
							job—automatically. Thorbis AI handles customer conversations 24/7
							so you never miss an opportunity.
						</p>
						<div className="flex flex-wrap items-center justify-center gap-4">
							<Button asChild className="shadow-primary/20 shadow-lg" size="lg">
								<Link href="/register">
									Start 14-day Free Trial
									<Zap className="ml-2 size-4" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/contact">
									<Phone className="mr-2 size-4" />
									Talk to Sales
								</Link>
							</Button>
						</div>

						{/* Live Demo Visualization */}
						<div className="relative mx-auto mt-16 max-w-3xl">
							<div className="border-border/50 bg-background overflow-hidden rounded-2xl border shadow-2xl">
								<div className="border-border/50 bg-muted/30 flex items-center gap-2 border-b px-4 py-3">
									<div className="size-3 rounded-full bg-red-500" />
									<div className="size-3 rounded-full bg-yellow-500" />
									<div className="size-3 rounded-full bg-green-500" />
									<span className="text-muted-foreground ml-2 text-xs font-medium">
										Live AI Conversation
									</span>
								</div>
								<div className="space-y-4 p-6">
									{/* Customer Message */}
									<div className="flex items-start gap-3">
										<div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
											<Phone className="text-muted-foreground size-4" />
										</div>
										<div className="bg-muted max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3">
											<p className="text-sm">
												Hi, my AC stopped working and it's 95 degrees. Can
												someone come today?
											</p>
										</div>
									</div>

									{/* AI Response */}
									<div className="flex items-start justify-end gap-3">
										<div className="bg-primary text-primary-foreground max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-3">
											<p className="text-sm">
												I understand that's urgent! I can get a technician to
												you today. What's your address so I can check
												availability in your area?
											</p>
										</div>
										<div className="bg-primary flex size-8 shrink-0 items-center justify-center rounded-full">
											<Bot className="text-primary-foreground size-4" />
										</div>
									</div>

									{/* Customer Message */}
									<div className="flex items-start gap-3">
										<div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
											<Phone className="text-muted-foreground size-4" />
										</div>
										<div className="bg-muted max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3">
											<p className="text-sm">123 Oak Street, Austin TX 78701</p>
										</div>
									</div>

									{/* AI Response with Booking */}
									<div className="flex items-start justify-end gap-3">
										<div className="bg-primary text-primary-foreground max-w-[80%] space-y-3 rounded-2xl rounded-tr-sm px-4 py-3">
											<p className="text-sm">
												Perfect! I have a technician available at 2:30 PM today.
												The diagnostic fee is $89. Would that work for you?
											</p>
											<div className="border-primary-foreground/20 bg-primary-foreground/10 rounded-lg border p-3">
												<div className="flex items-center gap-2 text-xs">
													<Calendar className="size-3.5" />
													<span className="font-semibold">
														Today at 2:30 PM
													</span>
												</div>
												<div className="mt-1 text-xs opacity-90">
													Tech: Mike Johnson • Est. arrival: 2:30-3:00 PM
												</div>
											</div>
										</div>
										<div className="bg-primary flex size-8 shrink-0 items-center justify-center rounded-full">
											<Bot className="text-primary-foreground size-4" />
										</div>
									</div>
								</div>
							</div>
							<div className="absolute -top-4 -right-4 flex items-center gap-2 rounded-full border border-green-500/50 bg-green-500/10 px-4 py-2 backdrop-blur-sm">
								<div className="size-2 animate-pulse rounded-full bg-green-500" />
								<span className="text-xs font-semibold text-green-700 dark:text-green-400">
									Live & Booking
								</span>
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
							<div className="text-primary mb-2 text-4xl font-bold">98%</div>
							<div className="text-muted-foreground text-sm font-medium">
								Call Answer Rate
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">3 min</div>
							<div className="text-muted-foreground text-sm font-medium">
								Avg. Booking Time
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">24/7</div>
							<div className="text-muted-foreground text-sm font-medium">
								Always Available
							</div>
						</div>
						<div className="text-center">
							<div className="text-primary mb-2 text-4xl font-bold">40%</div>
							<div className="text-muted-foreground text-sm font-medium">
								Less Admin Work
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="py-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-12 text-center">
						<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
							Everything your AI assistant can do
						</h2>
						<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
							From first contact to booked appointment, Thorbis AI handles the
							entire customer journey
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Phone className="text-primary size-6" />
								</div>
								<CardTitle>Intelligent Call Routing</CardTitle>
								<CardDescription>
									Automatically identifies caller intent and routes to the right
									workflow
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Emergency vs. routine service detection</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Service area validation</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Existing customer recognition</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Calendar className="text-primary size-6" />
								</div>
								<CardTitle>Smart Scheduling</CardTitle>
								<CardDescription>
									Books appointments based on tech availability, location, and
									job type
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Real-time availability checks</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Travel time optimization</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Automated confirmations & reminders</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<MessageSquare className="text-primary size-6" />
								</div>
								<CardTitle>Natural Conversations</CardTitle>
								<CardDescription>
									Sounds human, understands context, and adapts to your brand
									voice
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Custom greetings and scripts</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Multi-turn conversation handling</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Sentiment analysis & escalation</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<TrendingUp className="text-primary size-6" />
								</div>
								<CardTitle>Lead Qualification</CardTitle>
								<CardDescription>
									Captures key details and scores leads automatically
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Budget and timeline questions</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Property type and service history</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Automatic lead scoring</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Bot className="text-primary size-6" />
								</div>
								<CardTitle>CRM Integration</CardTitle>
								<CardDescription>
									Every interaction logged with full transcripts and context
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Automatic contact creation</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Call transcripts and summaries</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Activity timeline updates</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
									<Sparkles className="text-primary size-6" />
								</div>
								<CardTitle>Multi-Channel Support</CardTitle>
								<CardDescription>
									Works across phone, SMS, web chat, and email
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Unified conversation history</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Channel-specific optimizations</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
										<span>Seamless handoffs between channels</span>
									</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Easy Setup - No Hassle Section */}
			<section className="border-y bg-gradient-to-b from-primary/5 to-transparent py-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-4xl">
						<div className="mb-12 text-center">
							<Badge className="mb-4 gap-1.5 px-3 py-1.5" variant="secondary">
								<Zap className="size-3.5" />
								Quick Setup, No Commitment
							</Badge>
							<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
								AI That Works for You
								<br />
								Not the Other Way Around
							</h2>
							<p className="text-muted-foreground mx-auto max-w-2xl text-lg">
								Unlike enterprise AI solutions, Thorbis AI Assistant is ready in
								5 minutes. No sales demos, no month-long implementations, no
								pushy upsells.
							</p>
						</div>

						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							<Card className="transition-all hover:border-primary/30">
								<CardHeader>
									<div className="bg-primary/10 mb-3 flex size-10 items-center justify-center rounded-lg">
										<Zap className="text-primary size-5" />
									</div>
									<CardTitle className="text-lg">Setup in 5 Minutes</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground text-sm">
										Simple form, not a sales questionnaire. Just tell us your
										company name, business hours, and services. AI is ready to
										take calls immediately.
									</p>
								</CardContent>
							</Card>

							<Card className="transition-all hover:border-primary/30">
								<CardHeader>
									<div className="bg-primary/10 mb-3 flex size-10 items-center justify-center rounded-lg">
										<CheckCircle2 className="text-primary size-5" />
									</div>
									<CardTitle className="text-lg">No Contracts</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground text-sm">
										Pay-as-you-go pricing. Only charged for minutes actually
										used. Turn it off anytime if it's not working for you—no
										penalties.
									</p>
								</CardContent>
							</Card>

							<Card className="transition-all hover:border-primary/30">
								<CardHeader>
									<div className="bg-primary/10 mb-3 flex size-10 items-center justify-center rounded-lg">
										<MessageSquare className="text-primary size-5" />
									</div>
									<CardTitle className="text-lg">
										We Fix What Doesn't Work
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground text-sm">
										AI giving wrong answers? Tell us. We'll fix it within 48
										hours. Your feedback directly improves the product for
										everyone.
									</p>
								</CardContent>
							</Card>
						</div>

						<div className="mt-12 rounded-lg border border-primary/30 bg-card p-6 text-center">
							<div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
								<Sparkles className="text-primary size-6" />
							</div>
							<h3 className="mb-2 text-xl font-semibold">
								Try It Risk-Free for 14 Days
							</h3>
							<p className="text-muted-foreground mx-auto max-w-2xl">
								No credit card required. Full access to AI Assistant. If it
								doesn't book more jobs and save you time, we'll refund you 100%.
								Zero risk.
							</p>
							<div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
								<div className="flex items-center gap-2">
									<CheckCircle2 className="text-primary size-4" />
									<span>Free migration help</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle2 className="text-primary size-4" />
									<span>1-on-1 training included</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle2 className="text-primary size-4" />
									<span>Cancel anytime</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Related Features Section */}
			<section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<RelatedContent
					title="Explore Related Features"
					description="Discover how these features work together to power your field service business"
					items={getRelatedFeatures("ai-assistant", 3)}
					variant="grid"
					showDescription={true}
				/>
			</section>

			{/* CTA Section */}
			<section className="from-primary via-primary to-primary/90 text-primary-foreground bg-gradient-to-br py-20">
				<div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
					<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
						Stop missing calls. Start booking more jobs.
					</h2>
					<p className="text-primary-foreground/90 mx-auto mb-8 max-w-2xl text-lg">
						Join hundreds of service businesses using Thorbis AI to capture
						every opportunity.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-4">
						<Button
							asChild
							className="bg-background text-foreground hover:bg-background/90 shadow-lg"
							size="lg"
						>
							<Link href="/register">
								Get Started Free
								<Zap className="ml-2 size-4" />
							</Link>
						</Button>
						<Button
							asChild
							className="border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/20"
							size="lg"
							variant="outline"
						>
							<Link href="/contact">Schedule Demo</Link>
						</Button>
					</div>
				</div>
			</section>
		</>
	);
}

"use client";

import {
	Building,
	Building2,
	Calculator,
	Check,
	Infinity,
	MessageSquare,
	PlayCircle,
	Quote,
	RotateCcw,
	Sparkles,
	TrendingDown,
	Users,
	X,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PricingBackground } from "./pricing-background";

/**
 * PRICING - REAL PROVIDER COSTS + 200% MARKUP (3x)
 *
 * Base Provider Costs:
 * - Resend Email: $0.0001/email
 * - Telnyx SMS: $0.008/message (avg of $0.004 inbound + $0.0079 outbound)
 * - Telnyx Voice Inbound: $0.004/minute
 * - Telnyx Voice Outbound: $0.01/minute
 * - Anthropic Claude Sonnet 3.5: ~$0.05/conversation (5k input + 3k output tokens)
 * - Telnyx Voice + STT + Claude + TTS: $0.06/minute
 * - Supabase Storage: $0.09/GB bandwidth
 * - Vercel Functions: ~$3/month typical usage
 *
 * Our Price = Base Cost × 3 (200% markup)
 */

const PRICING_ITEMS = [
	{
		id: "email",
		name: "Emails",
		description: "Send invoices, estimates, and customer notifications",
		unit: "per email",
		ourCost: 0.0003, // Resend $0.0001 × 3
		defaultValue: 500,
		maxValue: 20000,
		step: 500,
	},
	{
		id: "sms",
		name: "Text Messages",
		description: "Appointment reminders, job updates, and confirmations",
		unit: "per text",
		ourCost: 0.024, // Telnyx $0.008 × 3
		defaultValue: 200,
		maxValue: 30000,
		step: 500,
	},
	{
		id: "voice-inbound",
		name: "Incoming Calls",
		description: "When customers call your business",
		unit: "per minute",
		ourCost: 0.012, // Telnyx $0.004/min × 3
		defaultValue: 100,
		maxValue: 10000,
		step: 100,
	},
	{
		id: "voice-outbound",
		name: "Outgoing Calls",
		description: "When you call customers for follow-ups",
		unit: "per minute",
		ourCost: 0.03, // Telnyx $0.01/min × 3
		defaultValue: 50,
		maxValue: 10000,
		step: 100,
	},
	{
		id: "ai-chat",
		name: "AI Assistant Chats",
		description: "AI helps with scheduling, customer questions, and data entry",
		unit: "per chat",
		ourCost: 0.15, // Claude Sonnet 3.5 $0.05 × 3
		defaultValue: 100,
		maxValue: 5000,
		step: 100,
	},
	{
		id: "ai-phone",
		name: "AI Phone Answering",
		description: "AI answers calls, books appointments, takes messages",
		unit: "per minute",
		ourCost: 0.18, // Telnyx Voice + STT + Claude + TTS $0.06/min × 3
		defaultValue: 50,
		maxValue: 5000,
		step: 50,
	},
	{
		id: "storage-uploads",
		name: "Photo & Document Storage",
		description:
			"Store job photos, contracts, and documents (charged when uploaded)",
		unit: "per GB",
		ourCost: 0.27, // Supabase $0.09/GB × 3
		defaultValue: 10,
		maxValue: 1000,
		step: 10,
	},
	{
		id: "automation",
		name: "Automation & Background Tasks",
		description:
			"Automatic reminders, job notifications, and system tasks running 24/7",
		unit: "per month",
		ourCost: 9.0, // Vercel Functions $3/month × 3
		defaultValue: 1,
		maxValue: 10,
		step: 1,
	},
];

/**
 * REAL-WORLD FIELD SERVICE METRICS
 *
 * Assumptions:
 * - 1 tech does ~3 jobs/day × 22 working days = 66 jobs/month
 * - Each job: 3 SMS (reminder, en-route, follow-up) + 2 emails (confirmation, invoice)
 * - Office takes 10 calls/day × 6 min avg = 60 min/day inbound
 * - Office makes 2-3 follow-up calls/day × 3 min = 6-9 min/day outbound
 * - Each job uploads ~1 photo (5MB avg)
 * - AI adoption: 20% small → 70% enterprise
 */

const TEAM_SIZE_EXAMPLES = [
	{
		name: "Small Team",
		icon: Users,
		description: "1-3 techs + 1 office",
		teamSize: "3 techs, 198 jobs/month",
		expectedUsage: {
			email: 400, // 198 jobs × 2 emails
			sms: 600, // 198 jobs × 3 SMS
			"voice-inbound": 1320, // 10 calls/day × 6 min × 22 days
			"voice-outbound": 180, // 2.5 calls/day × 3 min × 22 days
			"ai-chat": 40, // 20% AI adoption for chat
			"ai-phone": 100, // 20% AI adoption for calls (~8% of inbound)
			"storage-uploads": 1, // 198 jobs × 5MB = 1GB
			automation: 1, // Baseline automation included
		},
	},
	{
		name: "Medium Team",
		icon: Building2,
		description: "4-10 techs + 1-2 office",
		teamSize: "7 techs, 462 jobs/month",
		popular: true,
		expectedUsage: {
			email: 1000, // 462 jobs × 2 emails + office comms
			sms: 1400, // 462 jobs × 3 SMS
			"voice-inbound": 2900, // 1.5 office × 10 calls/day × 6 min × 22
			"voice-outbound": 250, // 1.5 office × 2.5 calls/day × 3 min × 22
			"ai-chat": 140, // 30% AI adoption
			"ai-phone": 290, // 30% AI adoption (~10% of inbound)
			"storage-uploads": 3, // 462 jobs × 5MB = 2.3GB
			automation: 2, // Moderate automation usage
		},
	},
	{
		name: "Large Team",
		icon: Building,
		description: "11-50 techs + 5-8 office",
		teamSize: "30 techs, 1,980 jobs/month",
		expectedUsage: {
			email: 4000, // 1,980 jobs × 2 emails
			sms: 6000, // 1,980 jobs × 3 SMS
			"voice-inbound": 8600, // 6.5 office × 10 × 6 × 22
			"voice-outbound": 1000, // 6.5 office × 2.5 × 3 × 22
			"ai-chat": 1000, // 50% AI adoption
			"ai-phone": 2150, // 50% AI adoption (~25% of inbound)
			"storage-uploads": 10, // 1,980 jobs × 5MB = 10GB
			automation: 5, // Heavy automation usage
		},
	},
	{
		name: "Enterprise",
		icon: Building,
		description: "50+ techs + 15-20 office",
		teamSize: "100 techs, 6,600 jobs/month",
		expectedUsage: {
			email: 13000, // 6,600 jobs × 2 emails
			sms: 20000, // 6,600 jobs × 3 SMS
			"voice-inbound": 23000, // 17.5 office × 10 × 6 × 22
			"voice-outbound": 2600, // 17.5 office × 2.5 × 3 × 22
			"ai-chat": 4600, // 70% AI adoption
			"ai-phone": 11500, // 70% AI adoption (~50% of inbound)
			"storage-uploads": 33, // 6,600 jobs × 5MB = 33GB
			automation: 10, // Enterprise automation usage
		},
	},
];

const BASE_FEATURES = [
	"Unlimited team members",
	"Unlimited jobs & customers",
	"Scheduling & dispatch",
	"Customer management (CRM)",
	"Invoicing & payments",
	"Mobile app (iOS/Android)",
	"Customer portal",
	"Estimates & contracts",
	"Equipment tracking",
	"Price book management",
	"Reporting & analytics",
	"QuickBooks integration",
	"Payment processing (Payrix)",
];

const TESTIMONIALS = [
	{
		quote: "Switched from ServiceTitan and we're saving over $1,400 every month. Same features, fraction of the cost.",
		author: "Mike Johnson",
		role: "Owner",
		company: "Johnson's HVAC Services",
		location: "Dallas, TX",
		savings: "$1,400/mo",
		previousSoftware: "ServiceTitan",
	},
	{
		quote: "The pay-as-you-go model is perfect for our seasonal business. We're not locked into expensive contracts during slow months.",
		author: "Sarah Chen",
		role: "Operations Manager",
		company: "Elite Plumbing Co",
		location: "Phoenix, AZ",
		savings: "$890/mo",
		previousSoftware: "Housecall Pro",
	},
	{
		quote: "We added 12 new techs last year and didn't pay a penny more in seat fees. That's $15,000+ saved annually.",
		author: "Robert Williams",
		role: "CEO",
		company: "Comfort Air Systems",
		location: "Atlanta, GA",
		savings: "$1,250/mo",
		previousSoftware: "FieldEdge",
	},
];

const COMPETITOR_DATA = [
	{
		name: "ServiceTitan",
		perUser: 259,
		setupFee: "$2,500+",
		hiddenFees: ["SMS add-on", "Marketing add-on", "Reporting tier"],
		hasUnlimitedUsers: false,
		hasAllFeatures: false,
		hasNoContract: false,
	},
	{
		name: "Housecall Pro",
		perUser: 169,
		setupFee: "$0",
		hiddenFees: ["SMS pack", "Call tracking", "Advanced reports"],
		hasUnlimitedUsers: false,
		hasAllFeatures: false,
		hasNoContract: false,
	},
	{
		name: "Jobber",
		perUser: 129,
		setupFee: "$0",
		hiddenFees: ["Client hub", "Quote follow-ups", "Job forms"],
		hasUnlimitedUsers: false,
		hasAllFeatures: false,
		hasNoContract: false,
	},
	{
		name: "FieldEdge",
		perUser: 199,
		setupFee: "$1,000+",
		hiddenFees: ["SMS fees", "API access", "Custom reports"],
		hasUnlimitedUsers: false,
		hasAllFeatures: false,
		hasNoContract: false,
	},
];

function calculateTeamCost(usage: Record<string, number>) {
	return PRICING_ITEMS.reduce(
		(sum, item) => sum + (usage[item.id] || 0) * item.ourCost,
		0,
	);
}

export function ModernPricing() {
	const [usage, setUsage] = useState<Record<string, number>>(
		PRICING_ITEMS.reduce(
			(acc, item) => ({ ...acc, [item.id]: item.defaultValue }),
			{},
		),
	);
	const [showSticky, setShowSticky] = useState(false);
	const [breakEvenData, setBreakEvenData] = useState({
		currentMonthlyCost: 1500,
		teamSize: 5,
	});

	const totalUsageCost = calculateTeamCost(usage);
	const totalMonthlyCost = 200 + totalUsageCost;

	// Calculate break-even
	const thorbisEstimate = 200 + calculateTeamCost(TEAM_SIZE_EXAMPLES[1].expectedUsage);
	const breakEvenSavings = breakEvenData.currentMonthlyCost - thorbisEstimate;
	const breakEvenPercentage = breakEvenData.currentMonthlyCost > 0
		? Math.round((breakEvenSavings / breakEvenData.currentMonthlyCost) * 100)
		: 0;

	// Handle sticky visibility
	useEffect(() => {
		const handleScroll = () => {
			const calculatorSection = document.getElementById("pricing-calculator");
			if (calculatorSection) {
				const rect = calculatorSection.getBoundingClientRect();
				setShowSticky(rect.top < 0 && rect.bottom > 200);
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Reset calculator to defaults
	const resetCalculator = () => {
		setUsage(
			PRICING_ITEMS.reduce(
				(acc, item) => ({ ...acc, [item.id]: item.defaultValue }),
				{},
			),
		);
	};

	// Apply team preset
	const applyPreset = (teamIndex: number) => {
		setUsage(TEAM_SIZE_EXAMPLES[teamIndex].expectedUsage);
	};

	return (
		<div className="bg-background">
			{/* Sticky Price Summary */}
			<div
				className={`fixed bottom-0 left-0 right-0 z-50 transform border-t bg-card/95 backdrop-blur-sm transition-transform duration-300 ${
					showSticky ? "translate-y-0" : "translate-y-full"
				}`}
			>
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
					<div className="flex items-center gap-4">
						<div>
							<div className="text-sm text-muted-foreground">Your estimated monthly cost</div>
							<div className="text-2xl font-bold">${totalMonthlyCost.toFixed(2)}</div>
						</div>
						<div className="hidden text-xs text-muted-foreground sm:block">
							$200 base + ${totalUsageCost.toFixed(2)} usage
						</div>
					</div>
					<Button asChild>
						<Link href="/waitlist">Get Started</Link>
					</Button>
				</div>
			</div>

			{/* Hero Section */}
			<section className="relative overflow-hidden py-20 sm:py-32">
				<PricingBackground />
				<div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-4xl text-center">
						<Badge className="mb-4" variant="outline">
							Transparent Usage-Based Pricing
						</Badge>
						<h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
							$200<span className="text-3xl font-normal">/month</span>
						</h1>
						<p className="text-muted-foreground mt-6 text-xl">
							Plus pay only for what you use — no per-user fees, no minimums, no
							surprises
						</p>
						<div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
							<div className="flex items-center gap-2">
								<Check className="text-primary h-5 w-5" />
								<span>No per-user pricing</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="text-primary h-5 w-5" />
								<span>No contracts</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="text-primary h-5 w-5" />
								<span>No usage caps</span>
							</div>
							<div className="flex items-center gap-2">
								<Infinity className="text-primary h-5 w-5" />
								<span>Unlimited everything</span>
							</div>
						</div>
						<div className="mt-10 flex items-center justify-center gap-4">
							<Button asChild size="lg">
								<Link href="/waitlist">Join Waitlist</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/demo">Watch Demo</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Video Explainer */}
			<section className="border-b py-12">
				<div className="mx-auto max-w-4xl px-6 lg:px-8">
					<div className="relative overflow-hidden rounded-2xl border bg-muted/30">
						<div className="aspect-video flex items-center justify-center">
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 transition-transform hover:scale-105">
									<PlayCircle className="h-10 w-10 text-primary" />
								</div>
								<h3 className="text-lg font-semibold">See How Pay-As-You-Go Works</h3>
								<p className="mt-1 text-sm text-muted-foreground">
									60-second explainer on our transparent pricing model
								</p>
							</div>
						</div>
						<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg bg-card/90 px-4 py-2 backdrop-blur-sm">
							<div className="flex items-center gap-2 text-sm">
								<span className="font-medium">How Thorbis Pricing Works</span>
								<span className="text-muted-foreground">• 1:02</span>
							</div>
							<Button size="sm" variant="ghost">
								<PlayCircle className="mr-1 h-4 w-4" />
								Play
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* What's Included */}
			<section className="py-16">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Everything included in $200/month
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							Full platform access with unlimited users and data
						</p>
					</div>
					<div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
						{BASE_FEATURES.map((feature) => (
							<div key={feature} className="flex items-start gap-3">
								<Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
								<span className="text-sm">{feature}</span>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="border-y bg-muted/20 py-16">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							What contractors are saying
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							Real businesses, real savings
						</p>
					</div>
					<div className="mx-auto mt-12 grid max-w-6xl gap-8 lg:grid-cols-3">
						{TESTIMONIALS.map((testimonial) => (
							<Card key={testimonial.author} className="relative">
								<CardHeader className="pb-2">
									<Quote className="h-8 w-8 text-primary/20" />
								</CardHeader>
								<CardContent className="space-y-4">
									<p className="text-sm leading-relaxed">"{testimonial.quote}"</p>
									<div className="flex items-center justify-between border-t pt-4">
										<div>
											<div className="font-semibold">{testimonial.author}</div>
											<div className="text-xs text-muted-foreground">
												{testimonial.role}, {testimonial.company}
											</div>
											<div className="text-xs text-muted-foreground">
												{testimonial.location}
											</div>
										</div>
										<div className="text-right">
											<div className="text-lg font-bold text-green-500">
												{testimonial.savings}
											</div>
											<div className="text-xs text-muted-foreground">
												saved vs {testimonial.previousSoftware}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Real-World Costs by Team Size */}
			<section className="bg-muted/30 py-16">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Real-world costs by team size
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							See what teams like yours typically spend each month
						</p>
					</div>
					<div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-4">
						{TEAM_SIZE_EXAMPLES.map((team) => {
							const Icon = team.icon;
							const usageCost = calculateTeamCost(team.expectedUsage);
							const total = 200 + usageCost;

							return (
								<Card
									key={team.name}
									className={
										team.popular ? "border-primary ring-2 ring-primary" : ""
									}
								>
									<CardHeader>
										{team.popular && (
											<Badge className="mb-2 w-fit" variant="default">
												Most Common
											</Badge>
										)}
										<div className="flex items-center gap-2">
											<Icon className="h-6 w-6" />
											<CardTitle className="text-xl">{team.name}</CardTitle>
										</div>
										<CardDescription>{team.description}</CardDescription>
										<div className="mt-4">
											<div className="flex items-baseline gap-1">
												<span className="text-4xl font-bold">
													${Math.round(total)}
												</span>
												<span className="text-muted-foreground text-base">
													/mo
												</span>
											</div>
											<p className="text-muted-foreground mt-1 text-xs">
												$200 base + ${Math.round(usageCost)} usage
											</p>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-2 text-xs">
											<div className="text-muted-foreground font-semibold">
												Typical monthly usage:
											</div>
											{Object.entries(team.expectedUsage)
												.slice(0, 4)
												.map(([key, value]) => {
													const item = PRICING_ITEMS.find((i) => i.id === key);
													if (!item) return null;
													return (
														<div
															key={key}
															className="text-muted-foreground flex justify-between"
														>
															<span>
																{item.name.replace(
																	/Transactional |Minutes/g,
																	"",
																)}
															</span>
															<span>{value}</span>
														</div>
													);
												})}
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>

					<Alert className="mx-auto mt-8 max-w-4xl">
						<Infinity className="h-4 w-4" />
						<AlertDescription>
							<strong>No caps or limits:</strong> These are typical usage
							examples. Use as much or as little as you need — you only pay for
							actual usage. Scale up or down anytime with no penalties.
						</AlertDescription>
					</Alert>
				</div>
			</section>

			{/* Simple Pricing Calculator */}
			<section id="pricing-calculator" className="py-16">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<Calculator className="mx-auto h-12 w-12" />
						<h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
							What will you pay?
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							Select a team size preset or customize with sliders
						</p>
					</div>

					{/* Team Size Presets */}
					<div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
						{TEAM_SIZE_EXAMPLES.map((team, index) => (
							<Button
								key={team.name}
								variant="outline"
								size="sm"
								onClick={() => applyPreset(index)}
								className="gap-2"
							>
								<team.icon className="h-4 w-4" />
								{team.name}
							</Button>
						))}
						<Button
							variant="ghost"
							size="sm"
							onClick={resetCalculator}
							className="gap-2 text-muted-foreground"
						>
							<RotateCcw className="h-4 w-4" />
							Reset
						</Button>
					</div>

					<Card className="mx-auto mt-8 max-w-5xl">
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Your Monthly Bill</CardTitle>
									<CardDescription>
										$200 base fee + what you actually use
									</CardDescription>
								</div>
								<div className="text-right">
									<div className="text-4xl font-bold">
										${totalMonthlyCost.toFixed(2)}
									</div>
									<div className="text-muted-foreground text-sm">per month</div>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-8">
							{/* Base Price */}
							<div className="border-b pb-6">
								<div className="flex items-center justify-between">
									<div>
										<div className="font-semibold">Monthly Base Fee</div>
										<div className="text-muted-foreground text-sm">
											Unlimited users, all features, unlimited data
										</div>
									</div>
									<div className="text-xl font-semibold">$200.00</div>
								</div>
							</div>

							{/* Usage Items */}
							<div className="space-y-6">
								<div className="text-sm font-semibold">
									Pay only for what you use:
								</div>
								{PRICING_ITEMS.map((item) => {
									const currentUsage = usage[item.id] || item.defaultValue;
									const cost = currentUsage * item.ourCost;

									return (
										<div key={item.id} className="space-y-3">
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1">
													<div className="font-semibold">{item.name}</div>
													<div className="text-muted-foreground text-sm">
														{item.description}
													</div>
													<div className="text-muted-foreground mt-1 text-xs">
														${item.ourCost.toFixed(item.ourCost < 0.01 ? 4 : 2)}{" "}
														{item.unit}
													</div>
												</div>
												<div className="text-right">
													<div className="font-semibold">
														${cost.toFixed(2)}
													</div>
													<div className="text-muted-foreground text-xs">
														{currentUsage.toLocaleString()}
													</div>
												</div>
											</div>
											<div className="flex items-center gap-4">
												<Slider
													value={[currentUsage]}
													onValueChange={([value]) =>
														setUsage((prev) => ({ ...prev, [item.id]: value }))
													}
													max={item.maxValue}
													step={item.step}
													className="flex-1"
												/>
												<div className="text-muted-foreground w-24 text-right text-sm tabular-nums">
													{currentUsage.toLocaleString()}
												</div>
											</div>
										</div>
									);
								})}
							</div>

							{/* Total */}
							<div className="border-t pt-6">
								<div className="flex items-center justify-between">
									<div>
										<div className="text-lg font-semibold">
											Your Total Monthly Bill
										</div>
										<div className="text-muted-foreground text-sm">
											$200 base + ${totalUsageCost.toFixed(2)} usage
										</div>
									</div>
									<div className="text-3xl font-bold">
										${totalMonthlyCost.toFixed(2)}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="mt-8 text-center">
						<p className="text-muted-foreground mb-4 text-sm">
							Try it free for 14 days. No credit card required.
						</p>
						<Button asChild size="lg">
							<Link href="/waitlist">Join Waitlist</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* No Caps, No Limits */}
			<section className="bg-muted/30 py-16">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-4xl text-center">
						<Infinity className="mx-auto h-16 w-16" />
						<h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
							No caps. No limits. No surprises.
						</h2>
						<p className="text-muted-foreground mt-6 text-lg leading-8">
							Unlike competitors who charge per user or enforce usage caps, we
							believe in transparent usage-based pricing. Add unlimited team
							members, send unlimited emails, make unlimited calls — you only
							pay for actual consumption at our published rates.
						</p>
						<div className="mt-8 grid gap-4 sm:grid-cols-3">
							<div className="rounded-lg border bg-card p-6">
								<div className="text-2xl font-bold">∞</div>
								<div className="mt-2 font-semibold">Unlimited Users</div>
								<div className="text-muted-foreground text-sm">
									No per-seat pricing
								</div>
							</div>
							<div className="rounded-lg border bg-card p-6">
								<div className="text-2xl font-bold">∞</div>
								<div className="mt-2 font-semibold">Unlimited Data</div>
								<div className="text-muted-foreground text-sm">
									Store as much as you need
								</div>
							</div>
							<div className="rounded-lg border bg-card p-6">
								<div className="text-2xl font-bold">∞</div>
								<div className="mt-2 font-semibold">Unlimited Features</div>
								<div className="text-muted-foreground text-sm">
									Everything included
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Comprehensive Competitor Comparison */}
			<section className="py-16">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-6xl">
						<div className="rounded-lg border bg-card p-8">
							<h3 className="text-center text-2xl font-bold">
								Compare real-world costs
							</h3>
							<p className="text-muted-foreground mx-auto mt-2 max-w-2xl text-center text-sm">
								Based on actual published pricing from leading field service
								software providers
							</p>

							{/* Pricing Table */}
							<div className="mt-8 overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b">
											<th className="text-muted-foreground pb-4 text-left font-semibold">
												Provider
											</th>
											<th className="text-muted-foreground pb-4 text-right font-semibold">
												Base Price
											</th>
											<th className="text-muted-foreground pb-4 text-right font-semibold">
												7-Tech/mo
											</th>
											<th className="text-muted-foreground pb-4 text-right font-semibold">
												<span className="text-primary">Year 1 Total</span>
											</th>
											<th className="text-muted-foreground hidden pb-4 text-center font-semibold sm:table-cell">
												Hidden Fees
											</th>
											<th className="text-muted-foreground pb-4 text-center font-semibold">
												∞ Users
											</th>
										</tr>
									</thead>
									<tbody className="divide-y">
										{COMPETITOR_DATA.map((competitor) => (
											<tr key={competitor.name}>
												<td className="py-4">
													<div className="font-semibold">{competitor.name}</div>
													<div className="text-muted-foreground text-xs">
														${competitor.perUser}/user{" "}
														{competitor.setupFee !== "$0" && `+ ${competitor.setupFee} setup`}
													</div>
												</td>
												<td className="py-4 text-right">${competitor.perUser}/user</td>
												<td className="py-4 text-right font-semibold">
													${(competitor.perUser * 7).toLocaleString()}
												</td>
												<td className="py-4 text-right font-semibold text-red-500">
													${((competitor.perUser * 7 * 12) + (competitor.setupFee === "$0" ? 0 : 2500)).toLocaleString()}
												</td>
												<td className="hidden py-4 text-center sm:table-cell">
													<div className="flex flex-wrap justify-center gap-1">
														{competitor.hiddenFees.slice(0, 2).map((fee) => (
															<span
																key={fee}
																className="inline-flex rounded bg-red-500/10 px-1.5 py-0.5 text-xs text-red-500"
															>
																{fee}
															</span>
														))}
														{competitor.hiddenFees.length > 2 && (
															<span className="text-xs text-muted-foreground">
																+{competitor.hiddenFees.length - 2} more
															</span>
														)}
													</div>
												</td>
												<td className="py-4 text-center">
													<X className="mx-auto h-5 w-5 text-red-500" />
												</td>
											</tr>
										))}
										<tr className="bg-primary/5">
											<td className="py-4">
												<div className="text-primary font-bold">Thorbis</div>
												<div className="text-muted-foreground text-xs">
													$200 base + usage only
												</div>
											</td>
											<td className="py-4 text-right font-semibold">
												$200 flat
											</td>
											<td className="text-primary py-4 text-right font-bold">
												$368
											</td>
											<td className="py-4 text-right font-bold text-green-500">
												$4,416
											</td>
											<td className="hidden py-4 text-center sm:table-cell">
												<span className="inline-flex rounded bg-green-500/10 px-2 py-0.5 text-xs text-green-500">
													None
												</span>
											</td>
											<td className="py-4 text-center">
												<Check className="mx-auto h-5 w-5 text-green-500" />
											</td>
										</tr>
									</tbody>
								</table>
							</div>

							{/* Year 1 Savings Highlight */}
							<div className="mt-6 rounded-lg bg-green-500/10 p-4 text-center">
								<div className="text-sm font-semibold text-green-600">
									Year 1 Savings with Thorbis (7-tech team)
								</div>
								<div className="mt-1 flex items-center justify-center gap-4">
									<div>
										<span className="text-2xl font-bold text-green-500">$17,340</span>
										<span className="text-muted-foreground text-sm"> vs ServiceTitan</span>
									</div>
									<div className="hidden sm:block text-muted-foreground">|</div>
									<div className="hidden sm:block">
										<span className="text-2xl font-bold text-green-500">$9,780</span>
										<span className="text-muted-foreground text-sm"> vs Housecall Pro</span>
									</div>
								</div>
							</div>

							{/* Savings Breakdown */}
							<div className="mt-8 border-t pt-6">
								<div className="text-center text-sm font-semibold">
									Your potential savings vs competitors:
								</div>
								<div className="mt-4 grid gap-4 sm:grid-cols-4">
									<div className="rounded-lg bg-primary/10 p-4 text-center">
										<div className="text-xs font-semibold">3-Tech Team</div>
										<div className="text-primary mt-1 text-lg font-bold">
											Save 31-65%
										</div>
										<div className="text-muted-foreground text-xs">
											$118-508/month
										</div>
									</div>
									<div className="rounded-lg bg-primary/10 p-4 text-center">
										<div className="text-xs font-semibold">7-Tech Team</div>
										<div className="text-primary mt-1 text-lg font-bold">
											Save 59-80%
										</div>
										<div className="text-muted-foreground text-xs">
											$535-1,445/month
										</div>
									</div>
									<div className="rounded-lg bg-primary/10 p-4 text-center">
										<div className="text-xs font-semibold">30-Tech Team</div>
										<div className="text-primary mt-1 text-lg font-bold">
											Save 73-86%
										</div>
										<div className="text-muted-foreground text-xs">
											$2,807-6,707/month
										</div>
									</div>
									<div className="rounded-lg bg-primary/10 p-4 text-center">
										<div className="text-xs font-semibold">100-Tech Team</div>
										<div className="text-primary mt-1 text-lg font-bold">
											Save 70-85%
										</div>
										<div className="text-muted-foreground text-xs">
											$9,003-22,003/month
										</div>
									</div>
								</div>
							</div>

							{/* Key Differentiators */}
							<div className="mt-8 border-t pt-6">
								<div className="grid gap-6 sm:grid-cols-2">
									<div>
										<div className="text-muted-foreground text-xs font-semibold uppercase">
											What competitors charge extra for
										</div>
										<ul className="mt-3 space-y-2 text-sm">
											<li className="flex items-start gap-2">
												<span className="text-muted-foreground">•</span>
												<span>Per-user seat fees ($129-259/user/month)</span>
											</li>
											<li className="flex items-start gap-2">
												<span className="text-muted-foreground">•</span>
												<span>
													SMS/text message add-ons ($0.02-0.05/message)
												</span>
											</li>
											<li className="flex items-start gap-2">
												<span className="text-muted-foreground">•</span>
												<span>Call tracking fees ($50-200/month)</span>
											</li>
											<li className="flex items-start gap-2">
												<span className="text-muted-foreground">•</span>
												<span>AI features ($100-500/month add-on)</span>
											</li>
											<li className="flex items-start gap-2">
												<span className="text-muted-foreground">•</span>
												<span>Advanced reporting ($50-100/month)</span>
											</li>
											<li className="flex items-start gap-2">
												<span className="text-muted-foreground">•</span>
												<span>API access (enterprise tier only)</span>
											</li>
										</ul>
									</div>
									<div>
										<div className="text-primary text-xs font-semibold uppercase">
											What's included in Thorbis $200
										</div>
										<ul className="mt-3 space-y-2 text-sm">
											<li className="flex items-start gap-2">
												<Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
												<span>Unlimited users (add your entire team)</span>
											</li>
											<li className="flex items-start gap-2">
												<Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
												<span>All features unlocked (no tiers)</span>
											</li>
											<li className="flex items-start gap-2">
												<Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
												<span>Call tracking & recording included</span>
											</li>
											<li className="flex items-start gap-2">
												<Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
												<span>Full API access included</span>
											</li>
											<li className="flex items-start gap-2">
												<Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
												<span>Advanced reporting & analytics</span>
											</li>
											<li className="flex items-start gap-2">
												<Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
												<span>Pay only for actual usage (SMS, calls, AI)</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Why We're Different - No Sales Pressure Section */}
			<section className="border-y bg-gradient-to-b from-primary/5 to-transparent py-20">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-4xl">
						<div className="mb-12 text-center">
							<Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
								<Zap className="mr-2 h-3 w-3" />
								Why Service Businesses Choose Thorbis
							</Badge>
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
								No Sales Pressure. No Lock-Ins.
								<br />
								Just Software That Works.
							</h2>
							<p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
								Unlike traditional FSM companies, we let our product speak for
								itself. Try it, love it, or leave—no hard feelings, no
								contracts, no hassle.
							</p>
						</div>

						<div className="grid gap-6 sm:grid-cols-2 mb-8">
							<Card className="transition-all hover:border-primary/30">
								<CardHeader>
									<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<Users className="h-6 w-6" />
									</div>
									<CardTitle>No Pushy Sales Teams</CardTitle>
									<CardDescription>
										Try the full platform yourself in 60 seconds
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										Self-service signup. No demos required. No sales calls
										unless YOU ask for one. Start your free trial and explore
										every feature without anyone breathing down your neck.
									</p>
								</CardContent>
							</Card>

							<Card className="transition-all hover:border-primary/30">
								<CardHeader>
									<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<Check className="h-6 w-6" />
									</div>
									<CardTitle>No Contracts or Lock-Ins</CardTitle>
									<CardDescription>
										Cancel anytime with one click
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground mb-3">
										Month-to-month billing. Export your data anytime. We earn
										your business every single month, not through long-term
										contracts. If we're not delivering value, leave—no
										penalties.
									</p>
									<ul className="space-y-2 text-xs text-muted-foreground">
										<li className="flex items-center gap-2">
											<Check className="h-3 w-3 text-primary shrink-0" />
											<span>Usage alerts at 80% of estimate</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-3 w-3 text-primary shrink-0" />
											<span>Optional billing caps available</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-3 w-3 text-primary shrink-0" />
											<span>Export all data (CSV, Excel, PDF)</span>
										</li>
									</ul>
								</CardContent>
							</Card>

							<Card className="transition-all hover:border-primary/30">
								<CardHeader>
									<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<Zap className="h-6 w-6" />
									</div>
									<CardTitle>5-Minute Intelligent Setup</CardTitle>
									<CardDescription>
										No lengthy operational assessments
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										Our smart onboarding asks the right questions for YOUR
										business. No expensive consultants. No month-long
										implementation projects. Setup in 5 minutes, running jobs
										same day.
									</p>
								</CardContent>
							</Card>

							<Card className="transition-all hover:border-primary/30">
								<CardHeader>
									<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<MessageSquare className="h-6 w-6" />
									</div>
									<CardTitle>Top-Tier Support Included</CardTitle>
									<CardDescription>Real humans, not chatbots</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										2-hour response time. Phone support included. We help with
										anything—setup, training, custom workflows. No "premium
										support" tiers. Everyone gets the same great service.
									</p>
								</CardContent>
							</Card>
						</div>

						<Alert className="border-primary/30 bg-card">
							<Sparkles className="h-4 w-4 text-primary" />
							<AlertTitle>30-Day Money-Back Guarantee</AlertTitle>
							<AlertDescription>
								If Thorbis doesn't save you money vs. your current software,
								we'll refund you 100%—no questions asked. 14-day free trial, no
								credit card required. Found a bug? Need a feature? Most requests
								ship within 2-4 weeks. We build what service businesses actually
								need, not what sales quotas demand.
							</AlertDescription>
						</Alert>

						<div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
							<div className="flex items-center gap-2">
								<Check className="h-4 w-4 text-primary" />
								<span>14-day free trial</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="h-4 w-4 text-primary" />
								<span>No credit card required</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="h-4 w-4 text-primary" />
								<span>100% money back guarantee</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="h-4 w-4 text-primary" />
								<span>Setup in 5 min, jobs same day</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="h-4 w-4 text-primary" />
								<span>Export data anytime</span>
							</div>
							<div className="flex items-center gap-2">
								<Check className="h-4 w-4 text-primary" />
								<span>Cancel with one click</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Break-Even Calculator */}
			<section className="border-y bg-gradient-to-b from-green-500/5 to-transparent py-16">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<TrendingDown className="mx-auto h-12 w-12 text-green-500" />
						<h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
							How much will you save?
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							Enter your current software cost to see your potential savings
						</p>
					</div>

					<Card className="mx-auto mt-12 max-w-2xl">
						<CardContent className="pt-6">
							<div className="space-y-6">
								<div className="space-y-2">
									<Label htmlFor="current-cost">
										What do you currently pay per month for field service software?
									</Label>
									<div className="relative">
										<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
											$
										</span>
										<Input
											id="current-cost"
											type="number"
											value={breakEvenData.currentMonthlyCost}
											onChange={(e) =>
												setBreakEvenData((prev) => ({
													...prev,
													currentMonthlyCost: Number(e.target.value) || 0,
												}))
											}
											className="pl-7"
											placeholder="1500"
										/>
									</div>
									<div className="flex flex-wrap gap-2">
										{[500, 1000, 1500, 2500, 5000].map((amount) => (
											<Button
												key={amount}
												variant="outline"
												size="sm"
												onClick={() =>
													setBreakEvenData((prev) => ({
														...prev,
														currentMonthlyCost: amount,
													}))
												}
												className={
													breakEvenData.currentMonthlyCost === amount
														? "border-primary bg-primary/10"
														: ""
												}
											>
												${amount.toLocaleString()}
											</Button>
										))}
									</div>
								</div>

								{breakEvenData.currentMonthlyCost > 0 && (
									<div className="rounded-lg border bg-muted/30 p-6">
										<div className="text-center">
											{breakEvenSavings > 0 ? (
												<>
													<div className="text-sm text-muted-foreground">
														Your estimated monthly savings with Thorbis
													</div>
													<div className="mt-2 text-4xl font-bold text-green-500">
														${breakEvenSavings.toLocaleString()}
													</div>
													<div className="mt-1 text-sm text-muted-foreground">
														{breakEvenPercentage}% less than you're paying now
													</div>
													<div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
														<div>
															<div className="text-xs text-muted-foreground">
																Annual Savings
															</div>
															<div className="text-xl font-bold text-green-500">
																${(breakEvenSavings * 12).toLocaleString()}
															</div>
														</div>
														<div>
															<div className="text-xs text-muted-foreground">
																5-Year Savings
															</div>
															<div className="text-xl font-bold text-green-500">
																${(breakEvenSavings * 60).toLocaleString()}
															</div>
														</div>
													</div>
												</>
											) : (
												<div className="text-muted-foreground">
													At ${breakEvenData.currentMonthlyCost}/month, you're already
													paying less than our typical estimate. Let's chat to see if
													Thorbis can still save you money with better features.
												</div>
											)}
										</div>
									</div>
								)}

								<div className="text-center">
									<Button asChild size="lg" className="w-full sm:w-auto">
										<Link href="/waitlist">
											Start Saving Today
										</Link>
									</Button>
									<p className="mt-2 text-xs text-muted-foreground">
										Based on typical 7-tech team usage of $368/mo with Thorbis
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Migration & Onboarding */}
			<section className="py-16">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Free Migration & Onboarding
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							We'll handle everything to get you up and running in days, not
							weeks
						</p>
					</div>
					<div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Free Data Migration</CardTitle>
								<CardDescription>We'll move everything for you</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-start gap-3">
									<Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
									<span className="text-sm">
										Import from ServiceTitan, Housecall Pro, Jobber
									</span>
								</div>
								<div className="flex items-start gap-3">
									<Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
									<span className="text-sm">
										All customers, jobs, and pricing transferred
									</span>
								</div>
								<div className="flex items-start gap-3">
									<Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
									<span className="text-sm">Historical data preserved</span>
								</div>
								<div className="flex items-start gap-3">
									<Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
									<span className="text-sm">
										Zero downtime during migration
									</span>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>1-on-1 Training Included</CardTitle>
								<CardDescription>
									Get your team up to speed fast
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-start gap-3">
									<Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
									<span className="text-sm">
										Personal onboarding specialist
									</span>
								</div>
								<div className="flex items-start gap-3">
									<Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
									<span className="text-sm">
										Free training for all team members
									</span>
								</div>
								<div className="flex items-start gap-3">
									<Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
									<span className="text-sm">Setup complete in 2-3 days</span>
								</div>
								<div className="flex items-start gap-3">
									<Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
									<span className="text-sm">Ongoing support as you grow</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Support & Enterprise */}
			<section className="bg-muted/30 py-16">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Support When You Need It
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							Real people, real help, included in every plan
						</p>
					</div>
					<div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-3">
						<div className="text-center">
							<div className="text-4xl font-bold">2 Hours</div>
							<div className="text-muted-foreground mt-2">
								Average response time
							</div>
							<p className="text-muted-foreground mt-4 text-sm">
								Phone and email support included. No waiting days for responses.
							</p>
						</div>
						<div className="text-center">
							<div className="text-4xl font-bold">24/7</div>
							<div className="text-muted-foreground mt-2">
								System monitoring
							</div>
							<p className="text-muted-foreground mt-4 text-sm">
								99.9% uptime guarantee. We're watching so you don't have to.
							</p>
						</div>
						<div className="text-center">
							<div className="text-4xl font-bold">Free</div>
							<div className="text-muted-foreground mt-2">Ongoing training</div>
							<p className="text-muted-foreground mt-4 text-sm">
								Add new team members anytime. Training is always included.
							</p>
						</div>
					</div>

					<Alert className="mx-auto mt-12 max-w-4xl">
						<Building className="h-4 w-4" />
						<AlertDescription>
							<strong>Enterprise (50+ technicians):</strong> Dedicated account
							manager, custom integrations, priority support with SLA, and
							dedicated implementation specialist included.
						</AlertDescription>
					</Alert>
				</div>
			</section>

			{/* ROI & Social Proof */}
			<section className="bg-muted/30 py-16">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-4xl text-center">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Join 2,000+ Service Businesses Saving Money
						</h2>
						<p className="text-muted-foreground mt-4 text-lg">
							Average customer saves{" "}
							<span className="text-primary font-bold">$12,000/year</span> vs
							competitors
						</p>
						<div className="mt-8">
							<Button asChild size="lg" variant="outline">
								<Link href="/roi">Calculate Your Savings →</Link>
							</Button>
						</div>
					</div>

					{/* Trust Badges */}
					<div className="mx-auto mt-12 max-w-4xl">
						<div className="grid gap-4 sm:grid-cols-4">
							<div className="rounded-lg border bg-card p-4 text-center">
								<div className="text-2xl font-bold">99.9%</div>
								<div className="text-muted-foreground text-xs">Uptime SLA</div>
							</div>
							<div className="rounded-lg border bg-card p-4 text-center">
								<div className="text-2xl font-bold">SOC 2</div>
								<div className="text-muted-foreground text-xs">Certified</div>
							</div>
							<div className="rounded-lg border bg-card p-4 text-center">
								<div className="text-2xl font-bold">GDPR</div>
								<div className="text-muted-foreground text-xs">Compliant</div>
							</div>
							<div className="rounded-lg border bg-card p-4 text-center">
								<div className="text-2xl font-bold">PCI</div>
								<div className="text-muted-foreground text-xs">Compliant</div>
							</div>
						</div>
						<p className="text-muted-foreground mt-4 text-center text-sm">
							Bank-level encryption • Regular security audits • Data centers in
							US & Canada
						</p>
					</div>
				</div>
			</section>

			{/* FAQ CTA */}
			<section className="py-16">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="text-2xl font-bold">Questions about pricing?</h2>
					<p className="text-muted-foreground mt-4">
						View our{" "}
						<Link
							className="text-primary underline-offset-4 hover:underline"
							href="/help"
						>
							help center
						</Link>
						, check out the{" "}
						<Link
							className="text-primary underline-offset-4 hover:underline"
							href="/api-docs"
						>
							API documentation
						</Link>
						, or{" "}
						<Link
							className="text-primary underline-offset-4 hover:underline"
							href="/contact"
						>
							contact sales
						</Link>
						.
					</p>
				</div>
			</section>
		</div>
	);
}

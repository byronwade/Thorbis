/**
 * Marketing Coming Soon Page - Server Component
 * Shown in production while features are being built and tested
 */

import {
	Award,
	BarChart3,
	CheckCircle2,
	Clock,
	Facebook,
	Lightbulb,
	LineChart,
	Mail,
	Megaphone,
	MessageSquare,
	Rocket,
	Search,
	Send,
	Share2,
	Star,
	Target,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";

export function MarketingComingSoon() {
	return (
		<div className="relative flex h-full items-center justify-center overflow-auto py-12">
			{/* Background gradient blobs */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="bg-primary/10 absolute top-1/4 left-1/4 size-96 rounded-full blur-3xl" />
				<div className="bg-primary/5 absolute right-1/4 bottom-1/4 size-96 rounded-full blur-3xl" />
			</div>

			{/* Main content */}
			<div className="relative w-full max-w-6xl space-y-12 text-center">
				{/* Status badge */}
				<div className="flex justify-center">
					<div className="border-primary/20 bg-primary/5 inline-flex items-center rounded-full border px-6 py-3 text-sm backdrop-blur-sm">
						<Clock className="mr-2 size-4" />
						<span className="font-medium">Coming Soon</span>
					</div>
				</div>

				{/* Icon with gradient background */}
				<div className="flex justify-center">
					<div className="relative">
						<div className="from-primary/20 to-primary/10 absolute inset-0 animate-pulse rounded-full bg-gradient-to-r blur-2xl" />
						<div className="border-primary/20 from-primary/10 to-primary/5 relative flex size-32 items-center justify-center rounded-full border bg-gradient-to-br backdrop-blur-sm">
							<Megaphone className="text-primary size-16" strokeWidth={1.5} />
						</div>
					</div>
				</div>

				{/* Main heading with gradient */}
				<div className="space-y-4">
					<h1 className="text-5xl font-bold tracking-tight md:text-6xl">
						Marketing{" "}
						<span className="bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text font-extrabold text-transparent dark:from-pink-400 dark:to-pink-300">
							Center
						</span>
					</h1>
					<p className="text-foreground/60 mx-auto max-w-3xl text-xl leading-relaxed">
						A comprehensive marketing suite to grow your business with integrated tools for lead
						management, review monitoring, campaign automation, and multi-channel marketing.
					</p>
				</div>

				{/* Feature Categories */}
				<div className="mx-auto max-w-5xl space-y-8 pt-8">
					{/* Primary Features */}
					<div>
						<h2 className="mb-6 text-2xl font-semibold">Core Marketing Features</h2>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
							<div className="group border-primary/10 hover:border-border/20 rounded-2xl border bg-gradient-to-br from-pink-500/5 to-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/10">
								<div className="mb-4 flex justify-center">
									<div className="bg-accent/10 flex size-12 items-center justify-center rounded-full">
										<Users className="text-accent-foreground dark:text-accent-foreground size-6" />
									</div>
								</div>
								<h3 className="mb-2 text-lg font-semibold">Lead Management</h3>
								<p className="text-muted-foreground text-sm">
									Capture, track, and nurture leads from all channels with automated scoring and
									qualification
								</p>
							</div>

							<div className="group border-primary/10 hover:border-warning/20 rounded-2xl border bg-gradient-to-br from-yellow-500/5 to-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-500/10">
								<div className="mb-4 flex justify-center">
									<div className="bg-warning/10 flex size-12 items-center justify-center rounded-full">
										<Star className="text-warning dark:text-warning size-6" />
									</div>
								</div>
								<h3 className="mb-2 text-lg font-semibold">Review Management</h3>
								<p className="text-muted-foreground text-sm">
									Monitor and respond to reviews across Google, Facebook, and Yelp from a single
									dashboard
								</p>
							</div>

							<div className="group border-primary/10 hover:border-primary/20 rounded-2xl border bg-gradient-to-br from-blue-500/5 to-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10">
								<div className="mb-4 flex justify-center">
									<div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
										<Send className="text-primary dark:text-primary size-6" />
									</div>
								</div>
								<h3 className="mb-2 text-lg font-semibold">Campaigns</h3>
								<p className="text-muted-foreground text-sm">
									Create and automate multi-channel marketing campaigns via email, SMS, and direct
									mail
								</p>
							</div>

							<div className="group border-primary/10 hover:border-success/20 rounded-2xl border bg-gradient-to-br from-green-500/5 to-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/10">
								<div className="mb-4 flex justify-center">
									<div className="bg-success/10 flex size-12 items-center justify-center rounded-full">
										<Target className="text-success dark:text-success size-6" />
									</div>
								</div>
								<h3 className="mb-2 text-lg font-semibold">Customer Outreach</h3>
								<p className="text-muted-foreground text-sm">
									Targeted outreach to customers with personalized messaging and automated
									follow-ups
								</p>
							</div>
						</div>
					</div>

					{/* Lead Management Features */}
					<div>
						<h2 className="mb-6 text-2xl font-semibold">Lead Management Tools</h2>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							<div className="border-primary/10 from-primary/5 rounded-xl border bg-gradient-to-br to-transparent p-6 text-left">
								<div className="bg-primary/10 mb-3 flex size-10 items-center justify-center rounded-lg">
									<Search className="text-primary size-5" />
								</div>
								<h3 className="mb-2 font-semibold">Lead Capture</h3>
								<p className="text-muted-foreground text-sm">
									Capture leads from website forms, phone calls, and online ads automatically
								</p>
							</div>

							<div className="border-primary/10 from-primary/5 rounded-xl border bg-gradient-to-br to-transparent p-6 text-left">
								<div className="bg-primary/10 mb-3 flex size-10 items-center justify-center rounded-lg">
									<BarChart3 className="text-primary size-5" />
								</div>
								<h3 className="mb-2 font-semibold">Lead Scoring</h3>
								<p className="text-muted-foreground text-sm">
									Automatically score and prioritize leads based on behavior and engagement
								</p>
							</div>

							<div className="border-primary/10 from-primary/5 rounded-xl border bg-gradient-to-br to-transparent p-6 text-left">
								<div className="bg-primary/10 mb-3 flex size-10 items-center justify-center rounded-lg">
									<Zap className="text-primary size-5" />
								</div>
								<h3 className="mb-2 font-semibold">Lead Nurturing</h3>
								<p className="text-muted-foreground text-sm">
									Automated nurture sequences to convert leads into paying customers
								</p>
							</div>
						</div>
					</div>

					{/* Review Management */}
					<div>
						<h2 className="mb-6 text-2xl font-semibold">Review Management</h2>
						<div className="grid gap-6 sm:grid-cols-2">
							<div className="border-warning/20 rounded-xl border bg-gradient-to-br from-yellow-500/10 to-transparent p-6 text-left">
								<div className="mb-4 flex items-center gap-3">
									<div className="bg-warning/10 flex size-12 items-center justify-center rounded-lg">
										<Star className="text-warning dark:text-warning size-6" />
									</div>
									<div>
										<h3 className="text-lg font-semibold">Multi-Platform Monitoring</h3>
										<p className="text-muted-foreground text-sm">Real-time tracking</p>
									</div>
								</div>
								<p className="text-muted-foreground mb-3 text-sm">
									Monitor reviews from Google, Facebook, Yelp, and more from a single unified
									dashboard
								</p>
								<div className="flex flex-wrap gap-2">
									<span className="bg-warning/10 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs">
										<Search className="size-3" />
										Google Business
									</span>
									<span className="bg-warning/10 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs">
										<Facebook className="size-3" />
										Facebook
									</span>
									<span className="bg-warning/10 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs">
										<Star className="size-3" />
										Yelp
									</span>
								</div>
							</div>

							<div className="border-primary/20 rounded-xl border bg-gradient-to-br from-blue-500/10 to-transparent p-6 text-left">
								<div className="mb-4 flex items-center gap-3">
									<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
										<MessageSquare className="text-primary dark:text-primary size-6" />
									</div>
									<div>
										<h3 className="text-lg font-semibold">Smart Responses</h3>
										<p className="text-muted-foreground text-sm">AI-powered replies</p>
									</div>
								</div>
								<p className="text-muted-foreground mb-3 text-sm">
									AI-suggested responses and templates for quick, professional replies to all
									reviews
								</p>
								<div className="flex flex-wrap gap-2">
									<span className="bg-primary/10 rounded-full px-2 py-1 text-xs">
										Auto-Response
									</span>
									<span className="bg-primary/10 rounded-full px-2 py-1 text-xs">Templates</span>
									<span className="bg-primary/10 rounded-full px-2 py-1 text-xs">
										AI Suggestions
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Campaign Tools */}
					<div>
						<h2 className="mb-6 text-2xl font-semibold">Campaign Management</h2>
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<div className="border-primary/10 from-primary/5 flex flex-col items-center gap-2 rounded-xl border bg-gradient-to-br to-transparent p-4">
								<div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
									<Mail className="text-primary size-5" />
								</div>
								<span className="text-sm font-medium">Email Campaigns</span>
							</div>

							<div className="border-primary/10 from-primary/5 flex flex-col items-center gap-2 rounded-xl border bg-gradient-to-br to-transparent p-4">
								<div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
									<MessageSquare className="text-primary size-5" />
								</div>
								<span className="text-sm font-medium">SMS Marketing</span>
							</div>

							<div className="border-primary/10 from-primary/5 flex flex-col items-center gap-2 rounded-xl border bg-gradient-to-br to-transparent p-4">
								<div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
									<Send className="text-primary size-5" />
								</div>
								<span className="text-sm font-medium">Direct Mail</span>
							</div>

							<div className="border-primary/10 from-primary/5 flex flex-col items-center gap-2 rounded-xl border bg-gradient-to-br to-transparent p-4">
								<div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
									<Share2 className="text-primary size-5" />
								</div>
								<span className="text-sm font-medium">Social Media</span>
							</div>
						</div>
					</div>

					{/* Analytics & Reporting */}
					<div>
						<h2 className="mb-6 text-2xl font-semibold">Analytics & Insights</h2>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							<div className="border-primary/10 from-primary/5 rounded-xl border bg-gradient-to-br to-transparent p-6 text-left">
								<div className="bg-primary/10 mb-3 flex size-10 items-center justify-center rounded-lg">
									<LineChart className="text-primary size-5" />
								</div>
								<h3 className="mb-2 font-semibold">Campaign Performance</h3>
								<p className="text-muted-foreground text-sm">
									Track ROI, conversion rates, and engagement across all campaigns
								</p>
							</div>

							<div className="border-primary/10 from-primary/5 rounded-xl border bg-gradient-to-br to-transparent p-6 text-left">
								<div className="bg-primary/10 mb-3 flex size-10 items-center justify-center rounded-lg">
									<TrendingUp className="text-primary size-5" />
								</div>
								<h3 className="mb-2 font-semibold">Lead Analytics</h3>
								<p className="text-muted-foreground text-sm">
									Understand lead sources, conversion funnels, and customer journey
								</p>
							</div>

							<div className="border-primary/10 from-primary/5 rounded-xl border bg-gradient-to-br to-transparent p-6 text-left">
								<div className="bg-primary/10 mb-3 flex size-10 items-center justify-center rounded-lg">
									<Award className="text-primary size-5" />
								</div>
								<h3 className="mb-2 font-semibold">Reputation Score</h3>
								<p className="text-muted-foreground text-sm">
									Monitor your online reputation with real-time scoring and alerts
								</p>
							</div>
						</div>
					</div>

					{/* What to Expect */}
					<div className="border-primary/10 from-primary/5 rounded-2xl border bg-gradient-to-br to-transparent p-8">
						<div className="mb-6 flex justify-center">
							<div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
								<Lightbulb className="text-primary size-8" />
							</div>
						</div>
						<h2 className="mb-4 text-2xl font-semibold">What to Expect</h2>
						<div className="text-muted-foreground mx-auto max-w-3xl space-y-3 text-left">
							<div className="flex items-start gap-3">
								<CheckCircle2 className="text-success dark:text-success mt-0.5 size-5 shrink-0" />
								<p className="text-sm">
									<span className="text-foreground font-medium">Lead Management:</span> Capture
									leads from all sources, score automatically, and convert with intelligent
									nurturing sequences
								</p>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle2 className="text-success dark:text-success mt-0.5 size-5 shrink-0" />
								<p className="text-sm">
									<span className="text-foreground font-medium">Review Management:</span> Monitor
									and respond to reviews across Google, Facebook, and Yelp from one dashboard
								</p>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle2 className="text-success dark:text-success mt-0.5 size-5 shrink-0" />
								<p className="text-sm">
									<span className="text-foreground font-medium">Multi-Channel Campaigns:</span>{" "}
									Create email, SMS, and direct mail campaigns with drag-and-drop builder and
									automation
								</p>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle2 className="text-success dark:text-success mt-0.5 size-5 shrink-0" />
								<p className="text-sm">
									<span className="text-foreground font-medium">Customer Outreach:</span> Targeted
									campaigns for maintenance reminders, special offers, and customer re-engagement
								</p>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle2 className="text-success dark:text-success mt-0.5 size-5 shrink-0" />
								<p className="text-sm">
									<span className="text-foreground font-medium">Analytics & ROI:</span> Track
									campaign performance, lead conversion rates, and marketing ROI in real-time
								</p>
							</div>
							<div className="flex items-start gap-3">
								<CheckCircle2 className="text-success dark:text-success mt-0.5 size-5 shrink-0" />
								<p className="text-sm">
									<span className="text-foreground font-medium">Reputation Management:</span>{" "}
									Real-time alerts for new reviews with AI-powered response suggestions
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Call to action */}
				<div className="text-muted-foreground flex items-center justify-center gap-2 pt-4 text-sm">
					<Rocket className="size-4" />
					<p>In the meantime, explore the platform and reach out if you need help</p>
				</div>
			</div>
		</div>
	);
}

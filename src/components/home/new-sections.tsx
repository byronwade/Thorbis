"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	TrendingUp,
	Users,
	DollarSign,
	Clock,
	Star,
	ArrowRight,
	CheckCircle2,
	Wrench,
	Zap,
	Droplets,
	Wind,
	Home,
	Sparkles,
	BarChart3,
	Calendar,
	CreditCard,
} from "lucide-react";

export function CustomerSuccessSection() {
	const [activeStory, setActiveStory] = useState(0);

	const stories = [
		{
			company: "ABC Plumbing",
			industry: "Plumbing",
			image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop",
			logo: "🔧",
			quote: "Stratos transformed our business. We doubled revenue and cut admin time by 70%.",
			author: "Michael Torres",
			role: "Owner",
			metrics: [
				{ label: "Revenue Growth", value: "+127%", icon: TrendingUp },
				{ label: "Time Saved", value: "15hrs/week", icon: Clock },
				{ label: "Customer Rating", value: "4.9/5", icon: Star },
			],
			color: "from-blue-500/20 to-cyan-500/20",
		},
		{
			company: "Elite HVAC Services",
			industry: "HVAC",
			image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=2069&auto=format&fit=crop",
			logo: "❄️",
			quote: "The mobile app alone pays for itself. Our techs complete 3 more jobs per day.",
			author: "Sarah Chen",
			role: "Operations Manager",
			metrics: [
				{ label: "Jobs Per Day", value: "+40%", icon: BarChart3 },
				{ label: "Payment Speed", value: "2x Faster", icon: DollarSign },
				{ label: "Team Size", value: "12 → 45", icon: Users },
			],
			color: "from-purple-500/20 to-pink-500/20",
		},
		{
			company: "Premier Electrical",
			industry: "Electrical",
			image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2069&auto=format&fit=crop",
			logo: "⚡",
			quote: "Best investment we've made. The scheduling intelligence is game-changing.",
			author: "David Kim",
			role: "CEO",
			metrics: [
				{ label: "Route Efficiency", value: "+65%", icon: Calendar },
				{ label: "Invoice Time", value: "5 mins", icon: CreditCard },
				{ label: "Client Retention", value: "94%", icon: Star },
			],
			color: "from-amber-500/20 to-orange-500/20",
		},
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveStory((prev) => (prev + 1) % stories.length);
		}, 8000);
		return () => clearInterval(interval);
	}, [stories.length]);

	const activeData = stories[activeStory];

	return (
		<section className="bg-black py-32">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-16 text-center">
					<Badge className="mb-4 gap-1.5 bg-primary/10 text-primary" variant="outline">
						<Star className="size-3" />
						Success Stories
					</Badge>
					<h2 className="mb-4 text-balance font-semibold text-4xl text-white md:text-6xl">
						Real Results from Real Businesses
					</h2>
					<p className="mx-auto max-w-2xl text-foreground text-lg md:text-xl">
						Join thousands of field service companies growing faster with Stratos
					</p>
				</div>

				<div className="relative">
					{/* Main Story Card */}
					<div className="group relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/5 to-transparent transition-all duration-500">
						<div className="grid gap-8 lg:grid-cols-2">
							{/* Image Side */}
							<div className="relative h-[400px] overflow-hidden lg:h-auto">
								<div className={`absolute inset-0 bg-gradient-to-br ${activeData.color}`} />
								<img
									src={activeData.image}
									alt={activeData.company}
									className="absolute inset-0 size-full object-cover opacity-60 grayscale transition-all duration-700 group-hover:scale-105 group-hover:opacity-80 group-hover:grayscale-0"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

								{/* Logo Badge */}
								<div className="absolute top-6 left-6">
									<div className="flex size-16 items-center justify-center rounded-2xl border border-white/20 bg-black/40 text-3xl backdrop-blur-md">
										{activeData.logo}
									</div>
								</div>

								{/* Company Name */}
								<div className="absolute bottom-6 left-6">
									<h3 className="font-bold text-2xl text-white">{activeData.company}</h3>
									<p className="text-white/70">{activeData.industry}</p>
								</div>
							</div>

							{/* Content Side */}
							<div className="flex flex-col justify-center p-8 lg:p-12">
								{/* Quote */}
								<div className="mb-8">
									<div className="mb-4 text-6xl text-primary/20">"</div>
									<p className="mb-6 font-medium text-white text-xl leading-relaxed md:text-2xl">{activeData.quote}</p>
									<div className="flex items-center gap-4">
										<div className="size-12 rounded-full bg-gradient-to-br from-primary to-primary/50" />
										<div>
											<div className="font-semibold text-white">{activeData.author}</div>
											<div className="text-foreground text-sm">{activeData.role}</div>
										</div>
									</div>
								</div>

								{/* Metrics */}
								<div className="grid gap-4 sm:grid-cols-3">
									{activeData.metrics.map((metric, idx) => (
										<div key={idx} className="rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all duration-300 hover:border-primary/40 hover:bg-primary/10">
											<metric.icon className="mb-2 size-5 text-primary" />
											<div className="font-bold text-2xl text-white">{metric.value}</div>
											<div className="text-foreground text-xs">{metric.label}</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Story Navigation Dots */}
					<div className="mt-8 flex justify-center gap-2">
						{stories.map((_, idx) => (
							<button
								key={idx}
								type="button"
								onClick={() => setActiveStory(idx)}
								className={`h-2 rounded-full transition-all duration-300 ${idx === activeStory ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/50"}`}
								aria-label={`View story ${idx + 1}`}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export function ROICalculatorSection() {
	const [teamSize, setTeamSize] = useState(5);
	const [jobsPerDay, setJobsPerDay] = useState(8);

	const calculations = {
		timesSaved: teamSize * 2.5 * 52, // hours per year
		revenuIncrease: jobsPerDay * teamSize * 150 * 1.3, // 30% more jobs
		adminReduction: teamSize * 15 * 52 * 45, // admin hours saved at $45/hr
	};

	return (
		<section className="bg-gradient-to-b from-black via-primary/5 to-black py-32">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid gap-12 lg:grid-cols-2">
					{/* Calculator */}
					<div className="rounded-3xl border border-primary/20 bg-black p-8 lg:p-12">
						<Badge className="mb-4 gap-1.5 bg-primary/10 text-primary" variant="outline">
							<Sparkles className="size-3" />
							ROI Calculator
						</Badge>
						<h2 className="mb-4 text-balance font-semibold text-3xl text-white md:text-5xl">Calculate Your Business Impact</h2>
						<p className="mb-8 text-foreground">See how much Stratos could save and earn for your business</p>

						{/* Inputs */}
						<div className="space-y-6">
							<div>
								<label htmlFor="team-size" className="mb-2 flex items-center justify-between text-sm text-white">
									<span>Team Size</span>
									<span className="font-bold text-primary text-xl">{teamSize} techs</span>
								</label>
								<input
									id="team-size"
									type="range"
									min="1"
									max="50"
									value={teamSize}
									onChange={(e) => setTeamSize(Number(e.target.value))}
									className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-border accent-primary"
								/>
							</div>

							<div>
								<label htmlFor="jobs-per-day" className="mb-2 flex items-center justify-between text-sm text-white">
									<span>Avg Jobs Per Day</span>
									<span className="font-bold text-primary text-xl">{jobsPerDay} jobs</span>
								</label>
								<input
									id="jobs-per-day"
									type="range"
									min="1"
									max="20"
									value={jobsPerDay}
									onChange={(e) => setJobsPerDay(Number(e.target.value))}
									className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-border accent-primary"
								/>
							</div>
						</div>

						{/* Results */}
						<div className="mt-8 space-y-4 rounded-2xl border border-primary/20 bg-primary/5 p-6">
							<div className="flex items-center justify-between border-b border-border pb-4">
								<div className="flex items-center gap-3">
									<Clock className="size-5 text-primary" />
									<span className="text-foreground">Hours Saved/Year</span>
								</div>
								<span className="font-bold text-2xl text-white">{calculations.timesSaved.toLocaleString()}h</span>
							</div>

							<div className="flex items-center justify-between border-b border-border pb-4">
								<div className="flex items-center gap-3">
									<DollarSign className="size-5 text-primary" />
									<span className="text-foreground">Revenue Increase</span>
								</div>
								<span className="font-bold text-2xl text-white">${(calculations.revenuIncrease / 1000).toFixed(0)}K+</span>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<TrendingUp className="size-5 text-primary" />
									<span className="text-foreground">Admin Cost Savings</span>
								</div>
								<span className="font-bold text-2xl text-white">${(calculations.adminReduction / 1000).toFixed(0)}K</span>
							</div>
						</div>

						<Button className="mt-6 w-full" size="lg">
							Get Started Free
							<ArrowRight className="ml-2 size-4" />
						</Button>
					</div>

					{/* Benefits List */}
					<div className="flex flex-col justify-center">
						<h3 className="mb-8 font-semibold text-3xl text-white md:text-4xl">What You'll Get</h3>

						<div className="space-y-4">
							{[
								{
									icon: Calendar,
									title: "Smart Scheduling",
									description: "AI-powered dispatch reduces drive time by 40%",
								},
								{
									icon: CreditCard,
									title: "Instant Payments",
									description: "Get paid on-site, improve cash flow by 2x",
								},
								{
									icon: Users,
									title: "Team Efficiency",
									description: "Mobile app increases jobs completed per day",
								},
								{
									icon: BarChart3,
									title: "Real-Time Analytics",
									description: "Track profits, expenses, and KPIs live",
								},
								{
									icon: Zap,
									title: "Automation",
									description: "Eliminate 70% of admin work automatically",
								},
								{
									icon: Star,
									title: "Customer Experience",
									description: "Online booking and portal boost retention",
								},
							].map((benefit, idx) => (
								<div key={idx} className="group flex items-start gap-4 rounded-xl border border-transparent p-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5">
									<div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:border-primary/40">
										<benefit.icon className="size-5 text-primary" />
									</div>
									<div>
										<h4 className="mb-1 font-semibold text-white">{benefit.title}</h4>
										<p className="text-foreground text-sm">{benefit.description}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export function IndustrySolutionsSection() {
	const [activeIndustry, setActiveIndustry] = useState(0);

	const industries = [
		{
			name: "Plumbing",
			icon: Wrench,
			color: "from-blue-500/20 to-cyan-500/20",
			image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop",
			features: ["Emergency dispatch", "Parts inventory", "License tracking", "Water testing"],
			stat: "2,400+ plumbers",
		},
		{
			name: "HVAC",
			icon: Wind,
			color: "from-purple-500/20 to-pink-500/20",
			image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=2069&auto=format&fit=crop",
			features: ["Seasonal scheduling", "Equipment tracking", "Maintenance plans", "EPA compliance"],
			stat: "1,800+ HVAC pros",
		},
		{
			name: "Electrical",
			icon: Zap,
			color: "from-amber-500/20 to-orange-500/20",
			image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2069&auto=format&fit=crop",
			features: ["Project bidding", "Code compliance", "Material tracking", "Permit management"],
			stat: "1,500+ electricians",
		},
		{
			name: "Cleaning",
			icon: Sparkles,
			color: "from-green-500/20 to-emerald-500/20",
			image: "https://images.unsplash.com/photo-1581578949510-fa7315c4c350?q=80&w=2070&auto=format&fit=crop",
			features: ["Recurring service", "Supply ordering", "Quality checklists", "Team routing"],
			stat: "900+ cleaning services",
		},
		{
			name: "Landscaping",
			icon: Home,
			color: "from-lime-500/20 to-green-500/20",
			image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=2070&auto=format&fit=crop",
			features: ["Seasonal contracts", "Weather alerts", "Equipment logs", "Property photos"],
			stat: "1,200+ landscapers",
		},
	];

	const active = industries[activeIndustry];

	return (
		<section className="bg-black py-32">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-16 text-center">
					<Badge className="mb-4 gap-1.5 bg-primary/10 text-primary" variant="outline">
						<Wrench className="size-3" />
						Industry Solutions
					</Badge>
					<h2 className="mb-4 text-balance font-semibold text-4xl text-white md:text-6xl">Built for Your Trade</h2>
					<p className="mx-auto max-w-2xl text-foreground text-lg md:text-xl">Specialized features designed for field service professionals</p>
				</div>

				{/* Industry Tabs */}
				<div className="mb-8 flex flex-wrap justify-center gap-3">
					{industries.map((industry, idx) => (
						<button
							key={idx}
							type="button"
							onClick={() => setActiveIndustry(idx)}
							className={`flex items-center gap-2 rounded-full border px-6 py-3 transition-all duration-300 ${idx === activeIndustry ? "border-primary bg-primary text-white" : "border-border bg-black text-foreground hover:border-primary/50 hover:text-white"}`}
						>
							<industry.icon className="size-4" />
							<span className="font-medium">{industry.name}</span>
						</button>
					))}
				</div>

				{/* Industry Content */}
				<div className="group relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/5 to-transparent transition-all duration-500">
					<div className="grid gap-0 lg:grid-cols-2">
						{/* Image */}
						<div className="relative h-[400px] overflow-hidden lg:h-auto">
							<div className={`absolute inset-0 bg-gradient-to-br ${active.color}`} />
							<img src={active.image} alt={active.name} className="absolute inset-0 size-full object-cover opacity-60 grayscale transition-all duration-700 group-hover:scale-105 group-hover:opacity-80 group-hover:grayscale-0" />
							<div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

							{/* Icon */}
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
								<div className="flex size-32 items-center justify-center rounded-3xl border border-white/20 bg-black/40 backdrop-blur-md transition-all duration-500 group-hover:scale-110">
									<active.icon className="size-16 text-primary" />
								</div>
							</div>

							{/* Stat */}
							<div className="absolute bottom-6 left-6">
								<div className="rounded-full border border-white/20 bg-black/60 px-4 py-2 backdrop-blur-md">
									<span className="font-semibold text-sm text-white">{active.stat}</span>
								</div>
							</div>
						</div>

						{/* Features */}
						<div className="flex flex-col justify-center p-8 lg:p-12">
							<h3 className="mb-2 font-bold text-3xl text-white md:text-4xl">{active.name} Solutions</h3>
							<p className="mb-8 text-foreground">Everything you need to run your {active.name.toLowerCase()} business</p>

							<div className="grid gap-4 sm:grid-cols-2">
								{active.features.map((feature, idx) => (
									<div key={idx} className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:scale-105">
										<CheckCircle2 className="size-5 shrink-0 text-primary" />
										<span className="font-medium text-white">{feature}</span>
									</div>
								))}
							</div>

							<Button className="mt-8 w-full sm:w-auto" size="lg">
								Explore {active.name} Features
								<ArrowRight className="ml-2 size-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export function TrustStatsSection() {
	const [animatedStats, setAnimatedStats] = useState({
		businesses: 0,
		jobsCompleted: 0,
		revenue: 0,
		satisfaction: 0,
	});

	const finalStats = {
		businesses: 15000,
		jobsCompleted: 2400000,
		revenue: 340,
		satisfaction: 98,
	};

	useEffect(() => {
		const duration = 2000;
		const steps = 60;
		const interval = duration / steps;

		let step = 0;
		const timer = setInterval(() => {
			step++;
			const progress = step / steps;

			setAnimatedStats({
				businesses: Math.floor(finalStats.businesses * progress),
				jobsCompleted: Math.floor(finalStats.jobsCompleted * progress),
				revenue: Math.floor(finalStats.revenue * progress),
				satisfaction: Math.floor(finalStats.satisfaction * progress),
			});

			if (step >= steps) {
				clearInterval(timer);
				setAnimatedStats(finalStats);
			}
		}, interval);

		return () => clearInterval(timer);
	}, []);

	return (
		<section className="bg-gradient-to-b from-black via-primary/10 to-black py-32">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-16 text-center">
					<Badge className="mb-4 gap-1.5 bg-primary/10 text-primary" variant="outline">
						<TrendingUp className="size-3" />
						Trusted Worldwide
					</Badge>
					<h2 className="mb-4 text-balance font-semibold text-4xl text-white md:text-6xl">The Numbers Speak</h2>
					<p className="mx-auto max-w-2xl text-foreground text-lg md:text-xl">Join the fastest-growing field service platform</p>
				</div>

				{/* Stats Grid */}
				<div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					<div className="group relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-8 transition-all duration-300 hover:border-primary/40 hover:scale-105">
						<Users className="mb-4 size-8 text-primary" />
						<div className="mb-2 font-bold text-5xl text-white">{animatedStats.businesses.toLocaleString()}+</div>
						<div className="text-foreground">Active Businesses</div>
						<div className="absolute top-0 right-0 size-32 bg-primary/5 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
					</div>

					<div className="group relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-8 transition-all duration-300 hover:border-primary/40 hover:scale-105">
						<CheckCircle2 className="mb-4 size-8 text-primary" />
						<div className="mb-2 font-bold text-5xl text-white">{(animatedStats.jobsCompleted / 1000000).toFixed(1)}M+</div>
						<div className="text-foreground">Jobs Completed</div>
						<div className="absolute top-0 right-0 size-32 bg-primary/5 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
					</div>

					<div className="group relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-8 transition-all duration-300 hover:border-primary/40 hover:scale-105">
						<DollarSign className="mb-4 size-8 text-primary" />
						<div className="mb-2 font-bold text-5xl text-white">${animatedStats.revenue}M+</div>
						<div className="text-foreground">Revenue Processed</div>
						<div className="absolute top-0 right-0 size-32 bg-primary/5 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
					</div>

					<div className="group relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-8 transition-all duration-300 hover:border-primary/40 hover:scale-105">
						<Star className="mb-4 size-8 text-primary" />
						<div className="mb-2 font-bold text-5xl text-white">{animatedStats.satisfaction}%</div>
						<div className="text-foreground">Satisfaction Rate</div>
						<div className="absolute top-0 right-0 size-32 bg-primary/5 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
					</div>
				</div>

				{/* Trust Badges */}
				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					<div className="flex items-center gap-4 rounded-2xl border border-border bg-black/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
							<Star className="size-6 text-primary" />
						</div>
						<div>
							<div className="mb-1 font-semibold text-white">4.9/5 Rating</div>
							<div className="text-foreground text-sm">From 8,500+ reviews</div>
						</div>
					</div>

					<div className="flex items-center gap-4 rounded-2xl border border-border bg-black/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
							<TrendingUp className="size-6 text-primary" />
						</div>
						<div>
							<div className="mb-1 font-semibold text-white">Industry Leader</div>
							<div className="text-foreground text-sm">G2 High Performer 2025</div>
						</div>
					</div>

					<div className="flex items-center gap-4 rounded-2xl border border-border bg-black/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
							<CheckCircle2 className="size-6 text-primary" />
						</div>
						<div>
							<div className="mb-1 font-semibold text-white">99.9% Uptime</div>
							<div className="text-foreground text-sm">Enterprise reliability</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export function PricingPreviewSection() {
	const plans = [
		{
			name: "Starter",
			price: "49",
			description: "Perfect for solo technicians and small teams",
			features: ["Up to 3 users", "100 jobs/month", "Basic scheduling", "Mobile app", "Email support", "Online booking"],
			cta: "Start Free Trial",
			popular: false,
		},
		{
			name: "Professional",
			price: "149",
			description: "For growing businesses that need more power",
			features: ["Up to 15 users", "Unlimited jobs", "Smart scheduling + AI", "Advanced reporting", "QuickBooks sync", "Priority support", "Custom branding", "GPS tracking"],
			cta: "Start Free Trial",
			popular: true,
		},
		{
			name: "Enterprise",
			price: "Custom",
			description: "Custom solutions for large organizations",
			features: ["Unlimited users", "Multi-location", "API access", "Dedicated account manager", "Custom integrations", "Advanced security", "SLA guarantee", "White-label options"],
			cta: "Contact Sales",
			popular: false,
		},
	];

	return (
		<section className="bg-black py-32">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-16 text-center">
					<Badge className="mb-4 gap-1.5 bg-primary/10 text-primary" variant="outline">
						<DollarSign className="size-3" />
						Pricing
					</Badge>
					<h2 className="mb-4 text-balance font-semibold text-4xl text-white md:text-6xl">Simple, Transparent Pricing</h2>
					<p className="mx-auto max-w-2xl text-foreground text-lg md:text-xl">Choose the plan that fits your business. All plans include 14-day free trial.</p>
				</div>

				<div className="grid gap-8 lg:grid-cols-3">
					{plans.map((plan, idx) => (
						<div
							key={idx}
							className={`group relative flex flex-col overflow-hidden rounded-3xl border p-8 transition-all duration-300 ${
								plan.popular
									? "scale-105 border-primary bg-gradient-to-br from-primary/10 to-transparent shadow-2xl shadow-primary/20 hover:scale-110"
									: "border-border bg-black/50 hover:border-primary/30 hover:scale-105"
							}`}
						>
							{plan.popular && (
								<div className="absolute top-0 right-0 rounded-bl-2xl bg-primary px-4 py-1">
									<span className="font-semibold text-sm text-white">Most Popular</span>
								</div>
							)}

							<div className="mb-6">
								<h3 className="mb-2 font-bold text-2xl text-white">{plan.name}</h3>
								<p className="mb-4 text-foreground text-sm">{plan.description}</p>
								<div className="flex items-baseline gap-2">
									{plan.price === "Custom" ? (
										<span className="font-bold text-4xl text-white">Custom</span>
									) : (
										<>
											<span className="font-bold text-5xl text-white">${plan.price}</span>
											<span className="text-foreground">/month</span>
										</>
									)}
								</div>
							</div>

							<ul className="mb-8 flex-1 space-y-3">
								{plan.features.map((feature, featureIdx) => (
									<li key={featureIdx} className="flex items-start gap-3">
										<CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
										<span className="text-foreground text-sm">{feature}</span>
									</li>
								))}
							</ul>

							<Button className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`} size="lg" variant={plan.popular ? "default" : "outline"}>
								{plan.cta}
							</Button>
						</div>
					))}
				</div>

				{/* Additional Info */}
				<div className="mt-16 text-center">
					<p className="mb-4 text-foreground">All plans include:</p>
					<div className="flex flex-wrap justify-center gap-6">
						{["No credit card required", "Cancel anytime", "Free data migration", "24/7 support"].map((item, idx) => (
							<div key={idx} className="flex items-center gap-2">
								<CheckCircle2 className="size-4 text-primary" />
								<span className="text-foreground text-sm">{item}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

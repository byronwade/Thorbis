"use client";

/**
 * Complete Step - Onboarding Celebration & Summary
 *
 * Shows:
 * - Confetti celebration animation
 * - Setup summary
 * - What's configured
 * - Quick access to key features
 * - Support resources
 * - Next steps
 */

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useOnboardingStore, INDUSTRIES } from "@/lib/onboarding/onboarding-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
	CheckCircle2,
	Sparkles,
	Rocket,
	BookOpen,
	MessageSquare,
	Video,
	ArrowRight,
	Calendar,
	Users,
	DollarSign,
	BarChart3,
	Settings,
	Phone,
	Mail,
	Star,
	PartyPopper,
	Headphones,
} from "lucide-react";

const QUICK_LINKS = [
	{
		title: "Dashboard",
		description: "View your business at a glance",
		icon: BarChart3,
		href: "/dashboard",
		primary: true,
	},
	{
		title: "Add Customer",
		description: "Start building your database",
		icon: Users,
		href: "/dashboard/customers/new",
	},
	{
		title: "Schedule Job",
		description: "Put something on the calendar",
		icon: Calendar,
		href: "/dashboard/schedule",
	},
	{
		title: "Create Estimate",
		description: "Send a professional quote",
		icon: DollarSign,
		href: "/dashboard/work/estimates/new",
	},
];

const RESOURCES = [
	{
		title: "Help Center",
		description: "Guides and tutorials",
		icon: BookOpen,
		href: "/help",
	},
	{
		title: "Video Training",
		description: "Learn at your own pace",
		icon: Video,
		href: "/training",
	},
	{
		title: "Live Chat",
		description: "Get help from our team",
		icon: MessageSquare,
		action: "chat",
	},
	{
		title: "Call Support",
		description: "Talk to a human",
		icon: Headphones,
		href: "tel:+18005551234",
	},
];

export function CompleteStep() {
	const { data } = useOnboardingStore();

	// Trigger confetti celebration on mount
	useEffect(() => {
		const triggerConfetti = () => {
			const duration = 3000;
			const animationEnd = Date.now() + duration;
			const defaults = {
				startVelocity: 30,
				spread: 360,
				ticks: 60,
				zIndex: 10000,
				colors: [
					"#26ccff",
					"#a25afd",
					"#ff5e7e",
					"#88ff5a",
					"#fcff42",
					"#ffa62d",
					"#ff36ff",
				],
			};

			function randomInRange(min: number, max: number) {
				return Math.random() * (max - min) + min;
			}

			// Initial burst from center
			confetti({
				...defaults,
				particleCount: 100,
				origin: { x: 0.5, y: 0.5 },
			});

			// Continuous bursts from sides
			const interval = setInterval(() => {
				const timeLeft = animationEnd - Date.now();

				if (timeLeft <= 0) {
					return clearInterval(interval);
				}

				const particleCount = 50 * (timeLeft / duration);
				confetti({
					...defaults,
					particleCount,
					origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
				});
				confetti({
					...defaults,
					particleCount,
					origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
				});
			}, 250);

			// Cleanup
			setTimeout(() => clearInterval(interval), duration);
		};

		// Small delay to ensure component is mounted
		const timer = setTimeout(triggerConfetti, 100);
		return () => clearTimeout(timer);
	}, []);

	// Calculate what was set up
	const setupSummary = {
		company: !!data.companyName,
		profile: !!data.userName,
		phone: data.phoneSetupType !== "skip",
		email: data.emailSetupType !== "skip",
		notifications: (data.notifications?.length ?? 0) > 0,
		services: (data.services?.length ?? 0) > 0,
		team: (data.teamInvites?.length ?? 0) > 0,
		payments: data.stripeConnected || (data.paymentMethods?.length ?? 0) > 0,
		schedule: !!data.businessHours,
		reports: (data.dashboardWidgets?.length ?? 0) > 0,
	};

	const completedCount = Object.values(setupSummary).filter(Boolean).length;
	const totalCount = Object.keys(setupSummary).length;
	const completionPercent = Math.round((completedCount / totalCount) * 100);

	const industryLabel = INDUSTRIES.find((i) => i.value === data.industry)?.label;

	return (
		<div className="space-y-8 max-w-2xl">
			{/* Celebration Header */}
			<div className="text-center space-y-4">
				<div className="flex justify-center">
					<div className="relative">
						<div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/50">
							<PartyPopper className="h-10 w-10 text-primary-foreground" />
						</div>
						<div className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
							<CheckCircle2 className="h-5 w-5" />
						</div>
					</div>
				</div>

				<div>
					<h1 className="text-2xl font-bold">You're all set!</h1>
					<p className="text-muted-foreground mt-2">
						{data.companyName || "Your business"} is ready to rock.
					</p>
				</div>

				{/* Progress Ring */}
				<div className="flex items-center justify-center gap-2">
					<div className="relative h-12 w-12">
						<svg className="h-12 w-12 -rotate-90 transform">
							<circle
								cx="24"
								cy="24"
								r="20"
								fill="none"
								stroke="currentColor"
								strokeWidth="4"
								className="text-muted"
							/>
							<circle
								cx="24"
								cy="24"
								r="20"
								fill="none"
								stroke="currentColor"
								strokeWidth="4"
								strokeDasharray={`${completionPercent * 1.26} 126`}
								className="text-primary"
							/>
						</svg>
						<span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
							{completionPercent}%
						</span>
					</div>
					<span className="text-sm text-muted-foreground">
						{completedCount} of {totalCount} areas configured
					</span>
				</div>
			</div>

			{/* Setup Summary */}
			<div className="rounded-xl bg-muted/30 p-5 space-y-4">
				<h3 className="font-semibold">Setup Summary</h3>

				<div className="grid gap-2 sm:grid-cols-2">
					{[
						{ key: "company", label: "Company Profile", icon: Settings },
						{ key: "profile", label: "User Profile", icon: Users },
						{ key: "phone", label: "Phone & SMS", icon: Phone },
						{ key: "email", label: "Email Settings", icon: Mail },
						{ key: "services", label: "Service Catalog", icon: DollarSign },
						{ key: "schedule", label: "Business Hours", icon: Calendar },
						{ key: "payments", label: "Payment Methods", icon: DollarSign },
						{ key: "reports", label: "Dashboard", icon: BarChart3 },
					].map((item) => {
						const Icon = item.icon;
						const completed = setupSummary[item.key as keyof typeof setupSummary];

						return (
							<div
								key={item.key}
								className={cn(
									"flex items-center gap-3 rounded-lg p-3",
									completed ? "bg-green-500/10" : "bg-muted/50"
								)}
							>
								<div className={cn(
									"flex h-8 w-8 items-center justify-center rounded-lg",
									completed ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"
								)}>
									{completed ? (
										<CheckCircle2 className="h-4 w-4" />
									) : (
										<Icon className="h-4 w-4" />
									)}
								</div>
								<span className={cn(
									"text-sm",
									completed ? "font-medium" : "text-muted-foreground"
								)}>
									{item.label}
								</span>
							</div>
						);
					})}
				</div>

				{/* Key Stats */}
				{((data.services?.length ?? 0) > 0 || (data.teamInvites?.length ?? 0) > 0) && (
					<div className="flex flex-wrap gap-4 pt-4 border-t">
						{(data.services?.length ?? 0) > 0 && (
							<div className="text-center">
								<p className="text-2xl font-bold text-primary">{data.services?.length}</p>
								<p className="text-xs text-muted-foreground">Services</p>
							</div>
						)}
						{(data.teamInvites?.length ?? 0) > 0 && (
							<div className="text-center">
								<p className="text-2xl font-bold text-primary">{data.teamInvites?.length}</p>
								<p className="text-xs text-muted-foreground">Team Invited</p>
							</div>
						)}
						{industryLabel && (
							<div className="text-center">
								<Badge variant="secondary">{industryLabel}</Badge>
								<p className="text-xs text-muted-foreground mt-1">Industry</p>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Quick Actions */}
			<div className="space-y-3">
				<h3 className="font-semibold">Get Started</h3>
				<div className="grid gap-3 sm:grid-cols-2">
					{QUICK_LINKS.map((link) => {
						const Icon = link.icon;
						return (
							<a
								key={link.title}
								href={link.href}
								className={cn(
									"flex items-center gap-3 rounded-xl p-4 transition-all hover:ring-1 hover:ring-primary/30",
									link.primary
										? "bg-primary text-primary-foreground hover:bg-primary/90"
										: "bg-muted/30 hover:bg-muted/50"
								)}
							>
								<div className={cn(
									"flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0",
									link.primary ? "bg-primary-foreground/20" : "bg-muted"
								)}>
									<Icon className="h-5 w-5" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="font-medium">{link.title}</p>
									<p className={cn(
										"text-sm truncate",
										link.primary ? "text-primary-foreground/80" : "text-muted-foreground"
									)}>
										{link.description}
									</p>
								</div>
								<ArrowRight className="h-4 w-4 flex-shrink-0" />
							</a>
						);
					})}
				</div>
			</div>

			{/* Support Resources */}
			<div className="space-y-3">
				<h3 className="font-semibold">Need Help?</h3>
				<p className="text-sm text-muted-foreground">
					Our team is here for you. Get help whenever you need it.
				</p>
				<div className="grid gap-2 sm:grid-cols-2">
					{RESOURCES.map((resource) => {
						const Icon = resource.icon;
						return (
							<a
								key={resource.title}
								href={resource.href || "#"}
								onClick={resource.action === "chat" ? (e) => {
									e.preventDefault();
									// Open chat widget
								} : undefined}
								className="flex items-center gap-3 rounded-lg bg-muted/30 p-3 hover:bg-muted/50 transition-colors"
							>
								<Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium">{resource.title}</p>
									<p className="text-xs text-muted-foreground truncate">
										{resource.description}
									</p>
								</div>
							</a>
						);
					})}
				</div>
			</div>

			{/* Pro Tips */}
			<div className="rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-5 space-y-3">
				<div className="flex items-center gap-2">
					<Sparkles className="h-5 w-5 text-primary" />
					<h3 className="font-semibold">Pro Tips for Your First Week</h3>
				</div>
				<ul className="space-y-2 text-sm">
					<li className="flex items-start gap-2">
						<Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
						<span>Download the mobile app to manage jobs on the go</span>
					</li>
					<li className="flex items-start gap-2">
						<Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
						<span>Add your existing customers via CSV import (Settings → Import)</span>
					</li>
					<li className="flex items-start gap-2">
						<Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
						<span>Customize your estimate and invoice templates</span>
					</li>
					<li className="flex items-start gap-2">
						<Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
						<span>Set up integrations with QuickBooks or Google Calendar</span>
					</li>
				</ul>
			</div>

			{/* Final CTA */}
			<div className="pt-4">
				<Button asChild size="lg" className="w-full">
					<a href="/dashboard">
						<Rocket className="mr-2 h-5 w-5" />
						Go to Dashboard
					</a>
				</Button>
				<p className="text-xs text-muted-foreground text-center mt-3">
					You can always access setup from Settings → Onboarding
				</p>
			</div>
		</div>
	);
}

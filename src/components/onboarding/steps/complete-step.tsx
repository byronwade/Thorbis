"use client";

/**
 * Complete Step - Onboarding Celebration & Summary
 */

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useOnboardingStore, INDUSTRIES } from "@/lib/onboarding/onboarding-store";
import { Button } from "@/components/ui/button";
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
	{ title: "Help Center", description: "Guides and tutorials", icon: BookOpen, href: "/help" },
	{ title: "Video Training", description: "Learn at your own pace", icon: Video, href: "/training" },
	{ title: "Live Chat", description: "Get help from our team", icon: MessageSquare, action: "chat" },
	{ title: "Call Support", description: "Talk to a human", icon: Headphones, href: "tel:+18005551234" },
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
				colors: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42", "#ffa62d", "#ff36ff"],
			};

			function randomInRange(min: number, max: number) {
				return Math.random() * (max - min) + min;
			}

			confetti({ ...defaults, particleCount: 100, origin: { x: 0.5, y: 0.5 } });

			const interval = setInterval(() => {
				const timeLeft = animationEnd - Date.now();
				if (timeLeft <= 0) return clearInterval(interval);

				const particleCount = 50 * (timeLeft / duration);
				confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
				confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
			}, 250);

			setTimeout(() => clearInterval(interval), duration);
		};

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
		<div className="space-y-10">
			{/* Celebration Header */}
			<div className="flex flex-col items-center gap-4 py-4">
				<div className="relative">
					<div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/50">
						<PartyPopper className="h-10 w-10 text-primary-foreground" />
					</div>
					<div className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
						<CheckCircle2 className="h-5 w-5" />
					</div>
				</div>

				<div className="text-center">
					<h2 className="text-2xl font-semibold">You're all set!</h2>
					<p className="text-muted-foreground">
						{data.companyName || "Your business"} is ready to rock.
					</p>
				</div>

				{/* Progress */}
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span className="font-medium text-foreground">{completionPercent}%</span>
					<span>configured • {completedCount} of {totalCount} areas</span>
				</div>
			</div>

			{/* Setup Summary */}
			<div className="space-y-3">
				<span className="font-medium">Setup Summary</span>
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
									completed ? "bg-green-500/10" : "bg-muted/40"
								)}
							>
								{completed ? (
									<CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
								) : (
									<Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
								)}
								<span className={cn("text-sm", completed ? "font-medium" : "text-muted-foreground")}>
									{item.label}
								</span>
							</div>
						);
					})}
				</div>

				{/* Stats */}
				{((data.services?.length ?? 0) > 0 || industryLabel) && (
					<div className="flex gap-6 text-sm text-muted-foreground pt-2">
						{(data.services?.length ?? 0) > 0 && (
							<span><span className="font-medium text-foreground">{data.services?.length}</span> services</span>
						)}
						{(data.teamInvites?.length ?? 0) > 0 && (
							<span><span className="font-medium text-foreground">{data.teamInvites?.length}</span> team invited</span>
						)}
						{industryLabel && (
							<span>{industryLabel}</span>
						)}
					</div>
				)}
			</div>

			{/* Quick Actions */}
			<div className="space-y-3">
				<span className="font-medium">Get Started</span>
				<div className="grid gap-2 sm:grid-cols-2">
					{QUICK_LINKS.map((link) => {
						const Icon = link.icon;
						return (
							<a
								key={link.title}
								href={link.href}
								className={cn(
									"flex items-center gap-3 rounded-lg p-3 transition-colors",
									link.primary
										? "bg-primary text-primary-foreground hover:bg-primary/90"
										: "bg-muted/40 hover:bg-muted/60"
								)}
							>
								<Icon className="h-5 w-5 flex-shrink-0" />
								<div className="flex-1 min-w-0">
									<p className="font-medium text-sm">{link.title}</p>
									<p className={cn(
										"text-xs",
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
				<span className="font-medium">Need Help?</span>
				<div className="grid gap-2 sm:grid-cols-2">
					{RESOURCES.map((resource) => {
						const Icon = resource.icon;
						return (
							<a
								key={resource.title}
								href={resource.href || "#"}
								onClick={resource.action === "chat" ? (e) => e.preventDefault() : undefined}
								className="flex items-center gap-3 rounded-lg bg-muted/40 p-3 hover:bg-muted/60 transition-colors"
							>
								<Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium">{resource.title}</p>
									<p className="text-xs text-muted-foreground">{resource.description}</p>
								</div>
							</a>
						);
					})}
				</div>
			</div>

			{/* Pro Tips */}
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<Sparkles className="h-4 w-4 text-primary" />
					<span className="font-medium">Pro Tips</span>
				</div>
				<div className="space-y-2">
					{[
						"Download the mobile app to manage jobs on the go",
						"Import existing customers via CSV (Settings → Import)",
						"Customize your estimate and invoice templates",
						"Connect QuickBooks or Google Calendar",
					].map((tip, i) => (
						<div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
							<Star className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
							<span>{tip}</span>
						</div>
					))}
				</div>
			</div>

			{/* Final CTA */}
			<div>
				<Button asChild className="w-full">
					<a href="/dashboard">
						<Rocket className="mr-2 h-4 w-4" />
						Go to Dashboard
					</a>
				</Button>
				<p className="text-xs text-muted-foreground text-center mt-3">
					Access setup anytime from Settings → Onboarding
				</p>
			</div>
		</div>
	);
}

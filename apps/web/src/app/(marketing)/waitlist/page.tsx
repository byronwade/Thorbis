import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, CheckCircle2, Zap, Users, Gift } from "lucide-react";
import { Suspense } from "react";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { AnimatedGradientText } from "@/components/marketing/hero-background";

export const metadata = generateSEOMetadata({
	title: "Join the Waitlist - Thorbis",
	section: "Account",
	description:
		"Join the Thorbis waitlist to be among the first to access our field service management platform. Get notified when we launch.",
	path: "/waitlist",
	imageAlt: "Thorbis waitlist signup",
	keywords: [
		"thorbis waitlist",
		"field service software waitlist",
		"join waitlist",
	],
});

const benefits = [
	{
		icon: Zap,
		title: "Priority Early Access",
		description: "Be among the first to try Thorbis when we launch. Get instant access before public release.",
	},
	{
		icon: Gift,
		title: "Exclusive Launch Pricing",
		description: "Lock in special early bird pricing. Save up to 50% on your first year subscription.",
	},
	{
		icon: Users,
		title: "Direct Feature Requests",
		description: "Help shape the product. Your feedback will directly influence our roadmap and priorities.",
	},
	{
		icon: Sparkles,
		title: "Product Updates & Insights",
		description: "Get exclusive behind-the-scenes content, feature previews, and best practices for service businesses.",
	},
];

export default function WaitlistPage() {
	return (
		<div className="bg-background relative flex h-screen overflow-hidden">
			{/* Background Effects */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="from-primary/5 via-background to-background absolute inset-0 bg-gradient-to-br" />
				<div className="bg-primary/10 pointer-events-none absolute top-0 left-1/4 size-[500px] animate-pulse rounded-full opacity-20 blur-3xl" />
				<div className="bg-primary/10 pointer-events-none absolute bottom-0 right-1/4 size-[500px] animate-pulse rounded-full opacity-20 blur-3xl delay-1000" />
			</div>

			{/* Split Screen Layout */}
			<div className="flex w-full h-full flex-col lg:flex-row">
				{/* Left Side - Benefits */}
				<div className="flex flex-1 flex-col overflow-y-auto px-6 py-8 lg:px-12 lg:py-12 xl:px-16">
					<div className="mx-auto w-full max-w-lg flex flex-col h-full justify-center space-y-6">
						{/* Badge */}
						<Badge
							variant="outline"
							className="w-fit border-primary/30 bg-primary/5 text-primary animate-in fade-in-50"
						>
							<Sparkles className="mr-2 size-3" />
							Early Access Coming Soon
						</Badge>

						{/* Headline */}
						<div className="space-y-3 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
							<h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
								Join the waitlist and{" "}
								<AnimatedGradientText>
									transform your service business
								</AnimatedGradientText>
							</h1>
							<p className="text-base leading-relaxed text-muted-foreground md:text-lg">
								Get early access to Thorbis and join thousands of service businesses ready to streamline operations, boost revenue, and delight customers.
							</p>
						</div>

						{/* Benefits List */}
						<div className="space-y-3 animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-150">
							{benefits.map((benefit, index) => {
								const Icon = benefit.icon;
								return (
									<div
										key={benefit.title}
										className="flex items-start gap-3 animate-in fade-in-50 slide-in-from-left duration-700"
										style={{
											animationDelay: `${200 + index * 100}ms`,
										}}
									>
										<div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
											<Icon className="size-4 text-primary" />
										</div>
										<div className="flex-1 space-y-0.5">
											<h3 className="text-sm font-semibold leading-tight">
												{benefit.title}
											</h3>
											<p className="text-xs leading-snug text-muted-foreground">
												{benefit.description}
											</p>
										</div>
									</div>
								);
							})}
						</div>

						{/* Trust Indicators */}
						<div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground animate-in fade-in-50 duration-700 delay-500">
							<div className="flex items-center gap-1.5">
								<CheckCircle2 className="size-3.5 text-green-500" />
								<span>No spam, ever</span>
							</div>
							<div className="flex items-center gap-1.5">
								<CheckCircle2 className="size-3.5 text-green-500" />
								<span>Unsubscribe anytime</span>
							</div>
						</div>
					</div>
				</div>

				{/* Right Side - Form */}
				<div className="flex flex-1 flex-col overflow-y-auto border-t border-border/50 bg-muted/20 px-6 py-8 lg:border-t-0 lg:border-l lg:px-12 lg:py-12 xl:px-16">
					<div className="mx-auto w-full max-w-md flex flex-col h-full justify-center animate-in fade-in-50 slide-in-from-right duration-700 delay-300">
						<Suspense
							fallback={
								<div className="flex min-h-[400px] items-center justify-center">
									<Loader2 className="text-primary size-8 animate-spin" />
								</div>
							}
						>
							<WaitlistForm />
						</Suspense>
					</div>
				</div>
			</div>
		</div>
	);
}

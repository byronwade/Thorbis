import {
	ArrowRight,
	Building2,
	Check,
	Flame,
	Rocket,
	Sparkles,
	TrendingDown,
	TrendingUp,
	Zap,
} from "lucide-react";
import Link from "next/link";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CompetitorComparison } from "@/lib/marketing/competitors";
import type { CompetitorDesignVariant } from "@/lib/marketing/types";
import { cn } from "@/lib/utils";
import { getMarketingIcon } from "./marketing-icons";

type CompetitorPageProps = {
	competitor: CompetitorComparison;
};

const variantConfig: Record<
	CompetitorDesignVariant,
	{
		heroGradient: string;
		accentColor: string;
		secondaryColor: string;
		icon: React.ReactNode;
		cardStyle: string;
		badgeStyle: string;
		tableHeaderStyle: string;
		savingsStyle: string;
		ctaGradient: string;
	}
> = {
	enterprise: {
		heroGradient:
			"from-orange-600/20 via-amber-500/10 to-transparent dark:from-orange-500/30 dark:via-amber-500/15",
		accentColor: "text-orange-600 dark:text-orange-400",
		secondaryColor: "bg-orange-500/10 border-orange-500/20",
		icon: <Building2 className="size-6" />,
		cardStyle:
			"border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-amber-500/5",
		badgeStyle: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
		tableHeaderStyle: "bg-orange-500/5 text-orange-600 dark:text-orange-400",
		savingsStyle:
			"border-orange-500/20 bg-orange-500/5 text-orange-600 dark:text-orange-400",
		ctaGradient:
			"from-orange-600/20 via-amber-500/10 to-transparent dark:from-orange-500/30 dark:via-amber-500/15",
	},
	growth: {
		heroGradient:
			"from-blue-600/20 via-sky-500/10 to-transparent dark:from-blue-500/30 dark:via-sky-500/15",
		accentColor: "text-blue-600 dark:text-blue-400",
		secondaryColor: "bg-blue-500/10 border-blue-500/20",
		icon: <TrendingUp className="size-6" />,
		cardStyle:
			"border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-sky-500/5",
		badgeStyle: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
		tableHeaderStyle: "bg-blue-500/5 text-blue-600 dark:text-blue-400",
		savingsStyle:
			"border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400",
		ctaGradient:
			"from-blue-600/20 via-sky-500/10 to-transparent dark:from-blue-500/30 dark:via-sky-500/15",
	},
	field: {
		heroGradient:
			"from-green-600/20 via-emerald-500/10 to-transparent dark:from-green-500/30 dark:via-emerald-500/15",
		accentColor: "text-green-600 dark:text-green-400",
		secondaryColor: "bg-green-500/10 border-green-500/20",
		icon: <Rocket className="size-6" />,
		cardStyle:
			"border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5",
		badgeStyle: "bg-green-500/10 text-green-700 dark:text-green-300",
		tableHeaderStyle: "bg-green-500/5 text-green-600 dark:text-green-400",
		savingsStyle:
			"border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400",
		ctaGradient:
			"from-green-600/20 via-emerald-500/10 to-transparent dark:from-green-500/30 dark:via-emerald-500/15",
	},
	legacy: {
		heroGradient:
			"from-rose-600/20 via-red-500/10 to-transparent dark:from-rose-500/30 dark:via-red-500/15",
		accentColor: "text-rose-600 dark:text-rose-400",
		secondaryColor: "bg-rose-500/10 border-rose-500/20",
		icon: <Flame className="size-6" />,
		cardStyle:
			"border-rose-500/30 bg-gradient-to-br from-rose-500/5 to-red-500/5",
		badgeStyle: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
		tableHeaderStyle: "bg-rose-500/5 text-rose-600 dark:text-rose-400",
		savingsStyle:
			"border-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-400",
		ctaGradient:
			"from-rose-600/20 via-red-500/10 to-transparent dark:from-rose-500/30 dark:via-red-500/15",
	},
	starter: {
		heroGradient:
			"from-cyan-600/20 via-teal-500/10 to-transparent dark:from-cyan-500/30 dark:via-teal-500/15",
		accentColor: "text-cyan-600 dark:text-cyan-400",
		secondaryColor: "bg-cyan-500/10 border-cyan-500/20",
		icon: <Sparkles className="size-6" />,
		cardStyle:
			"border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-teal-500/5",
		badgeStyle: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
		tableHeaderStyle: "bg-cyan-500/5 text-cyan-600 dark:text-cyan-400",
		savingsStyle:
			"border-cyan-500/20 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400",
		ctaGradient:
			"from-cyan-600/20 via-teal-500/10 to-transparent dark:from-cyan-500/30 dark:via-teal-500/15",
	},
	automation: {
		heroGradient:
			"from-violet-600/20 via-purple-500/10 to-transparent dark:from-violet-500/30 dark:via-purple-500/15",
		accentColor: "text-violet-600 dark:text-violet-400",
		secondaryColor: "bg-violet-500/10 border-violet-500/20",
		icon: <Zap className="size-6" />,
		cardStyle:
			"border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-purple-500/5",
		badgeStyle: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
		tableHeaderStyle: "bg-violet-500/5 text-violet-600 dark:text-violet-400",
		savingsStyle:
			"border-violet-500/20 bg-violet-500/5 text-violet-600 dark:text-violet-400",
		ctaGradient:
			"from-violet-600/20 via-purple-500/10 to-transparent dark:from-violet-500/30 dark:via-purple-500/15",
	},
};

export function CompetitorPage({ competitor }: CompetitorPageProps) {
	const config = variantConfig[competitor.designVariant];

	return (
		<div className="space-y-20">
			{/* Hero Section - Enhanced with variant colors */}
			<section
				className={cn(
					"relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8 sm:p-12 lg:p-16",
					config.heroGradient,
				)}
			>
				<div
					className={cn(
						"absolute top-0 right-0 -z-10 size-96 rounded-full blur-3xl",
						config.secondaryColor,
					)}
				/>
				<div
					className={cn(
						"absolute bottom-0 left-0 -z-10 size-96 rounded-full blur-3xl",
						config.secondaryColor,
					)}
				/>

				<div className="relative mx-auto max-w-4xl space-y-8">
					<div className="flex items-center gap-3">
						<Badge
							className={cn(
								"px-4 py-1.5 font-medium tracking-wide uppercase",
								config.badgeStyle,
							)}
						>
							{competitor.heroEyebrow}
						</Badge>
						<div className={cn("flex items-center gap-2", config.accentColor)}>
							<TrendingDown className="size-4" />
							<span className="text-sm font-semibold">Save 60-70%</span>
						</div>
					</div>

					<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
						{competitor.heroTitle}
					</h1>

					<p className="text-muted-foreground text-lg leading-relaxed text-balance sm:text-xl">
						{competitor.heroDescription}
					</p>

					<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
						<Button asChild className="group" size="lg">
							<Link href="/waitlist">
								Start 14-day free trial
								<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
							</Link>
						</Button>
						<Button asChild size="lg" variant="outline">
							<Link href="/contact">Talk to migrations team</Link>
						</Button>
					</div>

					<div className="border-border/50 flex flex-wrap items-center gap-6 border-t pt-6">
						<div className="flex items-center gap-2">
							<Check className={cn("size-5", config.accentColor)} />
							<span className="text-muted-foreground text-sm">
								No multi-year contracts
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Check className={cn("size-5", config.accentColor)} />
							<span className="text-muted-foreground text-sm">
								Unlimited office users
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Check className={cn("size-5", config.accentColor)} />
							<span className="text-muted-foreground text-sm">
								30-45 day migration
							</span>
						</div>
					</div>

					<div
						className={cn(
							"rounded-xl border p-4 backdrop-blur-sm",
							config.cardStyle,
						)}
					>
						<p className="text-sm font-medium">
							<span className={config.accentColor}>Transparent pricing:</span>{" "}
							<span className="text-foreground">$200/month base</span> +
							pay-as-you-go AI usage. Average customer:{" "}
							<span className="text-foreground">$350-800/month all-in</span>.
						</p>
					</div>
				</div>
			</section>

			{/* Why Switch Section - Enhanced */}
			<section className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
				<Card className={cn("border-2 shadow-lg", config.cardStyle)}>
					<CardContent className="p-8">
						<div
							className={cn(
								"mb-6 inline-flex rounded-full p-3",
								config.secondaryColor,
							)}
						>
							<span className={config.accentColor}>{config.icon}</span>
						</div>
						<h2 className="text-3xl font-bold tracking-tight">
							Why teams switch to Thorbis
						</h2>
						<p className="text-muted-foreground mt-4 leading-relaxed">
							{competitor.summary}
						</p>
						<div className="mt-8 space-y-4">
							<h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
								Perfect for teams who:
							</h3>
							{competitor.idealCustomerProfile.map((profile, index) => (
								<div
									className={cn(
										"group flex gap-4 rounded-lg border border-transparent p-3 transition-colors",
										`hover:${config.secondaryColor}`,
									)}
									key={profile}
								>
									<div
										className={cn(
											"flex size-6 shrink-0 items-center justify-center rounded-full transition-colors",
											config.secondaryColor,
										)}
									>
										<span
											className={cn("text-xs font-bold", config.accentColor)}
										>
											{index + 1}
										</span>
									</div>
									<span className="text-foreground text-sm leading-relaxed">
										{profile}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<div className="space-y-4">
					<div
						className={cn(
							"rounded-2xl border-2 bg-gradient-to-br p-6",
							config.cardStyle,
						)}
					>
						<h3 className="text-xl font-bold">Thorbis advantages</h3>
						<p className="text-muted-foreground mt-2 text-sm">
							Real benefits backed by data
						</p>
					</div>

					<div className="space-y-3">
						{competitor.thorbisAdvantages.slice(0, 3).map((prop) => {
							const Icon = getMarketingIcon(prop.icon);
							return (
								<Card
									className={cn(
										"group transition-all hover:shadow-md",
										config.cardStyle,
									)}
									key={prop.title}
								>
									<CardContent className="p-5">
										<div className="flex gap-4">
											<div
												className={cn(
													"flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
													config.secondaryColor,
												)}
											>
												<Icon
													aria-hidden="true"
													className={cn("size-5", config.accentColor)}
												/>
											</div>
											<div className="space-y-1">
												<p className="text-sm leading-tight font-semibold">
													{prop.title}
												</p>
												<p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">
													{prop.description}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			{/* Feature Comparison - Enhanced */}
			<section className="space-y-8">
				<div className="space-y-3 text-center">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Feature comparison
					</h2>
					<p className="text-muted-foreground">
						Real differences that matter for your business
					</p>
				</div>

				<div
					className={cn(
						"overflow-hidden rounded-2xl border-2 shadow-lg",
						config.cardStyle,
					)}
				>
					<div className="overflow-x-auto">
						<table className="divide-border min-w-full divide-y">
							<thead className="from-muted/60 to-muted/40 bg-gradient-to-r">
								<tr>
									<th className="text-foreground px-6 py-4 text-left text-sm font-bold tracking-wide uppercase">
										Capability
									</th>
									<th
										className={cn(
											"px-6 py-4 text-left text-sm font-bold tracking-wide uppercase",
											config.tableHeaderStyle,
										)}
									>
										Thorbis
									</th>
									<th className="text-muted-foreground px-6 py-4 text-left text-sm font-bold tracking-wide uppercase">
										{competitor.competitorName}
									</th>
								</tr>
							</thead>
							<tbody className="divide-border bg-background divide-y">
								{competitor.comparisonTable.map((row, index) => (
									<tr
										className="group hover:bg-muted/30 transition-colors"
										key={row.category}
									>
										<td className="text-foreground px-6 py-5 text-sm font-semibold">
											<div className="flex items-center gap-3">
												<div
													className={cn(
														"flex size-7 shrink-0 items-center justify-center rounded-full text-xs",
														config.secondaryColor,
														config.accentColor,
													)}
												>
													{index + 1}
												</div>
												{row.category}
											</div>
										</td>
										<td
											className={cn(
												"px-6 py-5 text-sm leading-relaxed",
												config.tableHeaderStyle,
											)}
										>
											<div className="flex items-start gap-2">
												<Check
													className={cn(
														"mt-0.5 size-4 shrink-0",
														config.accentColor,
													)}
												/>
												<span className="text-foreground">{row.thorbis}</span>
											</div>
										</td>
										<td className="text-muted-foreground px-6 py-5 text-sm leading-relaxed">
											{row.competitor}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<div
					className={cn(
						"rounded-xl border-2 p-6 text-center",
						config.savingsStyle,
					)}
				>
					<p className="text-foreground font-semibold">
						<span className={config.accentColor}>Save 60-70%</span> on total
						cost while getting more features and better support
					</p>
				</div>
			</section>

			{/* Migration Plan - Enhanced */}
			<section className="space-y-8">
				<div className="space-y-3 text-center">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Guided migration plan
					</h2>
					<p className="text-muted-foreground">
						White-glove migration in 30-45 days, not months
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{competitor.migrationPlan.map((phase, index) => (
						<Card
							className={cn(
								"group relative overflow-hidden border-2 transition-all hover:shadow-xl",
								config.cardStyle,
							)}
							key={phase.title}
						>
							<div
								className={cn(
									"absolute top-0 right-0 -z-10 size-32 rounded-full blur-2xl transition-all",
									config.secondaryColor,
								)}
							/>

							<CardContent className="p-6">
								<div className="mb-4 flex items-center justify-between">
									<div
										className={cn(
											"flex size-12 items-center justify-center rounded-xl text-xl font-bold",
											config.secondaryColor,
											config.accentColor,
										)}
									>
										{index + 1}
									</div>
									<Badge className={cn("font-medium", config.badgeStyle)}>
										{index === 0
											? "Week 1-2"
											: index === 1
												? "Week 3-4"
												: "Week 5-6"}
									</Badge>
								</div>

								<h3 className="text-lg font-bold">{phase.title}</h3>
								<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
									{phase.description}
								</p>

								<div className="mt-4 space-y-2">
									{phase.steps.map((step) => (
										<div className="flex gap-2.5" key={step}>
											<Check
												className={cn(
													"mt-0.5 size-4 shrink-0",
													config.accentColor,
												)}
											/>
											<span className="text-foreground text-sm leading-relaxed">
												{step}
											</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				<div
					className={cn("rounded-xl p-6 text-center", config.secondaryColor)}
				>
					<p className="text-foreground font-medium">
						Most migrations complete in{" "}
						<span className={config.accentColor}>30-45 days</span> with zero
						downtime
					</p>
				</div>
			</section>

			{/* Pricing & Testimonial - Enhanced */}
			<section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
				<Card className={cn("border-2", config.cardStyle)}>
					<CardContent className="p-8">
						<div
							className={cn(
								"mb-6 inline-flex rounded-full p-3",
								config.secondaryColor,
							)}
						>
							<TrendingDown className={cn("size-6", config.accentColor)} />
						</div>
						<h2 className="text-2xl font-bold">Pricing & savings</h2>
						<p className="text-muted-foreground mt-2 text-sm">
							Transparent pricing with no surprises
						</p>

						<div className="mt-6 space-y-4">
							{competitor.pricingNotes.map((note) => (
								<div
									className={cn(
										"group flex gap-3 rounded-lg border border-transparent p-3 transition-colors",
										`hover:${config.secondaryColor}`,
									)}
									key={note}
								>
									<div
										className={cn(
											"flex size-6 shrink-0 items-center justify-center rounded-full",
											config.secondaryColor,
										)}
									>
										<Check className={cn("size-4", config.accentColor)} />
									</div>
									<span className="text-foreground text-sm leading-relaxed">
										{note}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{competitor.testimonial ? (
					<Card
						className={cn(
							"relative overflow-hidden border-2 bg-gradient-to-br",
							config.cardStyle,
						)}
					>
						<div
							className={cn(
								"absolute top-0 right-0 -z-10 size-64 rounded-full blur-3xl",
								config.secondaryColor,
							)}
						/>

						<CardContent className="flex flex-col justify-center p-8 text-center lg:p-12">
							<div
								className={cn("mb-6 text-6xl leading-none", config.accentColor)}
							>
								"
							</div>

							<blockquote className="space-y-6">
								<p className="text-foreground text-xl leading-relaxed font-semibold sm:text-2xl">
									{competitor.testimonial.quote}
								</p>

								<footer className="space-y-2">
									<div
										className={cn("mx-auto h-0.5 w-12", config.secondaryColor)}
									/>
									<p className="text-foreground font-semibold">
										{competitor.testimonial.attribution}
									</p>
									{competitor.testimonial.role && (
										<p className="text-muted-foreground text-sm">
											{competitor.testimonial.role}
										</p>
									)}
								</footer>
							</blockquote>
						</CardContent>
					</Card>
				) : (
					<Card className={cn("border-2", config.cardStyle)}>
						<CardContent className="flex flex-col items-center justify-center p-12 text-center">
							<div
								className={cn("mb-4 rounded-full p-4", config.secondaryColor)}
							>
								<Check className={cn("size-8", config.accentColor)} />
							</div>
							<h3 className="text-xl font-bold">Ready to switch?</h3>
							<p className="text-muted-foreground mt-2">
								Join hundreds of teams who've made the move to Thorbis
							</p>
							<Button asChild className="mt-6" size="lg">
								<Link href="/waitlist">Start your migration</Link>
							</Button>
						</CardContent>
					</Card>
				)}
			</section>

			{/* FAQ Section - Enhanced */}
			<section className="space-y-8">
				<div className="space-y-3 text-center">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Frequently asked questions
					</h2>
					<p className="text-muted-foreground">
						Everything you need to know about switching to Thorbis
					</p>
				</div>

				<Card className={cn("border-2", config.cardStyle)}>
					<CardContent className="p-6 sm:p-8">
						<Accordion collapsible type="single">
							{competitor.faq.map((item, index) => (
								<AccordionItem
									className="border-border/50"
									key={item.question}
									value={`competitor-faq-${index}`}
								>
									<AccordionTrigger
										className={cn(
											"text-foreground py-4 text-left font-semibold hover:no-underline",
											`hover:${config.accentColor}`,
										)}
									>
										<span className="pr-4">{item.question}</span>
									</AccordionTrigger>
									<AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
										{item.answer}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</CardContent>
				</Card>

				<div
					className={cn(
						"rounded-xl border p-6 text-center",
						config.secondaryColor,
					)}
				>
					<p className="text-muted-foreground">
						Still have questions?{" "}
						<Link
							className={cn(
								"font-semibold underline-offset-4 hover:underline",
								config.accentColor,
							)}
							href="/contact"
						>
							Talk to our migrations team
						</Link>
					</p>
				</div>
			</section>

			{/* Final CTA - New */}
			<section
				className={cn(
					"relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br p-8 text-center sm:p-12 lg:p-16",
					config.ctaGradient,
				)}
			>
				<div
					className={cn(
						"absolute top-0 right-0 -z-10 size-96 rounded-full blur-3xl",
						config.secondaryColor,
					)}
				/>
				<div
					className={cn(
						"absolute bottom-0 left-0 -z-10 size-96 rounded-full blur-3xl",
						config.secondaryColor,
					)}
				/>

				<div className="relative mx-auto max-w-3xl space-y-6">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
						Ready to make the switch?
					</h2>
					<p className="text-muted-foreground text-lg text-balance">
						Join hundreds of service companies who've upgraded from{" "}
						{competitor.competitorName} to Thorbis. Get enterprise features,
						transparent pricing, and dedicated support—without the hassle.
					</p>

					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
						<Button asChild className="group" size="lg">
							<Link href="/waitlist">
								Start your 14-day free trial
								<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
							</Link>
						</Button>
						<Button asChild size="lg" variant="outline">
							<Link href="/contact">Schedule a demo</Link>
						</Button>
					</div>

					<div className="border-border/50 flex flex-wrap items-center justify-center gap-6 border-t pt-6">
						<div className="flex items-center gap-2">
							<Check className={cn("size-5", config.accentColor)} />
							<span className="text-muted-foreground text-sm">
								30-45 day migration
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Check className={cn("size-5", config.accentColor)} />
							<span className="text-muted-foreground text-sm">
								Zero downtime
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Check className={cn("size-5", config.accentColor)} />
							<span className="text-muted-foreground text-sm">
								No risk, cancel anytime
							</span>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

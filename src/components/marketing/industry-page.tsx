import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { RelatedContent } from "@/components/seo/related-content";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MarketingIndustryContent } from "@/lib/marketing/types";
import { getRelatedIndustries } from "@/lib/seo/content-recommendations";
import { getMarketingIcon } from "./marketing-icons";

type IndustryPageProps = {
	industry: MarketingIndustryContent;
};

export function IndustryPage({ industry }: IndustryPageProps) {
	return (
		<div className="space-y-16">
			{/* Enhanced Hero Section with Image */}
			<section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background">
				<div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
					<div className="space-y-6 px-6 py-12 sm:px-10 lg:px-16">
						<Badge className="bg-primary/20 text-primary px-4 py-1.5 font-semibold">
							{industry.heroEyebrow}
						</Badge>
						<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
							{industry.heroTitle}
						</h1>
						<p className="text-muted-foreground text-lg leading-relaxed">
							{industry.heroDescription}
						</p>
						<div className="flex flex-wrap gap-3">
							<Button asChild size="lg" className="shadow-lg">
								<Link href={industry.primaryCta.href}>
									{industry.primaryCta.label}
									<ArrowRight className="ml-2 size-4" />
								</Link>
							</Button>
							{industry.secondaryCta ? (
								<Button asChild size="lg" variant="outline">
									<Link href={industry.secondaryCta.href}>
										{industry.secondaryCta.label}
									</Link>
								</Button>
							) : null}
						</div>
						<div className="flex flex-wrap gap-2">
							{industry.fieldTypes.map((type) => (
								<Badge key={type} variant="secondary" className="bg-primary/10 text-primary">
									{type}
								</Badge>
							))}
						</div>
					</div>
					<div className="relative hidden h-full min-h-[400px] lg:block">
						{industry.heroImage ? (
							<Image
								alt={industry.heroTitle}
								className="object-cover"
								fill
								priority
								sizes="480px"
								src={industry.heroImage}
							/>
						) : (
							<div className="bg-primary/10 absolute inset-0 flex items-center justify-center">
								<span className="text-6xl">🚀</span>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Summary and Pain Points */}
			<section className="grid gap-8 lg:grid-cols-2">
				<Card className="border-primary/20">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-2xl">
							<div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
								<Check className="text-primary size-5" />
							</div>
							Operate with Confidence
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground leading-relaxed">
							{industry.summary}
						</p>
					</CardContent>
				</Card>

				<Card className="border-orange-500/20">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-2xl">
							<div className="bg-orange-500/10 flex size-10 items-center justify-center rounded-lg">
								<svg className="size-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
							</div>
							Industry Challenges
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-3">
							{industry.painPoints.map((pain) => (
								<li className="flex gap-3" key={pain}>
									<div className="bg-orange-500/10 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
										<span className="text-orange-600 dark:text-orange-400 text-xs">!</span>
									</div>
									<span className="text-muted-foreground text-sm leading-relaxed">{pain}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</section>

			{/* Value Propositions */}
			<section className="space-y-8">
				<div className="text-center">
					<Badge className="mb-4" variant="secondary">
						Capabilities
					</Badge>
					<h2 className="text-3xl font-bold tracking-tight">Tailored to Your Industry</h2>
					<p className="text-muted-foreground mx-auto mt-2 max-w-2xl">
						Purpose-built features that solve {industry.name.toLowerCase()} challenges
					</p>
				</div>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{industry.valueProps.map((prop) => {
						const Icon = getMarketingIcon(prop.icon);
						return (
							<Card
								className="border-primary/10 group relative overflow-hidden transition-all hover:shadow-lg hover:border-primary/30"
								key={prop.title}
							>
								<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
								<CardHeader className="relative">
									<div className="bg-primary/10 group-hover:bg-primary/20 mb-4 flex size-12 items-center justify-center rounded-xl transition-colors">
										<Icon
											aria-hidden="true"
											className="text-primary size-6"
										/>
									</div>
									<CardTitle className="text-lg">{prop.title}</CardTitle>
								</CardHeader>
								<CardContent className="relative">
									<CardDescription className="text-sm leading-relaxed">
										{prop.description}
									</CardDescription>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>

			{/* Playbook and Stats */}
			<section className="grid gap-8 lg:grid-cols-2">
				<Card className="border-primary/20">
					<CardHeader>
						<Badge className="mb-2 w-fit" variant="secondary">
							Best Practices
						</Badge>
						<CardTitle className="text-2xl">Playbook Highlights</CardTitle>
						<CardDescription>
							Proven workflows from successful {industry.name.toLowerCase()}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{industry.playbook.map((item, index) => (
								<div className="space-y-2" key={item.title}>
									<div className="flex items-start gap-3">
										<div className="bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-lg">
											<span className="text-primary text-sm font-bold">{index + 1}</span>
										</div>
										<div>
											<h3 className="text-foreground font-semibold">{item.title}</h3>
											<p className="text-muted-foreground mt-1 text-sm leading-relaxed">
												{item.description}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-primary/5 to-background border-primary/20">
					<CardHeader>
						<Badge className="mb-2 w-fit" variant="secondary">
							Real Results
						</Badge>
						<CardTitle className="text-2xl">Proven Outcomes</CardTitle>
						<CardDescription>
							Average improvements across {industry.name.toLowerCase()}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							{industry.stats.map((stat) => (
								<div
									className="bg-background rounded-xl border border-primary/10 p-4 shadow-sm"
									key={stat.label}
								>
									<p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
										{stat.label}
									</p>
									<p className="text-primary my-1 text-3xl font-bold">
										{stat.value}
									</p>
									<p className="text-muted-foreground text-xs leading-relaxed">
										{stat.description}
									</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</section>

			{/* Testimonial */}
			{industry.testimonial ? (
				<section className="relative overflow-hidden rounded-3xl border bg-gradient-to-r from-primary/10 via-primary/5 to-background p-12">
					<div className="absolute right-8 top-8 text-8xl text-primary/10">
						&ldquo;
					</div>
					<div className="relative mx-auto max-w-3xl text-center">
						<div className="mb-6 flex justify-center">
							<div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
								<svg className="text-primary size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
								</svg>
							</div>
						</div>
						<blockquote className="text-foreground mb-6 text-2xl font-medium leading-relaxed">
							"{industry.testimonial.quote}"
						</blockquote>
						<div>
							<p className="text-foreground font-semibold">{industry.testimonial.attribution}</p>
							{industry.testimonial.role && (
								<p className="text-muted-foreground text-sm">{industry.testimonial.role}</p>
							)}
						</div>
					</div>
				</section>
			) : null}

			{/* Related Industries */}
			<RelatedContent
				title="Explore Other Industries"
				description="See how Thorbis serves other service industries"
				items={getRelatedIndustries(industry.slug, 3)}
				variant="grid"
				showDescription={true}
			/>

			{/* FAQ Section */}
			<section className="space-y-6">
				<div className="text-center">
					<Badge className="mb-4" variant="secondary">
						FAQ
					</Badge>
					<h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
					<p className="text-muted-foreground mx-auto mt-2 max-w-2xl">
						Common questions about Thorbis for {industry.name.toLowerCase()}
					</p>
				</div>
				<div className="mx-auto max-w-3xl">
					<Accordion className="w-full" collapsible type="single">
						{industry.faq.map((item, index) => (
							<AccordionItem key={item.question} value={`industry-faq-${index}`}>
								<AccordionTrigger className="text-left font-semibold">
									{item.question}
								</AccordionTrigger>
								<AccordionContent className="text-muted-foreground leading-relaxed">
									{item.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</section>

			{/* Final CTA */}
			<section className="from-primary/10 via-primary/5 to-primary/10 rounded-2xl border bg-gradient-to-r p-10 text-center">
				<Badge className="mb-4" variant="secondary">
					Ready to Get Started?
				</Badge>
				<h2 className="mb-3 text-3xl font-semibold">
					Join {industry.name} Teams Using Thorbis
				</h2>
				<p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg">
					See why field service teams choose Thorbis for their operations. Free 30-day trial. No credit card required. Cancel anytime.
				</p>
				<div className="mb-8 flex flex-wrap justify-center gap-4">
					<Button asChild className="shadow-lg" size="lg">
						<Link href="/register">
							Start Your Free Trial
							<ArrowRight className="ml-2 size-4" />
						</Link>
					</Button>
					<Button asChild size="lg" variant="outline">
						<Link href="/demo">See Thorbis in Action</Link>
					</Button>
					<Button asChild size="lg" variant="outline">
						<Link href="/contact">Talk to Sales</Link>
					</Button>
				</div>
				<div className="flex flex-wrap items-center justify-center gap-6 pt-6">
					<div className="flex items-center gap-2">
						<Check className="text-primary size-5" />
						<span className="text-muted-foreground text-sm">No credit card required</span>
					</div>
					<div className="flex items-center gap-2">
						<Check className="text-primary size-5" />
						<span className="text-muted-foreground text-sm">Cancel anytime</span>
					</div>
					<div className="flex items-center gap-2">
						<Check className="text-primary size-5" />
						<span className="text-muted-foreground text-sm">White-glove onboarding</span>
					</div>
				</div>
			</section>
		</div>
	);
}

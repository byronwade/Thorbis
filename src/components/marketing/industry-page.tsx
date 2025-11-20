import Image from "next/image";
import Link from "next/link";
import { RelatedContent } from "@/components/seo/related-content";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MarketingIndustryContent } from "@/lib/marketing/types";
import { getRelatedIndustries } from "@/lib/seo/content-recommendations";
import { getMarketingIcon } from "./marketing-icons";

type IndustryPageProps = {
	industry: MarketingIndustryContent;
};

export function IndustryPage({ industry }: IndustryPageProps) {
	return (
		<div className="space-y-16">
			<section className="from-secondary/10 via-background to-background overflow-hidden rounded-3xl border bg-gradient-to-r">
				<div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
					<div className="space-y-6 px-6 py-10 sm:px-10 lg:px-16">
						<Badge className="tracking-wide uppercase" variant="outline">
							{industry.heroEyebrow}
						</Badge>
						<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
							{industry.heroTitle}
						</h1>
						<p className="text-muted-foreground text-lg">
							{industry.heroDescription}
						</p>
						<div className="flex flex-wrap gap-3">
							<Button asChild size="lg">
								<Link href={industry.primaryCta.href}>
									{industry.primaryCta.label}
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
								<Badge key={type} variant="secondary">
									{type}
								</Badge>
							))}
						</div>
					</div>
					<div className="relative hidden h-full min-h-[320px] lg:block">
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
							<div className="bg-muted/40 absolute inset-0 flex items-center justify-center">
								<span className="text-6xl">🚀</span>
							</div>
						)}
					</div>
				</div>
			</section>

			<section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
				<div className="bg-muted/20 rounded-2xl border p-8">
					<h2 className="text-xl font-semibold">Operate with confidence</h2>
					<p className="text-muted-foreground mt-4 leading-relaxed">
						{industry.summary}
					</p>
				</div>
				<div className="bg-background rounded-2xl border p-8">
					<h3 className="text-lg font-semibold">Industry challenges</h3>
					<ul className="text-muted-foreground mt-4 space-y-3">
						{industry.painPoints.map((pain) => (
							<li className="flex gap-3" key={pain}>
								<span className="text-primary mt-1">•</span>
								<span>{pain}</span>
							</li>
						))}
					</ul>
				</div>
			</section>

			<section className="space-y-6">
				<h2 className="text-2xl font-semibold">Capabilities tailored to you</h2>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{industry.valueProps.map((prop) => {
						const Icon = getMarketingIcon(prop.icon);
						return (
							<div
								className="bg-muted/20 rounded-2xl border p-6 transition-shadow hover:shadow-md"
								key={prop.title}
							>
								<Icon
									aria-hidden="true"
									className="text-secondary mb-4 size-8"
								/>
								<h3 className="text-lg font-semibold">{prop.title}</h3>
								<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
									{prop.description}
								</p>
							</div>
						);
					})}
				</div>
			</section>

			<section className="grid gap-8 lg:grid-cols-2">
				<div className="bg-background rounded-2xl border p-8">
					<h2 className="text-2xl font-semibold">Playbook highlights</h2>
					<div className="mt-4 space-y-6">
						{industry.playbook.map((item) => (
							<div className="space-y-2" key={item.title}>
								<h3 className="text-lg font-semibold">{item.title}</h3>
								<p className="text-muted-foreground text-sm leading-relaxed">
									{item.description}
								</p>
							</div>
						))}
					</div>
				</div>
				<div className="bg-muted/10 rounded-2xl border p-8">
					<h2 className="text-2xl font-semibold">Proven results</h2>
					<dl className="mt-4 grid gap-4 sm:grid-cols-2">
						{industry.stats.map((stat) => (
							<div
								className="border-secondary/30 bg-background/80 rounded-xl border border-dashed p-4"
								key={stat.label}
							>
								<dt className="text-muted-foreground text-sm font-medium">
									{stat.label}
								</dt>
								<dd className="text-secondary text-2xl font-semibold">
									{stat.value}
								</dd>
								<p className="text-muted-foreground mt-1 text-xs">
									{stat.description}
								</p>
							</div>
						))}
					</dl>
				</div>
			</section>

			{industry.testimonial ? (
				<section className="bg-secondary/10 rounded-3xl border p-10 text-center">
					<p className="text-secondary text-2xl font-semibold">
						“{industry.testimonial.quote}”
					</p>
					<p className="text-muted-foreground mt-4">
						— {industry.testimonial.attribution}
						{industry.testimonial.role
							? `, ${industry.testimonial.role}`
							: null}
					</p>
				</section>
			) : null}

			{/* Related Industries Section */}
			<RelatedContent
				title="Explore Other Industries"
				description="See how Thorbis serves other service industries"
				items={getRelatedIndustries(industry.slug, 3)}
				variant="grid"
				showDescription={true}
			/>

			<section className="space-y-4">
				<h2 className="text-2xl font-semibold">Frequently asked questions</h2>
				<Accordion className="w-full" collapsible type="single">
					{industry.faq.map((item, index) => (
						<AccordionItem key={item.question} value={`industry-faq-${index}`}>
							<AccordionTrigger className="text-left">
								{item.question}
							</AccordionTrigger>
							<AccordionContent className="text-muted-foreground text-sm leading-relaxed">
								{item.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</section>
		</div>
	);
}

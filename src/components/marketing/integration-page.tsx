import Image from "next/image";
import Link from "next/link";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { MarketingIntegrationContent } from "@/lib/marketing/types";
import { getMarketingIcon } from "./marketing-icons";

type IntegrationPageProps = {
	integration: MarketingIntegrationContent;
	related?: MarketingIntegrationContent[];
};

export function IntegrationPage({
	integration,
	related = [],
}: IntegrationPageProps) {
	const PrimaryIcon = getMarketingIcon(
		integration.valueProps[0]?.icon ?? "sparkles",
	);

	return (
		<div className="space-y-16">
			<section className="overflow-hidden rounded-3xl border bg-gradient-to-r from-primary/10 via-background to-background">
				<div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
					<div className="space-y-6 px-6 py-10 sm:px-10 lg:px-16">
						<Badge className="uppercase tracking-wide" variant="secondary">
							{integration.heroEyebrow}
						</Badge>
						<h1 className="text-balance font-bold text-4xl tracking-tight sm:text-5xl">
							{integration.heroTitle}
						</h1>
						<p className="text-lg text-muted-foreground">
							{integration.heroDescription}
						</p>
						<div className="flex flex-wrap gap-3">
							<Button asChild size="lg">
								<Link href={integration.primaryCta.href}>
									{integration.primaryCta.label}
								</Link>
							</Button>
							{integration.secondaryCta ? (
								<Button asChild size="lg" variant="outline">
									<Link href={integration.secondaryCta.href}>
										{integration.secondaryCta.label}
									</Link>
								</Button>
							) : null}
						</div>
						<div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
							<span className="inline-flex items-center gap-2">
								<span className="relative flex size-9 items-center justify-center rounded-full bg-muted">
									<PrimaryIcon
										aria-hidden="true"
										className="size-5 text-primary"
									/>
								</span>
								{integration.partner.name}
							</span>
							<span aria-hidden="true">•</span>
							<Link
								className="text-primary underline-offset-4 hover:underline"
								href={integration.partner.website}
								rel="noopener"
								target="_blank"
							>
								Partner website
							</Link>
						</div>
						<div className="flex flex-wrap gap-2">
							{integration.categories.map((category) => (
								<Badge key={category} variant="outline">
									{category}
								</Badge>
							))}
						</div>
					</div>
					<div className="relative hidden h-full min-h-[320px] lg:block">
						{integration.heroImage ? (
							<Image
								alt={`${integration.name} integration`}
								className="object-cover"
								fill
								priority
								sizes="480px"
								src={integration.heroImage}
							/>
						) : integration.partner.logo ? (
							<div className="flex h-full items-center justify-center bg-background">
								<Image
									alt={integration.partner.name}
									className="max-h-48 w-auto"
									height={240}
									src={integration.partner.logo}
									width={240}
								/>
							</div>
						) : null}
					</div>
				</div>
			</section>

			<section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
				<div className="rounded-2xl border bg-muted/20 p-8">
					<h2 className="font-semibold text-xl">
						Why teams connect {integration.name}
					</h2>
					<p className="mt-4 text-muted-foreground leading-relaxed">
						{integration.summary}
					</p>
				</div>
				<div className="rounded-2xl border bg-background p-8">
					<h3 className="font-semibold text-lg">Key benefits</h3>
					<div className="mt-4 grid gap-4 sm:grid-cols-2">
						{integration.valueProps.map((prop) => {
							const Icon = getMarketingIcon(prop.icon);
							return (
								<div
									className="space-y-2 rounded-xl border bg-muted/20 p-4"
									key={prop.title}
								>
									<Icon aria-hidden="true" className="size-5 text-primary" />
									<h4 className="font-medium">{prop.title}</h4>
									<p className="text-muted-foreground text-sm leading-relaxed">
										{prop.description}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			<section className="grid gap-8 lg:grid-cols-2">
				<div className="rounded-2xl border bg-background p-8">
					<h2 className="font-semibold text-2xl">Popular workflows</h2>
					<div className="mt-4 space-y-6">
						{integration.workflows.map((workflow) => (
							<div className="space-y-2" key={workflow.title}>
								<h3 className="font-semibold text-lg">{workflow.title}</h3>
								<p className="text-muted-foreground text-sm leading-relaxed">
									{workflow.description}
								</p>
								{workflow.steps ? (
									<ul className="list-decimal space-y-1 pl-4 text-muted-foreground text-sm">
										{workflow.steps.map((step) => (
											<li key={step}>{step}</li>
										))}
									</ul>
								) : null}
							</div>
						))}
					</div>
				</div>
				<div className="space-y-6">
					{integration.stats?.length ? (
						<Card>
							<CardHeader>
								<CardTitle>Performance impact</CardTitle>
								<CardDescription>
									Customers report measurable improvements after connecting{" "}
									{integration.name}.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<dl className="grid gap-4 sm:grid-cols-2">
									{integration.stats.map((stat) => (
										<div
											className="rounded-xl border border-primary/30 border-dashed bg-background/80 p-4"
											key={stat.label}
										>
											<dt className="font-medium text-muted-foreground text-sm">
												{stat.label}
											</dt>
											<dd className="font-semibold text-2xl text-primary">
												{stat.value}
											</dd>
											<p className="mt-1 text-muted-foreground text-xs">
												{stat.description}
											</p>
										</div>
									))}
								</dl>
							</CardContent>
						</Card>
					) : null}

					{integration.requirements?.length ? (
						<Card>
							<CardHeader>
								<CardTitle>Requirements</CardTitle>
								<CardDescription>
									Confirm the prerequisites before enabling the integration.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-muted-foreground text-sm">
									{integration.requirements.map((item) => (
										<li className="flex gap-2" key={item}>
											<span className="mt-1 text-primary">•</span>
											<span>{item}</span>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					) : null}

					{integration.resources?.length ? (
						<Card>
							<CardHeader>
								<CardTitle>Resources</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col gap-2">
								{integration.resources.map((resource) => (
									<Button asChild key={resource.href} variant="outline">
										<Link href={resource.href}>{resource.label}</Link>
									</Button>
								))}
							</CardContent>
						</Card>
					) : null}
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="font-semibold text-2xl">Frequently asked questions</h2>
				<Accordion collapsible type="single">
					{integration.faq.map((item, index) => (
						<AccordionItem key={item.question} value={`faq-${index}`}>
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

			{related.length ? (
				<section className="space-y-6">
					<div className="flex items-center justify-between gap-4">
						<h2 className="font-semibold text-2xl">Related integrations</h2>
						<Button asChild variant="ghost">
							<Link href="/integrations">Browse all integrations</Link>
						</Button>
					</div>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{related.map((item) => (
							<IntegrationRelatedCard integration={item} key={item.slug} />
						))}
					</div>
				</section>
			) : null}
		</div>
	);
}

function IntegrationRelatedCard({
	integration,
}: {
	integration: MarketingIntegrationContent;
}) {
	const Icon = getMarketingIcon(integration.valueProps[0]?.icon ?? "sparkles");

	return (
		<Card className="h-full">
			<CardHeader>
				<div className="flex items-center gap-3">
					<span className="rounded-lg bg-muted p-2">
						<Icon aria-hidden="true" className="size-5 text-primary" />
					</span>
					<div>
						<CardTitle className="text-lg">{integration.name}</CardTitle>
						<CardDescription>{integration.partner.name}</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				<p className="text-muted-foreground text-sm leading-relaxed">
					{integration.summary}
				</p>
				<Button asChild variant="outline">
					<Link href={`/integrations/${integration.slug}`}>
						View integration
					</Link>
				</Button>
			</CardContent>
		</Card>
	);
}

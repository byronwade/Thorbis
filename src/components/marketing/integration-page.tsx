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
import type {
	IntegrationDesignVariant,
	MarketingIntegrationContent,
} from "@/lib/marketing/types";
import { cn } from "@/lib/utils";
import { Calculator, CreditCard, Zap } from "lucide-react";
import { getMarketingIcon } from "./marketing-icons";

type IntegrationPageProps = {
	integration: MarketingIntegrationContent;
	related?: MarketingIntegrationContent[];
};

const variantConfig: Record<
	IntegrationDesignVariant,
	{
		heroGradient: string;
		accentColor: string;
		secondaryColor: string;
		icon: React.ReactNode;
		cardStyle: string;
		badgeStyle: string;
		statsStyle: string;
	}
> = {
	accounting: {
		heroGradient:
			"from-green-600/20 via-emerald-500/10 to-transparent dark:from-green-500/30 dark:via-emerald-500/15",
		accentColor: "text-green-600 dark:text-green-400",
		secondaryColor: "bg-green-500/10 border-green-500/20",
		icon: <Calculator className="size-6" />,
		cardStyle:
			"border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5",
		badgeStyle: "bg-green-500/10 text-green-700 dark:text-green-300",
		statsStyle:
			"bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20",
	},
	payments: {
		heroGradient:
			"from-violet-600/20 via-purple-500/10 to-transparent dark:from-violet-500/30 dark:via-purple-500/15",
		accentColor: "text-violet-600 dark:text-violet-400",
		secondaryColor: "bg-violet-500/10 border-violet-500/20",
		icon: <CreditCard className="size-6" />,
		cardStyle:
			"border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-purple-500/5",
		badgeStyle: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
		statsStyle:
			"bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20",
	},
	automation: {
		heroGradient:
			"from-orange-600/20 via-amber-500/10 to-transparent dark:from-orange-500/30 dark:via-amber-500/15",
		accentColor: "text-orange-600 dark:text-orange-400",
		secondaryColor: "bg-orange-500/10 border-orange-500/20",
		icon: <Zap className="size-6" />,
		cardStyle:
			"border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-amber-500/5",
		badgeStyle: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
		statsStyle:
			"bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/20",
	},
};

export function IntegrationPage({
	integration,
	related = [],
}: IntegrationPageProps) {
	const config = variantConfig[integration.designVariant];
	const PrimaryIcon = getMarketingIcon(
		integration.valueProps[0]?.icon ?? "sparkles",
	);

	return (
		<div className="space-y-16">
			{/* Hero Section */}
			<section
				className={cn(
					"relative overflow-hidden rounded-3xl border bg-gradient-to-br",
					config.heroGradient,
				)}
			>
				<div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
					<div className="space-y-6 px-6 py-10 sm:px-10 lg:px-16">
						<Badge className={cn("tracking-wide uppercase", config.badgeStyle)}>
							{integration.heroEyebrow}
						</Badge>
						<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
							{integration.heroTitle}
						</h1>
						<p className="text-muted-foreground text-lg leading-relaxed">
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
						<div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
							<span className="inline-flex items-center gap-2">
								<span
									className={cn(
										"relative flex size-9 items-center justify-center rounded-full",
										config.secondaryColor,
									)}
								>
									<PrimaryIcon
										aria-hidden="true"
										className={cn("size-5", config.accentColor)}
									/>
								</span>
								{integration.partner.name}
							</span>
							<span aria-hidden="true">&bull;</span>
							<Link
								className={cn("underline-offset-4 hover:underline", config.accentColor)}
								href={integration.partner.website}
								rel="noopener"
								target="_blank"
							>
								Partner website
							</Link>
						</div>
						<div className="flex flex-wrap gap-2">
							{integration.categories.map((category) => (
								<Badge
									className={config.badgeStyle}
									key={category}
									variant="outline"
								>
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
							<div
								className={cn(
									"flex h-full items-center justify-center",
									config.secondaryColor,
								)}
							>
								<Image
									alt={integration.partner.name}
									className="max-h-48 w-auto"
									height={240}
									src={integration.partner.logo}
									width={240}
								/>
							</div>
						) : (
							<div
								className={cn(
									"flex h-full items-center justify-center",
									config.secondaryColor,
								)}
							>
								<span className={cn("opacity-50", config.accentColor)}>
									{config.icon}
								</span>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Summary & Value Props */}
			<section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
				<div className={cn("rounded-2xl border p-8", config.cardStyle)}>
					<div className={cn("mb-4", config.accentColor)}>{config.icon}</div>
					<h2 className="text-xl font-semibold">
						Why teams connect {integration.name}
					</h2>
					<p className="text-muted-foreground mt-4 leading-relaxed">
						{integration.summary}
					</p>
				</div>
				<div className="bg-background rounded-2xl border p-8">
					<h3 className="text-lg font-semibold">Key benefits</h3>
					<div className="mt-4 grid gap-4 sm:grid-cols-2">
						{integration.valueProps.map((prop) => {
							const Icon = getMarketingIcon(prop.icon);
							return (
								<div
									className={cn(
										"space-y-2 rounded-xl border p-4 transition-all duration-300 hover:shadow-md",
										config.cardStyle,
									)}
									key={prop.title}
								>
									<Icon
										aria-hidden="true"
										className={cn("size-5", config.accentColor)}
									/>
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

			{/* Workflows & Stats */}
			<section className="grid gap-8 lg:grid-cols-2">
				<div className={cn("rounded-2xl border p-8", config.cardStyle)}>
					<h2 className="text-2xl font-semibold">Popular workflows</h2>
					<div className="mt-4 space-y-6">
						{integration.workflows.map((workflow) => (
							<div className="space-y-2" key={workflow.title}>
								<h3 className="text-lg font-semibold">{workflow.title}</h3>
								<p className="text-muted-foreground text-sm leading-relaxed">
									{workflow.description}
								</p>
								{workflow.steps ? (
									<ul className="text-muted-foreground list-decimal space-y-1 pl-4 text-sm">
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
						<Card className={config.statsStyle}>
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
											className="bg-background/80 rounded-xl border p-4"
											key={stat.label}
										>
											<dt className="text-muted-foreground text-sm font-medium">
												{stat.label}
											</dt>
											<dd
												className={cn("text-2xl font-semibold", config.accentColor)}
											>
												{stat.value}
											</dd>
											<p className="text-muted-foreground mt-1 text-xs">
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
								<ul className="text-muted-foreground space-y-2 text-sm">
									{integration.requirements.map((item) => (
										<li className="flex gap-2" key={item}>
											<span className={cn("mt-1", config.accentColor)}>
												&bull;
											</span>
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

			{/* FAQ */}
			<section className="space-y-4">
				<h2 className="text-2xl font-semibold">Frequently asked questions</h2>
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

			{/* Related Integrations */}
			{related.length ? (
				<section className="space-y-6">
					<div className="flex items-center justify-between gap-4">
						<h2 className="text-2xl font-semibold">Related integrations</h2>
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
	const config = variantConfig[integration.designVariant];
	const Icon = getMarketingIcon(integration.valueProps[0]?.icon ?? "sparkles");

	return (
		<Card className={cn("h-full transition-all hover:shadow-lg", config.cardStyle)}>
			<CardHeader>
				<div className="flex items-center gap-3">
					<span className={cn("rounded-lg p-2", config.secondaryColor)}>
						<Icon aria-hidden="true" className={cn("size-5", config.accentColor)} />
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

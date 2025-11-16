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
import type { MarketingFeatureContent } from "@/lib/marketing/types";
import { getMarketingIcon } from "./marketing-icons";

type FeaturePageProps = {
  feature: MarketingFeatureContent;
};

export function FeaturePage({ feature }: FeaturePageProps) {
  return (
    <div className="space-y-16">
      <section className="overflow-hidden rounded-3xl border bg-gradient-to-r from-primary/10 via-background to-background">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div className="space-y-6 px-6 py-10 sm:px-10 lg:px-16">
            <Badge className="uppercase tracking-wide" variant="secondary">
              {feature.heroEyebrow}
            </Badge>
            <h1 className="text-balance font-bold text-4xl tracking-tight sm:text-5xl">
              {feature.heroTitle}
            </h1>
            <p className="text-lg text-muted-foreground">
              {feature.heroDescription}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={feature.primaryCta.href}>
                  {feature.primaryCta.label}
                </Link>
              </Button>
              {feature.secondaryCta ? (
                <Button asChild size="lg" variant="outline">
                  <Link href={feature.secondaryCta.href}>
                    {feature.secondaryCta.label}
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
          <div className="relative hidden h-full min-h-[320px] lg:block">
            {feature.heroImage ? (
              <Image
                alt={feature.heroTitle}
                className="object-cover"
                fill
                priority
                sizes="480px"
                src={feature.heroImage}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/40">
                <span className="text-6xl">✨</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="rounded-2xl border bg-muted/20 p-8">
          <h2 className="font-semibold text-xl">Why teams choose Thorbis</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {feature.summary}
          </p>
        </div>
        <div className="rounded-2xl border bg-background p-8">
          <h3 className="font-semibold text-lg">Top challenges solved</h3>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            {feature.painPoints.map((pain) => (
              <li className="flex gap-3" key={pain}>
                <span className="mt-1 text-primary">•</span>
                <span>{pain}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-semibold text-2xl">What’s included</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {feature.valueProps.map((prop) => {
            const Icon = getMarketingIcon(prop.icon);
            return (
              <div
                className="rounded-2xl border bg-muted/20 p-6 transition-shadow hover:shadow-md"
                key={prop.title}
              >
                <Icon aria-hidden="true" className="mb-4 size-8 text-primary" />
                <h3 className="font-semibold text-lg">{prop.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  {prop.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border bg-background p-8">
          <h2 className="font-semibold text-2xl">Key workflows</h2>
          <div className="mt-4 space-y-6">
            {feature.workflows.map((workflow) => (
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
        <div className="rounded-2xl border bg-muted/10 p-8">
          <h2 className="font-semibold text-2xl">Performance impact</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {feature.stats.map((stat) => (
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
          {feature.integrations?.length ? (
            <div className="mt-6">
              <p className="font-medium text-muted-foreground text-sm">
                Works with your existing tools
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {feature.integrations.map((integration) => (
                  <Badge key={integration} variant="outline">
                    {integration}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {feature.testimonial ? (
        <section className="rounded-3xl border bg-primary/10 p-10 text-center">
          <p className="font-semibold text-2xl text-primary">
            “{feature.testimonial.quote}”
          </p>
          <p className="mt-4 text-muted-foreground">
            — {feature.testimonial.attribution}
            {feature.testimonial.role ? `, ${feature.testimonial.role}` : null}
          </p>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="font-semibold text-2xl">Frequently asked questions</h2>
        <Accordion className="w-full" collapsible type="single">
          {feature.faq.map((item, index) => (
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
    </div>
  );
}

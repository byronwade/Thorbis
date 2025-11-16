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
import type { MarketingIndustryContent } from "@/lib/marketing/types";
import { getMarketingIcon } from "./marketing-icons";

type IndustryPageProps = {
  industry: MarketingIndustryContent;
};

export function IndustryPage({ industry }: IndustryPageProps) {
  return (
    <div className="space-y-16">
      <section className="overflow-hidden rounded-3xl border bg-gradient-to-r from-secondary/10 via-background to-background">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div className="space-y-6 px-6 py-10 sm:px-10 lg:px-16">
            <Badge className="uppercase tracking-wide" variant="outline">
              {industry.heroEyebrow}
            </Badge>
            <h1 className="text-balance font-bold text-4xl tracking-tight sm:text-5xl">
              {industry.heroTitle}
            </h1>
            <p className="text-lg text-muted-foreground">
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
              <div className="absolute inset-0 flex items-center justify-center bg-muted/40">
                <span className="text-6xl">🚀</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="rounded-2xl border bg-muted/20 p-8">
          <h2 className="font-semibold text-xl">Operate with confidence</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {industry.summary}
          </p>
        </div>
        <div className="rounded-2xl border bg-background p-8">
          <h3 className="font-semibold text-lg">Industry challenges</h3>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            {industry.painPoints.map((pain) => (
              <li className="flex gap-3" key={pain}>
                <span className="mt-1 text-primary">•</span>
                <span>{pain}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-semibold text-2xl">Capabilities tailored to you</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {industry.valueProps.map((prop) => {
            const Icon = getMarketingIcon(prop.icon);
            return (
              <div
                className="rounded-2xl border bg-muted/20 p-6 transition-shadow hover:shadow-md"
                key={prop.title}
              >
                <Icon
                  aria-hidden="true"
                  className="mb-4 size-8 text-secondary"
                />
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
          <h2 className="font-semibold text-2xl">Playbook highlights</h2>
          <div className="mt-4 space-y-6">
            {industry.playbook.map((item) => (
              <div className="space-y-2" key={item.title}>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border bg-muted/10 p-8">
          <h2 className="font-semibold text-2xl">Proven results</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {industry.stats.map((stat) => (
              <div
                className="rounded-xl border border-secondary/30 border-dashed bg-background/80 p-4"
                key={stat.label}
              >
                <dt className="font-medium text-muted-foreground text-sm">
                  {stat.label}
                </dt>
                <dd className="font-semibold text-2xl text-secondary">
                  {stat.value}
                </dd>
                <p className="mt-1 text-muted-foreground text-xs">
                  {stat.description}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {industry.testimonial ? (
        <section className="rounded-3xl border bg-secondary/10 p-10 text-center">
          <p className="font-semibold text-2xl text-secondary">
            “{industry.testimonial.quote}”
          </p>
          <p className="mt-4 text-muted-foreground">
            — {industry.testimonial.attribution}
            {industry.testimonial.role
              ? `, ${industry.testimonial.role}`
              : null}
          </p>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="font-semibold text-2xl">Frequently asked questions</h2>
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

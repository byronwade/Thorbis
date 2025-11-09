import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CompetitorComparison } from "@/lib/marketing/competitors";
import { getMarketingIcon } from "./marketing-icons";

interface CompetitorPageProps {
  competitor: CompetitorComparison;
}

export function CompetitorPage({ competitor }: CompetitorPageProps) {
  return (
    <div className="space-y-16">
      <section className="rounded-3xl border bg-gradient-to-r from-primary/10 via-background to-background p-8 sm:p-12">
        <div className="max-w-3xl space-y-6">
          <Badge className="uppercase tracking-wide" variant="secondary">
            {competitor.heroEyebrow}
          </Badge>
          <h1 className="text-balance font-bold text-4xl tracking-tight sm:text-5xl">
            {competitor.heroTitle}
          </h1>
          <p className="text-lg text-muted-foreground">
            {competitor.heroDescription}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="/demo">Schedule a strategy session</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/contact">Talk to migrations</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="rounded-2xl border bg-background p-8">
          <h2 className="font-semibold text-2xl">
            Why teams switch to Thorbis
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {competitor.summary}
          </p>
          <div className="mt-6 space-y-3">
            {competitor.idealCustomerProfile.map((profile) => (
              <div className="flex gap-3" key={profile}>
                <span className="mt-1 text-primary">•</span>
                <span className="text-muted-foreground text-sm">{profile}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border bg-muted/20 p-8">
          <h3 className="font-semibold text-lg">Thorbis advantages</h3>
          <div className="mt-4 space-y-4">
            {competitor.thorbisAdvantages.map((prop) => {
              const Icon = getMarketingIcon(prop.icon);
              return (
                <div className="flex gap-3" key={prop.title}>
                  <Icon
                    aria-hidden="true"
                    className="mt-1 size-5 text-primary"
                  />
                  <div>
                    <p className="font-medium">{prop.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {prop.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-semibold text-2xl">Feature comparison</h2>
        <div className="overflow-hidden rounded-2xl border">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/40 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Capability</th>
                <th className="px-4 py-3 font-medium text-primary">Thorbis</th>
                <th className="px-4 py-3 font-medium">
                  {competitor.competitorName}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {competitor.comparisonTable.map((row) => (
                <tr className="align-top" key={row.category}>
                  <td className="px-4 py-4 font-medium">{row.category}</td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {row.thorbis}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {row.competitor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-semibold text-2xl">Guided migration plan</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {competitor.migrationPlan.map((phase) => (
            <div
              className="rounded-2xl border bg-muted/20 p-6 transition-shadow hover:shadow-md"
              key={phase.title}
            >
              <h3 className="font-semibold text-lg">{phase.title}</h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                {phase.description}
              </p>
              <ul className="mt-3 space-y-1 text-muted-foreground text-sm">
                {phase.steps.map((step) => (
                  <li className="flex gap-2" key={step}>
                    <span className="mt-1 text-primary">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="rounded-2xl border bg-background p-8">
          <h2 className="font-semibold text-2xl">Pricing & commercial notes</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground text-sm">
            {competitor.pricingNotes.map((note) => (
              <li className="flex gap-3" key={note}>
                <span className="mt-1 text-primary">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
        {competitor.testimonial ? (
          <div className="rounded-2xl border bg-primary/10 p-8 text-center">
            <p className="font-semibold text-primary text-xl">
              “{competitor.testimonial.quote}”
            </p>
            <p className="mt-4 text-muted-foreground">
              — {competitor.testimonial.attribution}
              {competitor.testimonial.role
                ? `, ${competitor.testimonial.role}`
                : null}
            </p>
          </div>
        ) : null}
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-2xl">Frequently asked questions</h2>
        <Accordion collapsible type="single">
          {competitor.faq.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`competitor-faq-${index}`}
            >
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

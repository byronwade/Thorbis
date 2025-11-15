import { ArrowRight, Check, TrendingDown } from "lucide-react";
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
import { getMarketingIcon } from "./marketing-icons";

interface CompetitorPageProps {
  competitor: CompetitorComparison;
}

export function CompetitorPage({ competitor }: CompetitorPageProps) {
  return (
    <div className="space-y-20">
      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 sm:p-12 lg:p-16">
        <div className="-z-10 absolute top-0 right-0 size-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="-z-10 absolute bottom-0 left-0 size-96 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-4xl space-y-8">
          <div className="flex items-center gap-3">
            <Badge
              className="px-4 py-1.5 font-medium uppercase tracking-wide"
              variant="secondary"
            >
              {competitor.heroEyebrow}
            </Badge>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <TrendingDown className="size-4" />
              <span className="font-semibold text-sm">Save 60-70%</span>
            </div>
          </div>

          <h1 className="text-balance font-bold text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            {competitor.heroTitle}
          </h1>

          <p className="text-balance text-lg text-muted-foreground leading-relaxed sm:text-xl">
            {competitor.heroDescription}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button asChild className="group" size="lg">
              <Link href="/register">
                Start 14-day free trial
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Talk to migrations team</Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-6 border-border/50 border-t pt-6">
            <div className="flex items-center gap-2">
              <Check className="size-5 text-green-600 dark:text-green-400" />
              <span className="text-muted-foreground text-sm">
                No multi-year contracts
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-5 text-green-600 dark:text-green-400" />
              <span className="text-muted-foreground text-sm">
                Unlimited office users
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-5 text-green-600 dark:text-green-400" />
              <span className="text-muted-foreground text-sm">
                30-45 day migration
              </span>
            </div>
          </div>

          <div className="rounded-xl border bg-background/60 p-4 backdrop-blur-sm">
            <p className="font-medium text-sm">
              <span className="text-primary">Transparent pricing:</span>{" "}
              <span className="text-foreground">$100/month base</span> +
              pay-as-you-go AI usage. Average customer:{" "}
              <span className="text-foreground">$350-800/month all-in</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Why Switch Section - Enhanced */}
      <section className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card className="border-2 shadow-lg">
          <CardContent className="p-8">
            <div className="mb-6 inline-flex rounded-full bg-primary/10 p-3">
              <ArrowRight className="size-6 text-primary" />
            </div>
            <h2 className="font-bold text-3xl tracking-tight">
              Why teams switch to Thorbis
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {competitor.summary}
            </p>
            <div className="mt-8 space-y-4">
              <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                Perfect for teams who:
              </h3>
              {competitor.idealCustomerProfile.map((profile, index) => (
                <div
                  className="group flex gap-4 rounded-lg border border-transparent p-3 transition-colors hover:border-primary/20 hover:bg-primary/5"
                  key={profile}
                >
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <span className="font-bold text-xs">{index + 1}</span>
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
          <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <h3 className="font-bold text-xl">Thorbis advantages</h3>
            <p className="mt-2 text-muted-foreground text-sm">
              Real benefits backed by data
            </p>
          </div>

          <div className="space-y-3">
            {competitor.thorbisAdvantages.slice(0, 3).map((prop) => {
              const Icon = getMarketingIcon(prop.icon);
              return (
                <Card
                  className="group transition-all hover:border-primary/30 hover:shadow-md"
                  key={prop.title}
                >
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon
                          aria-hidden="true"
                          className="size-5 text-primary transition-colors group-hover:text-primary-foreground"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-sm leading-tight">
                          {prop.title}
                        </p>
                        <p className="line-clamp-3 text-muted-foreground text-xs leading-relaxed">
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
          <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
            Feature comparison
          </h2>
          <p className="text-muted-foreground">
            Real differences that matter for your business
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border-2 shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-gradient-to-r from-muted/60 to-muted/40">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-foreground text-sm uppercase tracking-wide">
                    Capability
                  </th>
                  <th className="bg-primary/5 px-6 py-4 text-left font-bold text-primary text-sm uppercase tracking-wide">
                    Thorbis
                  </th>
                  <th className="px-6 py-4 text-left font-bold text-muted-foreground text-sm uppercase tracking-wide">
                    {competitor.competitorName}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {competitor.comparisonTable.map((row, index) => (
                  <tr
                    className="group transition-colors hover:bg-muted/30"
                    key={row.category}
                  >
                    <td className="px-6 py-5 font-semibold text-foreground text-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs">
                          {index + 1}
                        </div>
                        {row.category}
                      </div>
                    </td>
                    <td className="bg-primary/5 px-6 py-5 text-foreground text-sm leading-relaxed">
                      <div className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-400" />
                        <span>{row.thorbis}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-muted-foreground text-sm leading-relaxed">
                      {row.competitor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border-2 border-green-500/20 bg-green-500/5 p-6 text-center">
          <p className="font-semibold text-foreground">
            <span className="text-green-600 dark:text-green-400">
              Save 60-70%
            </span>{" "}
            on total cost while getting more features and better support
          </p>
        </div>
      </section>

      {/* Migration Plan - Enhanced */}
      <section className="space-y-8">
        <div className="space-y-3 text-center">
          <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
            Guided migration plan
          </h2>
          <p className="text-muted-foreground">
            White-glove migration in 30-45 days, not months
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {competitor.migrationPlan.map((phase, index) => (
            <Card
              className="group relative overflow-hidden border-2 transition-all hover:border-primary/30 hover:shadow-xl"
              key={phase.title}
            >
              <div className="-z-10 absolute top-0 right-0 size-32 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />

              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary text-xl transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    {index + 1}
                  </div>
                  <Badge className="font-medium" variant="secondary">
                    {index === 0
                      ? "Week 1-2"
                      : index === 1
                        ? "Week 3-4"
                        : "Week 5-6"}
                  </Badge>
                </div>

                <h3 className="font-bold text-lg">{phase.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  {phase.description}
                </p>

                <div className="mt-4 space-y-2">
                  {phase.steps.map((step) => (
                    <div className="flex gap-2.5" key={step}>
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
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

        <div className="rounded-xl bg-primary/5 p-6 text-center">
          <p className="font-medium text-foreground">
            Most migrations complete in{" "}
            <span className="text-primary">30-45 days</span> with zero downtime
          </p>
        </div>
      </section>

      {/* Pricing & Testimonial - Enhanced */}
      <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Card className="border-2">
          <CardContent className="p-8">
            <div className="mb-6 inline-flex rounded-full bg-green-500/10 p-3">
              <TrendingDown className="size-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="font-bold text-2xl">Pricing & savings</h2>
            <p className="mt-2 text-muted-foreground text-sm">
              Transparent pricing with no surprises
            </p>

            <div className="mt-6 space-y-4">
              {competitor.pricingNotes.map((note, index) => (
                <div
                  className="group flex gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-green-500/20 hover:bg-green-500/5"
                  key={note}
                >
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                    <Check className="size-4" />
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
          <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
            <div className="-z-10 absolute top-0 right-0 size-64 rounded-full bg-primary/10 blur-3xl" />

            <CardContent className="flex flex-col justify-center p-8 text-center lg:p-12">
              <div className="mb-6 text-6xl text-primary leading-none">"</div>

              <blockquote className="space-y-6">
                <p className="font-semibold text-foreground text-xl leading-relaxed sm:text-2xl">
                  {competitor.testimonial.quote}
                </p>

                <footer className="space-y-2">
                  <div className="mx-auto h-0.5 w-12 bg-primary/20" />
                  <p className="font-semibold text-foreground">
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
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Check className="size-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl">Ready to switch?</h3>
              <p className="mt-2 text-muted-foreground">
                Join hundreds of teams who've made the move to Thorbis
              </p>
              <Button asChild className="mt-6" size="lg">
                <Link href="/register">Start your migration</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* FAQ Section - Enhanced */}
      <section className="space-y-8">
        <div className="space-y-3 text-center">
          <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about switching to Thorbis
          </p>
        </div>

        <Card className="border-2">
          <CardContent className="p-6 sm:p-8">
            <Accordion collapsible type="single">
              {competitor.faq.map((item, index) => (
                <AccordionItem
                  className="border-border/50"
                  key={item.question}
                  value={`competitor-faq-${index}`}
                >
                  <AccordionTrigger className="py-4 text-left font-semibold text-foreground hover:text-primary hover:no-underline">
                    <span className="pr-4">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="rounded-xl border bg-muted/30 p-6 text-center">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <Link
              className="font-semibold text-primary underline-offset-4 hover:underline"
              href="/contact"
            >
              Talk to our migrations team
            </Link>
          </p>
        </div>
      </section>

      {/* Final CTA - New */}
      <section className="relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 text-center sm:p-12 lg:p-16">
        <div className="-z-10 absolute top-0 right-0 size-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="-z-10 absolute bottom-0 left-0 size-96 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-3xl space-y-6">
          <h2 className="font-bold text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            Ready to make the switch?
          </h2>
          <p className="text-balance text-lg text-muted-foreground">
            Join hundreds of service companies who've upgraded from{" "}
            {competitor.competitorName} to Thorbis. Get enterprise features,
            transparent pricing, and dedicated support—without the hassle.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Button asChild className="group" size="lg">
              <Link href="/register">
                Start your 14-day free trial
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Schedule a demo</Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 border-border/50 border-t pt-6">
            <div className="flex items-center gap-2">
              <Check className="size-5 text-green-600 dark:text-green-400" />
              <span className="text-muted-foreground text-sm">
                30-45 day migration
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-5 text-green-600 dark:text-green-400" />
              <span className="text-muted-foreground text-sm">
                Zero downtime
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-5 text-green-600 dark:text-green-400" />
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

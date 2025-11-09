import Script from "next/script";
import Link from "next/link";

import { RoiCalculator } from "@/components/marketing/roi-calculator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
  generateMetadata as generateSEOMetadata,
  siteUrl,
} from "@/lib/seo/metadata";
import { createHowToSchema } from "@/lib/seo/structured-data";

export const revalidate = 1800;

export const metadata = generateSEOMetadata({
  title: "ROI Calculator for Field Service Teams",
  section: "Resources",
  description:
    "Estimate the ROI of switching to Thorbis. Calculate labor savings, revenue lift, and net impact with AI automation, streamlined dispatch, and better close rates.",
  path: "/roi",
  keywords: [
    "field service roi calculator",
    "servicetitan roi alternative",
    "thorbis savings estimate",
  ],
});

const FAQS = [
  {
    question: "Is the ROI calculator customizable for my business?",
    answer:
      "Yes. Update technician count, job volume, ticket size, and time savings. We use conservative assumptions based on averages from Thorbis customers.",
  },
  {
    question: "What costs should I include when comparing platforms?",
    answer:
      "Consider software subscriptions, payment fees, manual labor time, add-ons for AI or marketing, and lost revenue from missed opportunities or slow follow-up.",
  },
  {
    question: "Can I share the ROI model with stakeholders?",
    answer:
      "Export the estimate as a CSV and share it with your team. Once you create an account, our success team can tailor forecasts using your real usage data.",
  },
  {
    question: "How accurate is the projected revenue lift?",
    answer:
      "Estimates stem from median customer improvements after enabling AI booking, automated follow-up, and better dispatch utilization. Your results may vary, but the calculator stays conservative.",
  },
];

const howToSchema = createHowToSchema({
  name: "How to calculate Thorbis ROI",
  steps: [
    {
      name: "Enter current operations data",
      text: "Add your technician count, jobs per day, average ticket, and existing software costs.",
    },
    {
      name: "Estimate efficiency gains",
      text: "Use realistic minutes saved per job and expected close rate improvements from Thorbis automations.",
    },
    {
      name: "Review savings and revenue lift",
      text: "See monthly and annual impact across labor savings, revenue lift, and net ROI after platform cost.",
    },
    {
      name: "Export and validate",
      text: "Download the CSV to share with leadership or request a bespoke ROI session with Thorbis experts.",
    },
  ],
  supplies: ["Technician roster", "Average ticket data", "Software invoices"],
  totalTime: "PT5M",
});

const breadcrumbLd = generateBreadcrumbStructuredData([
  { name: "Home", url: siteUrl },
  { name: "ROI Calculator", url: `${siteUrl}/roi` },
]);

const faqLd = generateFAQStructuredData(FAQS);

export default function RoiPage() {
  return (
    <>
      <Script
        id="roi-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="roi-howto-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <Script
        id="roi-faq-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-4xl space-y-6 text-center">
          <Badge className="uppercase tracking-wide" variant="secondary">
            ROI Calculator
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Quantify the ROI of switching to Thorbis
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Use your real numbers to project labor savings, net-new revenue, and net ROI after Thorbis replaces your legacy field service stack. Thorbis pricing starts at $100/month with pay-as-you-go usage—no per-user fees and absolutely no lock-in.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/register">Create your account</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/switch">Explore migration program</Link>
            </Button>
          </div>
        </header>

        <main className="mt-16 space-y-20">
          <section>
            <RoiCalculator />
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "AI drives higher close rates",
                description:
                  "Thorbis AI assistant books more jobs after hours and keeps leads warm with automated follow-up, improving conversion by 5-12%.",
              },
              {
                title: "Dispatch and technician efficiency",
                description:
                  "Streamlined scheduling, mobile workflows, and digital checklists reduce job cycle time, freeing crews for more revenue work.",
              },
              {
                title: "Consolidate point solutions",
                description:
                  "Replace add-on SMS tools, marketing drip apps, and manual spreadsheets—Thorbis bundles communications, portal, and analytics.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="mx-auto max-w-4xl space-y-4 text-center">
            <h2 className="text-3xl font-semibold">
              Share your ROI analysis with stakeholders
            </h2>
            <p className="text-muted-foreground">
              Export the numbers and pair them with our migration plan to prove the case for change.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/templates?tag=migration">Download migration checklist</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/vs">Compare Thorbis with your current system</Link>
              </Button>
            </div>
          </section>

          <section className="mx-auto max-w-4xl space-y-4">
            <h2 className="text-3xl font-semibold text-center">ROI FAQ</h2>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <Card key={faq.question}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}


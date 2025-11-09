import Script from "next/script";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllCompetitors } from "@/lib/marketing/competitors";
import { generateMetadata as generateSEOMetadata, siteUrl } from "@/lib/seo/metadata";
import {
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
} from "@/lib/seo/metadata";
import { createHowToSchema } from "@/lib/seo/structured-data";

export const revalidate = 1800;

export const metadata = generateSEOMetadata({
  title: "Switch to Thorbis Migration Center",
  section: "Migration",
  description:
    "Plan your move from ServiceTitan, Housecall Pro, Jobber, and other field service tools. Explore Thorbis migration timelines, checklists, and ROI wins.",
  path: "/switch",
  keywords: [
    "switch to thorbis",
    "servicetitan migration",
    "housecall pro upgrade",
    "jobber alternative",
  ],
});

const FAQS = [
  {
    question: "How long does a typical Thorbis migration take?",
    answer:
      "Most teams go live within 30-45 days. We handle data cleanup, import, configuration, and training to minimize internal lift.",
  },
  {
    question: "Which systems can Thorbis migrate from?",
    answer:
      "We offer guided migrations from ServiceTitan, Housecall Pro, Jobber, FieldEdge, Workiz, ServiceM8, and spreadsheets. Custom migrations are available for additional tools.",
  },
  {
    question: "What support do we receive during the migration?",
    answer:
      "Each project includes a migration engineer, solution architect, and success manager. We provide parallel environment testing, live cutover support, and post-launch optimization.",
  },
  {
    question: "Can we keep running our existing system during migration?",
    answer:
      "Yes. We run Thorbis in parallel while you validate data. Once ready, we schedule a cutover window to ensure no jobs are missed.",
  },
];

const howToSchema = createHowToSchema({
  name: "Switch to Thorbis in 45 Days",
  description:
    "Step-by-step plan to migrate your field service operations from legacy platforms to Thorbis.",
  steps: [
    {
      name: "Kickoff & data audit",
      text: "Meet the migration team, gather exports from your current system, and align on goals.",
    },
    {
      name: "Configuration & workflow design",
      text: "Thorbis configures dispatch, automations, and integrations while importing cleaned data.",
    },
    {
      name: "Role-based training",
      text: "Dispatchers, technicians, finance, and leadership complete live enablement sessions.",
    },
    {
      name: "Cutover weekend",
      text: "Run a final validation, switch your team to Thorbis, and monitor KPIs with our specialists.",
    },
  ],
  supplies: ["Data export templates", "Migration checklist", "Training agenda"],
  totalTime: "P45D",
});

const breadcrumbLd = generateBreadcrumbStructuredData([
  { name: "Home", url: siteUrl },
  { name: "Switch to Thorbis", url: `${siteUrl}/switch` },
]);

const faqLd = generateFAQStructuredData(FAQS);

export default function SwitchToThorbisPage() {
  const competitorComparisons = getAllCompetitors()
    .filter((competitor) =>
      ["servicetitan", "housecall-pro", "jobber"].includes(competitor.slug)
    )
    .slice(0, 3);

  return (
    <>
      <Script
        id="switch-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="switch-howto-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <Script
        id="switch-faq-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-4xl space-y-6 text-center">
          <Badge className="uppercase tracking-wide" variant="secondary">
            Migration Program
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Switch to Thorbis with a guided 45-day migration program
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We migrate data, re-engineer workflows, and train your team while you stay focused on customers. Compare migration paths from ServiceTitan, Housecall Pro, Jobber, and more.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/register">Create your account</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/templates?tag=migration">Download checklist</Link>
            </Button>
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Data migration handled for you",
              description:
                "Thorbis engineers export, clean, and import your customers, jobs, pricebooks, and memberships—no spreadsheets or manual re-entry.",
            },
            {
              title: "Workflow redesign included",
              description:
                "Solution architects map current processes and apply AI-enabled best practices so your team adopts Thorbis quickly.",
            },
            {
              title: "Role-based enablement",
              description:
                "Dispatchers, technicians, finance, and leadership receive tailored training, playbooks, and live office hours.",
            },
          ].map((item) => (
            <Card key={item.title} className="border-dashed border-primary/30">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                {item.description}
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-20 space-y-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold">Choose your starting point</h2>
            <p className="mt-3 text-muted-foreground">
              Explore detailed comparison guides for the platforms contractors most often replace with Thorbis.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {competitorComparisons.map((comparison) => (
              <Card key={comparison.slug} className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">
                    Thorbis vs {comparison.competitorName}
                  </CardTitle>
                  <CardDescription>{comparison.summary}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {comparison.thorbisAdvantages.slice(0, 3).map((value) => (
                      <li key={value.title} className="leading-relaxed">
                        <span className="font-semibold text-foreground">
                          {value.title}:
                        </span>{" "}
                        {value.description}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline">
                    <Link href={`/vs/${comparison.slug}`}>
                      Compare with {comparison.competitorName}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-10 lg:grid-cols-[1.15fr_minmax(0,1fr)]">
          <Card className="border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle>Your 45-day migration timeline</CardTitle>
              <CardDescription>
                A guided playbook designed to minimize downtime and accelerate ROI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 text-left text-sm leading-relaxed text-muted-foreground">
                <li>
                  <span className="font-semibold text-foreground">Week 1-2:</span>{" "}
                  Kickoff, data exports, and configuration workshops. Thorbis
                  builds your environment while reconciling data.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Week 3:</span>{" "}
                  Workflow testing in a staging environment, plus dispatcher and
                  technician training with live feedback.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Week 4:</span>{" "}
                  Final data sync, go-live planning, and customer communications.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Week 5-6:</span>{" "}
                  Cutover weekend, daily huddles, KPI tracking, and optimization
                  sessions with Thorbis success coaches.
                </li>
              </ol>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Migration deliverables</CardTitle>
              <CardDescription>
                Every engagement includes the following assets and checkpoints.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>✔️ Dedicated migration engineer & success manager</li>
                <li>✔️ Data cleanup and validation reports</li>
                <li>✔️ Configuration of automations, AI assistant, and portal</li>
                <li>✔️ Role-based training decks & recorded sessions</li>
                <li>✔️ Post-launch KPI dashboard & optimization plan</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="mt-20">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <h2 className="text-3xl font-semibold">Migration FAQ</h2>
            <p className="text-muted-foreground">
              Answers to the most common questions contractors ask when planning their move to Thorbis.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl space-y-4 text-left">
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
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/register">Get started now</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/templates?tag=migration">Get migration checklist</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}


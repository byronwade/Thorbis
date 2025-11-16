import Link from "next/link";
import Script from "next/script";
import { getMarketingIcon } from "@/components/marketing/marketing-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
  generateMetadata as generateSEOMetadata,
  generateServiceStructuredData,
  siteUrl,
} from "@/lib/seo/metadata";
import { createHowToSchema } from "@/lib/seo/structured-data";

export const metadata = generateSEOMetadata({
  title: "Thorbis Implementation & Customer Success",
  section: "Implementation",
  description:
    "Accelerate time-to-value with dedicated migration engineers, AI configuration, and role-based training. Explore onboarding phases and support tiers.",
  path: "/implementation",
  keywords: [
    "thorbis implementation",
    "field service onboarding",
    "customer success program thorbis",
  ],
});

const PHASES = [
  {
    title: "Discovery & blueprint",
    description:
      "We audit current systems, export data, and map workflows to Thorbis modules. The output is a tailored implementation blueprint.",
    bullets: [
      "Kickoff meeting with stakeholders",
      "Data audit & export collection",
      "Success metrics & KPI alignment",
    ],
    icon: "map-pin",
  },
  {
    title: "Configuration & validation",
    description:
      "Thorbis configures dispatch boards, automations, and integrations while cleaning data. Teams validate in a parallel environment.",
    bullets: [
      "Technician, dispatcher, and finance configuration",
      "AI assistant scripts, portal branding, and automations",
      "Staging environment walkthrough & acceptance",
    ],
    icon: "settings",
  },
  {
    title: "Launch & optimization",
    description:
      "Cutover weekend support, role-based training, and KPI monitoring ensure adoption. Success coaches guide optimization.",
    bullets: [
      "Live go-live bridge & daily huddles",
      "Post-launch KPI dashboard reviews",
      "Quarterly business reviews & roadmap alignment",
    ],
    icon: "rocket",
  },
];

const SUPPORT_PACKAGES = [
  {
    name: "Launch Essentials",
    description:
      "Included with every plan. Guided migration, go-live support, and success manager check-ins for the first 60 days.",
    features: [
      "Dedicated migration engineer",
      "Thorbis university training portal",
      "Bi-weekly success calls (first 2 months)",
    ],
  },
  {
    name: "Growth Accelerator",
    description:
      "For teams scaling multi-location operations or adopting advanced automations. Adds change management and analytics coaching.",
    features: [
      "In-depth process redesign workshops",
      "Custom dashboard configuration",
      "Monthly adoption & revenue reviews",
    ],
  },
  {
    name: "Enterprise Elite",
    description:
      "White-glove program with 24/7 support, sandbox environments, and embedded Thorbis specialists.",
    features: [
      "Quarterly onsite optimization sessions",
      "Executive sponsor & named product liaison",
      "Advanced security & integration reviews",
    ],
  },
];

const FAQS = [
  {
    question: "How long does implementation take?",
    answer:
      "Most contractors launch in 45 days or less. Complex, multi-brand deployments may expand to 60 days with phased rollouts.",
  },
  {
    question: "Who is on the Thorbis implementation team?",
    answer:
      "You’ll work with a migration engineer, solution architect, customer success manager, and optional AI strategist depending on your plan.",
  },
  {
    question: "Do you offer onsite training?",
    answer:
      "Yes. Growth Accelerator and Enterprise Elite packages include optional onsite workshops for dispatchers, techs, and leadership.",
  },
  {
    question: "How are integrations handled?",
    answer:
      "Thorbis implementation includes QuickBooks, payment processors, and core integrations. Additional systems leverage our open API or partner network.",
  },
];

const breadcrumbLd = generateBreadcrumbStructuredData([
  { name: "Home", url: siteUrl },
  { name: "Implementation", url: `${siteUrl}/implementation` },
]);

const howToLd = createHowToSchema({
  name: "Thorbis Implementation Playbook",
  description:
    "Three-phase process to migrate, train, and optimize your field service team on Thorbis.",
  steps: PHASES.map((phase, index) => ({
    name: phase.title,
    text: phase.description,
    position: index + 1,
  })),
  supplies: ["Data exports", "Process documentation", "Training roster"],
  totalTime: "P45D",
});

const faqLd = generateFAQStructuredData(FAQS);

const serviceLd = generateServiceStructuredData({
  name: "Thorbis Implementation & Success",
  description:
    "Guided migration and customer success program for field service contractors adopting Thorbis.",
  serviceType: "ImplementationService",
  offers: [
    {
      price: "Included",
      currency: "USD",
      description: "Launch Essentials included with all Thorbis plans.",
    },
    {
      price: "Custom",
      currency: "USD",
      description:
        "Growth Accelerator and Enterprise Elite tailored to your roadmap.",
    },
  ],
});

export default function ImplementationPage() {
  return (
    <>
      <Script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        id="implementation-breadcrumb-ld"
        type="application/ld+json"
      />
      <Script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
        id="implementation-howto-ld"
        type="application/ld+json"
      />
      <Script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        id="implementation-faq-ld"
        type="application/ld+json"
      />
      <Script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
        id="implementation-service-ld"
        type="application/ld+json"
      />

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-4xl space-y-6 text-center">
          <Badge className="uppercase tracking-wide" variant="secondary">
            Implementation & Success
          </Badge>
          <h1 className="text-balance font-bold text-4xl tracking-tight sm:text-5xl">
            Launch Thorbis in 45 days with migration experts by your side
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Dedicated migration engineers, AI strategists, and customer success
            coaches guide your team from day-one planning to long-term
            optimization. Implementation is included in the $100/month base
            subscription with pay-as-you-go usage—no surprise onboarding fees
            and no lock-in.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/register">Create your account</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/switch">Explore migration center</Link>
            </Button>
          </div>
        </header>

        <main className="mt-16 space-y-20">
          <section className="space-y-8">
            <div className="mx-auto max-w-3xl space-y-3 text-center">
              <h2 className="font-semibold text-3xl">
                Three-phase onboarding blueprint
              </h2>
              <p className="text-muted-foreground">
                A proven implementation methodology honed with hundreds of
                contractors moving from ServiceTitan, Housecall Pro, Jobber, and
                custom tools.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {PHASES.map((phase) => {
                const Icon = getMarketingIcon(phase.icon);
                return (
                  <Card
                    className="border-primary/30 bg-primary/5"
                    key={phase.title}
                  >
                    <CardHeader className="space-y-3">
                      <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Icon aria-hidden="true" className="size-6" />
                      </span>
                      <CardTitle className="text-xl">{phase.title}</CardTitle>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {phase.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-muted-foreground text-sm">
                        {phase.bullets.map((bullet) => (
                          <li className="leading-relaxed" key={bullet}>
                            • {bullet}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="space-y-6">
            <div className="mx-auto max-w-3xl space-y-3 text-center">
              <h2 className="font-semibold text-3xl">
                Enablement resources for every role
              </h2>
              <p className="text-muted-foreground">
                Technicians, dispatchers, finance, and leadership receive
                tailored instruction through live sessions and on-demand
                content.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Help Center",
                  description:
                    "Step-by-step guides covering configuration, workflows, and best practices.",
                  href: "/kb",
                  icon: "library",
                },
                {
                  title: "Thorbis University",
                  description:
                    "Role-based training paths with quizzes and certifications.",
                  href: "/templates?tag=training",
                  icon: "graduation-cap",
                },
                {
                  title: "Live office hours",
                  description:
                    "Weekly drop-in sessions with success managers and solution architects.",
                  href: "/webinars",
                  icon: "calendar-check",
                },
                {
                  title: "Community Forum",
                  description:
                    "Share playbooks, ask peers, and access customer-only templates.",
                  href: "/community",
                  icon: "users",
                },
              ].map((resource) => {
                const Icon = getMarketingIcon(resource.icon);
                return (
                  <Card key={resource.title}>
                    <CardHeader className="space-y-3">
                      <span className="inline-flex size-12 items-center justify-center rounded-full bg-muted">
                        <Icon
                          aria-hidden="true"
                          className="size-6 text-primary"
                        />
                      </span>
                      <CardTitle className="text-lg">
                        {resource.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                      <p>{resource.description}</p>
                      <Button asChild variant="outline">
                        <Link href={resource.href}>Explore</Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="space-y-8">
            <div className="mx-auto max-w-3xl space-y-3 text-center">
              <h2 className="font-semibold text-3xl">
                Success packages designed for every growth stage
              </h2>
              <p className="text-muted-foreground">
                Choose the support level that matches your expansion plans. All
                packages include proactive guidance and metrics reviews.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {SUPPORT_PACKAGES.map((pkg) => (
                <Card className="flex flex-col" key={pkg.name}>
                  <CardHeader>
                    <Badge className="w-fit" variant="secondary">
                      {pkg.name}
                    </Badge>
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {pkg.description}
                    </p>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      {pkg.features.map((feature) => (
                        <li key={feature}>✔️ {feature}</li>
                      ))}
                    </ul>
                    <Button asChild variant="outline">
                      <Link href="/register">Get started</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <Card className="bg-primary/5">
              <CardContent className="flex h-full flex-col justify-center space-y-4 p-8">
                <p className="font-semibold text-lg text-primary uppercase tracking-wide">
                  Customer spotlight
                </p>
                <p className="font-semibold text-2xl">
                  “Thorbis migrated our multi-branch ServiceTitan deployment in
                  42 days. Dispatchers were live day one, and AI booking added
                  11% more jobs in the first month.”
                </p>
                <p className="text-muted-foreground">
                  — Leslie Warren, COO, Elevate Mechanical
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  Implementation KPI targets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground text-sm">
                <p>✔️ Go-live readiness checklist completed within 30 days</p>
                <p>✔️ Dispatch adoption {">"} 90% within first week</p>
                <p>✔️ AI assistant handling 40% of incoming calls by week six</p>
                <p>
                  ✔️ Customer portal activation rate surpassing 60% after
                  training campaign
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="mx-auto max-w-4xl space-y-6 text-center">
            <h2 className="font-semibold text-3xl">Implementation FAQ</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {FAQS.map((faq) => (
                <Card key={faq.question}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/register">Start implementation planning</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/free-tools">Download rollout templates</Link>
              </Button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

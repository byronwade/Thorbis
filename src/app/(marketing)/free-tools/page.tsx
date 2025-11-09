import Script from "next/script";
import Link from "next/link";

import { ResourceCard } from "@/components/content/resource-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getResourceItems } from "@/lib/content/resources";
import {
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
  generateMetadata as generateSEOMetadata,
  siteUrl,
} from "@/lib/seo/metadata";

export const revalidate = 900;

export const metadata = generateSEOMetadata({
  title: "Free Field Service Tools & Templates",
  section: "Resources",
  description:
    "Download field service templates, ROI calculators, webinar replays, and knowledge base guides to modernize your operations.",
  path: "/free-tools",
  keywords: [
    "field service templates",
    "free field service tools",
    "thorbis resources",
  ],
});

const FAQS = [
  {
    question: "Are these tools really free?",
    answer:
      "Yes. Templates, checklists, and calculators are free to download. Some webinars may require registration for access, but there is no cost.",
  },
  {
    question: "Can I share these templates with my team?",
    answer:
      "Absolutely. We encourage you to adapt the templates for your operations and share them with dispatchers, technicians, and leadership.",
  },
  {
    question: "Do I need to be a Thorbis customer?",
    answer:
      "No. These resources help any field service company streamline operations. Thorbis customers receive additional guided onboarding resources.",
  },
];

const ITEM_LIST_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Thorbis Free Field Service Tools",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "ROI Calculator",
      url: `${siteUrl}/roi`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Migration Checklist",
      url: `${siteUrl}/templates?tag=migration`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "QuickBooks Sync Guide",
      url: `${siteUrl}/kb/user-guides/quickbooks-sync`,
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "AI Call Handling Webinar",
      url: `${siteUrl}/webinars`,
    },
  ],
};

const breadcrumbLd = generateBreadcrumbStructuredData([
  { name: "Home", url: siteUrl },
  { name: "Free Tools", url: `${siteUrl}/free-tools` },
]);

const faqLd = generateFAQStructuredData(FAQS);

export default async function FreeToolsPage() {
  const [templatesResult, guidesResult, webinarsResult] = await Promise.allSettled(
    [
      getResourceItems({ limit: 6, type: "template" }),
      getResourceItems({ limit: 6, type: "guide" }),
      getResourceItems({ limit: 3, type: "webinar" }),
    ]
  );

  const templates =
    templatesResult.status === "fulfilled" ? templatesResult.value.data : [];
  const guides =
    guidesResult.status === "fulfilled" ? guidesResult.value.data : [];
  const webinars =
    webinarsResult.status === "fulfilled" ? webinarsResult.value.data : [];

  return (
    <>
      <Script
        id="free-tools-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="free-tools-list-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ITEM_LIST_LD) }}
      />
      <Script
        id="free-tools-faq-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-4xl space-y-6 text-center">
          <Badge className="uppercase tracking-wide" variant="secondary">
            Free Resources
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Download templates, calculators, and guides built for contractors
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Explore battle-tested tools from Thorbis customers—covering operations, finance, training, and marketing. No paywall, no fluff.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/templates">Browse all templates</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/roi">Estimate your ROI</Link>
            </Button>
          </div>
        </header>

        <main className="mt-16 space-y-20">
          <section className="space-y-6">
            <div className="flex flex-col gap-3 text-center">
              <h2 className="text-3xl font-semibold">Popular templates & checklists</h2>
              <p className="text-muted-foreground">
                Import-ready spreadsheets and PDF resources to accelerate onboarding and process improvements.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((item) => (
                <ResourceCard key={item.id} item={item} />
              ))}
            </div>
            <div className="flex justify-center">
              <Button asChild variant="outline">
                <Link href="/templates">See all templates & downloads</Link>
              </Button>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-3 text-center">
              <h2 className="text-3xl font-semibold">Calculators & quick estimators</h2>
              <p className="text-muted-foreground">
                Quantify the business impact of AI call handling, automation, and streamlined operations.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  title: "ROI Calculator",
                  description:
                    "Project net-new revenue, labor savings, and ROI when replacing legacy tools with Thorbis.",
                  href: "/roi",
                },
                {
                  title: "Migration Checklist",
                  description:
                    "Download the migration punch list to plan exports, training, and Thorbis configuration.",
                  href: "/templates?tag=migration",
                },
                {
                  title: "AI Call Handling Playbook",
                  description:
                    "Use our knowledge base guide to script AI appointments, escalation paths, and after-hours coverage.",
                  href: "/kb/user-guides",
                },
              ].map((tool) => (
                <Card key={tool.title}>
                  <CardHeader>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                    <p>{tool.description}</p>
                    <Button asChild variant="outline">
                      <Link href={tool.href}>Access resource</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-3 text-center">
              <h2 className="text-3xl font-semibold">Implementation guides</h2>
              <p className="text-muted-foreground">
                Deep dives on QuickBooks sync, AI automation, and rollout best practices.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {guides.map((item) => (
                <ResourceCard key={item.id} item={item} showImage={false} />
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-3 text-center">
              <h2 className="text-3xl font-semibold">On-demand webinars</h2>
              <p className="text-muted-foreground">
                Watch product walkthroughs, customer success stories, and AI strategy sessions.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {webinars.map((item) => (
                <ResourceCard key={item.id} item={item} />
              ))}
            </div>
            <div className="flex justify-center">
              <Button asChild variant="outline">
                <Link href="/webinars">Browse webinar library</Link>
              </Button>
            </div>
          </section>

          <section className="space-y-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-semibold">Stay ahead with the Thorbis help center</h2>
              <p className="text-muted-foreground">
                Our knowledge base covers configuration, best practices, and troubleshooting for every module.
              </p>
            </div>
            <Card className="mx-auto max-w-4xl border-dashed border-primary/30 bg-primary/5">
              <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
                <p className="text-lg font-semibold">
                  Looking for something specific?
                </p>
                <p className="text-muted-foreground text-sm max-w-2xl">
                  Search the knowledge base for written walkthroughs or head to the community to ask questions and share wins with peers.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild>
                    <Link href="/kb">Visit Help Center</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/community">Join the Community</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mx-auto max-w-4xl space-y-4">
            <h2 className="text-3xl font-semibold text-center">Free tools FAQ</h2>
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


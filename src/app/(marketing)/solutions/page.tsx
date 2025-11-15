import Link from "next/link";
import Script from "next/script";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFeatureBySlug } from "@/lib/marketing/features";
import type { MarketingValueProp } from "@/lib/marketing/types";
import {
  generateBreadcrumbStructuredData,
  generateMetadata as generateSEOMetadata,
  siteUrl,
} from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata = generateSEOMetadata({
  title: "Solutions for Service Businesses",
  section: "Solutions",
  description:
    "Explore Thorbis solutions for AI call handling, dispatch, field mobility, CRM, payments, and customer experience. Every page ties into SEO-friendly deep dives for trades operators.",
  path: "/solutions",
  keywords: [
    "field service solutions",
    "contractor software modules",
    "thorbis solutions",
    "service business software",
  ],
});

type SolutionGroupConfig = {
  heading: string;
  description: string;
  features: {
    slug: string;
    label: string;
    highlight?: string;
  }[];
};

const SOLUTION_GROUPS: SolutionGroupConfig[] = [
  {
    heading: "Automation & AI",
    description:
      "Book every opportunity and run lifecycle campaigns without adding headcount.",
    features: [
      { slug: "ai-assistant", label: "AI Assistant", highlight: "24/7 intake" },
      {
        slug: "marketing",
        label: "Marketing Automation",
        highlight: "Lifecycle journeys",
      },
    ],
  },
  {
    heading: "Operations Control",
    description:
      "Dispatch, CRM, and mobile tools that keep office and field teams perfectly in sync.",
    features: [
      {
        slug: "scheduling",
        label: "Scheduling & Dispatch",
        highlight: "Smart board",
      },
      { slug: "mobile-app", label: "Mobile Field App", highlight: "Offline" },
      { slug: "crm", label: "CRM & Sales", highlight: "Account insights" },
    ],
  },
  {
    heading: "Revenue & Finance",
    description:
      "Invoice faster, sync with accounting, and protect cash flow in one workspace.",
    features: [
      {
        slug: "invoicing",
        label: "Invoicing & Payments",
        highlight: "0% processing",
      },
      {
        slug: "quickbooks",
        label: "QuickBooks Sync",
        highlight: "Two-way data",
      },
    ],
  },
  {
    heading: "Customer Experience",
    description:
      "Give homeowners and commercial clients a premium digital journey from booking to payment.",
    features: [
      {
        slug: "customer-portal",
        label: "Customer Portal",
        highlight: "Self-service",
      },
      {
        slug: "online-booking",
        label: "Online Booking",
        highlight: "Instant scheduling",
      },
    ],
  },
];

const RESOURCE_LINKS = [
  {
    label: "Blog",
    href: "/blog",
    description: "Field-tested growth playbooks and product updates.",
  },
  {
    label: "Case Studies",
    href: "/case-studies",
    description: "Deep dives on dispatch cleanups and cash acceleration.",
  },
  {
    label: "Webinars & Events",
    href: "/webinars",
    description: "Live and on-demand sessions with trade operators.",
  },
  {
    label: "Integrations Directory",
    href: "/integrations",
    description: "Connect CRMs, accounting, and marketing stacks.",
  },
  {
    label: "ROI Calculator",
    href: "/roi",
    description: "Model savings from AI intake, routing, and faster cash.",
  },
  {
    label: "Help Center",
    href: "/help",
    description: "Step-by-step product guides and troubleshooting.",
  },
  {
    label: "API Documentation",
    href: "/api-docs",
    description: "Extend Thorbis with custom workflows and reporting.",
  },
  {
    label: "Community Forum",
    href: "/community",
    description: "Trade operators swap best practices and automations.",
  },
  {
    label: "Templates & Tools",
    href: "/templates",
    description: "Download proposal packs, call scripts, and SOPs.",
  },
  {
    label: "Free Tools Library",
    href: "/free-tools",
    description: "Calculators, checklists, and benchmarking utilities.",
  },
  {
    label: "Reviews & Testimonials",
    href: "/reviews",
    description: "Hear from HVAC, plumbing, electrical, and roofing teams.",
  },
  {
    label: "System Status",
    href: "/status",
    description: "Live uptime and incident history for every service.",
  },
] as const;

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Careers", href: "/careers" },
  { label: "Partners", href: "/partners" },
  { label: "Press & Media", href: "/press" },
  { label: "Contact Sales", href: "/contact" },
  { label: "Create Account", href: "/register" },
  { label: "Implementation & Success", href: "/implementation" },
  { label: "Security", href: "/security" },
] as const;

type SolutionFeature = {
  slug: string;
  label: string;
  highlight?: string;
  heroTitle: string;
  summary: string;
  heroEyebrow?: string;
  valueProps?: MarketingValueProp[];
};

function buildSolutionGroups(): {
  heading: string;
  description: string;
  features: SolutionFeature[];
}[] {
  return SOLUTION_GROUPS.map((group) => {
    const features = group.features.reduce<SolutionFeature[]>((acc, item) => {
      const feature = getFeatureBySlug(item.slug);
      if (!feature) {
        return acc;
      }

      acc.push({
        slug: feature.slug,
        label: item.label,
        highlight: item.highlight,
        heroTitle: feature.heroTitle,
        heroEyebrow: feature.heroEyebrow,
        summary: feature.summary,
        valueProps: feature.valueProps,
      });

      return acc;
    }, []);

    return {
      heading: group.heading,
      description: group.description,
      features,
    };
  }).filter((group) => group.features.length > 0);
}

export default function SolutionsOverviewPage() {
  const solutionGroups = buildSolutionGroups();

  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: solutionGroups
      .flatMap((group) => group.features)
      .map((feature, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: feature.label,
        url: `${siteUrl}/features/${feature.slug}`,
      })),
  };

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData([
              { name: "Home", url: siteUrl },
              { name: "Solutions", url: `${siteUrl}/solutions` },
            ])
          ),
        }}
        id="solutions-breadcrumb-ld"
        type="application/ld+json"
      />
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListStructuredData),
        }}
        id="solutions-item-list-ld"
        type="application/ld+json"
      />
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <header className="mx-auto mb-16 max-w-3xl text-center">
          <Badge className="mb-4" variant="secondary">
            Thorbis Solutions
          </Badge>
          <h1 className="text-balance font-bold text-4xl tracking-tight sm:text-5xl">
            Platform building blocks for modern trades businesses
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Each page below is a pSEO-ready deep dive that matches the intent of
            operators evaluating ServiceTitan, Housecall Pro, and legacy
            toolchains. Choose your path or explore them all.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/register">Create your account</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/pricing">Review pricing</Link>
            </Button>
          </div>
        </header>

        <div className="space-y-14">
          {solutionGroups.map((group) => (
            <section key={group.heading}>
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-primary text-sm uppercase tracking-wide">
                    {group.heading}
                  </p>
                  <h2 className="font-semibold text-2xl text-foreground">
                    {group.description}
                  </h2>
                </div>
                <Link
                  className="font-semibold text-primary text-sm underline underline-offset-4"
                  href="/features"
                >
                  Browse all features
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {group.features.map((feature) => (
                  <Card
                    className="flex h-full flex-col justify-between border-border/70"
                    key={feature.slug}
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{feature.label}</Badge>
                        {feature.highlight ? (
                          <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary text-xs">
                            {feature.highlight}
                          </span>
                        ) : null}
                      </div>
                      {feature.heroEyebrow ? (
                        <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                          {feature.heroEyebrow}
                        </p>
                      ) : null}
                      <CardTitle className="text-2xl">
                        {feature.heroTitle}
                      </CardTitle>
                      <CardDescription>{feature.summary}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
                      {feature.valueProps && feature.valueProps.length > 0 ? (
                        <ul className="space-y-2 text-muted-foreground text-sm">
                          {feature.valueProps.slice(0, 2).map((value) => (
                            <li className="flex gap-2" key={value.title}>
                              <span className="mt-1 text-primary">•</span>
                              <span>
                                <span className="font-semibold">
                                  {value.title}:{" "}
                                </span>
                                {value.description}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <div className="flex flex-wrap gap-3">
                        <Button asChild>
                          <Link href={`/features/${feature.slug}`}>
                            Explore {feature.label}
                          </Link>
                        </Button>
                        <Button asChild variant="ghost">
                          <Link href="/contact">Talk to sales</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-border/60 bg-muted/30 p-8 text-center">
          <p className="font-semibold text-primary text-sm uppercase tracking-wide">
            Switch Programs
          </p>
          <h2 className="mt-2 font-bold text-3xl">
            Moving from ServiceTitan or Housecall Pro?
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Our white-glove team migrates data, recreates automations, and
            enables Dispatch AI in under 24 hours. Keep your workflows, drop the
            bloat.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/switch">Switch to Thorbis</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/vs/servicetitan">Compare ServiceTitan</Link>
            </Button>
          </div>
        </div>

        <section className="mt-20">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <Badge className="mb-4" variant="secondary">
              Resource Library
            </Badge>
            <h2 className="font-bold text-3xl">
              All the research paths your buying committee needs
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Every link below is an SEO-ready landing page with rich content,
              schema markup, and clear CTAs—ideal for programmatic search
              capture.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {RESOURCE_LINKS.map((item) => (
              <Link
                className="rounded-2xl border border-border/60 bg-card/70 p-5 transition hover:border-primary/60 hover:shadow-lg"
                href={item.href}
                key={item.href}
              >
                <p className="font-semibold text-base text-foreground">
                  {item.label}
                </p>
                <p className="mt-2 text-muted-foreground text-sm">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <Badge className="mb-4" variant="secondary">
              Company & Trust
            </Badge>
            <h2 className="font-bold text-3xl">
              Learn about the team behind Thorbis
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Dive into pricing, careers, press, implementation, and security
              resources that buyers, partners, and analysts ask for.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {COMPANY_LINKS.map((item) => (
              <Link
                className="rounded-2xl border border-border/60 bg-background p-5 text-left transition hover:border-primary/60 hover:shadow-lg"
                href={item.href}
                key={item.href}
              >
                <p className="font-semibold text-base text-foreground">
                  {item.label}
                </p>
                <p className="mt-2 text-muted-foreground text-sm">
                  Visit {item.label} →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-background p-10 text-center">
          <p className="font-semibold text-primary text-sm uppercase tracking-wide">
            Ready to build?
          </p>
          <h2 className="mt-2 font-bold text-3xl">
            Create your account or schedule a working session
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Thorbis is $100/month base plus usage, unlimited users, and data
            exports whenever you like. No contracts, no surprise add-ons.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/register">Create account</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Contact sales</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}

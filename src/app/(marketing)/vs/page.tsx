import Link from "next/link";
import Script from "next/script";

import { getAllCompetitors } from "@/lib/marketing/competitors";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import {
  generateBreadcrumbStructuredData,
  siteUrl,
} from "@/lib/seo/metadata";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const revalidate = 3600;

export const metadata = generateSEOMetadata({
  title: "Thorbis vs Legacy Platforms",
  section: "Comparisons",
  description:
    "Compare Thorbis against ServiceTitan, Housecall Pro, Jobber, FieldEdge, ServiceM8, and Workiz. Learn how Thorbis delivers AI-led operations with predictable pricing.",
  path: "/vs",
  keywords: [
    "servicetitan alternative",
    "housecall pro alternative",
    "jobber alternative",
    "fieldedge alternative",
  ],
});

export default function CompetitorOverviewPage() {
  const competitors = getAllCompetitors();

  return (
    <>
      <Script
        id="competitor-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData([
              { name: "Home", url: siteUrl },
              { name: "Comparisons", url: `${siteUrl}/vs` },
            ])
          ),
        }}
      />
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <header className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Competitive Intelligence
          </span>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Choose a partner built for the next decade of field service
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Thorbis delivers AI-powered automation, transparent pricing, and rapid innovation.
            Explore detailed head-to-head comparisons to decide if now is the right time to upgrade.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/demo">Talk through your migration</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Connect with experts</Link>
            </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {competitors.map((competitor) => (
            <Card
              key={competitor.slug}
              className="flex h-full flex-col justify-between transition-shadow hover:shadow-md"
            >
              <CardHeader className="space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <Badge variant="secondary">{competitor.competitorName}</Badge>
                  <span className="text-sm text-muted-foreground">
                    vs Thorbis
                  </span>
                </div>
                <CardTitle className="text-2xl">{competitor.heroTitle}</CardTitle>
                <CardDescription>{competitor.summary}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Ideal for teams who:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {competitor.idealCustomerProfile.slice(0, 2).map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button asChild>
                  <Link href={`/vs/${competitor.slug}`}>
                    Compare with {competitor.competitorName}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}


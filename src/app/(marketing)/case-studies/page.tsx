import Link from "next/link";
import Script from "next/script";
import { ResourceCard } from "@/components/content/resource-card";
import { Button } from "@/components/ui/button";
import { getResourceItems } from "@/lib/content";
import {
  generateBreadcrumbStructuredData,
  generateMetadata as generateSEOMetadata,
  siteUrl,
} from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
  title: "Case Studies",
  section: "Resources",
  description:
    "See how service companies across HVAC, plumbing, and electrical verticals use Thorbis to modernise operations and scale profitably.",
  path: "/case-studies",
  keywords: [
    "field service case study",
    "hvac software success story",
    "plumbing business automation",
  ],
});

interface CaseStudiesPageProps {
  searchParams?: {
    tag?: string;
  };
}

export default async function CaseStudiesPage({
  searchParams,
}: CaseStudiesPageProps) {
  const activeTag = searchParams?.tag;

  const resourcesResult = await getResourceItems({
    type: "case_study",
    tagSlug: activeTag,
    limit: 24,
  });

  const caseStudies = resourcesResult.data;
  const tags = Array.from(
    new Map(
      resourcesResult.data
        .flatMap((item) => item.tags)
        .map((tag) => [tag.id, tag])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData([
              { name: "Home", url: siteUrl },
              { name: "Case Studies", url: `${siteUrl}/case-studies` },
            ])
          ),
        }}
        id="case-studies-breadcrumb-ld"
        type="application/ld+json"
      />
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <header className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center rounded-full border border-border px-3 py-1 font-semibold text-primary text-xs uppercase tracking-wide">
            Customer Proof
          </span>
          <h1 className="mb-6 font-bold text-4xl tracking-tight sm:text-5xl">
            Field Teams Winning with Thorbis
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover how high-performing service companies reduce windshield
            time, improve first-time fix rate, and grow recurring revenue with
            the Thorbis field management platform—all for a $100/month base
            subscription, pay-as-you-go usage, and no lock-in.
          </p>
        </header>

        {tags.length ? (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="sm"
              variant={activeTag ? "outline" : "secondary"}
            >
              <Link href="/case-studies">All industries</Link>
            </Button>
            {tags.map((tag) => {
              const isActive = tag.slug === activeTag;
              return (
                <Button
                  asChild
                  key={tag.id}
                  size="sm"
                  variant={isActive ? "secondary" : "outline"}
                >
                  <Link href={`/case-studies?tag=${tag.slug}`}>
                    #{tag.name}
                  </Link>
                </Button>
              );
            })}
          </div>
        ) : null}

        {caseStudies.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((item) => (
              <ResourceCard item={item} key={item.id} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-muted/20 p-12 text-center">
            <h2 className="mb-3 font-semibold text-xl">
              More stories are on the way
            </h2>
            <p className="text-muted-foreground">
              We&apos;re putting the finishing touches on additional customer
              highlights. Check back soon or connect with our team to learn
              more.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild>
                <Link href="/register">Create your account</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Talk to sales</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

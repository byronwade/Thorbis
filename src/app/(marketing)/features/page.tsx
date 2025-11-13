import Link from "next/link";
import Script from "next/script";
import { getMarketingIcon } from "@/components/marketing/marketing-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllFeatures } from "@/lib/marketing/features";
import {
  generateBreadcrumbStructuredData,
  generateMetadata as generateSEOMetadata,
  siteUrl,
} from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata = generateSEOMetadata({
  title: "Thorbis Platform Features",
  section: "Platform",
  description:
    "Discover every module inside the Thorbis Field Management Platform. From AI-powered call handling to technician mobile apps, Thorbis helps contractors run profitable operations.",
  path: "/features",
  keywords: [
    "field service management features",
    "thorbis platform",
    "contractor software modules",
  ],
});

export default function FeaturesOverviewPage() {
  const features = getAllFeatures();

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData([
              { name: "Home", url: siteUrl },
              { name: "Features", url: `${siteUrl}/features` },
            ])
          ),
        }}
        id="features-breadcrumb-ld"
        type="application/ld+json"
      />
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <header className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center rounded-full border border-border px-3 py-1 font-semibold text-primary text-xs uppercase tracking-wide">
            Thorbis Platform
          </span>
          <h1 className="text-balance font-bold text-4xl tracking-tight sm:text-5xl">
            Everything you need to run a modern service company
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Select a module to explore deep-dive pages for dispatching, CRM,
            inventory, mobile workflows, and more. Build a connected tech stack
            designed for high-growth field operations with transparent
            pricing—$100/month base plus pay-as-you-go usage, unlimited users,
            and no lock-in contracts.
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = getMarketingIcon(
              feature.valueProps[0]?.icon ?? "sparkles"
            );
            return (
              <Card
                className="flex h-full flex-col justify-between transition-shadow hover:shadow-md"
                key={feature.slug}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-3 text-primary">
                    <Icon aria-hidden="true" className="size-8" />
                    <Badge variant="secondary">{feature.name}</Badge>
                  </div>
                  <CardTitle className="text-2xl">
                    {feature.heroTitle}
                  </CardTitle>
                  <CardDescription>{feature.summary}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div>
                    <p className="font-medium text-muted-foreground text-sm">
                      Common challenges solved
                    </p>
                    <ul className="mt-2 space-y-1 text-muted-foreground text-sm">
                      {feature.painPoints.slice(0, 3).map((pain) => (
                        <li className="flex gap-2" key={pain}>
                          <span className="mt-1 text-primary">•</span>
                          <span>{pain}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground text-sm">
                      Highlighted capability
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {feature.valueProps[0]?.title}
                    </p>
                  </div>
                  <Button asChild>
                    <Link href={`/features/${feature.slug}`}>
                      Explore {feature.name}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}

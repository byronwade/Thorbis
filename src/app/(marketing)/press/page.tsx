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
import {
  generateBreadcrumbStructuredData,
  generateMetadata as generateSEOMetadata,
  siteUrl,
} from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
  title: "Thorbis Newsroom & Press Kit",
  description:
    "Access Thorbis press resources, brand assets, executive bios, and latest announcements. Contact our communications team.",
  path: "/press",
  section: "Company",
  keywords: ["thorbis press", "thorbis newsroom", "thorbis brand assets"],
});

const NEWS = [
  {
    title: "Thorbis launches AI Dispatcher for home service companies",
    date: "April 2025",
    link: "#",
    description:
      "First-to-market AI assistant books jobs, triages emergencies, and updates CRMs in real time—helping contractors answer every call.",
  },
  {
    title: "Thorbis announces integration ecosystem with 30+ partners",
    date: "January 2025",
    link: "#",
    description:
      "New partner program enables distributors, software vendors, and consultancies to build on the Thorbis platform.",
  },
  {
    title: "Thorbis secures $30M Series B to accelerate AI roadmap",
    date: "September 2024",
    link: "#",
    description:
      "Funding fuels product development, customer success, and global expansion across North America.",
  },
];

const NEWS_LD = NEWS.map((item) => ({
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline: item.title,
  datePublished: new Date("2025-04-01").toISOString(),
  publisher: {
    "@type": "Organization",
    name: "Thorbis",
    url: siteUrl,
  },
  url: `${siteUrl}/press`,
  description: item.description,
}));

export default function PressPage() {
  return (
    <>
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData([
              { name: "Home", url: siteUrl },
              { name: "Press", url: `${siteUrl}/press` },
            ])
          ),
        }}
        id="press-breadcrumb-ld"
        type="application/ld+json"
      />
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(NEWS_LD),
        }}
        id="press-news-ld"
        type="application/ld+json"
      />
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <section className="max-w-3xl space-y-6">
          <Badge className="uppercase tracking-wide" variant="secondary">
            Thorbis Newsroom
          </Badge>
          <h1 className="font-bold text-4xl tracking-tight sm:text-5xl">
            The latest on Thorbis, our customers, and our product
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Journalists, analysts, and partners can access press releases, brand
            assets, and executive spokespeople. Reach out—we respond quickly.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="mailto:press@thorbis.com">Contact communications</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/press#brand-assets">Download press kit</a>
            </Button>
          </div>
        </section>

        <section className="mt-16 space-y-6">
          <h2 className="font-semibold text-2xl">News & announcements</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {NEWS.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                  <Button asChild className="px-0" variant="link">
                    <a href={item.link}>Read release</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16 space-y-4" id="brand-assets">
          <h2 className="font-semibold text-2xl">Brand & media assets</h2>
          <p className="text-muted-foreground text-sm">
            Download logos, product screenshots, and executive headshots. For
            custom assets, email press@thorbis.com.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border bg-muted/20 p-4">
              <h3 className="font-semibold">Logos</h3>
              <p className="text-muted-foreground text-sm">
                PNG, SVG, and monochrome variations.
              </p>
              <Button className="mt-3" size="sm" variant="outline">
                Download
              </Button>
            </div>
            <div className="rounded-xl border bg-muted/20 p-4">
              <h3 className="font-semibold">Product screenshots</h3>
              <p className="text-muted-foreground text-sm">
                High-resolution UI shots for web and print.
              </p>
              <Button className="mt-3" size="sm" variant="outline">
                Download
              </Button>
            </div>
            <div className="rounded-xl border bg-muted/20 p-4">
              <h3 className="font-semibold">Executive bios</h3>
              <p className="text-muted-foreground text-sm">
                Headshots and biographies for spokespeople.
              </p>
              <Button className="mt-3" size="sm" variant="outline">
                Download
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-16 space-y-3">
          <h2 className="font-semibold text-2xl">Media contacts</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            For interviews, speaking opportunities, or data requests, reach out
            to
            <a
              className="text-primary underline-offset-4 hover:underline"
              href="mailto:press@thorbis.com"
            >
              {" "}
              press@thorbis.com
            </a>{" "}
            or call +1 (415) 555-0112.
          </p>
        </section>
      </div>
    </>
  );
}

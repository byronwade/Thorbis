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
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import {
  generateBreadcrumbStructuredData,
  siteUrl,
} from "@/lib/seo/metadata";

export const revalidate = 900;

export const metadata = generateSEOMetadata({
  title: "Schedule a Thorbis Demo",
  description:
    "See Thorbis in action. Schedule a tailored walkthrough covering AI call handling, dispatch, mobile workflows, and analytics.",
  path: "/demo",
  section: "Company",
  keywords: [
    "thorbis demo",
    "book thorbis walkthrough",
    "thorbis product tour",
  ],
});

const DEMO_OPTIONS = [
  {
    title: "AI operations overview",
    length: "30 minutes",
    description:
      "See how Thorbis AI Assistant answers calls, books jobs, and summarizes conversations. Ideal for owners and call center leaders.",
  },
  {
    title: "Dispatch & scheduling deep dive",
    length: "45 minutes",
    description:
      "Explore drag-and-drop scheduling, capacity planning, routing, and technician visibility with live data.",
  },
  {
    title: "Technician mobile and invoicing",
    length: "30 minutes",
    description:
      "Walk through mobile workflows, checklists, photos, proposals, and payments. Perfect for operations and finance leaders.",
  },
];

export default function DemoPage() {
  return (
    <>
      <Script
        id="demo-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData([
              { name: "Home", url: siteUrl },
              { name: "Demo", url: `${siteUrl}/demo` },
            ])
          ),
        }}
      />
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <section className="max-w-3xl space-y-6">
          <Badge variant="secondary" className="uppercase tracking-wide">
            Book a demo
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Experience Thorbis with a tailored walkthrough
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Share your goals and we’ll craft a live demo that shows how Thorbis improves
            booking, dispatch, technician productivity, and customer experience. No
            generic videos—only real workflows using your metrics.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="https://cal.com/thorbis/demo" target="_blank" rel="noopener">
                Pick a time on our calendar
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/contact">Talk to sales</a>
            </Button>
          </div>
        </section>

        <section className="mt-16 space-y-6">
          <h2 className="text-2xl font-semibold">Popular demo agendas</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {DEMO_OPTIONS.map((option) => (
              <Card key={option.title}>
                <CardHeader>
                  <CardTitle>{option.title}</CardTitle>
                  <CardDescription>{option.length}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {option.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border bg-primary/10 p-10 text-center">
          <p className="text-lg text-muted-foreground">
            Already a customer? Visit the Help Center for training resources, live
            webinars, and Office Hours with our success team.
          </p>
          <Button className="mt-6" variant="secondary" asChild>
            <a href="/help">Visit the Help Center</a>
          </Button>
        </section>
      </div>
    </>
  );
}


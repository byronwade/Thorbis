import Script from "next/script";

import { Button } from "@/components/ui/button";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import {
  generateBreadcrumbStructuredData,
  siteUrl,
} from "@/lib/seo/metadata";

export const revalidate = 300;

export const metadata = generateSEOMetadata({
  title: "Thorbis System Status",
  description:
    "View real-time uptime information for Thorbis services, APIs, and integrations.",
  path: "/status",
  section: "Company",
  keywords: [
    "thorbis status",
    "thorbis uptime",
    "thorbis service status",
  ],
});

export default function StatusPage() {
  const statusUrl = "https://status.thorbis.com";

  return (
    <>
      <Script
        id="status-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData([
              { name: "Home", url: siteUrl },
              { name: "System Status", url: `${siteUrl}/status` },
            ])
          ),
        }}
      />
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Thorbis System Status
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          We monitor uptime and incident history for the Thorbis platform. Visit our status
          page for real-time updates.
        </p>
        <Button className="mt-6" size="lg" variant="secondary" asChild>
          <a href={statusUrl} target="_blank" rel="noopener">
            Open status.thorbis.com
          </a>
        </Button>
      </div>
    </>
  );
}


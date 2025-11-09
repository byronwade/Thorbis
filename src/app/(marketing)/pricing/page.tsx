import Script from "next/script";
import { PricingCalculator } from "@/components/pricing/pricing-calculator";
import { SEO_URLS } from "@/lib/seo/config";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import {
  createReviewAggregateSchema,
  createServiceSchema,
  createSoftwareApplicationSchema,
} from "@/lib/seo/structured-data";

export const metadata = generateSEOMetadata({
  title: "Pricing",
  section: "Plans",
  description:
    "$100/month base + pay-as-you-go pricing. No per-user fees. Calculate your exact monthly cost with our interactive pricing calculator. Transparent, scalable pricing for service businesses.",
  path: "/pricing",
  imageAlt: "Thorbis pricing calculator interface",
  keywords: [
    "pricing",
    "cost",
    "subscription",
    "field service management pricing",
    "business software pricing",
    "pay as you go",
    "no per user fees",
  ],
});

export default function PricingPage() {
  return (
    <>
      {/* SoftwareApplication and Service Structured Data */}
      <Script
        id="pricing-software-schema"
        strategy="afterInteractive"
        type="application/ld+json"
      >
        {JSON.stringify(
          createSoftwareApplicationSchema({
            price: {
              amount: "100",
              currency: "USD",
              billingInterval: "MONTH",
            },
            rating: {
              ratingValue: "4.9",
              reviewCount: "327",
              bestRating: "5",
            },
            operatingSystems: ["Web", "iOS", "Android"],
          })
        )}
      </Script>
      <Script
        id="pricing-service-schema"
        strategy="afterInteractive"
        type="application/ld+json"
      >
        {JSON.stringify(
          createServiceSchema({
            name: "Thorbis Field Management Platform",
            description:
              "Comprehensive business management solution for service companies including customer management, job scheduling, invoicing, and more.",
            areaServed: ["United States", "Canada"],
            offers: [
              {
                price: "100",
                currency: "USD",
                description:
                  "Base subscription – includes 5 teams and unlimited jobs.",
              },
              {
                price: "15",
                currency: "USD",
                description:
                  "Add-on: AI job enrichment per technician per month.",
              },
            ],
          })
        )}
      </Script>
      <Script
        id="pricing-review-schema"
        strategy="afterInteractive"
        type="application/ld+json"
      >
        {JSON.stringify(
          createReviewAggregateSchema({
            item: {
              name: "Thorbis Field Management Platform",
              url: `${SEO_URLS.site}/pricing`,
              type: "SoftwareApplication",
            },
            ratingValue: 4.9,
            reviewCount: 327,
          })
        )}
      </Script>
      <PricingCalculator />
    </>
  );
}

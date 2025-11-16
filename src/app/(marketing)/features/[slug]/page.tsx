import { notFound } from "next/navigation";
import Script from "next/script";

import { FeaturePage } from "@/components/marketing/feature-page";
import { getAllFeatures, getFeatureBySlug } from "@/lib/marketing/features";
import {
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
  generateMetadata as generateSEOMetadata,
  generateServiceStructuredData,
  siteUrl,
} from "@/lib/seo/metadata";

type FeaturePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllFeatures().map((feature) => ({ slug: feature.slug }));
}

export async function generateMetadata({ params }: FeaturePageProps) {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);

  if (!feature) {
    return {};
  }

  return generateSEOMetadata({
    title: feature.seo.title,
    section: "Features",
    description: feature.seo.description,
    path: `/features/${feature.slug}`,
    image: feature.seo.image,
    keywords: feature.seo.keywords,
  });
}

export default async function FeatureDetailPage({ params }: FeaturePageProps) {
  const { slug } = await params;
  const feature = getFeatureBySlug(slug);

  if (!feature) {
    notFound();
  }

  const faqStructuredData = generateFAQStructuredData(feature.faq);
  const serviceStructuredData = generateServiceStructuredData({
    name: feature.name,
    description: feature.seo.description,
    offers: [
      {
        price: "Custom",
        currency: "USD",
        description: "Thorbis platform pricing tailored to your operation.",
      },
    ],
  });

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData([
              { name: "Home", url: siteUrl },
              { name: "Features", url: `${siteUrl}/features` },
              {
                name: feature.name,
                url: `${siteUrl}/features/${feature.slug}`,
              },
            ])
          ),
        }}
        id="feature-breadcrumb-ld"
        type="application/ld+json"
      />
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData),
        }}
        id="feature-service-ld"
        type="application/ld+json"
      />
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
        id="feature-faq-ld"
        type="application/ld+json"
      />
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <FeaturePage feature={feature} />
      </div>
    </>
  );
}

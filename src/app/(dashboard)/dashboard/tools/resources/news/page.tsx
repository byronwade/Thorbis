/**
 * Industry News & Blogs Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import { BookOpen, ExternalLink } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function Page() {
  return (
    <ResourcePageTemplate
      title="Industry News & Blogs"
      subtitle="Stay updated with trade publications and industry trends"
      icon={BookOpen}
      description={["Stay informed about industry trends, new technologies, regulations, and business strategies. Follow leading trade publications and industry blogs.","Discover magazines, podcasts, newsletters, and websites that provide valuable insights for contractors in your specific trade."]}
      externalLinks={[
        {
          title: "Getting Started Guide",
          description: "External resource and documentation",
          url: "#",
          icon: ExternalLink,
        },
      ]}
    />
  );
}

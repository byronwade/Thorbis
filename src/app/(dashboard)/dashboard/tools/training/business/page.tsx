/**
 * Business Management Training Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import { GraduationCap, ExternalLink } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function Page() {
  return (
    <ResourcePageTemplate
      title="Business Management Training"
      subtitle="Operations, sales, customer service, and leadership courses"
      icon={GraduationCap}
      description={["Technical skills alone aren't enough to run a successful business. Develop your business management, sales, leadership, and customer service skills.","Explore training programs in financial management, marketing, team building, and operational excellence designed for trade business owners."]}
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

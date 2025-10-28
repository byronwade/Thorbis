/**
 * Trade Certifications Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import { BadgeCheck, ExternalLink } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function Page() {
  return (
    <ResourcePageTemplate
      title="Trade Certifications"
      subtitle="State licensing, master certifications, and specialty credentials"
      icon={BadgeCheck}
      description={["Advance your career and business with professional certifications. From journeyman to master level, certifications demonstrate expertise and command higher rates.","Learn about certification requirements for your trade, testing procedures, and continuing education to maintain credentials."]}
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

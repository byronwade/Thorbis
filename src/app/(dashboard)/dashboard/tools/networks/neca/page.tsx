/**
 * NECA - Electrical Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import { Zap, ExternalLink } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function Page() {
  return (
    <ResourcePageTemplate
      title="NECA - Electrical"
      subtitle="National Electrical Contractors Association"
      icon={Zap}
      description={["NECA represents electrical contractors across the United States. Join to access education programs, safety resources, and industry standards.","Members benefit from apprenticeship training, code update seminars, and networking opportunities with other electrical professionals."]}
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

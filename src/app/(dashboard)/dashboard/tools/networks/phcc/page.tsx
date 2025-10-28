/**
 * PHCC - Plumbing & HVAC Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import { Wrench, ExternalLink } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function Page() {
  return (
    <ResourcePageTemplate
      title="PHCC - Plumbing & HVAC"
      subtitle="Plumbing-Heating-Cooling Contractors Association"
      icon={Wrench}
      description={["PHCC is the oldest trade association in the construction industry, representing plumbing and HVAC contractors since 1883.","Members receive apprenticeship programs, safety training, legislative advocacy, and business development resources."]}
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

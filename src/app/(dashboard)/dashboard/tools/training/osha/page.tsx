/**
 * OSHA Safety Training Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import { Shield, ExternalLink } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function Page() {
  return (
    <ResourcePageTemplate
      title="OSHA Safety Training"
      subtitle="Workplace safety certifications and compliance training"
      icon={Shield}
      description={["OSHA compliance is required for most contractors. OSHA 10 and OSHA 30 training courses cover workplace safety, hazard recognition, and accident prevention.","Learn about OSHA requirements for your trade, find approved training providers, and maintain ongoing safety compliance."]}
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

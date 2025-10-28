/**
 * EPA Certifications Resource Page - Server Component
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
      title="EPA Certifications"
      subtitle="EPA 608 refrigerant handling and environmental certifications"
      icon={Shield}
      description={["EPA Section 608 certification is required for HVAC technicians who work with refrigerants. Learn about Type I, Type II, Type III, and Universal certifications.","Find EPA-approved testing centers, study materials, and understand ongoing compliance requirements for environmental regulations."]}
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

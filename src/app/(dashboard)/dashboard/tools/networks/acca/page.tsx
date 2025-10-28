/**
 * ACCA - HVAC Excellence Resource Page - Server Component
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
      title="ACCA - HVAC Excellence"
      subtitle="Air Conditioning Contractors of America trade association"
      icon={Zap}
      description={["ACCA is the leading trade association for HVAC contractors. Members get access to technical training, business resources, and industry advocacy.","Join ACCA to stay current on industry standards, building codes, and best practices in HVAC installation and service."]}
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

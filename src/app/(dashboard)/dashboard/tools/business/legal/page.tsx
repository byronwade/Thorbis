/**
 * Legal Resources Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import { FileText, ExternalLink } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function Page() {
  return (
    <ResourcePageTemplate
      title="Legal Resources"
      subtitle="Contracts, liability waivers, and legal templates"
      icon={FileText}
      description={["Protect your business with proper legal documents. Service agreements, proposal templates, liability waivers, and payment terms are essential.","Access contractor-specific legal templates and learn when you need to consult with a business attorney."]}
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

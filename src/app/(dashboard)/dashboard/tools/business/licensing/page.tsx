/**
 * Licensing & Permits Resource Page - Server Component
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
      title="Licensing & Permits"
      subtitle="State and local license requirements for trade contractors"
      icon={FileText}
      description={["Every state and locality has different licensing requirements for trade contractors. Ensure you have all necessary licenses and permits before starting work.","Learn about trade-specific licenses (HVAC, plumbing, electrical), general contractor licenses, and ongoing renewal requirements."]}
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

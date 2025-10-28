/**
 * Banking & Payroll Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import { DollarSign, ExternalLink } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function Page() {
  return (
    <ResourcePageTemplate
      title="Banking & Payroll"
      subtitle="Business banking, payroll services, and accounting software"
      icon={DollarSign}
      description={["Separate your business and personal finances with a dedicated business bank account. Set up efficient payroll processing and accounting systems.","Discover the best banking partners for contractors, payroll service providers, and accounting software solutions."]}
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

/**
 * Business Loans & Lines of Credit Resource Page - Server Component
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
      title="Business Loans & Lines of Credit"
      subtitle="Working capital loans, equipment financing, and SBA loans"
      icon={DollarSign}
      description={["Access capital to grow your business, purchase equipment, or smooth out cash flow fluctuations. Multiple financing options are available for trade contractors.","Learn about SBA loans, business lines of credit, equipment financing, and alternative lending options."]}
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

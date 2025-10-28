/**
 * Pricing Calculators Resource Page - Server Component
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
      title="Pricing Calculators"
      subtitle="Job cost estimators, material calculators, and pricing tools"
      icon={Wrench}
      description={["Accurate pricing is critical for profitability. Use online calculators to estimate job costs, material quantities, labor hours, and markup percentages.","Access tools for load calculations (HVAC), pipe sizing (plumbing), voltage drop (electrical), and other trade-specific calculations."]}
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

/**
 * Vendor Directories Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import { Package, ExternalLink } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function Page() {
  return (
    <ResourcePageTemplate
      title="Vendor Directories"
      subtitle="Find suppliers, wholesalers, and equipment dealers"
      icon={Package}
      description={["Build relationships with reliable suppliers and wholesalers. Find equipment dealers, parts distributors, and specialty suppliers in your area.","Compare pricing, delivery options, and account terms from major distributors and local suppliers serving trade contractors."]}
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

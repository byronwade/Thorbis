/**
 * Equipment Financing Resource Page - Server Component
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
      title="Equipment Financing"
      subtitle="Finance trucks, tools, and equipment for your business"
      icon={Wrench}
      description={["Equipment financing allows you to acquire trucks, tools, and specialized equipment without depleting your cash reserves.","Explore lease-to-own options, equipment loans, and vendor financing programs designed for trade contractors."]}
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

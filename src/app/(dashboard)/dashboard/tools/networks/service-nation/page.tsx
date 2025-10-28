/**
 * Service Nation Alliance Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import { Users, ExternalLink } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function Page() {
  return (
    <ResourcePageTemplate
      title="Service Nation Alliance"
      subtitle="Business coaching and peer group network for contractors"
      icon={Users}
      description={["Service Nation Alliance is a business development organization similar to Nexstar, offering coaching, peer groups, and training for home service contractors.","Members benefit from proven business systems, financial benchmarking, and a supportive community of successful contractors."]}
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

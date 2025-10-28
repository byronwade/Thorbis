/**
 * LinkedIn Company Page Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import { Briefcase, ExternalLink } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function Page() {
  return (
    <ResourcePageTemplate
      title="LinkedIn Company Page"
      subtitle="Build professional network and attract commercial clients"
      icon={Briefcase}
      description={["LinkedIn is the premier professional networking platform, ideal for attracting commercial clients and building B2B relationships.","Share industry insights, company updates, and thought leadership content to position your business as an industry expert."]}
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

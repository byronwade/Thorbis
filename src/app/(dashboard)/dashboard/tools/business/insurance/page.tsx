/**
 * Business Insurance Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import { Shield, ExternalLink } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function Page() {
  return (
    <ResourcePageTemplate
      title="Business Insurance"
      subtitle="General liability, workers comp, and commercial auto insurance"
      icon={Shield}
      description={["Proper insurance protection is non-negotiable for trade contractors. General liability, workers compensation, and commercial auto insurance protect your business from financial risk.","We'll help you understand coverage requirements, find competitive quotes, and ensure you're adequately protected."]}
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

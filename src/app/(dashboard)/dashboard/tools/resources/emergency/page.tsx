/**
 * Emergency Services Info Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import { Phone, ExternalLink } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function Page() {
  return (
    <ResourcePageTemplate
      title="Emergency Services Info"
      subtitle="After-hours support, emergency dispatch, and on-call resources"
      icon={Phone}
      description={["Many contractors offer emergency services for premium rates. Learn how to set up after-hours call handling, emergency dispatch, and on-call scheduling.","Discover answering services, dispatch software, and best practices for managing emergency service calls efficiently and profitably."]}
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

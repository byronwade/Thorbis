/**
 * Credit Card Processing Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import { Receipt, ExternalLink } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function Page() {
  return (
    <ResourcePageTemplate
      title="Credit Card Processing"
      subtitle="Accept payments with Square, Stripe, or merchant services"
      icon={Receipt}
      description={["Make it easy for customers to pay you with credit card processing. Accept payments in the field, online, or in your office.","Compare processing fees, equipment costs, and features from major payment processors tailored for service businesses."]}
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

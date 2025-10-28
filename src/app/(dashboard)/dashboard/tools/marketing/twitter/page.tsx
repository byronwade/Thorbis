/**
 * X (Twitter) Business Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import { Hash, ExternalLink } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function Page() {
  return (
    <ResourcePageTemplate
      title="X (Twitter) Business"
      subtitle="Share updates and engage with your community in real-time"
      icon={Hash}
      description={["X (formerly Twitter) is great for sharing quick updates, industry news, and engaging in conversations with customers and other professionals.","Use X to establish thought leadership in your trade and stay connected with your local community."]}
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

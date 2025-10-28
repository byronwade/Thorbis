/**
 * Business Registration Resource Page - Server Component
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
      title="Business Registration"
      subtitle="Register your business entity, EIN, and legal structure"
      icon={Briefcase}
      description={["Properly registering your business is a critical first step. Choose the right business structure (LLC, S-Corp, etc.) and obtain your federal tax ID (EIN).","We'll guide you through the registration process, including state and local requirements specific to trade contractors."]}
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

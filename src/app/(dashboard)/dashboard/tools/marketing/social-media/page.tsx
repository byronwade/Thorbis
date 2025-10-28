/**
 * Social Media Setup Guide Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import { Megaphone, ExternalLink } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function Page() {
  return (
    <ResourcePageTemplate
      title="Social Media Setup Guide"
      subtitle="Complete guide to establishing your social media presence"
      icon={Megaphone}
      description={["Social media is essential for modern businesses. This guide will help you set up profiles across all major platforms and develop a content strategy.","Learn best practices for each platform, content creation tips, and how to manage multiple social media accounts efficiently."]}
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

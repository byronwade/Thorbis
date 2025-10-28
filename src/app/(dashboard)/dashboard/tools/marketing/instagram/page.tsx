/**
 * Instagram for Business Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import { Camera, ExternalLink } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function Page() {
  return (
    <ResourcePageTemplate
      title="Instagram for Business"
      subtitle="Showcase your work and connect with customers through visual content"
      icon={Camera}
      description={["Instagram is a visual-first platform perfect for showcasing your work. With over 1 billion active users, it's an excellent way to attract new customers and build brand awareness.","Share before/after photos, behind-the-scenes content, and customer testimonials to demonstrate your expertise and professionalism."]}
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

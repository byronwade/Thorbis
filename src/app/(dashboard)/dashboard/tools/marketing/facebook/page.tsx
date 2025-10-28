/**
 * Facebook Business Page - Server Component
 */

import { CheckCircle, ExternalLink, Globe, MessageSquare } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function FacebookBusinessPage() {
  return (
    <ResourcePageTemplate
      badge="Popular"
      description={[
        "Facebook remains one of the most powerful platforms for local businesses to connect with customers. With over 2 billion active users, a well-managed Facebook Business Page can help you reach new customers, showcase your work, and build trust in your community.",
        "Setting up a professional Facebook Business Page is free and takes just a few minutes. You'll be able to post updates, respond to customer messages, run targeted advertising campaigns, and collect reviews from satisfied customers.",
      ]}
      externalLinks={[
        {
          title: "Create Facebook Business Page",
          description: "Official guide to setting up your business page",
          url: "https://www.facebook.com/business/pages/set-up",
          icon: Globe,
        },
        {
          title: "Facebook for Business",
          description: "Complete resource center for business owners",
          url: "https://www.facebook.com/business",
          icon: MessageSquare,
        },
      ]}
      icon={MessageSquare}
      sections={[
        {
          title: "Key Features for Trade Businesses",
          description: "What makes Facebook valuable for contractors",
          content: (
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <CheckCircle className="mt-0.5 size-5 text-green-600" />
                <div className="flex-1">
                  <h4 className="font-medium">Local Targeting</h4>
                  <p className="text-muted-foreground text-sm">
                    Run ads targeted to specific zip codes or service areas to reach customers in your market
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <CheckCircle className="mt-0.5 size-5 text-green-600" />
                <div className="flex-1">
                  <h4 className="font-medium">Photo & Video Posts</h4>
                  <p className="text-muted-foreground text-sm">
                    Share before/after photos, project updates, and team videos to showcase your expertise
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <CheckCircle className="mt-0.5 size-5 text-green-600" />
                <div className="flex-1">
                  <h4 className="font-medium">Customer Reviews</h4>
                  <p className="text-muted-foreground text-sm">
                    Build credibility with reviews and recommendations from satisfied customers
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <CheckCircle className="mt-0.5 size-5 text-green-600" />
                <div className="flex-1">
                  <h4 className="font-medium">Messenger Integration</h4>
                  <p className="text-muted-foreground text-sm">
                    Respond to customer inquiries instantly via Facebook Messenger
                  </p>
                </div>
              </div>
            </div>
          ),
        },
      ]}
      subtitle="Set up a professional Facebook page and run targeted ads to reach local customers"
      title="Facebook Business"
    />
  );
}

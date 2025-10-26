"use client";

export const dynamic = "force-dynamic";

import { Hash, Inbox, Users } from "lucide-react";
import { useState } from "react";
import { CompanyFeed } from "@/components/communication/company-feed";
import { usePageLayout } from "@/hooks/use-page-layout";

type ChannelType = "channel" | "dm";

export default function CompanyFeedPage() {
  const [selectedChannel, setSelectedChannel] =
    useState<string>("company-feed");
  const [selectedChannelType, setSelectedChannelType] =
    useState<ChannelType>("channel");

  // Configure layout with channels sidebar
  usePageLayout({
    maxWidth: "full",
    padding: "md",
    gap: "none",
    showToolbar: true,
    sidebar: {
      groups: [
        // Communication Navigation (always visible)
        {
          label: undefined,
          items: [
            {
              mode: "link" as const,
              title: "Inbox",
              url: "/dashboard/communication",
              icon: Inbox,
            },
            {
              mode: "link" as const,
              title: "Company Feed",
              url: "/dashboard/communication/feed",
              icon: Hash,
            },
          ],
        },
        {
          label: "Channels",
          items: [
            {
              mode: "filter" as const,
              title: "# company-feed",
              value: "channel:company-feed",
              icon: Hash,
              count: 127,
            },
            {
              mode: "filter" as const,
              title: "# announcements",
              value: "channel:announcements",
              icon: Hash,
              count: 45,
            },
            {
              mode: "filter" as const,
              title: "# general",
              value: "channel:general",
              icon: Hash,
              count: 89,
            },
            {
              mode: "filter" as const,
              title: "# training",
              value: "channel:training",
              icon: Hash,
              count: 34,
            },
            {
              mode: "filter" as const,
              title: "# field-tips",
              value: "channel:field-tips",
              icon: Hash,
              count: 56,
            },
            {
              mode: "filter" as const,
              title: "# team-building",
              value: "channel:team-building",
              icon: Hash,
              count: 23,
            },
            {
              mode: "filter" as const,
              title: "# safety",
              value: "channel:safety",
              icon: Hash,
              count: 19,
            },
          ],
        },
        {
          label: "Direct Messages",
          items: [
            {
              mode: "filter" as const,
              title: "Sarah Johnson",
              value: "dm:sarah",
              icon: Users,
              count: 3,
            },
            {
              mode: "filter" as const,
              title: "Mike Chen",
              value: "dm:mike",
              icon: Users,
            },
            {
              mode: "filter" as const,
              title: "David Martinez",
              value: "dm:david",
              icon: Users,
              count: 1,
            },
            {
              mode: "filter" as const,
              title: "Emma Rodriguez",
              value: "dm:emma",
              icon: Users,
            },
            {
              mode: "filter" as const,
              title: "Lisa Thompson",
              value: "dm:lisa",
              icon: Users,
            },
          ],
        },
      ],
      defaultValue: "channel:company-feed",
      activeValue: `${selectedChannelType}:${selectedChannel}`,
      onValueChange: (value) => {
        if (value.startsWith("channel:")) {
          const channel = value.replace("channel:", "");
          setSelectedChannel(channel);
          setSelectedChannelType("channel");
        } else if (value.startsWith("dm:")) {
          const dmUser = value.replace("dm:", "");
          setSelectedChannel(dmUser);
          setSelectedChannelType("dm");
        }
      },
    },
  });

  return (
    <CompanyFeed channel={selectedChannel} channelType={selectedChannelType} />
  );
}

"use client";

/**
 * Email Detail Sidebar - Client Component
 *
 * Shows message-specific actions and navigation for email detail view
 *
 * Client-side features:
 * - Back navigation button
 * - Message-specific actions (star, archive, delete, etc.)
 * - Move to folder options
 * - Assign and categorize options
 * - Uses Next.js router for navigation
 * - Updates Zustand store on navigation
 */

import {
  Archive,
  ArrowLeft,
  CheckCircle,
  Flag,
  Forward,
  Mail,
  MailOpen,
  MoreHorizontal,
  Printer,
  Reply,
  ReplyAll,
  Shield,
  Star,
  Tag,
  Trash2,
  User,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { NavGrouped } from "@/components/layout/nav-grouped";
import { useCommunicationStore } from "@/lib/stores/communication-store";

export function EmailDetailSidebar() {
  const router = useRouter();
  const setIsDetailView = useCommunicationStore(
    (state) => state.setIsDetailView
  );
  const setSelectedMessageId = useCommunicationStore(
    (state) => state.setSelectedMessageId
  );

  const handleBack = () => {
    setIsDetailView(false);
    setSelectedMessageId(null);
    router.push("/dashboard/communication");
  };

  // Message-specific action groups
  const navigationGroups = [
    {
      label: undefined,
      items: [
        {
          title: "Back to Messages",
          url: "/dashboard/communication",
          icon: ArrowLeft,
          onClick: handleBack,
        },
      ],
    },
    {
      label: "Quick Actions",
      items: [
        {
          title: "Reply",
          url: "#reply",
          icon: Reply,
        },
        {
          title: "Reply All",
          url: "#reply-all",
          icon: ReplyAll,
        },
        {
          title: "Forward",
          url: "#forward",
          icon: Forward,
        },
        {
          title: "Print",
          url: "#print",
          icon: Printer,
        },
      ],
    },
    {
      label: "Message Actions",
      items: [
        {
          title: "Star Message",
          url: "#star",
          icon: Star,
        },
        {
          title: "Mark as Unread",
          url: "#mark-unread",
          icon: MailOpen,
        },
        {
          title: "Mark as Read",
          url: "#mark-read",
          icon: Mail,
        },
        {
          title: "Flag",
          url: "#flag",
          icon: Flag,
        },
      ],
    },
    {
      label: "Move To",
      items: [
        {
          title: "Archive",
          url: "#archive",
          icon: Archive,
        },
        {
          title: "Trash",
          url: "#trash",
          icon: Trash2,
        },
        {
          title: "Spam",
          url: "#spam",
          icon: Shield,
        },
      ],
    },
    {
      label: "Organize",
      items: [
        {
          title: "Add Tags",
          url: "#add-tags",
          icon: Tag,
        },
        {
          title: "Assign to Team",
          url: "#assign",
          icon: UserPlus,
        },
        {
          title: "Change Priority",
          url: "#priority",
          icon: Flag,
        },
        {
          title: "Create Task",
          url: "#create-task",
          icon: CheckCircle,
        },
      ],
    },
    {
      label: "Contact",
      items: [
        {
          title: "View Contact",
          url: "#view-contact",
          icon: User,
        },
        {
          title: "More Actions",
          url: "#more",
          icon: MoreHorizontal,
        },
      ],
    },
  ];

  return <NavGrouped groups={navigationGroups} />;
}

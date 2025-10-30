/**
 * Activity Log Widget - Server Component
 *
 * Complete timeline of all job activities, changes, and events.
 * Provides audit trail and transparency for job history.
 *
 * Performance optimizations:
 * - Server Component by default
 * - Static rendering for better performance
 * - Efficient date formatting
 */

import {
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  User,
  Wrench,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Job } from "@/lib/db/schema";

interface ActivityLogWidgetProps {
  job: Job;
}

// Activity types and their icons/colors
const activityConfig = {
  status_change: {
    icon: CheckCircle2,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-950",
  },
  payment: {
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-950",
  },
  schedule: {
    icon: Calendar,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-950",
  },
  communication: {
    icon: MessageSquare,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-950",
  },
  document: {
    icon: FileText,
    color: "text-gray-600",
    bgColor: "bg-gray-100 dark:bg-gray-950",
  },
  work: {
    icon: Wrench,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-950",
  },
  assignment: {
    icon: User,
    color: "text-teal-600",
    bgColor: "bg-teal-100 dark:bg-teal-950",
  },
} as const;

type ActivityType = keyof typeof activityConfig;

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  user: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export function ActivityLogWidget({ job }: ActivityLogWidgetProps) {
  // Mock activities (in production, fetch from activities table)
  const activities: Activity[] = [
    {
      id: "7",
      type: "communication",
      title: "Email sent to customer",
      description: "Invoice #INV-2025-001 sent",
      user: "Sarah Johnson",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: "6",
      type: "work",
      title: "Work completed",
      description: "HVAC unit installation finished",
      user: "Mike Rodriguez",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      id: "5",
      type: "payment",
      title: "Payment received",
      description: "Progress payment of $5,000 deposited",
      user: "System",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: "4",
      type: "schedule",
      title: "Schedule updated",
      description: "Completion date moved to Feb 4, 2025",
      user: "David Chen",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: "3",
      type: "document",
      title: "Photo uploaded",
      description: "Before installation - 3 photos",
      user: "Mike Rodriguez",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      id: "2",
      type: "status_change",
      title: "Status changed to In Progress",
      description: "Work started on site",
      user: "Mike Rodriguez",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    },
    {
      id: "1",
      type: "assignment",
      title: "Technician assigned",
      description: "Mike Rodriguez assigned to job",
      user: "David Chen",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  ];

  function formatTimestamp(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">Recent Activity</h4>
        <Badge className="text-xs" variant="secondary">
          {activities.length} events
        </Badge>
      </div>

      {/* Activity Timeline */}
      <div className="relative space-y-4">
        {/* Timeline line */}
        <div className="absolute top-0 bottom-0 left-4 w-px bg-border" />

        {activities.map((activity, index) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;
          const isLast = index === activities.length - 1;

          return (
            <div className="relative flex gap-3" key={activity.id}>
              {/* Icon */}
              <div
                className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}
              >
                <Icon className={`size-4 ${config.color}`} />
              </div>

              {/* Content */}
              <div className={`flex-1 pb-4 ${isLast ? "" : "border-b"}`}>
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-medium text-sm leading-tight">
                      {activity.title}
                    </h5>
                    <span className="shrink-0 text-muted-foreground text-xs">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>

                  {activity.description && (
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {activity.description}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <User className="size-3" />
                    <span>{activity.user}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Link */}
      {activities.length > 5 && (
        <>
          <Separator />
          <div>
            <Button asChild className="w-full" size="sm" variant="outline">
              <Link href={`/dashboard/work/${job.id}/activity`}>
                <Clock className="mr-2 size-4" />
                View Complete History
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

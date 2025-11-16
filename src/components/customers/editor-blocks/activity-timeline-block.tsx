/**
 * Activity Timeline Block - Custom Tiptap Node
 *
 * Displays customer activity history:
 * - Jobs created, completed
 * - Invoices sent, paid
 * - Estimates created
 * - Notes added
 * - Profile updates
 *
 * Chronological timeline with icons and timestamps
 */

import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import {
  Activity,
  Briefcase,
  Clock,
  DollarSign,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CollapsibleDataSection } from "@/components/ui/collapsible-data-section";
import { cn } from "@/lib/utils";

// React component that renders the block
export function ActivityTimelineBlockComponent({ node }: any) {
  const { activities } = node.attrs;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "job_created":
      case "job_updated":
      case "job_completed":
        return Briefcase;
      case "invoice_created":
      case "invoice_sent":
      case "invoice_paid":
        return FileText;
      case "payment_received":
        return DollarSign;
      case "customer_created":
      case "customer_updated":
        return User;
      case "call_made":
      case "call_received":
        return Phone;
      case "email_sent":
        return Mail;
      case "property_added":
        return MapPin;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "job_completed":
      case "invoice_paid":
      case "payment_received":
        return "text-success bg-success dark:bg-success";
      case "invoice_sent":
      case "email_sent":
        return "text-primary bg-primary dark:bg-primary";
      case "job_created":
      case "customer_created":
        return "text-accent-foreground bg-accent dark:bg-accent";
      case "call_made":
      case "call_received":
        return "text-warning bg-warning dark:bg-warning";
      default:
        return "text-muted-foreground bg-secondary dark:bg-foreground";
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60_000);
    const diffHours = Math.floor(diffMs / 3_600_000);
    const diffDays = Math.floor(diffMs / 86_400_000);

    if (diffMins < 1) {
      return "Just now";
    }
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    }).format(d);
  };

  if (!activities || activities.length === 0) {
    return (
      <NodeViewWrapper className="activity-timeline-block">
        <CollapsibleDataSection
          count={0}
          defaultOpen={false}
          icon={<Activity className="size-5" />}
          standalone={true}
          storageKey="customer-activity-section"
          summary="No activity yet"
          title="Activity History (0)"
          value="customer-activity"
        >
          <div className="rounded-lg border bg-muted/30 p-8 text-center">
            <Activity className="mx-auto mb-3 size-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No activity yet</p>
          </div>
        </CollapsibleDataSection>
      </NodeViewWrapper>
    );
  }

  // Get recent activity for summary
  const recentActivity = activities[0];
  const summary = recentActivity
    ? `Last: ${recentActivity.action} ${formatDate(recentActivity.created_at)}`
    : `${activities.length} events`;

  return (
    <NodeViewWrapper className="activity-timeline-block">
      <CollapsibleDataSection
        count={activities.length}
        defaultOpen={false}
        icon={<Activity className="size-5" />}
        standalone={true}
        storageKey="customer-activity-section"
        summary={summary}
        title={`Activity History (${activities.length})`}
        value="customer-activity"
      >
        <div className="relative space-y-4">
          {/* Timeline Line */}
          <div className="absolute top-0 bottom-0 left-8 w-px bg-border" />

          {activities.map((activity: any, index: number) => {
            const Icon = getActivityIcon(activity.action);
            const colorClass = getActivityColor(activity.action);
            const user = Array.isArray(activity.user)
              ? activity.user[0]
              : activity.user;
            const userName = user?.name || "System";
            const userInitials = userName
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase();

            // Parse changes from old_values/new_values
            const changes = [];
            if (activity.old_values && activity.new_values) {
              const oldVals =
                typeof activity.old_values === "string"
                  ? JSON.parse(activity.old_values)
                  : activity.old_values;
              const newVals =
                typeof activity.new_values === "string"
                  ? JSON.parse(activity.new_values)
                  : activity.new_values;

              for (const key in newVals) {
                if (oldVals[key] !== newVals[key]) {
                  changes.push({
                    field: key,
                    old: oldVals[key],
                    new: newVals[key],
                  });
                }
              }
            }

            return (
              <div className="relative flex gap-4" key={activity.id || index}>
                {/* Timeline Icon */}
                <div
                  className={cn(
                    "relative z-10 flex size-16 shrink-0 items-center justify-center rounded-full",
                    colorClass
                  )}
                >
                  <Icon className="size-6" />
                </div>

                {/* Activity Content */}
                <div className="flex-1 pb-4">
                  <div className="rounded-lg border bg-card p-4">
                    {/* Header */}
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {activity.action}
                        </p>

                        {/* Show all changed fields */}
                        {changes.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {changes.map((change, i) => (
                              <div className="text-xs" key={i}>
                                <span className="font-medium text-muted-foreground">
                                  {change.field}:
                                </span>{" "}
                                <span className="text-destructive line-through">
                                  {String(change.old)}
                                </span>
                                {" → "}
                                <span className="text-success">
                                  {String(change.new)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Timestamp - ALWAYS SHOW */}
                      <time className="flex shrink-0 items-center gap-1 whitespace-nowrap text-muted-foreground text-xs">
                        <Clock className="size-3" />
                        {formatDate(activity.created_at)}
                      </time>
                    </div>

                    {/* User - ALWAYS SHOW WHO DID IT */}
                    <div className="mt-3 flex items-center gap-2 border-t pt-2">
                      <Avatar className="size-6">
                        <AvatarFallback className="text-xs">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-xs">
                        <span className="font-medium">{userName}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          • {formatDate(activity.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* IP Address and User Agent (for audit trail) */}
                    {(activity.ip_address || activity.user_agent) && (
                      <div className="mt-2 text-muted-foreground text-xs">
                        {activity.ip_address && (
                          <span>IP: {activity.ip_address}</span>
                        )}
                        {activity.ip_address && activity.user_agent && (
                          <span className="mx-2">•</span>
                        )}
                        {activity.user_agent && (
                          <span title={activity.user_agent}>
                            Browser: {activity.user_agent.split(" ")[0]}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleDataSection>
    </NodeViewWrapper>
  );
}

// Tiptap Node Extension
export const ActivityTimelineBlock = Node.create({
  name: "activityTimelineBlock",

  group: "block",

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      activities: {
        default: [],
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="activity-timeline-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "activity-timeline-block",
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ActivityTimelineBlockComponent);
  },

  addCommands() {
    return {
      insertActivityTimelineBlock:
        (attributes: any) =>
        ({ commands }: any) =>
          commands.insertContent({
            type: this.name,
            attrs: attributes,
          }),
    } as any;
  },
});

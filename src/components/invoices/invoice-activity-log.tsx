/**
 * Invoice Activity Log Component
 *
 * Shows complete history of invoice changes:
 * - What changed
 * - When it changed
 * - Who made the change
 * - Before/after values
 */

"use client";

import { History, User, Clock, FileEdit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

interface Activity {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes: any;
  created_at: string;
  user?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

interface InvoiceActivityLogProps {
  activities: Activity[];
}

export function InvoiceActivityLog({ activities }: InvoiceActivityLogProps) {
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  // Get user initials
  const getUserInitials = (user?: Activity["user"]) => {
    if (!user) return "?";
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  // Get user display name
  const getUserName = (user?: Activity["user"]) => {
    if (!user) return "Unknown User";
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.email;
  };

  // Get action badge variant and icon
  const getActionStyle = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
      case "created":
        return { variant: "default" as const, icon: <FileEdit className="h-3 w-3" /> };
      case "update":
      case "updated":
        return { variant: "secondary" as const, icon: <FileEdit className="h-3 w-3" /> };
      case "delete":
      case "deleted":
        return { variant: "destructive" as const, icon: <FileEdit className="h-3 w-3" /> };
      case "payment":
      case "paid":
        return { variant: "default" as const, icon: <FileEdit className="h-3 w-3" /> };
      default:
        return { variant: "outline" as const, icon: <FileEdit className="h-3 w-3" /> };
    }
  };

  // Format changes for display
  const formatChanges = (changes: any) => {
    if (!changes) return null;

    // Parse changes if it's a string
    const parsedChanges = typeof changes === "string" ? JSON.parse(changes) : changes;

    return Object.entries(parsedChanges).map(([field, value]: [string, any]) => {
      if (typeof value === "object" && value !== null && "old" in value && "new" in value) {
        return (
          <div key={field} className="text-sm">
            <span className="font-medium capitalize">{field.replace(/_/g, " ")}</span>:{" "}
            <span className="text-muted-foreground line-through">{String(value.old)}</span>
            {" → "}
            <span className="font-medium">{String(value.new)}</span>
          </div>
        );
      }
      return null;
    });
  };

  if (!activities || activities.length === 0) {
    return (
      <Card className="mb-8 p-6">
        <div className="mb-4 flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <Label className="text-base font-semibold">Activity Log</Label>
        </div>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <History />
            </EmptyMedia>
            <EmptyTitle>No Activity Yet</EmptyTitle>
            <EmptyDescription>
              Changes to this invoice will appear here with timestamps and user information.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Card>
    );
  }

  return (
    <Card className="mb-8 p-6">
      <div className="mb-6 flex items-center gap-2">
        <History className="h-5 w-5 text-muted-foreground" />
        <Label className="text-base font-semibold">Activity Log</Label>
        <Badge variant="secondary" className="ml-auto">
          {activities.length} {activities.length === 1 ? "event" : "events"}
        </Badge>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const actionStyle = getActionStyle(activity.action);

          return (
            <div key={activity.id} className="flex gap-4">
              {/* Avatar */}
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs">
                  {getUserInitials(activity.user)}
                </AvatarFallback>
              </Avatar>

              {/* Activity Details */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {getUserName(activity.user)}
                  </span>
                  <Badge variant={actionStyle.variant} className="gap-1">
                    {actionStyle.icon}
                    {activity.action}
                  </Badge>
                  <span className="ml-auto flex items-center gap-1 text-muted-foreground text-xs">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(activity.created_at)}
                  </span>
                </div>

                {/* Changes */}
                {activity.changes && (
                  <div className="rounded-md bg-muted p-3 text-sm">
                    {formatChanges(activity.changes)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More (if needed) */}
      {activities.length >= 50 && (
        <div className="mt-4 text-center">
          <p className="text-muted-foreground text-sm">
            Showing 50 most recent activities
          </p>
        </div>
      )}
    </Card>
  );
}

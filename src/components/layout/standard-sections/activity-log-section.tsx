"use client";

import { Activity } from "lucide-react";
import { formatDistance } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UnifiedAccordionContent } from "@/components/ui/unified-accordion";

interface ActivityLogSectionProps {
  activities: any[];
}

export function ActivityLogSection({ activities }: ActivityLogSectionProps) {
  if (!activities || activities.length === 0) {
    return (
      <UnifiedAccordionContent>
        <div className="flex h-32 items-center justify-center">
          <div className="text-center">
            <Activity className="mx-auto size-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No activity yet</p>
          </div>
        </div>
      </UnifiedAccordionContent>
    );
  }

  return (
    <UnifiedAccordionContent>
      <div className="max-h-96 space-y-3 overflow-y-auto">
        {activities.map((activity: any) => (
          <div
            key={activity.id}
            className="flex gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
          >
            <Avatar className="size-8 flex-shrink-0">
              <AvatarImage src={activity.user?.avatar} />
              <AvatarFallback>
                {activity.user?.name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm break-words">{activity.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {activity.user?.name} •{" "}
                {formatDistance(new Date(activity.created_at), new Date(), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </UnifiedAccordionContent>
  );
}


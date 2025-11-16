/**
 * Activity Tab - Timeline & Communications
 */

"use client";

import { Activity, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ActivityTabProps = {
  job: any;
  activities: any[];
  communications: any[];
  customer: any;
};

export function ActivityTab({
  job,
  activities,
  communications,
  customer,
}: ActivityTabProps) {
  const formatDateTime = (date: string) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));

  // Combine and sort activities and communications
  const timeline = [
    ...activities.map((a) => ({ ...a, type: "activity" })),
    ...communications.map((c) => ({ ...c, type: "communication" })),
  ].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Activity Timeline</CardTitle>
            <Badge variant="secondary">{timeline.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {timeline.length > 0 ? (
            <div className="space-y-4">
              {timeline.map((item, index) => {
                const user = Array.isArray(item.user)
                  ? item.user[0]
                  : item.user;
                return (
                  <div className="flex gap-3" key={item.id || index}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="text-xs">
                        {user?.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {user?.name || "System"}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {formatDateTime(item.created_at)}
                        </span>
                        <Badge className="text-xs" variant="outline">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {item.description ||
                          item.subject ||
                          item.body ||
                          "Activity logged"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground text-sm">
              No activity recorded yet
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Communications</CardTitle>
            <Badge variant="secondary">{communications.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {communications.length > 0 ? (
            <div className="space-y-3">
              {communications.map((comm) => (
                <div className="rounded-lg border p-3" key={comm.id}>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge>{comm.type?.toUpperCase()}</Badge>
                    <span className="text-muted-foreground text-xs">
                      {formatDateTime(comm.created_at)}
                    </span>
                  </div>
                  <p className="font-medium text-sm">{comm.subject}</p>
                  {comm.body && (
                    <p className="mt-1 text-muted-foreground text-sm">
                      {comm.body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground text-sm">
              No communications logged
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

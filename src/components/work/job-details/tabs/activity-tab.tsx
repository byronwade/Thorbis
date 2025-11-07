/**
 * Activity Tab - Timeline & Communications
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity, MessageSquare } from "lucide-react";

interface ActivityTabProps {
  job: any;
  activities: any[];
  communications: any[];
  customer: any;
}

export function ActivityTab({ job, activities, communications, customer }: ActivityTabProps) {
  const formatDateTime = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

  // Combine and sort activities and communications
  const timeline = [
    ...activities.map((a) => ({ ...a, type: "activity" })),
    ...communications.map((c) => ({ ...c, type: "communication" })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

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
                const user = Array.isArray(item.user) ? item.user[0] : item.user;
                return (
                  <div key={item.id || index} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="text-xs">
                        {user?.name?.split(" ").map((n: string) => n[0]).join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{user?.name || "System"}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(item.created_at)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description || item.subject || item.body || "Activity logged"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
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
                <div key={comm.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge>{comm.type?.toUpperCase()}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(comm.created_at)}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{comm.subject}</p>
                  {comm.body && (
                    <p className="text-sm text-muted-foreground mt-1">{comm.body}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              No communications logged
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

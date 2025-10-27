"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  DollarSign,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Activity = {
  id: string;
  type: "job-completed" | "payment" | "booking" | "review" | "alert";
  title: string;
  description: string;
  time: string;
  metadata?: string;
};

const activities: Activity[] = [
  {
    id: "1",
    type: "job-completed",
    title: "Job Completed",
    description: "Mike Johnson completed HVAC repair at 123 Main St",
    time: "2 min ago",
    metadata: "$385",
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Received",
    description: "Invoice #3421 paid via credit card",
    time: "5 min ago",
    metadata: "$1,250",
  },
  {
    id: "3",
    type: "booking",
    title: "New Booking",
    description: "Emergency plumbing service scheduled for tomorrow 9 AM",
    time: "12 min ago",
  },
  {
    id: "4",
    type: "review",
    title: "5-Star Review",
    description: 'Sarah Williams received review: "Excellent service!"',
    time: "18 min ago",
  },
  {
    id: "5",
    type: "job-completed",
    title: "Job Completed",
    description: "James Davis finished electrical inspection",
    time: "24 min ago",
    metadata: "$195",
  },
  {
    id: "6",
    type: "alert",
    title: "Running Behind",
    description: "Robert Garcia is 15 min behind schedule",
    time: "28 min ago",
  },
  {
    id: "7",
    type: "payment",
    title: "Payment Received",
    description: "Invoice #3420 paid via check",
    time: "35 min ago",
    metadata: "$850",
  },
  {
    id: "8",
    type: "booking",
    title: "New Booking",
    description: "AC maintenance scheduled for 456 Oak Ave",
    time: "42 min ago",
  },
];

const activityConfig = {
  "job-completed": {
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950",
  },
  payment: {
    icon: DollarSign,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
  },
  booking: {
    icon: Calendar,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  review: {
    icon: Star,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
  },
  alert: {
    icon: AlertCircle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950",
  },
};

export function ActivityFeed() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="pt-4 pb-0">
        <CardTitle className="text-base">Recent Activity</CardTitle>
        <CardDescription className="text-xs">Latest updates</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 pb-4">
        <ScrollArea className="h-[340px] pr-3">
          <div className="space-y-3">
            {activities.slice(0, 6).map((activity) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;

              return (
                <div
                  className="flex items-start gap-3 rounded-lg border p-3 transition-all hover:shadow-sm"
                  key={activity.id}
                >
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      config.bgColor
                    )}
                  >
                    <Icon className={cn("size-4", config.color)} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-xs leading-tight">
                        {activity.title}
                      </p>
                      {activity.metadata && (
                        <Badge className="shrink-0 text-xs" variant="secondary">
                          {activity.metadata}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs leading-snug">
                      {activity.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

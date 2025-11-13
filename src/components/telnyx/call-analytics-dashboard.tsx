"use client";

/**
 * Call Analytics Dashboard - Call statistics and reporting
 *
 * Features:
 * - Real-time call volume metrics
 * - Team member performance stats
 * - Call duration and wait time analytics
 * - Missed call tracking
 * - Cost analysis and billing
 * - Exportable reports
 */

import {
  BarChart3,
  Clock,
  DollarSign,
  Download,
  Phone,
  PhoneMissed,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CallAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");

  const stats = [
    {
      title: "Total Calls",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Phone,
    },
    {
      title: "Avg Duration",
      value: "4:32",
      change: "-2%",
      trend: "down",
      icon: Clock,
    },
    {
      title: "Answer Rate",
      value: "87%",
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Missed Calls",
      value: "156",
      change: "-8%",
      trend: "down",
      icon: PhoneMissed,
    },
  ];

  const teamPerformance = [
    {
      name: "Sarah Johnson",
      calls: 245,
      avgDuration: "5:12",
      answerRate: "92%",
    },
    { name: "Mike Chen", calls: 198, avgDuration: "4:45", answerRate: "88%" },
    { name: "Emily Davis", calls: 176, avgDuration: "6:20", answerRate: "85%" },
    {
      name: "James Wilson",
      calls: 164,
      avgDuration: "3:58",
      answerRate: "90%",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-2xl">Call Analytics</h2>
          <p className="text-muted-foreground text-sm">
            Performance metrics and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Select onValueChange={setTimeRange} value={timeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stat.value}</div>
              <p className="flex items-center gap-1 text-muted-foreground text-xs">
                <span
                  className={
                    stat.trend === "up" ? "text-success" : "text-destructive"
                  }
                >
                  {stat.change}
                </span>
                from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Individual agent statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamPerformance.map((member) => (
                <div
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  key={member.name}
                >
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {member.calls} calls · {member.avgDuration} avg
                    </p>
                  </div>
                  <Badge
                    variant={
                      Number.parseInt(member.answerRate) >= 90
                        ? "default"
                        : "secondary"
                    }
                  >
                    {member.answerRate}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Call Volume by Hour</CardTitle>
            <CardDescription>Peak calling times</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-end justify-between gap-2">
              {[45, 68, 89, 72, 56, 91, 78, 65, 42, 58, 73, 61].map(
                (height, i) => (
                  <div
                    className="flex-1 rounded-t bg-primary transition-all hover:opacity-80"
                    key={i}
                    style={{ height: `${height}%` }}
                    title={`${i + 8}:00 - ${height} calls`}
                  />
                )
              )}
            </div>
            <div className="mt-4 flex justify-between text-muted-foreground text-xs">
              <span>8 AM</span>
              <span>12 PM</span>
              <span>4 PM</span>
              <span>8 PM</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="size-5" />
            Cost Analysis
          </CardTitle>
          <CardDescription>Call costs and billing breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-muted-foreground text-sm">Total Cost</p>
              <p className="font-bold text-2xl">$1,247.85</p>
              <p className="text-muted-foreground text-xs">This month</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Cost Per Call</p>
              <p className="font-bold text-2xl">$1.01</p>
              <p className="text-muted-foreground text-xs">Average</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Minutes</p>
              <p className="font-bold text-2xl">8,542</p>
              <p className="text-muted-foreground text-xs">Billable</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="flex items-start gap-3 pt-6">
          <BarChart3 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="space-y-1">
            <p className="font-medium text-primary text-sm dark:text-primary">
              Improve Your Call Performance
            </p>
            <p className="text-muted-foreground text-sm">
              Monitor answer rates to ensure customers reach your team. Track
              missed calls and follow up promptly. Use peak hour data to
              optimize staffing. Review call recordings for quality assurance
              and training.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

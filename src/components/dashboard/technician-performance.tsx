"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";

type TechnicianStatus = "on-job" | "traveling" | "available";

const technicianData: Array<{
  name: string;
  jobs: number;
  revenue: number;
  status: TechnicianStatus;
  avgDuration: number;
}> = [
  {
    name: "Mike Johnson",
    jobs: 6,
    revenue: 2850,
    status: "on-job",
    avgDuration: 45,
  },
  {
    name: "Sarah Williams",
    jobs: 5,
    revenue: 3200,
    status: "traveling",
    avgDuration: 52,
  },
  {
    name: "James Davis",
    jobs: 7,
    revenue: 2450,
    status: "on-job",
    avgDuration: 38,
  },
  {
    name: "Emily Brown",
    jobs: 4,
    revenue: 1980,
    status: "available",
    avgDuration: 48,
  },
  {
    name: "Robert Garcia",
    jobs: 6,
    revenue: 2750,
    status: "on-job",
    avgDuration: 42,
  },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  jobs: {
    label: "Jobs Completed",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const statusColors: Record<TechnicianStatus, string> = {
  "on-job": "bg-blue-500",
  traveling: "bg-yellow-500",
  available: "bg-green-500",
};

const statusLabels: Record<TechnicianStatus, string> = {
  "on-job": "On Job",
  traveling: "Traveling",
  available: "Available",
};

export function TechnicianPerformance() {
  const totalJobs = technicianData.reduce((sum, tech) => sum + tech.jobs, 0);
  const totalRevenue = technicianData.reduce(
    (sum, tech) => sum + tech.revenue,
    0
  );

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="pt-4 pb-0">
        <CardTitle className="text-base">Team Performance</CardTitle>
        <CardDescription className="text-xs">
          {totalJobs} jobs • ${(totalRevenue / 1000).toFixed(1)}k revenue
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 pb-4">
        <div className="space-y-2.5">
          {technicianData.map((tech) => (
            <div
              className="flex items-center justify-between rounded-lg border p-3 transition-all hover:shadow-sm"
              key={tech.name}
            >
              <div className="flex-1">
                <p className="font-semibold text-sm">{tech.name}</p>
                <p className="text-muted-foreground text-xs">
                  {tech.jobs} jobs • ${(tech.revenue / 1000).toFixed(1)}k
                </p>
              </div>
              <Badge
                className={`${statusColors[tech.status]} text-white text-xs`}
                variant="secondary"
              >
                {statusLabels[tech.status]}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

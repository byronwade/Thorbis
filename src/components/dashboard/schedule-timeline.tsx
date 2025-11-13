"use client";

import {
  Bar,
  CartesianGrid,
  LazyBarChart,
  XAxis,
  YAxis,
} from "@/components/lazy/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { hour: "6 AM", scheduled: 2, inProgress: 0, completed: 0 },
  { hour: "7 AM", scheduled: 4, inProgress: 2, completed: 0 },
  { hour: "8 AM", scheduled: 8, inProgress: 5, completed: 1 },
  { hour: "9 AM", scheduled: 6, inProgress: 7, completed: 3 },
  { hour: "10 AM", scheduled: 5, inProgress: 6, completed: 5 },
  { hour: "11 AM", scheduled: 7, inProgress: 5, completed: 8 },
  { hour: "12 PM", scheduled: 4, inProgress: 4, completed: 10 },
  { hour: "1 PM", scheduled: 6, inProgress: 5, completed: 11 },
  { hour: "2 PM", scheduled: 5, inProgress: 6, completed: 12 },
  { hour: "3 PM", scheduled: 4, inProgress: 5, completed: 14 },
  { hour: "4 PM", scheduled: 3, inProgress: 4, completed: 16 },
  { hour: "5 PM", scheduled: 2, inProgress: 2, completed: 18 },
];

const chartConfig = {
  scheduled: {
    label: "Scheduled",
    color: "var(--chart-1)",
  },
  inProgress: {
    label: "In Progress",
    color: "var(--chart-2)",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function ScheduleTimeline() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="pt-4 pb-0">
        <CardTitle className="text-base">Schedule Overview</CardTitle>
        <CardDescription className="text-xs">
          Jobs by hour today
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 pb-0">
        <ChartContainer
          className="aspect-auto h-[300px] w-full"
          config={chartConfig}
        >
          <LazyBarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid opacity={0.3} vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="hour"
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => value.slice(0, -3)}
              tickLine={false}
              tickMargin={8}
            />
            <YAxis
              axisLine={false}
              tick={{ fontSize: 11 }}
              tickLine={false}
              width={35}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="completed"
              fill="var(--color-completed)"
              radius={[0, 0, 4, 4]}
              stackId="a"
            />
            <Bar
              dataKey="inProgress"
              fill="var(--color-inProgress)"
              radius={[0, 0, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="scheduled"
              fill="var(--color-scheduled)"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
          </LazyBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

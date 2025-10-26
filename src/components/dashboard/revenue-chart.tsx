"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { hour: "6 AM", today: 0, yesterday: 0, average: 0 },
  { hour: "7 AM", today: 850, yesterday: 420, average: 600 },
  { hour: "8 AM", today: 1250, yesterday: 980, average: 1100 },
  { hour: "9 AM", today: 2100, yesterday: 1650, average: 1800 },
  { hour: "10 AM", today: 3400, yesterday: 2890, average: 3000 },
  { hour: "11 AM", today: 4800, yesterday: 3920, average: 4200 },
  { hour: "12 PM", today: 5650, yesterday: 4500, average: 5000 },
  { hour: "1 PM", today: 6900, yesterday: 5800, average: 6200 },
  { hour: "2 PM", today: 8200, yesterday: 6950, average: 7400 },
  { hour: "3 PM", today: 9500, yesterday: 8100, average: 8600 },
  { hour: "4 PM", today: 10_800, yesterday: 9300, average: 9800 },
  { hour: "5 PM", today: 11_200, yesterday: 9850, average: 10_400 },
];

const chartConfig = {
  today: {
    label: "Today",
    color: "var(--chart-1)",
  },
  yesterday: {
    label: "Yesterday",
    color: "var(--chart-2)",
  },
  average: {
    label: "Weekly Avg",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function RevenueChart() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="pt-4 pb-0">
        <CardTitle className="text-base">Revenue Performance</CardTitle>
        <CardDescription className="text-xs">
          Today vs Yesterday vs Weekly Average
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 pb-0">
        <ChartContainer
          className="aspect-auto h-[340px] w-full"
          config={chartConfig}
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              opacity={0.3}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="hour"
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => value.slice(0, -3)}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="average"
              fill="var(--color-average)"
              fillOpacity={0.1}
              stroke="var(--color-average)"
              strokeWidth={1.5}
              type="monotone"
            />
            <Area
              dataKey="yesterday"
              fill="var(--color-yesterday)"
              fillOpacity={0.15}
              stroke="var(--color-yesterday)"
              strokeWidth={2}
              type="monotone"
            />
            <Area
              dataKey="today"
              fill="var(--color-today)"
              fillOpacity={0.3}
              stroke="var(--color-today)"
              strokeWidth={3}
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

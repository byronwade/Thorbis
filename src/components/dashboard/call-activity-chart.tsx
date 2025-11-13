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
  { hour: "6 AM", inbound: 1, booked: 1, missed: 0 },
  { hour: "7 AM", inbound: 3, booked: 2, missed: 1 },
  { hour: "8 AM", inbound: 8, booked: 6, missed: 1 },
  { hour: "9 AM", inbound: 12, booked: 9, missed: 2 },
  { hour: "10 AM", inbound: 10, booked: 8, missed: 1 },
  { hour: "11 AM", inbound: 9, booked: 7, missed: 2 },
  { hour: "12 PM", inbound: 7, booked: 5, missed: 1 },
  { hour: "1 PM", inbound: 8, booked: 7, missed: 0 },
  { hour: "2 PM", inbound: 11, booked: 9, missed: 2 },
  { hour: "3 PM", inbound: 9, booked: 7, missed: 1 },
  { hour: "4 PM", inbound: 6, booked: 5, missed: 1 },
  { hour: "5 PM", inbound: 4, booked: 3, missed: 0 },
];

const chartConfig = {
  inbound: {
    label: "Total Calls",
    color: "var(--chart-1)",
  },
  booked: {
    label: "Booked",
    color: "var(--chart-4)",
  },
  missed: {
    label: "Missed",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function CallActivityChart() {
  const totalCalls = chartData.reduce((sum, item) => sum + item.inbound, 0);
  const totalBooked = chartData.reduce((sum, item) => sum + item.booked, 0);
  const bookingRate = ((totalBooked / totalCalls) * 100).toFixed(1);

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="pt-4 pb-0">
        <CardTitle className="text-base">Call Activity</CardTitle>
        <CardDescription className="text-xs">
          {totalCalls} calls • {bookingRate}% booked
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
            <Bar dataKey="inbound" fill="var(--color-inbound)" radius={4} />
            <Bar dataKey="booked" fill="var(--color-booked)" radius={4} />
            <Bar dataKey="missed" fill="var(--color-missed)" radius={4} />
          </LazyBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

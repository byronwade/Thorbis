"use client";

/**
 * Marketing Analytics Component - ROI and Performance Tracking
 *
 * Features:
 * - Lead source ROI tracking
 * - Campaign performance metrics
 * - Conversion funnel analysis
 * - Revenue attribution
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

type LeadSourceMetrics = {
  source: string;
  leads: number;
  cost: number;
  conversions: number;
  revenue: number;
  roi: number;
  trend: "up" | "down" | "stable";
};

const MOCK_SOURCE_METRICS: LeadSourceMetrics[] = [
  {
    source: "Google Ads",
    leads: 125,
    cost: 3200,
    conversions: 42,
    revenue: 12600,
    roi: 294,
    trend: "up",
  },
  {
    source: "Thumbtack",
    leads: 85,
    cost: 2100,
    conversions: 28,
    revenue: 8400,
    roi: 300,
    trend: "up",
  },
  {
    source: "Facebook Ads",
    leads: 95,
    cost: 1800,
    conversions: 24,
    revenue: 7200,
    roi: 300,
    trend: "stable",
  },
  {
    source: "Website Forms",
    leads: 65,
    cost: 0,
    conversions: 32,
    revenue: 9600,
    roi: 0,
    trend: "up",
  },
  {
    source: "Referrals",
    leads: 45,
    cost: 0,
    conversions: 28,
    revenue: 8400,
    roi: 0,
    trend: "stable",
  },
];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatROI = (roi: number): string => {
  if (roi === 0) return "N/A";
  return `${roi}%`;
};

const getTrendIcon = (trend: "up" | "down" | "stable") => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case "down":
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    case "stable":
      return <BarChart3 className="h-4 w-4 text-blue-600" />;
  }
};

export function MarketingAnalytics() {
  const totalLeads = MOCK_SOURCE_METRICS.reduce((sum, m) => sum + m.leads, 0);
  const totalCost = MOCK_SOURCE_METRICS.reduce((sum, m) => sum + m.cost, 0);
  const totalConversions = MOCK_SOURCE_METRICS.reduce((sum, m) => sum + m.conversions, 0);
  const totalRevenue = MOCK_SOURCE_METRICS.reduce((sum, m) => sum + m.revenue, 0);
  const overallROI = totalCost > 0 ? Math.round(((totalRevenue - totalCost) / totalCost) * 100) : 0;
  const conversionRate = totalLeads > 0 ? ((totalConversions / totalLeads) * 100).toFixed(1) : "0";

  return (
    <div className="flex h-full flex-col overflow-auto p-4">
      <div className="space-y-6">
        {/* Summary Stats */}
        <div>
          <h2 className="mb-4 font-semibold text-2xl">Marketing Performance</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">Total Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{totalLeads}</div>
                <p className="text-muted-foreground text-xs">
                  {totalConversions} converted ({conversionRate}%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">Marketing Spend</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{formatCurrency(totalCost)}</div>
                <p className="text-muted-foreground text-xs">Cost per lead: {formatCurrency(totalCost / totalLeads)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">Revenue Generated</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{formatCurrency(totalRevenue)}</div>
                <p className="text-muted-foreground text-xs">
                  Avg: {formatCurrency(totalRevenue / totalConversions)} per conversion
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">Overall ROI</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{overallROI}%</div>
                <p className="text-muted-foreground text-xs">
                  {formatCurrency(totalRevenue / totalCost)} return per $1
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lead Source Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Source Performance</CardTitle>
            <CardDescription>
              Compare ROI and conversion rates across marketing channels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Leads</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Conversions</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">ROI</TableHead>
                  <TableHead className="text-right">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_SOURCE_METRICS.map((metric) => (
                  <TableRow key={metric.source}>
                    <TableCell className="font-medium">{metric.source}</TableCell>
                    <TableCell className="text-right">{metric.leads}</TableCell>
                    <TableCell className="text-right">
                      {metric.cost > 0 ? formatCurrency(metric.cost) : "Free"}
                    </TableCell>
                    <TableCell className="text-right">
                      {metric.conversions}
                      <span className="ml-2 text-muted-foreground text-xs">
                        ({Math.round((metric.conversions / metric.leads) * 100)}%)
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(metric.revenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      {metric.roi > 0 ? (
                        <Badge variant="default">{formatROI(metric.roi)}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{getTrendIcon(metric.trend)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>
              Track lead progression from capture to customer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border bg-blue-50 p-4 dark:bg-blue-950/20">
                <div>
                  <div className="font-medium text-sm">Leads Captured</div>
                  <div className="font-bold text-2xl">{totalLeads}</div>
                </div>
                <div className="text-muted-foreground text-sm">100%</div>
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-green-50 p-4 dark:bg-green-950/20">
                <div>
                  <div className="font-medium text-sm">Contacted</div>
                  <div className="font-bold text-2xl">{Math.round(totalLeads * 0.8)}</div>
                </div>
                <div className="text-muted-foreground text-sm">80%</div>
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-yellow-50 p-4 dark:bg-yellow-950/20">
                <div>
                  <div className="font-medium text-sm">Qualified</div>
                  <div className="font-bold text-2xl">{Math.round(totalLeads * 0.5)}</div>
                </div>
                <div className="text-muted-foreground text-sm">50%</div>
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-purple-50 p-4 dark:bg-purple-950/20">
                <div>
                  <div className="font-medium text-sm">Converted to Customer</div>
                  <div className="font-bold text-2xl">{totalConversions}</div>
                </div>
                <div className="text-muted-foreground text-sm">{conversionRate}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

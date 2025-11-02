/**
 * Cash Flow Page - Server Component
 */

import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const revalidate = 900;

export default function CashFlowPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Cash Flow Management</h1>
        <p className="text-muted-foreground">
          Track and forecast your business cash flow
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Cash Inflow</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">$0</div>
            <p className="text-muted-foreground text-xs">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Cash Outflow</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">$0</div>
            <p className="text-muted-foreground text-xs">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Net Cash Flow</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">$0</div>
            <p className="text-muted-foreground text-xs">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Runway</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">0</div>
            <p className="text-muted-foreground text-xs">Months</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Tools</CardTitle>
          <CardDescription>
            Monitor and predict cash flow patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• Real-time cash position tracking</p>
            <p>• 12-month cash flow forecast</p>
            <p>• Seasonal trend analysis</p>
            <p>• Scenario planning tools</p>
            <p>• Working capital insights</p>
            <p>• Cash burn rate monitoring</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

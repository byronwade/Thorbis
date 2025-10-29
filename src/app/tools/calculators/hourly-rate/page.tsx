"use client";

/**
 * Hourly Rate Calculator - Client Component
 *
 * Client-side features:
 * - Interactive form inputs
 * - Real-time calculations
 * - State management for calculator values
 */

import { useState } from "react";
import { Calculator, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function HourlyRateCalculator() {
  const [annualRevenue, setAnnualRevenue] = useState<string>("200000");
  const [billableHours, setBillableHours] = useState<string>("1500");
  const [totalHours, setTotalHours] = useState<string>("2080");
  const [overhead, setOverhead] = useState<string>("50000");
  const [profitMargin, setProfitMargin] = useState<string>("20");

  // Calculations
  const revenueNum = parseFloat(annualRevenue) || 0;
  const billableNum = parseFloat(billableHours) || 1;
  const totalNum = parseFloat(totalHours) || 1;
  const overheadNum = parseFloat(overhead) || 0;
  const profitNum = parseFloat(profitMargin) || 0;

  const utilizationRate = (billableNum / totalNum) * 100;
  const totalCosts = overheadNum;
  const targetProfit = revenueNum * (profitNum / 100);
  const requiredRevenue = totalCosts + targetProfit;
  const hourlyRate = requiredRevenue / billableNum;
  const effectiveRate = hourlyRate * (utilizationRate / 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5">
            <DollarSign className="size-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-3xl tracking-tight">Hourly Rate Calculator</h1>
              <Badge variant="secondary">Popular</Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              Calculate what to charge per hour based on your costs and target profit
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="size-5" />
            How This Calculator Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            This calculator helps you determine your ideal hourly billing rate by considering:
          </p>
          <ul className="ml-4 space-y-1 list-disc">
            <li>Your annual revenue goals</li>
            <li>Billable hours vs total working hours (utilization rate)</li>
            <li>Overhead and operating costs</li>
            <li>Desired profit margin</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="size-5" />
              Your Business Numbers
            </CardTitle>
            <CardDescription>Enter your annual business metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="revenue">Target Annual Revenue ($)</Label>
              <Input
                id="revenue"
                type="number"
                value={annualRevenue}
                onChange={(e) => setAnnualRevenue(e.target.value)}
                placeholder="200000"
              />
              <p className="text-muted-foreground text-xs">
                Your desired total revenue for the year
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billable">Billable Hours per Year</Label>
              <Input
                id="billable"
                type="number"
                value={billableHours}
                onChange={(e) => setBillableHours(e.target.value)}
                placeholder="1500"
              />
              <p className="text-muted-foreground text-xs">
                Hours you can actually bill to clients (typically 1,200-1,800)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="total">Total Working Hours per Year</Label>
              <Input
                id="total"
                type="number"
                value={totalHours}
                onChange={(e) => setTotalHours(e.target.value)}
                placeholder="2080"
              />
              <p className="text-muted-foreground text-xs">
                Total hours available (40 hrs/week × 52 weeks = 2,080)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="overhead">Annual Overhead Costs ($)</Label>
              <Input
                id="overhead"
                type="number"
                value={overhead}
                onChange={(e) => setOverhead(e.target.value)}
                placeholder="50000"
              />
              <p className="text-muted-foreground text-xs">
                Rent, insurance, equipment, utilities, admin, etc.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profit">Target Profit Margin (%)</Label>
              <Input
                id="profit"
                type="number"
                value={profitMargin}
                onChange={(e) => setProfitMargin(e.target.value)}
                placeholder="20"
              />
              <p className="text-muted-foreground text-xs">
                Desired profit as percentage of revenue (typically 10-30%)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-5" />
                Your Recommended Hourly Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-sm">Minimum Hourly Rate</p>
                  <p className="font-bold text-4xl">
                    ${hourlyRate.toFixed(2)}
                    <span className="text-muted-foreground text-xl">/hour</span>
                  </p>
                </div>
                <p className="text-sm">
                  This rate ensures you hit your revenue target of ${revenueNum.toLocaleString()}
                  with {billableNum.toLocaleString()} billable hours per year.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground text-sm">Utilization Rate</span>
                <span className="font-semibold">{utilizationRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground text-sm">Billable Hours/Year</span>
                <span className="font-semibold">{billableNum.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground text-sm">Total Working Hours</span>
                <span className="font-semibold">{totalNum.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground text-sm">Annual Overhead</span>
                <span className="font-semibold">${overheadNum.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground text-sm">Target Profit</span>
                <span className="font-semibold">${targetProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-semibold">Required Revenue</span>
                <span className="font-bold text-lg">${requiredRevenue.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="size-4" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Industry average utilization is 70-75% (1,450-1,560 hrs/year)</p>
              <p>• Don't forget to include benefits, taxes, and equipment costs in overhead</p>
              <p>• Consider market rates in your area for competitive pricing</p>
              <p>• Review and adjust quarterly based on actual performance</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

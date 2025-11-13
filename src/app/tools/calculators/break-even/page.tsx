"use client";

/**
 * Break-Even Calculator - Client Component
 *
 * Client-side features:
 * - Break-even point calculations
 * - Fixed and variable cost analysis
 * - Target profit planning
 */

import { AlertCircle, DollarSign, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState<string>("60000");
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<string>("50");
  const [pricePerUnit, setPricePerUnit] = useState<string>("100");
  const [targetProfit, setTargetProfit] = useState<string>("50000");

  // Calculations
  const fixedNum = Number.parseFloat(fixedCosts) || 0;
  const variableNum = Number.parseFloat(variableCostPerUnit) || 0;
  const priceNum = Number.parseFloat(pricePerUnit) || 0;
  const targetNum = Number.parseFloat(targetProfit) || 0;

  const contributionMargin = priceNum - variableNum;
  const contributionMarginRatio =
    priceNum > 0 ? (contributionMargin / priceNum) * 100 : 0;

  const breakEvenUnits =
    contributionMargin > 0 ? fixedNum / contributionMargin : 0;
  const breakEvenRevenue = breakEvenUnits * priceNum;

  const unitsForTargetProfit =
    contributionMargin > 0 ? (fixedNum + targetNum) / contributionMargin : 0;
  const revenueForTargetProfit = unitsForTargetProfit * priceNum;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5">
            <Target className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              Break-Even Calculator
            </h1>
            <p className="mt-1 text-muted-foreground">
              Find out how much revenue you need to cover your costs
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-blue-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="size-5" />
            Understanding Break-Even Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Break-even analysis shows you:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>
              <strong>Break-Even Point:</strong> Minimum sales needed to cover
              all costs
            </li>
            <li>
              <strong>Fixed Costs:</strong> Expenses that don't change (rent,
              insurance, salaries)
            </li>
            <li>
              <strong>Variable Costs:</strong> Expenses that change with sales
              (materials, labor)
            </li>
            <li>
              <strong>Contribution Margin:</strong> Revenue minus variable costs
              (covers fixed costs)
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="size-5" />
                Your Business Costs
              </CardTitle>
              <CardDescription>Enter your cost structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fixed">Total Fixed Costs per Year ($)</Label>
                <Input
                  id="fixed"
                  onChange={(e) => setFixedCosts(e.target.value)}
                  placeholder="60000"
                  type="number"
                  value={fixedCosts}
                />
                <p className="text-muted-foreground text-xs">
                  Rent, insurance, salaries, utilities - costs that stay the
                  same regardless of sales
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="variable">Variable Cost per Job ($)</Label>
                <Input
                  id="variable"
                  onChange={(e) => setVariableCostPerUnit(e.target.value)}
                  placeholder="50"
                  type="number"
                  value={variableCostPerUnit}
                />
                <p className="text-muted-foreground text-xs">
                  Materials, direct labor, supplies - costs that increase with
                  each job
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Average Price per Job ($)</Label>
                <Input
                  id="price"
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  placeholder="100"
                  type="number"
                  value={pricePerUnit}
                />
                <p className="text-muted-foreground text-xs">
                  What you charge customers on average
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-5" />
                Profit Target (Optional)
              </CardTitle>
              <CardDescription>
                Calculate sales needed for target profit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="profit">Target Annual Profit ($)</Label>
                <Input
                  id="profit"
                  onChange={(e) => setTargetProfit(e.target.value)}
                  placeholder="50000"
                  type="number"
                  value={targetProfit}
                />
                <p className="text-muted-foreground text-xs">
                  How much profit you want to make beyond covering costs
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-warning/20 bg-gradient-to-br from-amber-500/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="size-4" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Review your break-even point quarterly</p>
              <p>• Try to reduce fixed costs when possible</p>
              <p>• Higher contribution margin = faster break-even</p>
              <p>• Consider seasonal variations in your business</p>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
            <CardHeader>
              <CardTitle>Break-Even Point</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Jobs Needed to Break Even
                  </p>
                  <p className="font-bold text-5xl">
                    {Math.ceil(breakEvenUnits).toLocaleString()}
                  </p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    jobs per year
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-muted-foreground text-sm">
                    Revenue Needed to Break Even
                  </p>
                  <p className="font-bold text-3xl">
                    ${breakEvenRevenue.toLocaleString()}
                  </p>
                  <p className="mt-1 text-muted-foreground text-sm">per year</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground text-sm">
                  Contribution Margin per Job
                </span>
                <span className="font-semibold">
                  ${contributionMargin.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground text-sm">
                  Contribution Margin Ratio
                </span>
                <span className="font-semibold">
                  {contributionMarginRatio.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground text-sm">
                  Fixed Costs
                </span>
                <span className="font-semibold">
                  ${fixedNum.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground text-sm">
                  Variable Cost per Job
                </span>
                <span className="font-semibold">${variableNum.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Price per Job
                </span>
                <span className="font-semibold">${priceNum.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {targetNum > 0 && (
            <Card className="border-success/20 bg-gradient-to-br from-green-500/10 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg">
                  To Achieve Target Profit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Jobs Needed</p>
                    <p className="font-bold text-4xl">
                      {Math.ceil(unitsForTargetProfit).toLocaleString()}
                    </p>
                    <p className="mt-1 text-muted-foreground text-sm">
                      jobs per year
                    </p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-muted-foreground text-sm">
                      Revenue Needed
                    </p>
                    <p className="font-bold text-2xl">
                      ${revenueForTargetProfit.toLocaleString()}
                    </p>
                    <p className="mt-1 text-muted-foreground text-sm">
                      to make ${targetNum.toLocaleString()} profit
                    </p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-muted-foreground text-sm">
                      Additional Jobs Beyond Break-Even
                    </p>
                    <p className="font-bold text-xl">
                      {Math.ceil(
                        unitsForTargetProfit - breakEvenUnits
                      ).toLocaleString()}
                    </p>
                    <p className="mt-1 text-muted-foreground text-sm">
                      jobs needed for profit goal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Monthly Revenue Needed
                </span>
                <span className="font-semibold">
                  ${(breakEvenRevenue / 12).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Monthly Jobs Needed
                </span>
                <span className="font-semibold">
                  {Math.ceil(breakEvenUnits / 12).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Weekly Jobs Needed
                </span>
                <span className="font-semibold">
                  {Math.ceil(breakEvenUnits / 52).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Daily Jobs Needed</span>
                <span className="font-semibold">
                  {Math.ceil(breakEvenUnits / 260).toLocaleString()}
                </span>
              </div>
              <p className="pt-2 text-muted-foreground text-xs">
                Based on 260 working days per year (52 weeks × 5 days)
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-blue-500/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="size-4" />
                Improving Your Break-Even Point
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>Reduce fixed costs:</strong> Renegotiate rent, shop
                insurance rates
              </p>
              <p>
                <strong>Reduce variable costs:</strong> Better supplier pricing,
                efficient labor
              </p>
              <p>
                <strong>Increase prices:</strong> Add value to justify higher
                rates
              </p>
              <p>
                <strong>Increase volume:</strong> More marketing, better
                conversion rates
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

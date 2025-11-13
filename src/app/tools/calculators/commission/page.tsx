"use client";

/**
 * Commission Calculator - Client Component
 *
 * Client-side features:
 * - Tiered commission structures
 * - Multiple calculation methods
 * - Real-time commission calculations
 */

import { AlertCircle, DollarSign, TrendingUp, Users } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CommissionCalculator() {
  const [calculationType, setCalculationType] = useState<string>("flat");
  const [salesAmount, setSalesAmount] = useState<string>("50000");
  const [flatRate, setFlatRate] = useState<string>("10");

  // Tiered rates
  const [tier1Threshold, setTier1Threshold] = useState<string>("10000");
  const [tier1Rate, setTier1Rate] = useState<string>("5");
  const [tier2Threshold, setTier2Threshold] = useState<string>("25000");
  const [tier2Rate, setTier2Rate] = useState<string>("7.5");
  const [tier3Rate, setTier3Rate] = useState<string>("10");

  // Technician performance
  const [techBasePay, setTechBasePay] = useState<string>("25");
  const [jobsCompleted, setJobsCompleted] = useState<string>("20");
  const [avgTicket, setAvgTicket] = useState<string>("500");
  const [bonusPerJob, setBonusPerJob] = useState<string>("25");

  const salesNum = Number.parseFloat(salesAmount) || 0;

  // Flat rate calculation
  const flatCommission = salesNum * ((Number.parseFloat(flatRate) || 0) / 100);

  // Tiered calculation
  const tier1Num = Number.parseFloat(tier1Threshold) || 0;
  const tier2Num = Number.parseFloat(tier2Threshold) || 0;
  const rate1 = (Number.parseFloat(tier1Rate) || 0) / 100;
  const rate2 = (Number.parseFloat(tier2Rate) || 0) / 100;
  const rate3 = (Number.parseFloat(tier3Rate) || 0) / 100;

  let tieredCommission = 0;
  if (salesNum <= tier1Num) {
    tieredCommission = salesNum * rate1;
  } else if (salesNum <= tier2Num) {
    tieredCommission = tier1Num * rate1 + (salesNum - tier1Num) * rate2;
  } else {
    tieredCommission =
      tier1Num * rate1 +
      (tier2Num - tier1Num) * rate2 +
      (salesNum - tier2Num) * rate3;
  }

  // Technician calculation
  const basePayNum = Number.parseFloat(techBasePay) || 0;
  const jobsNum = Number.parseFloat(jobsCompleted) || 0;
  const avgNum = Number.parseFloat(avgTicket) || 0;
  const bonusNum = Number.parseFloat(bonusPerJob) || 0;

  const totalRevenue = jobsNum * avgNum;
  const performanceBonus = jobsNum * bonusNum;
  const techTotal = basePayNum * 40 * 4 + performanceBonus; // assuming 40 hrs/week, 4 weeks

  const commission =
    calculationType === "flat"
      ? flatCommission
      : calculationType === "tiered"
        ? tieredCommission
        : techTotal;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5">
            <Users className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              Commission Calculator
            </h1>
            <p className="mt-1 text-muted-foreground">
              Calculate sales commissions and technician incentive pay
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-blue-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="size-5" />
            Commission Structures
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Choose the commission structure that fits your team:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>
              <strong>Flat Rate:</strong> Simple percentage of all sales
            </li>
            <li>
              <strong>Tiered:</strong> Higher rates as sales increase (motivates
              high performers)
            </li>
            <li>
              <strong>Technician:</strong> Base pay plus performance bonuses per
              job
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Commission Type</CardTitle>
              <CardDescription>
                Select your commission structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                onValueChange={setCalculationType}
                value={calculationType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat">Flat Rate Commission</SelectItem>
                  <SelectItem value="tiered">Tiered Commission</SelectItem>
                  <SelectItem value="technician">
                    Technician Performance Pay
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {calculationType === "flat" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="size-5" />
                  Flat Rate Commission
                </CardTitle>
                <CardDescription>
                  Simple percentage of total sales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sales">Total Sales Amount ($)</Label>
                  <Input
                    id="sales"
                    onChange={(e) => setSalesAmount(e.target.value)}
                    type="number"
                    value={salesAmount}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Commission Rate (%)</Label>
                  <Input
                    id="rate"
                    onChange={(e) => setFlatRate(e.target.value)}
                    type="number"
                    value={flatRate}
                  />
                  <p className="text-muted-foreground text-xs">
                    Typical range: 5-15% for sales, 2-5% for technicians
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {calculationType === "tiered" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-5" />
                  Tiered Commission
                </CardTitle>
                <CardDescription>
                  Higher rates as performance increases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sales-tiered">Total Sales Amount ($)</Label>
                  <Input
                    id="sales-tiered"
                    onChange={(e) => setSalesAmount(e.target.value)}
                    type="number"
                    value={salesAmount}
                  />
                </div>

                <div className="space-y-3 rounded-lg border p-3">
                  <h4 className="font-semibold text-sm">Tier 1</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Up to ($)</Label>
                      <Input
                        onChange={(e) => setTier1Threshold(e.target.value)}
                        type="number"
                        value={tier1Threshold}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Rate (%)</Label>
                      <Input
                        onChange={(e) => setTier1Rate(e.target.value)}
                        type="number"
                        value={tier1Rate}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-lg border p-3">
                  <h4 className="font-semibold text-sm">Tier 2</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Up to ($)</Label>
                      <Input
                        onChange={(e) => setTier2Threshold(e.target.value)}
                        type="number"
                        value={tier2Threshold}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Rate (%)</Label>
                      <Input
                        onChange={(e) => setTier2Rate(e.target.value)}
                        type="number"
                        value={tier2Rate}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-lg border p-3">
                  <h4 className="font-semibold text-sm">Tier 3</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Over ${tier2Threshold}</Label>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Rate (%)</Label>
                      <Input
                        onChange={(e) => setTier3Rate(e.target.value)}
                        type="number"
                        value={tier3Rate}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {calculationType === "technician" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="size-5" />
                  Technician Performance Pay
                </CardTitle>
                <CardDescription>
                  Base pay plus job completion bonuses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="base">Base Hourly Pay ($)</Label>
                  <Input
                    id="base"
                    onChange={(e) => setTechBasePay(e.target.value)}
                    type="number"
                    value={techBasePay}
                  />
                  <p className="text-muted-foreground text-xs">
                    Assuming 40 hours/week, 4 weeks/month
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobs">Jobs Completed (Monthly)</Label>
                  <Input
                    id="jobs"
                    onChange={(e) => setJobsCompleted(e.target.value)}
                    type="number"
                    value={jobsCompleted}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticket">Average Ticket Size ($)</Label>
                  <Input
                    id="ticket"
                    onChange={(e) => setAvgTicket(e.target.value)}
                    type="number"
                    value={avgTicket}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bonus">Bonus per Job ($)</Label>
                  <Input
                    id="bonus"
                    onChange={(e) => setBonusPerJob(e.target.value)}
                    type="number"
                    value={bonusPerJob}
                  />
                  <p className="text-muted-foreground text-xs">
                    Flat bonus paid for each completed job
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results */}
        <div className="space-y-4">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
            <CardHeader>
              <CardTitle>
                {calculationType === "technician"
                  ? "Total Compensation"
                  : "Commission Earned"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-sm">
                    {calculationType === "technician"
                      ? "Monthly Pay"
                      : "Total Commission"}
                  </p>
                  <p className="font-bold text-5xl text-success">
                    ${commission.toFixed(2)}
                  </p>
                </div>
                {calculationType !== "technician" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Commission Rate
                      </p>
                      <p className="font-semibold text-lg">
                        {calculationType === "flat"
                          ? `${flatRate}%`
                          : `${((commission / salesNum) * 100).toFixed(2)}%`}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Total Sales
                      </p>
                      <p className="font-semibold text-lg">
                        ${salesNum.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {calculationType === "tiered" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tier Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Tier 1 (${tier1Threshold} @ {tier1Rate}%)
                    </span>
                    <span className="font-semibold">
                      ${(Math.min(salesNum, tier1Num) * rate1).toFixed(2)}
                    </span>
                  </div>
                  {salesNum > tier1Num && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Tier 2 (${tier2Threshold} @ {tier2Rate}%)
                      </span>
                      <span className="font-semibold">
                        $
                        {(
                          Math.min(
                            Math.max(salesNum - tier1Num, 0),
                            tier2Num - tier1Num
                          ) * rate2
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {salesNum > tier2Num && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Tier 3 ({tier3Rate}%)
                      </span>
                      <span className="font-semibold">
                        ${(Math.max(salesNum - tier2Num, 0) * rate3).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-bold">Total Commission</span>
                    <span className="font-bold text-lg">
                      ${tieredCommission.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {calculationType === "technician" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Compensation Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Base Pay (160 hrs)
                  </span>
                  <span className="font-semibold">
                    ${(basePayNum * 40 * 4).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Performance Bonus
                  </span>
                  <span className="font-semibold">
                    ${performanceBonus.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jobs Completed</span>
                  <span className="font-semibold">{jobsNum} jobs</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Revenue Generated
                  </span>
                  <span className="font-semibold">
                    ${totalRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold">Total Monthly Pay</span>
                  <span className="font-bold text-lg">
                    ${techTotal.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-warning/20 bg-gradient-to-br from-amber-500/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="size-4" />
                Commission Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Clearly communicate commission structure in writing</p>
              <p>• Pay commissions promptly (weekly or bi-weekly)</p>
              <p>• Consider team vs individual metrics</p>
              <p>• Balance commission with quality and customer satisfaction</p>
              <p>• Review and adjust structures quarterly</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

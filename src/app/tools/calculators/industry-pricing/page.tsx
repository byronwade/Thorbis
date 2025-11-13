"use client";

/**
 * Industry Pricing Standards - Client Component
 *
 * Client-side features:
 * - Industry-specific pricing benchmarks
 * - Regional pricing comparisons
 * - Interactive pricing guides
 */

import { AlertCircle, BarChart, DollarSign, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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

type IndustryData = {
  [key: string]: {
    serviceCall: { min: number; max: number; avg: number };
    hourlyRate: { min: number; max: number; avg: number };
    materialMarkup: { min: number; max: number; avg: number };
    avgTicket: { min: number; max: number; avg: number };
  };
};

const industryData: IndustryData = {
  hvac: {
    serviceCall: { min: 75, max: 150, avg: 95 },
    hourlyRate: { min: 85, max: 150, avg: 110 },
    materialMarkup: { min: 25, max: 45, avg: 35 },
    avgTicket: { min: 350, max: 800, avg: 550 },
  },
  plumbing: {
    serviceCall: { min: 70, max: 130, avg: 90 },
    hourlyRate: { min: 90, max: 165, avg: 120 },
    materialMarkup: { min: 30, max: 50, avg: 40 },
    avgTicket: { min: 300, max: 700, avg: 475 },
  },
  electrical: {
    serviceCall: { min: 80, max: 140, avg: 100 },
    hourlyRate: { min: 95, max: 175, avg: 125 },
    materialMarkup: { min: 20, max: 40, avg: 30 },
    avgTicket: { min: 400, max: 900, avg: 600 },
  },
};

export default function IndustryPricingStandards() {
  const [industry, setIndustry] = useState<string>("hvac");
  const [myServiceCall, setMyServiceCall] = useState<string>("95");
  const [myHourlyRate, setMyHourlyRate] = useState<string>("110");
  const [myMarkup, setMyMarkup] = useState<string>("35");

  const benchmarks = industryData[industry];
  const serviceCallNum = Number.parseFloat(myServiceCall) || 0;
  const hourlyNum = Number.parseFloat(myHourlyRate) || 0;
  const markupNum = Number.parseFloat(myMarkup) || 0;

  const getStatus = (value: number, min: number, max: number, avg: number) => {
    if (value < min)
      return {
        label: "Below Market",
        color: "text-destructive",
        bg: "bg-destructive/10",
      };
    if (value > max)
      return {
        label: "Above Market",
        color: "text-warning",
        bg: "bg-warning/10",
      };
    if (value >= avg - 5 && value <= avg + 5)
      return {
        label: "Market Average",
        color: "text-success",
        bg: "bg-success/10",
      };
    return {
      label: "Within Range",
      color: "text-primary",
      bg: "bg-primary/10",
    };
  };

  const serviceCallStatus = getStatus(
    serviceCallNum,
    benchmarks.serviceCall.min,
    benchmarks.serviceCall.max,
    benchmarks.serviceCall.avg
  );
  const hourlyStatus = getStatus(
    hourlyNum,
    benchmarks.hourlyRate.min,
    benchmarks.hourlyRate.max,
    benchmarks.hourlyRate.avg
  );
  const markupStatus = getStatus(
    markupNum,
    benchmarks.materialMarkup.min,
    benchmarks.materialMarkup.max,
    benchmarks.materialMarkup.avg
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5">
            <BarChart className="size-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-3xl tracking-tight">
                Industry Pricing Standards
              </h1>
              <Badge variant="secondary">Premium</Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              Compare your pricing against industry benchmarks and averages
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-blue-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="size-5" />
            How to Use This Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Compare your rates to industry standards:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Select your trade (HVAC, Plumbing, or Electrical)</li>
            <li>Enter your current pricing</li>
            <li>See how you compare to market averages</li>
            <li>
              Data based on 2024 national averages (regional variations apply)
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Industry</CardTitle>
              <CardDescription>
                Select your trade for relevant benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setIndustry} value={industry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select trade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hvac">HVAC</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="size-5" />
                Your Current Pricing
              </CardTitle>
              <CardDescription>Enter your rates to compare</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service">Service Call Fee ($)</Label>
                <Input
                  id="service"
                  onChange={(e) => setMyServiceCall(e.target.value)}
                  type="number"
                  value={myServiceCall}
                />
                <p className="text-muted-foreground text-xs">
                  What you charge just to show up and diagnose
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourly">Hourly Labor Rate ($)</Label>
                <Input
                  id="hourly"
                  onChange={(e) => setMyHourlyRate(e.target.value)}
                  type="number"
                  value={myHourlyRate}
                />
                <p className="text-muted-foreground text-xs">
                  Your labor charge per hour
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="markup">Material Markup (%)</Label>
                <Input
                  id="markup"
                  onChange={(e) => setMyMarkup(e.target.value)}
                  type="number"
                  value={myMarkup}
                />
                <p className="text-muted-foreground text-xs">
                  Percentage added to material costs
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-warning/20 bg-gradient-to-br from-amber-500/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="size-4" />
                Regional Considerations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>Higher Rates:</strong> Urban areas, high cost of living
                regions (CA, NY, MA)
              </p>
              <p>
                <strong>Average Rates:</strong> Suburban and mid-sized cities
              </p>
              <p>
                <strong>Lower Rates:</strong> Rural areas, lower cost of living
                regions
              </p>
              <p className="pt-2">
                Adjust benchmarks ±15-20% based on your location
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
            <CardHeader>
              <CardTitle>Your Pricing Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`rounded-lg p-4 ${serviceCallStatus.bg}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      Service Call Fee
                    </span>
                    <Badge
                      className={serviceCallStatus.color}
                      variant="outline"
                    >
                      {serviceCallStatus.label}
                    </Badge>
                  </div>
                  <p className="mt-1 font-bold text-2xl">${serviceCallNum}</p>
                  <p className="mt-1 text-muted-foreground text-xs">
                    Market Range: ${benchmarks.serviceCall.min} - $
                    {benchmarks.serviceCall.max}
                    (Avg: ${benchmarks.serviceCall.avg})
                  </p>
                </div>

                <div className={`rounded-lg p-4 ${hourlyStatus.bg}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      Hourly Labor Rate
                    </span>
                    <Badge className={hourlyStatus.color} variant="outline">
                      {hourlyStatus.label}
                    </Badge>
                  </div>
                  <p className="mt-1 font-bold text-2xl">${hourlyNum}/hr</p>
                  <p className="mt-1 text-muted-foreground text-xs">
                    Market Range: ${benchmarks.hourlyRate.min} - $
                    {benchmarks.hourlyRate.max}
                    (Avg: ${benchmarks.hourlyRate.avg})
                  </p>
                </div>

                <div className={`rounded-lg p-4 ${markupStatus.bg}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Material Markup</span>
                    <Badge className={markupStatus.color} variant="outline">
                      {markupStatus.label}
                    </Badge>
                  </div>
                  <p className="mt-1 font-bold text-2xl">{markupNum}%</p>
                  <p className="mt-1 text-muted-foreground text-xs">
                    Market Range: {benchmarks.materialMarkup.min}% -{" "}
                    {benchmarks.materialMarkup.max}% (Avg:{" "}
                    {benchmarks.materialMarkup.avg}%)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Industry Benchmarks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-sm">
                    Average Ticket Size
                  </span>
                  <TrendingUp className="size-4 text-muted-foreground" />
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-bold text-xl">
                    ${benchmarks.avgTicket.avg}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Range: ${benchmarks.avgTicket.min} - $
                    {benchmarks.avgTicket.max}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="mb-3 font-semibold text-sm">Pricing Factors</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Service Complexity
                    </span>
                    <span className="font-medium">Varies widely</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Emergency Rates
                    </span>
                    <span className="font-medium">+50-100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      After Hours/Weekend
                    </span>
                    <span className="font-medium">+25-50%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Warranty Work</span>
                    <span className="font-medium">Standard rates</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-success/20 bg-gradient-to-br from-green-500/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="size-4" />
                Pricing Strategy Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>Don't compete on price alone:</strong> Focus on value,
                quality, service
              </p>
              <p>
                <strong>Justify premium pricing:</strong> Warranties,
                certifications, response time
              </p>
              <p>
                <strong>Bundle services:</strong> Maintenance plans, annual
                inspections
              </p>
              <p>
                <strong>Be transparent:</strong> Clear pricing builds trust
              </p>
              <p>
                <strong>Review quarterly:</strong> Adjust for inflation and
                market changes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Market Positioning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">
                    Budget/Value Provider
                  </span>
                  <Badge variant="outline">Below Avg</Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  10-20% below market average - High volume, lower margins
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Market Standard</span>
                  <Badge variant="outline">Market Avg</Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  Within 5% of market average - Competitive positioning
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Premium Provider</span>
                  <Badge variant="outline">Above Avg</Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  10-20% above market average - Premium service, higher margins
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

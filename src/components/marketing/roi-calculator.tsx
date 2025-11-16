"use client";

import {
  BarChart3,
  Calculator,
  DollarSign,
  Info,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAnalytics, useFeatureTracking } from "@/lib/analytics";

const CALCULATION_TRACKING_DEBOUNCE_MS = 1000;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) {
    return "-";
  }
  return currencyFormatter.format(value);
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return "-";
  }
  return numberFormatter.format(value);
}

type RoiInputs = {
  technicianCount: number;
  jobsPerTechPerDay: number;
  averageTicket: number;
  closeRateLift: number;
  minutesSavedPerJob: number;
  hourlyLaborCost: number;
  currentSoftwareSpend: number;
  thorbisPlanCost: number;
};

const DEFAULT_VALUES: RoiInputs = {
  technicianCount: 12,
  jobsPerTechPerDay: 3,
  averageTicket: 650,
  closeRateLift: 8,
  minutesSavedPerJob: 18,
  hourlyLaborCost: 42,
  currentSoftwareSpend: 2900,
  thorbisPlanCost: 3600,
};

export function RoiCalculator() {
  const [inputs, setInputs] = useState<RoiInputs>(DEFAULT_VALUES);
  const { track } = useAnalytics();
  const { trackFeatureUse } = useFeatureTracking();

  const results = useMemo(() => calculateROI(inputs), [inputs]);

  // Track tool opened on mount
  useEffect(() => {
    track({
      name: "tool.opened",
      properties: {
        toolName: "roi-calculator",
        toolCategory: "calculator",
      },
    });
    trackFeatureUse("roi_calculator", { firstTime: true });
  }, [track, trackFeatureUse]);

  // Track calculator completion when a valid calculation is made
  useEffect(() => {
    if (
      Number.isFinite(results.netMonthlyImpact) &&
      results.netMonthlyImpact > 0
    ) {
      const timeoutId = setTimeout(() => {
        track({
          name: "calculator.used",
          properties: {
            calculatorType: "roi",
            inputs: {
              technicianCount: inputs.technicianCount,
              jobsPerTechPerDay: inputs.jobsPerTechPerDay,
              averageTicket: inputs.averageTicket,
            },
            result: {
              netMonthlyImpact: results.netMonthlyImpact,
              roiMultiple: results.roiMultiple,
              laborSavingsMonthly: results.laborSavingsMonthly,
            },
          },
        });
      }, CALCULATION_TRACKING_DEBOUNCE_MS);

      return () => clearTimeout(timeoutId);
    }
  }, [
    results.netMonthlyImpact,
    results.roiMultiple,
    results.laborSavingsMonthly,
    inputs.technicianCount,
    inputs.jobsPerTechPerDay,
    inputs.averageTicket,
    track,
  ]);

  const handleChange =
    (field: keyof RoiInputs) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);
      setInputs((prev) => ({
        ...prev,
        [field]: Number.isFinite(value) ? value : 0,
      }));
    };

  const handleReset = () => {
    setInputs(DEFAULT_VALUES);
  };

  const handleExport = () => {
    const csvRows = [
      ["Metric", "Monthly Value", "Annual Value"],
      [
        "Labor time saved",
        results.laborSavingsMonthly.toFixed(2),
        results.laborSavingsAnnual.toFixed(2),
      ],
      [
        "Additional revenue from higher close rate",
        results.additionalRevenueMonthly.toFixed(2),
        results.additionalRevenueAnnual.toFixed(2),
      ],
      [
        "Total impact",
        results.totalMonthlyImpact.toFixed(2),
        results.totalAnnualImpact.toFixed(2),
      ],
      [
        "Thorbis platform cost",
        (inputs.thorbisPlanCost - inputs.currentSoftwareSpend).toFixed(2),
        ((inputs.thorbisPlanCost - inputs.currentSoftwareSpend) * 12).toFixed(
          2
        ),
      ],
      [
        "Net ROI",
        results.netMonthlyImpact.toFixed(2),
        results.netAnnualImpact.toFixed(2),
      ],
      [
        "ROI multiple",
        results.roiMultiple.toFixed(2),
        results.roiMultiple.toFixed(2),
      ],
    ];

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "thorbis-roi-estimate.csv");
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const LabelWithTooltip = ({
    htmlFor,
    label,
    tooltip,
  }: {
    htmlFor: string;
    label: string;
    tooltip: string;
  }) => (
    <div className="flex items-center gap-1.5">
      <Label className="font-medium text-sm" htmlFor={htmlFor}>
        {label}
      </Label>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="size-3.5 cursor-help text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs leading-relaxed">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground text-xs">
                <Calculator className="size-3.5" />
                ROI Calculator
              </div>
              <h1 className="mb-3 text-balance font-bold text-3xl tracking-tight sm:text-4xl lg:text-5xl">
                Calculate Your Thorbis ROI
              </h1>
              <p className="mx-auto max-w-2xl text-pretty text-base text-muted-foreground leading-relaxed">
                See how much you can save and earn by switching to Thorbis. Use
                your real numbers to project labor savings, revenue lift, and
                net ROI after replacing your legacy field service stack.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-12">
            {/* Inputs Section */}
            <section className="scroll-mt-24" id="inputs">
              <div className="mb-6">
                <h2 className="flex items-center gap-3 font-bold text-2xl tracking-tight">
                  <div className="rounded-lg bg-muted p-2">
                    <DollarSign className="size-5" />
                  </div>
                  Your Business Metrics
                </h2>
                <p className="mt-2 text-muted-foreground text-sm">
                  Enter your current operations data to calculate potential
                  savings
                </p>
              </div>

              <div className="space-y-6 rounded-lg bg-background p-6">
                {/* Team & Operations */}
                <div>
                  <h3 className="mb-3 font-semibold text-foreground text-sm">
                    Team & Operations
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <LabelWithTooltip
                        htmlFor="technicianCount"
                        label="Technicians on the road"
                        tooltip="Number of field technicians actively running jobs. This includes all techs who bill hours to customers."
                      />
                      <Input
                        className="bg-input"
                        id="technicianCount"
                        min={1}
                        onChange={handleChange("technicianCount")}
                        step={1}
                        type="number"
                        value={inputs.technicianCount}
                      />
                    </div>
                    <div className="space-y-2">
                      <LabelWithTooltip
                        htmlFor="jobsPerTechPerDay"
                        label="Jobs per tech per day"
                        tooltip="Average number of jobs each technician completes daily. Industry standard: 2-4 jobs per day."
                      />
                      <Input
                        className="bg-input"
                        id="jobsPerTechPerDay"
                        min={1}
                        onChange={handleChange("jobsPerTechPerDay")}
                        step={0.5}
                        type="number"
                        value={inputs.jobsPerTechPerDay}
                      />
                    </div>
                    <div className="space-y-2">
                      <LabelWithTooltip
                        htmlFor="averageTicket"
                        label="Average job ticket ($)"
                        tooltip="Average revenue per completed job. Include parts, labor, and any service fees."
                      />
                      <Input
                        className="bg-input"
                        id="averageTicket"
                        min={100}
                        onChange={handleChange("averageTicket")}
                        step={25}
                        type="number"
                        value={inputs.averageTicket}
                      />
                    </div>
                  </div>
                </div>

                {/* Efficiency Gains */}
                <div>
                  <h3 className="mb-3 font-semibold text-foreground text-sm">
                    Expected Efficiency Gains with Thorbis
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <LabelWithTooltip
                        htmlFor="closeRateLift"
                        label="Close rate lift (%)"
                        tooltip="Expected improvement in conversion rate from AI booking, automated follow-ups, and better lead management. Conservative estimate: 5-10%."
                      />
                      <Input
                        className="bg-input"
                        id="closeRateLift"
                        min={0}
                        onChange={handleChange("closeRateLift")}
                        step={1}
                        type="number"
                        value={inputs.closeRateLift}
                      />
                    </div>
                    <div className="space-y-2">
                      <LabelWithTooltip
                        htmlFor="minutesSavedPerJob"
                        label="Minutes saved per job"
                        tooltip="Time saved per job through streamlined dispatch, mobile workflows, and digital paperwork. Typical savings: 15-25 minutes per job."
                      />
                      <Input
                        className="bg-input"
                        id="minutesSavedPerJob"
                        min={0}
                        onChange={handleChange("minutesSavedPerJob")}
                        step={1}
                        type="number"
                        value={inputs.minutesSavedPerJob}
                      />
                    </div>
                    <div className="space-y-2">
                      <LabelWithTooltip
                        htmlFor="hourlyLaborCost"
                        label="Loaded labor cost per hour ($)"
                        tooltip="Fully loaded cost per technician hour including wages, benefits, taxes, and overhead. Calculate using our Hourly Rate Calculator."
                      />
                      <Input
                        className="bg-input"
                        id="hourlyLaborCost"
                        min={10}
                        onChange={handleChange("hourlyLaborCost")}
                        step={1}
                        type="number"
                        value={inputs.hourlyLaborCost}
                      />
                    </div>
                  </div>
                </div>

                {/* Software Costs */}
                <div>
                  <h3 className="mb-3 font-semibold text-foreground text-sm">
                    Software Costs
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <LabelWithTooltip
                        htmlFor="currentSoftwareSpend"
                        label="Current software spend / month ($)"
                        tooltip="Total monthly spend on current FSM platform, add-ons, payment processing, marketing tools, and other subscriptions Thorbis will replace."
                      />
                      <Input
                        className="bg-input"
                        id="currentSoftwareSpend"
                        min={0}
                        onChange={handleChange("currentSoftwareSpend")}
                        step={50}
                        type="number"
                        value={inputs.currentSoftwareSpend}
                      />
                    </div>
                    <div className="space-y-2">
                      <LabelWithTooltip
                        htmlFor="thorbisPlanCost"
                        label="Thorbis plan estimate / month ($)"
                        tooltip="Estimated monthly Thorbis cost based on your team size and usage. Starts at $100/month with pay-as-you-go pricing. No per-user fees."
                      />
                      <Input
                        className="bg-input"
                        id="thorbisPlanCost"
                        min={100}
                        onChange={handleChange("thorbisPlanCost")}
                        step={50}
                        type="number"
                        value={inputs.thorbisPlanCost}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 grid gap-4 rounded-lg bg-muted/30 p-4 sm:grid-cols-3">
                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <p className="flex items-center gap-1 font-medium text-muted-foreground text-xs">
                            Monthly Jobs
                            <Info className="size-3" />
                          </p>
                          <p className="mt-1 font-semibold text-2xl">
                            {formatNumber(results.monthlyJobs)}
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          Formula: Technicians × Jobs/Day × 22 Working Days
                          <br />= {inputs.technicianCount} ×{" "}
                          {inputs.jobsPerTechPerDay} × 22
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <p className="flex items-center gap-1 font-medium text-muted-foreground text-xs">
                            Hours Saved / Month
                            <Info className="size-3" />
                          </p>
                          <p className="mt-1 font-semibold text-2xl">
                            {formatNumber(results.hoursSavedMonthly)}
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          Formula: (Minutes Saved × Monthly Jobs) ÷ 60
                          <br />= ({inputs.minutesSavedPerJob} ×{" "}
                          {formatNumber(results.monthlyJobs)}) ÷ 60
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <p className="flex items-center gap-1 font-medium text-muted-foreground text-xs">
                            Additional Jobs / Month
                            <Info className="size-3" />
                          </p>
                          <p className="mt-1 font-semibold text-2xl text-green-600 dark:text-green-500">
                            {formatNumber(
                              results.monthlyJobs * (inputs.closeRateLift / 100)
                            )}
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          Formula: Monthly Jobs × (Close Rate Lift ÷ 100)
                          <br />= {formatNumber(results.monthlyJobs)} × (
                          {inputs.closeRateLift}% ÷ 100)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleExport}
                    type="button"
                    variant="outline"
                  >
                    Export results (CSV)
                  </Button>
                  <Button onClick={handleReset} type="button" variant="ghost">
                    Reset to defaults
                  </Button>
                  <Button asChild type="button" variant="ghost">
                    <Link href="/tools/calculators/hourly-rate">
                      Calculate hourly rate →
                    </Link>
                  </Button>
                </div>
              </div>
            </section>

            {/* Results Section */}
            <section className="scroll-mt-24" id="results">
              <div className="mb-6">
                <h2 className="flex items-center gap-3 font-bold text-2xl tracking-tight">
                  <div className="rounded-lg bg-muted p-2">
                    <TrendingUp className="size-5" />
                  </div>
                  Your ROI Breakdown
                </h2>
                <p className="mt-2 text-muted-foreground text-sm">
                  Conservative estimates based on Thorbis customer averages
                </p>
              </div>

              <div className="space-y-6">
                {/* Impact Cards */}
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Labor Savings */}
                  <div className="rounded-lg bg-background p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-lg bg-blue-500/10 p-2">
                        <DollarSign className="size-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Labor Time Savings
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Efficiency gains from streamlined workflows
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-lg border bg-muted/30 p-4">
                        <p className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                          Monthly Savings
                        </p>
                        <p className="font-bold text-3xl text-blue-600 dark:text-blue-500">
                          {formatCurrency(results.laborSavingsMonthly)}
                        </p>
                        <p className="mt-2 text-muted-foreground text-sm">
                          {formatNumber(results.hoursSavedMonthly)} hours saved
                          × {formatCurrency(inputs.hourlyLaborCost)}/hr
                        </p>
                      </div>
                      <div className="rounded-lg border bg-muted/30 p-4">
                        <p className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                          Annual Savings
                        </p>
                        <p className="font-bold text-3xl text-blue-600 dark:text-blue-500">
                          {formatCurrency(results.laborSavingsAnnual)}
                        </p>
                        <p className="mt-2 text-muted-foreground text-sm">
                          {formatNumber(results.hoursSavedMonthly * 12)} hours
                          saved annually
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Lift */}
                  <div className="rounded-lg bg-background p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-lg bg-green-500/10 p-2">
                        <TrendingUp className="size-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Additional Revenue
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          From higher close rates and automation
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-lg border bg-muted/30 p-4">
                        <p className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                          Monthly Revenue Lift
                        </p>
                        <p className="font-bold text-3xl text-green-600 dark:text-green-500">
                          {formatCurrency(results.additionalRevenueMonthly)}
                        </p>
                        <p className="mt-2 text-muted-foreground text-sm">
                          {formatNumber(
                            results.monthlyJobs * (inputs.closeRateLift / 100)
                          )}{" "}
                          additional jobs ×{" "}
                          {formatCurrency(inputs.averageTicket)}
                        </p>
                      </div>
                      <div className="rounded-lg border bg-muted/30 p-4">
                        <p className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                          Annual Revenue Lift
                        </p>
                        <p className="font-bold text-3xl text-green-600 dark:text-green-500">
                          {formatCurrency(results.additionalRevenueAnnual)}
                        </p>
                        <p className="mt-2 text-muted-foreground text-sm">
                          {formatNumber(
                            results.monthlyJobs *
                              (inputs.closeRateLift / 100) *
                              12
                          )}{" "}
                          additional jobs annually
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Impact */}
                <div className="rounded-lg border-2 border-primary bg-primary/5 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <BarChart3 className="size-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Net Monthly Impact
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        After platform cost
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-lg bg-background/80 p-4">
                      <p className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                        Total Monthly Impact
                      </p>
                      <p className="font-bold text-3xl">
                        {formatCurrency(results.totalMonthlyImpact)}
                      </p>
                      <p className="mt-2 text-muted-foreground text-sm">
                        Savings + Revenue Lift
                      </p>
                    </div>
                    <div className="rounded-lg bg-background/80 p-4">
                      <p className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                        Platform Cost Difference
                      </p>
                      <p className="font-bold text-3xl">
                        {formatCurrency(
                          inputs.thorbisPlanCost - inputs.currentSoftwareSpend
                        )}
                      </p>
                      <p className="mt-2 text-muted-foreground text-sm">
                        Thorbis vs. Current Stack
                      </p>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-4">
                      <p className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                        Net Monthly ROI
                      </p>
                      <p className="font-bold text-4xl text-primary">
                        {formatCurrency(results.netMonthlyImpact)}
                      </p>
                      <p className="mt-2 text-muted-foreground text-sm">
                        {results.roiMultiple.toFixed(1)}x ROI multiple
                      </p>
                    </div>
                  </div>
                </div>

                {/* Annual Projections */}
                <div className="rounded-lg bg-background p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg">
                      12-Month Projections
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Full year impact at current rates
                    </p>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-muted/30">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-sm">
                            Metric
                          </th>
                          <th className="px-4 py-3 text-right font-medium text-sm">
                            Monthly
                          </th>
                          <th className="px-4 py-3 text-right font-medium text-sm">
                            Annual
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        <tr className="hover:bg-muted/20">
                          <td className="px-4 py-3 font-medium text-sm">
                            Labor Savings
                          </td>
                          <td className="px-4 py-3 text-right text-sm">
                            {formatCurrency(results.laborSavingsMonthly)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm">
                            {formatCurrency(results.laborSavingsAnnual)}
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/20">
                          <td className="px-4 py-3 font-medium text-sm">
                            Additional Revenue
                          </td>
                          <td className="px-4 py-3 text-right text-sm">
                            {formatCurrency(results.additionalRevenueMonthly)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm">
                            {formatCurrency(results.additionalRevenueAnnual)}
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/20">
                          <td className="px-4 py-3 font-medium text-sm">
                            Total Impact
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-sm">
                            {formatCurrency(results.totalMonthlyImpact)}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-sm">
                            {formatCurrency(results.totalAnnualImpact)}
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/20">
                          <td className="px-4 py-3 font-medium text-sm">
                            Platform Cost Difference
                          </td>
                          <td className="px-4 py-3 text-right text-sm">
                            {formatCurrency(
                              inputs.thorbisPlanCost -
                                inputs.currentSoftwareSpend
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-sm">
                            {formatCurrency(
                              (inputs.thorbisPlanCost -
                                inputs.currentSoftwareSpend) *
                                12
                            )}
                          </td>
                        </tr>
                        <tr className="bg-muted/50 font-semibold">
                          <td className="px-4 py-3 text-sm">Net ROI</td>
                          <td className="px-4 py-3 text-right font-bold text-primary text-sm">
                            {formatCurrency(results.netMonthlyImpact)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-primary text-sm">
                            {formatCurrency(results.netAnnualImpact)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* CTA */}
                <div className="rounded-lg bg-gradient-to-br from-primary/10 to-transparent p-6 text-center">
                  <div className="mx-auto max-w-2xl">
                    <h3 className="mb-2 font-semibold text-xl">
                      Ready to achieve these results?
                    </h3>
                    <p className="mb-6 text-muted-foreground">
                      Join service businesses saving an average of{" "}
                      {formatCurrency(results.netMonthlyImpact)} per month with
                      Thorbis.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Button asChild size="lg">
                        <Link href="/register">
                          Start 14-day Free Trial
                          <Zap className="ml-2 size-4" />
                        </Link>
                      </Button>
                      <Button asChild size="lg" variant="outline">
                        <Link href="/contact">Talk to Sales</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <div className="mt-12 py-8 text-center text-muted-foreground text-sm">
          Copyright © 2025 - Thorbis. All Rights Reserved.
        </div>
      </div>
    </TooltipProvider>
  );
}

function calculateROI({
  technicianCount,
  jobsPerTechPerDay,
  averageTicket,
  closeRateLift,
  minutesSavedPerJob,
  hourlyLaborCost,
  currentSoftwareSpend,
  thorbisPlanCost,
}: RoiInputs) {
  const workingDaysPerMonth = 22;
  const monthlyJobs = technicianCount * jobsPerTechPerDay * workingDaysPerMonth;
  const minutesSavedPerJobHours = minutesSavedPerJob / 60;
  const hoursSavedMonthly = (minutesSavedPerJob * monthlyJobs) / 60;
  const laborSavingsMonthly = hoursSavedMonthly * hourlyLaborCost;
  const additionalRevenueMonthly =
    monthlyJobs * (closeRateLift / 100) * averageTicket;
  const totalMonthlyImpact = laborSavingsMonthly + additionalRevenueMonthly;

  const thorbisIncrementalSpend = thorbisPlanCost - currentSoftwareSpend;
  const netMonthlyImpact = totalMonthlyImpact - thorbisIncrementalSpend;

  const laborSavingsAnnual = laborSavingsMonthly * 12;
  const additionalRevenueAnnual = additionalRevenueMonthly * 12;
  const totalAnnualImpact = totalMonthlyImpact * 12;
  const netAnnualImpact = netMonthlyImpact * 12;
  const roiMultiple =
    thorbisPlanCost > 0 ? totalMonthlyImpact / thorbisPlanCost : 0;

  return {
    monthlyJobs,
    minutesSavedPerJobHours,
    hoursSavedMonthly,
    laborSavingsMonthly,
    additionalRevenueMonthly,
    totalMonthlyImpact,
    netMonthlyImpact,
    laborSavingsAnnual,
    additionalRevenueAnnual,
    totalAnnualImpact,
    netAnnualImpact,
    roiMultiple,
  };
}

"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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

  const results = useMemo(() => calculateROI(inputs), [inputs]);

  const handleChange =
    (field: keyof RoiInputs) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
      ["Labor time saved", results.laborSavingsMonthly.toFixed(2), results.laborSavingsAnnual.toFixed(2)],
      ["Additional revenue from higher close rate", results.additionalRevenueMonthly.toFixed(2), results.additionalRevenueAnnual.toFixed(2)],
      ["Total impact", results.totalMonthlyImpact.toFixed(2), results.totalAnnualImpact.toFixed(2)],
      ["Thorbis platform cost", (inputs.thorbisPlanCost - inputs.currentSoftwareSpend).toFixed(2), ((inputs.thorbisPlanCost - inputs.currentSoftwareSpend) * 12).toFixed(2)],
      ["Net ROI", results.netMonthlyImpact.toFixed(2), results.netAnnualImpact.toFixed(2)],
      ["ROI multiple", results.roiMultiple.toFixed(2), results.roiMultiple.toFixed(2)],
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

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <form className="space-y-6 rounded-3xl border bg-card p-6 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold">Your baseline metrics</h3>
          <p className="text-muted-foreground text-sm">
            Update the inputs to match your team. We&apos;ll estimate savings and revenue impact after switching to Thorbis.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Technicians on the road"
            value={inputs.technicianCount}
            min={1}
            step={1}
            onChange={handleChange("technicianCount")}
          />
          <Field
            label="Jobs per tech per day"
            value={inputs.jobsPerTechPerDay}
            min={1}
            step={0.5}
            onChange={handleChange("jobsPerTechPerDay")}
          />
          <Field
            label="Average job ticket ($)"
            value={inputs.averageTicket}
            min={100}
            step={25}
            onChange={handleChange("averageTicket")}
          />
          <Field
            label="Close rate lift with Thorbis (%)"
            value={inputs.closeRateLift}
            min={0}
            step={1}
            onChange={handleChange("closeRateLift")}
          />
          <Field
            label="Minutes saved per job"
            value={inputs.minutesSavedPerJob}
            min={0}
            step={1}
            onChange={handleChange("minutesSavedPerJob")}
          />
          <Field
            label="Loaded labor cost per hour ($)"
            value={inputs.hourlyLaborCost}
            min={10}
            step={1}
            onChange={handleChange("hourlyLaborCost")}
          />
          <Field
            label="Current software spend / month ($)"
            value={inputs.currentSoftwareSpend}
            min={0}
            step={50}
            onChange={handleChange("currentSoftwareSpend")}
          />
          <Field
            label="Thorbis plan estimate / month ($)"
            value={inputs.thorbisPlanCost}
            min={500}
            step={50}
            onChange={handleChange("thorbisPlanCost")}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={handleExport} variant="outline">
            Export results (CSV)
          </Button>
          <Button type="button" variant="ghost" onClick={handleReset}>
            Reset to recommended defaults
          </Button>
        </div>
      </form>

      <div className="space-y-6 rounded-3xl border bg-primary/5 p-6 shadow-sm">
        <header>
          <h3 className="text-lg font-semibold">Estimated impact</h3>
          <p className="text-muted-foreground text-sm">
            Conservative savings and revenue gains when Thorbis streamlines dispatch, automations, and AI booking.
          </p>
        </header>

        <ResultBlock
          title="Monthly labor savings"
          primary={`$${results.laborSavingsMonthly.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`}
          description={`${results.minutesSavedPerJobHours.toFixed(1)} hours saved per technician each month.`}
        />

        <ResultBlock
          title="Monthly revenue lift"
          primary={`$${results.additionalRevenueMonthly.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`}
          description="Incremental revenue closed thanks to higher win rates and automated follow-ups."
        />

        <Separator />

        <ResultBlock
          title="Net monthly impact after platform cost"
          highlight
          primary={`$${results.netMonthlyImpact.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`}
          description={`ROI multiple: ${results.roiMultiple.toFixed(1)}x`}
        />

        <div className="rounded-2xl bg-white/80 p-4 text-sm text-muted-foreground shadow-sm">
          <p>
            Thorbis replaces your current stack, saving{" "}
            <strong>${(inputs.thorbisPlanCost - inputs.currentSoftwareSpend).toLocaleString()}</strong> per month in overlapping subscriptions.
          </p>
          <p className="mt-2">
            Looking for a custom financial model?{" "}
            <Button asChild className="inline-flex h-8 px-3" size="sm">
              <Link href="/register">Create your account</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  min,
  step,
}: {
  label: string;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  step?: number;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Input
        aria-label={label}
        inputMode="numeric"
        min={min}
        step={step}
        type="number"
        value={Number.isFinite(value) ? value : ""}
        onChange={onChange}
      />
    </div>
  );
}

function ResultBlock({
  title,
  primary,
  description,
  highlight = false,
}: {
  title: string;
  primary: string;
  description?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight ? "border-primary bg-primary/10" : "border-border/50 bg-background/90"
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <p className="mt-2 text-3xl font-semibold text-foreground">{primary}</p>
      {description ? (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
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
  const monthlyJobs =
    technicianCount * jobsPerTechPerDay * workingDaysPerMonth;
  const minutesSavedPerTechMonthly = minutesSavedPerJob * monthlyJobs;
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


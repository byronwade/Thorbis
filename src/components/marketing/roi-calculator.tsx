"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <form className="space-y-6 rounded-3xl border bg-card p-6 shadow-sm">
        <div>
          <h3 className="font-semibold text-lg">Your baseline metrics</h3>
          <p className="text-muted-foreground text-sm">
            Update the inputs to match your team. We&apos;ll estimate savings
            and revenue impact after switching to Thorbis.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Technicians on the road"
            min={1}
            onChange={handleChange("technicianCount")}
            step={1}
            value={inputs.technicianCount}
          />
          <Field
            label="Jobs per tech per day"
            min={1}
            onChange={handleChange("jobsPerTechPerDay")}
            step={0.5}
            value={inputs.jobsPerTechPerDay}
          />
          <Field
            label="Average job ticket ($)"
            min={100}
            onChange={handleChange("averageTicket")}
            step={25}
            value={inputs.averageTicket}
          />
          <Field
            label="Close rate lift with Thorbis (%)"
            min={0}
            onChange={handleChange("closeRateLift")}
            step={1}
            value={inputs.closeRateLift}
          />
          <Field
            label="Minutes saved per job"
            min={0}
            onChange={handleChange("minutesSavedPerJob")}
            step={1}
            value={inputs.minutesSavedPerJob}
          />
          <Field
            label="Loaded labor cost per hour ($)"
            min={10}
            onChange={handleChange("hourlyLaborCost")}
            step={1}
            value={inputs.hourlyLaborCost}
          />
          <Field
            label="Current software spend / month ($)"
            min={0}
            onChange={handleChange("currentSoftwareSpend")}
            step={50}
            value={inputs.currentSoftwareSpend}
          />
          <Field
            label="Thorbis plan estimate / month ($)"
            min={500}
            onChange={handleChange("thorbisPlanCost")}
            step={50}
            value={inputs.thorbisPlanCost}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleExport} type="button" variant="outline">
            Export results (CSV)
          </Button>
          <Button onClick={handleReset} type="button" variant="ghost">
            Reset to recommended defaults
          </Button>
        </div>
      </form>

      <div className="space-y-6 rounded-3xl border bg-primary/5 p-6 shadow-sm">
        <header>
          <h3 className="font-semibold text-lg">Estimated impact</h3>
          <p className="text-muted-foreground text-sm">
            Conservative savings and revenue gains when Thorbis streamlines
            dispatch, automations, and AI booking.
          </p>
        </header>

        <ResultBlock
          description={`${results.minutesSavedPerJobHours.toFixed(1)} hours saved per technician each month.`}
          primary={`$${results.laborSavingsMonthly.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`}
          title="Monthly labor savings"
        />

        <ResultBlock
          description="Incremental revenue closed thanks to higher win rates and automated follow-ups."
          primary={`$${results.additionalRevenueMonthly.toLocaleString(
            undefined,
            {
              maximumFractionDigits: 0,
            }
          )}`}
          title="Monthly revenue lift"
        />

        <Separator />

        <ResultBlock
          description={`ROI multiple: ${results.roiMultiple.toFixed(1)}x`}
          highlight
          primary={`$${results.netMonthlyImpact.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`}
          title="Net monthly impact after platform cost"
        />

        <div className="rounded-2xl bg-card/80 p-4 text-muted-foreground text-sm shadow-sm">
          <p>
            Thorbis replaces your current stack, saving{" "}
            <strong>
              $
              {(
                inputs.thorbisPlanCost - inputs.currentSoftwareSpend
              ).toLocaleString()}
            </strong>{" "}
            per month in overlapping subscriptions.
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
      <Label className="font-medium text-sm">{label}</Label>
      <Input
        aria-label={label}
        inputMode="numeric"
        min={min}
        onChange={onChange}
        step={step}
        type="number"
        value={Number.isFinite(value) ? value : ""}
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
        highlight
          ? "border-primary bg-primary/10"
          : "border-border/50 bg-background/90"
      }`}
    >
      <p className="text-muted-foreground text-xs uppercase tracking-wide">
        {title}
      </p>
      <p className="mt-2 font-semibold text-3xl text-foreground">{primary}</p>
      {description ? (
        <p className="mt-2 text-muted-foreground text-sm">{description}</p>
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
  const monthlyJobs = technicianCount * jobsPerTechPerDay * workingDaysPerMonth;
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

"use client";

/**
 * Labor Calculator Modal - Client Component
 *
 * Features:
 * - Calculate labor costs based on labor rates
 * - Support different rate types (hourly, per job, etc.)
 * - Handle overtime calculations
 * - Include travel time and break time
 * - Support crew size (multiple workers)
 * - Real-time calculation updates
 * - Add calculated labor to price book items
 *
 * Client-side features:
 * - Interactive form with real-time calculations
 * - Modal dialog for overlay UI
 * - State management for form inputs
 */

import {
  Calculator,
  Clock,
  DollarSign,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

// Mock labor rates - will be replaced with database query
const mockLaborRates = [
  {
    id: "1",
    name: "Master Technician",
    rateType: "hourly" as const,
    baseRate: 7500, // $75.00/hr in cents
    overtimeMultiplier: 1.5,
    skillLevel: "master",
  },
  {
    id: "2",
    name: "Journey Technician",
    rateType: "hourly" as const,
    baseRate: 5500, // $55.00/hr in cents
    overtimeMultiplier: 1.5,
    skillLevel: "journey",
  },
  {
    id: "3",
    name: "Apprentice",
    rateType: "hourly" as const,
    baseRate: 3500, // $35.00/hr in cents
    overtimeMultiplier: 1.5,
    skillLevel: "apprentice",
  },
  {
    id: "4",
    name: "Helper",
    rateType: "hourly" as const,
    baseRate: 2500, // $25.00/hr in cents
    overtimeMultiplier: 1.5,
    skillLevel: "helper",
  },
];

type LaborCalculation = {
  regularHours: number;
  overtimeHours: number;
  regularCost: number;
  overtimeCost: number;
  travelCost: number;
  subtotal: number;
  overhead: number;
  total: number;
  suggestedMarkup: number;
  suggestedPrice: number;
};

interface LaborCalculatorModalProps {
  trigger?: React.ReactNode;
  onAddLabor?: (
    calculation: LaborCalculation & { description: string }
  ) => void;
}

export function LaborCalculatorModal({
  trigger,
  onAddLabor,
}: LaborCalculatorModalProps) {
  // Prevent hydration mismatch by only rendering Dialog after mount
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRateId, setSelectedRateId] = useState<string>(
    mockLaborRates[0]?.id || ""
  );
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [numWorkers, setNumWorkers] = useState("1");
  const [isOvertime, setIsOvertime] = useState(false);
  const [travelHours, setTravelHours] = useState("0");
  const [travelMinutes, setTravelMinutes] = useState("0");

  useEffect(() => {
    setMounted(true);
  }, []);
  const [overheadPercent, setOverheadPercent] = useState("35"); // Industry standard ~35%
  const [markupPercent, setMarkupPercent] = useState("50"); // Suggested markup
  const [description, setDescription] = useState("");

  const selectedRate = mockLaborRates.find(
    (rate) => rate.id === selectedRateId
  );

  // Calculate labor costs
  const calculation = calculateLabor();

  function calculateLabor(): LaborCalculation {
    if (!selectedRate) {
      return {
        regularHours: 0,
        overtimeHours: 0,
        regularCost: 0,
        overtimeCost: 0,
        travelCost: 0,
        subtotal: 0,
        overhead: 0,
        total: 0,
        suggestedMarkup: 0,
        suggestedPrice: 0,
      };
    }

    const totalHours = Number.parseFloat(hours) || 0;
    const totalMinutes = Number.parseFloat(minutes) || 0;
    const workers = Number.parseFloat(numWorkers) || 1;
    const travelHrs = Number.parseFloat(travelHours) || 0;
    const travelMins = Number.parseFloat(travelMinutes) || 0;
    const overheadPct = Number.parseFloat(overheadPercent) || 0;
    const markupPct = Number.parseFloat(markupPercent) || 0;

    // Convert to decimal hours
    const laborHoursPerWorker = totalHours + totalMinutes / 60;
    const travelHoursTotal = travelHrs + travelMins / 60;

    // Calculate regular vs overtime
    let regularHours = 0;
    let overtimeHours = 0;

    if (isOvertime) {
      // Simple model: all hours beyond 8 per day are overtime
      const regularPerWorker = Math.min(laborHoursPerWorker, 8);
      const overtimePerWorker = Math.max(laborHoursPerWorker - 8, 0);
      regularHours = regularPerWorker * workers;
      overtimeHours = overtimePerWorker * workers;
    } else {
      regularHours = laborHoursPerWorker * workers;
      overtimeHours = 0;
    }

    // Calculate costs
    const regularCost = regularHours * selectedRate.baseRate;
    const overtimeCost =
      overtimeHours * selectedRate.baseRate * selectedRate.overtimeMultiplier;
    const travelCost = travelHoursTotal * selectedRate.baseRate * workers;
    const subtotal = regularCost + overtimeCost + travelCost;
    const overhead = subtotal * (overheadPct / 100);
    const total = subtotal + overhead;
    const suggestedMarkup = total * (markupPct / 100);
    const suggestedPrice = total + suggestedMarkup;

    return {
      regularHours,
      overtimeHours,
      regularCost,
      overtimeCost,
      travelCost,
      subtotal,
      overhead,
      total,
      suggestedMarkup,
      suggestedPrice,
    };
  }

  function formatCurrency(cents: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(cents / 100);
  }

  function handleAddLabor() {
    if (onAddLabor) {
      onAddLabor({
        ...calculation,
        description:
          description || `${selectedRate?.name} - ${hours}h ${minutes}m`,
      });
    }
    setOpen(false);
    // Reset form
    setHours("0");
    setMinutes("0");
    setNumWorkers("1");
    setIsOvertime(false);
    setTravelHours("0");
    setTravelMinutes("0");
    setDescription("");
  }

  // Don't render Dialog on server to prevent hydration mismatch
  if (!mounted) {
    return (
      trigger || (
        <Button disabled variant="outline">
          <Calculator className="mr-2 h-4 w-4" />
          Labor Calculator
        </Button>
      )
    );
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Calculator className="mr-2 h-4 w-4" />
            Labor Calculator
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Labor Cost Calculator
          </DialogTitle>
          <DialogDescription>
            Calculate labor costs based on rates, time, and crew size. Results
            can be added to price book items.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            {/* Labor Rate Selection */}
            <div className="space-y-2">
              <Label htmlFor="laborRate">Labor Rate</Label>
              <Select onValueChange={setSelectedRateId} value={selectedRateId}>
                <SelectTrigger id="laborRate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockLaborRates.map((rate) => (
                    <SelectItem key={rate.id} value={rate.id}>
                      {rate.name} - {formatCurrency(rate.baseRate)}/hr
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Estimation */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Estimate (per worker)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Hours</Label>
                  <Input
                    max="24"
                    min="0"
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="0"
                    type="number"
                    value={hours}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">
                    Minutes
                  </Label>
                  <Input
                    max="59"
                    min="0"
                    onChange={(e) => setMinutes(e.target.value)}
                    placeholder="0"
                    type="number"
                    value={minutes}
                  />
                </div>
              </div>
            </div>

            {/* Number of Workers */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2" htmlFor="numWorkers">
                <Users className="h-4 w-4" />
                Number of Workers
              </Label>
              <Input
                id="numWorkers"
                min="1"
                onChange={(e) => setNumWorkers(e.target.value)}
                placeholder="1"
                type="number"
                value={numWorkers}
              />
            </div>

            {/* Overtime Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="overtime">Overtime Hours</Label>
                <p className="text-muted-foreground text-sm">
                  Apply {selectedRate?.overtimeMultiplier}x rate for hours over
                  8
                </p>
              </div>
              <Switch
                checked={isOvertime}
                id="overtime"
                onCheckedChange={setIsOvertime}
              />
            </div>

            {/* Travel Time */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Travel Time (total)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Hours</Label>
                  <Input
                    max="24"
                    min="0"
                    onChange={(e) => setTravelHours(e.target.value)}
                    placeholder="0"
                    type="number"
                    value={travelHours}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">
                    Minutes
                  </Label>
                  <Input
                    max="59"
                    min="0"
                    onChange={(e) => setTravelMinutes(e.target.value)}
                    placeholder="0"
                    type="number"
                    value={travelMinutes}
                  />
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="space-y-2">
              <Label htmlFor="overhead">Overhead / Burden (%)</Label>
              <Input
                id="overhead"
                max="100"
                min="0"
                onChange={(e) => setOverheadPercent(e.target.value)}
                placeholder="35"
                type="number"
                value={overheadPercent}
              />
              <p className="text-muted-foreground text-xs">
                Insurance, benefits, equipment, etc. (typically 25-40%)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="markup">Suggested Markup (%)</Label>
              <Input
                id="markup"
                max="200"
                min="0"
                onChange={(e) => setMarkupPercent(e.target.value)}
                placeholder="50"
                type="number"
                value={markupPercent}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., HVAC System Installation Labor"
                value={description}
              />
            </div>
          </div>

          {/* Right Column - Calculations */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-4 w-4" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Regular Hours */}
                {calculation.regularHours > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Regular Hours ({calculation.regularHours.toFixed(2)} hrs)
                    </span>
                    <span className="font-medium">
                      {formatCurrency(calculation.regularCost)}
                    </span>
                  </div>
                )}

                {/* Overtime Hours */}
                {calculation.overtimeHours > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Overtime Hours ({calculation.overtimeHours.toFixed(2)} hrs
                      @ {selectedRate?.overtimeMultiplier}x)
                    </span>
                    <span className="font-medium">
                      {formatCurrency(calculation.overtimeCost)}
                    </span>
                  </div>
                )}

                {/* Travel Time */}
                {calculation.travelCost > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Travel Time</span>
                    <span className="font-medium">
                      {formatCurrency(calculation.travelCost)}
                    </span>
                  </div>
                )}

                <Separator />

                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal (Labor)
                  </span>
                  <span className="font-medium">
                    {formatCurrency(calculation.subtotal)}
                  </span>
                </div>

                {/* Overhead */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Overhead ({overheadPercent}%)
                  </span>
                  <span className="font-medium">
                    {formatCurrency(calculation.overhead)}
                  </span>
                </div>

                <Separator />

                {/* Total Cost */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total Cost</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(calculation.total)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4" />
                  Pricing Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Markup ({markupPercent}%)
                  </span>
                  <span className="font-medium">
                    {formatCurrency(calculation.suggestedMarkup)}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    Suggested Customer Price
                  </span>
                  <span className="font-bold text-primary text-xl">
                    {formatCurrency(calculation.suggestedPrice)}
                  </span>
                </div>

                <p className="text-muted-foreground text-xs">
                  This is the recommended price to charge your customer,
                  including all costs and markup.
                </p>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              <div className="rounded-lg border bg-muted/50 p-3">
                <div className="font-medium text-muted-foreground">
                  Total Hours
                </div>
                <div className="font-semibold text-lg">
                  {(
                    calculation.regularHours + calculation.overtimeHours
                  ).toFixed(2)}
                </div>
              </div>
              <div className="rounded-lg border bg-muted/50 p-3">
                <div className="font-medium text-muted-foreground">
                  Profit Margin
                </div>
                <div className="font-semibold text-lg">
                  {calculation.total > 0
                    ? (
                        (calculation.suggestedMarkup / calculation.total) *
                        100
                      ).toFixed(0)
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleAddLabor}>
            <Plus className="mr-2 h-4 w-4" />
            Add to Price Book
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

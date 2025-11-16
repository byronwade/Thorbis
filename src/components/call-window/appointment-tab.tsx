"use client";

/**
 * Appointment Tab
 *
 * Appointment scheduling form with AI-suggested dates/times
 */

import { Check, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAutoFill } from "@/hooks/use-auto-fill";
import { cn } from "@/lib/utils";

const DURATION_PRESETS = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "2 hours", value: 120 },
  { label: "4 hours", value: 240 },
  { label: "All day", value: 480 },
];

export function AppointmentTab() {
  const {
    getField,
    updateField,
    approveField,
    rejectField,
    approveAll,
    rejectAll,
    getFieldsByState,
    isExtracting,
  } = useAutoFill("appointment");

  const aiFilledCount =
    getFieldsByState("ai-filled").length +
    getFieldsByState("ai-suggested").length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        {/* AI Status Banner */}
        {isExtracting && (
          <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
            <Sparkles className="h-4 w-4 animate-pulse text-blue-600 dark:text-blue-400" />
            <span className="text-blue-900 text-sm dark:text-blue-100">
              AI is analyzing the conversation...
            </span>
          </div>
        )}

        {/* Bulk Actions */}
        {aiFilledCount > 0 && (
          <div className="flex items-center justify-between rounded-lg border bg-card p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm">
                {aiFilledCount} field{aiFilledCount > 1 ? "s" : ""} auto-filled
                by AI
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                className="gap-1"
                onClick={approveAll}
                size="sm"
                variant="outline"
              >
                <Check className="h-3 w-3" />
                Accept All
              </Button>
              <Button
                className="gap-1"
                onClick={rejectAll}
                size="sm"
                variant="outline"
              >
                <X className="h-3 w-3" />
                Reject All
              </Button>
            </div>
          </div>
        )}

        {/* Date & Time */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Schedule</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <AIField
              approveField={approveField}
              getField={getField}
              label="Date"
              name="date"
              placeholder=""
              rejectField={rejectField}
              type="date"
              updateField={updateField}
            />

            <AIField
              approveField={approveField}
              getField={getField}
              label="Time"
              name="time"
              placeholder=""
              rejectField={rejectField}
              type="time"
              updateField={updateField}
            />
          </div>

          {/* Duration Presets */}
          <div className="space-y-2">
            <Label>Duration</Label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {DURATION_PRESETS.map((preset) => (
                <Button
                  className="w-full"
                  key={preset.value}
                  onClick={() => updateField("duration", preset.value)}
                  size="sm"
                  type="button"
                  variant={
                    getField("duration").value === preset.value
                      ? "default"
                      : "outline"
                  }
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Time Preference */}
          <div className="space-y-2">
            <Label htmlFor="timePreference">Preferred Time of Day</Label>
            <Select
              onValueChange={(value) => updateField("timePreference", value)}
              value={getField("timePreference").value || "anytime"}
            >
              <SelectTrigger
                className={cn(
                  getField("timePreference").state === "ai-filled" &&
                    "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30"
                )}
              >
                <SelectValue placeholder="Select preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                <SelectItem value="afternoon">
                  Afternoon (12PM - 5PM)
                </SelectItem>
                <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                <SelectItem value="anytime">Anytime</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Additional Information</h3>

          <div className="space-y-2">
            <Label htmlFor="notes">Special Requirements</Label>
            <Textarea
              className={cn(
                "min-h-[100px] transition-colors",
                getField("notes").state === "ai-filled" &&
                  "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30",
                getField("notes").state === "ai-suggested" &&
                  "border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/30",
                getField("notes").state === "user-entered" && "border-green-500"
              )}
              id="notes"
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Any special requirements or notes..."
              value={getField("notes").value || ""}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">Save Draft</Button>
          <Button>Schedule Appointment</Button>
        </div>
      </div>
    </div>
  );
}

// AI Field Component
function AIField({
  label,
  name,
  type = "text",
  placeholder,
  getField,
  updateField,
  approveField,
  rejectField,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  getField: (name: string) => { value: any; state: any; confidence?: number };
  updateField: (name: string, value: any) => void;
  approveField: (name: string) => void;
  rejectField: (name: string) => void;
}) {
  const field = getField(name);
  const isAIFilled =
    field.state === "ai-filled" || field.state === "ai-suggested";

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2" htmlFor={name}>
        {label}
        {isAIFilled && (
          <span className="flex items-center gap-1 text-primary text-xs">
            <Sparkles className="h-3 w-3" />
            AI ({field.confidence}%)
          </span>
        )}
      </Label>
      <div className="relative">
        <Input
          className={cn(
            "transition-colors",
            field.state === "ai-filled" &&
              "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30",
            field.state === "ai-suggested" &&
              "border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/30",
            field.state === "user-entered" && "border-green-500"
          )}
          id={name}
          onChange={(e) => updateField(name, e.target.value)}
          placeholder={placeholder}
          type={type}
          value={field.value || ""}
        />
        {isAIFilled && (
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              className="h-6 w-6 hover:bg-green-100 hover:text-green-600"
              onClick={() => approveField(name)}
              size="icon"
              variant="ghost"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              className="h-6 w-6 hover:bg-red-100 hover:text-red-600"
              onClick={() => rejectField(name)}
              size="icon"
              variant="ghost"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

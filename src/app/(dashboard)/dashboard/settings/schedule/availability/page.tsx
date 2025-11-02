"use client";

/**
 * Settings > Schedule > Availability Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { Clock, HelpCircle, Plus, Save, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-settings";
import { getAvailabilitySettings, updateAvailabilitySettings } from "@/actions/settings";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type DayAvailability = {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
  hasBreak: boolean;
};

const defaultWeek: DayAvailability[] = [
  {
    day: "Monday",
    enabled: true,
    startTime: "08:00",
    endTime: "17:00",
    breakStart: "12:00",
    breakEnd: "13:00",
    hasBreak: true,
  },
  {
    day: "Tuesday",
    enabled: true,
    startTime: "08:00",
    endTime: "17:00",
    breakStart: "12:00",
    breakEnd: "13:00",
    hasBreak: true,
  },
  {
    day: "Wednesday",
    enabled: true,
    startTime: "08:00",
    endTime: "17:00",
    breakStart: "12:00",
    breakEnd: "13:00",
    hasBreak: true,
  },
  {
    day: "Thursday",
    enabled: true,
    startTime: "08:00",
    endTime: "17:00",
    breakStart: "12:00",
    breakEnd: "13:00",
    hasBreak: true,
  },
  {
    day: "Friday",
    enabled: true,
    startTime: "08:00",
    endTime: "17:00",
    breakStart: "12:00",
    breakEnd: "13:00",
    hasBreak: true,
  },
  {
    day: "Saturday",
    enabled: false,
    startTime: "09:00",
    endTime: "14:00",
    breakStart: "12:00",
    breakEnd: "13:00",
    hasBreak: false,
  },
  {
    day: "Sunday",
    enabled: false,
    startTime: "09:00",
    endTime: "14:00",
    breakStart: "12:00",
    breakEnd: "13:00",
    hasBreak: false,
  },
];

type Exception = {
  id: string;
  date: string;
  name: string;
  type: "closed" | "modified";
  startTime?: string;
  endTime?: string;
};

export default function AvailabilitySettingsPage() {
  const [availability, setAvailability] = useState(defaultWeek);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    settings,
    isLoading,
    isPending,
    hasUnsavedChanges: hookHasChanges,
    updateSetting,
    saveSettings,
  } = useSettings({
    getter: getAvailabilitySettings,
    setter: updateAvailabilitySettings,
    initialState: {
    allowOnlineBooking: true,
    bookingLeadTime: 24,
    maxAdvanceBooking: 90,
    allowEmergencyBooking: true,
    emergencyFeeAmount: 100,
    emergencyFeeType: "flat",
    allowSameDayBooking: true,
    sameDayLeadTime: 4,
    },
    settingsName: "schedule availability",
    transformLoad: (data) => ({
      bookingLeadTime: data.min_booking_notice_hours ?? 24,
      maxAdvanceBooking: data.max_booking_advance_days ?? 90,
    }),
    transformSave: (settings) => {
      const formData = new FormData();
      const workHours = JSON.stringify(availability.reduce((acc, day) => {
        acc[day.day.toLowerCase()] = {
          start: day.startTime,
          end: day.endTime,
          enabled: day.enabled
        };
        return acc;
      }, {} as any));
      formData.append("defaultWorkHours", workHours);
      formData.append("defaultAppointmentDurationMinutes", "60");
      formData.append("bufferTimeMinutes", "15");
      formData.append("minBookingNoticeHours", settings.bookingLeadTime.toString());
      formData.append("maxBookingAdvanceDays", settings.maxAdvanceBooking.toString());
      formData.append("lunchBreakEnabled", "true");
      formData.append("lunchBreakStart", "12:00");
      formData.append("lunchBreakDurationMinutes", "60");
      return formData;
    },
  });
  const [exceptions, setExceptions] = useState<Exception[]>([
    {
      id: "1",
      date: "2025-12-25",
      name: "Christmas Day",
      type: "closed",
    },
    {
      id: "2",
      date: "2025-07-04",
      name: "Independence Day",
      type: "closed",
    },
  ]);

  const updateAvailability = (
    index: number,
    field: keyof DayAvailability,
    value: string | boolean
  ) => {
    setAvailability((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  const addException = () => {
    const newException: Exception = {
      id: Math.random().toString(),
      date: "",
      name: "",
      type: "closed",
    };
    setExceptions((prev) => [...prev, newException]);
    setHasUnsavedChanges(true);
  };

  const removeException = (id: string) => {
    setExceptions((prev) => prev.filter((e) => e.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-4xl tracking-tight">
              Availability Settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure business hours, booking windows, and schedule exceptions
            </p>
          </div>
          {hasUnsavedChanges && (
            <Button onClick={() => saveSettings()} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="size-4" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>
              Set your regular business hours for each day of the week
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availability.map((day, index) => (
              <div key={day.day}>
                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={day.enabled}
                        onCheckedChange={(checked) =>
                          updateAvailability(index, "enabled", checked)
                        }
                      />
                      <Label className="font-medium">{day.day}</Label>
                    </div>
                  </div>

                  {day.enabled ? (
                    <div className="flex flex-1 items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Input
                          className="w-28"
                          onChange={(e) =>
                            updateAvailability(
                              index,
                              "startTime",
                              e.target.value
                            )
                          }
                          type="time"
                          value={day.startTime}
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          className="w-28"
                          onChange={(e) =>
                            updateAvailability(index, "endTime", e.target.value)
                          }
                          type="time"
                          value={day.endTime}
                        />
                      </div>

                      <Separator className="h-6" orientation="vertical" />

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={day.hasBreak}
                          onCheckedChange={(checked) =>
                            updateAvailability(index, "hasBreak", checked)
                          }
                        />
                        <Label className="text-sm">Break</Label>
                      </div>

                      {day.hasBreak && (
                        <div className="flex items-center gap-2">
                          <Input
                            className="w-28"
                            onChange={(e) =>
                              updateAvailability(
                                index,
                                "breakStart",
                                e.target.value
                              )
                            }
                            type="time"
                            value={day.breakStart}
                          />
                          <span className="text-muted-foreground text-sm">
                            to
                          </span>
                          <Input
                            className="w-28"
                            onChange={(e) =>
                              updateAvailability(
                                index,
                                "breakEnd",
                                e.target.value
                              )
                            }
                            type="time"
                            value={day.breakEnd}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Closed</span>
                  )}
                </div>
                {index < availability.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Windows</CardTitle>
            <CardDescription>
              Control how far in advance customers can book appointments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Minimum Lead Time
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Minimum hours before appointment can be booked
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    className="w-24"
                    min="0"
                    onChange={(e) =>
                      updateSetting("bookingLeadTime", Number(e.target.value))
                    }
                    type="number"
                    value={settings.bookingLeadTime}
                  />
                  <span className="text-muted-foreground text-sm">hours</span>
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Maximum Advance Booking
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Maximum days in advance customers can book
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    className="w-24"
                    min="1"
                    onChange={(e) =>
                      updateSetting("maxAdvanceBooking", Number(e.target.value))
                    }
                    type="number"
                    value={settings.maxAdvanceBooking}
                  />
                  <span className="text-muted-foreground text-sm">days</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Allow Same-Day Booking
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Allow customers to book appointments for today
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Book appointments for the same day
                </p>
              </div>
              <Switch
                checked={settings.allowSameDayBooking}
                onCheckedChange={(checked) =>
                  updateSetting("allowSameDayBooking", checked)
                }
              />
            </div>

            {settings.allowSameDayBooking && (
              <div>
                <Label className="font-medium text-sm">
                  Same-Day Lead Time
                </Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    className="w-24"
                    min="1"
                    onChange={(e) =>
                      updateSetting("sameDayLeadTime", Number(e.target.value))
                    }
                    type="number"
                    value={settings.sameDayLeadTime}
                  />
                  <span className="text-muted-foreground text-sm">
                    hours notice
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Booking</CardTitle>
            <CardDescription>
              Configure emergency booking options and fees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="font-medium text-sm">
                  Allow Emergency Booking
                </Label>
                <p className="text-muted-foreground text-xs">
                  Allow urgent bookings outside normal hours
                </p>
              </div>
              <Switch
                checked={settings.allowEmergencyBooking}
                onCheckedChange={(checked) =>
                  updateSetting("allowEmergencyBooking", checked)
                }
              />
            </div>

            {settings.allowEmergencyBooking && (
              <>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="font-medium text-sm">
                      Emergency Fee Type
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        updateSetting("emergencyFeeType", value)
                      }
                      value={settings.emergencyFeeType}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flat">Flat Fee</SelectItem>
                        <SelectItem value="percentage">
                          Percentage Markup
                        </SelectItem>
                        <SelectItem value="hourly">
                          Hourly Rate Increase
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="font-medium text-sm">
                      Emergency Fee Amount
                    </Label>
                    <div className="mt-2 flex items-center gap-2">
                      {settings.emergencyFeeType === "percentage" && (
                        <span className="text-muted-foreground">+</span>
                      )}
                      {settings.emergencyFeeType === "flat" && (
                        <span className="text-muted-foreground">$</span>
                      )}
                      <Input
                        className="w-24"
                        min="0"
                        onChange={(e) =>
                          updateSetting(
                            "emergencyFeeAmount",
                            Number(e.target.value)
                          )
                        }
                        type="number"
                        value={settings.emergencyFeeAmount}
                      />
                      {settings.emergencyFeeType === "percentage" && (
                        <span className="text-muted-foreground">%</span>
                      )}
                      {settings.emergencyFeeType === "hourly" && (
                        <span className="text-muted-foreground">/hour</span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Schedule Exceptions</CardTitle>
                <CardDescription>
                  Add holidays, closures, and modified hours
                </CardDescription>
              </div>
              <Button onClick={addException} size="sm" variant="outline">
                <Plus className="mr-2 size-4" />
                Add Exception
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {exceptions.map((exception) => (
              <div
                className="flex items-center gap-4 rounded-lg border p-4"
                key={exception.id}
              >
                <div className="grid flex-1 gap-4 sm:grid-cols-3">
                  <div>
                    <Label className="text-sm">Date</Label>
                    <Input
                      className="mt-1"
                      placeholder="YYYY-MM-DD"
                      type="date"
                      value={exception.date}
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Name</Label>
                    <Input
                      className="mt-1"
                      placeholder="Holiday name"
                      value={exception.name}
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Type</Label>
                    <Select value={exception.type}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="modified">Modified Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={() => removeException(exception.id)}
                  size="sm"
                  variant="ghost"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}

            {exceptions.length === 0 && (
              <p className="text-center text-muted-foreground text-sm">
                No schedule exceptions configured
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}

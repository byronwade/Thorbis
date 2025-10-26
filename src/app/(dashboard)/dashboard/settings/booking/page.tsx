"use client";

import {
  Calendar,
  Clock,
  Globe,
  HelpCircle,
  Link2,
  Loader2,
  MapPin,
  Save,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { usePageLayout } from "@/hooks/use-page-layout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Constants
const MIN_BOOKING_WINDOW = 1;
const MAX_BOOKING_WINDOW = 365;
const MIN_CANCELLATION_HOURS = 1;
const MAX_CANCELLATION_HOURS = 72;
const MIN_BUFFER_MINUTES = 0;
const MAX_BUFFER_MINUTES = 120;
const SIMULATED_API_DELAY = 1500;

type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type BusinessHours = {
  enabled: boolean;
  start: string;
  end: string;
};

type BookingSettings = {
  enableOnlineBooking: boolean;
  requireApproval: boolean;
  bookingWindowDays: number;
  bufferTimeBetweenJobs: number;
  cancellationNoticePeriod: number;
  allowCustomerReschedule: boolean;
  sendConfirmationEmail: boolean;
  sendReminderEmail: boolean;
  reminderHoursBefore: number;
  businessHours: Record<DayOfWeek, BusinessHours>;
  defaultJobDuration: number;
  maxBookingsPerDay: number;
  travelRadius: number;
  bookingInstructions: string;
  useCompanyHours: boolean;
  useCompanyServiceArea: boolean;
};

type CompanyProfile = {
  hoursOfOperation: Record<DayOfWeek, BusinessHours>;
  serviceRadius: number;
  city: string;
  state: string;
};

export default function BookingSettingsPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock company profile settings (would come from API/database)
  const companyProfile: CompanyProfile = {
    hoursOfOperation: {
      monday: { enabled: true, start: "08:00", end: "17:00" },
      tuesday: { enabled: true, start: "08:00", end: "17:00" },
      wednesday: { enabled: true, start: "08:00", end: "17:00" },
      thursday: { enabled: true, start: "08:00", end: "17:00" },
      friday: { enabled: true, start: "08:00", end: "17:00" },
      saturday: { enabled: false, start: "09:00", end: "14:00" },
      sunday: { enabled: false, start: "", end: "" },
    },
    serviceRadius: 25,
    city: "San Francisco",
    state: "CA",
  };

  const [settings, setSettings] = useState<BookingSettings>({
    enableOnlineBooking: true,
    requireApproval: false,
    bookingWindowDays: 30,
    bufferTimeBetweenJobs: 15,
    cancellationNoticePeriod: 24,
    allowCustomerReschedule: true,
    sendConfirmationEmail: true,
    sendReminderEmail: true,
    reminderHoursBefore: 24,
    defaultJobDuration: 60,
    maxBookingsPerDay: 10,
    travelRadius: 50,
    bookingInstructions:
      "Please provide detailed information about the service you need. Our team will confirm the appointment within 24 hours.",
    businessHours: {
      monday: { enabled: true, start: "08:00", end: "17:00" },
      tuesday: { enabled: true, start: "08:00", end: "17:00" },
      wednesday: { enabled: true, start: "08:00", end: "17:00" },
      thursday: { enabled: true, start: "08:00", end: "17:00" },
      friday: { enabled: true, start: "08:00", end: "17:00" },
      saturday: { enabled: false, start: "09:00", end: "13:00" },
      sunday: { enabled: false, start: "09:00", end: "13:00" },
    },
    useCompanyHours: true,
    useCompanyServiceArea: true,
  });

  const updateSetting = <K extends keyof BookingSettings>(
    key: K,
    value: BookingSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateBusinessHours = (
    day: DayOfWeek,
    field: keyof BusinessHours,
    value: boolean | string
  ) => {
    setSettings((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value,
        },
      },
    }));
  };

  async function handleSave() {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_API_DELAY));
    // TODO: Save settings to database/API
    setIsSubmitting(false);
  }

  const daysOfWeek: { key: DayOfWeek; label: string }[] = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Booking Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure online booking, availability, and scheduling preferences
          </p>
        </div>

        {/* Inheritance Status Banner */}
        {(settings.useCompanyHours || settings.useCompanyServiceArea) && (
          <Alert>
            <Link2 className="h-4 w-4" />
            <AlertDescription>
              <span className="font-medium">
                Inheriting settings from Company Profile:
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {settings.useCompanyHours && (
                  <Badge variant="secondary">
                    <Clock className="mr-1 h-3 w-3" />
                    Business Hours
                  </Badge>
                )}
                {settings.useCompanyServiceArea && (
                  <Badge variant="secondary">
                    <MapPin className="mr-1 h-3 w-3" />
                    Service Area
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-xs">
                These settings are managed in{" "}
                <a
                  className="font-medium underline underline-offset-4"
                  href="/dashboard/settings/company"
                >
                  Company Profile
                </a>
                . Toggle the switches to customize them for booking.
              </p>
            </AlertDescription>
          </Alert>
        )}

        <Separator />

        {/* Online Booking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" />
              Online Booking
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Allow customers to book appointments through your website
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Control how customers can book appointments online
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable Online Booking
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Allow customers to book appointments through your
                        customer portal
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Customers can book appointments through your website
                </p>
              </div>
              <Switch
                checked={settings.enableOnlineBooking}
                onCheckedChange={(checked) =>
                  updateSetting("enableOnlineBooking", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Require Manual Approval
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Review and approve booking requests before confirming
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Review booking requests before they're confirmed
                </p>
              </div>
              <Switch
                checked={settings.requireApproval}
                disabled={!settings.enableOnlineBooking}
                onCheckedChange={(checked) =>
                  updateSetting("requireApproval", checked)
                }
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Booking Window
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      How far in advance customers can book appointments
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  className="w-24"
                  disabled={!settings.enableOnlineBooking}
                  max={MAX_BOOKING_WINDOW}
                  min={MIN_BOOKING_WINDOW}
                  onChange={(e) =>
                    updateSetting("bookingWindowDays", Number(e.target.value))
                  }
                  type="number"
                  value={settings.bookingWindowDays}
                />
                <span className="text-muted-foreground text-sm">
                  days in advance
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Booking Instructions</Label>
              <Textarea
                className="min-h-[100px] resize-none"
                disabled={!settings.enableOnlineBooking}
                onChange={(e) =>
                  updateSetting("bookingInstructions", e.target.value)
                }
                placeholder="Instructions for customers when booking..."
                value={settings.bookingInstructions}
              />
              <p className="text-muted-foreground text-xs">
                This message will be shown to customers when they book
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4" />
                  Business Hours
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Set your availability for accepting bookings
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Use Company Hours</Label>
                <Switch
                  checked={settings.useCompanyHours}
                  onCheckedChange={(checked) => {
                    updateSetting("useCompanyHours", checked);
                    if (checked) {
                      updateSetting(
                        "businessHours",
                        companyProfile.hoursOfOperation
                      );
                    }
                  }}
                />
              </div>
            </div>
            <CardDescription>
              {settings.useCompanyHours
                ? "Using hours from Company Profile settings"
                : "Set custom booking hours for online appointments"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.useCompanyHours && (
              <Alert>
                <Link2 className="h-4 w-4" />
                <AlertDescription>
                  Business hours are inherited from your{" "}
                  <a
                    className="font-medium underline underline-offset-4"
                    href="/dashboard/settings/company"
                  >
                    Company Profile
                  </a>
                  . Toggle off &quot;Use Company Hours&quot; to customize
                  booking hours.
                </AlertDescription>
              </Alert>
            )}
            {daysOfWeek.map((day) => {
              const displayHours = settings.useCompanyHours
                ? companyProfile.hoursOfOperation[day.key]
                : settings.businessHours[day.key];
              const isInherited = settings.useCompanyHours;

              return (
                <div
                  className={`flex items-center gap-4 rounded-lg border p-3 ${
                    isInherited ? "bg-muted/30" : ""
                  }`}
                  key={day.key}
                >
                  <div className="w-32">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={displayHours.enabled}
                        disabled={isInherited}
                        onCheckedChange={(checked) =>
                          updateBusinessHours(day.key, "enabled", checked)
                        }
                      />
                      <Label
                        className={`font-medium text-sm ${
                          displayHours.enabled ? "" : "text-muted-foreground"
                        }`}
                      >
                        {day.label}
                      </Label>
                      {isInherited && (
                        <Badge className="ml-1 text-xs" variant="secondary">
                          Inherited
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      className="w-32"
                      disabled={!displayHours.enabled || isInherited}
                      onChange={(e) =>
                        updateBusinessHours(day.key, "start", e.target.value)
                      }
                      type="time"
                      value={displayHours.start}
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      className="w-32"
                      disabled={!displayHours.enabled || isInherited}
                      onChange={(e) =>
                        updateBusinessHours(day.key, "end", e.target.value)
                      }
                      type="time"
                      value={displayHours.end}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Scheduling Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              Scheduling Settings
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Configure default job duration and scheduling rules
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Configure default duration and scheduling constraints
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Default Job Duration
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Default length of time for a service appointment
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select
                  onValueChange={(value) =>
                    updateSetting("defaultJobDuration", Number(value))
                  }
                  value={String(settings.defaultJobDuration)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Buffer Time Between Jobs
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Time between appointments for travel and preparation
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    className="w-24"
                    max={MAX_BUFFER_MINUTES}
                    min={MIN_BUFFER_MINUTES}
                    onChange={(e) =>
                      updateSetting(
                        "bufferTimeBetweenJobs",
                        Number(e.target.value)
                      )
                    }
                    type="number"
                    value={settings.bufferTimeBetweenJobs}
                  />
                  <span className="text-muted-foreground text-sm">minutes</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Maximum Bookings Per Day
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Limit the number of appointments accepted daily
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                className="w-32"
                min={1}
                onChange={(e) =>
                  updateSetting("maxBookingsPerDay", Number(e.target.value))
                }
                type="number"
                value={settings.maxBookingsPerDay}
              />
            </div>
          </CardContent>
        </Card>

        {/* Service Area */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" />
                  Service Area
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Define the geographic area you service
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Use Company Service Area</Label>
                <Switch
                  checked={settings.useCompanyServiceArea}
                  onCheckedChange={(checked) => {
                    updateSetting("useCompanyServiceArea", checked);
                    if (checked) {
                      updateSetting(
                        "travelRadius",
                        companyProfile.serviceRadius
                      );
                    }
                  }}
                />
              </div>
            </div>
            <CardDescription>
              {settings.useCompanyServiceArea
                ? "Using service area from Company Profile settings"
                : "Set custom service area for online bookings"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.useCompanyServiceArea && (
              <Alert>
                <Link2 className="h-4 w-4" />
                <AlertDescription>
                  Service area is inherited from your{" "}
                  <a
                    className="font-medium underline underline-offset-4"
                    href="/dashboard/settings/company"
                  >
                    Company Profile
                  </a>
                  . Toggle off &quot;Use Company Service Area&quot; to customize
                  booking service area.
                </AlertDescription>
              </Alert>
            )}
            <div
              className={`space-y-2 rounded-lg border p-4 ${
                settings.useCompanyServiceArea ? "bg-muted/30" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  Travel Radius
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Maximum distance you'll travel from your business
                        address
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  {settings.useCompanyServiceArea && (
                    <Badge className="ml-2 text-xs" variant="secondary">
                      Inherited
                    </Badge>
                  )}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  className="w-24"
                  disabled={settings.useCompanyServiceArea}
                  min={1}
                  onChange={(e) =>
                    updateSetting("travelRadius", Number(e.target.value))
                  }
                  type="number"
                  value={
                    settings.useCompanyServiceArea
                      ? companyProfile.serviceRadius
                      : settings.travelRadius
                  }
                />
                <span className="text-muted-foreground text-sm">
                  miles from business address
                </span>
              </div>
              {settings.useCompanyServiceArea && (
                <p className="mt-2 text-muted-foreground text-xs">
                  Service area centered at {companyProfile.city},{" "}
                  {companyProfile.state}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cancellation & Rescheduling */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Cancellation & Rescheduling
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Set policies for canceling and rescheduling appointments
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Configure cancellation policies and rescheduling options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Cancellation Notice Period
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Minimum notice required for cancellations
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  className="w-24"
                  max={MAX_CANCELLATION_HOURS}
                  min={MIN_CANCELLATION_HOURS}
                  onChange={(e) =>
                    updateSetting(
                      "cancellationNoticePeriod",
                      Number(e.target.value)
                    )
                  }
                  type="number"
                  value={settings.cancellationNoticePeriod}
                />
                <span className="text-muted-foreground text-sm">
                  hours notice
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Allow Customer Rescheduling
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Let customers reschedule their own appointments
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Customers can reschedule their appointments online
                </p>
              </div>
              <Switch
                checked={settings.allowCustomerReschedule}
                onCheckedChange={(checked) =>
                  updateSetting("allowCustomerReschedule", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              Booking Notifications
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Configure automated email notifications for bookings
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Configure automated booking notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Send Confirmation Email
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically send confirmation when booking is made
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Send email when appointment is booked
                </p>
              </div>
              <Switch
                checked={settings.sendConfirmationEmail}
                onCheckedChange={(checked) =>
                  updateSetting("sendConfirmationEmail", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Send Reminder Email
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Send reminder before the scheduled appointment
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Remind customers before their appointment
                </p>
              </div>
              <Switch
                checked={settings.sendReminderEmail}
                onCheckedChange={(checked) =>
                  updateSetting("sendReminderEmail", checked)
                }
              />
            </div>

            {settings.sendReminderEmail && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Reminder Timing
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        When to send the reminder before the appointment
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select
                  onValueChange={(value) =>
                    updateSetting("reminderHoursBefore", Number(value))
                  }
                  value={String(settings.reminderHoursBefore)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour before</SelectItem>
                    <SelectItem value="2">2 hours before</SelectItem>
                    <SelectItem value="4">4 hours before</SelectItem>
                    <SelectItem value="24">1 day before</SelectItem>
                    <SelectItem value="48">2 days before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Reset to Defaults
          </Button>
          <Button disabled={isSubmitting} onClick={handleSave} type="button">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Booking Settings
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}

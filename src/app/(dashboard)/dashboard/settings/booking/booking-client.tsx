"use client";

import {
  CalendarCheck,
  Globe,
  HelpCircle,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { getBookingSettings, updateBookingSettings } from "@/actions/settings";
import { SettingsPageLayout } from "@/components/settings/settings-page-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSettings } from "@/hooks/use-settings";
import {
  BOOKING_NOTICE_MAX,
  BOOKING_NOTICE_MIN,
  BOOKING_PER_DAY_MIN,
  type BookingSettingsState,
  DEFAULT_BOOKING_SETTINGS,
  mapBookingSettings,
} from "./booking-config";

type BookingSettingsClientProps = {
  initialSettings: Partial<BookingSettingsState> | null;
};

export function BookingSettingsClient({
  initialSettings,
}: BookingSettingsClientProps) {
  const {
    settings,
    isLoading,
    isPending,
    hasUnsavedChanges,
    updateSetting,
    saveSettings,
    reload,
  } = useSettings<BookingSettingsState>({
    getter: getBookingSettings,
    setter: updateBookingSettings,
    initialState: DEFAULT_BOOKING_SETTINGS,
    settingsName: "booking",
    prefetchedData: initialSettings ?? undefined,
    transformLoad: (data) => mapBookingSettings(data),
    transformSave: (state) => {
      const formData = new FormData();
      formData.append(
        "onlineBookingEnabled",
        state.onlineBookingEnabled.toString()
      );
      formData.append("requireAccount", state.requireAccount.toString());
      formData.append(
        "requireServiceSelection",
        state.requireServiceSelection.toString()
      );
      formData.append("showPricing", state.showPricing.toString());
      formData.append(
        "allowTimePreferences",
        state.allowTimePreferences.toString()
      );
      formData.append(
        "requireImmediatePayment",
        state.requireImmediatePayment.toString()
      );
      formData.append(
        "sendConfirmationEmail",
        state.sendConfirmationEmail.toString()
      );
      formData.append(
        "sendConfirmationSms",
        state.sendConfirmationSms.toString()
      );
      formData.append(
        "minBookingNoticeHours",
        state.minBookingNoticeHours.toString()
      );
      if (typeof state.maxBookingsPerDay === "number") {
        formData.append(
          "maxBookingsPerDay",
          state.maxBookingsPerDay.toString()
        );
      } else {
        formData.delete("maxBookingsPerDay");
      }
      return formData;
    },
  });

  const handleSave = useCallback(() => {
    saveSettings().catch(() => {
      // handled in hook
    });
  }, [saveSettings]);

  const handleCancel = useCallback(() => {
    reload().catch(() => {
      // handled in hook
    });
  }, [reload]);

  return (
    <TooltipProvider>
      <SettingsPageLayout
        description="Control how customers book time with your team, including guardrails and confirmations."
        hasChanges={hasUnsavedChanges}
        helpText="These defaults power all public booking experiences, including your portal and embedded flows."
        isLoading={isLoading}
        isPending={isPending}
        onCancel={handleCancel}
        onSave={handleSave}
        saveButtonText="Save booking settings"
        title="Booking Rules"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard/settings/operations">Operations</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Booking</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button asChild variant="ghost">
            <Link href="/dashboard/settings">Back to settings overview</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="size-4" />
              Online availability
            </CardTitle>
            <CardDescription>
              Decide who can book, when, and whether you must approve requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Enable online booking
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="size-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Customers can request time via portal and embedded forms.
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Turning this off hides public booking entry points.
                </p>
              </div>
              <Switch
                checked={settings.onlineBookingEnabled}
                onCheckedChange={(checked) =>
                  updateSetting("onlineBookingEnabled", checked)
                }
              />
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Minimum notice
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="size-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Prevent last-minute bookings so dispatch can react.
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    className="w-24"
                    max={BOOKING_NOTICE_MAX}
                    min={BOOKING_NOTICE_MIN}
                    onChange={(event) =>
                      updateSetting(
                        "minBookingNoticeHours",
                        Number(event.target.value)
                      )
                    }
                    type="number"
                    value={settings.minBookingNoticeHours}
                  />
                  <span className="text-muted-foreground text-sm">hours</span>
                </div>
              </div>
              <div>
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Max bookings per day
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="size-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Cap how many self-serve jobs can hit your schedule daily.
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    className="w-24"
                    min={BOOKING_PER_DAY_MIN}
                    onChange={(event) => {
                      const value = event.target.value;
                      updateSetting(
                        "maxBookingsPerDay",
                        value === "" ? null : Number(value)
                      );
                    }}
                    placeholder="Unlimited"
                    type="number"
                    value={
                      typeof settings.maxBookingsPerDay === "number"
                        ? settings.maxBookingsPerDay
                        : ""
                    }
                  />
                  <span className="text-muted-foreground text-sm">per day</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-sm">Require account</p>
                  <p className="text-muted-foreground text-xs">
                    Customers must log in before completing checkout.
                  </p>
                </div>
                <Switch
                  checked={settings.requireAccount}
                  onCheckedChange={(checked) =>
                    updateSetting("requireAccount", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-sm">Require payment upfront</p>
                  <p className="text-muted-foreground text-xs">
                    Collect deposits during booking to reduce no-shows.
                  </p>
                </div>
                <Switch
                  checked={settings.requireImmediatePayment}
                  onCheckedChange={(checked) =>
                    updateSetting("requireImmediatePayment", checked)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              Required inputs
            </CardTitle>
            <CardDescription>
              Gate bookings unless key information is provided
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium text-sm">Service or package</p>
                <p className="text-muted-foreground text-xs">
                  Force customers to choose a service before submitting.
                </p>
              </div>
              <Switch
                checked={settings.requireServiceSelection}
                onCheckedChange={(checked) =>
                  updateSetting("requireServiceSelection", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium text-sm">Show pricing</p>
                <p className="text-muted-foreground text-xs">
                  Display estimated totals when services are selected.
                </p>
              </div>
              <Switch
                checked={settings.showPricing}
                onCheckedChange={(checked) =>
                  updateSetting("showPricing", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium text-sm">Allow time preferences</p>
                <p className="text-muted-foreground text-xs">
                  Customers can specify preferred arrival windows.
                </p>
              </div>
              <Switch
                checked={settings.allowTimePreferences}
                onCheckedChange={(checked) =>
                  updateSetting("allowTimePreferences", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium text-sm">Portal confirmation SMS</p>
                <p className="text-muted-foreground text-xs">
                  Send an SMS confirmation alongside email.
                </p>
              </div>
              <Switch
                checked={settings.sendConfirmationSms}
                onCheckedChange={(checked) =>
                  updateSetting("sendConfirmationSms", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="size-4" />
              Customer communications
            </CardTitle>
            <CardDescription>
              Automated touchpoints triggered by successful bookings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Send confirmation email</p>
                <p className="text-muted-foreground text-xs">
                  Includes job details, calendar invite, and next steps.
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
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium text-sm">SMS confirmations</p>
                <p className="text-muted-foreground text-xs">
                  Requires SMS settings to be configured.
                </p>
              </div>
              <Switch
                checked={settings.sendConfirmationSms}
                onCheckedChange={(checked) =>
                  updateSetting("sendConfirmationSms", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="size-4" />
              Operational guardrails
            </CardTitle>
            <CardDescription>
              Prevent overbooking and keep dispatch predictable
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-xs uppercase">Notice</p>
              <p className="mt-2 font-semibold text-2xl">
                {settings.minBookingNoticeHours}h
              </p>
              <p className="text-muted-foreground text-xs">
                Minimum lead time for any self-serve job
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-xs uppercase">
                Daily cap
              </p>
              <p className="mt-2 font-semibold text-2xl">
                {typeof settings.maxBookingsPerDay === "number"
                  ? settings.maxBookingsPerDay
                  : "Unlimited"}
              </p>
              <p className="text-muted-foreground text-xs">
                Pending bookings routed per day
              </p>
            </div>
          </CardContent>
        </Card>
      </SettingsPageLayout>
    </TooltipProvider>
  );
}

export default BookingSettingsClient;

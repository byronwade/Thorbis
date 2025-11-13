"use client";

/**
 * Settings > Profile > Preferences Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  Check,
  Clock,
  Globe,
  HelpCircle,
  Layout,
  Loader2,
  Monitor,
  Moon,
  Palette,
  Save,
  Sun,
} from "lucide-react";
import { getUserPreferences, updateUserPreferences } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useSettings } from "@/hooks/use-settings";

// Constants
const SIMULATED_API_DELAY = 1500;

type ThemeOption = "light" | "dark" | "system";
type PreferenceSettings = {
  theme: ThemeOption;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  currency: string;
  compactMode: boolean;
  showAnimations: boolean;
  autoSaveForms: boolean;
  sidebarPosition: "left" | "right";
  tableView: "default" | "compact";
};

export default function PreferencesPage() {
  const {
    settings,
    isLoading,
    isPending,
    hasUnsavedChanges,
    updateSetting,
    saveSettings,
  } = useSettings<PreferenceSettings>({
    getter: getUserPreferences,
    setter: updateUserPreferences,
    initialState: {
      theme: "system",
      language: "en-US",
      timezone: "America/New_York",
      dateFormat: "MM/dd/yyyy",
      timeFormat: "12h",
      currency: "USD",
      compactMode: false,
      showAnimations: true,
      autoSaveForms: true,
      sidebarPosition: "right",
      tableView: "default",
    },
    settingsName: "preferences",
    transformLoad: (data) => ({
      theme: data.theme || "system",
      language: data.language || "en-US",
      timezone: data.timezone || "America/New_York",
      dateFormat: data.date_format || "MM/dd/yyyy",
      timeFormat: data.time_format || "12h",
      currency: "USD", // Not in DB yet
      compactMode: false, // Not in DB yet
      showAnimations: true, // Not in DB yet
      autoSaveForms: true, // Not in DB yet
      sidebarPosition: "right", // Not in DB yet
      tableView: data.default_page_size === 10 ? "compact" : "default",
    }),
    transformSave: (settings) => {
      const formData = new FormData();
      formData.append("theme", settings.theme);
      formData.append("language", settings.language);
      formData.append("timezone", settings.timezone);
      formData.append("dateFormat", settings.dateFormat);
      formData.append("timeFormat", settings.timeFormat);
      formData.append(
        "defaultPageSize",
        settings.tableView === "compact" ? "10" : "25"
      );
      return formData;
    },
  });

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
        {/* Header */}
        <div>
          <h1 className="font-bold text-4xl tracking-tight">Preferences</h1>
          <p className="mt-2 text-muted-foreground">
            Customize your interface and application experience
          </p>
        </div>

        <Separator />

        {/* Theme Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="size-4" />
              Interface Theme
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Choose between light, dark, or system theme that follows
                    your device settings
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Select your preferred interface theme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <button
                className={`relative cursor-pointer rounded-lg border-2 p-4 text-left transition-colors ${
                  settings.theme === "light"
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:border-primary/50"
                }`}
                onClick={() => updateSetting("theme", "light")}
                type="button"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Sun className="h-5 w-5 text-warning" />
                  <span className="font-medium">Light</span>
                  {settings.theme === "light" && (
                    <Check className="ml-auto h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  Clean and bright interface
                </p>
              </button>

              <button
                className={`relative cursor-pointer rounded-lg border-2 p-4 text-left transition-colors ${
                  settings.theme === "dark"
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:border-primary/50"
                }`}
                onClick={() => updateSetting("theme", "dark")}
                type="button"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Moon className="h-5 w-5 text-primary" />
                  <span className="font-medium">Dark</span>
                  {settings.theme === "dark" && (
                    <Check className="ml-auto h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  Easy on the eyes
                </p>
              </button>

              <button
                className={`relative cursor-pointer rounded-lg border-2 p-4 text-left transition-colors ${
                  settings.theme === "system"
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:border-primary/50"
                }`}
                onClick={() => updateSetting("theme", "system")}
                type="button"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-accent-foreground" />
                  <span className="font-medium">System</span>
                  {settings.theme === "system" && (
                    <Check className="ml-auto h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  Follows device settings
                </p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Language and Region */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="size-4" />
              Language & Region
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Configure language, timezone, and regional formats for dates
                    and currency
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Set your language, timezone, and regional preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Language
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Set the language for all interface text and labels
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select
                  onValueChange={(value) => updateSetting("language", value)}
                  value={settings.language}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                    <SelectItem value="fr-FR">Français</SelectItem>
                    <SelectItem value="de-DE">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Timezone
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        All times will be displayed in your selected timezone
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select
                  onValueChange={(value) => updateSetting("timezone", value)}
                  value={settings.timezone}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">
                      Eastern Time (EST)
                    </SelectItem>
                    <SelectItem value="America/Chicago">
                      Central Time (CST)
                    </SelectItem>
                    <SelectItem value="America/Denver">
                      Mountain Time (MST)
                    </SelectItem>
                    <SelectItem value="America/Los_Angeles">
                      Pacific Time (PST)
                    </SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Date Format
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Choose how dates are displayed throughout the
                        application
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select
                  onValueChange={(value) => updateSetting("dateFormat", value)}
                  value={settings.dateFormat}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/dd/yyyy">MM/DD/YYYY (US)</SelectItem>
                    <SelectItem value="dd/MM/yyyy">
                      DD/MM/YYYY (European)
                    </SelectItem>
                    <SelectItem value="yyyy-MM-dd">YYYY-MM-DD (ISO)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Time Format
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Choose between 12-hour (AM/PM) or 24-hour time format
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select
                  onValueChange={(value) =>
                    updateSetting("timeFormat", value as "12h" | "24h")
                  }
                  value={settings.timeFormat}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        12-hour (3:00 PM)
                      </div>
                    </SelectItem>
                    <SelectItem value="24h">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        24-hour (15:00)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Currency
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Set your preferred currency for invoices and financial
                      reports
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Select
                onValueChange={(value) => updateSetting("currency", value)}
                value={settings.currency}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                  <SelectItem value="AUD">AUD (A$)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Layout className="size-4" />
              Display Settings
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Customize how content and information is displayed in the
                    interface
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Configure how information is displayed in the interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Compact Mode
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Reduce spacing and padding to show more information on
                        screen
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Show more information in less space
                </p>
              </div>
              <Switch
                checked={settings.compactMode}
                onCheckedChange={(checked) =>
                  updateSetting("compactMode", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Show Animations
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Enable smooth transitions and animations throughout the
                        interface
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Enable interface animations and transitions
                </p>
              </div>
              <Switch
                checked={settings.showAnimations}
                onCheckedChange={(checked) =>
                  updateSetting("showAnimations", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="flex items-center gap-2 font-medium text-sm">
                  Auto-save Forms
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Automatically save form progress to prevent data loss
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-muted-foreground text-xs">
                  Automatically save form data as you type
                </p>
              </div>
              <Switch
                checked={settings.autoSaveForms}
                onCheckedChange={(checked) =>
                  updateSetting("autoSaveForms", checked)
                }
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Sidebar Position
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Choose whether the navigation sidebar appears on the left
                      or right
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Select
                onValueChange={(value) =>
                  updateSetting("sidebarPosition", value as "left" | "right")
                }
                value={settings.sidebarPosition}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left Side</SelectItem>
                  <SelectItem value="right">Right Side</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Table View Density
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Choose between default spacing or compact rows in tables
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Select
                onValueChange={(value) =>
                  updateSetting("tableView", value as "default" | "compact")
                }
                value={settings.tableView}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default (Comfortable)</SelectItem>
                  <SelectItem value="compact">Compact (Dense)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Reset to Defaults
          </Button>
          <Button
            disabled={isPending}
            onClick={() => saveSettings()}
            type="button"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}

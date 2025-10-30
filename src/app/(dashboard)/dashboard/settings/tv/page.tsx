"use client";

/**
 * Tv Leaderboard > Settings Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  ArrowLeft,
  Clock,
  Layout,
  Monitor,
  Palette,
  Save,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ViewMode = "table" | "slideshow";
type DefaultPeriod = "daily" | "weekly" | "monthly" | "yearly" | "all";

export default function TVLeaderboardSettingsPage() {
  // Settings state
  const [defaultViewMode, setDefaultViewMode] = useState<ViewMode>("table");
  const [defaultTimePeriod, setDefaultTimePeriod] =
    useState<DefaultPeriod>("monthly");
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [tableScrollInterval, setTableScrollInterval] = useState(5);
  const [slideshowInterval, setSlideshowInterval] = useState(8);
  const [displayCount, setDisplayCount] = useState(5);
  const [showCompanyGoals, setShowCompanyGoals] = useState(true);
  const [showTrendIndicators, setShowTrendIndicators] = useState(true);
  const [highlightTopThree, setHighlightTopThree] = useState(true);

  const handleSave = () => {
    // Save settings to localStorage or API
    const settings = {
      defaultViewMode,
      defaultTimePeriod,
      autoScrollEnabled,
      tableScrollInterval,
      slideshowInterval,
      displayCount,
      showCompanyGoals,
      showTrendIndicators,
      highlightTopThree,
    };
    localStorage.setItem("tvLeaderboardSettings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  return (
    <div className="relative space-y-8">
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative">
        <Link href="/tv-leaderboard">
          <Button className="mb-4" size="sm" variant="outline">
            <ArrowLeft className="mr-2 size-4" />
            Back to Leaderboard
          </Button>
        </Link>
        <h1 className="font-bold text-4xl tracking-tight">
          TV Leaderboard{" "}
          <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
            Settings
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Customize how the leaderboard appears on TV displays
        </p>
      </div>

      {/* Settings Sections */}
      <div className="relative space-y-6">
        {/* Display Settings */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-background/80 to-background/60 p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/20">
              <Monitor className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-2xl">Display Settings</h2>
              <p className="text-muted-foreground text-sm">
                Configure how data is displayed
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Default View Mode */}
            <div className="space-y-3">
              <label className="font-medium text-sm">Default View Mode</label>
              <div className="flex gap-4">
                <button
                  className={`flex-1 rounded-lg border-2 p-4 text-left transition-all ${defaultViewMode === "table" ? "border-primary bg-primary/10" : "border-primary/20 hover:border-primary/40"}`}
                  onClick={() => setDefaultViewMode("table")}
                  type="button"
                >
                  <Layout className="mb-2 size-6 text-primary" />
                  <p className="font-semibold">Table View</p>
                  <p className="text-muted-foreground text-xs">
                    Show leaderboard as a scrolling table
                  </p>
                </button>
                <button
                  className={`flex-1 rounded-lg border-2 p-4 text-left transition-all ${defaultViewMode === "slideshow" ? "border-primary bg-primary/10" : "border-primary/20 hover:border-primary/40"}`}
                  onClick={() => setDefaultViewMode("slideshow")}
                  type="button"
                >
                  <Users className="mb-2 size-6 text-primary" />
                  <p className="font-semibold">Slideshow View</p>
                  <p className="text-muted-foreground text-xs">
                    Full-screen technician portfolios
                  </p>
                </button>
              </div>
            </div>

            {/* Default Time Period */}
            <div className="space-y-3">
              <label className="font-medium text-sm">Default Time Period</label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "daily",
                    "weekly",
                    "monthly",
                    "yearly",
                    "all",
                  ] as DefaultPeriod[]
                ).map((period) => (
                  <button
                    className={`rounded-lg border-2 px-4 py-2 font-medium text-sm capitalize transition-all ${defaultTimePeriod === period ? "border-primary bg-primary/10 text-primary" : "border-primary/20 hover:border-primary/40"}`}
                    key={period}
                    onClick={() => setDefaultTimePeriod(period)}
                    type="button"
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Display Count */}
            <div className="space-y-3">
              <label className="font-medium text-sm">
                Technicians per Table View
                <span className="ml-2 text-muted-foreground text-xs">
                  (Table mode only)
                </span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  className="w-full rounded-lg border border-primary/20 bg-background px-4 py-2"
                  max={20}
                  min={3}
                  onChange={(e) =>
                    setDisplayCount(Number.parseInt(e.target.value))
                  }
                  type="range"
                  value={displayCount}
                />
                <Badge className="w-16 justify-center" variant="secondary">
                  {displayCount}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-Scroll Settings */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-background/80 to-background/60 p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/20">
              <Clock className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-2xl">Auto-Scroll Settings</h2>
              <p className="text-muted-foreground text-sm">
                Control automatic scrolling behavior
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Enable Auto-Scroll */}
            <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-background/50 p-4">
              <div>
                <p className="font-medium">Enable Auto-Scroll</p>
                <p className="text-muted-foreground text-sm">
                  Automatically cycle through technicians
                </p>
              </div>
              <button
                className={`relative h-8 w-14 rounded-full transition-colors ${autoScrollEnabled ? "bg-primary" : "bg-muted"}`}
                onClick={() => setAutoScrollEnabled(!autoScrollEnabled)}
                type="button"
              >
                <div
                  className={`absolute top-1 size-6 rounded-full bg-white shadow-lg transition-transform ${autoScrollEnabled ? "translate-x-7" : "translate-x-1"}`}
                />
              </button>
            </div>

            {/* Table Scroll Interval */}
            <div className="space-y-3">
              <label className="font-medium text-sm">
                Table Scroll Interval
                <span className="ml-2 text-muted-foreground text-xs">
                  (seconds)
                </span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  className="w-full rounded-lg border border-primary/20 bg-background px-4 py-2"
                  disabled={!autoScrollEnabled}
                  max={30}
                  min={3}
                  onChange={(e) =>
                    setTableScrollInterval(Number.parseInt(e.target.value))
                  }
                  type="range"
                  value={tableScrollInterval}
                />
                <Badge className="w-16 justify-center" variant="secondary">
                  {tableScrollInterval}s
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                How long to display each set of technicians in table view
              </p>
            </div>

            {/* Slideshow Interval */}
            <div className="space-y-3">
              <label className="font-medium text-sm">
                Slideshow Interval
                <span className="ml-2 text-muted-foreground text-xs">
                  (seconds)
                </span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  className="w-full rounded-lg border border-primary/20 bg-background px-4 py-2"
                  disabled={!autoScrollEnabled}
                  max={30}
                  min={5}
                  onChange={(e) =>
                    setSlideshowInterval(Number.parseInt(e.target.value))
                  }
                  type="range"
                  value={slideshowInterval}
                />
                <Badge className="w-16 justify-center" variant="secondary">
                  {slideshowInterval}s
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                How long to display each technician in slideshow view
              </p>
            </div>
          </div>
        </div>

        {/* Visual Settings */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-background/80 to-background/60 p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/20">
              <Palette className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-2xl">Visual Settings</h2>
              <p className="text-muted-foreground text-sm">
                Customize what information is shown
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Show Company Goals */}
            <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-background/50 p-4">
              <div>
                <p className="font-medium">Show Company Goals</p>
                <p className="text-muted-foreground text-sm">
                  Display company performance goals
                </p>
              </div>
              <button
                className={`relative h-8 w-14 rounded-full transition-colors ${showCompanyGoals ? "bg-primary" : "bg-muted"}`}
                onClick={() => setShowCompanyGoals(!showCompanyGoals)}
                type="button"
              >
                <div
                  className={`absolute top-1 size-6 rounded-full bg-white shadow-lg transition-transform ${showCompanyGoals ? "translate-x-7" : "translate-x-1"}`}
                />
              </button>
            </div>

            {/* Show Trend Indicators */}
            <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-background/50 p-4">
              <div>
                <p className="font-medium">Show Trend Indicators</p>
                <p className="text-muted-foreground text-sm">
                  Display green/red arrows for performance trends
                </p>
              </div>
              <button
                className={`relative h-8 w-14 rounded-full transition-colors ${showTrendIndicators ? "bg-primary" : "bg-muted"}`}
                onClick={() => setShowTrendIndicators(!showTrendIndicators)}
                type="button"
              >
                <div
                  className={`absolute top-1 size-6 rounded-full bg-white shadow-lg transition-transform ${showTrendIndicators ? "translate-x-7" : "translate-x-1"}`}
                />
              </button>
            </div>

            {/* Highlight Top Three */}
            <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-background/50 p-4">
              <div>
                <p className="font-medium">Highlight Top Three</p>
                <p className="text-muted-foreground text-sm">
                  Show trophy icons for top performers
                </p>
              </div>
              <button
                className={`relative h-8 w-14 rounded-full transition-colors ${highlightTopThree ? "bg-primary" : "bg-muted"}`}
                onClick={() => setHighlightTopThree(!highlightTopThree)}
                type="button"
              >
                <div
                  className={`absolute top-1 size-6 rounded-full bg-white shadow-lg transition-transform ${highlightTopThree ? "translate-x-7" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Link href="/tv-leaderboard">
            <Button size="lg" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button onClick={handleSave} size="lg">
            <Save className="mr-2 size-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

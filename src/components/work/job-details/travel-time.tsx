/**
 * Travel Time Component
 *
 * Displays real-time travel time from shop to job address
 * Updates automatically every 5 minutes
 */

"use client";

import {
  AlertCircle,
  ArrowRight,
  Building2,
  Clock,
  MapPin,
  RefreshCw,
  Route,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TravelTimeData = {
  duration: number; // seconds
  durationText: string;
  distance: number; // miles
  distanceText: string;
  origin: string;
  destination: string;
};

type TravelTimeProps = {
  property?: {
    address: string;
    address2?: string;
    city: string;
    state: string;
    zipCode?: string;
    zip_code?: string;
    lat?: number | null;
    lon?: number | null;
  };
  className?: string;
};

const REFRESH_INTERVAL_MINUTES = 5;
const SECONDS_PER_MINUTE = 60;
const MILLISECONDS_PER_SECOND = 1000;
const REFRESH_INTERVAL_MS =
  REFRESH_INTERVAL_MINUTES * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;
const SECONDS_PER_HOUR = 3600;

const splitAddress = (address: string | null | undefined) => {
  if (!address) {
    return {
      primary: "Address unavailable",
      secondary: "",
    };
  }
  const parts = address.split(",").map((part) => part.trim());
  return {
    primary: parts[0] ?? address,
    secondary: parts.slice(1).join(", "),
  };
};

const buildDestinationAddress = (
  property: NonNullable<TravelTimeProps["property"]>
) => {
  const address2Part = property.address2 ? `, ${property.address2}` : "";
  const zipCode = property.zipCode || property.zip_code || "";
  return `${property.address}${address2Part}, ${property.city}, ${property.state} ${zipCode}`.trim();
};

const buildApiParams = (property: NonNullable<TravelTimeProps["property"]>) => {
  const params = new URLSearchParams();
  if (property.lat && property.lon) {
    params.set("destinationLat", property.lat.toString());
    params.set("destinationLon", property.lon.toString());
  } else {
    const destinationAddress = buildDestinationAddress(property);
    params.set("destination", destinationAddress);
  }
  return params;
};

export function TravelTime({ property, className }: TravelTimeProps) {
  const [travelTime, setTravelTime] = useState<TravelTimeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTravelTime = useCallback(async () => {
    const hasRequiredFields =
      property?.address && property?.city && property?.state;

    if (!hasRequiredFields) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = buildApiParams(property);
      const response = await fetch(`/api/travel-time?${params.toString()}`, {
        credentials: "same-origin",
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to fetch travel time" }));
        throw new Error(errorData.error || "Failed to fetch travel time");
      }

      const data: TravelTimeData = await response.json();
      setTravelTime(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch travel time"
      );
      setTravelTime(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    property?.address,
    property?.address2,
    property?.city,
    property?.state,
    property?.zipCode,
    property?.zip_code,
    property?.lat,
    property?.lon,
  ]);

  // Use ref to always get latest fetchTravelTime without triggering effect
  const fetchTravelTimeRef = useRef(fetchTravelTime);
  useEffect(() => {
    fetchTravelTimeRef.current = fetchTravelTime;
  }, [fetchTravelTime]);

  // Fetch on mount and set up periodic refresh (every 5 minutes)
  useEffect(() => {
    // Don't do anything if no property
    if (!property?.address) {
      setIsLoading(false);
      return;
    }

    // Fetch immediately on mount
    fetchTravelTimeRef.current();

    // Set up periodic refresh interval (every 5 minutes)
    const interval = setInterval(() => {
      fetchTravelTimeRef.current();
    }, REFRESH_INTERVAL_MS);

    // Always return cleanup function
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount, never re-run

  if (!property?.address) {
    return null;
  }

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / SECONDS_PER_HOUR);
    const minutes = Math.floor(
      (seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE
    );

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatRelativeTime = (date: Date | null) => {
    if (!date) {
      return null;
    }
    const diffMs = date.getTime() - Date.now();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (Math.abs(diffMinutes) < 60) {
      return rtf.format(diffMinutes, "minute");
    }

    const diffHours = Math.round(diffMinutes / 60);
    if (Math.abs(diffHours) < 24) {
      return rtf.format(diffHours, "hour");
    }

    const diffDays = Math.round(diffHours / 24);
    return rtf.format(diffDays, "day");
  };

  const origin = travelTime ? splitAddress(travelTime.origin) : null;
  const destination = travelTime ? splitAddress(travelTime.destination) : null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 text-slate-50 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.55)]",
        className
      )}
    >
      <div className="relative p-5 sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.25),transparent_55%)]" />
        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-[11px] text-slate-200/60 uppercase tracking-[0.24em]">
                <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live Route Intelligence
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-300" />
                <h3 className="font-semibold text-lg text-white">
                  Travel time from company HQ
                </h3>
              </div>
              <p className="text-slate-300/80 text-xs">
                Real-time traffic conditions via Google Distance Matrix
              </p>
            </div>
            {travelTime && !isLoading && (
              <button
                aria-label="Refresh travel time"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-slate-100 text-xs transition hover:border-white/20 hover:bg-white/10"
                onClick={fetchTravelTime}
                type="button"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-rose-200 text-xs">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!error && travelTime && (
            <div className="mt-6 space-y-5 sm:space-y-6">
              <div className="flex flex-wrap items-end gap-6">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-semibold text-4xl text-white tracking-tight sm:text-5xl">
                      {formatDuration(travelTime.duration)}
                    </span>
                    <span className="text-slate-300/80 text-sm">
                      {travelTime.durationText}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-slate-300/80 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Route className="h-3.5 w-3.5 text-slate-300" />
                      {travelTime.distance.toFixed(1)} miles
                      {travelTime.distanceText
                        ? ` (${travelTime.distanceText})`
                        : ""}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      Live with traffic
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 space-y-1.5">
                    <div className="font-semibold text-[11px] text-slate-300/70 uppercase tracking-[0.18em]">
                      Origin — Company HQ
                    </div>
                    <div className="font-medium text-sm text-white">
                      {origin?.primary}
                    </div>
                    {origin?.secondary && (
                      <div className="text-slate-300/75 text-xs">
                        {origin.secondary}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 font-semibold text-[11px] text-slate-300/70 uppercase tracking-[0.18em]">
                      Destination — Job Site
                      <ArrowRight className="h-3 w-3 text-slate-400/80" />
                    </div>
                    <div className="font-medium text-sm text-white">
                      {destination?.primary}
                    </div>
                    {destination?.secondary && (
                      <div className="text-slate-300/75 text-xs">
                        {destination.secondary}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {lastUpdated && (
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400/80">
                  <span>
                    Updated{" "}
                    {lastUpdated.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span>•</span>
                  <span>{formatRelativeTime(lastUpdated)}</span>
                </div>
              )}
            </div>
          )}

          {!(error || travelTime || isLoading) && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-200/80 text-xs">
              Travel time unavailable for this address. Please verify the
              service location.
            </div>
          )}

          {isLoading && (
            <div className="mt-6 flex items-center gap-2 text-slate-200/70 text-xs">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Fetching live route…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

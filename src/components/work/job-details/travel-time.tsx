/**
 * Travel Time Component
 *
 * Displays real-time travel time from shop to job address
 * Updates automatically every 5 minutes
 */

"use client";

import { AlertCircle, Clock, MapPin, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
      // Build destination address
      const address2Part = property.address2 ? `, ${property.address2}` : "";
      const zipCode = property.zipCode || property.zip_code || "";
      const destinationAddress =
        `${property.address}${address2Part}, ${property.city}, ${property.state} ${zipCode}`.trim();

      // Use coordinates if available, otherwise use address
      const params = new URLSearchParams();
      if (property.lat && property.lon) {
        params.set("destinationLat", property.lat.toString());
        params.set("destinationLon", property.lon.toString());
      } else {
        params.set("destination", destinationAddress);
      }

      const response = await fetch(`/api/travel-time?${params.toString()}`);

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

  // Fetch on mount and set up periodic refresh (every 5 minutes)
  useEffect(() => {
    fetchTravelTime();

    const interval = setInterval(() => {
      fetchTravelTime();
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fetchTravelTime]);

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

  return (
    <div className={cn("rounded-lg border bg-card p-3", className)}>
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-primary/10 p-2">
          <Clock className="size-4 text-primary" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="font-semibold text-sm">Travel Time</h3>
            {isLoading && (
              <RefreshCw className="size-3 animate-spin text-muted-foreground" />
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <AlertCircle className="size-3" />
              <span>{error}</span>
            </div>
          )}
          
          {!error && travelTime && (
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-lg text-primary">
                  {formatDuration(travelTime.duration)}
                </span>
                <span className="text-muted-foreground text-xs">
                  {travelTime.durationText}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <MapPin className="size-3" />
                <span>
                  {travelTime.distance.toFixed(1)} mi
                  {travelTime.distanceText
                    ? ` (${travelTime.distanceText})`
                    : ""}
                </span>
              </div>

              {lastUpdated && (
                <p className="mt-1 text-muted-foreground text-xs">
                  Updated {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
          )}
          
          {!error && !travelTime && (
            <p className="text-muted-foreground text-xs">Calculating...</p>
          )}
        </div>

        {!isLoading && travelTime && (
          <button
            aria-label="Refresh travel time"
            className="text-muted-foreground transition-colors hover:text-foreground"
            onClick={fetchTravelTime}
            type="button"
          >
            <RefreshCw className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

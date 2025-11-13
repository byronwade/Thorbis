/**
 * Inline Job Enrichment Component
 *
 * Displays critical operational intelligence inline with job details
 * No cards, minimal UI, important data only
 */

"use client";

import { AlertTriangle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type EnrichmentData = {
  enrichmentStatus?: string;
  recommendations?: {
    shouldReschedule: boolean;
    rescheduleReason?: string;
    upsellOpportunities: string[];
    safetyWarnings: string[];
  };
  weather?: {
    hasActiveAlerts?: boolean;
    alerts?: Array<{
      event: string;
      headline: string;
      severity: string;
      urgency: string;
    }>;
    highestSeverity?: string;
    forecast?: {
      periods?: Array<{
        name: string;
        temperature: number;
        temperatureUnit: string;
        shortForecast: string;
        windSpeed: string;
      }>;
    };
  };
  traffic?: {
    incidents: Array<{
      type:
        | "crash"
        | "construction"
        | "road_closed"
        | "police"
        | "congestion"
        | "other";
      severity: "minor" | "moderate" | "major";
      description: string;
      distance: number;
      affectsRoute: boolean;
    }>;
    nearbyIncidents: number;
    routeAffectingIncidents: number;
  };
  timeZone?: {
    timeZoneId: string;
    timeZoneName: string;
    currentLocalTime: string;
  };
  location?: {
    lat: number;
    lon: number;
    address: string;
  };
};

type JobEnrichmentInlineProps = {
  enrichmentData?: EnrichmentData | null;
  jobId?: string;
  property?: {
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    lat?: number | null;
    lon?: number | null;
  };
};

export function JobEnrichmentInline({
  enrichmentData: initialData,
  jobId,
  property,
}: JobEnrichmentInlineProps) {
  const [enrichmentData, setEnrichmentData] = useState<EnrichmentData | null>(
    initialData || null
  );
  const [isLoading, setIsLoading] = useState(!initialData);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchEnrichment = useCallback(async () => {
    if (!(jobId && property?.address && property?.city && property?.state)) {
      setIsLoading(false);
      return;
    }

    // Prevent re-fetching if already fetched
    if (hasFetched) {
      return;
    }

    setHasFetched(true);

    try {
      const params = new URLSearchParams({
        jobId,
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zip_code || "",
      });

      if (property.lat && property.lon) {
        params.set("lat", property.lat.toString());
        params.set("lon", property.lon.toString());
      }

      const response = await fetch(`/api/job-enrichment?${params.toString()}`);

      if (response.ok) {
        const data = await response.json();
        setEnrichmentData(data);
      }
    } catch (error) {
      // Silently fail - enrichment is non-critical
    } finally {
      setIsLoading(false);
    }
  }, [
    jobId,
    property?.address,
    property?.city,
    property?.state,
    property?.zip_code,
    property?.lat,
    property?.lon,
    hasFetched,
  ]);

  useEffect(() => {
    // Only fetch once on mount if no initial data
    if (!(initialData || hasFetched) && jobId && property) {
      fetchEnrichment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount only

  if (
    isLoading ||
    !enrichmentData ||
    enrichmentData.enrichmentStatus === "failed"
  ) {
    return null;
  }

  const { weather, traffic, recommendations, timeZone } = enrichmentData;

  // Log full data to console for debugging
  if (enrichmentData) {
    console.log("[Job Enrichment] Full data:", enrichmentData);
  }

  const hasWeatherAlerts =
    weather?.hasActiveAlerts && weather?.alerts && weather.alerts.length > 0;
  const hasTrafficIncidents =
    traffic?.incidents && traffic.incidents.length > 0;
  const todayForecast = weather?.forecast?.periods?.[0];
  const shouldReschedule = recommendations?.shouldReschedule;
  const hasSafetyWarnings =
    recommendations?.safetyWarnings &&
    recommendations.safetyWarnings.length > 0;

  // If no important data, don't render anything
  if (
    !(
      hasWeatherAlerts ||
      hasTrafficIncidents ||
      todayForecast ||
      shouldReschedule ||
      hasSafetyWarnings ||
      timeZone
    )
  ) {
    return null;
  }

  // Deduplicate alerts by event type
  const uniqueAlerts =
    hasWeatherAlerts && weather.alerts
      ? weather.alerts.filter(
          (alert, index, self) =>
            index === self.findIndex((a) => a.event === alert.event)
        )
      : [];

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "Extreme":
        return "destructive";
      case "Severe":
        return "default";
      default:
        return "secondary";
    }
  };

  const getTrafficIcon = (type: string) => {
    // Using AlertTriangle for all types for now, could customize
    return AlertTriangle;
  };

  const getTrafficVariant = (severity: string) => {
    switch (severity) {
      case "major":
        return "destructive";
      case "moderate":
        return "default";
      default:
        return "secondary";
    }
  };

  const getTrafficLabel = (type: string) => {
    switch (type) {
      case "crash":
        return "Crash";
      case "construction":
        return "Construction";
      case "road_closed":
        return "Road Closed";
      case "police":
        return "Police Activity";
      case "congestion":
        return "Heavy Traffic";
      default:
        return "Incident";
    }
  };

  return (
    <div className="space-y-3">
      {/* Safety Warnings, Weather Alerts & Traffic - Badges inline */}
      {(uniqueAlerts.length > 0 ||
        hasTrafficIncidents ||
        hasSafetyWarnings) && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Safety Warnings Badge - Always shown first for visibility */}
          {hasSafetyWarnings && recommendations?.safetyWarnings && (
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <Badge className="cursor-help gap-1" variant="destructive">
                  <AlertTriangle className="size-3" />
                  {recommendations.safetyWarnings.length} Safety Warning
                  {recommendations.safetyWarnings.length > 1 ? "s" : ""}
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="w-96">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="size-4" />
                    <h4 className="font-semibold text-sm">Safety Warnings</h4>
                  </div>
                  <ul className="space-y-2">
                    {recommendations.safetyWarnings.map((warning, idx) => (
                      <li
                        className="text-muted-foreground text-xs leading-relaxed"
                        key={idx}
                      >
                        • {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}

          {/* Weather Alerts */}
          {uniqueAlerts.map((alert, index) => (
            <HoverCard key={index} openDelay={200}>
              <HoverCardTrigger asChild>
                <Badge
                  className="cursor-help gap-1.5 font-medium"
                  variant={getSeverityVariant(alert.severity)}
                >
                  <AlertTriangle className="size-3.5" />
                  {alert.event}
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="w-96">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="size-4" />
                    <h4 className="font-semibold text-sm">{alert.event}</h4>
                    <Badge className="ml-auto text-xs" variant="outline">
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {alert.headline}
                  </p>
                  {alert.urgency && (
                    <p className="text-muted-foreground text-xs">
                      <span className="font-medium">Urgency:</span>{" "}
                      {alert.urgency}
                    </p>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}

          {/* Traffic Incidents */}
          {hasTrafficIncidents &&
            traffic.incidents.map((incident, index) => {
              const Icon = getTrafficIcon(incident.type);
              return (
                <HoverCard key={`traffic-${index}`} openDelay={200}>
                  <HoverCardTrigger asChild>
                    <Badge
                      className="cursor-help gap-1"
                      variant={getTrafficVariant(incident.severity)}
                    >
                      <Icon className="size-3" />
                      {getTrafficLabel(incident.type)}
                      {incident.affectsRoute && " (On Route)"}
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-96">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon className="size-4" />
                        <h4 className="font-semibold text-sm">
                          {getTrafficLabel(incident.type)}
                        </h4>
                        <Badge className="ml-auto text-xs" variant="outline">
                          {incident.severity}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {incident.description}
                      </p>
                      <div className="flex items-center gap-4 text-muted-foreground text-xs">
                        <span>
                          <span className="font-medium">Distance:</span>{" "}
                          {incident.distance.toFixed(1)} mi
                        </span>
                        {incident.affectsRoute && (
                          <span className="font-medium text-warning dark:text-warning">
                            Affects your route
                          </span>
                        )}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            })}
        </div>
      )}
    </div>
  );
}

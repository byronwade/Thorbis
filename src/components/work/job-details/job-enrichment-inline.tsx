/**
 * Inline Job Enrichment Component
 * 
 * Displays critical operational intelligence inline with job details
 * No cards, minimal UI, important data only
 */

"use client";

import { AlertTriangle, CloudRain, MapPin, Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  enrichmentData: EnrichmentData | null;
};

export function JobEnrichmentInline({ enrichmentData }: JobEnrichmentInlineProps) {
  if (!enrichmentData || enrichmentData.enrichmentStatus === "failed") {
    return null;
  }

  const { weather, recommendations, timeZone } = enrichmentData;

  // Log full data to console for debugging
  if (enrichmentData) {
    console.log("[Job Enrichment] Full data:", enrichmentData);
  }

  const hasWeatherAlerts = weather?.hasActiveAlerts && weather?.alerts && weather.alerts.length > 0;
  const todayForecast = weather?.forecast?.periods?.[0];
  const shouldReschedule = recommendations?.shouldReschedule;
  const hasSafetyWarnings = recommendations?.safetyWarnings && recommendations.safetyWarnings.length > 0;

  // If no important data, don't render anything
  if (!hasWeatherAlerts && !todayForecast && !shouldReschedule && !hasSafetyWarnings && !timeZone) {
    return null;
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "Extreme":
        return {
          container: "border-red-500/50 bg-red-50 dark:bg-red-950/50",
          icon: "text-red-600 dark:text-red-400",
          text: "text-red-900 dark:text-red-100",
          badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        };
      case "Severe":
        return {
          container: "border-orange-500/50 bg-orange-50 dark:bg-orange-950/50",
          icon: "text-orange-600 dark:text-orange-400",
          text: "text-orange-900 dark:text-orange-100",
          badge: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        };
      default:
        return {
          container: "border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/50",
          icon: "text-yellow-600 dark:text-yellow-400",
          text: "text-yellow-900 dark:text-yellow-100",
          badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        };
    }
  };

  return (
    <div className="space-y-3">
      {/* Weather Alerts - Critical */}
      {hasWeatherAlerts && weather.alerts && weather.alerts.map((alert, index) => {
        const styles = getSeverityStyles(alert.severity);
        return (
          <div
            key={index}
            className={`flex items-start gap-3 rounded-lg border-l-4 p-4 shadow-sm ${styles.container}`}
          >
            <AlertTriangle className={`mt-0.5 size-5 flex-shrink-0 ${styles.icon}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-semibold text-sm ${styles.text}`}>
                  {alert.event}
                </h4>
                <Badge className={`text-xs ${styles.badge}`} variant="secondary">
                  {alert.severity}
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {alert.headline}
              </p>
            </div>
          </div>
        );
      })}

      {/* Reschedule Recommendation - Critical */}
      {shouldReschedule && recommendations?.rescheduleReason && (
        <div className="flex items-start gap-3 rounded-lg border-l-4 border-yellow-500/50 bg-yellow-50 p-4 shadow-sm dark:bg-yellow-950/50">
          <AlertTriangle className="mt-0.5 size-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
          <div className="flex-1">
            <p className="text-sm text-yellow-900 dark:text-yellow-100">
              <span className="font-semibold">Reschedule Recommended:</span>{" "}
              <span className="text-muted-foreground">{recommendations.rescheduleReason}</span>
            </p>
          </div>
        </div>
      )}

      {/* Safety Warnings - Critical */}
      {hasSafetyWarnings && recommendations?.safetyWarnings && recommendations.safetyWarnings.map((warning, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-lg border-l-4 border-red-500/50 bg-red-50 p-4 shadow-sm dark:bg-red-950/50"
        >
          <AlertTriangle className="mt-0.5 size-5 flex-shrink-0 text-red-600 dark:text-red-400" />
          <div className="flex-1">
            <p className="font-semibold text-red-900 text-sm dark:text-red-100">
              Safety Warning
            </p>
            <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
              {warning}
            </p>
          </div>
        </div>
      ))}

      {/* Today's Forecast & Time Zone - Info */}
      <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
        {todayForecast && (
          <>
            <div className="flex items-center gap-1.5">
              <Thermometer className="size-3.5" />
              <span>
                {todayForecast.temperature}°{todayForecast.temperatureUnit}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <CloudRain className="size-3.5" />
              <span>{todayForecast.shortForecast}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              <span>{todayForecast.windSpeed}</span>
            </div>
          </>
        )}
        {timeZone && (
          <div className="flex items-center gap-1.5">
            <span className="font-medium">Local Time:</span>
            <span>{new Date(timeZone.currentLocalTime).toLocaleTimeString()}</span>
            <span className="text-xs">({timeZone.timeZoneId})</span>
          </div>
        )}
      </div>
    </div>
  );
}


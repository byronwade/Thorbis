/**
 * Job Enrichment Panel - Clean shadcn UI Design
 *
 * Displays operational intelligence with minimal, functional design
 */

"use client";

import {
  AlertTriangle,
  Building2,
  Camera,
  Clock,
  CloudRain,
  Droplets,
  ExternalLink,
  Globe,
  Info,
  MapPin,
  Navigation,
  Phone,
  Star,
  Store,
  Thermometer,
  TrendingUp,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ServiceLocationMap } from "@/components/work/job-details/service-location-map";

type EnrichmentData = {
  enrichmentStatus?: string;
  recommendations: {
    shouldReschedule: boolean;
    rescheduleReason?: string;
    upsellOpportunities: string[];
    safetyWarnings: string[];
  };
  propertyData?: {
    address: {
      full: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    characteristics?: {
      propertyType?: string;
      yearBuilt?: number;
      squareFeet?: number;
      bedrooms?: number;
      bathrooms?: number;
      lotSize?: number;
      features?: string[];
    };
    assessment?: {
      assessedValue?: number;
      taxYear?: number;
      annualTax?: number;
    };
    market?: {
      lastSoldPrice?: number;
      lastSoldDate?: string;
      pricePerSqFt?: number;
    };
    dataSource: string;
  };
  buildingData?: {
    footprint?: {
      area?: number;
      perimeter?: number;
    };
    buildingType?: string;
    height?: number;
    levels?: number;
    roofShape?: string;
    roofMaterial?: string;
    wallMaterial?: string;
    constructionDate?: string;
    addressFromOSM?: {
      houseNumber?: string;
      street?: string;
      city?: string;
      state?: string;
      postcode?: string;
    };
    dataSource: string;
  };
  weather?: {
    hasActiveAlerts?: boolean;
    alerts?: Array<{
      event: string;
      severity: string;
      headline: string;
      description: string;
    }>;
    forecast?: {
      periods?: Array<{
        name: string;
        temperature: number;
        temperatureUnit: string;
        windSpeed: string;
        shortForecast: string;
        detailedForecast: string;
      }>;
    };
  };
  waterQuality?: {
    hardness: number;
    classification: string;
    recommendations: {
      shouldOfferSoftener: boolean;
      reason: string;
    };
  };
  locationIntelligence?: {
    county?: {
      countyName: string;
      countyFips?: string;
      stateFips?: string;
      stateCode?: string;
      blockFips?: string;
    };
    floodZone?: {
      zone: string;
      riskLevel: string;
      description: string;
    };
  };
  nearbySuppliers?: Array<{
    name: string;
    distance: number;
    lat: number;
    lon: number;
  }>;
  streetView?: {
    mainView: string;
    alternateViews?: string[];
    heading?: number;
    pitch?: number;
    fov?: number;
    available: boolean;
    dataSource: string;
  };
  googlePlaces?: {
    places: Array<{
      name: string;
      placeId: string;
      rating?: number;
      userRatingsTotal?: number;
      vicinity: string;
      distance: number;
      lat: number;
      lon: number;
      types?: string[];
      openNow?: boolean;
      businessStatus?: string;
      priceLevel?: number;
      photoUrl?: string;
      phoneNumber?: string;
      website?: string;
    }>;
    totalResults: number;
    dataSource: string;
  };
  timeZone?: {
    timeZoneId: string;
    timeZoneName: string;
    rawOffset: number;
    dstOffset: number;
    totalOffset: number;
    totalOffsetHours: number;
    isDST: boolean;
    dataSource: string;
  };
  sources?: string[];
  location?: {
    address?: string;
    lat?: number;
    lon?: number;
  };
};

type JobEnrichmentPanelProps = {
  enrichmentData: EnrichmentData | null;
  onRefresh?: () => void;
};

const MAX_SUPPLIERS = 3;
const M_TO_KM = 1000;
const SQ_M_TO_SQ_FT = 10.764;
const M_TO_FT = 3.281;
const CENTS_TO_DOLLARS = 100;
const URL_KEY_LENGTH = 30;

// Data source tooltips
const getSourceTooltip = (source: string): string => {
  const tooltips: Record<string, string> = {
    nominatim:
      "OpenStreetMap Nominatim - Free geocoding service for address lookup",
    none: "No data sources available - check API configurations",
    nws: "National Weather Service - Free weather forecasts and alerts",
    fcc: "FCC Census Block API - Free location and county information",
    fema: "FEMA NFHL - Free flood zone and risk data",
    overpass: "OpenStreetMap Overpass API - Free nearby points of interest",
    "usgs-elevation": "USGS Elevation API - Free terrain elevation data",
    "osm-walkability":
      "OpenStreetMap - Calculated walkability score based on amenities",
    "osm-schools": "OpenStreetMap - Nearby schools and education facilities",
    "google-places":
      "Google Places API - Business info with reviews and ratings",
    "google-streetview":
      "Google Street View - Property photos from street level",
    "google-timezone": "Google Time Zone API - Automatic timezone detection",
    census: "US Census Bureau - Demographics and population statistics",
    airnow: "AirNow EPA - Air quality index and pollutant data",
    usgs: "USGS Water Services - Water quality and hardness data",
    osm: "OpenStreetMap - Building footprints and characteristics",
    rentcast: "RentCast API - Property details, taxes, and market data",
    attom: "Attom Data - Comprehensive property information",
  };
  return (
    tooltips[source.toLowerCase()] || `${source} - Data enrichment service`
  );
};

// biome-ignore lint: Display component with many conditional sections
export function JobEnrichmentPanel({
  enrichmentData,
}: JobEnrichmentPanelProps) {
  if (!enrichmentData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground text-sm">
            No operational intelligence available
          </p>
        </CardContent>
      </Card>
    );
  }

  if (enrichmentData.enrichmentStatus === "failed") {
    return (
      <Card>
        <CardContent className="py-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load operational intelligence. Please try again.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const {
    propertyData,
    buildingData,
    weather,
    waterQuality,
    locationIntelligence,
    nearbySuppliers,
    streetView,
    googlePlaces,
    timeZone,
    recommendations,
  } = enrichmentData;

  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      {(recommendations.shouldReschedule ||
        weather?.hasActiveAlerts ||
        recommendations.upsellOpportunities.length > 0) && (
        <div className="space-y-3">
          {/* Reschedule Alert */}
          {recommendations.shouldReschedule && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {recommendations.rescheduleReason}
              </AlertDescription>
            </Alert>
          )}

          {/* Weather Alert */}
          {weather?.hasActiveAlerts && weather.alerts?.[0] && (
            <Alert>
              <CloudRain className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium">{weather.alerts[0].event}: </span>
                {weather.alerts[0].headline}
              </AlertDescription>
            </Alert>
          )}

          {/* Upsell Opportunity */}
          {recommendations.upsellOpportunities.length > 0 && (
            <Alert className="border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <AlertDescription className="text-emerald-900 dark:text-emerald-100">
                {recommendations.upsellOpportunities[0]}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Map */}
      {enrichmentData.location && (
        <ServiceLocationMap
          address={{
            street: enrichmentData.location.address?.split(",")[0] || "",
            city: enrichmentData.location.address?.split(",")[1]?.trim() || "",
            state:
              enrichmentData.location.address
                ?.split(",")[2]
                ?.trim()
                .split(" ")[0] || "",
            zipCode:
              enrichmentData.location.address
                ?.split(",")[2]
                ?.trim()
                .split(" ")
                .slice(1)
                .join(" ") || "",
            full: enrichmentData.location.address || "",
          }}
          lat={enrichmentData.location.lat || 0}
          lon={enrichmentData.location.lon || 0}
          nearbySuppliers={nearbySuppliers}
        />
      )}

      {/* Data Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Weather */}
        {weather?.forecast?.periods?.[0] && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-medium text-sm">
                <Thermometer className="h-4 w-4 text-muted-foreground" />
                Weather
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-3xl">
                  {weather.forecast.periods[0].temperature}°
                </span>
                <span className="text-muted-foreground text-sm">
                  {weather.forecast.periods[0].windSpeed}
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {weather.forecast.periods[0].detailedForecast}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Property */}
        {propertyData &&
          (propertyData.characteristics?.yearBuilt ||
            propertyData.characteristics?.squareFeet ||
            propertyData.assessment?.assessedValue ||
            propertyData.market?.lastSoldPrice) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-medium text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  Property
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {propertyData.characteristics?.squareFeet && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Size</span>
                    <span className="font-medium">
                      {propertyData.characteristics.squareFeet.toLocaleString()}{" "}
                      sq ft
                    </span>
                  </div>
                )}
                {propertyData.characteristics?.yearBuilt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Built</span>
                    <span className="font-medium">
                      {propertyData.characteristics.yearBuilt}
                    </span>
                  </div>
                )}
                {propertyData.assessment?.assessedValue && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Assessed</span>
                    <span className="font-medium">
                      $
                      {(
                        propertyData.assessment.assessedValue / CENTS_TO_DOLLARS
                      ).toLocaleString()}
                    </span>
                  </div>
                )}
                {propertyData.market?.lastSoldPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Sold</span>
                    <span className="font-medium">
                      $
                      {(
                        propertyData.market.lastSoldPrice / CENTS_TO_DOLLARS
                      ).toLocaleString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        {/* Building (OSM) */}
        {buildingData &&
          (buildingData.footprint?.area ||
            buildingData.height ||
            buildingData.levels ||
            buildingData.buildingType) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-medium text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  Building
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {buildingData.buildingType && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">
                      {buildingData.buildingType}
                    </span>
                  </div>
                )}
                {buildingData.footprint?.area && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Footprint</span>
                    <span className="font-medium">
                      {Math.round(
                        buildingData.footprint.area * SQ_M_TO_SQ_FT
                      ).toLocaleString()}{" "}
                      sq ft
                    </span>
                  </div>
                )}
                {buildingData.height && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Height</span>
                    <span className="font-medium">
                      {Math.round(buildingData.height * M_TO_FT)} ft
                    </span>
                  </div>
                )}
                {buildingData.levels && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Floors</span>
                    <span className="font-medium">{buildingData.levels}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        {/* Water Quality */}
        {waterQuality && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-medium text-sm">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                Water Quality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Hardness</span>
                <Badge variant="outline">{waterQuality.classification}</Badge>
              </div>
              {waterQuality.recommendations.shouldOfferSoftener && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {waterQuality.recommendations.reason}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Location */}
        {locationIntelligence?.county?.countyName && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-medium text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">County</span>
                <span className="font-medium">
                  {locationIntelligence.county.countyName}
                </span>
              </div>
              {locationIntelligence.floodZone && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Flood Zone</span>
                  <Badge
                    variant={
                      locationIntelligence.floodZone.riskLevel === "high"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {locationIntelligence.floodZone.zone}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Time Zone */}
        {timeZone && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-medium text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Time Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Zone</span>
                  <span className="font-medium">{timeZone.timeZoneName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Offset</span>
                  <Badge variant="secondary">
                    UTC{timeZone.totalOffsetHours >= 0 ? "+" : ""}
                    {timeZone.totalOffsetHours}
                  </Badge>
                </div>
                {timeZone.isDST && (
                  <Badge className="text-xs" variant="outline">
                    Daylight Saving Time
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nearby Suppliers (OSM Fallback) */}
        {!googlePlaces && nearbySuppliers && nearbySuppliers.length > 0 && (
          <Card className="sm:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-medium text-sm">
                <Store className="h-4 w-4 text-muted-foreground" />
                Nearby Suppliers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {nearbySuppliers.slice(0, MAX_SUPPLIERS).map((supplier) => (
                  <div
                    className="flex items-center justify-between"
                    key={`${supplier.name}-${supplier.lat}-${supplier.lon}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-sm">
                        {supplier.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {supplier.distance
                          ? `${(supplier.distance / M_TO_KM).toFixed(1)} km`
                          : "—"}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="ghost">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${supplier.lat},${supplier.lon}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Navigation className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Street View Photos */}
      {streetView?.available && streetView.mainView && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Camera className="h-5 w-5 text-primary" />
                Property Street View
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main View */}
              <div className="overflow-hidden rounded-lg border">
                {/* biome-ignore lint/a11y/useAltText: Google Street View external API image */}
                {/* biome-ignore lint/a11y/noSvgWithoutTitle: External API image */}
                <img
                  alt="Property street view"
                  className="h-auto w-full"
                  height="400"
                  loading="lazy"
                  src={streetView.mainView}
                  width="600"
                />
              </div>

              {/* Alternate Views */}
              {streetView.alternateViews &&
                streetView.alternateViews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {streetView.alternateViews.map((view) => (
                      <div
                        className="overflow-hidden rounded-md border"
                        key={`view-${view.substring(0, URL_KEY_LENGTH)}`}
                      >
                        {/* biome-ignore lint/a11y/useAltText: Google Street View external API image */}
                        {/* biome-ignore lint/a11y/noSvgWithoutTitle: External API image */}
                        <img
                          alt="Property from alternate angle"
                          className="h-auto w-full"
                          height="400"
                          loading="lazy"
                          src={view}
                          width="600"
                        />
                      </div>
                    ))}
                  </div>
                )}

              <p className="text-muted-foreground text-xs">
                Street view images provided by Google Maps
              </p>
            </CardContent>
          </Card>
        </>
      )}

      {/* Google Places - Nearby Suppliers with Reviews */}
      {googlePlaces && googlePlaces.places.length > 0 && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  Nearby Suppliers
                </span>
                <Badge variant="secondary">
                  {googlePlaces.totalResults} found
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {googlePlaces.places.slice(0, MAX_SUPPLIERS).map((place) => (
                  <div
                    className="flex gap-4 rounded-lg border p-4"
                    key={place.placeId}
                  >
                    {/* Photo */}
                    {place.photoUrl && (
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                        {/* biome-ignore lint/a11y/useAltText: Google Places external API photo */}
                        {/* biome-ignore lint/a11y/noSvgWithoutTitle: External API image */}
                        <img
                          alt={place.name}
                          className="h-full w-full object-cover"
                          height="80"
                          loading="lazy"
                          src={place.photoUrl}
                          width="80"
                        />
                      </div>
                    )}

                    {/* Info */}
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate font-semibold text-sm">
                            {place.name}
                          </h4>
                          <p className="truncate text-muted-foreground text-xs">
                            {place.vicinity}
                          </p>
                        </div>
                        <Badge
                          className="flex-shrink-0 text-xs"
                          variant="outline"
                        >
                          {(place.distance / M_TO_KM).toFixed(1)} km
                        </Badge>
                      </div>

                      {/* Rating */}
                      {place.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-sm">
                              {place.rating.toFixed(1)}
                            </span>
                          </div>
                          {place.userRatingsTotal && (
                            <span className="text-muted-foreground text-xs">
                              ({place.userRatingsTotal.toLocaleString()}{" "}
                              reviews)
                            </span>
                          )}
                          {place.openNow !== undefined && (
                            <Badge
                              className="text-xs"
                              variant={place.openNow ? "default" : "secondary"}
                            >
                              {place.openNow ? "Open" : "Closed"}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button asChild size="sm" variant="outline">
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <Navigation className="mr-1 h-3 w-3" />
                            Directions
                          </a>
                        </Button>
                        {place.phoneNumber && (
                          <Button asChild size="sm" variant="outline">
                            <a href={`tel:${place.phoneNumber}`}>
                              <Phone className="mr-1 h-3 w-3" />
                              Call
                            </a>
                          </Button>
                        )}
                        {place.website && (
                          <Button asChild size="sm" variant="outline">
                            <a
                              href={place.website}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              <Globe className="mr-1 h-3 w-3" />
                              Website
                            </a>
                          </Button>
                        )}
                        <Button asChild size="sm" variant="ghost">
                          <a
                            href={`https://www.google.com/maps/place/?q=place_id:${place.placeId}`}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <ExternalLink className="mr-1 h-3 w-3" />
                            View on Maps
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Data Sources */}
      {enrichmentData.sources && enrichmentData.sources.length > 0 && (
        <>
          <Separator />
          <TooltipProvider>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-xs">
                Data sources:
              </span>
              {enrichmentData.sources.map((source) => (
                <Tooltip key={source}>
                  <TooltipTrigger asChild>
                    <Badge className="cursor-help" variant="secondary">
                      {source.toUpperCase()}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      {getSourceTooltip(source)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
          {/* RentCast Reminder - Only show if API key is truly not configured */}
          {enrichmentData.sources.includes("none") &&
            !enrichmentData.propertyData && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Tip:</strong> Add a RentCast API key for property
                  details (50 free requests/month)
                </AlertDescription>
              </Alert>
            )}
          {/* Property data not available for this location */}
          {enrichmentData.sources.includes("none") &&
            enrichmentData.propertyData && (
              <Alert variant="default">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Note:</strong> Property data not available for this
                  rural location in RentCast database
                </AlertDescription>
              </Alert>
            )}

          {/* Google Services Info */}
          {enrichmentData.sources.some((s) =>
            ["google-streetview", "google-places", "google-timezone"].includes(
              s
            )
          ) &&
            (() => {
              const googleFeatures = [];
              if (streetView?.available)
                googleFeatures.push("Street View photos");
              if (googlePlaces?.places?.length)
                googleFeatures.push("supplier details");
              if (timeZone) googleFeatures.push("timezone data");

              if (googleFeatures.length === 0) return null;

              return (
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <Camera className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-sm">
                    <strong>Google Maps:</strong> {googleFeatures.join(", ")}{" "}
                    available (100% FREE - 25k+ requests/month)
                  </AlertDescription>
                </Alert>
              );
            })()}
        </>
      )}
    </div>
  );
}

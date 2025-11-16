/**
 * Property Location Visual - Enhanced property visualization
 *
 * Shows maps, street view, and Google Earth views in one consolidated component
 * Avoids repeating the address multiple times
 * Includes nearby supply houses and integrated directions
 */

"use client";

import {
  Camera,
  Globe,
  MapPin,
  Maximize2,
  Navigation,
  Store,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PropertyLocationVisualProps = {
  property: {
    address: string;
    address2?: string | null;
    city: string;
    state: string;
    zip_code: string;
    lat?: number | null;
    lon?: number | null;
  };
  nearbySuppliers?: Array<{
    name: string;
    distance: number;
    address: string;
  }>;
};

export function PropertyLocationVisual({
  property,
  nearbySuppliers = [],
}: PropertyLocationVisualProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("map");

  // Format address for display (shown once)
  const fullAddress = [
    property.address,
    property.address2,
    `${property.city}, ${property.state} ${property.zip_code}`,
  ]
    .filter(Boolean)
    .join("\n");

  // Format address for URL encoding
  const addressForUrl = [
    property.address,
    property.address2,
    property.city,
    property.state,
    property.zip_code,
  ]
    .filter(Boolean)
    .join(", ");

  const encodedAddress = encodeURIComponent(addressForUrl);

  // Destination for URLs (prefer coordinates, fallback to address)
  const destination =
    property.lat && property.lon
      ? `${property.lat},${property.lon}`
      : encodedAddress;

  // Combined Map + Directions + Supply Houses URL
  // This shows the destination with a route from current location AND nearby places
  const combinedMapUrl = `https://www.google.com/maps/embed/v1/directions?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"}&origin=current+location&destination=${destination}&mode=driving`;

  // Navigation URL for "Open in Maps" button
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

  // Street View - REQUIRES coordinates (lat/lon) - Google Maps Embed API doesn't accept addresses for street view
  const hasCoordinates = Boolean(property.lat && property.lon);
  const streetViewUrl = hasCoordinates
    ? `https://www.google.com/maps/embed/v1/streetview?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"}&location=${property.lat},${property.lon}&heading=0&pitch=0&fov=90`
    : null;

  // Google Earth-like experience using Maps API with satellite view
  // Use search mode for addresses, view mode for coordinates
  const earthViewUrl = hasCoordinates
    ? `https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"}&center=${property.lat},${property.lon}&zoom=18&maptype=satellite`
    : `https://www.google.com/maps/embed/v1/search?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"}&q=${encodedAddress}&zoom=18&maptype=satellite`;

  const googleEarthWebUrl =
    property.lat && property.lon
      ? `https://earth.google.com/web/@${property.lat},${property.lon},0a,1000d,35y,0h,0t,0r`
      : `https://earth.google.com/web/search/${encodedAddress}`;

  return (
    <>
      <div className="space-y-3 p-4 sm:p-6">
        {/* Address - Shown once at the top */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
              Service Location
            </div>
            <Button
              asChild
              className="h-7 gap-1.5 px-2 text-xs"
              size="sm"
              variant="outline"
            >
              <a href={googleMapsUrl} rel="noopener noreferrer" target="_blank">
                <Navigation className="size-3" />
                Open in Maps
              </a>
            </Button>
          </div>
          <div className="whitespace-pre-line text-foreground text-sm leading-relaxed">
            {fullAddress}
          </div>
        </div>

        {/* Visual Tabs - Map (with directions & supply houses), Street View, Earth */}
        <Tabs className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid h-9 w-full grid-cols-3">
            <TabsTrigger className="gap-1.5 text-xs" value="map">
              <Navigation className="size-3.5" />
              Map
            </TabsTrigger>
            <TabsTrigger
              className="gap-1.5 text-xs"
              disabled={!streetViewUrl}
              value="street"
            >
              <Camera className="size-3.5" />
              Street
            </TabsTrigger>
            <TabsTrigger className="gap-1.5 text-xs" value="earth">
              <Globe className="size-3.5" />
              Earth
            </TabsTrigger>
          </TabsList>

          {/* Map View with Directions & Supply Houses */}
          <TabsContent className="mt-3 space-y-3" value="map">
            <div className="group relative overflow-hidden rounded-lg border bg-muted">
              <div className="relative h-[200px] w-full">
                <iframe
                  className="h-full w-full"
                  frameBorder="0"
                  loading="lazy"
                  src={combinedMapUrl}
                  style={{ border: 0 }}
                  title="Property Map with Directions"
                />
                <Button
                  className="absolute top-2 right-2 h-8 w-8 bg-card/90 shadow-md hover:bg-card"
                  onClick={() => {
                    setActiveTab("map");
                    setIsExpanded(true);
                  }}
                  size="icon"
                  variant="ghost"
                >
                  <Maximize2 className="h-4 w-4 text-foreground" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Shows route from your current location
              </span>
              {nearbySuppliers.length > 0 && (
                <Badge className="gap-1" variant="secondary">
                  <Store className="size-3" />
                  {nearbySuppliers.length} nearby
                </Badge>
              )}
            </div>
          </TabsContent>

          {/* Street View */}
          <TabsContent className="mt-3 space-y-3" value="street">
            {streetViewUrl ? (
              <>
                <div className="group relative overflow-hidden rounded-lg border bg-muted">
                  <div className="relative h-[200px] w-full">
                    <iframe
                      className="h-full w-full"
                      frameBorder="0"
                      loading="lazy"
                      src={streetViewUrl}
                      style={{ border: 0 }}
                      title="Property Street View"
                    />
                    <Button
                      className="absolute top-2 right-2 h-8 w-8 bg-card/90 shadow-md hover:bg-card"
                      onClick={() => {
                        setActiveTab("street");
                        setIsExpanded(true);
                      }}
                      size="icon"
                      variant="ghost"
                    >
                      <Maximize2 className="h-4 w-4 text-foreground" />
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">
                  360° ground-level view of the property
                </p>
              </>
            ) : (
              <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border bg-muted/50 p-6 text-center">
                <Camera className="mx-auto mb-3 size-10 text-muted-foreground opacity-30" />
                <p className="mb-1 font-medium text-foreground text-sm">
                  Street View Unavailable
                </p>
                <p className="max-w-xs text-muted-foreground text-xs">
                  Add GPS coordinates (latitude/longitude) to the property to
                  enable street-level imagery
                </p>
              </div>
            )}
          </TabsContent>

          {/* Google Earth Satellite View */}
          <TabsContent className="mt-3 space-y-3" value="earth">
            <div className="group relative overflow-hidden rounded-lg border bg-muted">
              <div className="relative h-[200px] w-full">
                <iframe
                  className="h-full w-full"
                  frameBorder="0"
                  loading="lazy"
                  src={earthViewUrl}
                  style={{ border: 0 }}
                  title="Satellite View"
                />
                <Button
                  className="absolute top-2 right-2 h-8 w-8 bg-card/90 shadow-md hover:bg-card"
                  onClick={() => {
                    setActiveTab("earth");
                    setIsExpanded(true);
                  }}
                  size="icon"
                  variant="ghost"
                >
                  <Maximize2 className="h-4 w-4 text-foreground" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Satellite imagery view
              </span>
              <Button
                asChild
                className="h-6 gap-1 px-2 text-xs"
                size="sm"
                variant="ghost"
              >
                <a
                  href={googleEarthWebUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Globe className="size-3" />
                  Open Google Earth
                </a>
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Coordinates (if available) */}
        {property.lat && property.lon && (
          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Coordinates:</span>
              <span className="font-medium font-mono text-foreground">
                {property.lat.toFixed(4)}, {property.lon.toFixed(4)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Expanded View Dialog */}
      <Dialog onOpenChange={setIsExpanded} open={isExpanded}>
        <DialogContent className="max-w-5xl p-0">
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Service Location
            </DialogTitle>
            <div className="mt-2 whitespace-pre-line text-muted-foreground text-sm">
              {fullAddress}
            </div>
          </DialogHeader>

          <Tabs
            className="w-full"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <div className="border-b px-6">
              <TabsList className="h-10">
                <TabsTrigger className="gap-2" value="map">
                  <Navigation className="size-4" />
                  Map & Route
                </TabsTrigger>
                <TabsTrigger
                  className="gap-2"
                  disabled={!streetViewUrl}
                  value="street"
                >
                  <Camera className="size-4" />
                  Street View
                </TabsTrigger>
                <TabsTrigger className="gap-2" value="earth">
                  <Globe className="size-4" />
                  Satellite
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent className="m-0" value="map">
              <div className="h-[600px] w-full">
                <iframe
                  className="h-full w-full"
                  frameBorder="0"
                  loading="lazy"
                  src={combinedMapUrl}
                  style={{ border: 0 }}
                  title="Property Map with Directions - Expanded"
                />
              </div>
            </TabsContent>

            <TabsContent className="m-0" value="street">
              {streetViewUrl ? (
                <div className="h-[600px] w-full">
                  <iframe
                    className="h-full w-full"
                    frameBorder="0"
                    loading="lazy"
                    src={streetViewUrl}
                    style={{ border: 0 }}
                    title="Property Street View - Expanded"
                  />
                </div>
              ) : (
                <div className="flex h-[600px] flex-col items-center justify-center bg-muted/50 p-12 text-center">
                  <Camera className="mx-auto mb-4 size-16 text-muted-foreground opacity-20" />
                  <p className="mb-2 font-semibold text-foreground text-lg">
                    Street View Unavailable
                  </p>
                  <p className="max-w-md text-muted-foreground text-sm">
                    Add GPS coordinates (latitude/longitude) to the property to
                    enable street-level imagery
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent className="m-0" value="earth">
              <div className="h-[600px] w-full">
                <iframe
                  className="h-full w-full"
                  frameBorder="0"
                  loading="lazy"
                  src={earthViewUrl}
                  style={{ border: 0 }}
                  title="Satellite View - Expanded"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between border-t px-6 py-4">
            <div className="flex items-center gap-4 text-sm">
              {property.lat && property.lon && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4" />
                  <span className="font-mono text-xs">
                    {property.lat.toFixed(6)}, {property.lon.toFixed(6)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button asChild className="gap-2" size="sm" variant="outline">
                <a
                  href={googleEarthWebUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Globe className="size-4" />
                  Open in Google Earth
                </a>
              </Button>
              <Button asChild className="gap-2" size="sm">
                <a
                  href={googleMapsUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Navigation className="size-4" />
                  Open in Google Maps
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

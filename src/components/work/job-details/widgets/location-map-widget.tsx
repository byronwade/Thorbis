/**
 * Location Map Widget - Server Component
 *
 * Displays job site location on a map with directions and address information.
 * Uses static map image for performance (Server Component compatible).
 *
 * Performance optimizations:
 * - Server Component by default
 * - Static map image (no heavy map library)
 * - Fallback to address display if map unavailable
 */

import { ExternalLink, MapPin, Navigation } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Job, Property } from "@/lib/db/schema";

type LocationMapWidgetProps = {
  job: Job;
  property?: Property;
};

export function LocationMapWidget({ job, property }: LocationMapWidgetProps) {
  if (!property) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-center">
        <div>
          <MapPin className="mx-auto mb-2 size-8 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground text-sm">
            No location information available
          </p>
        </div>
      </div>
    );
  }

  // Format address for display
  const fullAddress = [
    property.address,
    property.address2,
    `${property.city}, ${property.state} ${property.zipCode}`,
    property.country && property.country !== "USA" ? property.country : null,
  ]
    .filter(Boolean)
    .join("\n");

  // Format address for URL encoding
  const addressForUrl = [
    property.address,
    property.address2,
    property.city,
    property.state,
    property.zipCode,
    property.country,
  ]
    .filter(Boolean)
    .join(", ");

  const encodedAddress = encodeURIComponent(addressForUrl);

  // Google Maps Static API URL (in production, use actual API key)
  // For demo purposes, this is a placeholder
  const _mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=15&size=600x300&markers=color:red%7C${encodedAddress}&key=YOUR_API_KEY`;

  // External map links
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const appleMapsUrl = `https://maps.apple.com/?address=${encodedAddress}`;
  const wazeUrl = `https://www.waze.com/ul?q=${encodedAddress}&navigate=yes`;

  // Coordinates (if available from property - not yet in schema)
  // const latitude = property.latitude;
  // const longitude = property.longitude;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">Job Location</h4>
        <Button asChild size="sm" variant="outline">
          <a href={googleMapsUrl} rel="noopener noreferrer" target="_blank">
            <Navigation className="mr-2 size-4" />
            Get Directions
          </a>
        </Button>
      </div>

      {/* Map Image Placeholder */}
      <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
        {/* Placeholder map with address marker */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="text-center">
            <MapPin className="mx-auto mb-2 size-12 text-primary" />
            <p className="font-medium text-sm">Map Preview</p>
            <p className="text-muted-foreground text-xs">
              Click "Get Directions" to view in maps
            </p>
          </div>
        </div>

        {/* In production, uncomment this to use actual map image */}
        {/* <Image
          src={mapImageUrl}
          alt={`Map of ${property.address}`}
          fill
          className="object-cover"
        /> */}
      </div>

      <Separator />

      {/* Address Details */}
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div className="flex-1 space-y-1">
            <h5 className="font-medium text-sm">Address</h5>
            <div className="whitespace-pre-line text-muted-foreground text-xs leading-relaxed">
              {fullAddress}
            </div>
          </div>
        </div>

        {/* Coordinates - Not yet in schema */}
        {/* {latitude && longitude && (
          <div className="rounded-lg bg-muted p-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Coordinates:</span>
              <span className="font-mono font-medium">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </span>
            </div>
          </div>
        )} */}
      </div>

      <Separator />

      {/* Navigation Options */}
      <div className="space-y-2">
        <h5 className="font-medium text-sm">Open in:</h5>
        <div className="grid grid-cols-1 gap-2">
          <Button
            asChild
            className="w-full justify-start"
            size="sm"
            variant="outline"
          >
            <a href={googleMapsUrl} rel="noopener noreferrer" target="_blank">
              <ExternalLink className="mr-2 size-4" />
              Google Maps
            </a>
          </Button>

          <Button
            asChild
            className="w-full justify-start"
            size="sm"
            variant="outline"
          >
            <a href={appleMapsUrl} rel="noopener noreferrer" target="_blank">
              <ExternalLink className="mr-2 size-4" />
              Apple Maps
            </a>
          </Button>

          <Button
            asChild
            className="w-full justify-start"
            size="sm"
            variant="outline"
          >
            <a href={wazeUrl} rel="noopener noreferrer" target="_blank">
              <ExternalLink className="mr-2 size-4" />
              Waze
            </a>
          </Button>
        </div>
      </div>

      {/* Property Info Link */}
      {property.name && (
        <>
          <Separator />
          <div className="rounded-lg bg-muted p-3">
            <div className="mb-1 flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              <span className="font-medium text-sm">{property.name}</span>
            </div>
            <Button asChild className="mt-2 w-full" size="sm" variant="outline">
              <Link href={`/dashboard/work/properties/${property.id}`}>
                View Property Details
              </Link>
            </Button>
          </div>
        </>
      )}

      {/* Quick Actions - Phone field not yet in schema */}
      {/* <Separator />
      <div className="grid grid-cols-2 gap-2 text-xs">
        <Button asChild className="w-full" size="sm" variant="outline">
          <a href={`tel:${property.phone || ""}`}>
            <span className="truncate">Call Customer</span>
          </a>
        </Button>
        <Button asChild className="w-full" size="sm" variant="outline">
          <a href={`sms:${property.phone || ""}`}>
            <span className="truncate">Send SMS</span>
          </a>
        </Button>
      </div> */}

      {/* Distance Info (if available) */}
      <div className="rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 p-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Estimated Travel Time:</span>
          <span className="font-medium">Click directions for route</span>
        </div>
      </div>
    </div>
  );
}

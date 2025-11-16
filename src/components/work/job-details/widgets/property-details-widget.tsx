/**
 * Property Details Widget - Server Component
 *
 * Displays basic property information including address, type, and specifications.
 * Simpler version compared to property-intelligence-widget.
 *
 * Performance optimizations:
 * - Server Component by default
 * - Static content rendered on server
 * - Minimal JavaScript to client
 */

import { Building2, Calendar, Home, MapPin, Ruler } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Property } from "@/lib/db/schema";

type PropertyDetailsWidgetProps = {
  property?: Property;
};

export function PropertyDetailsWidget({
  property,
}: PropertyDetailsWidgetProps) {
  if (!property) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-center">
        <div>
          <Building2 className="mx-auto mb-2 size-8 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground text-sm">
            No property information available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Property Name/Title */}
      {property.name && (
        <div>
          <h4 className="font-semibold text-base">{property.name}</h4>
        </div>
      )}

      {/* Address */}
      <div className="space-y-1">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div>
            <div>{property.address}</div>
            {property.address2 && <div>{property.address2}</div>}
            <div>
              {property.city}, {property.state} {property.zipCode}
            </div>
            {property.country && property.country !== "USA" && (
              <div>{property.country}</div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Property Type */}
      <div className="space-y-2">
        {property.propertyType && (
          <div className="flex items-center gap-2 text-sm">
            <Home className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium capitalize">
              {property.propertyType}
            </span>
          </div>
        )}

        {/* Square Footage */}
        {property.squareFootage && (
          <div className="flex items-center gap-2 text-sm">
            <Ruler className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Size:</span>
            <span className="font-medium">
              {property.squareFootage.toLocaleString()} sq ft
            </span>
          </div>
        )}

        {/* Year Built */}
        {property.yearBuilt && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Built:</span>
            <span className="font-medium">{property.yearBuilt}</span>
          </div>
        )}
      </div>

      {/* Notes */}
      {property.notes && (
        <>
          <Separator />
          <div className="space-y-1">
            <h5 className="font-medium text-sm">Notes</h5>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {property.notes}
            </p>
          </div>
        </>
      )}

      {/* Actions */}
      <Separator />
      <div className="space-y-2">
        <Button asChild className="w-full" size="sm" variant="outline">
          <Link href={`/dashboard/work/properties/${property.id}`}>
            <Building2 className="mr-2 size-4" />
            View Full Property Details
          </Link>
        </Button>
      </div>
    </div>
  );
}

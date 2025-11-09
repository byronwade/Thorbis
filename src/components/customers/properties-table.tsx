"use client";

/**
 * PropertiesTable Component
 * Full-width datatable for displaying customer properties
 *
 * Features:
 * - Search, sort, filter
 * - Property type badges
 * - Market value display
 * - **Interactive hover maps** - Hover over row to see property location
 * - Compact rows for scalability (100+ properties)
 */

import { useState } from "react";
import { Home, Building2, Factory, MapPin, ExternalLink, Archive, Trash2, UserX, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  type ColumnDef,
  type BulkAction,
  FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { cn } from "@/lib/utils";
import { archiveProperty } from "@/actions/properties";
import { JobEnrichmentPanel } from "@/components/work/job-enrichment-panel";

type Property = {
  id: string;
  name?: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zip_code: string;
  type?: string;
  square_footage?: number;
  year_built?: number;
  customer_id: string;
  enrichment?: {
    details?: {
      squareFootage?: number;
      bedrooms?: number;
      bathrooms?: number;
      lotSizeSquareFeet?: number;
    };
    ownership?: {
      marketValue?: number;
    };
    taxes?: {
      annualAmount?: number;
    };
  };
  operationalIntelligence?: any; // Job enrichment data (weather, building, location, etc.)
};

type PropertiesTableProps = {
  properties: Property[];
  itemsPerPage?: number;
};

function formatCurrency(cents: number | undefined): string {
  if (!cents) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function getPropertyIcon(type?: string) {
  switch (type) {
    case "commercial":
      return Building2;
    case "industrial":
      return Factory;
    default:
      return Home;
  }
}

function getPropertyBadge(type?: string) {
  const variants: Record<string, string> = {
    residential: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
    commercial: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    industrial: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  };

  return (
    <Badge className={cn("text-xs", variants[type || "residential"] || variants.residential)}>
      {type ? type.charAt(0).toUpperCase() + type.slice(1) : "Residential"}
    </Badge>
  );
}

export function PropertiesTable({
  properties,
  itemsPerPage = 10,
}: PropertiesTableProps) {
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (property: Property, event: React.MouseEvent) => {
    setHoveredProperty(property);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredProperty(null);
  };

  // Bulk actions for selected properties
  const bulkActions: BulkAction[] = [
    {
      label: "Archive Properties",
      icon: <Archive className="size-4" />,
      variant: "destructive",
      onClick: async (selectedIds) => {
        if (!confirm(`Archive ${selectedIds.size} selected ${selectedIds.size === 1 ? "property" : "properties"}? They can be restored within 90 days.`)) {
          return;
        }

        const propertyIds = Array.from(selectedIds);
        let archived = 0;
        for (const propertyId of propertyIds) {
          const result = await archiveProperty(propertyId as string);
          if (result.success) archived++;
        }

        if (archived > 0) {
          window.location.reload();
        }
      },
    },
    {
      label: "Move to Another Customer",
      icon: <UserX className="size-4" />,
      variant: "ghost",
      onClick: async (selectedIds) => {
        // TODO: Implement move dialog
        alert(`Move ${selectedIds.size} properties to another customer (coming soon)`);
      },
    },
  ];

  const columns: ColumnDef<Property>[] = [
    {
      key: "address",
      header: "Address",
      width: "flex-1",
      render: (property) => {
        const Icon = getPropertyIcon(property.type);
        return (
          <div
            className="flex items-center gap-2 min-w-0"
            onMouseEnter={(e) => handleMouseEnter(property, e)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <Icon className="size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="truncate font-medium leading-tight">
                {property.name || property.address}
              </p>
              <p className="truncate text-muted-foreground text-xs leading-tight">
                {property.city}, {property.state} {property.zip_code}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "type",
      header: "Type",
      width: "w-32",
      shrink: true,
      render: (property) => getPropertyBadge(property.type),
    },
    {
      key: "size",
      header: "Size",
      width: "w-32",
      shrink: true,
      align: "right",
      render: (property) => {
        const sqFt = property.square_footage || property.enrichment?.details?.squareFootage;
        const beds = property.enrichment?.details?.bedrooms;
        const baths = property.enrichment?.details?.bathrooms;

        return (
          <div className="text-sm">
            <p className="font-medium">
              {sqFt ? sqFt.toLocaleString() : "—"}
            </p>
            {beds && baths && (
              <p className="text-muted-foreground text-xs">
                {beds}bd / {baths}ba
              </p>
            )}
            {!sqFt && property.year_built && (
              <p className="text-muted-foreground text-xs">
                Built {property.year_built}
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: "value",
      header: "Value",
      width: "w-36",
      shrink: true,
      align: "right",
      hideOnMobile: true,
      render: (property) => {
        const value = property.enrichment?.ownership?.marketValue;
        const tax = property.enrichment?.taxes?.annualAmount;

        // Show any available value data
        const displayValue = value;

        return (
          <div className="text-sm">
            {displayValue ? (
              <>
                <p className="font-semibold text-green-700 dark:text-green-400">
                  {formatCurrency(displayValue)}
                </p>
                {tax && (
                  <p className="text-muted-foreground text-xs">
                    Tax: {formatCurrency(tax)}
                  </p>
                )}
              </>
            ) : (
              <span className="text-muted-foreground text-xs">No data</span>
            )}
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "",
      width: "w-36",
      shrink: true,
      align: "right",
      render: (property) => (
        <div className="flex items-center justify-end gap-1">
          {/* Operational Intelligence Button */}
          {property.operationalIntelligence && (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 gap-1 px-2 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Sparkles className="size-3" />
                  Intel
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Sparkles className="size-5 text-primary" />
                    Operational Intelligence
                  </SheetTitle>
                  <SheetDescription>
                    Live data for {property.address}, {property.city}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <JobEnrichmentPanel
                    enrichmentData={property.operationalIntelligence}
                  />
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* View Link */}
          <Link
            href={`/dashboard/customers/${property.customer_id}#property-${property.id}`}
            className="inline-flex items-center gap-1 text-primary text-xs hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View
            <ExternalLink className="size-3" />
          </Link>
        </div>
      ),
    },
  ];

  // Search filter
  const searchFilter = (property: Property, query: string) => {
    const searchStr = query.toLowerCase();
    return (
      (property.name?.toLowerCase() || "").includes(searchStr) ||
      property.address.toLowerCase().includes(searchStr) ||
      property.city.toLowerCase().includes(searchStr) ||
      property.state.toLowerCase().includes(searchStr) ||
      property.zip_code.toLowerCase().includes(searchStr) ||
      (property.type?.toLowerCase() || "").includes(searchStr)
    );
  };

  return (
    <div className="relative -mt-6 -mb-6">
      <FullWidthDataTable
        columns={columns}
        data={properties}
        getItemId={(property) => property.id}
        itemsPerPage={itemsPerPage}
        searchPlaceholder="Search properties..."
        searchFilter={searchFilter}
        showRefresh={false}
        enableSelection={true}
        bulkActions={bulkActions}
      />

      {/* Floating Map on Hover */}
      {hoveredProperty && (
        <div
          className="pointer-events-none fixed z-50 overflow-hidden rounded-lg border-2 border-primary bg-background shadow-2xl"
          style={{
            left: mousePosition.x + 20,
            top: mousePosition.y - 150,
            width: "400px",
            height: "300px",
          }}
        >
          <iframe
            title={`Map of ${hoveredProperty.address}`}
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"}&q=${encodeURIComponent(
              hoveredProperty.address + ", " + hoveredProperty.city + ", " + hoveredProperty.state + " " + hoveredProperty.zip_code
            )}&zoom=14`}
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 border-t bg-background/95 p-2 backdrop-blur">
            <p className="truncate font-medium text-xs">
              {hoveredProperty.address}
            </p>
            <p className="truncate text-muted-foreground text-xs">
              {hoveredProperty.city}, {hoveredProperty.state}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

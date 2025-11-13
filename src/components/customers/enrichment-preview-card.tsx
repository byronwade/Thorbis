/**
 * Enrichment Preview Card
 *
 * Compact preview of enrichment data for use in lists and tables
 */

"use client";

import {
  Briefcase,
  Building2,
  DollarSign,
  MapPin,
  Star,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface EnrichmentPreviewCardProps {
  enrichmentData: any;
  compact?: boolean;
}

export function EnrichmentPreviewCard({
  enrichmentData,
  compact = false,
}: EnrichmentPreviewCardProps) {
  if (!enrichmentData) {
    return (
      <Card className={compact ? "border-dashed" : ""}>
        <CardContent className={compact ? "p-3" : "p-4"}>
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">No enrichment data</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const personData = enrichmentData?.person;
  const businessData = enrichmentData?.business;
  const propertyData = enrichmentData?.properties?.[0];

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {personData?.jobTitle && (
          <Badge className="text-xs" variant="secondary">
            <Briefcase className="mr-1 h-3 w-3" />
            {personData.jobTitle}
          </Badge>
        )}
        {personData?.company?.name && (
          <Badge className="text-xs" variant="secondary">
            <Building2 className="mr-1 h-3 w-3" />
            {personData.company.name}
          </Badge>
        )}
        {businessData?.rating && (
          <Badge className="text-xs" variant="secondary">
            <Star className="mr-1 h-3 w-3 fill-yellow-500 text-warning" />
            {businessData.rating}/5
          </Badge>
        )}
        {propertyData?.ownership?.marketValue && (
          <Badge className="text-xs" variant="secondary">
            <DollarSign className="mr-1 h-3 w-3" />$
            {(propertyData.ownership.marketValue / 100).toLocaleString()}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">Enrichment Summary</h4>
          <Badge className="text-xs" variant="outline">
            {enrichmentData.overallConfidence}% confidence
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {personData?.jobTitle && (
            <div className="flex items-center gap-2">
              <Briefcase className="h-3 w-3 text-muted-foreground" />
              <span className="truncate">{personData.jobTitle}</span>
            </div>
          )}
          {personData?.company?.name && (
            <div className="flex items-center gap-2">
              <Building2 className="h-3 w-3 text-muted-foreground" />
              <span className="truncate">{personData.company.name}</span>
            </div>
          )}
          {businessData?.rating && (
            <div className="flex items-center gap-2">
              <Star className="h-3 w-3 fill-yellow-500 text-warning" />
              <span>{businessData.rating}/5</span>
            </div>
          )}
          {propertyData?.ownership?.marketValue && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span>
                ${(propertyData.ownership.marketValue / 100).toLocaleString()}
              </span>
            </div>
          )}
          {personData?.location && (
            <div className="col-span-2 flex items-center gap-2">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="truncate text-muted-foreground">
                {[personData.location.city, personData.location.state]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

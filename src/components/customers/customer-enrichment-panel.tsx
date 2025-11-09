/**
 * Customer Enrichment Panel
 *
 * Displays enriched customer data from external APIs:
 * - Person data (job title, company, social profiles)
 * - Business data (reviews, hours, registration)
 * - Social profiles (LinkedIn, Twitter, Facebook)
 * - Property data (value, permits, zoning)
 */

"use client";

import {
  Briefcase,
  Building2,
  DollarSign,
  ExternalLink,
  Facebook,
  Home,
  Linkedin,
  MapPin,
  Phone,
  RefreshCw,
  Star,
  TrendingUp,
  Twitter,
  User,
} from "lucide-react";
import { useState } from "react";
import {
  enrichCustomerData,
  refreshEnrichment,
} from "@/actions/customer-enrichment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CustomerEnrichmentPanelProps {
  customerId: string;
  initialData?: any;
}

export function CustomerEnrichmentPanel({
  customerId,
  initialData,
}: CustomerEnrichmentPanelProps) {
  const [enrichmentData, setEnrichmentData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleEnrich = async () => {
    setIsLoading(true);
    try {
      const result = await enrichCustomerData(customerId, false);
      if (result.success) {
        setEnrichmentData(result.data);
      }
    } catch (error) {
      console.error("Failed to enrich customer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await refreshEnrichment(customerId);
      if (result.success) {
        setEnrichmentData(result.data);
      }
    } catch (error) {
      console.error("Failed to refresh enrichment:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!(enrichmentData || isLoading)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Customer Intelligence
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="mb-4 text-muted-foreground">
              Enrich this customer with data from external sources
            </p>
            <Button onClick={handleEnrich}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Enrich Customer Data
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Intelligence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const personData = enrichmentData?.person;
  const businessData = enrichmentData?.business;
  const socialData = enrichmentData?.social;
  const propertyData = enrichmentData?.properties?.[0];

  return (
    <div className="space-y-4">
      {/* Header with Refresh */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Customer Intelligence
            </span>
            <Button
              disabled={isRefreshing}
              onClick={handleRefresh}
              size="sm"
              variant="outline"
            >
              <RefreshCw
                className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")}
              />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Badge variant="outline">
              Confidence: {enrichmentData?.overallConfidence || 0}%
            </Badge>
            {enrichmentData?.sources && (
              <span>Sources: {enrichmentData.sources.join(", ")}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Person Data */}
      {personData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {personData.jobTitle && (
              <div className="flex items-start gap-3">
                <Briefcase className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{personData.jobTitle}</p>
                  {personData.seniority && (
                    <p className="text-muted-foreground text-sm">
                      {personData.seniority}
                    </p>
                  )}
                </div>
              </div>
            )}
            {personData.company && (
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{personData.company.name}</p>
                  {personData.company.industry && (
                    <p className="text-muted-foreground text-sm">
                      {personData.company.industry}
                    </p>
                  )}
                  {personData.company.description && (
                    <p className="mt-1 text-muted-foreground text-sm">
                      {personData.company.description}
                    </p>
                  )}
                </div>
              </div>
            )}
            {personData.location && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {[
                    personData.location.city,
                    personData.location.state,
                    personData.location.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Social Profiles */}
      {socialData?.profiles && Object.keys(socialData.profiles).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Social Profiles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {socialData.profiles.linkedin?.url && (
              <a
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                href={socialData.profiles.linkedin.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="flex items-center gap-3">
                  <Linkedin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">LinkedIn</p>
                    {socialData.profiles.linkedin.headline && (
                      <p className="text-muted-foreground text-sm">
                        {socialData.profiles.linkedin.headline}
                      </p>
                    )}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            )}
            {socialData.profiles.twitter?.url && (
              <a
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                href={socialData.profiles.twitter.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="flex items-center gap-3">
                  <Twitter className="h-5 w-5 text-sky-500" />
                  <div>
                    <p className="font-medium">Twitter</p>
                    {socialData.profiles.twitter.followers && (
                      <p className="text-muted-foreground text-sm">
                        {socialData.profiles.twitter.followers.toLocaleString()}{" "}
                        followers
                      </p>
                    )}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            )}
            {socialData.profiles.facebook?.url && (
              <a
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                href={socialData.profiles.facebook.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="flex items-center gap-3">
                  <Facebook className="h-5 w-5 text-blue-700" />
                  <div>
                    <p className="font-medium">Facebook</p>
                    {socialData.profiles.facebook.name && (
                      <p className="text-muted-foreground text-sm">
                        {socialData.profiles.facebook.name}
                      </p>
                    )}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {/* Business Data */}
      {businessData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Business Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {businessData.rating && (
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">{businessData.rating}/5</span>
                {businessData.reviewCount && (
                  <span className="text-muted-foreground text-sm">
                    ({businessData.reviewCount} reviews)
                  </span>
                )}
              </div>
            )}
            {businessData.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{businessData.phone}</span>
              </div>
            )}
            {businessData.website && (
              <div className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <a
                  className="text-blue-600 text-sm hover:underline"
                  href={businessData.website}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {businessData.website}
                </a>
              </div>
            )}
            {businessData.description && (
              <p className="text-muted-foreground text-sm">
                {businessData.description}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Property Data */}
      {propertyData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Property Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {propertyData.ownership?.marketValue && (
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    $
                    {(
                      propertyData.ownership.marketValue / 100
                    ).toLocaleString()}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Estimated Market Value
                  </p>
                </div>
              </div>
            )}
            {propertyData.details?.squareFootage && (
              <div className="flex items-center gap-3">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {propertyData.details.squareFootage.toLocaleString()} sq ft
                </span>
              </div>
            )}
            {propertyData.details?.yearBuilt && (
              <div className="text-muted-foreground text-sm">
                Built in {propertyData.details.yearBuilt}
              </div>
            )}
            {propertyData.taxes?.annualAmount && (
              <div className="text-muted-foreground text-sm">
                Annual Taxes: $
                {(propertyData.taxes.annualAmount / 100).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

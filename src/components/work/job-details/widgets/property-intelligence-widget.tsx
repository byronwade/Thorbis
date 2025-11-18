/**
 * Property Intelligence Widget - Server Component
 *
 * Displays enriched property information from external data sources.
 * Shows ownership, permits, tax info, and risk factors.
 */

import {
	AlertTriangle,
	CircleDollarSign,
	FileCheck,
	Flame,
	Home,
	MapPin,
	Users,
	Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Property } from "@/lib/db/schema";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { PropertyEnrichment } from "@/lib/services/property-enrichment";

// ============================================================================
// Helper Functions
// ============================================================================

function getRiskColor(zone: string | undefined): string {
	if (!zone) {
		return "text-muted-foreground";
	}

	const lowerZone = zone.toLowerCase();
	if (lowerZone.includes("high") || lowerZone.includes("x")) {
		return "text-destructive";
	}
	if (lowerZone.includes("moderate") || lowerZone.includes("a")) {
		return "text-warning";
	}
	return "text-success";
}

// ============================================================================
// Props Types
// ============================================================================

type PropertyIntelligenceWidgetProps = {
	property?: Property;
	enrichment?: PropertyEnrichment | null;
};

// ============================================================================
// Property Intelligence Widget Component
// ============================================================================

export function PropertyIntelligenceWidget({
	property,
	enrichment,
}: PropertyIntelligenceWidgetProps) {
	// ============================================================================
	// No Data State
	// ============================================================================

	if (!enrichment) {
		return (
			<div className="space-y-3">
				{/* Basic property info from database */}
				{property ? (
					<>
						<div className="flex items-start gap-2">
							<MapPin className="text-muted-foreground mt-0.5 size-4" />
							<div className="flex-1">
								<div className="text-muted-foreground text-xs">Location</div>
								<div className="text-sm">
									{property.address}
									{property.address2 ? `, ${property.address2}` : ""}
								</div>
								<div className="text-muted-foreground text-xs">
									{property.city}, {property.state} {property.zipCode}
								</div>
							</div>
						</div>

						<Separator />

						<div className="grid grid-cols-2 gap-3">
							<div>
								<div className="text-muted-foreground text-xs">Type</div>
								<div className="text-sm capitalize">
									{property.propertyType}
								</div>
							</div>
							{property.squareFootage ? (
								<div>
									<div className="text-muted-foreground text-xs">
										Square Feet
									</div>
									<div className="text-sm">
										{property.squareFootage.toLocaleString()}
									</div>
								</div>
							) : null}
							{property.yearBuilt ? (
								<div>
									<div className="text-muted-foreground text-xs">
										Year Built
									</div>
									<div className="text-sm">{property.yearBuilt}</div>
								</div>
							) : null}
						</div>
					</>
				) : (
					<div className="text-muted-foreground text-center text-sm">
						No property data available
					</div>
				)}

				<Separator />

				{/* Enrichment status */}
				<div className="border-muted-foreground/25 rounded-lg border border-dashed p-3 text-center">
					<p className="text-muted-foreground text-xs">
						Property intelligence unavailable
					</p>
					<p className="text-muted-foreground text-xs">
						Configure API keys to enrich property data
					</p>
				</div>
			</div>
		);
	}

	// ============================================================================
	// Enriched Data Display
	// ============================================================================

	const { details, ownership, taxes, permits, utilities, riskFactors } =
		enrichment;

	return (
		<div className="space-y-4">
			{/* Confidence Score */}
			<div className="space-y-1">
				<div className="flex items-center justify-between text-xs">
					<span className="text-muted-foreground">Data Confidence</span>
					<span className="font-medium">{enrichment.confidence}%</span>
				</div>
				<Progress className="h-1.5" value={enrichment.confidence} />
			</div>

			<Separator />

			{/* Property Details */}
			<div className="space-y-2">
				<h4 className="flex items-center gap-1.5 text-xs font-semibold">
					<Home className="size-3.5" />
					Property Details
				</h4>
				<div className="grid grid-cols-2 gap-2 text-xs">
					<div>
						<div className="text-muted-foreground">Type</div>
						<div className="font-medium capitalize">
							{details.propertyType.replace("_", " ")}
						</div>
					</div>
					{details.squareFootage ? (
						<div>
							<div className="text-muted-foreground">Square Feet</div>
							<div className="font-medium">
								{details.squareFootage.toLocaleString()}
							</div>
						</div>
					) : null}
					{details.lotSizeSquareFeet ? (
						<div>
							<div className="text-muted-foreground">Lot Size</div>
							<div className="font-medium">
								{details.lotSizeSquareFeet.toLocaleString()} sq ft
							</div>
						</div>
					) : null}
					{details.yearBuilt ? (
						<div>
							<div className="text-muted-foreground">Year Built</div>
							<div className="font-medium">{details.yearBuilt}</div>
						</div>
					) : null}
					{details.bedrooms ? (
						<div>
							<div className="text-muted-foreground">Bedrooms</div>
							<div className="font-medium">{details.bedrooms}</div>
						</div>
					) : null}
					{details.bathrooms ? (
						<div>
							<div className="text-muted-foreground">Bathrooms</div>
							<div className="font-medium">{details.bathrooms}</div>
						</div>
					) : null}
				</div>

				{/* Systems */}
				{details.heatingType || details.coolingType || details.roofType ? (
					<div className="bg-muted/50 mt-2 space-y-1 rounded-md p-2 text-xs">
						{details.heatingType ? (
							<div className="flex items-center gap-1.5">
								<Flame className="text-warning size-3" />
								<span className="text-muted-foreground">Heating:</span>
								<span className="font-medium">{details.heatingType}</span>
							</div>
						) : null}
						{details.coolingType ? (
							<div className="flex items-center gap-1.5">
								<Zap className="text-primary size-3" />
								<span className="text-muted-foreground">Cooling:</span>
								<span className="font-medium">{details.coolingType}</span>
							</div>
						) : null}
						{details.roofType ? (
							<div className="flex items-center gap-1.5">
								<Home className="text-muted-foreground size-3" />
								<span className="text-muted-foreground">Roof:</span>
								<span className="font-medium">{details.roofType}</span>
							</div>
						) : null}
					</div>
				) : null}
			</div>

			<Separator />

			{/* Ownership Information */}
			<div className="space-y-2">
				<h4 className="flex items-center gap-1.5 text-xs font-semibold">
					<Users className="size-3.5" />
					Ownership
				</h4>
				<div className="space-y-1.5 text-xs">
					{ownership.ownerName ? (
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Owner</span>
							<span className="font-medium">{ownership.ownerName}</span>
						</div>
					) : null}
					{ownership.lastSaleDate ? (
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Last Sale</span>
							<span className="font-medium">
								{formatDate(ownership.lastSaleDate)}
							</span>
						</div>
					) : null}
					{ownership.lastSalePrice ? (
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Sale Price</span>
							<span className="font-medium">
								{formatCurrency(ownership.lastSalePrice)}
							</span>
						</div>
					) : null}
				</div>
			</div>

			<Separator />

			{/* Valuation */}
			<div className="space-y-2">
				<h4 className="flex items-center gap-1.5 text-xs font-semibold">
					<CircleDollarSign className="size-3.5" />
					Valuation
				</h4>
				<div className="space-y-1.5 text-xs">
					{ownership.assessedValue ? (
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Assessed Value</span>
							<span className="font-medium">
								{formatCurrency(ownership.assessedValue)}
							</span>
						</div>
					) : null}
					{ownership.marketValue ? (
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Market Value</span>
							<span className="font-medium">
								{formatCurrency(ownership.marketValue)}
							</span>
						</div>
					) : null}
					{taxes.annualAmount ? (
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Annual Taxes</span>
							<span className="font-medium">
								{formatCurrency(taxes.annualAmount)}
							</span>
						</div>
					) : null}
				</div>
			</div>

			{/* Permits */}
			{permits && permits.length > 0 ? (
				<>
					<Separator />
					<div className="space-y-2">
						<h4 className="flex items-center gap-1.5 text-xs font-semibold">
							<FileCheck className="size-3.5" />
							Recent Permits ({permits.length})
						</h4>
						<div className="space-y-1.5">
							{permits.slice(0, 3).map((permit) => (
								<div
									className="rounded-md border p-2 text-xs"
									key={permit.permitNumber}
								>
									<div className="flex items-center justify-between">
										<span className="font-medium">{permit.type}</span>
										<Badge className="text-xs" variant="outline">
											{permit.status}
										</Badge>
									</div>
									<div className="text-muted-foreground mt-1">
										{permit.description}
									</div>
									<div className="text-muted-foreground mt-1">
										{formatDate(permit.issuedDate)}
										{permit.value ? ` • ${formatCurrency(permit.value)}` : ""}
									</div>
								</div>
							))}
						</div>
					</div>
				</>
			) : null}

			{/* Risk Factors */}
			{riskFactors.floodZone ||
			riskFactors.earthquakeZone ||
			riskFactors.fireZone ||
			riskFactors.hurricaneZone ? (
				<>
					<Separator />
					<div className="space-y-2">
						<h4 className="flex items-center gap-1.5 text-xs font-semibold">
							<AlertTriangle className="size-3.5" />
							Risk Factors
						</h4>
						<div className="space-y-1.5 text-xs">
							{riskFactors.floodZone ? (
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Flood Zone</span>
									<span className={getRiskColor(riskFactors.floodZone)}>
										{riskFactors.floodZone}
									</span>
								</div>
							) : null}
							{riskFactors.earthquakeZone ? (
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Earthquake Zone</span>
									<span className={getRiskColor(riskFactors.earthquakeZone)}>
										{riskFactors.earthquakeZone}
									</span>
								</div>
							) : null}
							{riskFactors.fireZone ? (
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Fire Zone</span>
									<span className={getRiskColor(riskFactors.fireZone)}>
										{riskFactors.fireZone}
									</span>
								</div>
							) : null}
							{riskFactors.hurricaneZone ? (
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Hurricane Zone</span>
									<span className={getRiskColor(riskFactors.hurricaneZone)}>
										{riskFactors.hurricaneZone}
									</span>
								</div>
							) : null}
						</div>
					</div>
				</>
			) : null}

			{/* Data Source */}
			<Separator />
			<div className="text-muted-foreground flex items-center justify-between text-xs">
				<span>Data source: {enrichment.source}</span>
				<span>Updated: {formatDate(enrichment.enrichedAt)}</span>
			</div>
		</div>
	);
}

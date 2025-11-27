"use client";

import {
	AlertTriangle,
	Building2,
	CloudRain,
	DollarSign,
	Droplets,
	Home,
	Info,
	Loader2,
	MapPin,
	RefreshCw,
	Shield,
	ShieldAlert,
	ShieldCheck,
	Thermometer,
	TrendingUp,
} from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type PropertyAddress = {
	street?: string;
	city?: string;
	state?: string;
	postal_code?: string;
	lat?: number;
	lng?: number;
};

type PropertyRiskCardProps = {
	propertyId: string;
	propertyName?: string;
	address: PropertyAddress;
	className?: string;
	compact?: boolean;
};

type FloodData = {
	zone?: string;
	zoneDescription?: string;
	riskLevel?: "minimal" | "low" | "moderate" | "high" | "very-high";
	sfhaStatus?: boolean;
	panelNumber?: string;
	communityName?: string;
};

type CrimeData = {
	violentCrimeRate?: number;
	propertyCrimeRate?: number;
	safetyScore?: number; // 0-100
	comparedToNational?: "below" | "average" | "above";
	equipmentTheftRisk?: "low" | "moderate" | "high";
};

type PropertyData = {
	yearBuilt?: number;
	squareFeet?: number;
	bedrooms?: number;
	bathrooms?: number;
	propertyType?: string;
	estimatedValue?: number;
	lastSalePrice?: number;
	lastSaleDate?: string;
	lotSize?: number;
	heatingType?: string;
	coolingType?: string;
};

type RiskAssessment = {
	flood: FloodData | null;
	crime: CrimeData | null;
	property: PropertyData | null;
	isLoading: boolean;
	error: string | null;
	lastFetched: Date | null;
};

function getRiskColor(level: string | undefined): string {
	switch (level) {
		case "minimal":
		case "low":
			return "text-green-600 bg-green-100 dark:bg-green-900/30";
		case "moderate":
		case "average":
			return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
		case "high":
		case "above":
			return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
		case "very-high":
			return "text-red-600 bg-red-100 dark:bg-red-900/30";
		default:
			return "text-muted-foreground bg-muted";
	}
}

function getRiskIcon(level: string | undefined) {
	switch (level) {
		case "minimal":
		case "low":
			return <ShieldCheck className="size-4 text-green-600" />;
		case "moderate":
		case "average":
			return <Shield className="size-4 text-yellow-600" />;
		case "high":
		case "above":
		case "very-high":
			return <ShieldAlert className="size-4 text-red-600" />;
		default:
			return <Shield className="size-4 text-muted-foreground" />;
	}
}

function formatCurrency(value: number | undefined): string {
	if (!value) return "N/A";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(value);
}

function RiskSkeleton() {
	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<Skeleton className="size-8 rounded-full" />
				<Skeleton className="h-4 w-24" />
			</div>
			<Skeleton className="h-3 w-full" />
			<Skeleton className="h-3 w-3/4" />
		</div>
	);
}

export const PropertyRiskCard = memo(function PropertyRiskCard({
	propertyId,
	propertyName,
	address,
	className,
	compact = false,
}: PropertyRiskCardProps) {
	const [assessment, setAssessment] = useState<RiskAssessment>({
		flood: null,
		crime: null,
		property: null,
		isLoading: true,
		error: null,
		lastFetched: null,
	});

	const fullAddress = [address.street, address.city, address.state]
		.filter(Boolean)
		.join(", ");

	const fetchRiskData = useCallback(async () => {
		if (!fullAddress || fullAddress.length < 5) {
			setAssessment((prev) => ({
				...prev,
				isLoading: false,
				error: "Invalid address",
			}));
			return;
		}

		setAssessment((prev) => ({ ...prev, isLoading: true, error: null }));

		try {
			// Fetch all risk data in parallel
			const [floodRes, crimeRes, propertyRes] = await Promise.allSettled([
				// Flood data
				fetch(
					`/api/risk/flood?${new URLSearchParams({
						address: fullAddress,
						action: "property-data",
					})}`,
				).then((r) => (r.ok ? r.json() : null)),

				// Crime data
				address.state
					? fetch(
							`/api/risk/crime?${new URLSearchParams({
								state: address.state,
								action: "safety-report",
								location: fullAddress,
							})}`,
						).then((r) => (r.ok ? r.json() : null))
					: Promise.resolve(null),

				// Property data (ATTOM)
				address.street && address.city && address.state
					? fetch(
							`/api/property/attom?${new URLSearchParams({
								address: address.street,
								locality: address.city,
								state: address.state,
								postal: address.postal_code || "",
								action: "service-report",
							})}`,
						).then((r) => (r.ok ? r.json() : null))
					: Promise.resolve(null),
			]);

			const floodData =
				floodRes.status === "fulfilled" ? floodRes.value : null;
			const crimeData =
				crimeRes.status === "fulfilled" ? crimeRes.value : null;
			const propertyData =
				propertyRes.status === "fulfilled" ? propertyRes.value : null;

			setAssessment({
				flood: floodData
					? {
							zone: floodData.floodZone || floodData.zone,
							zoneDescription:
								floodData.zoneDescription || floodData.description,
							riskLevel: floodData.riskLevel || mapFloodZoneToRisk(floodData.zone),
							sfhaStatus: floodData.sfhaStatus || floodData.inSfha,
							panelNumber: floodData.panelNumber,
							communityName: floodData.communityName,
						}
					: null,
				crime: crimeData
					? {
							violentCrimeRate: crimeData.violentCrimeRate,
							propertyCrimeRate: crimeData.propertyCrimeRate,
							safetyScore: crimeData.safetyScore,
							comparedToNational: crimeData.comparedToNational,
							equipmentTheftRisk: crimeData.equipmentTheftRisk,
						}
					: null,
				property: propertyData
					? {
							yearBuilt: propertyData.yearBuilt,
							squareFeet: propertyData.squareFeet || propertyData.livingArea,
							bedrooms: propertyData.bedrooms,
							bathrooms: propertyData.bathrooms,
							propertyType: propertyData.propertyType,
							estimatedValue:
								propertyData.estimatedValue || propertyData.avm?.value,
							lastSalePrice: propertyData.lastSalePrice,
							lastSaleDate: propertyData.lastSaleDate,
							lotSize: propertyData.lotSize,
							heatingType: propertyData.heatingType,
							coolingType: propertyData.coolingType,
						}
					: null,
				isLoading: false,
				error: null,
				lastFetched: new Date(),
			});
		} catch (error) {
			console.error("Error fetching risk data:", error);
			setAssessment((prev) => ({
				...prev,
				isLoading: false,
				error: "Failed to fetch risk data",
			}));
		}
	}, [fullAddress, address.street, address.city, address.state, address.postal_code]);

	useEffect(() => {
		fetchRiskData();
	}, [fetchRiskData]);

	// Map FEMA flood zone codes to risk levels
	function mapFloodZoneToRisk(
		zone: string | undefined,
	): FloodData["riskLevel"] {
		if (!zone) return undefined;
		const zoneUpper = zone.toUpperCase();
		if (zoneUpper.startsWith("X") || zoneUpper === "C" || zoneUpper === "B") {
			return "minimal";
		}
		if (zoneUpper.startsWith("A") || zoneUpper.startsWith("V")) {
			return "high";
		}
		if (zoneUpper.startsWith("D")) {
			return "moderate";
		}
		return "low";
	}

	const { flood, crime, property, isLoading, error } = assessment;

	// Calculate overall risk score
	const overallRisk = (() => {
		let score = 0;
		let factors = 0;

		if (flood?.riskLevel) {
			factors++;
			switch (flood.riskLevel) {
				case "minimal":
					score += 10;
					break;
				case "low":
					score += 30;
					break;
				case "moderate":
					score += 50;
					break;
				case "high":
					score += 75;
					break;
				case "very-high":
					score += 100;
					break;
			}
		}

		if (crime?.safetyScore !== undefined) {
			factors++;
			score += 100 - crime.safetyScore; // Invert: higher safety = lower risk
		}

		return factors > 0 ? Math.round(score / factors) : null;
	})();

	if (compact) {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div
							className={cn(
								"flex items-center gap-2 rounded-md border px-3 py-2",
								className,
							)}
						>
							{isLoading ? (
								<Loader2 className="size-4 animate-spin" />
							) : overallRisk !== null ? (
								<>
									{getRiskIcon(
										overallRisk < 25
											? "low"
											: overallRisk < 50
												? "moderate"
												: overallRisk < 75
													? "high"
													: "very-high",
									)}
									<span className="text-sm font-medium">
										Risk Score: {overallRisk}
									</span>
								</>
							) : (
								<>
									<Info className="size-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">
										No risk data
									</span>
								</>
							)}
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<div className="space-y-1 text-xs">
							{flood && (
								<p>Flood Zone: {flood.zone || "Unknown"}</p>
							)}
							{crime?.safetyScore !== undefined && (
								<p>Safety Score: {crime.safetyScore}/100</p>
							)}
							{property?.estimatedValue && (
								<p>Est. Value: {formatCurrency(property.estimatedValue)}</p>
							)}
						</div>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return (
		<Card className={cn("overflow-hidden", className)}>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<div className="flex items-center gap-2">
					<Home className="size-5 text-primary" />
					<CardTitle className="text-base font-semibold">
						{propertyName || "Property Risk Assessment"}
					</CardTitle>
				</div>
				<Button
					onClick={fetchRiskData}
					size="sm"
					variant="ghost"
					disabled={isLoading}
				>
					<RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
				</Button>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Address */}
				<div className="flex items-start gap-2 text-sm text-muted-foreground">
					<MapPin className="size-4 mt-0.5 shrink-0" />
					<span>{fullAddress}</span>
				</div>

				{error && (
					<div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
						{error}
					</div>
				)}

				{isLoading ? (
					<div className="grid gap-4 md:grid-cols-3">
						<RiskSkeleton />
						<RiskSkeleton />
						<RiskSkeleton />
					</div>
				) : (
					<div className="grid gap-4 md:grid-cols-3">
						{/* Flood Risk */}
						<div className="space-y-2 rounded-lg border p-3">
							<div className="flex items-center gap-2">
								<div className="rounded-full bg-blue-100 p-1.5 dark:bg-blue-900/30">
									<Droplets className="size-4 text-blue-600" />
								</div>
								<span className="text-sm font-medium">Flood Risk</span>
							</div>
							{flood ? (
								<>
									<div className="flex items-center gap-2">
										<Badge
											className={cn(
												"text-xs",
												getRiskColor(flood.riskLevel),
											)}
											variant="outline"
										>
											Zone {flood.zone || "N/A"}
										</Badge>
										{getRiskIcon(flood.riskLevel)}
									</div>
									<p className="text-xs text-muted-foreground">
										{flood.zoneDescription ||
											(flood.sfhaStatus
												? "Special Flood Hazard Area"
												: "Outside flood hazard area")}
									</p>
								</>
							) : (
								<p className="text-xs text-muted-foreground">
									No flood data available
								</p>
							)}
						</div>

						{/* Safety Score */}
						<div className="space-y-2 rounded-lg border p-3">
							<div className="flex items-center gap-2">
								<div className="rounded-full bg-purple-100 p-1.5 dark:bg-purple-900/30">
									<Shield className="size-4 text-purple-600" />
								</div>
								<span className="text-sm font-medium">Area Safety</span>
							</div>
							{crime ? (
								<>
									<div className="flex items-center gap-2">
										{crime.safetyScore !== undefined && (
											<>
												<Progress
													className="h-2 flex-1"
													value={crime.safetyScore}
												/>
												<span className="text-sm font-semibold">
													{crime.safetyScore}
												</span>
											</>
										)}
									</div>
									<p className="text-xs text-muted-foreground">
										{crime.comparedToNational === "below"
											? "Below national average crime"
											: crime.comparedToNational === "above"
												? "Above national average crime"
												: "Average crime levels"}
									</p>
									{crime.equipmentTheftRisk && (
										<Badge
											className={cn(
												"text-xs",
												crime.equipmentTheftRisk === "low"
													? "text-green-600"
													: crime.equipmentTheftRisk === "high"
														? "text-red-600"
														: "text-yellow-600",
											)}
											variant="outline"
										>
											Equipment theft: {crime.equipmentTheftRisk}
										</Badge>
									)}
								</>
							) : (
								<p className="text-xs text-muted-foreground">
									No safety data available
								</p>
							)}
						</div>

						{/* Property Info */}
						<div className="space-y-2 rounded-lg border p-3">
							<div className="flex items-center gap-2">
								<div className="rounded-full bg-green-100 p-1.5 dark:bg-green-900/30">
									<Building2 className="size-4 text-green-600" />
								</div>
								<span className="text-sm font-medium">Property Details</span>
							</div>
							{property ? (
								<div className="space-y-1.5">
									{property.estimatedValue && (
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">Est. Value</span>
											<span className="font-semibold">
												{formatCurrency(property.estimatedValue)}
											</span>
										</div>
									)}
									{property.yearBuilt && (
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">Built</span>
											<span>{property.yearBuilt}</span>
										</div>
									)}
									{property.squareFeet && (
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">Sq Ft</span>
											<span>{property.squareFeet.toLocaleString()}</span>
										</div>
									)}
									<div className="flex flex-wrap gap-1 pt-1">
										{property.heatingType && (
											<Badge className="text-xs" variant="outline">
												<Thermometer className="mr-1 size-3" />
												{property.heatingType}
											</Badge>
										)}
										{property.coolingType && (
											<Badge className="text-xs" variant="outline">
												<CloudRain className="mr-1 size-3" />
												{property.coolingType}
											</Badge>
										)}
									</div>
								</div>
							) : (
								<p className="text-xs text-muted-foreground">
									No property data available
								</p>
							)}
						</div>
					</div>
				)}

				{/* Service Recommendations based on risk data */}
				{!isLoading && (flood || crime || property) && (
					<div className="rounded-lg bg-muted/50 p-3">
						<div className="flex items-center gap-2 mb-2">
							<AlertTriangle className="size-4 text-amber-500" />
							<span className="text-sm font-medium">
								Service Considerations
							</span>
						</div>
						<ul className="space-y-1 text-xs text-muted-foreground">
							{flood?.sfhaStatus && (
								<li className="flex items-center gap-1.5">
									<Droplets className="size-3 text-blue-500" />
									Consider flood-resistant equipment placement
								</li>
							)}
							{crime?.equipmentTheftRisk === "high" && (
								<li className="flex items-center gap-1.5">
									<ShieldAlert className="size-3 text-red-500" />
									Secure equipment and materials on-site
								</li>
							)}
							{property?.yearBuilt && property.yearBuilt < 1980 && (
								<li className="flex items-center gap-1.5">
									<Home className="size-3 text-amber-500" />
									Older home - check for outdated systems
								</li>
							)}
							{property?.estimatedValue && property.estimatedValue > 500000 && (
								<li className="flex items-center gap-1.5">
									<DollarSign className="size-3 text-green-500" />
									High-value property - premium service recommended
								</li>
							)}
						</ul>
					</div>
				)}
			</CardContent>
		</Card>
	);
});

"use client";

import { useState, useMemo, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@stratos/ui/table";
import { Progress } from "@stratos/ui/progress";
import { Badge } from "@stratos/ui/badge";
import { Card } from "@stratos/ui/card";
import { Input } from "@stratos/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@stratos/ui/select";
import {
	Bot,
	MessageSquare,
	CreditCard,
	Cloud,
	Database,
	Server,
	Search,
	AlertTriangle,
	CheckCircle,
	AlertCircle,
	TrendingUp,
	DollarSign,
	Zap,
	ExternalLink,
} from "lucide-react";
import type {
	ApiService,
	ServiceCategory,
} from "@web/lib/api/api-catalog";
import {
	API_SERVICE_CATALOG,
	CATEGORY_META,
	calculateUsagePercentage,
	calculateOverageCost,
	getUsageStatus,
	getServiceIdFromTracker,
} from "@web/lib/api/api-catalog";
import type { AggregatedApiUsage } from "@web/lib/api/api-usage-queries";

// Usage data from the database
interface UsageData {
	serviceId: string;
	currentUsage: number;
	lastUpdated: Date;
}

// Icon mapping for categories
const CategoryIcons: Record<ServiceCategory, React.ComponentType<{ className?: string }>> = {
	ai: Bot,
	communications: MessageSquare,
	payments: CreditCard,
	google_cloud: Cloud,
	data_enrichment: Database,
	infrastructure: Server,
};

interface ApiUsageSectionProps {
	usageData?: UsageData[];
	aggregatedUsage?: AggregatedApiUsage[];
}

// Client-only time display to avoid hydration mismatch
function LastUpdatedTime() {
	const [time, setTime] = useState<string | null>(null);

	useEffect(() => {
		setTime(new Date().toLocaleString());
	}, []);

	if (!time) {
		return <span>Loading...</span>;
	}

	return <span>Last updated: {time}</span>;
}

export function ApiUsageSection({ usageData = [], aggregatedUsage = [] }: ApiUsageSectionProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | "all">("all");
	const [statusFilter, setStatusFilter] = useState<"all" | "ok" | "warning" | "critical" | "over">("all");

	// Create a map of usage data for quick lookup
	const usageMap = useMemo(() => {
		const map = new Map<string, UsageData>();
		usageData.forEach((data) => map.set(data.serviceId, data));
		return map;
	}, [usageData]);

	// Create a map of aggregated usage from database
	// Uses getServiceIdFromTracker to properly map tracker api_names (e.g., "openai", "twilio")
	// to catalog service IDs (e.g., "openai_gpt4", "twilio_sms")
	const aggregatedUsageMap = useMemo(() => {
		const map = new Map<string, AggregatedApiUsage>();
		aggregatedUsage.forEach((data) => {
			// Use the proper tracker-to-catalog mapping with endpoint awareness
			const catalogId = getServiceIdFromTracker(data.apiName, data.endpoint || "");
			if (catalogId) {
				// If there's already data for this catalogId, aggregate it
				// (multiple endpoints may map to the same catalog service)
				const existing = map.get(catalogId);
				if (existing) {
					map.set(catalogId, {
						...existing,
						totalCalls: existing.totalCalls + data.totalCalls,
						successCount: existing.successCount + data.successCount,
						errorCount: existing.errorCount + data.errorCount,
						estimatedCostCents: existing.estimatedCostCents + data.estimatedCostCents,
						// Keep the most recent lastCalledAt
						lastCalledAt:
							data.lastCalledAt && existing.lastCalledAt
								? new Date(data.lastCalledAt) > new Date(existing.lastCalledAt)
									? data.lastCalledAt
									: existing.lastCalledAt
								: data.lastCalledAt || existing.lastCalledAt,
					});
				} else {
					map.set(catalogId, data);
				}
			}
			// Also set by lowercase api name for fallback lookup
			map.set(data.apiName.toLowerCase(), data);
		});
		return map;
	}, [aggregatedUsage]);

	// Enrich services with usage data
	const enrichedServices = useMemo(() => {
		return API_SERVICE_CATALOG.map((service) => {
			// Try to get usage from manual data or aggregated database data
			const manualUsage = usageMap.get(service.id);
			const dbUsage = aggregatedUsageMap.get(service.id) || aggregatedUsageMap.get(service.name);

			// Prefer manual usage, then database usage
			const currentUsage = manualUsage?.currentUsage ?? dbUsage?.totalCalls ?? 0;
			const freeTierLimit = service.freeTier?.limit ?? null;
			const usagePercentage = calculateUsagePercentage(currentUsage, freeTierLimit);

			// Use tracked cost from database when available (more accurate)
			// Fall back to calculated cost only for services without tracking
			const trackedCostCents = dbUsage?.estimatedCostCents ?? 0;
			const calculatedCost = calculateOverageCost(currentUsage, freeTierLimit, service.pricing.perUnit);
			// Convert tracked cost from cents to dollars
			const overageCost = trackedCostCents > 0 ? trackedCostCents / 100 : calculatedCost;

			const usageStatus = getUsageStatus(usagePercentage);

			return {
				...service,
				currentUsage,
				usagePercentage,
				overageCost,
				status: usageStatus,
				lastUpdated: manualUsage?.lastUpdated ?? dbUsage?.lastCalledAt ?? null,
				dbCostCents: trackedCostCents,
				errorCount: dbUsage?.errorCount ?? 0,
				successCount: dbUsage?.successCount ?? 0,
			};
		});
	}, [usageMap, aggregatedUsageMap]);

	// Apply filters
	const filteredServices = useMemo(() => {
		return enrichedServices.filter((service) => {
			// Search filter
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				const matchesSearch =
					service.name.toLowerCase().includes(query) ||
					service.provider.toLowerCase().includes(query) ||
					service.description.toLowerCase().includes(query);
				if (!matchesSearch) return false;
			}

			// Category filter
			if (categoryFilter !== "all" && service.category !== categoryFilter) {
				return false;
			}

			// Status filter
			if (statusFilter !== "all" && service.status !== statusFilter) {
				return false;
			}

			return true;
		});
	}, [enrichedServices, searchQuery, categoryFilter, statusFilter]);

	// Calculate summary stats
	const summaryStats = useMemo(() => {
		const totalServices = API_SERVICE_CATALOG.length;
		const activeServices = enrichedServices.filter((s) => s.status === "ok").length;
		const servicesAtRisk = enrichedServices.filter(
			(s) => s.status === "warning" || s.status === "critical" || s.status === "over"
		).length;
		const servicesOverLimit = enrichedServices.filter((s) => s.status === "over").length;
		const totalOverageCost = enrichedServices.reduce((sum, s) => sum + s.overageCost, 0);
		const servicesWithFreeTier = enrichedServices.filter((s) => s.freeTier !== null).length;

		// Calculate estimated monthly savings from free tiers
		const freeTierSavings = enrichedServices.reduce((sum, service) => {
			if (service.freeTier && service.currentUsage > 0) {
				const freeUsage = Math.min(service.currentUsage, service.freeTier.limit);
				return sum + freeUsage * service.pricing.perUnit;
			}
			return sum;
		}, 0);

		return {
			totalServices,
			activeServices,
			servicesAtRisk,
			servicesOverLimit,
			totalOverageCost,
			servicesWithFreeTier,
			freeTierSavings,
		};
	}, [enrichedServices]);

	const formatCurrency = (cents: number) => {
		if (cents >= 100) {
			return `$${(cents / 100).toFixed(2)}`;
		}
		return `$${cents.toFixed(4)}`;
	};

	const formatNumber = (num: number) => {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
		return num.toLocaleString();
	};

	const getStatusBadge = (status: "ok" | "warning" | "critical" | "over") => {
		switch (status) {
			case "over":
				return (
					<Badge variant="destructive" className="gap-1">
						<AlertTriangle className="h-3 w-3" />
						Over Limit
					</Badge>
				);
			case "critical":
				return (
					<Badge variant="destructive" className="gap-1 bg-orange-500">
						<AlertCircle className="h-3 w-3" />
						Critical
					</Badge>
				);
			case "warning":
				return (
					<Badge variant="secondary" className="gap-1 bg-yellow-500/20 text-yellow-600">
						<AlertCircle className="h-3 w-3" />
						Warning
					</Badge>
				);
			default:
				return (
					<Badge variant="secondary" className="gap-1 bg-green-500/20 text-green-600">
						<CheckCircle className="h-3 w-3" />
						OK
					</Badge>
				);
		}
	};

	const getProgressColor = (percentage: number | null) => {
		if (percentage === null) return "bg-muted";
		if (percentage >= 100) return "bg-destructive";
		if (percentage >= 90) return "bg-orange-500";
		if (percentage >= 70) return "bg-yellow-500";
		return "bg-green-500";
	};

	return (
		<div className="space-y-6">
			{/* Summary Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="p-4">
					<div className="flex items-center gap-2 text-muted-foreground mb-2">
						<Zap className="h-4 w-4" />
						<span className="text-xs font-medium">Total APIs</span>
					</div>
					<p className="text-2xl font-bold">{summaryStats.totalServices}</p>
					<p className="text-xs text-muted-foreground mt-1">
						{summaryStats.servicesWithFreeTier} with free tier
					</p>
				</Card>

				<Card className="p-4">
					<div className="flex items-center gap-2 text-muted-foreground mb-2">
						<AlertTriangle className="h-4 w-4" />
						<span className="text-xs font-medium">Services At Risk</span>
					</div>
					<p className="text-2xl font-bold">{summaryStats.servicesAtRisk}</p>
					<p className="text-xs text-muted-foreground mt-1">
						{summaryStats.servicesOverLimit} over limit
					</p>
				</Card>

				<Card className="p-4">
					<div className="flex items-center gap-2 text-muted-foreground mb-2">
						<DollarSign className="h-4 w-4" />
						<span className="text-xs font-medium">Current Overage</span>
					</div>
					<p className="text-2xl font-bold text-destructive">
						{formatCurrency(summaryStats.totalOverageCost * 100)}
					</p>
					<p className="text-xs text-muted-foreground mt-1">This billing period</p>
				</Card>

				<Card className="p-4">
					<div className="flex items-center gap-2 text-muted-foreground mb-2">
						<TrendingUp className="h-4 w-4" />
						<span className="text-xs font-medium">Free Tier Savings</span>
					</div>
					<p className="text-2xl font-bold text-green-600">
						{formatCurrency(summaryStats.freeTierSavings * 100)}
					</p>
					<p className="text-xs text-muted-foreground mt-1">Estimated monthly</p>
				</Card>
			</div>

			{/* Filters */}
			<div className="flex flex-col md:flex-row gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search APIs..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>
				<Select
					value={categoryFilter}
					onValueChange={(value) => setCategoryFilter(value as ServiceCategory | "all")}
				>
					<SelectTrigger className="w-full md:w-[180px]">
						<SelectValue placeholder="Category" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Categories</SelectItem>
						{Object.entries(CATEGORY_META).map(([key, meta]) => (
							<SelectItem key={key} value={key}>
								{meta.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select
					value={statusFilter}
					onValueChange={(value) =>
						setStatusFilter(value as "all" | "ok" | "warning" | "critical" | "over")
					}
				>
					<SelectTrigger className="w-full md:w-[150px]">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="ok">OK</SelectItem>
						<SelectItem value="warning">Warning</SelectItem>
						<SelectItem value="critical">Critical</SelectItem>
						<SelectItem value="over">Over Limit</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Full Width Table */}
			<div className="rounded-lg border bg-card overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow className="bg-muted/50">
							<TableHead className="w-[250px]">Service</TableHead>
							<TableHead>Provider</TableHead>
							<TableHead>Free Tier</TableHead>
							<TableHead className="text-right">Current Usage</TableHead>
							<TableHead className="w-[200px]">Usage %</TableHead>
							<TableHead className="text-right">Unit Cost</TableHead>
							<TableHead className="text-right">Overage Cost</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="w-[50px]"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredServices.length === 0 ? (
							<TableRow>
								<TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
									No services found matching your filters.
								</TableCell>
							</TableRow>
						) : (
							filteredServices.map((service) => {
								const CategoryIcon = CategoryIcons[service.category];
								return (
									<TableRow key={service.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<div
													className={`flex h-8 w-8 items-center justify-center rounded-lg bg-${CATEGORY_META[service.category].color}-500/10`}
												>
													<CategoryIcon className="h-4 w-4 text-muted-foreground" />
												</div>
												<div>
													<p className="font-medium">{service.name}</p>
													<p className="text-xs text-muted-foreground truncate max-w-[180px]">
														{service.description}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="outline">{service.provider}</Badge>
										</TableCell>
										<TableCell>
											{service.freeTier ? (
												<div className="text-sm">
													<span className="font-medium">
														{formatNumber(service.freeTier.limit)}
													</span>
													<span className="text-muted-foreground ml-1">
														{service.freeTier.unit}/{service.freeTier.period}
													</span>
												</div>
											) : (
												<span className="text-muted-foreground text-sm">No free tier</span>
											)}
										</TableCell>
										<TableCell className="text-right font-mono">
											{formatNumber(service.currentUsage)}
										</TableCell>
										<TableCell>
											{service.usagePercentage !== null ? (
												<div className="flex items-center gap-2">
													<div className="flex-1">
														<Progress
															value={Math.min(service.usagePercentage, 100)}
															className={`h-2 ${getProgressColor(service.usagePercentage)}`}
														/>
													</div>
													<span className="text-xs font-medium w-12 text-right">
														{service.usagePercentage}%
													</span>
												</div>
											) : (
												<span className="text-muted-foreground text-sm">N/A</span>
											)}
										</TableCell>
										<TableCell className="text-right font-mono text-sm">
											${service.pricing.perUnit.toFixed(6)}
											<span className="text-muted-foreground">/{service.pricing.unit}</span>
										</TableCell>
										<TableCell className="text-right font-mono">
											{service.overageCost > 0 ? (
												<span className="text-destructive font-medium">
													{formatCurrency(service.overageCost * 100)}
												</span>
											) : (
												<span className="text-muted-foreground">$0.00</span>
											)}
										</TableCell>
										<TableCell>{getStatusBadge(service.status)}</TableCell>
										<TableCell>
											<a
												href={service.pricingUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="text-muted-foreground hover:text-foreground"
											>
												<ExternalLink className="h-4 w-4" />
											</a>
										</TableCell>
									</TableRow>
								);
							})
						)}
					</TableBody>
				</Table>
			</div>

			{/* Footer Stats */}
			<div className="flex items-center justify-between text-sm text-muted-foreground">
				<span>
					Showing {filteredServices.length} of {API_SERVICE_CATALOG.length} services
				</span>
				<LastUpdatedTime />
			</div>
		</div>
	);
}

export function ApiUsageSectionSkeleton() {
	return (
		<div className="space-y-6 animate-pulse">
			{/* Summary Cards Skeleton */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					<Card key={i} className="p-4">
						<div className="h-4 w-20 bg-muted rounded mb-2" />
						<div className="h-8 w-16 bg-muted rounded mb-1" />
						<div className="h-3 w-24 bg-muted rounded" />
					</Card>
				))}
			</div>

			{/* Filters Skeleton */}
			<div className="flex flex-col md:flex-row gap-4">
				<div className="h-10 flex-1 bg-muted rounded" />
				<div className="h-10 w-[180px] bg-muted rounded" />
				<div className="h-10 w-[150px] bg-muted rounded" />
			</div>

			{/* Table Skeleton */}
			<div className="rounded-lg border bg-card">
				<div className="h-12 bg-muted/50 border-b" />
				{[...Array(10)].map((_, i) => (
					<div key={i} className="h-16 border-b flex items-center px-4 gap-4">
						<div className="h-8 w-8 bg-muted rounded" />
						<div className="h-4 flex-1 bg-muted rounded" />
						<div className="h-4 w-20 bg-muted rounded" />
						<div className="h-4 w-16 bg-muted rounded" />
					</div>
				))}
			</div>
		</div>
	);
}

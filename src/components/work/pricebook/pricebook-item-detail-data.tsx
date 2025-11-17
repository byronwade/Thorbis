import { Clock, DollarSign, History, Package, TrendingUp, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type PriceBookItemDetailDataProps = {
	itemId: string;
};

// Mock data - will be replaced with database query
const mockItem = {
	id: "1",
	itemType: "service" as const,
	name: "HVAC System Inspection",
	sku: "SVC-001",
	description:
		"Complete inspection of HVAC system including air handlers, condensers, ductwork, and thermostats. Includes filter replacement and system efficiency testing.",
	category: "HVAC",
	subcategory: "Inspection",
	cost: 7500, // $75.00 in cents
	price: 12_500, // $125.00 in cents
	markupPercent: 67,
	unit: "each",
	minimumQuantity: 1,
	isActive: true,
	isTaxable: true,
	supplierName: null,
	supplierSku: null,
	imageUrl: null,
	tags: ["inspection", "maintenance", "hvac", "seasonal"],
	notes:
		"Recommended for seasonal maintenance. Typically takes 1-2 hours depending on system complexity.",
	createdAt: "2025-01-05T09:00:00Z",
	updatedAt: "2025-01-15T14:30:00Z",
};

// Mock price history
const mockPriceHistory = [
	{
		id: "1",
		oldCost: 7000,
		newCost: 7500,
		oldPrice: 12_000,
		newPrice: 12_500,
		changeType: "manual",
		changeReason: "Annual price adjustment",
		changedBy: "John Doe",
		effectiveDate: "2025-01-15T14:30:00Z",
	},
	{
		id: "2",
		oldCost: 6500,
		newCost: 7000,
		oldPrice: 11_000,
		newPrice: 12_000,
		changeType: "bulk_update",
		changeReason: "Q4 2024 price increase",
		changedBy: "System",
		effectiveDate: "2024-10-01T00:00:00Z",
	},
];

const categoryIcons = {
	HVAC: Wrench,
	Plumbing: Package,
	Electrical: TrendingUp,
	General: Package,
};

function getItemTypeBadge(type: string) {
	const config = {
		service: {
			className: "bg-primary text-primary dark:bg-primary/20 dark:text-primary",
			label: "Service",
		},
		material: {
			className: "bg-accent text-accent-foreground dark:bg-accent/20 dark:text-accent-foreground",
			label: "Material",
		},
		package: {
			className: "bg-success text-success dark:bg-success/20 dark:text-success",
			label: "Package",
		},
	};

	const typeConfig = config[type as keyof typeof config] || config.service;

	return (
		<Badge className={typeConfig.className} variant="outline">
			{typeConfig.label}
		</Badge>
	);
}

function formatCurrency(cents: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
	}).format(cents / 100);
}

function formatDate(dateString: string) {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function formatDateTime(dateString: string) {
	return new Date(dateString).toLocaleString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

/**
 * Price Book Item Detail Data - Async Server Component
 *
 * Fetches price book item data with 2 queries:
 * 1. Price book item details
 * 2. Price history
 *
 * Streams in after shell renders (50-150ms).
 *
 * TODO: Replace mock data with real database queries
 */
export async function PriceBookItemDetailData({ itemId }: PriceBookItemDetailDataProps) {
	// TODO: Fetch from database
	// const supabase = await createClient();
	// const { data: item, error: itemError } = await supabase
	//   .from("price_book_items")
	//   .select("*")
	//   .eq("id", itemId)
	//   .single();
	// const { data: history, error: historyError } = await supabase
	//   .from("price_history")
	//   .select("*")
	//   .eq("item_id", itemId);
	// if (itemError || !item) notFound();

	const item = mockItem;
	const history = mockPriceHistory;
	const IconComponent = categoryIcons[item.category as keyof typeof categoryIcons] || Package;

	const revenue = item.price - item.cost;
	const marginPercent = ((revenue / item.price) * 100).toFixed(1);

	return (
		<>
			{/* Item Header - Simplified (Actions now in AppToolbar) */}
			<div className="space-y-2">
				<div className="flex items-center gap-3">
					<h1 className="text-3xl font-semibold tracking-tight">{item.name}</h1>
					{getItemTypeBadge(item.itemType)}
					<Badge variant={item.isActive ? "default" : "secondary"}>
						{item.isActive ? "Active" : "Inactive"}
					</Badge>
				</div>
				<p className="text-muted-foreground">
					{item.category}
					{item.subcategory && ` › ${item.subcategory}`}
				</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Main Content */}
				<div className="space-y-6 lg:col-span-2">
					{/* Pricing Card */}
					<Card>
						<CardHeader>
							<CardTitle>Pricing Details</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-6 sm:grid-cols-3">
								<div className="bg-muted/30 space-y-2 rounded-lg border p-4">
									<p className="text-muted-foreground text-xs font-medium uppercase">Cost</p>
									<p className="text-2xl font-semibold">{formatCurrency(item.cost)}</p>
									<p className="text-muted-foreground text-xs">Per {item.unit}</p>
								</div>

								<div className="bg-primary/5 space-y-2 rounded-lg border p-4">
									<p className="text-muted-foreground text-xs font-medium uppercase">Price</p>
									<p className="text-primary text-2xl font-semibold">
										{formatCurrency(item.price)}
									</p>
									<p className="text-muted-foreground text-xs">Per {item.unit}</p>
								</div>

								<div className="bg-success/50 dark:bg-success/20 space-y-2 rounded-lg border p-4">
									<p className="text-muted-foreground text-xs font-medium uppercase">
										Profit Margin
									</p>
									<p className="text-success dark:text-success text-2xl font-semibold">
										{marginPercent}%
									</p>
									<p className="text-success dark:text-success text-xs">
										{formatCurrency(revenue)} profit
									</p>
								</div>
							</div>

							<Separator className="my-4" />

							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground text-sm">Markup Percentage</span>
									<span className="font-medium">{item.markupPercent}%</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground text-sm">Minimum Quantity</span>
									<span className="font-medium">{item.minimumQuantity}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground text-sm">Taxable</span>
									<Badge variant={item.isTaxable ? "default" : "secondary"}>
										{item.isTaxable ? "Yes" : "No"}
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Description */}
					{item.description && (
						<Card>
							<CardHeader>
								<CardTitle>Description</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground leading-relaxed">{item.description}</p>
							</CardContent>
						</Card>
					)}

					{/* Price History */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>Price History</CardTitle>
								<History className="text-muted-foreground size-4" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{history.map((change) => (
									<div className="bg-muted/30 flex gap-4 rounded-lg border p-4" key={change.id}>
										<div className="bg-background flex size-10 shrink-0 items-center justify-center rounded-full">
											<TrendingUp className="text-muted-foreground size-5" />
										</div>
										<div className="flex-1 space-y-2">
											<div className="flex items-start justify-between gap-4">
												<div>
													<p className="text-sm font-medium">
														{change.changeType === "manual"
															? "Manual Price Update"
															: change.changeType === "bulk_update"
																? "Bulk Price Update"
																: "Supplier Sync"}
													</p>
													{change.changeReason && (
														<p className="text-muted-foreground text-xs">{change.changeReason}</p>
													)}
												</div>
												<p className="text-muted-foreground text-xs text-nowrap">
													{formatDateTime(change.effectiveDate)}
												</p>
											</div>
											<div className="grid gap-3 text-sm sm:grid-cols-2">
												<div>
													<p className="text-muted-foreground text-xs">Cost Change</p>
													<p className="font-medium">
														{formatCurrency(change.oldCost)} →{" "}
														<span className="text-success dark:text-success">
															{formatCurrency(change.newCost)}
														</span>
													</p>
												</div>
												<div>
													<p className="text-muted-foreground text-xs">Price Change</p>
													<p className="font-medium">
														{formatCurrency(change.oldPrice)} →{" "}
														<span className="text-success dark:text-success">
															{formatCurrency(change.newPrice)}
														</span>
													</p>
												</div>
											</div>
											<p className="text-muted-foreground text-xs">Changed by {change.changedBy}</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Internal Notes */}
					{item.notes && (
						<Card>
							<CardHeader>
								<CardTitle>Internal Notes</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground text-sm">{item.notes}</p>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Item Details */}
					<Card>
						<CardHeader>
							<CardTitle>Item Details</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
									<IconComponent className="text-primary size-6" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium">{item.category}</p>
									{item.subcategory && (
										<p className="text-muted-foreground text-xs">{item.subcategory}</p>
									)}
								</div>
							</div>

							<Separator />

							<div className="space-y-1">
								<p className="text-muted-foreground text-xs">SKU / Item Code</p>
								<p className="font-mono text-sm font-medium">{item.sku}</p>
							</div>

							<div className="space-y-1">
								<p className="text-muted-foreground text-xs">Unit Type</p>
								<p className="text-sm font-medium capitalize">{item.unit}</p>
							</div>

							<Separator />

							<div className="space-y-1">
								<p className="text-muted-foreground text-xs">Created</p>
								<p className="text-sm font-medium">{formatDate(item.createdAt)}</p>
							</div>

							<div className="space-y-1">
								<p className="text-muted-foreground text-xs">Last Updated</p>
								<p className="text-sm font-medium">{formatDate(item.updatedAt)}</p>
							</div>
						</CardContent>
					</Card>

					{/* Supplier Info */}
					{item.supplierName && (
						<Card>
							<CardHeader>
								<CardTitle>Supplier</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="space-y-1">
									<p className="text-muted-foreground text-xs">Supplier Name</p>
									<p className="text-sm font-medium">{item.supplierName}</p>
								</div>

								{item.supplierSku && (
									<div className="space-y-1">
										<p className="text-muted-foreground text-xs">Supplier SKU</p>
										<p className="font-mono text-sm font-medium">{item.supplierSku}</p>
									</div>
								)}
							</CardContent>
						</Card>
					)}

					{/* Tags */}
					{item.tags && item.tags.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>Tags</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-2">
									{item.tags.map((tag) => (
										<Badge key={tag} variant="secondary">
											{tag}
										</Badge>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Quick Stats */}
					<Card>
						<CardHeader>
							<CardTitle>Quick Stats</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<DollarSign className="text-muted-foreground size-4" />
									<span className="text-sm">Revenue per unit</span>
								</div>
								<span className="text-success dark:text-success text-sm font-semibold">
									{formatCurrency(revenue)}
								</span>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<TrendingUp className="text-muted-foreground size-4" />
									<span className="text-sm">Markup</span>
								</div>
								<span className="text-sm font-semibold">{item.markupPercent}%</span>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Clock className="text-muted-foreground size-4" />
									<span className="text-sm">Price updates</span>
								</div>
								<span className="text-sm font-semibold">{history.length}</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
}

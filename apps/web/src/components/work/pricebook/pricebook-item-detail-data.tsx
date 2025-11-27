import {
	Clock,
	DollarSign,
	History,
	Package,
	TrendingUp,
	Wrench,
} from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";

type PriceBookItemDetailDataProps = {
	itemId: string;
};

type PriceBookItemFromDB = {
	id: string;
	item_type: string;
	name: string;
	sku: string | null;
	description: string | null;
	category: string | null;
	subcategory: string | null;
	cost: number | null;
	price: number;
	markup_percent: number | null;
	unit: string;
	minimum_quantity: number | null;
	is_active: boolean;
	is_taxable: boolean;
	supplier_id: string | null;
	supplier_sku: string | null;
	image_url: string | null;
	tags: string[] | null;
	notes: string | null;
	created_at: string;
	updated_at: string;
};

type PriceHistoryFromDB = {
	id: string;
	old_cost: number | null;
	new_cost: number | null;
	old_price: number | null;
	new_price: number | null;
	change_type: string;
	change_reason: string | null;
	changed_by: string | null;
	effective_date: string;
	user?: {
		first_name: string | null;
		last_name: string | null;
	} | null;
};

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
			className:
				"bg-accent text-accent-foreground dark:bg-accent/20 dark:text-accent-foreground",
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
 * 2. Price history with user names
 *
 * Streams in after shell renders (50-150ms).
 */
export async function PriceBookItemDetailData({
	itemId,
}: PriceBookItemDetailDataProps) {
	const supabase = await createClient();

	// Fetch price book item
	const { data: rawItem, error: itemError } = await supabase
		.from("price_book_items")
		.select("*")
		.eq("id", itemId)
		.single();

	if (itemError || !rawItem) {
		notFound();
	}

	// Fetch price history with user info
	const { data: rawHistory } = await supabase
		.from("price_history")
		.select(`
			id,
			old_cost,
			new_cost,
			old_price,
			new_price,
			change_type,
			change_reason,
			changed_by,
			effective_date,
			user:users!price_history_changed_by_fkey(first_name, last_name)
		`)
		.eq("item_id", itemId)
		.order("effective_date", { ascending: false })
		.limit(10);

	// Transform database item to component format
	const dbItem = rawItem as PriceBookItemFromDB;
	const item = {
		id: dbItem.id,
		itemType: dbItem.item_type as "service" | "material" | "package",
		name: dbItem.name,
		sku: dbItem.sku || "N/A",
		description: dbItem.description,
		category: dbItem.category || "General",
		subcategory: dbItem.subcategory,
		cost: dbItem.cost || 0,
		price: dbItem.price,
		markupPercent: dbItem.markup_percent || 0,
		unit: dbItem.unit,
		minimumQuantity: dbItem.minimum_quantity || 1,
		isActive: dbItem.is_active,
		isTaxable: dbItem.is_taxable,
		supplierName: null as string | null, // Would need to join with suppliers table
		supplierSku: dbItem.supplier_sku,
		imageUrl: dbItem.image_url,
		tags: (dbItem.tags as string[]) || [],
		notes: dbItem.notes,
		createdAt: dbItem.created_at,
		updatedAt: dbItem.updated_at,
	};

	// Transform price history
	const history = (rawHistory || []).map((h: PriceHistoryFromDB) => {
		const userName = h.user
			? `${h.user.first_name || ""} ${h.user.last_name || ""}`.trim() || "Unknown"
			: "System";
		return {
			id: h.id,
			oldCost: h.old_cost || 0,
			newCost: h.new_cost || 0,
			oldPrice: h.old_price || 0,
			newPrice: h.new_price || 0,
			changeType: h.change_type,
			changeReason: h.change_reason,
			changedBy: userName,
			effectiveDate: h.effective_date,
		};
	});
	const IconComponent =
		categoryIcons[item.category as keyof typeof categoryIcons] || Package;

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
									<p className="text-muted-foreground text-xs font-medium uppercase">
										Cost
									</p>
									<p className="text-2xl font-semibold">
										{formatCurrency(item.cost)}
									</p>
									<p className="text-muted-foreground text-xs">
										Per {item.unit}
									</p>
								</div>

								<div className="bg-primary/5 space-y-2 rounded-lg border p-4">
									<p className="text-muted-foreground text-xs font-medium uppercase">
										Price
									</p>
									<p className="text-primary text-2xl font-semibold">
										{formatCurrency(item.price)}
									</p>
									<p className="text-muted-foreground text-xs">
										Per {item.unit}
									</p>
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
									<span className="text-muted-foreground text-sm">
										Markup Percentage
									</span>
									<span className="font-medium">{item.markupPercent}%</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground text-sm">
										Minimum Quantity
									</span>
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
								<p className="text-muted-foreground leading-relaxed">
									{item.description}
								</p>
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
							{history.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-8 text-center">
									<History className="text-muted-foreground/50 mb-3 size-10" />
									<p className="text-muted-foreground text-sm">
										No price changes recorded yet
									</p>
									<p className="text-muted-foreground/70 mt-1 text-xs">
										Price history will appear here when prices are updated
									</p>
								</div>
							) : (
							<div className="space-y-4">
								{history.map((change) => (
									<div
										className="bg-muted/30 flex gap-4 rounded-lg border p-4"
										key={change.id}
									>
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
														<p className="text-muted-foreground text-xs">
															{change.changeReason}
														</p>
													)}
												</div>
												<p className="text-muted-foreground text-xs text-nowrap">
													{formatDateTime(change.effectiveDate)}
												</p>
											</div>
											<div className="grid gap-3 text-sm sm:grid-cols-2">
												<div>
													<p className="text-muted-foreground text-xs">
														Cost Change
													</p>
													<p className="font-medium">
														{formatCurrency(change.oldCost)} →{" "}
														<span className="text-success dark:text-success">
															{formatCurrency(change.newCost)}
														</span>
													</p>
												</div>
												<div>
													<p className="text-muted-foreground text-xs">
														Price Change
													</p>
													<p className="font-medium">
														{formatCurrency(change.oldPrice)} →{" "}
														<span className="text-success dark:text-success">
															{formatCurrency(change.newPrice)}
														</span>
													</p>
												</div>
											</div>
											<p className="text-muted-foreground text-xs">
												Changed by {change.changedBy}
											</p>
										</div>
									</div>
								))}
							</div>
							)}
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
										<p className="text-muted-foreground text-xs">
											{item.subcategory}
										</p>
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
								<p className="text-sm font-medium">
									{formatDate(item.createdAt)}
								</p>
							</div>

							<div className="space-y-1">
								<p className="text-muted-foreground text-xs">Last Updated</p>
								<p className="text-sm font-medium">
									{formatDate(item.updatedAt)}
								</p>
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
										<p className="text-muted-foreground text-xs">
											Supplier SKU
										</p>
										<p className="font-mono text-sm font-medium">
											{item.supplierSku}
										</p>
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
								<span className="text-sm font-semibold">
									{item.markupPercent}%
								</span>
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

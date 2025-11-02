import {
  Clock,
  DollarSign,
  History,
  Package,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/**
 * Price Book Item Detail Page - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches item data
 * - Client components only for interactive actions
 */

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
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      label: "Service",
    },
    material: {
      className:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      label: "Material",
    },
    package: {
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
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

export default async function PriceBookItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params in Next.js 16+
  const { id } = await params;

  // TODO: Fetch from database
  // const item = await db.select().from(priceBookItems).where(eq(priceBookItems.id, id)).limit(1);
  // const history = await db.select().from(priceHistory).where(eq(priceHistory.itemId, id));
  // if (!item[0]) notFound();

  const item = mockItem;
  const history = mockPriceHistory;
  const IconComponent =
    categoryIcons[item.category as keyof typeof categoryIcons] || Package;

  const revenue = item.price - item.cost;
  const marginPercent = ((revenue / item.price) * 100).toFixed(1);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Item Header - Simplified (Actions now in AppToolbar) */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-3xl tracking-tight">{item.name}</h1>
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
                <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                  <p className="font-medium text-muted-foreground text-xs uppercase">
                    Cost
                  </p>
                  <p className="font-semibold text-2xl">
                    {formatCurrency(item.cost)}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Per {item.unit}
                  </p>
                </div>

                <div className="space-y-2 rounded-lg border bg-primary/5 p-4">
                  <p className="font-medium text-muted-foreground text-xs uppercase">
                    Price
                  </p>
                  <p className="font-semibold text-2xl text-primary">
                    {formatCurrency(item.price)}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Per {item.unit}
                  </p>
                </div>

                <div className="space-y-2 rounded-lg border bg-green-50/50 p-4 dark:bg-green-950/20">
                  <p className="font-medium text-muted-foreground text-xs uppercase">
                    Profit Margin
                  </p>
                  <p className="font-semibold text-2xl text-green-600 dark:text-green-500">
                    {marginPercent}%
                  </p>
                  <p className="text-green-600 text-xs dark:text-green-500">
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
                <History className="size-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.map((change) => (
                  <div
                    className="flex gap-4 rounded-lg border bg-muted/30 p-4"
                    key={change.id}
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background">
                      <TrendingUp className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-sm">
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
                        <p className="text-nowrap text-muted-foreground text-xs">
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
                            <span className="text-green-600 dark:text-green-500">
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
                            <span className="text-green-600 dark:text-green-500">
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
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <IconComponent className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.category}</p>
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
                <p className="font-medium font-mono text-sm">{item.sku}</p>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Unit Type</p>
                <p className="font-medium text-sm capitalize">{item.unit}</p>
              </div>

              <Separator />

              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Created</p>
                <p className="font-medium text-sm">
                  {formatDate(item.createdAt)}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Last Updated</p>
                <p className="font-medium text-sm">
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
                  <p className="font-medium text-sm">{item.supplierName}</p>
                </div>

                {item.supplierSku && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">
                      Supplier SKU
                    </p>
                    <p className="font-medium font-mono text-sm">
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
                  <DollarSign className="size-4 text-muted-foreground" />
                  <span className="text-sm">Revenue per unit</span>
                </div>
                <span className="font-semibold text-green-600 text-sm dark:text-green-500">
                  {formatCurrency(revenue)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-muted-foreground" />
                  <span className="text-sm">Markup</span>
                </div>
                <span className="font-semibold text-sm">
                  {item.markupPercent}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <span className="text-sm">Price updates</span>
                </div>
                <span className="font-semibold text-sm">{history.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

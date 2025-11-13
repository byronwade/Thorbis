"use client";

/**
 * Price Book Sidebar - Client Component
 *
 * Dedicated sidebar for price book page with:
 * - Supplier API integration status
 * - Quick actions (labor calculator, bulk operations)
 * - Category filtering
 * - Active filters display
 *
 * Performance optimizations:
 * - Zustand for state management
 * - Selective re-renders with shallow selectors
 */

import {
  AlertCircle,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  Loader2,
  Plus,
  Settings,
  TrendingUp,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  type SupplierName,
  type SyncStatus,
  usePriceBookStore,
} from "@/lib/stores/pricebook-store";

// ============================================================================
// Supplier Status Icon Component
// ============================================================================

function SupplierStatusIcon({ status }: { status: SyncStatus }) {
  switch (status) {
    case "connected":
      return <CheckCircle2 className="size-4 text-success dark:text-success" />;
    case "syncing":
      return (
        <Loader2 className="size-4 animate-spin text-primary dark:text-primary" />
      );
    case "error":
      return (
        <AlertCircle className="size-4 text-destructive dark:text-destructive" />
      );
    case "warning":
      return <AlertCircle className="size-4 text-warning dark:text-warning" />;
    case "disconnected":
    default:
      return <div className="size-2 rounded-full bg-muted-foreground/30" />;
  }
}

// ============================================================================
// Supplier Status Card Component
// ============================================================================

function SupplierStatusCard({
  name,
  displayName,
  status,
  lastSyncAt,
  itemsImported,
  errorMessage,
}: {
  name: SupplierName;
  displayName: string;
  status: SyncStatus;
  lastSyncAt: Date | null;
  itemsImported: number;
  errorMessage: string | null;
}) {
  const syncSupplier = usePriceBookStore((state) => state.syncSupplier);
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    await syncSupplier(name);
    setIsLoading(false);
  };

  const getStatusText = () => {
    if (status === "syncing") return "Syncing...";
    if (status === "error") return errorMessage || "Error";
    if (status === "connected" && lastSyncAt) {
      const now = new Date();
      const diffHours = Math.floor(
        (now.getTime() - lastSyncAt.getTime()) / (1000 * 60 * 60)
      );
      if (diffHours < 1) return "Just now";
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    }
    return "Not connected";
  };

  return (
    <div className="group rounded-lg border p-3 transition-all hover:border-primary/50 hover:bg-accent/5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <SupplierStatusIcon status={status} />
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-medium text-sm leading-none">{displayName}</p>
            <p className="text-muted-foreground text-xs">{getStatusText()}</p>
            {status === "connected" && itemsImported > 0 && (
              <p className="text-success text-xs dark:text-success">
                {itemsImported.toLocaleString()} items
              </p>
            )}
          </div>
        </div>
        <Button
          className="size-7 opacity-0 transition-opacity group-hover:opacity-100"
          disabled={isLoading || status === "syncing"}
          onClick={handleSync}
          size="icon"
          variant="ghost"
        >
          <Loader2
            className={`size-3 ${isLoading || status === "syncing" ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
      {status === "error" && errorMessage && (
        <div className="mt-2 rounded-md bg-destructive p-2 dark:bg-destructive/20">
          <p className="text-destructive text-xs dark:text-destructive">
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Quick Actions Section
// ============================================================================

function QuickActionsSection() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
      <div className="space-y-2 px-2">
        <Button
          asChild
          className="w-full justify-start gap-2 text-xs"
          size="sm"
          variant="outline"
        >
          <Link href="/dashboard/work/pricebook/labor-calculator">
            <Calculator className="size-3" />
            Labor Calculator
          </Link>
        </Button>
        <Button
          asChild
          className="w-full justify-start gap-2 text-xs"
          size="sm"
          variant="outline"
        >
          <Link href="/dashboard/work/pricebook/mass-update">
            <TrendingUp className="size-3" />
            Mass Price Increase
          </Link>
        </Button>
        <Button
          asChild
          className="w-full justify-start gap-2 text-xs"
          size="sm"
          variant="outline"
        >
          <Link href="/dashboard/work/pricebook/import">
            <Upload className="size-3" />
            Bulk Import
          </Link>
        </Button>
        <Button
          asChild
          className="w-full justify-start gap-2 text-xs"
          size="sm"
          variant="outline"
        >
          <Link href="/dashboard/work/pricebook/export">
            <Download className="size-3" />
            Bulk Export
          </Link>
        </Button>
      </div>
    </SidebarGroup>
  );
}

// ============================================================================
// Categories Section
// ============================================================================

function CategoriesSection() {
  const [collapsed, setCollapsed] = useState(false);
  const categories = usePriceBookStore((state) => state.filters.categories);
  const setCategories = usePriceBookStore((state) => state.setCategories);

  // Mock categories - will come from database
  const availableCategories = [
    { name: "HVAC", count: 45 },
    { name: "Plumbing", count: 38 },
    { name: "Electrical", count: 52 },
    { name: "General", count: 23 },
  ];

  const toggleCategory = (name: string) => {
    if (categories.includes(name)) {
      setCategories(categories.filter((c) => c !== name));
    } else {
      setCategories([...categories, name]);
    }
  };

  return (
    <SidebarGroup>
      <button
        className="flex w-full items-center justify-between px-2"
        onClick={() => setCollapsed(!collapsed)}
        type="button"
      >
        <SidebarGroupLabel>Categories</SidebarGroupLabel>
        {collapsed ? (
          <ChevronRight className="size-4" />
        ) : (
          <ChevronDown className="size-4" />
        )}
      </button>
      {!collapsed && (
        <div className="space-y-1 px-2 pt-2">
          {availableCategories.map((category) => (
            <button
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent"
              key={category.name}
              onClick={() => toggleCategory(category.name)}
              type="button"
            >
              <span className="flex items-center gap-2">
                {categories.includes(category.name) && (
                  <Check className="size-3 text-primary" />
                )}
                <span
                  className={
                    categories.includes(category.name) ? "font-medium" : ""
                  }
                >
                  {category.name}
                </span>
              </span>
              <Badge className="text-xs" variant="secondary">
                {category.count}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </SidebarGroup>
  );
}

// ============================================================================
// Active Filters Section
// ============================================================================

function ActiveFiltersSection() {
  const filters = usePriceBookStore((state) => state.filters);
  const resetFilters = usePriceBookStore((state) => state.resetFilters);
  const setCategories = usePriceBookStore((state) => state.setCategories);
  const setItemTypes = usePriceBookStore((state) => state.setItemTypes);

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.itemTypes.length > 0 ||
    filters.statusFilter !== "all" ||
    filters.supplierFilter.length > 0;

  if (!hasActiveFilters) return null;

  const removeCategory = (category: string) => {
    setCategories(filters.categories.filter((c) => c !== category));
  };

  const removeItemType = (type: "service" | "material" | "package") => {
    setItemTypes(filters.itemTypes.filter((t) => t !== type));
  };

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between px-2">
        <SidebarGroupLabel>Active Filters</SidebarGroupLabel>
        <Button
          className="h-auto p-0 text-xs"
          onClick={resetFilters}
          size="sm"
          variant="link"
        >
          Clear all
        </Button>
      </div>
      <div className="space-y-2 px-2">
        {filters.categories.map((category) => (
          <Badge className="gap-1" key={category} variant="secondary">
            {category}
            <button
              className="ml-1 rounded-sm hover:bg-accent"
              onClick={() => removeCategory(category)}
              type="button"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
        {filters.itemTypes.map((type) => (
          <Badge className="gap-1" key={type} variant="outline">
            {type}
            <button
              className="ml-1 rounded-sm hover:bg-accent"
              onClick={() => removeItemType(type)}
              type="button"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
    </SidebarGroup>
  );
}

// ============================================================================
// Main Sidebar Component
// ============================================================================

export function PriceBookSidebar() {
  const suppliers = usePriceBookStore((state) => state.suppliers);
  const [suppliersCollapsed, setSuppliersCollapsed] = useState(false);

  return (
    <Sidebar collapsible="offcanvas" side="right" variant="inset">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">Price Book Tools</h2>
          <Button asChild size="icon" variant="ghost">
            <Link href="/dashboard/settings/pricebook/integrations">
              <Settings className="size-4" />
            </Link>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {/* API Integrations Section */}
        <SidebarGroup>
          <button
            className="flex w-full items-center justify-between px-2"
            onClick={() => setSuppliersCollapsed(!suppliersCollapsed)}
            type="button"
          >
            <SidebarGroupLabel>API Integrations</SidebarGroupLabel>
            {suppliersCollapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </button>
          {!suppliersCollapsed && (
            <div className="space-y-2 px-2 pt-2">
              {suppliers.map((supplier) => (
                <SupplierStatusCard key={supplier.name} {...supplier} />
              ))}
            </div>
          )}
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Quick Actions */}
        <QuickActionsSection />

        <Separator className="my-2" />

        {/* Categories */}
        <CategoriesSection />

        <Separator className="my-2" />

        {/* Active Filters */}
        <ActiveFiltersSection />
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <Button asChild className="w-full gap-2" size="sm" variant="default">
          <Link href="/dashboard/work/pricebook/new">
            <Plus className="size-4" />
            Add Item
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

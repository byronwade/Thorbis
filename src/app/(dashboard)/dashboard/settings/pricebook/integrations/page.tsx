/**
 * Price Book > Supplier Integrations Settings
 *
 * Manage API connections to major suppliers:
 * - Ferguson, Johnstone Supply, SPS, Grainger, HD Supply, etc.
 * - Real-time pricing sync
 * - Automatic SKU matching
 * - Sync frequency settings
 */

import { Plus, Settings, Zap } from "lucide-react";
import { SupplierConnectionCard } from "@/components/pricebook/supplier-connection-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SupplierStatus } from "@/lib/stores/pricebook-store";

// Mock supplier data - will be replaced with real API calls
const suppliers: SupplierStatus[] = [
  {
    name: "ferguson",
    displayName: "Ferguson Enterprises",
    status: "connected",
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    itemsImported: 1247,
    errorMessage: null,
    apiEnabled: true,
  },
  {
    name: "grainger",
    displayName: "Grainger",
    status: "connected",
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    itemsImported: 856,
    errorMessage: null,
    apiEnabled: true,
  },
  {
    name: "hdsupply",
    displayName: "HD Supply",
    status: "warning",
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    itemsImported: 423,
    errorMessage: "Sync delayed - will retry automatically",
    apiEnabled: true,
  },
  {
    name: "fastenal",
    displayName: "Fastenal",
    status: "disconnected",
    lastSyncAt: null,
    itemsImported: 0,
    errorMessage: null,
    apiEnabled: false,
  },
  {
    name: "pace",
    displayName: "Pace Supply",
    status: "disconnected",
    lastSyncAt: null,
    itemsImported: 0,
    errorMessage: null,
    apiEnabled: false,
  },
  {
    name: "winsupply",
    displayName: "Winsupply",
    status: "disconnected",
    lastSyncAt: null,
    itemsImported: 0,
    errorMessage: null,
    apiEnabled: false,
  },
];

export default async function SupplierIntegrationsPage() {
  // Fetch real supplier integrations from database
  const { getSupplierIntegrations } = await import("@/actions/suppliers");
  const result = await getSupplierIntegrations();

  // Transform database format to match UI expectations
  const dbSuppliers = result.success && result.data ? result.data : [];

  const suppliersData = dbSuppliers.length > 0
    ? dbSuppliers.map((s: any) => ({
        id: s.id,
        name: s.supplier_name,
        status: s.api_key ? "connected" : "available",
        lastSync: s.last_sync_at ? new Date(s.last_sync_at).toLocaleString() : null,
        itemsImported: s.items_imported || 0,
        errorMessage: s.last_error || null,
        apiEnabled: !!s.api_key,
      }))
    : suppliers; // Fallback to hardcoded list if no DB data

  const connectedCount = suppliersData.filter(
    (s) => s.status === "connected"
  ).length;
  const totalItems = suppliersData.reduce((sum, s) => sum + s.itemsImported, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-2xl">
              Supplier API Integrations
            </h1>
            <p className="text-muted-foreground text-sm">
              Connect to suppliers for real-time pricing and automatic catalog
              updates
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Connected Suppliers</CardDescription>
            <CardTitle className="text-4xl">{connectedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">
              of {suppliers.length} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Items Synced</CardDescription>
            <CardTitle className="text-4xl">
              {totalItems.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">
              Across all connected suppliers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Last Sync</CardDescription>
            <CardTitle className="text-4xl">30m</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">
              Syncs run every 6 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Supplier Integrations Work</CardTitle>
          <CardDescription>
            Automatic pricing and catalog synchronization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                <span className="font-bold">1</span>
              </div>
              <h3 className="font-medium">Connect Your Account</h3>
              <p className="text-muted-foreground text-sm">
                Enter your supplier account credentials to establish a secure
                connection
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                <span className="font-bold">2</span>
              </div>
              <h3 className="font-medium">Automatic Sync</h3>
              <p className="text-muted-foreground text-sm">
                Pricing and availability updates automatically every 6 hours
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                <span className="font-bold">3</span>
              </div>
              <h3 className="font-medium">Stay Up-to-Date</h3>
              <p className="text-muted-foreground text-sm">
                Your price book always reflects current supplier pricing
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <Settings className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="font-medium text-sm">Pro Tip</p>
                <p className="text-muted-foreground text-sm">
                  Enable automatic markup rules in settings to maintain your
                  profit margins when supplier prices change. You can set
                  different markup percentages for different categories or
                  suppliers.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Connection Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl">Available Suppliers</h2>
          <Button size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Request New Supplier
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {suppliers.map((supplier) => (
            <SupplierConnectionCard key={supplier.name} supplier={supplier} />
          ))}
        </div>
      </div>

      {/* Additional Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Settings</CardTitle>
          <CardDescription>
            Configure how and when supplier data is synchronized
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium text-sm">Automatic Sync Frequency</p>
              <p className="text-muted-foreground text-sm">
                How often to check for price updates
              </p>
            </div>
            <select className="rounded-md border bg-background px-3 py-2 text-sm">
              <option value="6">Every 6 hours</option>
              <option value="12">Every 12 hours</option>
              <option value="24">Daily</option>
              <option value="168">Weekly</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium text-sm">Price Change Notifications</p>
              <p className="text-muted-foreground text-sm">
                Get notified when supplier prices change significantly
              </p>
            </div>
            <Button size="sm" variant="outline">
              Configure
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium text-sm">Automatic Markup Rules</p>
              <p className="text-muted-foreground text-sm">
                Maintain profit margins when prices update
              </p>
            </div>
            <Button size="sm" variant="outline">
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

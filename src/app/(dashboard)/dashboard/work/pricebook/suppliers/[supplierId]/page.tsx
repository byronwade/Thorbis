/**
 * Supplier Detail Page
 *
 * Shows detailed information about a specific supplier integration:
 * - Connection status and health
 * - Sync history with timestamps
 * - Imported items from this supplier
 * - SKU mapping rules
 * - Pricing update settings
 */

import { ArrowLeft, CheckCircle2, Package, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type PageProps = {
  params: Promise<{
    supplierId: string;
  }>;
};

// Mock supplier data
const supplierData = {
  ferguson: {
    name: "Ferguson Enterprises",
    id: "ferguson",
    status: "connected" as const,
    logo: "/suppliers/ferguson-logo.png",
    description: "Leading plumbing, HVAC, and industrial supplies distributor",
    website: "https://www.ferguson.com",
    apiVersion: "v2.1",
    connectionDate: new Date("2024-01-15"),
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 30),
    itemsImported: 1247,
    syncHistory: [
      {
        date: new Date(Date.now() - 1000 * 60 * 30),
        status: "success",
        itemsUpdated: 23,
      },
      {
        date: new Date(Date.now() - 1000 * 60 * 60 * 6),
        status: "success",
        itemsUpdated: 15,
      },
      {
        date: new Date(Date.now() - 1000 * 60 * 60 * 12),
        status: "success",
        itemsUpdated: 8,
      },
      {
        date: new Date(Date.now() - 1000 * 60 * 60 * 18),
        status: "success",
        itemsUpdated: 12,
      },
      {
        date: new Date(Date.now() - 1000 * 60 * 60 * 24),
        status: "success",
        itemsUpdated: 31,
      },
    ],
  },
};

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default async function SupplierDetailPage({ params }: PageProps) {
  const { supplierId } = await params;

  // TODO: Fetch real supplier data
  const supplier =
    supplierData[supplierId as keyof typeof supplierData] ||
    supplierData.ferguson;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Back Button */}
      <Button asChild size="sm" variant="ghost">
        <Link href="/dashboard/settings/pricebook/integrations">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Integrations
        </Link>
      </Button>

      {/* Supplier Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border bg-muted">
            <Package className="h-8 w-8" />
          </div>
          <div>
            <h1 className="font-bold text-3xl">{supplier.name}</h1>
            <p className="text-muted-foreground">{supplier.description}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Now
          </Button>
          <Button size="sm">Configure</Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="font-semibold">Connected</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Items Imported</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-2xl">
              {supplier.itemsImported.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Last Sync</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-2xl">
              {formatRelativeTime(supplier.lastSyncAt)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>API Version</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">{supplier.apiVersion}</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Sync History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sync History</CardTitle>
          <CardDescription>Last 5 automatic synchronizations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {supplier.syncHistory.map((sync, index) => (
              <div key={index}>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Sync Completed</p>
                      <p className="text-muted-foreground text-xs">
                        {sync.itemsUpdated} items updated
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      {formatDateTime(sync.date)}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatRelativeTime(sync.date)}
                    </p>
                  </div>
                </div>
                {index < supplier.syncHistory.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connection Details */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Connection Information</CardTitle>
            <CardDescription>API connection details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Connected Since
              </span>
              <span className="font-medium text-sm">
                {supplier.connectionDate.toLocaleDateString()}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                API Endpoint
              </span>
              <span className="font-medium text-sm">api.ferguson.com</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Sync Frequency
              </span>
              <span className="font-medium text-sm">Every 6 hours</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Auto Sync</span>
              <Badge className="text-xs" variant="secondary">
                Enabled
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sync Settings</CardTitle>
            <CardDescription>Configure automatic updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Update Pricing
              </span>
              <Badge className="text-xs" variant="secondary">
                Enabled
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Update Availability
              </span>
              <Badge className="text-xs" variant="secondary">
                Enabled
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Import New Items
              </span>
              <Badge className="text-xs" variant="outline">
                Disabled
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Auto Markup</span>
              <span className="font-medium text-sm">67%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Imported Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Items from {supplier.name}</CardTitle>
              <CardDescription>
                {supplier.itemsImported} items imported from this supplier
              </CardDescription>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href={`/dashboard/work/pricebook?supplier=${supplier.id}`}>
                View All Items
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

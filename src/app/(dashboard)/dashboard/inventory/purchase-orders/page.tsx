"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function PurchaseOrdersPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Purchase Orders</h1>
        <p className="text-muted-foreground">
          Create and manage purchase orders
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Purchase Orders system coming soon...
        </p>
      </div>
    </div>
  );
}

"use client";

export const dynamic = "force-dynamic";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function ChartOfAccountsPage() {
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
        <h1 className="font-semibold text-2xl">Chart of Accounts</h1>
        <p className="text-muted-foreground">
          Manage your company's chart of accounts and account structure
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Chart of Accounts management coming soon...
        </p>
      </div>
    </div>
  );
}

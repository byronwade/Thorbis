"use client";

export const dynamic = "force-dynamic";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function AccountsReceivablePage() {
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
        <h1 className="font-semibold text-2xl">Accounts Receivable</h1>
        <p className="text-muted-foreground">
          Manage customer invoices and outstanding payments
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Accounts Receivable management coming soon...
        </p>
      </div>
    </div>
  );
}

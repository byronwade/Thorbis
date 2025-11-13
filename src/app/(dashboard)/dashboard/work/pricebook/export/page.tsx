/**
 * Bulk Export Page - Server Component
 *
 * Export price book items to various formats:
 * - Filter selection (category, type, supplier, etc.)
 * - Format selection (CSV, Excel, PDF)
 * - Custom column selection
 * - Download functionality
 * - Export history tracking
 *
 * Note: Toolbar is rendered by LayoutWrapper based on unified-layout-config.tsx
 */

import { Download, FileSpreadsheet, Filter } from "lucide-react";
import { BulkExportForm } from "@/components/pricebook/bulk-export-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function BulkExportPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Download className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-2xl">Bulk Export</h1>
            <p className="text-muted-foreground text-sm">
              Export your price book items to CSV, Excel, or PDF
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>Export Process</CardTitle>
          <CardDescription>
            Follow these steps to export your price book data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Filter className="h-5 w-5" />
              </div>
              <h3 className="font-medium">1. Select Data</h3>
              <p className="text-muted-foreground text-sm">
                Choose which items to include using filters
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <h3 className="font-medium">2. Configure Export</h3>
              <p className="text-muted-foreground text-sm">
                Select format and customize columns to include
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Download className="h-5 w-5" />
              </div>
              <h3 className="font-medium">3. Download File</h3>
              <p className="text-muted-foreground text-sm">
                Generate and download your export file
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="space-y-2">
              <p className="font-medium text-sm">Export Formats</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border bg-background p-3">
                  <p className="mb-1 font-medium text-sm">CSV</p>
                  <p className="text-muted-foreground text-xs">
                    Compatible with Excel, Google Sheets
                  </p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                  <p className="mb-1 font-medium text-sm">Excel</p>
                  <p className="text-muted-foreground text-xs">
                    Native .xlsx format with formatting
                  </p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                  <p className="mb-1 font-medium text-sm">PDF</p>
                  <p className="text-muted-foreground text-xs">
                    Print-ready formatted document
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Form */}
      <BulkExportForm />
    </div>
  );
}

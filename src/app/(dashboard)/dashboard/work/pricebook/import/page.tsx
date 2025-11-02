/**
 * Bulk Import Page - Server Component
 *
 * Import price book items from CSV/Excel:
 * - File upload with drag & drop
 * - Column mapping interface
 * - Data validation and preview
 * - Duplicate handling options
 * - Import progress tracking
 *
 * Note: Toolbar is rendered by LayoutWrapper based on unified-layout-config.tsx
 */

import { CheckCircle2, FileSpreadsheet, Upload } from "lucide-react";
import { BulkImportForm } from "@/components/pricebook/bulk-import-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function BulkImportPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-2xl">Bulk Import</h1>
            <p className="text-muted-foreground text-sm">
              Import multiple items from CSV or Excel files
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>Import Process</CardTitle>
          <CardDescription>
            Follow these steps to import your price book items
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                <Upload className="h-5 w-5" />
              </div>
              <h3 className="font-medium">1. Upload File</h3>
              <p className="text-muted-foreground text-sm">
                Drop your CSV or Excel file or click to browse
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <h3 className="font-medium">2. Map Columns</h3>
              <p className="text-muted-foreground text-sm">
                Match your file columns to price book fields
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="font-medium">3. Review & Import</h3>
              <p className="text-muted-foreground text-sm">
                Preview data, handle duplicates, and import
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="space-y-2">
              <p className="font-medium text-sm">Required Columns</p>
              <div className="flex flex-wrap gap-2">
                <code className="rounded bg-background px-2 py-1 text-xs">
                  Name
                </code>
                <code className="rounded bg-background px-2 py-1 text-xs">
                  SKU
                </code>
                <code className="rounded bg-background px-2 py-1 text-xs">
                  Item Type
                </code>
                <code className="rounded bg-background px-2 py-1 text-xs">
                  Category
                </code>
                <code className="rounded bg-background px-2 py-1 text-xs">
                  Cost
                </code>
                <code className="rounded bg-background px-2 py-1 text-xs">
                  Price
                </code>
              </div>
              <p className="text-muted-foreground text-xs">
                Optional: Description, Subcategory, Supplier, Labor Hours, Unit
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Form */}
      <BulkImportForm />
    </div>
  );
}

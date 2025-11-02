/**
 * Mass Price Update Page - Server Component
 *
 * Allows bulk price adjustments for price book items:
 * - Filter by category, item type, supplier
 * - Apply percentage increase/decrease
 * - Preview changes before applying
 * - Maintain markup ratios option
 * - Audit trail of changes
 *
 * Note: Toolbar is rendered by LayoutWrapper based on unified-layout-config.tsx
 */

import { Calculator, DollarSign, Filter, TrendingUp } from "lucide-react";
import { MassUpdateForm } from "@/components/pricebook/mass-update-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function MassUpdatePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-2xl">Mass Price Update</h1>
            <p className="text-muted-foreground text-sm">
              Apply bulk price changes across multiple items
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Mass Updates Work</CardTitle>
          <CardDescription>
            Update prices efficiently while maintaining your margins
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                <Filter className="h-5 w-5" />
              </div>
              <h3 className="font-medium">1. Select Items</h3>
              <p className="text-muted-foreground text-sm">
                Filter by category, item type, supplier, or price range
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                <Calculator className="h-5 w-5" />
              </div>
              <h3 className="font-medium">2. Set Adjustment</h3>
              <p className="text-muted-foreground text-sm">
                Choose percentage increase/decrease or fixed amount change
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="font-medium">3. Preview & Apply</h3>
              <p className="text-muted-foreground text-sm">
                Review changes before applying and maintain markup ratios
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mass Update Form */}
      <MassUpdateForm />
    </div>
  );
}

/**
 * Finance Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export const revalidate = 900; // Revalidate every 15 minutes

export default function FinancePage() {  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Financial Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive accounting and financial management system
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Total Revenue</h3>
          <p className="font-bold text-2xl">$0.00</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Outstanding Invoices</h3>
          <p className="font-bold text-2xl">$0.00</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Expenses</h3>
          <p className="font-bold text-2xl">$0.00</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Net Profit</h3>
          <p className="font-bold text-2xl">$0.00</p>
        </div>
      </div>
    </div>
  );
}

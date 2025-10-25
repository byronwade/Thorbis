export default function FinancesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl text-foreground">Finances</h1>
        <p className="text-muted-foreground">
          Manage financial operations, invoicing, and payments.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Financial Overview</h3>
          <p className="text-muted-foreground text-sm">
            Dashboard with key financial metrics and insights.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Invoicing</h3>
          <p className="text-muted-foreground text-sm">
            Create, manage, and track invoices and billing.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Payment Processing</h3>
          <p className="text-muted-foreground text-sm">
            Process payments and manage payment methods.
          </p>
        </div>
      </div>
    </div>
  );
}

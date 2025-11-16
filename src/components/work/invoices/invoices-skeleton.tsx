/**
 * Invoices Skeleton - Loading State
 *
 * Matches the exact layout of the invoices table to prevent layout shifts.
 */
export function InvoicesSkeleton() {
	return (
		<div className="rounded-lg border bg-card">
			{/* Table header */}
			<div className="border-b p-4">
				<div className="flex gap-4">
					<div className="h-4 w-32 animate-pulse rounded bg-muted" />
					<div className="h-4 w-48 animate-pulse rounded bg-muted" />
					<div className="h-4 w-24 animate-pulse rounded bg-muted" />
					<div className="h-4 w-24 animate-pulse rounded bg-muted" />
					<div className="h-4 w-32 animate-pulse rounded bg-muted" />
					<div className="h-4 w-20 animate-pulse rounded bg-muted" />
				</div>
			</div>

			{/* Table rows */}
			<div className="divide-y">
				{[...new Array(10)].map((_, i) => (
					<div className="flex gap-4 p-4" key={i}>
						<div className="h-4 w-32 animate-pulse rounded bg-muted" />
						<div className="h-4 w-48 animate-pulse rounded bg-muted" />
						<div className="h-4 w-24 animate-pulse rounded bg-muted" />
						<div className="h-4 w-24 animate-pulse rounded bg-muted" />
						<div className="h-4 w-32 animate-pulse rounded bg-muted" />
						<div className="h-4 w-20 animate-pulse rounded bg-muted" />
					</div>
				))}
			</div>
		</div>
	);
}

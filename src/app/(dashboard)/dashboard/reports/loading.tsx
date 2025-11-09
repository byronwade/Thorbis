/**
 * Reports Loading State - Server Component
 */

export default function ReportsLoading() {
  return (
    <div className="flex h-full w-full flex-col gap-6 p-8">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div className="h-32 animate-pulse rounded-lg bg-muted" key={i} />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

/**
 * Work Section Loading State - Server Component
 */

export default function WorkLoading() {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-10 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div className="h-24 animate-pulse rounded-lg bg-muted" key={i} />
        ))}
      </div>
      <div className="flex-1 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

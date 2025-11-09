/**
 * Settings Loading State - Server Component
 */

export default function SettingsLoading() {
  return (
    <div className="flex h-full w-full gap-6 p-8">
      <div className="w-64 space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div className="h-10 animate-pulse rounded bg-muted" key={i} />
        ))}
      </div>
      <div className="flex-1 space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div className="h-20 animate-pulse rounded-lg bg-muted" key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

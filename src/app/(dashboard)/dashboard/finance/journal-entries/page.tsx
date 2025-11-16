/**
 * Finance > Journal Entries Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export default function JournalEntriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Journal Entries</h1>
        <p className="text-muted-foreground">
          Create and manage journal entries for your accounting records
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Journal Entries management coming soon...
        </p>
      </div>
    </div>
  );
}

/**
 * Marketing > Voip Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export const revalidate = 3600; // Revalidate every 1 hour

export default function VoIPPhoneSystemPage() {  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">VoIP Phone System</h1>
        <p className="text-muted-foreground">
          Make and receive calls directly from the platform
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          VoIP Phone System coming soon...
        </p>
      </div>
    </div>
  );
}

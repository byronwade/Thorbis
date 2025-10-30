/**
 * Marketing > Email Marketing Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export const revalidate = 3600; // Revalidate every 1 hour

export default function EmailMarketingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Email Marketing</h1>
        <p className="text-muted-foreground">
          Create and send email marketing campaigns
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Email Marketing system coming soon...
        </p>
      </div>
    </div>
  );
}

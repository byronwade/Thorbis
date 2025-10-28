/**
 * Training > Certifications Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export const revalidate = 3600; // Revalidate every 1 hour

export default function CertificationTrackingPage() {  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Certification Tracking</h1>
        <p className="text-muted-foreground">
          Track technician certifications and renewals
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Certification Tracking system coming soon...
        </p>
      </div>
    </div>
  );
}

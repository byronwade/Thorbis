/**
 * Marketing > Booking Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export const revalidate = 3600; // Revalidate every 1 hour

export default function OnlineBookingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Online Booking</h1>
        <p className="text-muted-foreground">
          Enable customers to book services online
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Online Booking system coming soon...
        </p>
      </div>
    </div>
  );
}

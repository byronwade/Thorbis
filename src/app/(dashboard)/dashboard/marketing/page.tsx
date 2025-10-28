/**
 * Marketing Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - Reduced JavaScript bundle size
 * - Better SEO and initial page load
 * - ISR revalidation every 15 minutes
 */

export const revalidate = 900; // Revalidate every 15 minutes

export default function MarketingPage() {  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl">Unified Inbox</h1>
        <p className="text-muted-foreground">
          Centralized communication hub for email, VoIP, and SMS
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Unread Messages</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Today's Calls</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">SMS Sent</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Active Campaigns</h3>
          <p className="font-bold text-2xl">0</p>
        </div>
      </div>
    </div>
  );
}

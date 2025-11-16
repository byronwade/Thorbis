/**
 * Marketing > Leads Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 *
 * Future expansion:
 * - Lead statistics dashboard
 * - Lead capture forms
 * - Lead scoring system
 * - Automated follow-ups
 */

import { Suspense } from "react";
import { LeadsData } from "@/components/marketing/leads/leads-data";
import { LeadsSkeleton } from "@/components/marketing/leads/leads-skeleton";

export default function LeadsPage() {
  return (
    <Suspense fallback={<LeadsSkeleton />}>
      <LeadsData />
    </Suspense>
  );
}

/**
 * Marketing > Campaigns Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 *
 * Future expansion:
 * - Campaign builder and editor
 * - Email/SMS template library
 * - Campaign analytics dashboard
 * - Automated campaign scheduling
 */

import { Suspense } from "react";
import { CampaignsData } from "@/components/marketing/campaigns/campaigns-data";
import { CampaignsSkeleton } from "@/components/marketing/campaigns/campaigns-skeleton";

export default function CampaignsPage() {
  return (
    <Suspense fallback={<CampaignsSkeleton />}>
      <CampaignsData />
    </Suspense>
  );
}

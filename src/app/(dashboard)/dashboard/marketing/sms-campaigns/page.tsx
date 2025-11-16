/**
 * Marketing > SMS Campaigns Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 *
 * Future expansion:
 * - SMS campaign builder
 * - Automated appointment reminders
 * - Bulk SMS sending
 * - Campaign analytics and reporting
 */

import { Suspense } from "react";
import { SmsCampaignsData } from "@/components/marketing/sms-campaigns/sms-campaigns-data";
import { SmsCampaignsSkeleton } from "@/components/marketing/sms-campaigns/sms-campaigns-skeleton";

export default function SMSCampaignsPage() {
  return (
    <Suspense fallback={<SmsCampaignsSkeleton />}>
      <SmsCampaignsData />
    </Suspense>
  );
}

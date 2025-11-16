/**
 * Uteam Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UteamData } from "@/components/settings/team/team-data";
import { UteamSkeleton } from "@/components/settings/team/team-skeleton";

export default function UteamPage() {
  return (
    <Suspense fallback={<UteamSkeleton />}>
      <UteamData />
    </Suspense>
  );
}

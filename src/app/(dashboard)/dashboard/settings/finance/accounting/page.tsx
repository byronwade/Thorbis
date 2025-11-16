/**
 * Settings > Finance > Accounting Integration Page - PPR Wrapper
 *
 * Uses Partial Prerendering for instant page loads:
 * - Server shell renders instantly (layout is static)
 * - Client accounting settings UI hydrates as a streamed island
 */

import { Suspense } from "react";
import { AccountingSettingsClient } from "@/components/settings/finance/accounting-settings-client";
import { AccountingSettingsSkeleton } from "@/components/settings/finance/accounting-settings-skeleton";

export default function AccountingSettingsPage() {
  return (
    <Suspense fallback={<AccountingSettingsSkeleton />}>
      <AccountingSettingsClient />
    </Suspense>
  );
}

/**
 * Phone Numbers Management Page
 *
 * Comprehensive phone number management:
 * - List all company phone numbers
 * - Search and purchase new numbers
 * - Port existing numbers (8-step wizard)
 * - Configure routing and features
 * - View usage metrics and costs
 */

import { Suspense } from "react";
import { AppToolbar } from "@/components/layout/app-toolbar";
import { PhoneNumbersList } from "@/components/telnyx/phone-numbers-list";
import { PhoneNumbersToolbar } from "@/components/telnyx/phone-numbers-toolbar";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Phone Numbers | Communications Settings",
  description: "Manage your company phone numbers, purchase new numbers, and port existing ones",
};

export default function PhoneNumbersPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Page Header */}
      <AppToolbar config={{ show: true, title: "Phone Numbers" }} />

      {/* Secondary Toolbar with Actions */}
      <Suspense fallback={<Skeleton className="h-16 w-full" />}>
        <PhoneNumbersToolbar />
      </Suspense>

      {/* Phone Numbers List */}
      <div className="flex-1 overflow-auto">
        <Suspense fallback={<PhoneNumbersListSkeleton />}>
          <PhoneNumbersList />
        </Suspense>
      </div>
    </div>
  );
}

function PhoneNumbersListSkeleton() {
  return (
    <div className="space-y-4 p-6">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}

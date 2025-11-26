/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { SmsData } from "@/components/marketing/sms/sms-data";
import { SmsSkeleton } from "@/components/marketing/sms/sms-skeleton";

export default function SmsPage() {
	return (
		<Suspense fallback={<SmsSkeleton />}>
			<SmsData />
		</Suspense>
	);
}

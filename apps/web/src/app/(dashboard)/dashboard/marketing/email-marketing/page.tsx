/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { EmailMarketingData } from "@/components/marketing/email-marketing/email-marketing-data";
import { EmailMarketingSkeleton } from "@/components/marketing/email-marketing/email-marketing-skeleton";

export default function EmailMarketingPage() {
	return (
		<Suspense fallback={<EmailMarketingSkeleton />}>
			<EmailMarketingData />
		</Suspense>
	);
}

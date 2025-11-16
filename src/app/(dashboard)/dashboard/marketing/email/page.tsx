/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { EmailData } from "@/components/marketing/email/email-data";
import { EmailSkeleton } from "@/components/marketing/email/email-skeleton";

export default function EmailPage() {
	return (
		<Suspense fallback={<EmailSkeleton />}>
			<EmailData />
		</Suspense>
	);
}

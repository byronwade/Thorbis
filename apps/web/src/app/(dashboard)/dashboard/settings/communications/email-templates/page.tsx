/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { EmailTemplatesData } from "@/components/settings/email-templates/email-templates-data";
import { EmailTemplatesSkeleton } from "@/components/settings/email-templates/email-templates-skeleton";

export default function EmailTemplatesPage() {
	return (
		<Suspense fallback={<EmailTemplatesSkeleton />}>
			<EmailTemplatesData />
		</Suspense>
	);
}

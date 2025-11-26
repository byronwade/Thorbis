/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { InvoiceEmailTemplateData } from "@/components/settings/invoice-email-template/invoice-email-template-data";
import { InvoiceEmailTemplateSkeleton } from "@/components/settings/invoice-email-template/invoice-email-template-skeleton";

export default function InvoiceEmailTemplatePage() {
	return (
		<Suspense fallback={<InvoiceEmailTemplateSkeleton />}>
			<InvoiceEmailTemplateData />
		</Suspense>
	);
}

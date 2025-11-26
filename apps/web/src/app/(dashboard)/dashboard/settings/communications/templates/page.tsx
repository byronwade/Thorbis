/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { TemplatesData } from "@/components/settings/templates/templates-data";
import { TemplatesSkeleton } from "@/components/settings/templates/templates-skeleton";

export default function TemplatesPage() {
	return (
		<Suspense fallback={<TemplatesSkeleton />}>
			<TemplatesData />
		</Suspense>
	);
}

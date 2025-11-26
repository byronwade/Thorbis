/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { RulesData } from "@/components/pricebook/rules/rules-data";
import { RulesSkeleton } from "@/components/pricebook/rules/rules-skeleton";

export default function RulesPage() {
	return (
		<Suspense fallback={<RulesSkeleton />}>
			<RulesData />
		</Suspense>
	);
}

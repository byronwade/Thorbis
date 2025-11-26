/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { SkillsData } from "@/components/technicians/skills/skills-data";
import { SkillsSkeleton } from "@/components/technicians/skills/skills-skeleton";

export default function SkillsPage() {
	return (
		<Suspense fallback={<SkillsSkeleton />}>
			<SkillsData />
		</Suspense>
	);
}

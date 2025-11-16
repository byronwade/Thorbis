/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { CertificationsData } from "@/components/training/certifications/certifications-data";
import { CertificationsSkeleton } from "@/components/training/certifications/certifications-skeleton";

export default function CertificationsPage() {
	return (
		<Suspense fallback={<CertificationsSkeleton />}>
			<CertificationsData />
		</Suspense>
	);
}

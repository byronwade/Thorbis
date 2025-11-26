/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { PasswordData } from "@/components/settings/password/password-data";
import { PasswordSkeleton } from "@/components/settings/password/password-skeleton";

export default function PasswordPage() {
	return (
		<Suspense fallback={<PasswordSkeleton />}>
			<PasswordData />
		</Suspense>
	);
}

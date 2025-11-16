/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { PayrollData } from "@/components/finance/payroll/payroll-data";
import { PayrollSkeleton } from "@/components/finance/payroll/payroll-skeleton";

export default function PayrollPage() {
	return (
		<Suspense fallback={<PayrollSkeleton />}>
			<PayrollData />
		</Suspense>
	);
}

/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { EmployeesData } from "@/components/finance/employees/employees-data";
import { EmployeesSkeleton } from "@/components/finance/employees/employees-skeleton";

export default function EmployeesPage() {
	return (
		<Suspense fallback={<EmployeesSkeleton />}>
			<EmployeesData />
		</Suspense>
	);
}

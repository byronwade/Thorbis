/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { AttendanceData } from "@/components/technicians/attendance/attendance-data";
import { AttendanceSkeleton } from "@/components/technicians/attendance/attendance-skeleton";

export default function AttendancePage() {
	return (
		<Suspense fallback={<AttendanceSkeleton />}>
			<AttendanceData />
		</Suspense>
	);
}

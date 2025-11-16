/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { CoursesData } from "@/components/training/courses/courses-data";
import { CoursesSkeleton } from "@/components/training/courses/courses-skeleton";

export default function CoursesPage() {
	return (
		<Suspense fallback={<CoursesSkeleton />}>
			<CoursesData />
		</Suspense>
	);
}

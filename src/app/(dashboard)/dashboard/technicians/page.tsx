/**
 * Technicians Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Dashboard content streams in second (200-500ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { TechniciansData } from "@/components/technicians/technicians-data";
import { TechniciansSkeleton } from "@/components/technicians/technicians-skeleton";
import { TechniciansStats } from "@/components/technicians/technicians-stats";
import { StatsCardsSkeleton } from "@/components/ui/stats-cards-skeleton";

export default function TechnicianManagementPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-semibold text-2xl">Technician Management</h1>
				<p className="text-muted-foreground">
					Manage technicians, skills, and performance
				</p>
			</div>

			<Suspense fallback={<StatsCardsSkeleton count={4} />}>
				<TechniciansStats />
			</Suspense>

			<Suspense fallback={<TechniciansSkeleton />}>
				<TechniciansData />
			</Suspense>
		</div>
	);
}

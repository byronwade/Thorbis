import { getActiveCompanyId } from "@stratos/auth/company-context";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/server";
import { DispatchMapView } from "./dispatch-map-view";

export const metadata = {
	title: "Dispatch Map - Live Fleet View",
	description: "Real-time map view of all technicians and jobs",
};

function MapSkeleton() {
	return (
		<div className="relative h-full w-full bg-muted/30">
			<Skeleton className="absolute inset-0" />
			<div className="absolute left-4 top-4 w-80">
				<Skeleton className="h-[500px] rounded-lg" />
			</div>
		</div>
	);
}

async function DispatchMapData() {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	if (!companyId) {
		return (
			<div className="flex h-full items-center justify-center">
				<p>Please sign in to view the dispatch map</p>
			</div>
		);
	}

	// Get today's date range
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	// Fetch technicians with their current locations (join with users for name/avatar)
	const { data: technicianData } = await supabase
		.from("team_members")
		.select(
			`
			id,
			invited_name,
			email,
			phone,
			role,
			status,
			user:users (
				name,
				avatar
			)
		`,
		)
		.eq("company_id", companyId)
		.eq("role", "technician")
		.is("archived_at", null);

	// Transform technician data to expected format
	const technicians = (technicianData || []).map((tech) => ({
		id: tech.id,
		name: tech.user?.name || tech.invited_name || "Unknown",
		email: tech.email,
		phone: tech.phone,
		avatar: tech.user?.avatar,
		role: tech.role,
		status: tech.status,
	}));

	// Fetch GPS locations for all technicians
	const { data: gpsLocations } = await supabase
		.from("technician_locations")
		.select("*")
		.eq("company_id", companyId);

	// Fetch today's appointments with job details
	const { data: appointments } = await supabase
		.from("appointments")
		.select(
			`
			id,
			scheduled_start,
			scheduled_end,
			status,
			assigned_technician_ids,
			job:jobs (
				id,
				title,
				job_type,
				priority,
				status,
				total_amount,
				customer:customers (
					id,
					display_name,
					phone,
					address,
					city,
					state,
					zip_code,
					lat,
					lon
				),
				property:properties (
					id,
					address,
					city,
					state,
					zip_code,
					lat,
					lon
				)
			)
		`,
		)
		.eq("company_id", companyId)
		.gte("scheduled_start", today.toISOString())
		.lt("scheduled_start", tomorrow.toISOString())
		.order("scheduled_start", { ascending: true });

	// Fetch unassigned jobs
	const { data: unassignedJobs } = await supabase
		.from("jobs")
		.select(
			`
			id,
			title,
			job_type,
			priority,
			status,
			total_amount,
			customer:customers (
				id,
				display_name,
				phone,
				address,
				city,
				state,
				lat,
				lon
			),
			property:properties (
				id,
				address,
				city,
				state,
				lat,
				lon
			)
		`,
		)
		.eq("company_id", companyId)
		.eq("status", "pending")
		.is("archived_at", null)
		.limit(50);

	// Get company settings for default map center
	const { data: companySettings } = await supabase
		.from("company_settings")
		.select("address, city, state")
		.eq("company_id", companyId)
		.single();

	return (
		<DispatchMapView
			technicians={technicians || []}
			gpsLocations={gpsLocations || []}
			appointments={appointments || []}
			unassignedJobs={unassignedJobs || []}
			companyId={companyId}
			defaultCenter={
				companySettings?.city
					? {
							address: `${companySettings.address}, ${companySettings.city}, ${companySettings.state}`,
						}
					: undefined
			}
		/>
	);
}

export default function DispatchMapPage() {
	return (
		<div className="h-[calc(100vh-4rem)] w-full overflow-hidden">
			<Suspense fallback={<MapSkeleton />}>
				<DispatchMapData />
			</Suspense>
		</div>
	);
}

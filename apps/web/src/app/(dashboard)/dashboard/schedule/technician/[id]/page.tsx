import { getActiveCompanyId } from "@stratos/auth/company-context";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { TechnicianDayView } from "./technician-day-view";
import { TechnicianDayViewSkeleton } from "./technician-day-view-skeleton";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const supabase = await createClient();

	const { data: technician } = await supabase
		.from("team_members")
		.select(`
			invited_name,
			user:users (name)
		`)
		.eq("id", id)
		.single();

	const name = technician?.user?.name || technician?.invited_name;

	return {
		title: name ? `${name} - Today's Schedule` : "Technician Schedule",
		description: "View technician's daily schedule, route, and performance",
	};
}

async function TechnicianData({ technicianId }: { technicianId: string }) {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	if (!companyId) {
		notFound();
	}

	// Get technician details with user info
	const { data: technicianData, error: techError } = await supabase
		.from("team_members")
		.select(
			`
			id,
			invited_name,
			email,
			phone,
			role,
			status,
			job_title,
			department,
			joined_at,
			user:users (
				name,
				avatar,
				phone,
				bio
			)
		`,
		)
		.eq("id", technicianId)
		.eq("company_id", companyId)
		.single();

	if (techError || !technicianData) {
		notFound();
	}

	// Transform to expected format
	const technician = {
		id: technicianData.id,
		name: technicianData.user?.name || technicianData.invited_name || "Unknown",
		email: technicianData.email,
		phone: technicianData.phone || technicianData.user?.phone,
		avatar: technicianData.user?.avatar,
		role: technicianData.role,
		status: technicianData.status,
		job_title: technicianData.job_title,
		department: technicianData.department,
		joined_at: technicianData.joined_at,
		bio: technicianData.user?.bio,
	};

	// Get today's date range
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	// Get today's appointments for this technician
	const { data: appointments } = await supabase
		.from("appointments")
		.select(
			`
			id,
			scheduled_start,
			scheduled_end,
			status,
			notes,
			job:jobs (
				id,
				title,
				description,
				job_type,
				priority,
				status,
				total_amount,
				customer:customers (
					id,
					display_name,
					phone,
					email,
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
		.contains("assigned_technician_ids", [technicianId])
		.gte("scheduled_start", today.toISOString())
		.lt("scheduled_start", tomorrow.toISOString())
		.order("scheduled_start", { ascending: true });

	// Get unassigned jobs for nearby suggestions
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
		.limit(20);

	// Get technician's GPS location
	const { data: gpsLocation } = await supabase
		.from("technician_locations")
		.select("*")
		.eq("technician_id", technicianId)
		.single();

	// Get performance stats for this technician (last 30 days)
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

	const { data: recentAppointments } = await supabase
		.from("appointments")
		.select("id, status, scheduled_start, actual_start, actual_end")
		.eq("company_id", companyId)
		.contains("assigned_technician_ids", [technicianId])
		.gte("scheduled_start", thirtyDaysAgo.toISOString())
		.lt("scheduled_start", tomorrow.toISOString());

	// Calculate stats
	const completedCount =
		recentAppointments?.filter(
			(a) => a.status === "completed" || a.status === "closed",
		).length || 0;
	const totalCount = recentAppointments?.length || 0;

	// Get today's stats
	const todayAppointments = appointments || [];
	const todayCompleted = todayAppointments.filter(
		(a) => a.status === "completed" || a.status === "closed",
	).length;
	const todayTotal = todayAppointments.length;

	const stats = {
		todayCompleted,
		todayTotal,
		todayRemaining: todayTotal - todayCompleted,
		monthCompleted: completedCount,
		monthTotal: totalCount,
		completionRate: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
	};

	return (
		<TechnicianDayView
			technician={technician}
			appointments={appointments || []}
			unassignedJobs={unassignedJobs || []}
			gpsLocation={gpsLocation}
			stats={stats}
			companyId={companyId}
		/>
	);
}

export default async function TechnicianDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return (
		<Suspense fallback={<TechnicianDayViewSkeleton />}>
			<TechnicianData technicianId={id} />
		</Suspense>
	);
}

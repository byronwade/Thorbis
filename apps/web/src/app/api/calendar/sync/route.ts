/**
 * Google Calendar Sync API Route
 *
 * Syncs appointments to Google Calendar
 * - Create/update/delete events
 * - Bi-directional sync
 * - Free/busy checking
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import {
	googleCalendarService,
	type JobAppointment,
} from "@/lib/services/google-calendar-service";

// Get sync status and upcoming events
export async function GET(request: NextRequest) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		// Get user's calendar settings
		const { data: teamMember, error: memberError } = await supabase
			.from("team_members")
			.select(
				"google_calendar_connected, google_calendar_refresh_token, google_calendar_id",
			)
			.eq("user_id", user.id)
			.single();

		if (memberError || !teamMember) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		if (!teamMember.google_calendar_connected) {
			return NextResponse.json({
				connected: false,
				message: "Google Calendar not connected",
			});
		}

		// Refresh access token
		const tokens = await googleCalendarService.refreshAccessToken(
			teamMember.google_calendar_refresh_token,
		);

		if (!tokens) {
			// Token refresh failed - mark as disconnected
			await supabase
				.from("team_members")
				.update({
					google_calendar_connected: false,
					updated_at: new Date().toISOString(),
				})
				.eq("user_id", user.id);

			return NextResponse.json({
				connected: false,
				message: "Calendar connection expired. Please reconnect.",
			});
		}

		// Get upcoming events from Google Calendar
		const now = new Date();
		const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

		const events = await googleCalendarService.listEvents(tokens.accessToken, {
			calendarId: teamMember.google_calendar_id || "primary",
			timeMin: now,
			timeMax: oneWeekLater,
		});

		// Filter to only show Stratos events
		const stratosEvents = events.filter(
			(e) => e.extendedProperties?.private?.stratosAppointmentId,
		);

		return NextResponse.json({
			connected: true,
			calendarId: teamMember.google_calendar_id || "primary",
			events: stratosEvents.map((e) => ({
				id: e.id,
				title: e.summary,
				start: e.start.dateTime || e.start.date,
				end: e.end.dateTime || e.end.date,
				location: e.location,
				appointmentId: e.extendedProperties?.private?.stratosAppointmentId,
				jobNumber: e.extendedProperties?.private?.stratosJobNumber,
			})),
			totalEvents: stratosEvents.length,
		});
	} catch (error) {
		console.error("Calendar sync status error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// Sync appointments to calendar
export async function POST(request: NextRequest) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { technicianId, appointments } = body;

		// Determine which user to sync for
		const targetUserId = technicianId || user.id;

		// Get user's calendar settings
		const { data: teamMember, error: memberError } = await supabase
			.from("team_members")
			.select(
				"id, google_calendar_connected, google_calendar_refresh_token, google_calendar_id",
			)
			.eq("user_id", targetUserId)
			.single();

		if (memberError || !teamMember) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		if (!teamMember.google_calendar_connected) {
			return NextResponse.json(
				{ error: "Google Calendar not connected" },
				{ status: 400 },
			);
		}

		// Refresh access token
		const tokens = await googleCalendarService.refreshAccessToken(
			teamMember.google_calendar_refresh_token,
		);

		if (!tokens) {
			return NextResponse.json(
				{ error: "Calendar connection expired. Please reconnect." },
				{ status: 401 },
			);
		}

		// Get existing sync mappings
		const { data: existingMappings } = await supabase
			.from("calendar_sync_mappings")
			.select("appointment_id, google_event_id")
			.eq("team_member_id", teamMember.id);

		const syncMap = new Map<string, string>();
		for (const mapping of existingMappings || []) {
			syncMap.set(mapping.appointment_id, mapping.google_event_id);
		}

		// Convert appointments to JobAppointment format
		const jobAppointments: JobAppointment[] = appointments.map(
			(apt: {
				id: string;
				job_number?: string;
				title: string;
				description?: string;
				start_time: string;
				end_time: string;
				address?: string;
				lat?: number;
				lng?: number;
				customer_name?: string;
				customer_phone?: string;
				customer_email?: string;
				job_type?: string;
				status?: string;
				priority?: string;
				notes?: string;
			}) => ({
				id: apt.id,
				jobNumber: apt.job_number,
				title: apt.title,
				description: apt.description,
				startTime: new Date(apt.start_time),
				endTime: new Date(apt.end_time),
				location: apt.address
					? {
							address: apt.address,
							lat: apt.lat,
							lng: apt.lng,
						}
					: undefined,
				customer: apt.customer_name
					? {
							name: apt.customer_name,
							phone: apt.customer_phone,
							email: apt.customer_email,
						}
					: undefined,
				jobType: apt.job_type,
				status: apt.status,
				priority: apt.priority as JobAppointment["priority"],
				notes: apt.notes,
			}),
		);

		// Sync to Google Calendar
		const result = await googleCalendarService.syncTechnicianAppointments(
			tokens.accessToken,
			jobAppointments,
			syncMap,
			teamMember.google_calendar_id || "primary",
		);

		// Update sync mappings in database
		const mappingsToUpsert = Array.from(result.newSyncMap.entries()).map(
			([appointmentId, googleEventId]) => ({
				team_member_id: teamMember.id,
				appointment_id: appointmentId,
				google_event_id: googleEventId,
				last_synced_at: new Date().toISOString(),
			}),
		);

		if (mappingsToUpsert.length > 0) {
			await supabase.from("calendar_sync_mappings").upsert(mappingsToUpsert, {
				onConflict: "team_member_id,appointment_id",
			});
		}

		// Delete removed mappings
		if (result.deleted.length > 0) {
			await supabase
				.from("calendar_sync_mappings")
				.delete()
				.eq("team_member_id", teamMember.id)
				.in("appointment_id", result.deleted);
		}

		return NextResponse.json({
			success: true,
			created: result.created.length,
			updated: result.updated.length,
			deleted: result.deleted.length,
			errors: result.errors,
		});
	} catch (error) {
		console.error("Calendar sync error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// Check free/busy times
export async function PUT(request: NextRequest) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { date, durationMinutes = 60, technicianIds } = body;

		if (!date) {
			return NextResponse.json({ error: "Date is required" }, { status: 400 });
		}

		// Get connected technicians
		const { data: teamMembers } = await supabase
			.from("team_members")
			.select(
				"id, user_id, google_calendar_connected, google_calendar_refresh_token, google_calendar_id",
			)
			.eq("google_calendar_connected", true)
			.in("user_id", technicianIds || [user.id]);

		if (!teamMembers || teamMembers.length === 0) {
			return NextResponse.json({
				slots: [],
				message: "No connected calendars found",
			});
		}

		// Get free/busy for each technician
		const availabilityByTechnician: Record<
			string,
			Array<{ start: Date; end: Date }>
		> = {};

		for (const member of teamMembers) {
			const tokens = await googleCalendarService.refreshAccessToken(
				member.google_calendar_refresh_token,
			);

			if (!tokens) continue;

			const slots = await googleCalendarService.findAvailableSlots(
				tokens.accessToken,
				{
					calendarIds: [member.google_calendar_id || "primary"],
					date: new Date(date),
					durationMinutes,
				},
			);

			availabilityByTechnician[member.user_id] = slots;
		}

		return NextResponse.json({
			date,
			durationMinutes,
			availability: availabilityByTechnician,
		});
	} catch (error) {
		console.error("Free/busy check error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

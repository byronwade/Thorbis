/**
 * Customer Tracking Link Service
 *
 * Generates and manages customer-facing tracking links
 * Allows customers to see real-time ETA and technician status
 */

import { createServiceSupabaseClient } from "@stratos/database";
import type {
	TrackingLink,
	TrackingLinkCreateInput,
	TrackingLinkPublicView,
	TrackingLinkStatus,
} from "./types";

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_EXPIRY_HOURS = 24;
const TOKEN_LENGTH = 12;

// Characters for URL-safe tokens (no ambiguous chars like 0/O, 1/l/I)
const TOKEN_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";

// ============================================================================
// Token Generation
// ============================================================================

/**
 * Generate a cryptographically secure URL-safe token
 */
function generateTrackingToken(): string {
	const bytes = new Uint8Array(TOKEN_LENGTH);
	crypto.getRandomValues(bytes);

	let token = "";
	for (let i = 0; i < TOKEN_LENGTH; i++) {
		token += TOKEN_CHARS[bytes[i] % TOKEN_CHARS.length];
	}

	return token;
}

// ============================================================================
// Create Tracking Link
// ============================================================================

/**
 * Create a new customer tracking link for an appointment
 */
async function createTrackingLink(
	input: TrackingLinkCreateInput,
): Promise<{ link: TrackingLink; url: string } | { error: string }> {
	const supabase = createServiceSupabaseClient();

	// Generate unique token
	const token = generateTrackingToken();

	// Get technician info
	const { data: techData, error: techError } = await supabase
		.from("team_members")
		.select("id, full_name, avatar_url")
		.eq("id", input.technicianId)
		.single();

	if (techError || !techData) {
		return { error: "Technician not found" };
	}

	// Calculate expiry
	const expiresAt = new Date();
	expiresAt.setHours(
		expiresAt.getHours() + (input.expiresInHours || DEFAULT_EXPIRY_HOURS),
	);

	// Create tracking link record
	const { data: linkData, error: insertError } = await supabase
		.from("customer_tracking_links")
		.insert({
			token,
			appointment_id: input.appointmentId,
			job_id: input.jobId,
			customer_id: input.customerId,
			company_id: input.companyId,
			technician_id: input.technicianId,
			technician_name: techData.full_name,
			technician_photo: techData.avatar_url,
			scheduled_start_time: input.scheduledStartTime.toISOString(),
			scheduled_end_time: input.scheduledEndTime.toISOString(),
			customer_address: input.customerAddress,
			status: "pending",
			show_technician_location: input.showTechnicianLocation ?? true,
			show_technician_photo: input.showTechnicianPhoto ?? true,
			expires_at: expiresAt.toISOString(),
			view_count: 0,
		})
		.select()
		.single();

	if (insertError || !linkData) {
		console.error("Failed to create tracking link:", insertError);
		return { error: "Failed to create tracking link" };
	}

	// Build public URL
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.stratos.com";
	const url = `${baseUrl}/track/${token}`;

	const link: TrackingLink = {
		id: linkData.id,
		token: linkData.token,
		appointmentId: linkData.appointment_id,
		jobId: linkData.job_id,
		customerId: linkData.customer_id,
		companyId: linkData.company_id,
		technicianId: linkData.technician_id,
		technicianName: linkData.technician_name,
		technicianPhoto: linkData.technician_photo,
		appointmentDate: new Date(linkData.scheduled_start_time),
		scheduledStartTime: new Date(linkData.scheduled_start_time),
		scheduledEndTime: new Date(linkData.scheduled_end_time),
		customerAddress: linkData.customer_address,
		status: linkData.status,
		showTechnicianLocation: linkData.show_technician_location,
		showTechnicianPhoto: linkData.show_technician_photo,
		createdAt: new Date(linkData.created_at),
		expiresAt: new Date(linkData.expires_at),
		viewCount: linkData.view_count,
	};

	return { link, url };
}

// ============================================================================
// Get Tracking Link
// ============================================================================

/**
 * Get tracking link by token (for public viewing)
 */
export async function getTrackingLinkByToken(
	token: string,
): Promise<TrackingLinkPublicView | null> {
	const supabase = createServiceSupabaseClient();

	// Get link with company info
	const { data: linkData, error } = await supabase
		.from("customer_tracking_links")
		.select(
			`
			*,
			companies:company_id (
				name,
				logo_url,
				phone
			)
		`,
		)
		.eq("token", token)
		.single();

	if (error || !linkData) {
		return null;
	}

	// Check if expired
	if (new Date(linkData.expires_at) < new Date()) {
		return null;
	}

	// Increment view count
	await supabase
		.from("customer_tracking_links")
		.update({
			view_count: linkData.view_count + 1,
			last_viewed_at: new Date().toISOString(),
		})
		.eq("id", linkData.id);

	// Get real-time ETA if technician is en-route
	let technicianLocation: { lat: number; lng: number } | undefined;
	let etaMinutes: number | undefined;
	let distanceRemainingMiles: number | undefined;

	if (
		linkData.show_technician_location &&
		["active", "arrived"].includes(linkData.status)
	) {
		const { data: gpsData } = await supabase
			.from("technician_locations")
			.select("lat, lng, eta_minutes, distance_remaining_meters")
			.eq("technician_id", linkData.technician_id)
			.single();

		if (gpsData) {
			technicianLocation = { lat: gpsData.lat, lng: gpsData.lng };
			etaMinutes = gpsData.eta_minutes;
			distanceRemainingMiles = gpsData.distance_remaining_meters
				? gpsData.distance_remaining_meters / 1609.34
				: undefined;
		}
	}

	// Format times
	const startTime = new Date(linkData.scheduled_start_time);
	const endTime = new Date(linkData.scheduled_end_time);

	const formatTime = (date: Date) =>
		date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});

	const scheduledWindow = `${formatTime(startTime)} - ${formatTime(endTime)}`;
	const appointmentDate = startTime.toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
	});

	// Build status message
	const statusMessage = getStatusMessage(
		linkData.status,
		linkData.technician_name,
		etaMinutes,
	);

	// Get company data safely
	const company = linkData.companies as {
		name: string;
		logo_url?: string;
		phone?: string;
	} | null;

	return {
		token: linkData.token,
		status: linkData.status,
		companyName: company?.name || "Service Provider",
		companyLogo: company?.logo_url,
		companyPhone: company?.phone,
		technicianName: linkData.technician_name,
		technicianPhoto: linkData.show_technician_photo
			? linkData.technician_photo
			: undefined,
		technicianStatus: linkData.technician_status,
		appointmentDate,
		scheduledWindow,
		estimatedArrival: etaMinutes
			? formatTime(new Date(Date.now() + etaMinutes * 60 * 1000))
			: undefined,
		etaMinutes,
		distanceRemainingMiles,
		technicianLocation,
		statusMessage,
		lastUpdate: new Date().toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		}),
	};
}

// ============================================================================
// Update Tracking Link
// ============================================================================

/**
 * Update tracking link status (called when appointment status changes)
 */
async function updateTrackingLinkStatus(
	appointmentId: string,
	status: TrackingLinkStatus,
	technicianStatus?: "en-route" | "arriving-soon" | "arrived" | "working",
): Promise<void> {
	const supabase = createServiceSupabaseClient();

	const updateData: Record<string, unknown> = {
		status,
		updated_at: new Date().toISOString(),
	};

	if (technicianStatus) {
		updateData.technician_status = technicianStatus;
	}

	await supabase
		.from("customer_tracking_links")
		.update(updateData)
		.eq("appointment_id", appointmentId);
}

/**
 * Update ETA for tracking link
 */
async function updateTrackingLinkETA(
	appointmentId: string,
	etaMinutes: number,
	distanceMeters: number,
): Promise<void> {
	const supabase = createServiceSupabaseClient();

	await supabase
		.from("customer_tracking_links")
		.update({
			current_eta_minutes: etaMinutes,
			distance_remaining_miles: distanceMeters / 1609.34,
			last_eta_update: new Date().toISOString(),
		})
		.eq("appointment_id", appointmentId);
}

// ============================================================================
// Helper Functions
// ============================================================================

function getStatusMessage(
	status: TrackingLinkStatus,
	techName: string,
	etaMinutes?: number,
): string {
	const firstName = techName.split(" ")[0];

	switch (status) {
		case "pending":
			return `Your appointment is scheduled. ${firstName} will be on the way soon!`;
		case "active":
			if (etaMinutes && etaMinutes <= 5) {
				return `${firstName} is almost there! Arriving in about ${etaMinutes} minutes.`;
			}
			if (etaMinutes && etaMinutes <= 15) {
				return `${firstName} is nearby and will arrive in about ${etaMinutes} minutes.`;
			}
			if (etaMinutes) {
				return `${firstName} is on the way! Estimated arrival in ${etaMinutes} minutes.`;
			}
			return `${firstName} is on the way to your location!`;
		case "arrived":
			return `${firstName} has arrived at your location.`;
		case "completed":
			return "Your service has been completed. Thank you!";
		case "cancelled":
			return "This appointment has been cancelled.";
		case "expired":
			return "This tracking link has expired.";
		default:
			return "Thank you for choosing our service!";
	}
}

// ============================================================================
// Send Tracking Notification
// ============================================================================

/**
 * Send tracking link to customer via SMS
 */
async function sendTrackingLinkSMS(
	phoneNumber: string,
	trackingUrl: string,
	technicianName: string,
	appointmentTime: string,
): Promise<{ success: boolean; error?: string }> {
	// This integrates with existing Telnyx SMS infrastructure
	const message = `Your technician ${technicianName} is scheduled to arrive at ${appointmentTime}. Track their arrival here: ${trackingUrl}`;

	try {
		const response = await fetch("/api/sms/send", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				to: phoneNumber,
				message,
				type: "tracking_link",
			}),
		});

		if (!response.ok) {
			return { success: false, error: "Failed to send SMS" };
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Send tracking link to customer via email
 */
async function sendTrackingLinkEmail(
	email: string,
	trackingUrl: string,
	technicianName: string,
	appointmentDate: string,
	appointmentWindow: string,
	companyName: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		const response = await fetch("/api/email/send", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				to: email,
				subject: `Track your appointment with ${companyName}`,
				template: "tracking-link",
				data: {
					technicianName,
					appointmentDate,
					appointmentWindow,
					trackingUrl,
					companyName,
				},
			}),
		});

		if (!response.ok) {
			return { success: false, error: "Failed to send email" };
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

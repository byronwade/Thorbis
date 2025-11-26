/**
 * Google Calendar Service
 *
 * Syncs technician schedules with Google Calendar
 * - Create/update/delete calendar events for appointments
 * - Bi-directional sync with technician Google accounts
 * - Automated reminders and notifications
 * - Free/busy time checking for scheduling
 *
 * API: Google Calendar API v3
 * Docs: https://developers.google.com/calendar/api/v3/reference
 *
 * Note: This service requires OAuth authentication for full functionality.
 * Server-side operations can use service account, but user calendar sync
 * requires user OAuth tokens stored per-user.
 */

import { z } from "zod";

const USER_AGENT = "Thorbis-FMS/1.0 (support@thorbis.app)";

// ============================================================================
// Types and Schemas
// ============================================================================

const DateTimeSchema = z.object({
	dateTime: z.string().optional(),
	date: z.string().optional(),
	timeZone: z.string().optional(),
});

const AttendeeSchema = z.object({
	email: z.string().email(),
	displayName: z.string().optional(),
	responseStatus: z
		.enum(["needsAction", "declined", "tentative", "accepted"])
		.optional(),
	optional: z.boolean().optional(),
	organizer: z.boolean().optional(),
	self: z.boolean().optional(),
});

const ReminderSchema = z.object({
	method: z.enum(["email", "popup", "sms"]),
	minutes: z.number(),
});

const CalendarEventSchema = z.object({
	id: z.string().optional(),
	status: z.enum(["confirmed", "tentative", "cancelled"]).optional(),
	htmlLink: z.string().optional(),
	created: z.string().optional(),
	updated: z.string().optional(),
	summary: z.string(),
	description: z.string().optional(),
	location: z.string().optional(),
	colorId: z.string().optional(),
	start: DateTimeSchema,
	end: DateTimeSchema,
	recurrence: z.array(z.string()).optional(),
	attendees: z.array(AttendeeSchema).optional(),
	reminders: z
		.object({
			useDefault: z.boolean(),
			overrides: z.array(ReminderSchema).optional(),
		})
		.optional(),
	extendedProperties: z
		.object({
			private: z.record(z.string()).optional(),
			shared: z.record(z.string()).optional(),
		})
		.optional(),
	visibility: z
		.enum(["default", "public", "private", "confidential"])
		.optional(),
	transparency: z.enum(["opaque", "transparent"]).optional(),
});

const FreeBusyTimeSlotSchema = z.object({
	start: z.string(),
	end: z.string(),
});

const FreeBusyCalendarSchema = z.object({
	busy: z.array(FreeBusyTimeSlotSchema),
	errors: z
		.array(
			z.object({
				domain: z.string(),
				reason: z.string(),
			}),
		)
		.optional(),
});

const CalendarListEntrySchema = z.object({
	id: z.string(),
	summary: z.string(),
	description: z.string().optional(),
	location: z.string().optional(),
	timeZone: z.string().optional(),
	colorId: z.string().optional(),
	backgroundColor: z.string().optional(),
	foregroundColor: z.string().optional(),
	selected: z.boolean().optional(),
	accessRole: z
		.enum(["freeBusyReader", "reader", "writer", "owner"])
		.optional(),
	primary: z.boolean().optional(),
});

// Job appointment to sync
const JobAppointmentSchema = z.object({
	id: z.string(), // Job/appointment ID in our system
	jobNumber: z.string().optional(),
	title: z.string(),
	description: z.string().optional(),
	startTime: z.date(),
	endTime: z.date(),
	location: z
		.object({
			address: z.string(),
			lat: z.number().optional(),
			lng: z.number().optional(),
		})
		.optional(),
	customer: z
		.object({
			name: z.string(),
			phone: z.string().optional(),
			email: z.string().optional(),
		})
		.optional(),
	technicians: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
				email: z.string().optional(),
			}),
		)
		.optional(),
	jobType: z.string().optional(),
	status: z.string().optional(),
	priority: z.enum(["low", "normal", "high", "emergency"]).optional(),
	notes: z.string().optional(),
});

export type DateTime = z.infer<typeof DateTimeSchema>;
export type Attendee = z.infer<typeof AttendeeSchema>;
export type Reminder = z.infer<typeof ReminderSchema>;
export type CalendarEvent = z.infer<typeof CalendarEventSchema>;
export type FreeBusyTimeSlot = z.infer<typeof FreeBusyTimeSlotSchema>;
export type FreeBusyCalendar = z.infer<typeof FreeBusyCalendarSchema>;
export type CalendarListEntry = z.infer<typeof CalendarListEntrySchema>;
export type JobAppointment = z.infer<typeof JobAppointmentSchema>;

// OAuth token structure
export interface GoogleOAuthToken {
	accessToken: string;
	refreshToken?: string;
	expiresAt: Date;
	scope: string;
}

// Event color IDs in Google Calendar
export const EVENT_COLORS = {
	lavender: "1",
	sage: "2",
	grape: "3",
	flamingo: "4",
	banana: "5",
	tangerine: "6",
	peacock: "7",
	graphite: "8",
	blueberry: "9",
	basil: "10",
	tomato: "11",
} as const;

// Priority to color mapping
const PRIORITY_COLORS: Record<string, string> = {
	emergency: EVENT_COLORS.tomato,
	high: EVENT_COLORS.tangerine,
	normal: EVENT_COLORS.peacock,
	low: EVENT_COLORS.sage,
};

// ============================================================================
// Google Calendar Service
// ============================================================================

class GoogleCalendarService {
	private readonly clientId: string | undefined;
	private readonly clientSecret: string | undefined;
	private readonly redirectUri: string;

	constructor() {
		this.clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
		this.clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
		this.redirectUri =
			process.env.GOOGLE_OAUTH_REDIRECT_URI ||
			`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;
	}

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return !!this.clientId && !!this.clientSecret;
	}

	/**
	 * Generate OAuth authorization URL for user consent
	 */
	getAuthUrl(state: string, userId: string): string {
		if (!this.clientId) {
			throw new Error("Google OAuth client ID not configured");
		}

		const params = new URLSearchParams({
			client_id: this.clientId,
			redirect_uri: this.redirectUri,
			response_type: "code",
			scope: [
				"https://www.googleapis.com/auth/calendar",
				"https://www.googleapis.com/auth/calendar.events",
			].join(" "),
			access_type: "offline",
			prompt: "consent",
			state: JSON.stringify({ state, userId }),
		});

		return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
	}

	/**
	 * Exchange authorization code for tokens
	 */
	async exchangeCodeForTokens(code: string): Promise<GoogleOAuthToken | null> {
		if (!this.clientId || !this.clientSecret) {
			console.error("Google OAuth not configured");
			return null;
		}

		try {
			const response = await fetch("https://oauth2.googleapis.com/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"User-Agent": USER_AGENT,
				},
				body: new URLSearchParams({
					client_id: this.clientId,
					client_secret: this.clientSecret,
					code,
					grant_type: "authorization_code",
					redirect_uri: this.redirectUri,
				}),
			});

			if (!response.ok) {
				const error = await response.text();
				console.error("Token exchange failed:", error);
				return null;
			}

			const data = await response.json();

			return {
				accessToken: data.access_token,
				refreshToken: data.refresh_token,
				expiresAt: new Date(Date.now() + data.expires_in * 1000),
				scope: data.scope,
			};
		} catch (error) {
			console.error("Token exchange error:", error);
			return null;
		}
	}

	/**
	 * Refresh an expired access token
	 */
	async refreshAccessToken(
		refreshToken: string,
	): Promise<GoogleOAuthToken | null> {
		if (!this.clientId || !this.clientSecret) {
			return null;
		}

		try {
			const response = await fetch("https://oauth2.googleapis.com/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"User-Agent": USER_AGENT,
				},
				body: new URLSearchParams({
					client_id: this.clientId,
					client_secret: this.clientSecret,
					refresh_token: refreshToken,
					grant_type: "refresh_token",
				}),
			});

			if (!response.ok) {
				return null;
			}

			const data = await response.json();

			return {
				accessToken: data.access_token,
				refreshToken: data.refresh_token || refreshToken,
				expiresAt: new Date(Date.now() + data.expires_in * 1000),
				scope: data.scope,
			};
		} catch (error) {
			console.error("Token refresh error:", error);
			return null;
		}
	}

	/**
	 * List user's calendars
	 */
	async listCalendars(accessToken: string): Promise<CalendarListEntry[]> {
		try {
			const response = await fetch(
				"https://www.googleapis.com/calendar/v3/users/me/calendarList",
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"User-Agent": USER_AGENT,
					},
				},
			);

			if (!response.ok) {
				console.error(
					`Calendar list error: ${response.status} ${response.statusText}`,
				);
				return [];
			}

			const data = await response.json();
			return (data.items || []).map((item: Record<string, unknown>) =>
				CalendarListEntrySchema.parse(item),
			);
		} catch (error) {
			console.error("List calendars error:", error);
			return [];
		}
	}

	/**
	 * Create a calendar event for a job appointment
	 */
	async createJobEvent(
		accessToken: string,
		appointment: JobAppointment,
		calendarId = "primary",
	): Promise<CalendarEvent | null> {
		try {
			const event = this.appointmentToEvent(appointment);

			const response = await fetch(
				`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
						"User-Agent": USER_AGENT,
					},
					body: JSON.stringify(event),
				},
			);

			if (!response.ok) {
				const error = await response.text();
				console.error(`Create event error: ${response.status}`, error);
				return null;
			}

			const data = await response.json();
			return CalendarEventSchema.parse(data);
		} catch (error) {
			console.error("Create event error:", error);
			return null;
		}
	}

	/**
	 * Update an existing calendar event
	 */
	async updateJobEvent(
		accessToken: string,
		googleEventId: string,
		appointment: JobAppointment,
		calendarId = "primary",
	): Promise<CalendarEvent | null> {
		try {
			const event = this.appointmentToEvent(appointment);

			const response = await fetch(
				`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(googleEventId)}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
						"User-Agent": USER_AGENT,
					},
					body: JSON.stringify(event),
				},
			);

			if (!response.ok) {
				console.error(`Update event error: ${response.status}`);
				return null;
			}

			const data = await response.json();
			return CalendarEventSchema.parse(data);
		} catch (error) {
			console.error("Update event error:", error);
			return null;
		}
	}

	/**
	 * Delete a calendar event
	 */
	async deleteEvent(
		accessToken: string,
		googleEventId: string,
		calendarId = "primary",
	): Promise<boolean> {
		try {
			const response = await fetch(
				`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(googleEventId)}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"User-Agent": USER_AGENT,
					},
				},
			);

			return response.ok || response.status === 404;
		} catch (error) {
			console.error("Delete event error:", error);
			return false;
		}
	}

	/**
	 * Get event by ID
	 */
	async getEvent(
		accessToken: string,
		googleEventId: string,
		calendarId = "primary",
	): Promise<CalendarEvent | null> {
		try {
			const response = await fetch(
				`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(googleEventId)}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"User-Agent": USER_AGENT,
					},
				},
			);

			if (!response.ok) {
				return null;
			}

			const data = await response.json();
			return CalendarEventSchema.parse(data);
		} catch (error) {
			console.error("Get event error:", error);
			return null;
		}
	}

	/**
	 * List events in a time range
	 */
	async listEvents(
		accessToken: string,
		options: {
			calendarId?: string;
			timeMin: Date;
			timeMax: Date;
			maxResults?: number;
			singleEvents?: boolean;
			orderBy?: "startTime" | "updated";
		},
	): Promise<CalendarEvent[]> {
		try {
			const params = new URLSearchParams({
				timeMin: options.timeMin.toISOString(),
				timeMax: options.timeMax.toISOString(),
				maxResults: String(options.maxResults || 250),
				singleEvents: String(options.singleEvents ?? true),
				orderBy: options.orderBy || "startTime",
			});

			const calendarId = options.calendarId || "primary";
			const response = await fetch(
				`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"User-Agent": USER_AGENT,
					},
				},
			);

			if (!response.ok) {
				console.error(`List events error: ${response.status}`);
				return [];
			}

			const data = await response.json();
			return (data.items || []).map((item: Record<string, unknown>) =>
				CalendarEventSchema.parse(item),
			);
		} catch (error) {
			console.error("List events error:", error);
			return [];
		}
	}

	/**
	 * Check free/busy time for scheduling
	 */
	async getFreeBusy(
		accessToken: string,
		options: {
			calendarIds: string[];
			timeMin: Date;
			timeMax: Date;
			timeZone?: string;
		},
	): Promise<Map<string, FreeBusyCalendar>> {
		try {
			const response = await fetch(
				"https://www.googleapis.com/calendar/v3/freeBusy",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
						"User-Agent": USER_AGENT,
					},
					body: JSON.stringify({
						timeMin: options.timeMin.toISOString(),
						timeMax: options.timeMax.toISOString(),
						timeZone: options.timeZone || "America/New_York",
						items: options.calendarIds.map((id) => ({ id })),
					}),
				},
			);

			if (!response.ok) {
				console.error(`Free/busy error: ${response.status}`);
				return new Map();
			}

			const data = await response.json();
			const result = new Map<string, FreeBusyCalendar>();

			for (const [calendarId, calendar] of Object.entries(
				data.calendars || {},
			)) {
				result.set(calendarId, FreeBusyCalendarSchema.parse(calendar));
			}

			return result;
		} catch (error) {
			console.error("Free/busy error:", error);
			return new Map();
		}
	}

	/**
	 * Find available time slots for scheduling
	 */
	async findAvailableSlots(
		accessToken: string,
		options: {
			calendarIds: string[];
			date: Date;
			durationMinutes: number;
			startHour?: number;
			endHour?: number;
			slotIntervalMinutes?: number;
		},
	): Promise<Array<{ start: Date; end: Date }>> {
		const startHour = options.startHour ?? 8;
		const endHour = options.endHour ?? 18;
		const interval = options.slotIntervalMinutes ?? 30;

		// Set time range for the day
		const dayStart = new Date(options.date);
		dayStart.setHours(startHour, 0, 0, 0);

		const dayEnd = new Date(options.date);
		dayEnd.setHours(endHour, 0, 0, 0);

		// Get free/busy info
		const freeBusy = await this.getFreeBusy(accessToken, {
			calendarIds: options.calendarIds,
			timeMin: dayStart,
			timeMax: dayEnd,
		});

		// Collect all busy times
		const busySlots: Array<{ start: Date; end: Date }> = [];
		for (const calendar of freeBusy.values()) {
			for (const slot of calendar.busy) {
				busySlots.push({
					start: new Date(slot.start),
					end: new Date(slot.end),
				});
			}
		}

		// Sort busy slots by start time
		busySlots.sort((a, b) => a.start.getTime() - b.start.getTime());

		// Find available slots
		const availableSlots: Array<{ start: Date; end: Date }> = [];
		let currentTime = dayStart;

		while (
			currentTime.getTime() + options.durationMinutes * 60000 <=
			dayEnd.getTime()
		) {
			const slotEnd = new Date(
				currentTime.getTime() + options.durationMinutes * 60000,
			);

			// Check if slot conflicts with any busy time
			const conflicts = busySlots.some(
				(busy) => currentTime < busy.end && slotEnd > busy.start,
			);

			if (!conflicts) {
				availableSlots.push({
					start: new Date(currentTime),
					end: slotEnd,
				});
			}

			// Move to next slot
			currentTime = new Date(currentTime.getTime() + interval * 60000);
		}

		return availableSlots;
	}

	/**
	 * Sync all appointments for a technician
	 */
	async syncTechnicianAppointments(
		accessToken: string,
		appointments: JobAppointment[],
		existingSyncMap: Map<string, string>, // appointmentId -> googleEventId
		calendarId = "primary",
	): Promise<{
		created: string[];
		updated: string[];
		deleted: string[];
		errors: Array<{ appointmentId: string; error: string }>;
		newSyncMap: Map<string, string>;
	}> {
		const result = {
			created: [] as string[],
			updated: [] as string[],
			deleted: [] as string[],
			errors: [] as Array<{ appointmentId: string; error: string }>,
			newSyncMap: new Map<string, string>(),
		};

		// Track which appointments we've processed
		const processedAppointmentIds = new Set<string>();

		for (const appointment of appointments) {
			processedAppointmentIds.add(appointment.id);
			const existingEventId = existingSyncMap.get(appointment.id);

			try {
				if (existingEventId) {
					// Update existing event
					const updated = await this.updateJobEvent(
						accessToken,
						existingEventId,
						appointment,
						calendarId,
					);

					if (updated?.id) {
						result.updated.push(appointment.id);
						result.newSyncMap.set(appointment.id, updated.id);
					} else {
						result.errors.push({
							appointmentId: appointment.id,
							error: "Failed to update event",
						});
					}
				} else {
					// Create new event
					const created = await this.createJobEvent(
						accessToken,
						appointment,
						calendarId,
					);

					if (created?.id) {
						result.created.push(appointment.id);
						result.newSyncMap.set(appointment.id, created.id);
					} else {
						result.errors.push({
							appointmentId: appointment.id,
							error: "Failed to create event",
						});
					}
				}
			} catch (error) {
				result.errors.push({
					appointmentId: appointment.id,
					error: error instanceof Error ? error.message : "Unknown error",
				});
			}
		}

		// Delete events for appointments that no longer exist
		for (const [appointmentId, googleEventId] of existingSyncMap) {
			if (!processedAppointmentIds.has(appointmentId)) {
				const deleted = await this.deleteEvent(
					accessToken,
					googleEventId,
					calendarId,
				);
				if (deleted) {
					result.deleted.push(appointmentId);
				}
			}
		}

		return result;
	}

	// =========================================================================
	// Private Helpers
	// =========================================================================

	/**
	 * Convert job appointment to Google Calendar event format
	 */
	private appointmentToEvent(
		appointment: JobAppointment,
	): Omit<CalendarEvent, "id" | "htmlLink" | "created" | "updated" | "status"> {
		// Build description
		const descriptionParts: string[] = [];

		if (appointment.jobNumber) {
			descriptionParts.push(`Job #: ${appointment.jobNumber}`);
		}

		if (appointment.customer) {
			descriptionParts.push(`\nCustomer: ${appointment.customer.name}`);
			if (appointment.customer.phone) {
				descriptionParts.push(`Phone: ${appointment.customer.phone}`);
			}
			if (appointment.customer.email) {
				descriptionParts.push(`Email: ${appointment.customer.email}`);
			}
		}

		if (appointment.jobType) {
			descriptionParts.push(`\nJob Type: ${appointment.jobType}`);
		}

		if (appointment.status) {
			descriptionParts.push(`Status: ${appointment.status}`);
		}

		if (appointment.priority) {
			descriptionParts.push(`Priority: ${appointment.priority.toUpperCase()}`);
		}

		if (appointment.notes) {
			descriptionParts.push(`\nNotes:\n${appointment.notes}`);
		}

		if (appointment.description) {
			descriptionParts.push(`\nDescription:\n${appointment.description}`);
		}

		// Build location
		let location: string | undefined;
		if (appointment.location) {
			location = appointment.location.address;
		}

		// Build attendees
		const attendees: Attendee[] = [];
		if (appointment.technicians) {
			for (const tech of appointment.technicians) {
				if (tech.email) {
					attendees.push({
						email: tech.email,
						displayName: tech.name,
					});
				}
			}
		}
		if (appointment.customer?.email) {
			attendees.push({
				email: appointment.customer.email,
				displayName: appointment.customer.name,
				optional: true,
			});
		}

		// Get color based on priority
		const colorId = appointment.priority
			? PRIORITY_COLORS[appointment.priority]
			: undefined;

		return {
			summary: appointment.title,
			description: descriptionParts.join("\n"),
			location,
			start: {
				dateTime: appointment.startTime.toISOString(),
				timeZone: "America/New_York",
			},
			end: {
				dateTime: appointment.endTime.toISOString(),
				timeZone: "America/New_York",
			},
			attendees: attendees.length > 0 ? attendees : undefined,
			colorId,
			reminders: {
				useDefault: false,
				overrides: [
					{ method: "popup", minutes: 60 }, // 1 hour before
					{ method: "popup", minutes: 15 }, // 15 minutes before
				],
			},
			extendedProperties: {
				private: {
					stratosAppointmentId: appointment.id,
					stratosJobNumber: appointment.jobNumber || "",
					stratosJobType: appointment.jobType || "",
				},
			},
			visibility: "private",
		};
	}
}

// Singleton instance
export const googleCalendarService = new GoogleCalendarService();

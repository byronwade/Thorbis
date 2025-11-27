"use server";

import { createClient } from "@/lib/supabase/server";

export async function assignJobToTechnician(
	_jobId: string,
	scheduleId: string,
	technicianId: string,
) {
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Database not available" };
	}

	try {
		// First check if the schedule exists and get current assignment
		const { data: existingSchedule, error: checkError } = await supabase
			.from("appointments")
			.select("id, assigned_to")
			.eq("id", scheduleId)
			.single();

		if (checkError) {
			throw new Error(`Schedule check failed: ${checkError.message}`);
		}

		if (!existingSchedule) {
			throw new Error("Schedule not found");
		}

		// Update the schedule's assigned_to field
		const { data: updatedSchedule, error: scheduleError } = await supabase
			.from("appointments")
			.update({ assigned_to: technicianId })
			.eq("id", scheduleId)
			.select()
			.single();

		if (scheduleError) {
			throw new Error(`Schedule update failed: ${scheduleError.message}`);
		}

		// Don't revalidate immediately - let the optimistic update show
		// revalidatePath("/dashboard/schedule");
		return { success: true, data: updatedSchedule };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to assign job",
		};
	}
}

export async function updateAppointmentTimes(
	scheduleId: string,
	startTime: Date,
	endTime: Date,
) {
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Database not available" };
	}

	try {
		const duration = Math.round(
			(endTime.getTime() - startTime.getTime()) / (1000 * 60),
		);

		// Format as local datetime string WITHOUT timezone conversion
		// Get year, month, day, hour, minute from the Date object directly
		const formatLocalDateTime = (date: Date) => {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			const hour = String(date.getHours()).padStart(2, "0");
			const minute = String(date.getMinutes()).padStart(2, "0");
			const second = String(date.getSeconds()).padStart(2, "0");
			return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
		};

		const startStr = formatLocalDateTime(startTime);
		const endStr = formatLocalDateTime(endTime);

		const { error } = await supabase
			.from("appointments")
			.update({
				start_time: startStr,
				end_time: endStr,
				duration,
			})
			.eq("id", scheduleId);

		if (error) {
			throw error;
		}

		// Don't revalidate immediately - let the optimistic update show
		// revalidatePath("/dashboard/schedule");
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to update times",
		};
	}
}

export async function cancelAppointment(scheduleId: string, reason?: string) {
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Database not available" };
	}

	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Cancel appointment - unschedule it (remove assigned_to)
		const { error } = await supabase
			.from("appointments")
			.update({
				status: "cancelled",
				assigned_to: null, // Unassign technician
				cancelled_at: new Date().toISOString(),
				cancelled_by: user.id,
				cancellation_reason: reason || null,
			})
			.eq("id", scheduleId);

		if (error) {
			throw error;
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to cancel appointment",
		};
	}
}

export async function cancelJobAndAppointment(
	scheduleId: string,
	jobId: string,
	reason?: string,
) {
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Database not available" };
	}

	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		const now = new Date().toISOString();

		// Cancel the appointment
		const { error: scheduleError } = await supabase
			.from("appointments")
			.update({
				status: "cancelled",
				assigned_to: null,
				cancelled_at: now,
				cancelled_by: user.id,
				cancellation_reason: reason || null,
			})
			.eq("id", scheduleId);

		if (scheduleError) {
			throw scheduleError;
		}

		// Also cancel the job if it exists
		if (jobId) {
			const { error: jobError } = await supabase
				.from("jobs")
				.update({
					status: "cancelled",
					cancelled_at: now,
					cancelled_by: user.id,
					cancellation_reason: reason || null,
				})
				.eq("id", jobId);

			if (jobError) {
				throw jobError;
			}
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to cancel job and appointment",
		};
	}
}

export async function archiveAppointment(scheduleId: string) {
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Database not available" };
	}

	try {
		const { error } = await supabase
			.from("appointments")
			.update({
				archived_at: new Date().toISOString(),
			})
			.eq("id", scheduleId);

		if (error) {
			throw error;
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to archive appointment",
		};
	}
}

export async function completeAppointment(scheduleId: string) {
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Database not available" };
	}

	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		const now = new Date().toISOString();

		const { error } = await supabase
			.from("appointments")
			.update({
				status: "completed",
				actual_end_time: now,
				completed_by: user.id,
			})
			.eq("id", scheduleId);

		if (error) {
			throw error;
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to complete appointment",
		};
	}
}

type DispatchStatus = "dispatched" | "arrived" | "closed";

async function updateScheduleStatus(
	scheduleId: string,
	status: DispatchStatus,
	extraUpdates: Record<string, unknown> = {},
) {
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Database not available" };
	}

	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		const now = new Date().toISOString();
		const updates: Record<string, unknown> = {
			status,
			updated_at: now,
			...extraUpdates,
		};

		if (status === "closed") {
			updates.completed_by = user.id;
			updates.actual_end_time = updates.actual_end_time ?? now;
		}

		const { error } = await supabase
			.from("appointments")
			.update(updates)
			.eq("id", scheduleId);

		if (error) {
			throw error;
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: `Failed to update appointment status to ${status}`,
		};
	}
}

export async function dispatchAppointment(scheduleId: string) {
	return updateScheduleStatus(scheduleId, "dispatched");
}

export async function arriveAppointment(scheduleId: string) {
	const now = new Date().toISOString();
	return updateScheduleStatus(scheduleId, "arrived", {
		actual_start_time: now,
	});
}

export async function closeAppointment(scheduleId: string) {
	const now = new Date().toISOString();
	return updateScheduleStatus(scheduleId, "closed", {
		actual_end_time: now,
	});
}

/**
 * Move an existing appointment to a new technician and/or time slot
 * Batches both operations in a single database call for performance
 */
export async function moveAppointment(
	scheduleId: string,
	technicianId: string,
	startTime: Date,
	endTime: Date,
) {
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Database not available" };
	}

	try {
		const duration = Math.round(
			(endTime.getTime() - startTime.getTime()) / (1000 * 60),
		);

		// Format as local datetime string WITHOUT timezone conversion
		const formatLocalDateTime = (date: Date) => {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			const hour = String(date.getHours()).padStart(2, "0");
			const minute = String(date.getMinutes()).padStart(2, "0");
			const second = String(date.getSeconds()).padStart(2, "0");
			return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
		};

		const startStr = formatLocalDateTime(startTime);
		const endStr = formatLocalDateTime(endTime);

		// Single atomic update for both assignment and times
		const { data, error } = await supabase
			.from("appointments")
			.update({
				assigned_to: technicianId,
				start_time: startStr,
				end_time: endStr,
				duration,
				updated_at: new Date().toISOString(),
			})
			.eq("id", scheduleId)
			.select()
			.single();

		if (error) {
			throw error;
		}

		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to move appointment",
		};
	}
}

/**
 * Assign an unassigned job to a technician with a specific time slot
 * Used when dragging from unassigned panel to a technician lane
 */
export async function assignNewAppointment(
	scheduleId: string,
	technicianId: string,
	startTime: Date,
	endTime: Date,
) {
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Database not available" };
	}

	try {
		const duration = Math.round(
			(endTime.getTime() - startTime.getTime()) / (1000 * 60),
		);

		const formatLocalDateTime = (date: Date) => {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			const hour = String(date.getHours()).padStart(2, "0");
			const minute = String(date.getMinutes()).padStart(2, "0");
			const second = String(date.getSeconds()).padStart(2, "0");
			return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
		};

		const startStr = formatLocalDateTime(startTime);
		const endStr = formatLocalDateTime(endTime);

		// Single atomic update for assignment
		const { data, error } = await supabase
			.from("appointments")
			.update({
				assigned_to: technicianId,
				start_time: startStr,
				end_time: endStr,
				duration,
				status: "scheduled",
				updated_at: new Date().toISOString(),
			})
			.eq("id", scheduleId)
			.select()
			.single();

		if (error) {
			throw error;
		}

		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to assign appointment",
		};
	}
}

export async function unassignAppointment(scheduleId: string) {
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Database not available" };
	}

	try {
		const { error } = await supabase
			.from("appointments")
			.update({
				assigned_to: null,
				updated_at: new Date().toISOString(),
			})
			.eq("id", scheduleId);

		if (error) {
			throw error;
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to move appointment to Unscheduled",
		};
	}
}

/**
 * Send "On My Way" SMS notification to customer
 * Includes technician name and estimated arrival time
 */
export async function sendOnMyWayNotification(
	scheduleId: string,
	technicianName: string,
	customerPhone: string,
	destinationAddress?: string,
) {
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Database not available" };
	}

	try {
		// Get user and company info
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Get company's Twilio settings for the from number
		const { data: membership } = await supabase
			.from("company_memberships")
			.select("company_id")
			.eq("user_id", user.id)
			.eq("status", "active")
			.single();

		if (!membership?.company_id) {
			return { success: false, error: "No active company membership" };
		}

		const { data: twilioSettings } = await supabase
			.from("company_twilio_settings")
			.select("default_from_number, status")
			.eq("company_id", membership.company_id)
			.eq("status", "ready")
			.single();

		if (!twilioSettings?.default_from_number) {
			return { success: false, error: "No phone number configured for SMS" };
		}

		// Get company name for the message
		const { data: company } = await supabase
			.from("companies")
			.select("name")
			.eq("id", membership.company_id)
			.single();

		// Build the "On My Way" message
		let message = `Hi! ${technicianName} from ${company?.name || "your service provider"} is on the way to your appointment.`;

		// Try to get travel time estimate if we have a destination
		if (destinationAddress) {
			try {
				const baseUrl =
					process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
				const travelResponse = await fetch(
					`${baseUrl}/api/travel-time?destination=${encodeURIComponent(destinationAddress)}`,
					{
						headers: {
							Cookie: `sb-access-token=${user.id}`, // Pass auth context
						},
					},
				);

				if (travelResponse.ok) {
					const travelData = await travelResponse.json();
					if (travelData.durationText) {
						message += ` Estimated arrival: ${travelData.durationText}.`;
					}
				}
			} catch {
				// Travel time fetch failed - continue without it
			}
		}

		message += " We'll see you soon!";

		// Send the SMS via Twilio
		const { sendSms } = await import("@/lib/twilio/messaging");
		const result = await sendSms({
			companyId: membership.company_id,
			to: customerPhone,
			from: twilioSettings.default_from_number,
			body: message,
		});

		if (!result.success) {
			return { success: false, error: "Failed to send SMS" };
		}

		// Update appointment status to dispatched
		await supabase
			.from("appointments")
			.update({
				status: "dispatched",
				dispatched_at: new Date().toISOString(),
			})
			.eq("id", scheduleId);

		return {
			success: true,
			message: "On My Way notification sent successfully",
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to send On My Way notification",
		};
	}
}

/**
 * Send appointment confirmation SMS to customer
 * Sent when an appointment is first scheduled
 */
export async function sendAppointmentConfirmation(
	scheduleId: string,
	customerPhone: string,
	customerName: string,
	appointmentDate: Date,
	appointmentTime: string,
	serviceType?: string,
) {
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Database not available" };
	}

	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Get company info
		const { data: membership } = await supabase
			.from("company_memberships")
			.select("company_id")
			.eq("user_id", user.id)
			.eq("status", "active")
			.single();

		if (!membership?.company_id) {
			return { success: false, error: "No active company membership" };
		}

		const { data: twilioSettings } = await supabase
			.from("company_twilio_settings")
			.select("default_from_number, status")
			.eq("company_id", membership.company_id)
			.eq("status", "ready")
			.single();

		if (!twilioSettings?.default_from_number) {
			return { success: false, error: "No phone number configured for SMS" };
		}

		const { data: company } = await supabase
			.from("companies")
			.select("name, phone")
			.eq("id", membership.company_id)
			.single();

		// Format the date nicely
		const dateFormatter = new Intl.DateTimeFormat("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
		});

		const formattedDate = dateFormatter.format(appointmentDate);

		let message = `Hi ${customerName}! Your appointment with ${company?.name || "us"} is confirmed for ${formattedDate} at ${appointmentTime}.`;

		if (serviceType) {
			message += ` Service: ${serviceType}.`;
		}

		if (company?.phone) {
			message += ` Questions? Call us at ${company.phone}.`;
		}

		message += " Reply STOP to unsubscribe.";

		// Send the SMS
		const { sendSms } = await import("@/lib/twilio/messaging");
		const result = await sendSms({
			companyId: membership.company_id,
			to: customerPhone,
			from: twilioSettings.default_from_number,
			body: message,
		});

		if (!result.success) {
			return { success: false, error: "Failed to send confirmation SMS" };
		}

		// Log the notification
		await supabase.from("communications").insert({
			company_id: membership.company_id,
			type: "sms",
			direction: "outbound",
			from_address: twilioSettings.default_from_number,
			to_address: customerPhone,
			subject: "Appointment Confirmation",
			body: message,
			status: "sent",
			sent_at: new Date().toISOString(),
			metadata: {
				appointment_id: scheduleId,
				notification_type: "confirmation",
			},
		});

		return { success: true, message: "Confirmation SMS sent" };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to send confirmation SMS",
		};
	}
}

/**
 * Send appointment reminder SMS to customer
 * Can be used for day-before or day-of reminders
 */
export async function sendAppointmentReminder(
	scheduleId: string,
	customerPhone: string,
	customerName: string,
	appointmentDate: Date,
	appointmentTime: string,
	reminderType: "24h" | "day-of" | "1h" = "24h",
) {
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Database not available" };
	}

	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Get company info
		const { data: membership } = await supabase
			.from("company_memberships")
			.select("company_id")
			.eq("user_id", user.id)
			.eq("status", "active")
			.single();

		if (!membership?.company_id) {
			return { success: false, error: "No active company membership" };
		}

		const { data: twilioSettings } = await supabase
			.from("company_twilio_settings")
			.select("default_from_number, status")
			.eq("company_id", membership.company_id)
			.eq("status", "ready")
			.single();

		if (!twilioSettings?.default_from_number) {
			return { success: false, error: "No phone number configured for SMS" };
		}

		const { data: company } = await supabase
			.from("companies")
			.select("name, phone")
			.eq("id", membership.company_id)
			.single();

		// Build reminder message based on type
		let message: string;
		const companyName = company?.name || "us";

		switch (reminderType) {
			case "24h":
				message = `Reminder: Hi ${customerName}, your appointment with ${companyName} is tomorrow at ${appointmentTime}. See you then!`;
				break;
			case "day-of":
				message = `Reminder: Hi ${customerName}, your appointment with ${companyName} is today at ${appointmentTime}. We look forward to seeing you!`;
				break;
			case "1h":
				message = `Hi ${customerName}, just a reminder that your ${companyName} appointment is in about 1 hour at ${appointmentTime}. Our technician will arrive shortly!`;
				break;
			default:
				message = `Reminder: Your appointment with ${companyName} is at ${appointmentTime}.`;
		}

		if (company?.phone) {
			message += ` Need to reschedule? Call ${company.phone}.`;
		}

		// Send the SMS
		const { sendSms } = await import("@/lib/twilio/messaging");
		const result = await sendSms({
			companyId: membership.company_id,
			to: customerPhone,
			from: twilioSettings.default_from_number,
			body: message,
		});

		if (!result.success) {
			return { success: false, error: "Failed to send reminder SMS" };
		}

		// Log the notification
		await supabase.from("communications").insert({
			company_id: membership.company_id,
			type: "sms",
			direction: "outbound",
			from_address: twilioSettings.default_from_number,
			to_address: customerPhone,
			subject: `Appointment Reminder (${reminderType})`,
			body: message,
			status: "sent",
			sent_at: new Date().toISOString(),
			metadata: {
				appointment_id: scheduleId,
				notification_type: "reminder",
				reminder_type: reminderType,
			},
		});

		return { success: true, message: `${reminderType} reminder SMS sent` };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to send reminder SMS",
		};
	}
}

/**
 * Send appointment completed notification to customer
 * Includes thank you message and optional review request
 */
export async function sendAppointmentCompletedNotification(
	scheduleId: string,
	customerPhone: string,
	customerName: string,
	technicianName?: string,
	requestReview = false,
) {
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Database not available" };
	}

	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Get company info
		const { data: membership } = await supabase
			.from("company_memberships")
			.select("company_id")
			.eq("user_id", user.id)
			.eq("status", "active")
			.single();

		if (!membership?.company_id) {
			return { success: false, error: "No active company membership" };
		}

		const { data: twilioSettings } = await supabase
			.from("company_twilio_settings")
			.select("default_from_number, status")
			.eq("company_id", membership.company_id)
			.eq("status", "ready")
			.single();

		if (!twilioSettings?.default_from_number) {
			return { success: false, error: "No phone number configured for SMS" };
		}

		const { data: company } = await supabase
			.from("companies")
			.select("name, phone")
			.eq("id", membership.company_id)
			.single();

		const companyName = company?.name || "us";

		let message = `Thank you, ${customerName}! Your service with ${companyName} is complete.`;

		if (technicianName) {
			message += ` ${technicianName} was happy to help!`;
		}

		if (requestReview) {
			message += ` We'd love your feedback - reply with a rating 1-5 stars.`;
		}

		if (company?.phone) {
			message += ` Questions? Call ${company.phone}.`;
		}

		// Send the SMS
		const { sendSms } = await import("@/lib/twilio/messaging");
		const result = await sendSms({
			companyId: membership.company_id,
			to: customerPhone,
			from: twilioSettings.default_from_number,
			body: message,
		});

		if (!result.success) {
			return { success: false, error: "Failed to send completion SMS" };
		}

		// Log the notification
		await supabase.from("communications").insert({
			company_id: membership.company_id,
			type: "sms",
			direction: "outbound",
			from_address: twilioSettings.default_from_number,
			to_address: customerPhone,
			subject: "Service Complete",
			body: message,
			status: "sent",
			sent_at: new Date().toISOString(),
			metadata: {
				appointment_id: scheduleId,
				notification_type: "completed",
				review_requested: requestReview,
			},
		});

		return { success: true, message: "Completion notification sent" };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to send completion notification",
		};
	}
}

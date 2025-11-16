"use server";

import { createClient } from "@/lib/supabase/server";

export async function assignJobToTechnician(_jobId: string, scheduleId: string, technicianId: string) {
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Database not available" };
	}

	try {
		// First check if the schedule exists and get current assignment
		const { data: existingSchedule, error: checkError } = await supabase
			.from("schedules")
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
			.from("schedules")
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
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to assign job",
		};
	}
}

export async function updateAppointmentTimes(scheduleId: string, startTime: Date, endTime: Date) {
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Database not available" };
	}

	try {
		const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

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
			.from("schedules")
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
    console.error("Error:", error);
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
			.from("schedules")
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
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to cancel appointment",
		};
	}
}

export async function cancelJobAndAppointment(scheduleId: string, jobId: string, reason?: string) {
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
			.from("schedules")
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
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to cancel job and appointment",
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
			.from("schedules")
			.update({
				archived_at: new Date().toISOString(),
			})
			.eq("id", scheduleId);

		if (error) {
			throw error;
		}

		return { success: true };
	} catch (error) {
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to archive appointment",
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
			.from("schedules")
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
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to complete appointment",
		};
	}
}

type DispatchStatus = "dispatched" | "arrived" | "closed";

async function updateScheduleStatus(
	scheduleId: string,
	status: DispatchStatus,
	extraUpdates: Record<string, unknown> = {}
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

		const { error } = await supabase.from("schedules").update(updates).eq("id", scheduleId);

		if (error) {
			throw error;
		}

		return { success: true };
	} catch (error) {
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : `Failed to update appointment status to ${status}`,
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

export async function unassignAppointment(scheduleId: string) {
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, error: "Database not available" };
	}

	try {
		const { error } = await supabase
			.from("schedules")
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
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to move appointment to Unscheduled",
		};
	}
}

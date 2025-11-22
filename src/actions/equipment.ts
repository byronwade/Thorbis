"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// Customer Equipment Actions
// ============================================================================

/**
 * Fetch all equipment for a customer/property
 */
async function getCustomerEquipment(customerId: string) {
	const supabase = await createClient();
	if (!supabase) {
		return { success: false, error: "Supabase client not initialized" };
	}

	const { data, error } = await supabase
		.from("equipment")
		.select(
			`
      *,
      customer:customers(id, first_name, last_name),
      property:properties(id, name, address_line1),
      installed_by:users(id, name, email),
      service_plan:service_plans(id, name, interval)
    `,
		)
		.eq("customer_id", customerId)
		.is("deleted_at", null)
		.order("created_at", { ascending: false });

	if (error) {
		return { success: false, error: error.message };
	}

	return { success: true, data };
}

/**
 * Fetch all equipment for a property
 */
async function getPropertyEquipment(propertyId: string) {
	const supabase = await createClient();
	if (!supabase) {
		return { success: false, error: "Supabase client not initialized" };
	}

	const { data, error } = await supabase
		.from("equipment")
		.select(
			`
      *,
      customer:customers(id, first_name, last_name),
      property:properties(id, name, address_line1),
      installed_by:users(id, name, email)
    `,
		)
		.eq("property_id", propertyId)
		.is("deleted_at", null)
		.order("created_at", { ascending: false });

	if (error) {
		return { success: false, error: error.message };
	}

	return { success: true, data };
}

/**
 * Fetch equipment serviced on a specific job
 */
async function getJobEquipment(jobId: string) {
	const supabase = await createClient();
	if (!supabase) {
		return { success: false, error: "Supabase client not initialized" };
	}

	const { data, error } = await supabase
		.from("job_equipment")
		.select(
			`
      *,
      equipment:equipment_id(
        id,
        name,
        type,
        manufacturer,
        model,
        serial_number,
        status,
        condition
      )
    `,
		)
		.eq("job_id", jobId)
		.order("created_at", { ascending: false });

	if (error) {
		return { success: false, error: error.message };
	}

	return { success: true, data };
}

/**
 * Create new customer equipment
 */
async function createEquipment(formData: FormData) {
	const supabase = await createClient();
	if (!supabase) {
		return { success: false, error: "Supabase client not initialized" };
	}

	// Get user and company
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return { success: false, error: "Not authenticated" };
	}

	const { data: userData } = await supabase
		.from("profiles")
		.select("company_id")
		.eq("id", user.id)
		.single();

	if (!userData?.company_id) {
		return { success: false, error: "Company not found" };
	}

	// Generate equipment number
	const { data: lastEquipment } = await supabase
		.from("equipment")
		.select("equipment_number")
		.eq("company_id", userData.company_id)
		.order("created_at", { ascending: false })
		.limit(1)
		.single();

	const EQUIPMENT_NUMBER_PADDING = 5;
	let equipmentNumber = "EQ-00001";
	if (lastEquipment?.equipment_number) {
		const num =
			Number.parseInt(lastEquipment.equipment_number.split("-")[1], 10) + 1;
		equipmentNumber = `EQ-${num.toString().padStart(EQUIPMENT_NUMBER_PADDING, "0")}`;
	}

	// Extract form data
	const customerId = formData.get("customer_id") as string;
	const propertyId = formData.get("property_id") as string;
	const name = formData.get("name") as string;
	const type = formData.get("type") as string;
	const manufacturer = formData.get("manufacturer") as string;
	const model = formData.get("model") as string;
	const serialNumber = formData.get("serial_number") as string;
	const location = formData.get("location") as string;
	const installDate = formData.get("install_date") as string;
	const warrantyExpiration = formData.get("warranty_expiration") as string;

	const { data, error } = await supabase
		.from("equipment")
		.insert({
			company_id: userData.company_id,
			customer_id: customerId,
			property_id: propertyId,
			equipment_number: equipmentNumber,
			name,
			type,
			manufacturer,
			model,
			serial_number: serialNumber,
			location,
			install_date: installDate || null,
			warranty_expiration: warrantyExpiration || null,
			is_under_warranty: warrantyExpiration
				? new Date(warrantyExpiration) > new Date()
				: false,
			status: "active",
			condition: "good",
		})
		.select()
		.single();

	if (error) {
		return { success: false, error: error.message };
	}

	revalidatePath("/dashboard/work/equipment");
	revalidatePath(`/dashboard/customers/${customerId}`);
	revalidatePath(`/dashboard/work/properties/${propertyId}`);

	return { success: true, data };
}

/**
 * Link equipment to a job (equipment was serviced on this job)
 */
async function addEquipmentToJob(formData: FormData) {
	const supabase = await createClient();
	if (!supabase) {
		return { success: false, error: "Supabase client not initialized" };
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return { success: false, error: "Not authenticated" };
	}

	const { data: userData } = await supabase
		.from("profiles")
		.select("company_id")
		.eq("id", user.id)
		.single();

	if (!userData?.company_id) {
		return { success: false, error: "Company not found" };
	}

	const jobId = formData.get("job_id") as string;
	const equipmentId = formData.get("equipment_id") as string;
	const serviceType = formData.get("service_type") as string;
	const workPerformed = formData.get("work_performed") as string;
	const conditionBefore = formData.get("condition_before") as string;
	const conditionAfter = formData.get("condition_after") as string;
	const technicianNotes = formData.get("technician_notes") as string;

	const { data, error } = await supabase
		.from("job_equipment")
		.insert({
			company_id: userData.company_id,
			job_id: jobId,
			equipment_id: equipmentId,
			service_type: serviceType || "maintenance",
			work_performed: workPerformed,
			condition_before: conditionBefore,
			condition_after: conditionAfter,
			technician_notes: technicianNotes,
		})
		.select()
		.single();

	if (error) {
		return { success: false, error: error.message };
	}

	revalidatePath(`/dashboard/work/${jobId}`);

	return { success: true, data };
}

/**
 * Update equipment service details on a job
 */
async function updateJobEquipment(
	jobEquipmentId: string,
	formData: FormData,
) {
	const supabase = await createClient();
	if (!supabase) {
		return { success: false, error: "Supabase client not initialized" };
	}

	const workPerformed = formData.get("work_performed") as string;
	const conditionAfter = formData.get("condition_after") as string;
	const technicianNotes = formData.get("technician_notes") as string;
	const customerNotes = formData.get("customer_notes") as string;
	const followUpNeeded = formData.get("follow_up_needed") === "true";

	const { data, error } = await supabase
		.from("job_equipment")
		.update({
			work_performed: workPerformed,
			condition_after: conditionAfter,
			technician_notes: technicianNotes,
			customer_notes: customerNotes,
			follow_up_needed: followUpNeeded,
			updated_at: new Date().toISOString(),
		})
		.eq("id", jobEquipmentId)
		.select()
		.single();

	if (error) {
		return { success: false, error: error.message };
	}

	return { success: true, data };
}

/**
 * Archive equipment (soft delete)
 */
export async function archiveEquipment(
	equipmentId: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database connection not available" };
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Unauthorized" };
		}

		const { error } = await supabase
			.from("equipment")
			.update({
				deleted_at: new Date().toISOString(),
			})
			.eq("id", equipmentId);

		if (error) {
			return { success: false, error: error.message };
		}

		revalidatePath("/dashboard/work/equipment");
		return { success: true };
	} catch (_error) {
		return { success: false, error: "Failed to archive equipment" };
	}
}

// ============================================================================
// Materials Actions
// ============================================================================

/**
 * Fetch materials used on a job
 */
async function getJobMaterials(jobId: string) {
	const supabase = await createClient();
	if (!supabase) {
		return { success: false, error: "Supabase client not initialized" };
	}

	const { data, error } = await supabase
		.from("job_materials")
		.select(
			`
      *,
      price_book_item:price_book_items(id, name, sku, unit_price),
      used_by:users(id, name, email)
    `,
		)
		.eq("job_id", jobId)
		.order("created_at", { ascending: false });

	if (error) {
		return { success: false, error: error.message };
	}

	return { success: true, data };
}

/**
 * Add material to a job
 */
async function addMaterialToJob(formData: FormData) {
	const supabase = await createClient();
	if (!supabase) {
		return { success: false, error: "Supabase client not initialized" };
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return { success: false, error: "Not authenticated" };
	}

	const { data: userData } = await supabase
		.from("profiles")
		.select("company_id")
		.eq("id", user.id)
		.single();

	if (!userData?.company_id) {
		return { success: false, error: "Company not found" };
	}

	const jobId = formData.get("job_id") as string;
	const name = formData.get("name") as string;
	const quantity = Number.parseFloat(formData.get("quantity") as string);
	const unitCost = Number.parseInt(formData.get("unit_cost") as string, 10);
	const unitPrice = Number.parseInt(formData.get("unit_price") as string, 10);

	const { data, error } = await supabase
		.from("job_materials")
		.insert({
			company_id: userData.company_id,
			job_id: jobId,
			name,
			quantity,
			unit_cost: unitCost,
			unit_price: unitPrice,
			used_by: user.id,
		})
		.select()
		.single();

	if (error) {
		return { success: false, error: error.message };
	}

	revalidatePath(`/dashboard/work/${jobId}`);

	return { success: true, data };
}

/**
 * Remove equipment from job
 * Deletes the job_equipment junction table record
 * Bidirectional operation - updates both equipment and job views
 */
async function removeEquipmentFromJob(
	jobEquipmentId: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Supabase client not initialized" };
		}

		// Get the junction record to find job_id for revalidation
		const { data: record, error: fetchError } = await supabase
			.from("job_equipment")
			.select("id, job_id")
			.eq("id", jobEquipmentId)
			.single();

		if (fetchError || !record) {
			return { success: false, error: "Record not found" };
		}

		const jobId = record.job_id;

		// Delete junction table row
		const { error: deleteError } = await supabase
			.from("job_equipment")
			.delete()
			.eq("id", jobEquipmentId);

		if (deleteError) {
			return { success: false, error: deleteError.message };
		}

		// Revalidate job page and equipment list
		if (jobId) {
			revalidatePath(`/dashboard/work/${jobId}`);
		}
		revalidatePath("/dashboard/work/equipment");

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to remove equipment from job",
		};
	}
}

/**
 * Remove material from job
 * Deletes the job_materials junction table record
 * Updates job page view
 */
async function removeJobMaterial(
	jobMaterialId: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Supabase client not initialized" };
		}

		// Get the junction record to find job_id for revalidation
		const { data: record, error: fetchError } = await supabase
			.from("job_materials")
			.select("id, job_id")
			.eq("id", jobMaterialId)
			.single();

		if (fetchError || !record) {
			return { success: false, error: "Record not found" };
		}

		const jobId = record.job_id;

		// Delete junction table row
		const { error: deleteError } = await supabase
			.from("job_materials")
			.delete()
			.eq("id", jobMaterialId);

		if (deleteError) {
			return { success: false, error: deleteError.message };
		}

		// Revalidate job page
		if (jobId) {
			revalidatePath(`/dashboard/work/${jobId}`);
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to remove material from job",
		};
	}
}

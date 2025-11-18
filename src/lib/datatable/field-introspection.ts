/**
 * Field Introspection - Database Field Discovery
 *
 * Returns available fields for each entity type for custom column builder.
 * Includes direct fields and nested relationship fields.
 */

export type FieldDefinition = {
	path: string; // e.g., "email", "customer.email"
	label: string; // Human-readable label
	type: "string" | "number" | "date" | "boolean" | "relation";
	recommended?: "text" | "date" | "currency" | "number" | "badge"; // Suggested format
};

/**
 * Get available fields for an entity type
 */
export function getAvailableFields(entity: string): FieldDefinition[] {
	const fieldMap: Record<string, FieldDefinition[]> = {
		appointments: [
			// Direct fields
			{
				path: "appointment_number",
				label: "Appointment Number",
				type: "string",
				recommended: "text",
			},
			{ path: "title", label: "Title", type: "string", recommended: "text" },
			{
				path: "description",
				label: "Description",
				type: "string",
				recommended: "text",
			},
			{ path: "status", label: "Status", type: "string", recommended: "badge" },
			{
				path: "priority",
				label: "Priority",
				type: "string",
				recommended: "badge",
			},
			{ path: "type", label: "Type", type: "string", recommended: "badge" },
			{
				path: "scheduled_start",
				label: "Scheduled Start",
				type: "date",
				recommended: "date",
			},
			{
				path: "scheduled_end",
				label: "Scheduled End",
				type: "date",
				recommended: "date",
			},
			{
				path: "actual_start",
				label: "Actual Start",
				type: "date",
				recommended: "date",
			},
			{
				path: "actual_end",
				label: "Actual End",
				type: "date",
				recommended: "date",
			},
			{
				path: "duration_minutes",
				label: "Duration (minutes)",
				type: "number",
				recommended: "number",
			},
			{
				path: "travel_time_minutes",
				label: "Travel Time (minutes)",
				type: "number",
				recommended: "number",
			},
			{
				path: "confirmation_sent",
				label: "Confirmation Sent",
				type: "boolean",
				recommended: "badge",
			},
			{
				path: "reminder_sent",
				label: "Reminder Sent",
				type: "boolean",
				recommended: "badge",
			},
			{
				path: "cancellation_reason",
				label: "Cancellation Reason",
				type: "string",
				recommended: "text",
			},
			{ path: "notes", label: "Notes", type: "string", recommended: "text" },
			{
				path: "created_at",
				label: "Created At",
				type: "date",
				recommended: "date",
			},
			{
				path: "updated_at",
				label: "Updated At",
				type: "date",
				recommended: "date",
			},

			// Customer fields (nested)
			{
				path: "customer.first_name",
				label: "Customer First Name",
				type: "relation",
				recommended: "text",
			},
			{
				path: "customer.last_name",
				label: "Customer Last Name",
				type: "relation",
				recommended: "text",
			},
			{
				path: "customer.email",
				label: "Customer Email",
				type: "relation",
				recommended: "text",
			},
			{
				path: "customer.phone",
				label: "Customer Phone",
				type: "relation",
				recommended: "text",
			},
			{
				path: "customer.company_name",
				label: "Customer Company",
				type: "relation",
				recommended: "text",
			},

			// Assigned user fields (nested)
			{
				path: "assigned_user.name",
				label: "Assigned Technician",
				type: "relation",
				recommended: "text",
			},
			{
				path: "assigned_user.email",
				label: "Technician Email",
				type: "relation",
				recommended: "text",
			},

			// Property fields (nested)
			{
				path: "property.address",
				label: "Property Address",
				type: "relation",
				recommended: "text",
			},
			{
				path: "property.city",
				label: "Property City",
				type: "relation",
				recommended: "text",
			},
			{
				path: "property.state",
				label: "Property State",
				type: "relation",
				recommended: "text",
			},
			{
				path: "property.zip_code",
				label: "Property Zip",
				type: "relation",
				recommended: "text",
			},

			// Job fields (nested)
			{
				path: "job.job_number",
				label: "Job Number",
				type: "relation",
				recommended: "text",
			},
			{
				path: "job.title",
				label: "Job Title",
				type: "relation",
				recommended: "text",
			},
			{
				path: "job.status",
				label: "Job Status",
				type: "relation",
				recommended: "badge",
			},
		],

		jobs: [
			// Jobs entity fields
			{ path: "job_number", label: "Job Number", type: "string" },
			{ path: "title", label: "Title", type: "string" },
			{
				path: "description",
				label: "Description",
				type: "string",
				recommended: "text",
			},
			{ path: "status", label: "Status", type: "string", recommended: "badge" },
			{
				path: "priority",
				label: "Priority",
				type: "string",
				recommended: "badge",
			},
			{
				path: "job_type",
				label: "Job Type",
				type: "string",
				recommended: "badge",
			},
			{
				path: "scheduled_start",
				label: "Scheduled Start",
				type: "date",
				recommended: "date",
			},
			{
				path: "scheduled_end",
				label: "Scheduled End",
				type: "date",
				recommended: "date",
			},
			{
				path: "actual_start",
				label: "Actual Start",
				type: "date",
				recommended: "date",
			},
			{
				path: "actual_end",
				label: "Actual End",
				type: "date",
				recommended: "date",
			},
			{
				path: "total_cost",
				label: "Total Cost",
				type: "number",
				recommended: "currency",
			},
			{
				path: "labor_cost",
				label: "Labor Cost",
				type: "number",
				recommended: "currency",
			},
			{
				path: "material_cost",
				label: "Material Cost",
				type: "number",
				recommended: "currency",
			},
			{
				path: "customer.first_name",
				label: "Customer First Name",
				type: "relation",
			},
			{
				path: "customer.last_name",
				label: "Customer Last Name",
				type: "relation",
			},
			{ path: "customer.email", label: "Customer Email", type: "relation" },
			{ path: "customer.phone", label: "Customer Phone", type: "relation" },
			{
				path: "property.address",
				label: "Property Address",
				type: "relation",
			},
			{ path: "property.city", label: "Property City", type: "relation" },
			{ path: "property.state", label: "Property State", type: "relation" },
			{
				path: "created_at",
				label: "Created At",
				type: "date",
				recommended: "date",
			},
			{
				path: "updated_at",
				label: "Updated At",
				type: "date",
				recommended: "date",
			},
		],

		customers: [
			{ path: "first_name", label: "First Name", type: "string" },
			{ path: "last_name", label: "Last Name", type: "string" },
			{ path: "display_name", label: "Display Name", type: "string" },
			{ path: "email", label: "Email", type: "string" },
			{ path: "phone", label: "Phone", type: "string" },
			{ path: "company_name", label: "Company Name", type: "string" },
			{ path: "customer_type", label: "Type", type: "string" },
			{ path: "status", label: "Status", type: "string", recommended: "badge" },
			{ path: "address", label: "Address", type: "string" },
			{ path: "city", label: "City", type: "string" },
			{ path: "state", label: "State", type: "string" },
			{ path: "zip_code", label: "Zip Code", type: "string" },
			{
				path: "created_at",
				label: "Created At",
				type: "date",
				recommended: "date",
			},
			{
				path: "updated_at",
				label: "Updated At",
				type: "date",
				recommended: "date",
			},
		],

		invoices: [
			{ path: "invoice_number", label: "Invoice Number", type: "string" },
			{ path: "status", label: "Status", type: "string", recommended: "badge" },
			{
				path: "issue_date",
				label: "Issue Date",
				type: "date",
				recommended: "date",
			},
			{
				path: "due_date",
				label: "Due Date",
				type: "date",
				recommended: "date",
			},
			{
				path: "subtotal",
				label: "Subtotal",
				type: "number",
				recommended: "currency",
			},
			{
				path: "tax_amount",
				label: "Tax Amount",
				type: "number",
				recommended: "currency",
			},
			{
				path: "total_amount",
				label: "Total Amount",
				type: "number",
				recommended: "currency",
			},
			{
				path: "balance_due",
				label: "Balance Due",
				type: "number",
				recommended: "currency",
			},
			{
				path: "customer.first_name",
				label: "Customer First Name",
				type: "relation",
			},
			{
				path: "customer.last_name",
				label: "Customer Last Name",
				type: "relation",
			},
			{ path: "customer.email", label: "Customer Email", type: "relation" },
			{
				path: "created_at",
				label: "Created At",
				type: "date",
				recommended: "date",
			},
		],

		equipment: [
			{
				path: "equipment_number",
				label: "Equipment Number",
				type: "string",
			},
			{ path: "name", label: "Name", type: "string" },
			{ path: "type", label: "Type", type: "string", recommended: "badge" },
			{ path: "manufacturer", label: "Manufacturer", type: "string" },
			{ path: "model", label: "Model", type: "string" },
			{ path: "serial_number", label: "Serial Number", type: "string" },
			{ path: "category", label: "Category", type: "string" },
			{ path: "location", label: "Location", type: "string" },
			{ path: "status", label: "Status", type: "string", recommended: "badge" },
			{
				path: "install_date",
				label: "Install Date",
				type: "date",
				recommended: "date",
			},
			{
				path: "warranty_expires",
				label: "Warranty Expires",
				type: "date",
				recommended: "date",
			},
			{
				path: "customer.first_name",
				label: "Customer First Name",
				type: "relation",
			},
			{
				path: "customer.last_name",
				label: "Customer Last Name",
				type: "relation",
			},
			{
				path: "property.address",
				label: "Property Address",
				type: "relation",
			},
			{
				path: "created_at",
				label: "Created At",
				type: "date",
				recommended: "date",
			},
		],
	};

	return fieldMap[entity] || [];
}

/**
 * Get recommended format for a field type
 */
export function getRecommendedFormat(
	type: FieldDefinition["type"],
): "text" | "date" | "currency" | "number" | "badge" {
	switch (type) {
		case "date":
			return "date";
		case "number":
			return "number";
		case "boolean":
			return "badge";
		default:
			return "text";
	}
}

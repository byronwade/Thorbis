import { notFound } from "next/navigation";
import { ToolbarActionsProvider } from "@/components/layout/toolbar-actions-provider";
import { EquipmentPageContent } from "@/components/work/equipment/equipment-page-content";
import { EquipmentDetailToolbarActions } from "@/components/work/equipment-detail-toolbar-actions";
import { getEquipmentComplete } from "@/lib/queries/equipment";
import { createClient } from "@/lib/supabase/server";

type EquipmentDetailDataProps = {
	equipmentId: string;
};

/**
 * Equipment Detail Data - Async Server Component
 *
 * Fetches all equipment data and related entities.
 * This streams in after the shell renders.
 *
 * Fetches parallel queries for complete equipment view:
 * - Customer, Property, Service Plan
 * - Installation Job, Last Service Job
 * - Upcoming Maintenance, Service History
 * - Notes, Activities, Attachments
 */
export async function EquipmentDetailData({
	equipmentId,
}: EquipmentDetailDataProps) {
	const supabase = await createClient();

	if (!supabase) {
		return notFound();
	}

	// Get authenticated user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		return notFound();
	}

	// Get the active company ID
	const { getActiveCompanyId } = await import("@/lib/auth/company-context");
	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		return notFound();
	}

	// Get user's membership for the ACTIVE company
	const { data: teamMember, error: teamMemberError } = await supabase
		.from("company_memberships")
		.select("company_id")
		.eq("user_id", user.id)
		.eq("company_id", activeCompanyId)
		.eq("status", "active")
		.maybeSingle();

	// Check for real errors
	const hasRealError =
		teamMemberError &&
		teamMemberError.code !== "PGRST116" &&
		Object.keys(teamMemberError).length > 0;

	if (hasRealError) {
		return notFound();
	}

	if (!teamMember) {
		return notFound();
	}

	// Fetch equipment with tags using RPC
	const equipment = await getEquipmentComplete(
		equipmentId,
		teamMember.company_id,
	);
	const equipmentError = equipment ? null : { code: "PGRST116" };

	if (equipmentError) {
		if (equipmentError.code === "PGRST116") {
			return (
				<div className="flex min-h-screen items-center justify-center">
					<div className="border-border bg-card max-w-md rounded-lg border p-8 text-center shadow-lg">
						<h1 className="mb-4 text-2xl font-bold">Equipment Not Found</h1>
						<p className="text-muted-foreground mb-6 text-sm">
							This equipment doesn't exist or has been deleted.
						</p>
						<a
							className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
							href="/dashboard/work/equipment"
						>
							Back to Equipment
						</a>
					</div>
				</div>
			);
		}

		if (equipmentError.code === "42501") {
			return (
				<div className="flex min-h-screen items-center justify-center">
					<div className="border-border bg-card max-w-md rounded-lg border p-8 text-center shadow-lg">
						<h1 className="mb-4 text-2xl font-bold">Wrong Company</h1>
						<p className="text-muted-foreground mb-2 text-sm">
							This equipment belongs to a different company.
						</p>
						<p className="text-muted-foreground mb-6 text-sm">
							If you need to access this equipment, please switch to the correct
							company using the company selector in the header.
						</p>
						<a
							className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
							href="/dashboard/work/equipment"
						>
							Back to Equipment
						</a>
					</div>
				</div>
			);
		}

		return notFound();
	}

	if (!equipment) {
		return notFound();
	}

	// Fetch related data in parallel
	const [
		{ data: customer },
		{ data: property },
		{ data: servicePlan },
		{ data: installJob },
		{ data: lastServiceJob },
		{ data: upcomingMaintenance },
		{ data: serviceHistory },
		{ data: notes },
		{ data: activities },
		{ data: attachments },
	] = await Promise.all([
		// Customer
		equipment.customer_id
			? supabase
					.from("customers")
					.select("*")
					.eq("id", equipment.customer_id)
					.maybeSingle()
			: Promise.resolve({ data: null }),

		// Property
		equipment.property_id
			? supabase
					.from("properties")
					.select("*")
					.eq("id", equipment.property_id)
					.maybeSingle()
			: Promise.resolve({ data: null }),

		// Service Plan
		equipment.maintenance_plan_id
			? supabase
					.from("maintenance_plans")
					.select("*")
					.eq("id", equipment.maintenance_plan_id)
					.maybeSingle()
			: Promise.resolve({ data: null }),

		// Install Job
		equipment.install_job_id
			? supabase
					.from("jobs")
					.select("*")
					.eq("id", equipment.install_job_id)
					.maybeSingle()
			: Promise.resolve({ data: null }),

		// Last Service Job
		equipment.last_service_job_id
			? supabase
					.from("jobs")
					.select("*")
					.eq("id", equipment.last_service_job_id)
					.maybeSingle()
			: Promise.resolve({ data: null }),

		// Upcoming Maintenance (appointments)
		supabase
			.from("appointments")
			.select(
				`
        *,
        job:jobs!job_id(id, job_number, title)
      `,
			)
			.eq("equipment_id", equipmentId)
			.gte("scheduled_start", new Date().toISOString())
			.is("deleted_at", null)
			.order("scheduled_start", { ascending: true })
			.limit(5),

		// Service History
		supabase
			.from("jobs")
			.select("*")
			.eq("equipment_id", equipmentId)
			.eq("status", "completed")
			.is("deleted_at", null)
			.order("completed_at", { ascending: false })
			.limit(10),

		// Notes
		supabase
			.from("equipment_notes")
			.select("*")
			.eq("equipment_id", equipmentId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(20),

		// Activities
		supabase
			.from("equipment_activities")
			.select("*")
			.eq("equipment_id", equipmentId)
			.order("created_at", { ascending: false })
			.limit(20),

		// Attachments
		supabase
			.from("equipment_attachments")
			.select("*")
			.eq("equipment_id", equipmentId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false })
			.limit(10),
	]);

	// Build equipment data object expected by EquipmentPageContent
	const equipmentData = {
		equipment,
		customer: customer || undefined,
		property: property || undefined,
		servicePlan: servicePlan || undefined,
		installJob: installJob || undefined,
		lastServiceJob: lastServiceJob || undefined,
		upcomingMaintenance: upcomingMaintenance || [],
		serviceHistory: serviceHistory || [],
		notes: notes || [],
		activities: activities || [],
		attachments: attachments || [],
	};

	return (
		<ToolbarActionsProvider actions={<EquipmentDetailToolbarActions />}>
			<EquipmentPageContent entityData={equipmentData} />
		</ToolbarActionsProvider>
	);
}

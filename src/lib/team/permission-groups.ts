/**
 * Permission Groups and Definitions
 *
 * Organized permission system with categories and descriptions
 */

import type { Permission } from "@/lib/auth/permissions";

export type PermissionDefinition = {
	key: Permission;
	label: string;
	description: string;
	category: PermissionCategory;
	critical?: boolean; // Red badge for dangerous permissions
};

export type PermissionCategory =
	| "team"
	| "customers"
	| "jobs"
	| "schedule"
	| "financial"
	| "communication"
	| "reports";

export type PermissionGroup = {
	category: PermissionCategory;
	label: string;
	description: string;
	icon: string;
	permissions: PermissionDefinition[];
};

export const PERMISSION_DEFINITIONS: PermissionDefinition[] = [
	// Team Management
	{
		key: "manage_team",
		label: "Manage Team",
		description: "Add, edit, and remove team members",
		category: "team",
		critical: true,
	},
	{
		key: "delete_team_members",
		label: "Delete Team Members",
		description: "Permanently remove team members",
		category: "team",
		critical: true,
	},

	// Customer Management
	{
		key: "view_customers",
		label: "View Customers",
		description: "Access customer list and details",
		category: "customers",
	},
	{
		key: "delete_customers",
		label: "Delete Customers",
		description: "Permanently delete customer records",
		category: "customers",
		critical: true,
	},

	// Job Management
	{
		key: "view_jobs",
		label: "View Jobs",
		description: "Access job list and details",
		category: "jobs",
	},
	{
		key: "create_jobs",
		label: "Create Jobs",
		description: "Create new job records",
		category: "jobs",
	},
	{
		key: "update_job_status",
		label: "Update Job Status",
		description: "Change job status and progress",
		category: "jobs",
	},
	{
		key: "delete_jobs",
		label: "Delete Jobs",
		description: "Permanently delete job records",
		category: "jobs",
		critical: true,
	},
	{
		key: "approve_estimates",
		label: "Approve Estimates",
		description: "Review and approve customer estimates",
		category: "jobs",
	},
	{
		key: "create_invoices",
		label: "Create Invoices",
		description: "Generate invoices for completed work",
		category: "jobs",
	},
	{
		key: "upload_photos",
		label: "Upload Photos",
		description: "Add photos to job records",
		category: "jobs",
	},

	// Schedule Management
	{
		key: "view_schedule",
		label: "View Schedule",
		description: "Access team schedule and calendar",
		category: "schedule",
	},
	{
		key: "schedule_appointments",
		label: "Schedule Appointments",
		description: "Book and manage appointments",
		category: "schedule",
	},
	{
		key: "manage_schedule",
		label: "Manage Schedule",
		description: "Full schedule editing and coordination",
		category: "schedule",
	},
	{
		key: "dispatch_jobs",
		label: "Dispatch Jobs",
		description: "Assign jobs to technicians",
		category: "schedule",
	},
	{
		key: "view_tech_locations",
		label: "View Tech Locations",
		description: "See real-time technician locations",
		category: "schedule",
	},

	// Financial
	{
		key: "view_reports",
		label: "View Reports",
		description: "Access financial and business reports",
		category: "financial",
	},

	// Communication
	{
		key: "send_communications",
		label: "Send Communications",
		description: "Send emails and SMS to customers",
		category: "communication",
	},
	{
		key: "handle_escalations",
		label: "Handle Escalations",
		description: "Manage customer complaints and issues",
		category: "communication",
	},
];

export const PERMISSION_GROUPS: PermissionGroup[] = [
	{
		category: "team",
		label: "Team Management",
		description: "Control team member access and roles",
		icon: "Users",
		permissions: PERMISSION_DEFINITIONS.filter((p) => p.category === "team"),
	},
	{
		category: "customers",
		label: "Customer Management",
		description: "View and manage customer records",
		icon: "User",
		permissions: PERMISSION_DEFINITIONS.filter((p) => p.category === "customers"),
	},
	{
		category: "jobs",
		label: "Job Management",
		description: "Create and manage work orders",
		icon: "Briefcase",
		permissions: PERMISSION_DEFINITIONS.filter((p) => p.category === "jobs"),
	},
	{
		category: "schedule",
		label: "Schedule & Dispatch",
		description: "Coordinate appointments and assignments",
		icon: "Calendar",
		permissions: PERMISSION_DEFINITIONS.filter((p) => p.category === "schedule"),
	},
	{
		category: "financial",
		label: "Financial & Reports",
		description: "Access business insights and reports",
		icon: "DollarSign",
		permissions: PERMISSION_DEFINITIONS.filter((p) => p.category === "financial"),
	},
	{
		category: "communication",
		label: "Communication",
		description: "Customer communication and support",
		icon: "MessageSquare",
		permissions: PERMISSION_DEFINITIONS.filter((p) => p.category === "communication"),
	},
];

/**
 * Get role preset permissions
 */
export function getRolePreset(role: string): Record<Permission, boolean> | null {
	const presets: Record<string, Record<Permission, boolean>> = {
		owner: {
			manage_team: true,
			delete_team_members: true,
			view_customers: true,
			delete_customers: true,
			view_jobs: true,
			create_jobs: true,
			update_job_status: true,
			delete_jobs: true,
			approve_estimates: true,
			create_invoices: true,
			upload_photos: true,
			view_schedule: true,
			schedule_appointments: true,
			manage_schedule: true,
			dispatch_jobs: true,
			view_tech_locations: true,
			view_reports: true,
			send_communications: true,
			handle_escalations: true,
		},
		admin: {
			manage_team: true,
			delete_team_members: false,
			view_customers: true,
			delete_customers: true,
			view_jobs: true,
			create_jobs: true,
			update_job_status: true,
			delete_jobs: true,
			approve_estimates: true,
			create_invoices: true,
			upload_photos: true,
			view_schedule: true,
			schedule_appointments: true,
			manage_schedule: true,
			dispatch_jobs: true,
			view_tech_locations: true,
			view_reports: true,
			send_communications: true,
			handle_escalations: true,
		},
		manager: {
			manage_team: false,
			delete_team_members: false,
			view_customers: true,
			delete_customers: false,
			view_jobs: true,
			create_jobs: true,
			update_job_status: true,
			delete_jobs: false,
			approve_estimates: true,
			create_invoices: true,
			upload_photos: true,
			view_schedule: true,
			schedule_appointments: true,
			manage_schedule: true,
			dispatch_jobs: true,
			view_tech_locations: true,
			view_reports: true,
			send_communications: true,
			handle_escalations: true,
		},
		dispatcher: {
			manage_team: false,
			delete_team_members: false,
			view_customers: true,
			delete_customers: false,
			view_jobs: true,
			create_jobs: true,
			update_job_status: true,
			delete_jobs: false,
			approve_estimates: false,
			create_invoices: false,
			upload_photos: false,
			view_schedule: true,
			schedule_appointments: true,
			manage_schedule: true,
			dispatch_jobs: true,
			view_tech_locations: true,
			view_reports: false,
			send_communications: true,
			handle_escalations: false,
		},
		technician: {
			manage_team: false,
			delete_team_members: false,
			view_customers: true,
			delete_customers: false,
			view_jobs: true,
			create_jobs: false,
			update_job_status: true,
			delete_jobs: false,
			approve_estimates: false,
			create_invoices: true,
			upload_photos: true,
			view_schedule: true,
			schedule_appointments: false,
			manage_schedule: false,
			dispatch_jobs: false,
			view_tech_locations: false,
			view_reports: false,
			send_communications: false,
			handle_escalations: false,
		},
		csr: {
			manage_team: false,
			delete_team_members: false,
			view_customers: true,
			delete_customers: false,
			view_jobs: true,
			create_jobs: true,
			update_job_status: false,
			delete_jobs: false,
			approve_estimates: false,
			create_invoices: false,
			upload_photos: false,
			view_schedule: true,
			schedule_appointments: true,
			manage_schedule: false,
			dispatch_jobs: false,
			view_tech_locations: false,
			view_reports: false,
			send_communications: true,
			handle_escalations: false,
		},
	};

	return presets[role] || null;
}

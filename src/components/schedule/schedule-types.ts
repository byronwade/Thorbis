// ============================================
// CORE DATA TYPES
// ============================================

export type Address = {
	street: string;
	city: string;
	state: string;
	zip: string;
	country: string;
};

export type Location = {
	address: Address;
	coordinates: {
		lat: number;
		lng: number;
	};
	placeId?: string; // Google Places ID
};

export type Customer = {
	id: string;
	name: string;
	email?: string;
	phone?: string;
	company?: string;
	location: Location;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
};

export type RecurrenceRule = {
	frequency: "daily" | "weekly" | "monthly" | "yearly";
	interval: number; // Every N days/weeks/months/years
	endDate?: Date;
	count?: number; // Stop after N occurrences
	daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
	dayOfMonth?: number; // 1-31
	monthOfYear?: number; // 1-12
};

export type JobMetadata = {
	estimatedDuration?: number; // minutes
	actualDuration?: number; // minutes
	materials?: string[];
	notes?: string;
	internalNotes?: string;
	attachments?: string[]; // URLs
	tags?: string[];
	customFields?: Record<string, any>;
};

export type JobAssignmentRole = "primary" | "assistant" | "crew" | "supervisor";

export type JobAssignment = {
	technicianId: string | null;
	teamMemberId?: string | null;
	displayName: string;
	avatar?: string | null;
	role: JobAssignmentRole;
	status?: Technician["status"];
	isActive: boolean;
};

export type Job = {
	id: string; // Schedule ID
	jobId?: string; // Actual job ID (for linking to job details)
	technicianId: string; // Primary technician id (falls back to first assignment or empty string)
	assignments: JobAssignment[];
	isUnassigned: boolean;

	// Job details
	title: string;
	description?: string;
	customer: Customer;
	location: Location;

	// Scheduling
	startTime: Date;
	endTime: Date;
	allDay?: boolean; // For meetings, events

	// Status
	status: "scheduled" | "dispatched" | "arrived" | "in-progress" | "closed" | "completed" | "cancelled";
	priority: "low" | "medium" | "high" | "urgent";

	// Recurrence
	recurrence?: RecurrenceRule;
	parentJobId?: string; // For recurring job instances

	// Metadata
	metadata: JobMetadata;

	// Audit
	createdAt: Date;
	updatedAt: Date;
	createdBy?: string;
	updatedBy?: string;
};

export type TechnicianSchedule = {
	availableHours: {
		start: number; // 0-23
		end: number; // 0-23
	};
	daysOff: Date[];
	breakTimes?: Array<{
		start: number; // minutes from day start
		end: number;
	}>;
};

export type Technician = {
	id: string;
	userId?: string;
	teamMemberId?: string;
	name: string;
	email?: string;
	phone?: string;
	avatar?: string;
	color?: string;

	// Employment
	role: string;
	department?: string;
	skills?: string[];
	certifications?: string[];

	// Status
	status: "available" | "on-job" | "on-break" | "offline";
	isActive?: boolean;
	currentLocation?: Location;

	// Schedule
	schedule: TechnicianSchedule;

	// Audit
	createdAt: Date;
	updatedAt: Date;
};

// ============================================
// LEGACY COMPATIBILITY (for migration)
// ============================================

/** @deprecated Use Job with Date objects instead */
export type LegacyJob = {
	id: string;
	title: string;
	customer: string;
	startTime: string; // HH:MM format
	endTime: string; // HH:MM format
	status: "scheduled" | "in-progress" | "completed" | "cancelled";
	priority: "low" | "medium" | "high" | "urgent";
	location: string;
	address: string;
	lat: number;
	lng: number;
	description?: string;
	estimatedDuration?: string;
};

// ============================================
// MOCK DATA (Legacy - use generateMockScheduleData instead)
// ============================================

/** @deprecated Use generateMockScheduleData from @/lib/mock-schedule-data instead */
export const mockTechnicians: any[] = [
	{
		id: "1",
		name: "John Doe",
		role: "Senior Technician",
		status: "on-job",
		email: "john.doe@company.com",
		phone: "(555) 123-4567",
		jobs: [
			{
				id: "j1",
				title: "HVAC Maintenance",
				customer: "ABC Corp",
				startTime: "08:00",
				endTime: "10:30",
				status: "completed",
				priority: "medium",
				location: "123 Main St",
				address: "123 Main St, Downtown",
				lat: 40.7128,
				lng: -74.006,
				description: "Annual HVAC system maintenance and inspection",
				estimatedDuration: "2.5 hours",
			},
			{
				id: "j2",
				title: "Emergency Repair",
				customer: "XYZ Inc",
				startTime: "11:00",
				endTime: "14:00",
				status: "in-progress",
				priority: "urgent",
				location: "456 Oak Ave",
				address: "456 Oak Ave, Business District",
				lat: 40.758,
				lng: -73.9855,
				description: "Emergency AC unit repair - not cooling",
				estimatedDuration: "3 hours",
			},
			{
				id: "j3",
				title: "Installation",
				customer: "Tech Solutions",
				startTime: "15:00",
				endTime: "17:30",
				status: "scheduled",
				priority: "high",
				location: "789 Pine Rd",
				address: "789 Pine Rd, Tech Park",
				lat: 40.7489,
				lng: -73.968,
				description: "New HVAC system installation",
				estimatedDuration: "2.5 hours",
			},
		],
	},
	{
		id: "2",
		name: "Jane Smith",
		role: "Field Technician",
		status: "available",
		email: "jane.smith@company.com",
		phone: "(555) 234-5678",
		jobs: [
			{
				id: "j4",
				title: "System Inspection",
				customer: "Global Systems",
				startTime: "09:00",
				endTime: "11:00",
				status: "completed",
				priority: "low",
				location: "321 Elm St",
				address: "321 Elm St, Industrial Zone",
				lat: 40.7614,
				lng: -73.9776,
				description: "Routine system inspection",
				estimatedDuration: "2 hours",
			},
			{
				id: "j5",
				title: "Preventive Maintenance",
				customer: "Local Business",
				startTime: "13:00",
				endTime: "15:00",
				status: "scheduled",
				priority: "medium",
				location: "654 Maple Dr",
				address: "654 Maple Dr, Shopping Center",
				lat: 40.7282,
				lng: -74.0776,
				description: "Scheduled preventive maintenance",
				estimatedDuration: "2 hours",
			},
		],
	},
	{
		id: "3",
		name: "Mike Johnson",
		role: "Senior Technician",
		status: "on-job",
		email: "mike.johnson@company.com",
		phone: "(555) 345-6789",
		jobs: [
			{
				id: "j6",
				title: "Equipment Replacement",
				customer: "Manufacturing Co",
				startTime: "07:30",
				endTime: "12:00",
				status: "in-progress",
				priority: "high",
				location: "987 Industrial Pkwy",
				address: "987 Industrial Pkwy, Factory District",
				lat: 40.6782,
				lng: -73.9442,
				description: "Replace old HVAC equipment",
				estimatedDuration: "4.5 hours",
			},
			{
				id: "j7",
				title: "Follow-up Service",
				customer: "Retail Store",
				startTime: "13:30",
				endTime: "15:30",
				status: "scheduled",
				priority: "low",
				location: "147 Commerce Blvd",
				address: "147 Commerce Blvd, Shopping Mall",
				lat: 40.6892,
				lng: -73.9512,
				description: "Follow-up maintenance check",
				estimatedDuration: "2 hours",
			},
		],
	},
	{
		id: "4",
		name: "Sarah Williams",
		role: "Field Technician",
		status: "on-break",
		email: "sarah.williams@company.com",
		phone: "(555) 456-7890",
		jobs: [
			{
				id: "j8",
				title: "Diagnostic Service",
				customer: "Healthcare Facility",
				startTime: "08:00",
				endTime: "10:00",
				status: "completed",
				priority: "medium",
				location: "258 Medical Center Dr",
				address: "258 Medical Center Dr, Hospital",
				lat: 40.7891,
				lng: -73.9535,
				description: "Diagnostic service for HVAC issues",
				estimatedDuration: "2 hours",
			},
			{
				id: "j9",
				title: "Repair Work",
				customer: "Office Complex",
				startTime: "14:00",
				endTime: "16:00",
				status: "scheduled",
				priority: "medium",
				location: "369 Corporate Way",
				address: "369 Corporate Way, Office Park",
				lat: 40.7549,
				lng: -73.984,
				description: "Repair HVAC system in office building",
				estimatedDuration: "2 hours",
			},
		],
	},
	{
		id: "5",
		name: "David Brown",
		role: "Lead Technician",
		status: "available",
		email: "david.brown@company.com",
		phone: "(555) 567-8901",
		jobs: [
			{
				id: "j10",
				title: "Emergency Call",
				customer: "Restaurant Chain",
				startTime: "10:00",
				endTime: "12:30",
				status: "completed",
				priority: "urgent",
				location: "741 Restaurant Row",
				address: "741 Restaurant Row, Food District",
				lat: 40.7312,
				lng: -74.0025,
				description: "Emergency refrigeration system repair",
				estimatedDuration: "2.5 hours",
			},
		],
	},
	{
		id: "6",
		name: "Emily Davis",
		role: "Field Technician",
		status: "on-job",
		email: "emily.davis@company.com",
		phone: "(555) 678-9012",
		jobs: [
			{
				id: "j11",
				title: "Annual Inspection",
				customer: "Office Building",
				startTime: "07:00",
				endTime: "09:00",
				status: "completed",
				priority: "low",
				location: "852 Business Park",
				address: "852 Business Park, Corporate Center",
				lat: 40.7423,
				lng: -73.9902,
				description: "Annual HVAC system inspection",
				estimatedDuration: "2 hours",
			},
			{
				id: "j12",
				title: "System Upgrade",
				customer: "Tech Startup",
				startTime: "10:00",
				endTime: "13:00",
				status: "in-progress",
				priority: "high",
				location: "963 Innovation Dr",
				address: "963 Innovation Dr, Tech Hub",
				lat: 40.7556,
				lng: -73.9778,
				description: "Upgrade to smart HVAC system",
				estimatedDuration: "3 hours",
			},
			{
				id: "j13",
				title: "Filter Replacement",
				customer: "School District",
				startTime: "14:30",
				endTime: "16:00",
				status: "scheduled",
				priority: "medium",
				location: "159 Education Way",
				address: "159 Education Way, School Campus",
				lat: 40.7634,
				lng: -73.9823,
				description: "Replace air filters in all units",
				estimatedDuration: "1.5 hours",
			},
		],
	},
	{
		id: "7",
		name: "Robert Martinez",
		role: "Senior Technician",
		status: "on-job",
		email: "robert.martinez@company.com",
		phone: "(555) 789-0123",
		jobs: [
			{
				id: "j14",
				title: "Equipment Installation",
				customer: "Factory",
				startTime: "08:30",
				endTime: "11:30",
				status: "in-progress",
				priority: "high",
				location: "159 Industrial Ave",
				address: "159 Industrial Ave, Manufacturing District",
				lat: 40.6956,
				lng: -73.9389,
				description: "Install new industrial HVAC units",
				estimatedDuration: "3 hours",
			},
			{
				id: "j15",
				title: "Maintenance Check",
				customer: "Warehouse",
				startTime: "14:00",
				endTime: "16:30",
				status: "scheduled",
				priority: "medium",
				location: "357 Storage Rd",
				address: "357 Storage Rd, Logistics Center",
				lat: 40.6845,
				lng: -73.9456,
				description: "Quarterly maintenance inspection",
				estimatedDuration: "2.5 hours",
			},
		],
	},
	{
		id: "8",
		name: "Lisa Anderson",
		role: "Field Technician",
		status: "available",
		email: "lisa.anderson@company.com",
		phone: "(555) 890-1234",
		jobs: [
			{
				id: "j16",
				title: "Consultation",
				customer: "New Client",
				startTime: "09:00",
				endTime: "10:00",
				status: "scheduled",
				priority: "low",
				location: "246 Prospect St",
				address: "246 Prospect St, Residential",
				lat: 40.7189,
				lng: -74.0145,
				description: "Initial consultation for new system",
				estimatedDuration: "1 hour",
			},
			{
				id: "j17",
				title: "Installation Project",
				customer: "Retail Chain",
				startTime: "11:00",
				endTime: "15:00",
				status: "scheduled",
				priority: "high",
				location: "468 Commerce Center",
				address: "468 Commerce Center, Mall",
				lat: 40.7267,
				lng: -74.0089,
				description: "Install HVAC in new retail location",
				estimatedDuration: "4 hours",
			},
		],
	},
	{
		id: "9",
		name: "James Wilson",
		role: "Lead Technician",
		status: "on-job",
		email: "james.wilson@company.com",
		phone: "(555) 901-2345",
		jobs: [
			{
				id: "j18",
				title: "Emergency Service",
				customer: "Hospital",
				startTime: "07:00",
				endTime: "10:00",
				status: "completed",
				priority: "urgent",
				location: "579 Medical Plaza",
				address: "579 Medical Plaza, Healthcare District",
				lat: 40.7723,
				lng: -73.9601,
				description: "Critical HVAC system failure",
				estimatedDuration: "3 hours",
			},
			{
				id: "j19",
				title: "Follow-up Visit",
				customer: "Clinic",
				startTime: "11:30",
				endTime: "13:00",
				status: "in-progress",
				priority: "medium",
				location: "680 Health Center",
				address: "680 Health Center, Medical Building",
				lat: 40.7812,
				lng: -73.9689,
				description: "Post-repair system check",
				estimatedDuration: "1.5 hours",
			},
		],
	},
	{
		id: "10",
		name: "Patricia Taylor",
		role: "Field Technician",
		status: "on-break",
		email: "patricia.taylor@company.com",
		phone: "(555) 012-3456",
		jobs: [
			{
				id: "j20",
				title: "Routine Maintenance",
				customer: "School District",
				startTime: "08:00",
				endTime: "11:00",
				status: "completed",
				priority: "medium",
				location: "791 Education Way",
				address: "791 Education Way, High School",
				lat: 40.7445,
				lng: -73.9934,
				description: "Routine maintenance on all units",
				estimatedDuration: "3 hours",
			},
			{
				id: "j21",
				title: "Duct Cleaning",
				customer: "Library",
				startTime: "15:00",
				endTime: "17:00",
				status: "scheduled",
				priority: "low",
				location: "234 Library Lane",
				address: "234 Library Lane, City Center",
				lat: 40.7534,
				lng: -73.9823,
				description: "Air duct cleaning service",
				estimatedDuration: "2 hours",
			},
		],
	},
	{
		id: "11",
		name: "Christopher Moore",
		role: "Senior Technician",
		status: "on-job",
		email: "christopher.moore@company.com",
		phone: "(555) 123-4568",
		jobs: [
			{
				id: "j22",
				title: "System Repair",
				customer: "Data Center",
				startTime: "09:30",
				endTime: "14:00",
				status: "in-progress",
				priority: "urgent",
				location: "802 Server Farm Rd",
				address: "802 Server Farm Rd, Tech Complex",
				lat: 40.7667,
				lng: -73.9712,
				description: "Critical cooling system repair",
				estimatedDuration: "4.5 hours",
			},
			{
				id: "j23",
				title: "Testing",
				customer: "Data Center",
				startTime: "14:30",
				endTime: "16:00",
				status: "scheduled",
				priority: "high",
				location: "802 Server Farm Rd",
				address: "802 Server Farm Rd, Tech Complex",
				lat: 40.7667,
				lng: -73.9712,
				description: "System performance testing",
				estimatedDuration: "1.5 hours",
			},
		],
	},
	{
		id: "12",
		name: "Jennifer Garcia",
		role: "Field Technician",
		status: "available",
		email: "jennifer.garcia@company.com",
		phone: "(555) 234-5679",
		jobs: [
			{
				id: "j24",
				title: "Initial Assessment",
				customer: "Shopping Mall",
				startTime: "10:00",
				endTime: "12:00",
				status: "scheduled",
				priority: "low",
				location: "913 Retail Plaza",
				address: "913 Retail Plaza, Shopping District",
				lat: 40.7378,
				lng: -74.0012,
				description: "Assessment for system upgrade",
				estimatedDuration: "2 hours",
			},
			{
				id: "j25",
				title: "Repair Work",
				customer: "Restaurant",
				startTime: "13:00",
				endTime: "15:00",
				status: "scheduled",
				priority: "medium",
				location: "024 Dining District",
				address: "024 Dining District, Food Avenue",
				lat: 40.7289,
				lng: -74.0067,
				description: "Kitchen ventilation repair",
				estimatedDuration: "2 hours",
			},
			{
				id: "j26",
				title: "Filter Service",
				customer: "Gym",
				startTime: "16:00",
				endTime: "17:00",
				status: "scheduled",
				priority: "low",
				location: "567 Fitness Blvd",
				address: "567 Fitness Blvd, Recreation Center",
				lat: 40.7201,
				lng: -74.0134,
				description: "Replace HVAC filters",
				estimatedDuration: "1 hour",
			},
		],
	},
	{
		id: "13",
		name: "Thomas Martinez",
		role: "Senior Technician",
		status: "on-job",
		email: "thomas.martinez@company.com",
		phone: "(555) 345-6780",
		jobs: [
			{
				id: "j27",
				title: "Major Installation",
				customer: "New Construction Site",
				startTime: "07:00",
				endTime: "12:00",
				status: "in-progress",
				priority: "urgent",
				location: "1024 Builder's Ave",
				address: "1024 Builder's Ave, Construction Zone",
				lat: 40.7456,
				lng: -73.9889,
				description: "Full HVAC system installation for new building",
				estimatedDuration: "5 hours",
			},
			{
				id: "j28",
				title: "Quick Inspection",
				customer: "Retail Store",
				startTime: "13:00",
				endTime: "13:30",
				status: "scheduled",
				priority: "low",
				location: "789 Shop Street",
				address: "789 Shop Street, Downtown",
				lat: 40.7334,
				lng: -73.9956,
				description: "Quick system check",
				estimatedDuration: "30 minutes",
			},
			{
				id: "j29",
				title: "Afternoon Service",
				customer: "Office Building",
				startTime: "14:00",
				endTime: "16:30",
				status: "scheduled",
				priority: "medium",
				location: "445 Business Plaza",
				address: "445 Business Plaza, Financial District",
				lat: 40.7167,
				lng: -73.989,
				description: "Routine maintenance",
				estimatedDuration: "2.5 hours",
			},
		],
	},
	{
		id: "14",
		name: "Nicole Thompson",
		role: "Field Technician",
		status: "available",
		email: "nicole.thompson@company.com",
		phone: "(555) 456-7891",
		jobs: [
			{
				id: "j30",
				title: "Emergency Repair",
				customer: "Hospital Wing",
				startTime: "08:00",
				endTime: "09:30",
				status: "completed",
				priority: "urgent",
				location: "890 Medical Center",
				address: "890 Medical Center, Healthcare District",
				lat: 40.7623,
				lng: -73.9734,
				description: "Critical AC failure in patient wing",
				estimatedDuration: "1.5 hours",
			},
			{
				id: "j31",
				title: "Overlapping Job 1",
				customer: "Mall Complex",
				startTime: "11:00",
				endTime: "13:00",
				status: "scheduled",
				priority: "medium",
				location: "123 Shopping Way",
				address: "123 Shopping Way, Retail District",
				lat: 40.7245,
				lng: -73.9967,
				description: "Zone 1 maintenance",
				estimatedDuration: "2 hours",
			},
			{
				id: "j32",
				title: "Overlapping Job 2",
				customer: "Mall Complex",
				startTime: "11:30",
				endTime: "12:30",
				status: "scheduled",
				priority: "high",
				location: "123 Shopping Way",
				address: "123 Shopping Way, Retail District",
				lat: 40.7245,
				lng: -73.9967,
				description: "Zone 2 maintenance (concurrent)",
				estimatedDuration: "1 hour",
			},
			{
				id: "j33",
				title: "Late Afternoon Call",
				customer: "Restaurant",
				startTime: "16:30",
				endTime: "18:30",
				status: "scheduled",
				priority: "medium",
				location: "567 Dining Ave",
				address: "567 Dining Ave, Restaurant Row",
				lat: 40.7312,
				lng: -73.9945,
				description: "Kitchen ventilation service",
				estimatedDuration: "2 hours",
			},
		],
	},
	{
		id: "15",
		name: "Kevin Rodriguez",
		role: "Lead Technician",
		status: "on-break",
		email: "kevin.rodriguez@company.com",
		phone: "(555) 567-8902",
		jobs: [
			{
				id: "j34",
				title: "Morning Consultation",
				customer: "Tech Startup",
				startTime: "09:00",
				endTime: "10:00",
				status: "completed",
				priority: "low",
				location: "234 Innovation Dr",
				address: "234 Innovation Dr, Tech Park",
				lat: 40.7489,
				lng: -73.9712,
				description: "System upgrade consultation",
				estimatedDuration: "1 hour",
			},
			{
				id: "j35",
				title: "Complex Installation",
				customer: "Corporate HQ",
				startTime: "10:30",
				endTime: "15:30",
				status: "in-progress",
				priority: "high",
				location: "890 Corporate Way",
				address: "890 Corporate Way, Business District",
				lat: 40.7556,
				lng: -73.9801,
				description: "Multi-zone HVAC installation",
				estimatedDuration: "5 hours",
			},
		],
	},
	{
		id: "16",
		name: "Amanda Lee",
		role: "Field Technician",
		status: "available",
		email: "amanda.lee@company.com",
		phone: "(555) 678-9013",
		jobs: [
			{
				id: "j36",
				title: "Quick Fix",
				customer: "Coffee Shop",
				startTime: "07:30",
				endTime: "08:15",
				status: "completed",
				priority: "medium",
				location: "345 Cafe Street",
				address: "345 Cafe Street, Downtown",
				lat: 40.7423,
				lng: -73.9889,
				description: "Thermostat adjustment",
				estimatedDuration: "45 minutes",
			},
			{
				id: "j37",
				title: "Back-to-Back 1",
				customer: "Office A",
				startTime: "09:00",
				endTime: "11:00",
				status: "completed",
				priority: "medium",
				location: "456 Office Park",
				address: "456 Office Park, Business Center",
				lat: 40.7334,
				lng: -73.9923,
				description: "Scheduled maintenance",
				estimatedDuration: "2 hours",
			},
			{
				id: "j38",
				title: "Back-to-Back 2",
				customer: "Office B",
				startTime: "11:00",
				endTime: "13:00",
				status: "in-progress",
				priority: "medium",
				location: "457 Office Park",
				address: "457 Office Park, Business Center",
				lat: 40.7335,
				lng: -73.9924,
				description: "Scheduled maintenance",
				estimatedDuration: "2 hours",
			},
			{
				id: "j39",
				title: "Afternoon Emergency",
				customer: "Grocery Store",
				startTime: "14:30",
				endTime: "17:00",
				status: "scheduled",
				priority: "urgent",
				location: "678 Market Street",
				address: "678 Market Street, Shopping District",
				lat: 40.7267,
				lng: -73.9978,
				description: "Refrigeration system failure",
				estimatedDuration: "2.5 hours",
			},
		],
	},
	{
		id: "17",
		name: "Brian Clark",
		role: "Senior Technician",
		status: "on-job",
		email: "brian.clark@company.com",
		phone: "(555) 789-0124",
		jobs: [
			{
				id: "j40",
				title: "All Day Project",
				customer: "Industrial Facility",
				startTime: "07:00",
				endTime: "18:00",
				status: "in-progress",
				priority: "high",
				location: "1200 Factory Blvd",
				address: "1200 Factory Blvd, Industrial Zone",
				lat: 40.6956,
				lng: -73.9412,
				description: "Complete system overhaul",
				estimatedDuration: "11 hours",
			},
		],
	},
	{
		id: "18",
		name: "Rachel White",
		role: "Field Technician",
		status: "available",
		email: "rachel.white@company.com",
		phone: "(555) 890-1235",
		jobs: [
			{
				id: "j41",
				title: "Short Call",
				customer: "Apartment Complex",
				startTime: "08:30",
				endTime: "09:00",
				status: "completed",
				priority: "low",
				location: "789 Resident Dr",
				address: "789 Resident Dr, Residential Area",
				lat: 40.7189,
				lng: -73.9956,
				description: "Quick filter check",
				estimatedDuration: "30 minutes",
			},
			{
				id: "j42",
				title: "Mid-Morning Service",
				customer: "Dental Office",
				startTime: "10:00",
				endTime: "11:30",
				status: "completed",
				priority: "medium",
				location: "234 Health Plaza",
				address: "234 Health Plaza, Medical District",
				lat: 40.7723,
				lng: -73.9634,
				description: "AC maintenance",
				estimatedDuration: "1.5 hours",
			},
			{
				id: "j43",
				title: "Gap Before Lunch",
				customer: "Law Office",
				startTime: "13:30",
				endTime: "15:00",
				status: "scheduled",
				priority: "low",
				location: "890 Legal Way",
				address: "890 Legal Way, Professional Center",
				lat: 40.7445,
				lng: -73.9867,
				description: "Routine inspection",
				estimatedDuration: "1.5 hours",
			},
			{
				id: "j44",
				title: "End of Day",
				customer: "Retail Chain",
				startTime: "17:00",
				endTime: "18:30",
				status: "scheduled",
				priority: "medium",
				location: "456 Store Front",
				address: "456 Store Front, Shopping Mall",
				lat: 40.7378,
				lng: -73.9934,
				description: "Post-hours maintenance",
				estimatedDuration: "1.5 hours",
			},
		],
	},
	{
		id: "19",
		name: "Daniel Harris",
		role: "Lead Technician",
		status: "offline",
		email: "daniel.harris@company.com",
		phone: "(555) 901-2346",
		jobs: [],
	},
	{
		id: "20",
		name: "Michelle Young",
		role: "Field Technician",
		status: "available",
		email: "michelle.young@company.com",
		phone: "(555) 012-3457",
		jobs: [
			{
				id: "j45",
				title: "Early Bird Special",
				customer: "Bakery",
				startTime: "07:00",
				endTime: "08:00",
				status: "completed",
				priority: "high",
				location: "123 Bread Street",
				address: "123 Bread Street, Downtown",
				lat: 40.7312,
				lng: -73.9912,
				description: "Urgent AC repair before opening",
				estimatedDuration: "1 hour",
			},
			{
				id: "j46",
				title: "Triple Overlap 1",
				customer: "School District",
				startTime: "09:00",
				endTime: "12:00",
				status: "in-progress",
				priority: "medium",
				location: "567 Education Way",
				address: "567 Education Way, School Campus",
				lat: 40.7634,
				lng: -73.9845,
				description: "Building A maintenance",
				estimatedDuration: "3 hours",
			},
			{
				id: "j47",
				title: "Triple Overlap 2",
				customer: "School District",
				startTime: "10:00",
				endTime: "11:00",
				status: "in-progress",
				priority: "high",
				location: "567 Education Way",
				address: "567 Education Way, School Campus",
				lat: 40.7634,
				lng: -73.9845,
				description: "Building B urgent fix",
				estimatedDuration: "1 hour",
			},
			{
				id: "j48",
				title: "Triple Overlap 3",
				customer: "School District",
				startTime: "10:30",
				endTime: "12:30",
				status: "scheduled",
				priority: "medium",
				location: "567 Education Way",
				address: "567 Education Way, School Campus",
				lat: 40.7634,
				lng: -73.9845,
				description: "Building C inspection",
				estimatedDuration: "2 hours",
			},
			{
				id: "j49",
				title: "Late Afternoon",
				customer: "Gym Chain",
				startTime: "15:00",
				endTime: "17:30",
				status: "scheduled",
				priority: "low",
				location: "890 Fitness Center",
				address: "890 Fitness Center, Recreation Complex",
				lat: 40.7201,
				lng: -73.9967,
				description: "Annual maintenance",
				estimatedDuration: "2.5 hours",
			},
		],
	},
];

/**
 * Customer Tracking Link Types
 *
 * Types for the customer-facing appointment tracking system
 */

export type TrackingLinkStatus =
	| "pending"
	| "active"
	| "arrived"
	| "completed"
	| "cancelled"
	| "expired";

export type TrackingLink = {
	id: string;
	token: string; // Unique URL-safe token
	appointmentId: string;
	jobId?: string;
	customerId: string;
	companyId: string;

	// Technician info (limited for privacy)
	technicianId: string;
	technicianName: string;
	technicianPhoto?: string;

	// Appointment details
	appointmentDate: Date;
	scheduledStartTime: Date;
	scheduledEndTime: Date;
	estimatedArrival?: Date;

	// Location (customer's location, not tech's for privacy)
	customerAddress: {
		street: string;
		city: string;
		state: string;
		zip: string;
	};

	// Status
	status: TrackingLinkStatus;
	technicianStatus?: "en-route" | "arriving-soon" | "arrived" | "working";

	// ETA info (updated in real-time)
	currentEtaMinutes?: number;
	lastEtaUpdate?: Date;
	distanceRemainingMiles?: number;

	// Privacy settings
	showTechnicianLocation: boolean; // Company can disable
	showTechnicianPhoto: boolean;

	// Lifecycle
	createdAt: Date;
	expiresAt: Date;
	viewCount: number;
	lastViewedAt?: Date;
};

export type TrackingLinkCreateInput = {
	appointmentId: string;
	jobId?: string;
	customerId: string;
	companyId: string;
	technicianId: string;
	scheduledStartTime: Date;
	scheduledEndTime: Date;
	customerAddress: {
		street: string;
		city: string;
		state: string;
		zip: string;
	};
	expiresInHours?: number; // Default 24 hours
	showTechnicianLocation?: boolean; // Default true
	showTechnicianPhoto?: boolean; // Default true
};

export type TrackingLinkPublicView = {
	token: string;
	status: TrackingLinkStatus;

	// Business info
	companyName: string;
	companyLogo?: string;
	companyPhone?: string;

	// Technician (limited)
	technicianName: string;
	technicianPhoto?: string;
	technicianStatus?: "en-route" | "arriving-soon" | "arrived" | "working";

	// Appointment
	appointmentDate: string; // Formatted date
	scheduledWindow: string; // e.g., "9:00 AM - 11:00 AM"
	serviceType?: string;

	// ETA
	estimatedArrival?: string; // Formatted time
	etaMinutes?: number;
	distanceRemainingMiles?: number;

	// Location (privacy-controlled)
	technicianLocation?: {
		lat: number;
		lng: number;
	};

	// Messages
	statusMessage: string; // e.g., "John is on his way!"
	lastUpdate: string; // Formatted timestamp
};

export type CustomerTrackingNotification = {
	type:
		| "link-created"
		| "tech-dispatched"
		| "tech-en-route"
		| "tech-arriving-soon"
		| "tech-arrived"
		| "job-completed";
	channel: "sms" | "email" | "push";
	recipientPhone?: string;
	recipientEmail?: string;
	trackingUrl: string;
	message: string;
};

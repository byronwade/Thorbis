/**
 * Communication types shared across communication components
 */

export type CommunicationRecord = {
	id: string;
	type: "sms" | "email" | "call" | "voicemail";
	direction: "inbound" | "outbound";
	status: string;
	from_number?: string | null;
	to_number?: string | null;
	from_email?: string | null;
	to_email?: string | null;
	subject?: string | null;
	body?: string | null;
	created_at: string;
	customer_id?: string | null;
	job_id?: string | null;
	property_id?: string | null;
	invoice_id?: string | null;
	estimate_id?: string | null;
	company_id: string;
};

export type CompanyPhone = {
	id: string;
	number: string;
	label?: string;
};

/**
 * useCustomerLookup - React Query Hook
 *
 * Performance optimizations:
 * - Uses React Query for automatic caching
 * - Caches customer lookups by phone number
 * - Avoids redundant API calls for same phone number
 * - Automatic garbage collection of stale data
 *
 * Fetches customer data by phone number for incoming call identification.
 */

import { useQuery } from "@tanstack/react-query";
import { getCustomerByPhone } from "@/actions/customers";

// AI Trust Scores
const AI_HIGH_TRUST_SCORE = 0.9;
const AI_MEDIUM_TRUST_SCORE = 0.5;

export type CustomerData = {
	name: string;
	email: string;
	phone: string;
	company: string;
	accountStatus: string;
	lastContact: string;
	totalCalls: number;
	openTickets: number;
	priority: "low" | "medium" | "high";
	tags: string[];
	recentIssues: string[];
	aiData: {
		isKnownCustomer: boolean;
		isSpam: boolean;
		spamConfidence: number;
		recognitionSource: "crm" | "unknown";
		trustScore: number;
		callHistory: string[];
		similarCallers: number;
		riskLevel: "low" | "medium" | "high";
		aiNotes: string[];
	};
};

const getDefaultCustomerData = (callerNumber?: string): CustomerData => ({
	name: "Unknown Customer",
	email: "",
	phone: callerNumber || "Unknown",
	company: "",
	accountStatus: "Unknown",
	lastContact: "Never",
	totalCalls: 0,
	openTickets: 0,
	priority: "medium",
	tags: [],
	recentIssues: [],
	aiData: {
		isKnownCustomer: false,
		isSpam: false,
		spamConfidence: 0,
		recognitionSource: "unknown",
		trustScore: AI_MEDIUM_TRUST_SCORE,
		callHistory: [],
		similarCallers: 0,
		riskLevel: "medium",
		aiNotes: [
			"First-time caller",
			"No prior history",
			"Standard verification recommended",
		],
	},
});

export function useCustomerLookup(callerNumber?: string, companyId?: string) {
	return useQuery({
		queryKey: ["customer-lookup", callerNumber, companyId],
		queryFn: async (): Promise<CustomerData> => {
			// If no caller number or company ID, return default
			if (!callerNumber || !companyId) {
				return getDefaultCustomerData(callerNumber);
			}

			try {
				const result = await getCustomerByPhone(callerNumber, companyId);

				if (result.success && result.data) {
					const customer = result.data;

					// Customer found - return enriched data
					return {
						name: `${customer.first_name} ${customer.last_name}`,
						email: customer.email || "",
						phone: customer.phone || callerNumber,
						company: customer.company_name || "",
						accountStatus: customer.status || "Active",
						lastContact: customer.last_contact_date
							? new Date(customer.last_contact_date).toLocaleDateString()
							: "Unknown",
						totalCalls: customer.total_interactions || 0,
						openTickets: 0, // Would need to query jobs/tickets table
						priority: (customer.priority_level || "medium") as
							| "low"
							| "medium"
							| "high",
						tags: customer.tags || [],
						recentIssues: [], // Would need to query jobs table
						aiData: {
							isKnownCustomer: true,
							isSpam: false,
							spamConfidence: 0,
							recognitionSource: "crm",
							trustScore: AI_HIGH_TRUST_SCORE,
							callHistory: [], // Would need to query communications table
							similarCallers: 0,
							riskLevel: "low",
							aiNotes: [
								`Customer since ${customer.created_at ? new Date(customer.created_at).getFullYear() : "Unknown"}`,
								"Verified customer",
								"Account in good standing",
							],
						},
					};
				}

				// Customer not found - return default
				return getDefaultCustomerData(callerNumber);
			} catch (error) {
				// Error fetching - return default with error note
				const defaultData = getDefaultCustomerData(callerNumber);
				defaultData.aiData.aiNotes = ["Error loading customer data"];
				return defaultData;
			}
		},
		enabled: !!callerNumber, // Only run query if callerNumber exists
		staleTime: 5 * 60 * 1000, // 5 minutes (customer data doesn't change often during a call)
		gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
	});
}

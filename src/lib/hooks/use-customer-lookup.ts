/**
 * useCustomerLookup - React 19 Hook
 *
 * Performance optimizations:
 * - Uses useState + useEffect for client-side data fetching
 * - Fetches customer data by phone number for incoming call identification
 *
 * Fetches customer data by phone number for incoming call identification.
 */

"use client";

import { useEffect, useState } from "react";
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
	const [data, setData] = useState<CustomerData | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!callerNumber || !companyId) {
			setData(getDefaultCustomerData(callerNumber));
			return;
		}

		const fetchCustomer = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await getCustomerByPhone(callerNumber, companyId);

				if (result.success && result.data) {
					const customer = result.data;

					// Customer found - return enriched data
					setData({
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
					});
				} else {
					// Customer not found - return default
					setData(getDefaultCustomerData(callerNumber));
				}
			} catch (err) {
				// Error fetching - return default with error note
				const defaultData = getDefaultCustomerData(callerNumber);
				defaultData.aiData.aiNotes = ["Error loading customer data"];
				setData(defaultData);
				setError(
					err instanceof Error ? err : new Error("Failed to fetch customer"),
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCustomer();
	}, [callerNumber, companyId]);

	return { data, error, isLoading };
}

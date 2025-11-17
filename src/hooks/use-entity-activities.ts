/**
 * Generic Entity Activities Hook - On-Demand Loading
 *
 * Universal hook for fetching activities for any entity type.
 * Supports all entity types: payment, invoice, estimate, contract, job,
 * customer, property, equipment, etc.
 *
 * Usage:
 * const { data, isLoading } = useEntityActivities("payment", paymentId, isTabActive);
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

type EntityType =
	| "payment"
	| "invoice"
	| "estimate"
	| "contract"
	| "job"
	| "customer"
	| "property"
	| "equipment"
	| "purchase_order"
	| "service_agreement"
	| "maintenance_plan"
	| "appointment"
	| "vendor"
	| "material";

export function useEntityActivities(
	entityType: EntityType,
	entityId: string,
	enabled = true,
	limit = 50
) {
	return useQuery({
		queryKey: ["entity-activities", entityType, entityId],
		queryFn: async () => {
			const supabase = createClient();

			const { data, error } = await supabase
				.from("activity_log")
				.select("*, user:users!user_id(*)")
				.eq("entity_type", entityType)
				.eq("entity_id", entityId)
				.order("created_at", { ascending: false })
				.limit(limit);

			if (error) throw error;
			return data;
		},
		enabled, // Only fetch when tab is opened
		staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
		gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
	});
}

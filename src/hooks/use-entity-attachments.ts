/**
 * Generic Entity Attachments Hook - On-Demand Loading
 *
 * Universal hook for fetching attachments for any entity type.
 * Supports all entity types: payment, invoice, estimate, contract, job,
 * customer, property, equipment, etc.
 *
 * Usage:
 * const { data, isLoading } = useEntityAttachments("contract", contractId, isTabActive);
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

export function useEntityAttachments(entityType: EntityType, entityId: string, enabled = true) {
	return useQuery({
		queryKey: ["entity-attachments", entityType, entityId],
		queryFn: async () => {
			const supabase = createClient();

			const { data, error } = await supabase
				.from("attachments")
				.select("*")
				.eq("entity_type", entityType)
				.eq("entity_id", entityId)
				.order("created_at", { ascending: false });

			if (error) throw error;
			return data;
		},
		enabled, // Only fetch when tab is opened
		staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
		gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
	});
}

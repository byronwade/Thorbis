/**
 * Generic Entity Notes Hook - On-Demand Loading
 *
 * Universal hook for fetching notes for any entity type.
 * Supports all entity types: payment, invoice, estimate, contract, job,
 * customer, property, equipment, etc.
 *
 * Usage:
 * const { data, isLoading } = useEntityNotes("invoice", invoiceId, isTabActive);
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

export function useEntityNotes(
	entityType: EntityType,
	entityId: string,
	enabled = true,
) {
	return useQuery({
		queryKey: ["entity-notes", entityType, entityId],
		queryFn: async () => {
			const supabase = createClient();

			const { data, error } = await supabase
				.from("notes")
				.select("*")
				.eq("entity_type", entityType)
				.eq("entity_id", entityId)
				.is("deleted_at", null)
				.order("created_at", { ascending: false});

			if (error) throw error;
			return data;
		},
		enabled, // Only fetch when tab is opened
		staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
		gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
	});
}

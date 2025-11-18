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

import { useEffect, useState } from "react";
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

type Note = {
	id: string;
	entity_type: string;
	entity_id: string;
	content: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	user_id: string;
	company_id: string;
};

export function useEntityNotes(
	entityType: EntityType,
	entityId: string,
	enabled = true,
) {
	const [data, setData] = useState<Note[] | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!enabled) {
			return;
		}

		const fetchNotes = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const supabase = createClient();

				const { data: notes, error: fetchError } = await supabase
					.from("notes")
					.select("*")
					.eq("entity_type", entityType)
					.eq("entity_id", entityId)
					.is("deleted_at", null)
					.order("created_at", { ascending: false });

				if (fetchError) throw fetchError;
				setData(notes);
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error("Failed to fetch notes"),
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchNotes();
	}, [entityType, entityId, enabled]);

	return { data, error, isLoading };
}

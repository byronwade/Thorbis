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

type Attachment = {
	id: string;
	entity_type: string;
	entity_id: string;
	file_name: string;
	file_url: string;
	file_type: string;
	file_size: number;
	created_at: string;
	updated_at: string;
};

export function useEntityAttachments(
	entityType: EntityType,
	entityId: string,
	enabled = true,
) {
	const [data, setData] = useState<Attachment[] | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!enabled) {
			return;
		}

		const fetchAttachments = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const supabase = createClient();

				const { data: attachments, error: fetchError } = await supabase
					.from("attachments")
					.select("*")
					.eq("entity_type", entityType)
					.eq("entity_id", entityId)
					.order("created_at", { ascending: false });

				if (fetchError) throw fetchError;
				setData(attachments);
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error("Failed to fetch attachments"),
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAttachments();
	}, [entityType, entityId, enabled]);

	return { data, error, isLoading };
}

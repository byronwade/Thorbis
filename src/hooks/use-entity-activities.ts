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

type Activity = {
	id: string;
	entity_type: string;
	entity_id: string;
	action: string;
	created_at: string;
	updated_at: string;
	user_id: string;
	user: any;
};

export function useEntityActivities(
	entityType: EntityType,
	entityId: string,
	enabled = true,
	limit = 50,
) {
	const [data, setData] = useState<Activity[] | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!enabled) {
			return;
		}

		const fetchActivities = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const supabase = createClient();

				const { data: activities, error: fetchError } = await supabase
					.from("activity_log")
					.select("*, user:users!user_id(*)")
					.eq("entity_type", entityType)
					.eq("entity_id", entityId)
					.order("created_at", { ascending: false })
					.limit(limit);

				if (fetchError) throw fetchError;
				setData(activities);
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error("Failed to fetch activities"),
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchActivities();
	}, [entityType, entityId, enabled, limit]);

	return { data, error, isLoading };
}

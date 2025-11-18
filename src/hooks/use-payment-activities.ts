/**
 * Payment Activities Hook - On-Demand Loading
 *
 * This hook fetches activities ONLY when the user opens the Activity tab.
 * Uses useState + useEffect for client-side data fetching.
 */

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

export function usePaymentActivities(paymentId: string, enabled = true) {
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
					.eq("entity_type", "payment")
					.eq("entity_id", paymentId)
					.order("created_at", { ascending: false })
					.limit(50);

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
	}, [paymentId, enabled]);

	return { data, error, isLoading };
}

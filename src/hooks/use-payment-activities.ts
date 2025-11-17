/**
 * Payment Activities Hook - On-Demand Loading
 *
 * This hook fetches activities ONLY when the user opens the Activity tab.
 * Uses React Query for caching and automatic refetching.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function usePaymentActivities(paymentId: string, enabled = true) {
	return useQuery({
		queryKey: ["payment-activities", paymentId],
		queryFn: async () => {
			const supabase = createClient();

			const { data, error } = await supabase
				.from("activity_log")
				.select("*, user:users!user_id(*)")
				.eq("entity_type", "payment")
				.eq("entity_id", paymentId)
				.order("created_at", { ascending: false })
				.limit(50);

			if (error) throw error;
			return data;
		},
		enabled, // Only fetch when tab is opened
		staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
		gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
	});
}

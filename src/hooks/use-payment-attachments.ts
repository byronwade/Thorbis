/**
 * Payment Attachments Hook - On-Demand Loading
 *
 * This hook fetches attachments ONLY when the user opens the Attachments tab.
 * Uses useState + useEffect for client-side data fetching.
 */

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

export function usePaymentAttachments(paymentId: string, enabled = true) {
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
					.eq("entity_type", "payment")
					.eq("entity_id", paymentId)
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
	}, [paymentId, enabled]);

	return { data, error, isLoading };
}

/**
 * Payment Notes Hook - On-Demand Loading
 *
 * This hook fetches notes ONLY when the user opens the Notes tab.
 * Uses useState + useEffect for client-side data fetching.
 */

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

export function usePaymentNotes(paymentId: string, enabled = true) {
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
					.eq("entity_type", "payment")
					.eq("entity_id", paymentId)
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
	}, [paymentId, enabled]);

	return { data, error, isLoading };
}

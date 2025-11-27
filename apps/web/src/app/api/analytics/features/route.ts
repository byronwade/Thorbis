/**
 * API Route: Feature Usage Analytics
 *
 * Receives batched feature usage events from the client-side tracker.
 * Stores events in the feature_usage and page views in search_analytics tables.
 */

import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

interface FeatureEvent {
	featureName: string;
	category: string;
	action: string;
	metadata?: Record<string, unknown>;
	timestamp: number;
}

interface PageViewEvent {
	path: string;
	referrer: string | null;
	duration: number | null;
	timestamp: number;
}

interface QueuedEvent {
	type: "feature" | "pageView";
	data: FeatureEvent | PageViewEvent;
	sessionId: string;
	timestamp: number;
}

interface RequestBody {
	events: QueuedEvent[];
}

export async function POST(request: Request) {
	try {
		// Get user context
		const supabase = await createClient();
		let userId: string | null = null;
		let companyId: string | null = null;

		if (supabase) {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (user) {
				userId = user.id;
				companyId =
					(user.user_metadata?.company_id as string) ||
					(user.app_metadata?.company_id as string) ||
					null;
			}
		}

		// Parse request body
		const body: RequestBody = await request.json();
		const { events } = body;

		if (!events || !Array.isArray(events) || events.length === 0) {
			return NextResponse.json(
				{ error: "No events provided" },
				{ status: 400 },
			);
		}

		// Use service client for inserts
		const serviceClient = createServiceSupabaseClient();

		// Separate feature events and page views
		const featureEvents = events.filter((e) => e.type === "feature");
		const pageViewEvents = events.filter((e) => e.type === "pageView");

		// Insert feature events
		if (featureEvents.length > 0) {
			const featureRecords = featureEvents.map((event) => {
				const data = event.data as FeatureEvent;
				return {
					company_id: companyId,
					user_id: userId,
					session_id: event.sessionId,
					feature_name: data.featureName,
					feature_category: data.category,
					action_type: data.action,
					metadata: data.metadata || null,
					created_at: new Date(event.timestamp).toISOString(),
				};
			});

			const { error: featureError } = await serviceClient
				.from("feature_usage")
				.insert(featureRecords);

			if (featureError) {
				console.error(
					"[Feature Analytics] Failed to insert feature events:",
					featureError.message,
				);
			}
		}

		// Insert page view events (using search_analytics for now, or could create separate table)
		if (pageViewEvents.length > 0) {
			const pageViewRecords = pageViewEvents.map((event) => {
				const data = event.data as PageViewEvent;
				return {
					company_id: companyId,
					user_id: userId,
					session_id: event.sessionId,
					search_query: data.path, // Using search_query field for path
					search_type: "page_view",
					result_count: data.duration ? 1 : 0, // Using result_count for whether duration was tracked
					selected_result_index: null,
					selected_result_type: data.referrer, // Using for referrer
					search_latency_ms: data.duration || 0,
					created_at: new Date(event.timestamp).toISOString(),
				};
			});

			const { error: pageViewError } = await serviceClient
				.from("search_analytics")
				.insert(pageViewRecords);

			if (pageViewError) {
				console.error(
					"[Feature Analytics] Failed to insert page views:",
					pageViewError.message,
				);
			}
		}

		return NextResponse.json({
			success: true,
			processed: {
				features: featureEvents.length,
				pageViews: pageViewEvents.length,
			},
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		console.error("[Feature Analytics] Error:", message);
		return NextResponse.json(
			{ error: "Failed to process events", details: message },
			{ status: 500 },
		);
	}
}

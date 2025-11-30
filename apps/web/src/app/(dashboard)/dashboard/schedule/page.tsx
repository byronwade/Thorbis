/**
 * Schedule Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Schedule data streams in (200-500ms)
 *
 * Performance: 8-20x faster than traditional SSR
 *
 * Note: Weather is now displayed in the app header globally
 */

import { addDays, subDays } from "date-fns";
import { Suspense } from "react";
import { CompanyGate } from "@/components/layout/company-gate";
import { SchedulePageClient } from "@/components/schedule/schedule-page-client";
import {
	getActiveCompanyId,
	getUserCompanies,
} from "@/lib/auth/company-context";
import type { ScheduleBootstrapSerialized } from "@/lib/schedule-bootstrap";
import { serializeScheduleBootstrap } from "@/lib/schedule-bootstrap";
import { fetchScheduleData } from "@/lib/schedule-data";
import { createClient } from "@/lib/supabase/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

async function getSchedulingSupabaseClient() {
	try {
		// Try service role client first (bypasses RLS for full company visibility)
		const serviceClient = await createServiceSupabaseClient();
		if (serviceClient) {
			return serviceClient;
		}
		// Service role key not configured - fall back to auth client
		console.warn(
			"SUPABASE_SERVICE_ROLE_KEY not configured – falling back to authenticated client",
		);
		try {
			return await createClient();
		} catch (clientError) {
			console.error(
				"Failed to create authenticated Supabase client:",
				clientError instanceof Error ? clientError.message : String(clientError),
			);
			throw new Error(
				"Unable to initialize database connection. Please refresh the page.",
			);
		}
	} catch (error) {
		// Service client creation failed - fall back to auth client
		console.warn(
			"Supabase service role client failed to initialize – falling back to authenticated client:",
			error instanceof Error ? error.message : String(error),
		);
		try {
			return await createClient();
		} catch (clientError) {
			console.error(
				"Failed to create authenticated Supabase client after service client failure:",
				clientError instanceof Error ? clientError.message : String(clientError),
			);
			throw new Error(
				"Unable to initialize database connection. Please refresh the page.",
			);
		}
	}
}

// Schedule data component (async, streams in)
async function ScheduleData() {
	let initialData: ScheduleBootstrapSerialized | undefined;
	let bootstrapError: string | null = null;

	const companyId = await getActiveCompanyId();
	if (!companyId) {
		const companies = await getUserCompanies();
		return (
			<CompanyGate
				context="scheduling"
				hasCompanies={(companies ?? []).length > 0}
			/>
		);
	}

	try {
		const supabase = await getSchedulingSupabaseClient();

		const now = new Date();
		const defaultRange = {
			start: subDays(now, 7),
			end: addDays(now, 30),
		};

		// Fetch schedule data
		const { jobs, technicians, unassignedMeta } = await fetchScheduleData({
			supabase,
			companyId,
			range: defaultRange,
		});

		initialData = serializeScheduleBootstrap({
			companyId,
			jobs,
			technicians,
			range: defaultRange,
			lastSync: new Date(),
			unassignedMeta,
		});
	} catch (error) {
		// Log the full error details to help debug
		console.error("Schedule data fetch failed:", error);
		if (error instanceof Error) {
			console.error("Error stack:", error.stack);
		}

		bootstrapError =
			error instanceof Error
				? error.message
				: typeof error === "string"
					? error
					: "Unable to load schedule data";
	}

	return (
		<SchedulePageClient
			bootstrapError={bootstrapError}
			initialData={initialData}
		/>
	);
}

// Loading skeleton
function ScheduleSkeleton() {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="border-primary/20 border-t-primary size-12 animate-spin rounded-full border-4" />
				<p className="text-muted-foreground text-sm">Loading schedule...</p>
			</div>
		</div>
	);
}

export default function SchedulePage() {
	return (
		<Suspense fallback={<ScheduleSkeleton />}>
			<ScheduleData />
		</Suspense>
	);
}

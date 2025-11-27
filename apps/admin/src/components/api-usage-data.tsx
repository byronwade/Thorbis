/**
 * Server Component wrapper for ApiUsageSection
 * Fetches usage data from the database and passes to client component
 */

import { ApiUsageSection } from "./api-usage-section";
import { getAggregatedApiUsage } from "@web/lib/api/api-usage-queries";

export async function ApiUsageData() {
	// Fetch aggregated API usage from database
	const aggregatedUsage = await getAggregatedApiUsage();

	return <ApiUsageSection aggregatedUsage={aggregatedUsage} />;
}

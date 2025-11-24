/**
 * Speculation Rules Component
 *
 * Adds browser prefetching/prerendering rules for instant navigation.
 * Only affects Chromium browsers - safely ignored by others.
 */

import Script from "next/script";
import { getSpeculationRulesScript } from "@/lib/seo/speculation-rules";

export function SpeculationRules() {
	return (
		<Script
			id="speculation-rules"
			type="speculationrules"
			dangerouslySetInnerHTML={{
				__html: getSpeculationRulesScript(),
			}}
		/>
	);
}

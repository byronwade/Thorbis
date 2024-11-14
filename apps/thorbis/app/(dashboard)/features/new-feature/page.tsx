import { Suspense } from "react";
import { getFeatureFlag } from "@/thorbis/lib/edge-config";

export default async function NewFeaturePage() {
	const isEnabled = await getFeatureFlag("new_feature");

	if (!isEnabled) {
		return <div>Feature not available</div>;
	}

	return <Suspense fallback={<div>Loading...</div>}>{/* Feature content */}</Suspense>;
}

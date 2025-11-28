import { getActiveCompanyId } from "@stratos/auth/company-context";
import { Suspense } from "react";
import { DispatchMapSkeleton } from "@/components/schedule/dispatch-map/map-skeleton";
import { createClient } from "@/lib/supabase/server";
import { fetchDispatchMapData } from "@/lib/dispatch-map-data";
import { DispatchMapView } from "./dispatch-map-view";

export const metadata = {
	title: "Dispatch Map - Live Fleet View",
	description: "Real-time map view of all technicians and jobs",
};

async function DispatchMapData() {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	if (!companyId) {
		return (
			<div className="flex h-full items-center justify-center">
				<p>Please sign in to view the dispatch map</p>
			</div>
		);
	}

	try {
		const mapData = await fetchDispatchMapData(supabase, companyId);

		return <DispatchMapView {...mapData} />;
	} catch (error) {
		return (
			<div className="flex h-full items-center justify-center">
				<p>
					{error instanceof Error
						? error.message
						: "Unable to load the dispatch map."}
				</p>
			</div>
		);
	}
}

export default function DispatchMapPage() {
	return (
		<div className="h-[calc(100vh-4rem)] w-full overflow-hidden">
			<Suspense fallback={<DispatchMapSkeleton />}>
				<DispatchMapData />
			</Suspense>
		</div>
	);
}

import { Suspense } from "react";
import { WebsitesList } from "@/thorbis/components/dashboard/websites-list";

export default function WebsitesPage() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Websites</h1>
			<Suspense fallback={<div>Loading websites...</div>}>
				<WebsitesList />
			</Suspense>
		</div>
	);
}

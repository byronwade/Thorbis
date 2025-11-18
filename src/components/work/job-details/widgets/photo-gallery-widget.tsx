import { ImageIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PhotoGalleryWidget({
	photos,
	jobId,
}: {
	photos: unknown[];
	jobId: string;
}) {
	return (
		<div className="space-y-3">
			<p className="text-sm">
				{photos.length} photo{photos.length !== 1 ? "s" : ""}
			</p>
			<Button asChild className="w-full" size="sm" variant="outline">
				<Link href={`/dashboard/work/${jobId}#photo-gallery`}>
					<ImageIcon className="mr-2 size-4" />
					View Gallery
				</Link>
			</Button>
		</div>
	);
}

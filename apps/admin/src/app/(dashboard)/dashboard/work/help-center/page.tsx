import { HelpCircle, FileText, Video, MessageSquare } from "lucide-react";
import Link from "next/link";

/**
 * Help Center Page
 */
export default function HelpCenterPage() {
	return (
		<div className="p-6">
			<div className="mb-8">
				<h1 className="text-2xl font-bold tracking-tight">Help Center</h1>
				<p className="text-muted-foreground">
					Manage help documentation and resources
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<div className="flex items-start gap-4 rounded-lg border bg-card p-6">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<FileText className="size-5 text-primary" />
					</div>
					<div>
						<h3 className="font-medium">Documentation</h3>
						<p className="text-sm text-muted-foreground">
							Manage help articles and guides
						</p>
						<p className="mt-2 text-xs text-muted-foreground">-- articles</p>
					</div>
				</div>

				<div className="flex items-start gap-4 rounded-lg border bg-card p-6">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<Video className="size-5 text-primary" />
					</div>
					<div>
						<h3 className="font-medium">Video Tutorials</h3>
						<p className="text-sm text-muted-foreground">
							Manage tutorial videos
						</p>
						<p className="mt-2 text-xs text-muted-foreground">-- videos</p>
					</div>
				</div>

				<div className="flex items-start gap-4 rounded-lg border bg-card p-6">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<MessageSquare className="size-5 text-primary" />
					</div>
					<div>
						<h3 className="font-medium">FAQs</h3>
						<p className="text-sm text-muted-foreground">
							Manage frequently asked questions
						</p>
						<p className="mt-2 text-xs text-muted-foreground">-- FAQs</p>
					</div>
				</div>
			</div>
		</div>
	);
}

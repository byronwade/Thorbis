/**
 * Text/SMS Communication Page
 *
 * SMS and text messaging functionality using the communication layout system.
 */

"use client";

import { MessageSquare } from "lucide-react";

export default function TextPage() {
	return (
		<div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-panelLight dark:bg-panelDark">
			<div className="flex flex-1 overflow-hidden min-h-0 items-center justify-center">
				<div className="flex flex-col items-center justify-center gap-4 text-center p-8">
					<MessageSquare className="h-16 w-16 text-muted-foreground opacity-50" />
					<div>
						<h2 className="text-2xl font-semibold mb-2">Text Messages</h2>
						<p className="text-muted-foreground">
							SMS messaging functionality coming soon
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

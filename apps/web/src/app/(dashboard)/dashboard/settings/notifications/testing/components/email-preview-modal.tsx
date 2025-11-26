"use client";

import { Check, Code, Copy, Monitor, Smartphone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { NotificationDefinition } from "../notification-registry";

interface EmailPreviewModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	notification: NotificationDefinition;
}

export function EmailPreviewModal({
	open,
	onOpenChange,
	notification,
}: EmailPreviewModalProps) {
	const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
	const [copied, setCopied] = useState(false);

	const handleCopyHtml = async () => {
		// In a real implementation, this would copy the rendered HTML
		// For now, just show the copied state
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="h-[90vh] max-w-6xl">
				<DialogHeader>
					<DialogTitle className="flex items-center justify-between">
						<span>Email Preview: {notification.name}</span>
						<div className="flex items-center gap-2">
							<Button
								size="sm"
								variant="outline"
								onClick={() => setViewMode("desktop")}
								className={viewMode === "desktop" ? "bg-muted" : ""}
							>
								<Monitor className="mr-2 h-4 w-4" />
								Desktop
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => setViewMode("mobile")}
								className={viewMode === "mobile" ? "bg-muted" : ""}
							>
								<Smartphone className="mr-2 h-4 w-4" />
								Mobile
							</Button>
						</div>
					</DialogTitle>
					<DialogDescription>
						Preview how this email will appear to recipients
					</DialogDescription>
				</DialogHeader>

				<Tabs defaultValue="preview" className="flex-1">
					<TabsList>
						<TabsTrigger value="preview">Preview</TabsTrigger>
						<TabsTrigger value="html">HTML</TabsTrigger>
						<TabsTrigger value="test-data">Test Data</TabsTrigger>
					</TabsList>

					<TabsContent value="preview" className="h-[calc(90vh-200px)]">
						<div className="bg-muted/30 flex h-full items-center justify-center rounded-lg">
							<div
								className={`bg-white shadow-lg ${
									viewMode === "mobile" ? "w-[375px]" : "w-full max-w-3xl"
								} h-full overflow-hidden rounded-lg border`}
							>
								<ScrollArea className="h-full">
									<div className="p-6">
										{/* Email Preview Placeholder */}
										<div className="space-y-4">
											<div className="bg-muted h-8 w-3/4 rounded" />
											<div className="bg-muted h-4 w-full rounded" />
											<div className="bg-muted h-4 w-5/6 rounded" />
											<div className="bg-muted h-4 w-4/6 rounded" />
											<div className="bg-primary mt-6 h-10 w-32 rounded" />
											<div className="bg-muted mt-8 h-4 w-full rounded" />
											<div className="bg-muted h-4 w-2/3 rounded" />
										</div>

										{/* Note: In actual implementation, this would render the React Email component */}
										<div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
											<p className="text-sm text-blue-800">
												<strong>Implementation Note:</strong> This will render
												the actual React Email template from{" "}
												<code className="rounded bg-blue-100 px-1">
													{notification.channels.email?.templatePath}
												</code>
											</p>
											<p className="mt-2 text-xs text-blue-600">
												Test data:{" "}
												{JSON.stringify(notification.testData).substring(
													0,
													100,
												)}
												...
											</p>
										</div>
									</div>
								</ScrollArea>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="html" className="h-[calc(90vh-200px)]">
						<div className="relative h-full">
							<Button
								size="sm"
								variant="outline"
								className="absolute top-2 right-2 z-10"
								onClick={handleCopyHtml}
							>
								{copied ? (
									<>
										<Check className="mr-2 h-4 w-4" />
										Copied
									</>
								) : (
									<>
										<Copy className="mr-2 h-4 w-4" />
										Copy HTML
									</>
								)}
							</Button>
							<ScrollArea className="h-full">
								<pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
									<code>
										{`<!-- Email Template: ${notification.name} -->
<!-- Template: ${notification.channels.email?.templatePath} -->
<!-- Component: ${notification.channels.email?.templateComponent} -->

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${notification.name}</title>
</head>
<body>
  <!-- Template will be rendered here -->
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1>${notification.name}</h1>
    <p>This is a preview. The actual email template will be rendered here.</p>

    <!-- Test Data -->
    ${JSON.stringify(notification.testData, null, 2)}
  </div>
</body>
</html>`}
									</code>
								</pre>
							</ScrollArea>
						</div>
					</TabsContent>

					<TabsContent value="test-data" className="h-[calc(90vh-200px)]">
						<ScrollArea className="h-full">
							<div className="space-y-4 p-4">
								<div>
									<h3 className="mb-2 font-semibold">Test Data</h3>
									<p className="text-muted-foreground mb-4 text-sm">
										This data will be used to populate the email template for
										testing
									</p>
									<pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
										<code>
											{JSON.stringify(notification.testData, null, 2)}
										</code>
									</pre>
								</div>

								<div>
									<h3 className="mb-2 font-semibold">Template Information</h3>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												Template Path:
											</span>
											<code className="bg-muted rounded px-2 py-1">
												{notification.channels.email?.templatePath || "N/A"}
											</code>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Component:</span>
											<code className="bg-muted rounded px-2 py-1">
												{notification.channels.email?.templateComponent ||
													"N/A"}
											</code>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Status:</span>
											<code className="bg-muted rounded px-2 py-1">
												{notification.channels.email?.status || "N/A"}
											</code>
										</div>
									</div>
								</div>

								<div>
									<h3 className="mb-2 font-semibold">Email Metadata</h3>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Category:</span>
											<span className="capitalize">
												{notification.category}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Priority:</span>
											<span className="capitalize">
												{notification.priority}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												User Preference Key:
											</span>
											<code className="bg-muted rounded px-2 py-1">
												{notification.userPreferenceKey || "None"}
											</code>
										</div>
									</div>
								</div>
							</div>
						</ScrollArea>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}

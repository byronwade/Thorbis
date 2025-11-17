"use client";

/**
 * Template Download Client Component
 *
 * Allows users to download import templates
 */

import { Download, FileSpreadsheet, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { downloadExcelTemplate } from "@/lib/data/excel-template-generator";

type TemplateDownloadClientProps = {
	dataType: string;
};

export function TemplateDownloadClient({ dataType }: TemplateDownloadClientProps) {
	const formatDataType = (type: string) =>
		type
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

	const handleDownload = () => {
		downloadExcelTemplate(dataType);
	};

	return (
		<div className="container mx-auto max-w-3xl space-y-6 py-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Download {formatDataType(dataType)} Template
				</h1>
				<p className="text-muted-foreground mt-2">
					Get a pre-formatted Excel template for importing your data
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileSpreadsheet className="text-success size-5" />
						Excel Import Template
					</CardTitle>
					<CardDescription>
						This template includes all required fields and example data
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">File Format</p>
								<p className="text-muted-foreground text-xs">Microsoft Excel (.xlsx)</p>
							</div>
							<Badge>Excel</Badge>
						</div>

						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">Template Version</p>
								<p className="text-muted-foreground text-xs">Latest (v1.0)</p>
							</div>
							<Badge className="bg-success">Current</Badge>
						</div>

						<div className="flex items-center justify-between rounded-lg border p-3">
							<div>
								<p className="text-sm font-medium">Includes</p>
								<p className="text-muted-foreground text-xs">
									Headers, validation, examples, instructions
								</p>
							</div>
							<Badge>Complete</Badge>
						</div>
					</div>

					<div className="border-primary/50 bg-primary/5 rounded-lg border p-4">
						<div className="flex items-start gap-3">
							<Info className="text-primary mt-0.5 size-5 shrink-0" />
							<div>
								<p className="text-sm font-medium">Template Features</p>
								<ul className="text-muted-foreground mt-2 space-y-1 text-sm">
									<li className="flex items-center gap-2">
										<span className="bg-primary size-1.5 rounded-full" />
										Pre-formatted column headers
									</li>
									<li className="flex items-center gap-2">
										<span className="bg-primary size-1.5 rounded-full" />
										Data validation rules
									</li>
									<li className="flex items-center gap-2">
										<span className="bg-primary size-1.5 rounded-full" />
										Example rows with sample data
									</li>
									<li className="flex items-center gap-2">
										<span className="bg-primary size-1.5 rounded-full" />
										Instructions sheet
									</li>
								</ul>
							</div>
						</div>
					</div>

					<Button className="w-full" onClick={handleDownload} size="lg">
						<Download className="mr-2 size-4" />
						Download Template
					</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Next Steps</CardTitle>
				</CardHeader>
				<CardContent>
					<ol className="space-y-3">
						<li className="flex gap-3">
							<div className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
								1
							</div>
							<div>
								<p className="text-sm font-medium">Download the template</p>
								<p className="text-muted-foreground text-xs">
									Click the button above to get your Excel template
								</p>
							</div>
						</li>
						<li className="flex gap-3">
							<div className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
								2
							</div>
							<div>
								<p className="text-sm font-medium">Fill in your data</p>
								<p className="text-muted-foreground text-xs">
									Replace example rows with your actual data
								</p>
							</div>
						</li>
						<li className="flex gap-3">
							<div className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
								3
							</div>
							<div>
								<p className="text-sm font-medium">Import your data</p>
								<p className="text-muted-foreground text-xs">
									Go to the import page and upload your filled template
								</p>
							</div>
						</li>
					</ol>
				</CardContent>
			</Card>
		</div>
	);
}

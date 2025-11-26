"use client";

import {
	Briefcase,
	DollarSign,
	FileText,
	History,
	Package,
	Upload,
	Users,
} from "lucide-react";
import { useState } from "react";
import { ImportWizard } from "@/components/import/import-wizard";
import { ImportProgressDashboard } from "@/components/import/progress-dashboard";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ImportPageContentProps = {
	companyId: string;
	userId: string;
};

type EntityType = "customers" | "jobs" | "invoices" | "estimates" | "equipment";

export function ImportPageContent({
	companyId,
	userId,
}: ImportPageContentProps) {
	const [importWizardOpen, setImportWizardOpen] = useState(false);
	const [selectedEntityType, setSelectedEntityType] =
		useState<EntityType>("customers");

	const entityTypes: Array<{
		value: EntityType;
		label: string;
		description: string;
		icon: React.ElementType;
		color: string;
	}> = [
		{
			value: "customers",
			label: "Customers",
			description: "Import customer contacts and company details",
			icon: Users,
			color: "text-blue-600",
		},
		{
			value: "jobs",
			label: "Jobs",
			description: "Import job history and work orders",
			icon: Briefcase,
			color: "text-green-600",
		},
		{
			value: "invoices",
			label: "Invoices",
			description: "Import invoices and billing records",
			icon: DollarSign,
			color: "text-purple-600",
		},
		{
			value: "estimates",
			label: "Estimates",
			description: "Import quotes and proposals",
			icon: FileText,
			color: "text-orange-600",
		},
		{
			value: "equipment",
			label: "Equipment",
			description: "Import equipment and asset inventory",
			icon: Package,
			color: "text-indigo-600",
		},
	];

	const handleStartImport = (entityType: EntityType) => {
		setSelectedEntityType(entityType);
		setImportWizardOpen(true);
	};

	return (
		<>
			<div className="flex h-full flex-col">
				<div className="flex-1 overflow-auto">
					<div className="container max-w-7xl mx-auto py-6 space-y-6">
						{/* Page Header */}
						<div className="space-y-2">
							<h1 className="text-3xl font-bold tracking-tight">Import Data</h1>
							<p className="text-muted-foreground">
								AI-powered import system with format detection, smart field
								mapping, and duplicate detection.
							</p>
						</div>

						{/* Entity Type Cards */}
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{entityTypes.map((entity) => (
								<Card
									key={entity.value}
									className="hover:border-primary cursor-pointer transition-all"
									onClick={() => handleStartImport(entity.value)}
								>
									<CardHeader>
										<div className="flex items-start gap-4">
											<div className="p-2 rounded-lg bg-muted">
												<entity.icon className={`h-6 w-6 ${entity.color}`} />
											</div>
											<div className="flex-1">
												<CardTitle className="text-lg">
													{entity.label}
												</CardTitle>
												<CardDescription>{entity.description}</CardDescription>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<Button variant="outline" className="w-full">
											<Upload className="mr-2 h-4 w-4" />
											Import {entity.label}
										</Button>
									</CardContent>
								</Card>
							))}
						</div>

						{/* Import History with Tabs */}
						<Tabs defaultValue="start" className="w-full">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="start">
									<Upload className="mr-2 h-4 w-4" />
									Getting Started
								</TabsTrigger>
								<TabsTrigger value="history">
									<History className="mr-2 h-4 w-4" />
									Import History
								</TabsTrigger>
							</TabsList>

							<TabsContent value="start" className="mt-6">
								<Card>
									<CardHeader>
										<CardTitle>How It Works</CardTitle>
										<CardDescription>
											4-step AI-powered import process
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div className="grid gap-6 md:grid-cols-2">
											<div className="space-y-4">
												<div className="flex gap-3">
													<div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
														1
													</div>
													<div className="flex-1">
														<h4 className="font-semibold text-sm mb-1">
															Choose Source
														</h4>
														<p className="text-xs text-muted-foreground">
															Upload CSV/Excel file or connect to platform API
														</p>
													</div>
												</div>

												<div className="flex gap-3">
													<div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
														2
													</div>
													<div className="flex-1">
														<h4 className="font-semibold text-sm mb-1">
															Preview Data
														</h4>
														<p className="text-xs text-muted-foreground">
															AI detects platform and entity type automatically
														</p>
													</div>
												</div>

												<div className="flex gap-3">
													<div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
														3
													</div>
													<div className="flex-1">
														<h4 className="font-semibold text-sm mb-1">
															Map Fields
														</h4>
														<p className="text-xs text-muted-foreground">
															AI suggests field mappings with validation
														</p>
													</div>
												</div>

												<div className="flex gap-3">
													<div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
														4
													</div>
													<div className="flex-1">
														<h4 className="font-semibold text-sm mb-1">
															Execute Import
														</h4>
														<p className="text-xs text-muted-foreground">
															Monitor progress with rollback capability
														</p>
													</div>
												</div>
											</div>

											<div className="space-y-4">
												<div className="space-y-2">
													<h4 className="font-semibold text-sm">
														Supported Formats
													</h4>
													<ul className="text-sm text-muted-foreground space-y-1">
														<li>• CSV files (.csv)</li>
														<li>• Excel files (.xlsx, .xls)</li>
														<li>• ServiceTitan exports</li>
														<li>• Housecall Pro exports</li>
													</ul>
												</div>

												<div className="space-y-2">
													<h4 className="font-semibold text-sm">AI Features</h4>
													<ul className="text-sm text-muted-foreground space-y-1">
														<li>• 95%+ format detection accuracy</li>
														<li>• 90%+ field mapping accuracy</li>
														<li>• 85%+ duplicate detection</li>
														<li>• Real-time validation</li>
													</ul>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="history" className="mt-6">
								<ImportProgressDashboard companyId={companyId} limit={20} />
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>

			{/* Import Wizard - Full AI-Powered 4-Step Flow */}
			<ImportWizard
				open={importWizardOpen}
				onOpenChange={setImportWizardOpen}
				entityType={selectedEntityType}
				companyId={companyId}
				userId={userId}
			/>
		</>
	);
}

"use client";

import { MapPin, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
	createServiceArea,
	deleteServiceArea,
	type getServiceAreas,
	updateServiceArea,
} from "@/actions/settings";
import { SettingsPageLayout } from "@/components/settings/settings-page-layout";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
	buildServiceAreaFormData,
	mapServiceAreaRows,
	type ServiceAreaForm,
} from "./service-areas-config";

type ServiceAreasResult = Awaited<ReturnType<typeof getServiceAreas>>;
type ExtractData<T> = T extends { data: infer D } ? D : never;
type ServiceAreaRows = ExtractData<ServiceAreasResult>;

type ServiceAreasClientProps = {
	initialAreas: ServiceAreaRows | null;
};

export function ServiceAreasClient({ initialAreas }: ServiceAreasClientProps) {
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [serviceAreas, setServiceAreas] = useState<ServiceAreaForm[]>(
		mapServiceAreaRows(initialAreas ?? [])
	);

	const hasUnsavedChanges = useMemo(
		() => serviceAreas.some((area) => area.id.startsWith("temp-")),
		[serviceAreas]
	);

	const handleFieldChange = (
		id: string,
		field: keyof ServiceAreaForm,
		value: string | number | boolean | null
	) => {
		setServiceAreas((prev) =>
			prev.map((area) => (area.id === id ? { ...area, [field]: value as never } : area))
		);
	};

	const handleSaveArea = (area: ServiceAreaForm) => {
		startTransition(async () => {
			const formData = buildServiceAreaFormData(area);
			const result = area.id.startsWith("temp-")
				? await createServiceArea(formData)
				: await updateServiceArea(area.id, formData);

			if (!result.success) {
				toast.error(result.error ?? "Failed to save service area");
				return;
			}

			toast.success(`${area.areaName || "Service area"} saved successfully`);
			const newId = result.data;
			if (typeof newId === "string") {
				setServiceAreas((prev) =>
					prev.map((record) => (record.id === area.id ? { ...record, id: newId } : record))
				);
			}
		});
	};

	const handleDeleteArea = (id: string) => {
		startTransition(async () => {
			if (id.startsWith("temp-")) {
				setServiceAreas((prev) => prev.filter((area) => area.id !== id));
				return;
			}

			const result = await deleteServiceArea(id);
			if (result.success) {
				setServiceAreas((prev) => prev.filter((area) => area.id !== id));
				toast.success("Service area deleted");
			} else {
				toast.error(result.error ?? "Failed to delete service area");
			}
		});
	};

	const handleAddArea = () => {
		const newArea: ServiceAreaForm = {
			id: `temp-${Date.now()}`,
			areaName: "",
			areaType: "zip_code",
			zipCodes: "",
			radiusMiles: null,
			serviceFee: 0,
			minimumJobAmount: null,
			estimatedTravelTimeMinutes: null,
			centerLat: null,
			centerLng: null,
			polygonCoordinates: "",
			isActive: true,
		};
		setServiceAreas((prev) => [newArea, ...prev]);
	};

	return (
		<SettingsPageLayout
			description="Define the regions you serve and configure fees or minimums per zone."
			hasChanges={isPending || hasUnsavedChanges}
			helpText="Service areas automatically enforce coverage rules during booking and dispatch."
			isLoading={false}
			isPending={isPending}
			onCancel={() => setServiceAreas(mapServiceAreaRows(initialAreas ?? []))}
			onSave={() => {}}
			saveButtonText=""
			title="Service Areas"
		>
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/dashboard/settings">Settings</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/dashboard/settings/schedule">Scheduling</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Service areas</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<Button onClick={handleAddArea} variant="outline">
					<Plus className="mr-2 size-4" />
					Add Area
				</Button>
			</div>

			{serviceAreas.map((area) => (
				<Card key={area.id}>
					<CardHeader className="flex flex-row items-start justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<MapPin className="size-4" />
								{area.areaName || "Untitled Service Area"}
							</CardTitle>
							<CardDescription>Configure coverage and pricing logic for this zone.</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							<Switch
								checked={area.isActive}
								onCheckedChange={(checked) => handleFieldChange(area.id, "isActive", checked)}
							/>
							<Button onClick={() => handleDeleteArea(area.id)} size="icon" variant="ghost">
								<Trash2 className="size-4" />
							</Button>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label>Area name</Label>
								<Input
									className="mt-2"
									onChange={(event) => handleFieldChange(area.id, "areaName", event.target.value)}
									placeholder="Downtown Core"
									value={area.areaName}
								/>
							</div>
							<div>
								<Label>ZIP codes / postal codes</Label>
								<Input
									className="mt-2"
									onChange={(event) => handleFieldChange(area.id, "zipCodes", event.target.value)}
									placeholder="12345, 12346"
									value={area.zipCodes}
								/>
							</div>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label>Minimum job amount ($)</Label>
								<Input
									className="mt-2"
									min={0}
									onChange={(event) =>
										handleFieldChange(area.id, "minimumJobAmount", Number(event.target.value))
									}
									type="number"
									value={area.minimumJobAmount ?? 0}
								/>
							</div>
							<div>
								<Label>Travel fee ($)</Label>
								<Input
									className="mt-2"
									min={0}
									onChange={(event) =>
										handleFieldChange(area.id, "serviceFee", Number(event.target.value))
									}
									type="number"
									value={area.serviceFee}
								/>
							</div>
						</div>

						<Button onClick={() => handleSaveArea(area)} size="sm">
							Save area
						</Button>
					</CardContent>
				</Card>
			))}
		</SettingsPageLayout>
	);
}

export default ServiceAreasClient;

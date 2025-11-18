"use client";

import { Loader2, PackageSearch, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createInventory, reserveStock } from "@/actions/inventory";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export type MaterialPriceBookItem = {
	id: string;
	name: string;
	sku: string;
	itemType: string;
	unit: string;
	price: number;
};

export type MaterialJobOption = {
	id: string;
	jobNumber: string;
	title: string;
	customer?: string | null;
};

type MaterialFormProps = {
	priceBookItems: MaterialPriceBookItem[];
	jobs: MaterialJobOption[];
	defaultPriceBookItemId?: string;
};

export function MaterialForm({
	priceBookItems,
	jobs,
	defaultPriceBookItemId,
}: MaterialFormProps) {
	const router = useRouter();
	const { toast } = useToast();
	const formRef = useRef<HTMLFormElement>(null);
	const [selectedItemId, setSelectedItemId] = useState(
		defaultPriceBookItemId || priceBookItems[0]?.id || "",
	);
	const [quantityOnHand, setQuantityOnHand] = useState("1");
	const [minimumQuantity, setMinimumQuantity] = useState("0");
	const [reorderPoint, setReorderPoint] = useState("0");
	const [reorderQuantity, setReorderQuantity] = useState("0");
	const [costPerUnit, setCostPerUnit] = useState("0.00");
	const [warehouseLocation, setWarehouseLocation] = useState("");
	const [primaryLocation, setPrimaryLocation] = useState("");
	const [notes, setNotes] = useState("");
	const [reserveJobId, setReserveJobId] = useState("");
	const [reserveQuantity, setReserveQuantity] = useState("");
	const [reservationNotes, setReservationNotes] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const selectedItem = useMemo(
		() => priceBookItems.find((item) => item.id === selectedItemId),
		[priceBookItems, selectedItemId],
	);

	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "s") {
				event.preventDefault();
				formRef.current?.requestSubmit();
			}
			if (event.key === "Escape") {
				event.preventDefault();
				router.back();
			}
		};

		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [router]);

	const toCents = (value: string) =>
		Math.round((Number.parseFloat(value || "0") || 0) * 100);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!selectedItemId) {
			setError("Select a price book item to track inventory.");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const payload = new FormData();
			payload.append("priceBookItemId", selectedItemId);
			payload.append("quantityOnHand", quantityOnHand || "0");
			payload.append("minimumQuantity", minimumQuantity || "0");
			payload.append("reorderPoint", reorderPoint || "0");
			payload.append("reorderQuantity", reorderQuantity || "0");
			payload.append("costPerUnit", toCents(costPerUnit).toString());
			payload.append("warehouseLocation", warehouseLocation);
			payload.append("primaryLocation", primaryLocation);
			payload.append("notes", notes);

			const result = await createInventory(payload);

			if (!result.success) {
				setError(result.error || "Failed to create inventory record.");
				setIsSubmitting(false);
				return;
			}

			if (reserveJobId && Number.parseInt(reserveQuantity || "0", 10) > 0) {
				const reservationPayload = new FormData();
				reservationPayload.append("inventoryId", result.data);
				reservationPayload.append("jobId", reserveJobId);
				reservationPayload.append("quantity", reserveQuantity);
				reservationPayload.append("notes", reservationNotes);

				const reservationResult = await reserveStock(reservationPayload);
				if (!reservationResult.success) {
					setError(reservationResult.error || "Failed to reserve stock.");
					setIsSubmitting(false);
					return;
				}
			}

			toast.success("Inventory created.");
			router.push("/dashboard/work/materials");
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Something went wrong while creating inventory.",
			);
			setIsSubmitting(false);
		}
	};

	const totalValue =
		(Number.parseFloat(quantityOnHand || "0") || 0) *
		(Number.parseFloat(costPerUnit || "0") || 0);

	return (
		<form className="space-y-6" onSubmit={handleSubmit} ref={formRef}>
			<div className="bg-muted/30 flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-sm font-semibold">Keyboard Shortcuts</p>
					<p className="text-muted-foreground text-xs">
						⌘/Ctrl + S to save • Esc to cancel
					</p>
				</div>
				<Button asChild size="sm" variant="ghost">
					<Link href="/dashboard/work/materials">Back to Materials</Link>
				</Button>
			</div>

			{error && (
				<div className="border-destructive/40 bg-destructive/10 text-destructive rounded-lg border p-4 text-sm">
					{error}
				</div>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Price Book Item</CardTitle>
					<CardDescription>
						Select the service/material/equipment you&apos;re stocking
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-[2fr,1fr]">
						<div className="space-y-2">
							<Label htmlFor="priceBookItem">Item</Label>
							<Select onValueChange={setSelectedItemId} value={selectedItemId}>
								<SelectTrigger id="priceBookItem">
									<SelectValue placeholder="Search price book" />
								</SelectTrigger>
								<SelectContent className="max-h-[300px]">
									{priceBookItems.map((item) => (
										<SelectItem key={item.id} value={item.id}>
											<div className="flex flex-col">
												<span className="text-sm font-medium">{item.name}</span>
												<span className="text-muted-foreground text-xs">
													{item.sku} • {item.itemType}
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label>Need a new item?</Label>
							<Button asChild className="w-full" variant="outline">
								<Link href="/dashboard/work/pricebook/new">
									<PackageSearch className="mr-2 size-4" />
									Create price book item
								</Link>
							</Button>
						</div>
					</div>

					{selectedItem && (
						<div className="bg-muted/20 rounded-lg border p-4 text-sm">
							<p className="font-semibold">{selectedItem.name}</p>
							<p className="text-muted-foreground">
								SKU {selectedItem.sku} • {selectedItem.itemType} • Unit:{" "}
								{selectedItem.unit || "each"}
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Inventory Levels</CardTitle>
					<CardDescription>
						Track how much is on hand, minimums, and reorder preferences
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="quantityOnHand">Quantity on hand</Label>
							<Input
								id="quantityOnHand"
								min="0"
								onChange={(event) => setQuantityOnHand(event.target.value)}
								required
								type="number"
								value={quantityOnHand}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="minimumQuantity">Minimum quantity</Label>
							<Input
								id="minimumQuantity"
								min="0"
								onChange={(event) => setMinimumQuantity(event.target.value)}
								type="number"
								value={minimumQuantity}
							/>
						</div>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="reorderPoint">Reorder point</Label>
							<Input
								id="reorderPoint"
								min="0"
								onChange={(event) => setReorderPoint(event.target.value)}
								type="number"
								value={reorderPoint}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="reorderQuantity">Reorder quantity</Label>
							<Input
								id="reorderQuantity"
								min="0"
								onChange={(event) => setReorderQuantity(event.target.value)}
								type="number"
								value={reorderQuantity}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="costPerUnit">Cost per unit</Label>
						<Input
							id="costPerUnit"
							min="0"
							onChange={(event) => setCostPerUnit(event.target.value)}
							placeholder="0.00"
							step="0.01"
							type="number"
							value={costPerUnit}
						/>
						{quantityOnHand && costPerUnit && (
							<p className="text-muted-foreground text-xs">
								Inventory value: ${totalValue.toFixed(2)}
							</p>
						)}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Location & Notes</CardTitle>
					<CardDescription>
						Where the item lives and any internal documentation
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="warehouseLocation">Warehouse / bin</Label>
							<Input
								id="warehouseLocation"
								onChange={(event) => setWarehouseLocation(event.target.value)}
								placeholder="Main warehouse, Aisle 3, Bin 4"
								value={warehouseLocation}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="primaryLocation">Primary vehicle/location</Label>
							<Input
								id="primaryLocation"
								onChange={(event) => setPrimaryLocation(event.target.value)}
								placeholder="Service Van 12"
								value={primaryLocation}
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="notes">Internal notes</Label>
						<Textarea
							id="notes"
							onChange={(event) => setNotes(event.target.value)}
							placeholder="Preferred vendor, warranty info, storage instructions..."
							value={notes}
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Optional Reservation</CardTitle>
					<CardDescription>
						Reserve stock for an upcoming job immediately after creation
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="reserveJob">Job</Label>
							<Select onValueChange={setReserveJobId} value={reserveJobId}>
								<SelectTrigger id="reserveJob">
									<SelectValue placeholder="Optional" />
								</SelectTrigger>
								<SelectContent className="max-h-[280px]">
									{jobs.map((job) => (
										<SelectItem key={job.id} value={job.id}>
											<div className="flex flex-col">
												<span className="text-sm font-medium">
													{job.jobNumber} • {job.title}
												</span>
												{job.customer && (
													<span className="text-muted-foreground text-xs">
														{job.customer}
													</span>
												)}
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="reserveQuantity">Quantity to reserve</Label>
							<Input
								id="reserveQuantity"
								min="0"
								onChange={(event) => setReserveQuantity(event.target.value)}
								placeholder="0"
								type="number"
								value={reserveQuantity}
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="reservationNotes">Reservation notes</Label>
						<Textarea
							id="reservationNotes"
							onChange={(event) => setReservationNotes(event.target.value)}
							placeholder="Optional technician notes"
							value={reservationNotes}
						/>
					</div>
				</CardContent>
			</Card>

			<div className="flex items-center justify-end gap-3">
				<Button
					disabled={isSubmitting}
					onClick={() => router.back()}
					type="button"
					variant="outline"
				>
					Cancel
				</Button>
				<Button disabled={isSubmitting} type="submit">
					{isSubmitting ? (
						<>
							<Loader2 className="mr-2 size-4 animate-spin" />
							Saving
						</>
					) : (
						<>
							<Save className="mr-2 size-4" />
							Save Inventory
						</>
					)}
				</Button>
			</div>
		</form>
	);
}

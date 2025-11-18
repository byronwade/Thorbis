"use client";

/**
 * Customer Intake Tab
 *
 * Flattened customer form for call window with AI field highlighting
 */

import { Check, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAutoFill } from "@/hooks/use-auto-fill";
import { cn } from "@/lib/utils";

export function CustomerIntakeTab() {
	const {
		getField,
		updateField,
		approveField,
		rejectField,
		approveAll,
		rejectAll,
		getFieldsByState,
		isExtracting,
	} = useAutoFill("customer");

	const aiFilledCount =
		getFieldsByState("ai-filled").length +
		getFieldsByState("ai-suggested").length;

	return (
		<div className="h-full overflow-y-auto">
			<div className="mx-auto max-w-3xl space-y-6 p-6">
				{/* AI Status Banner */}
				{isExtracting && (
					<div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
						<Sparkles className="h-4 w-4 animate-pulse text-blue-600 dark:text-blue-400" />
						<span className="text-sm text-blue-900 dark:text-blue-100">
							AI is analyzing the conversation...
						</span>
					</div>
				)}

				{/* Bulk Actions */}
				{aiFilledCount > 0 && (
					<div className="bg-card flex items-center justify-between rounded-lg border p-3">
						<div className="flex items-center gap-2">
							<Sparkles className="text-primary h-4 w-4" />
							<span className="text-sm">
								{aiFilledCount} field{aiFilledCount > 1 ? "s" : ""} auto-filled
								by AI
							</span>
						</div>
						<div className="flex gap-2">
							<Button
								className="gap-1"
								onClick={approveAll}
								size="sm"
								variant="outline"
							>
								<Check className="h-3 w-3" />
								Accept All
							</Button>
							<Button
								className="gap-1"
								onClick={rejectAll}
								size="sm"
								variant="outline"
							>
								<X className="h-3 w-3" />
								Reject All
							</Button>
						</div>
					</div>
				)}

				{/* Basic Information */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Basic Information</h3>

					<div className="grid gap-4 sm:grid-cols-2">
						<AIField
							approveField={approveField}
							getField={getField}
							label="First Name"
							name="firstName"
							placeholder="John"
							rejectField={rejectField}
							updateField={updateField}
						/>
						<AIField
							approveField={approveField}
							getField={getField}
							label="Last Name"
							name="lastName"
							placeholder="Smith"
							rejectField={rejectField}
							updateField={updateField}
						/>
					</div>

					<AIField
						approveField={approveField}
						getField={getField}
						label="Email"
						name="email"
						placeholder="john@example.com"
						rejectField={rejectField}
						type="email"
						updateField={updateField}
					/>

					<AIField
						approveField={approveField}
						getField={getField}
						label="Phone"
						name="phone"
						placeholder="(555) 123-4567"
						rejectField={rejectField}
						type="tel"
						updateField={updateField}
					/>

					<AIField
						approveField={approveField}
						getField={getField}
						label="Company"
						name="company"
						placeholder="Acme Corp"
						rejectField={rejectField}
						updateField={updateField}
					/>
				</div>

				{/* Address */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Address</h3>

					<AIField
						approveField={approveField}
						getField={getField}
						label="Street Address"
						name="address"
						placeholder="123 Main Street"
						rejectField={rejectField}
						updateField={updateField}
					/>

					<div className="grid gap-4 sm:grid-cols-3">
						<AIField
							approveField={approveField}
							getField={getField}
							label="City"
							name="city"
							placeholder="San Francisco"
							rejectField={rejectField}
							updateField={updateField}
						/>
						<AIField
							approveField={approveField}
							getField={getField}
							label="State"
							name="state"
							placeholder="CA"
							rejectField={rejectField}
							updateField={updateField}
						/>
						<AIField
							approveField={approveField}
							getField={getField}
							label="ZIP Code"
							name="zipCode"
							placeholder="94102"
							rejectField={rejectField}
							updateField={updateField}
						/>
					</div>
				</div>

				{/* Customer Type */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Customer Type</h3>

					<div>
						<Label htmlFor="customerType">Type</Label>
						<Select
							onValueChange={(value) => updateField("customerType", value)}
							value={getField("customerType").value || "residential"}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="residential">Residential</SelectItem>
								<SelectItem value="commercial">Commercial</SelectItem>
								<SelectItem value="industrial">Industrial</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Save Button */}
				<div className="flex justify-end gap-2 pt-4">
					<Button variant="outline">Save for Later</Button>
					<Button>Create Customer</Button>
				</div>
			</div>
		</div>
	);
}

// AI Field Component with visual indicators
function AIField({
	label,
	name,
	type = "text",
	placeholder,
	getField,
	updateField,
	approveField,
	rejectField,
}: {
	label: string;
	name: string;
	type?: string;
	placeholder?: string;
	getField: (name: string) => { value: any; state: any; confidence?: number };
	updateField: (name: string, value: any) => void;
	approveField: (name: string) => void;
	rejectField: (name: string) => void;
}) {
	const field = getField(name);
	const isAIFilled =
		field.state === "ai-filled" || field.state === "ai-suggested";

	return (
		<div className="space-y-2">
			<Label className="flex items-center gap-2" htmlFor={name}>
				{label}
				{isAIFilled && (
					<span className="text-primary flex items-center gap-1 text-xs">
						<Sparkles className="h-3 w-3" />
						AI ({field.confidence}%)
					</span>
				)}
			</Label>
			<div className="relative">
				<Input
					className={cn(
						"transition-colors",
						field.state === "ai-filled" &&
							"border-blue-500 bg-blue-50/50 dark:bg-blue-950/30",
						field.state === "ai-suggested" &&
							"border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/30",
						field.state === "user-entered" && "border-green-500",
					)}
					id={name}
					onChange={(e) => updateField(name, e.target.value)}
					type={type}
					value={field.value || ""}
				/>
				{isAIFilled && (
					<div className="absolute top-2 right-2 flex gap-1">
						<Button
							className="h-6 w-6 hover:bg-green-100 hover:text-green-600"
							onClick={() => approveField(name)}
							size="icon"
							variant="ghost"
						>
							<Check className="h-3 w-3" />
						</Button>
						<Button
							className="h-6 w-6 hover:bg-red-100 hover:text-red-600"
							onClick={() => rejectField(name)}
							size="icon"
							variant="ghost"
						>
							<X className="h-3 w-3" />
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

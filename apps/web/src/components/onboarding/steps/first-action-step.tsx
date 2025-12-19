"use client";

/**
 * First Action Step - Guided First Task
 */

import {
	ArrowRight,
	Calendar,
	CheckCircle2,
	Clock,
	FileText,
	Loader2,
	Mail,
	MapPin,
	Phone,
	Plus,
	SkipForward,
	Trophy,
	Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { cn } from "@/lib/utils";

type FirstAction = "customer" | "job" | "estimate" | "skip";

const ACTION_OPTIONS: {
	id: FirstAction;
	title: string;
	description: string;
	icon: React.ElementType;
	time: string;
}[] = [
	{
		id: "customer",
		title: "Add Your First Customer",
		description: "Start building your customer database",
		icon: Users,
		time: "2 min",
	},
	{
		id: "job",
		title: "Schedule a Job",
		description: "Put something on the calendar",
		icon: Calendar,
		time: "3 min",
	},
	{
		id: "estimate",
		title: "Create an Estimate",
		description: "Send a professional quote",
		icon: FileText,
		time: "5 min",
	},
	{
		id: "skip",
		title: "I'll Explore on My Own",
		description: "Jump straight to the dashboard",
		icon: SkipForward,
		time: "Instant",
	},
];

interface CustomerData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
}

export function FirstActionStep() {
	const { data, updateData } = useOnboardingStore();
	const [selectedAction, setSelectedAction] = useState<FirstAction | null>(
		null,
	);
	const [customerData, setCustomerData] = useState<CustomerData>({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		address: "",
	});
	const [saving, setSaving] = useState(false);
	const [completed, setCompleted] = useState(false);

	const handleActionSelect = (action: FirstAction) => {
		setSelectedAction(action);
		if (action === "skip") {
			updateData({ firstActionCompleted: "skip" });
		}
	};

	const handleCustomerChange = (field: keyof CustomerData, value: string) => {
		setCustomerData((prev) => ({ ...prev, [field]: value }));
	};

	const saveCustomer = async () => {
		setSaving(true);
		try {
			// Import the server action dynamically
			const { createSimpleCustomer } = await import("@/actions/customers");

			// Create the customer in the database
			const result = await createSimpleCustomer({
				display_name: `${customerData.firstName} ${customerData.lastName}`.trim(),
				first_name: customerData.firstName,
				last_name: customerData.lastName,
				email: customerData.email || undefined,
				phone: customerData.phone || undefined,
				address: customerData.address || undefined,
				status: "active",
			});

			if (!result.success) {
				throw new Error(result.error || "Failed to create customer");
			}

			setCompleted(true);
			updateData({
				firstActionCompleted: "customer",
				firstCustomerId: result.data?.id,
			});
			toast.success("Customer added successfully!");
		} catch (error) {
			console.error("Failed to save customer:", error);
			toast.error(error instanceof Error ? error.message : "Failed to save customer");
		} finally {
			setSaving(false);
		}
	};

	// If action is completed, show success
	if (completed) {
		return (
			<div className="space-y-10">
				<div className="flex flex-col items-center gap-4 py-8">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
						<Trophy className="h-8 w-8 text-green-500" />
					</div>
					<div className="text-center">
						<h2 className="text-2xl font-semibold">First customer added!</h2>
						<p className="text-muted-foreground mt-1">
							{customerData.firstName} {customerData.lastName} is now in your
							system.
						</p>
					</div>
				</div>

				<div className="space-y-3">
					<span className="font-medium">What you can do now:</span>
					{[
						{
							title: `Schedule a job for ${customerData.firstName}`,
							desc: "Put an appointment on the calendar",
						},
						{ title: "Create an estimate", desc: "Send a professional quote" },
						{
							title: "Add property details",
							desc: "Equipment, notes, and history",
						},
					].map((item, i) => (
						<div
							key={i}
							className="flex items-start gap-3 rounded-lg bg-muted/40 p-3"
						>
							<CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
							<div>
								<p className="font-medium text-sm">{item.title}</p>
								<p className="text-xs text-muted-foreground">{item.desc}</p>
							</div>
						</div>
					))}
				</div>

				<p className="text-sm text-muted-foreground text-center">
					Complete the final step to see your personalized dashboard.
				</p>
			</div>
		);
	}

	// Show customer form if that action is selected
	if (selectedAction === "customer") {
		return (
			<div className="space-y-10">
				<div className="space-y-2">
					<button
						onClick={() => setSelectedAction(null)}
						className="text-sm text-muted-foreground hover:text-foreground"
					>
						← Back to options
					</button>
					<h2 className="text-2xl font-semibold">Add your first customer</h2>
					<p className="text-muted-foreground">
						Enter a real customer or create a test one. You can edit this later.
					</p>
				</div>

				<div className="space-y-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="firstName">First Name *</Label>
							<Input
								id="firstName"
								placeholder="John"
								value={customerData.firstName}
								onChange={(e) =>
									handleCustomerChange("firstName", e.target.value)
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Last Name *</Label>
							<Input
								id="lastName"
								placeholder="Smith"
								value={customerData.lastName}
								onChange={(e) =>
									handleCustomerChange("lastName", e.target.value)
								}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								id="email"
								type="email"
								placeholder="john@example.com"
								value={customerData.email}
								onChange={(e) => handleCustomerChange("email", e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="phone">Phone</Label>
						<div className="relative">
							<Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								id="phone"
								type="tel"
								placeholder="(555) 123-4567"
								value={customerData.phone}
								onChange={(e) => handleCustomerChange("phone", e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="address">Service Address</Label>
						<div className="relative">
							<MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input
								id="address"
								placeholder="123 Main St, City, State 12345"
								value={customerData.address}
								onChange={(e) =>
									handleCustomerChange("address", e.target.value)
								}
								className="pl-10"
							/>
						</div>
					</div>
				</div>

				<Button
					onClick={saveCustomer}
					disabled={!customerData.firstName || !customerData.lastName || saving}
					className="w-full"
				>
					{saving ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Saving...
						</>
					) : (
						<>
							<Plus className="mr-2 h-4 w-4" />
							Add Customer
						</>
					)}
				</Button>
			</div>
		);
	}

	// Show action selection
	return (
		<div className="space-y-10">
			{/* Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">Take your first action</h2>
				<p className="text-muted-foreground">
					The best way to learn is by doing. What would you like to do first?
				</p>
			</div>

			{/* Action Options */}
			<div className="space-y-2">
				{ACTION_OPTIONS.map((action) => {
					const Icon = action.icon;
					const isSkip = action.id === "skip";

					return (
						<button
							key={action.id}
							type="button"
							onClick={() => handleActionSelect(action.id)}
							className={cn(
								"w-full flex items-center gap-4 rounded-lg p-4 text-left transition-colors",
								"bg-muted/40 hover:bg-muted/60",
								isSkip && "opacity-70",
							)}
						>
							<Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
							<div className="flex-1 min-w-0">
								<p className="font-medium">{action.title}</p>
								<p className="text-sm text-muted-foreground">
									{action.description}
								</p>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-xs text-muted-foreground">
									{action.time}
								</span>
								<ArrowRight className="h-4 w-4 text-muted-foreground" />
							</div>
						</button>
					);
				})}
			</div>

			{/* Encouragement */}
			<p className="text-sm text-muted-foreground text-center">
				We recommend starting with "Add Your First Customer".
			</p>
		</div>
	);
}

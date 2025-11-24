"use client";

/**
 * First Action Step - Guided First Task
 *
 * Helps users complete their first meaningful action:
 * - Create first customer
 * - Schedule first job
 * - Send first estimate
 * - Book first appointment
 */

import { useState } from "react";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { InfoCard } from "@/components/onboarding/info-cards/walkthrough-slide";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
	Users,
	Calendar,
	FileText,
	Sparkles,
	CheckCircle2,
	ArrowRight,
	Clock,
	Phone,
	Mail,
	MapPin,
	Plus,
	Rocket,
	Trophy,
	SkipForward,
} from "lucide-react";

type FirstAction = "customer" | "job" | "estimate" | "skip";

const ACTION_OPTIONS: {
	id: FirstAction;
	title: string;
	description: string;
	icon: React.ElementType;
	time: string;
	impact: string;
}[] = [
	{
		id: "customer",
		title: "Add Your First Customer",
		description: "Start building your customer database",
		icon: Users,
		time: "2 minutes",
		impact: "Foundation for all work",
	},
	{
		id: "job",
		title: "Schedule a Job",
		description: "Put something on the calendar",
		icon: Calendar,
		time: "3 minutes",
		impact: "See dispatch in action",
	},
	{
		id: "estimate",
		title: "Create an Estimate",
		description: "Send a professional quote",
		icon: FileText,
		time: "5 minutes",
		impact: "Win more business",
	},
	{
		id: "skip",
		title: "I'll Explore on My Own",
		description: "Jump straight to the dashboard",
		icon: SkipForward,
		time: "Instant",
		impact: "Full freedom",
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
	const [selectedAction, setSelectedAction] = useState<FirstAction | null>(null);
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
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setCompleted(true);
		updateData({ firstActionCompleted: "customer" });
		setSaving(false);
	};

	// If action is completed, show success
	if (completed) {
		return (
			<div className="space-y-6 max-w-2xl">
				<div className="rounded-xl bg-green-500/10 p-8 text-center space-y-4">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 mx-auto">
						<Trophy className="h-8 w-8 text-green-500" />
					</div>
					<div>
						<h2 className="text-xl font-semibold">First customer added!</h2>
						<p className="text-muted-foreground mt-1">
							{customerData.firstName} {customerData.lastName} is now in your system.
						</p>
					</div>
				</div>

				<div className="rounded-xl bg-muted/30 p-5 space-y-4">
					<h3 className="font-semibold">What you can do now:</h3>
					<ul className="space-y-3">
						<li className="flex items-start gap-3">
							<CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
							<div>
								<p className="font-medium">Schedule a job for {customerData.firstName}</p>
								<p className="text-sm text-muted-foreground">Put an appointment on the calendar</p>
							</div>
						</li>
						<li className="flex items-start gap-3">
							<CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
							<div>
								<p className="font-medium">Create an estimate</p>
								<p className="text-sm text-muted-foreground">Send a professional quote</p>
							</div>
						</li>
						<li className="flex items-start gap-3">
							<CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
							<div>
								<p className="font-medium">Add property details</p>
								<p className="text-sm text-muted-foreground">Equipment, notes, and history</p>
							</div>
						</li>
					</ul>
				</div>

				<InfoCard
					icon={<Sparkles className="h-5 w-5" />}
					title="You're ready to go!"
					description="Complete the last step to see your personalized dashboard and start running your business with Thorbis."
					variant="success"
				/>
			</div>
		);
	}

	// Show customer form if that action is selected
	if (selectedAction === "customer") {
		return (
			<div className="space-y-6 max-w-2xl">
				<div>
					<button
						onClick={() => setSelectedAction(null)}
						className="text-sm text-muted-foreground hover:text-foreground mb-4"
					>
						← Back to options
					</button>
					<h2 className="text-xl font-semibold">Add your first customer</h2>
					<p className="text-sm text-muted-foreground">
						Enter a real customer or create a test one. You can edit this later.
					</p>
				</div>

				<div className="rounded-xl bg-muted/30 p-5 space-y-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="firstName">First Name *</Label>
							<Input
								id="firstName"
								placeholder="John"
								value={customerData.firstName}
								onChange={(e) => handleCustomerChange("firstName", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Last Name *</Label>
							<Input
								id="lastName"
								placeholder="Smith"
								value={customerData.lastName}
								onChange={(e) => handleCustomerChange("lastName", e.target.value)}
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
								onChange={(e) => handleCustomerChange("address", e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>
				</div>

				<Button
					onClick={saveCustomer}
					disabled={!customerData.firstName || !customerData.lastName || saving}
					className="w-full"
					size="lg"
				>
					{saving ? (
						<>
							<Clock className="mr-2 h-4 w-4 animate-spin" />
							Saving Customer...
						</>
					) : (
						<>
							<Plus className="mr-2 h-4 w-4" />
							Add Customer
						</>
					)}
				</Button>

				<p className="text-xs text-muted-foreground text-center">
					This customer will be saved to your account and visible on your dashboard.
				</p>
			</div>
		);
	}

	// Show action selection
	return (
		<div className="space-y-6 max-w-2xl">
			<div>
				<h2 className="text-xl font-semibold">Take your first action</h2>
				<p className="text-sm text-muted-foreground">
					The best way to learn is by doing. What would you like to do first?
				</p>
			</div>

			{/* Info Card */}
			<InfoCard
				icon={<Rocket className="h-5 w-5" />}
				title="Aha moment ahead!"
				description="Research shows that users who complete one meaningful action in their first session are 3x more likely to become long-term users."
				variant="tip"
			/>

			{/* Action Options */}
			<div className="space-y-3">
				{ACTION_OPTIONS.map((action) => {
					const Icon = action.icon;
					const isSelected = selectedAction === action.id;
					const isSkip = action.id === "skip";

					return (
						<button
							key={action.id}
							type="button"
							onClick={() => handleActionSelect(action.id)}
							className={cn(
								"w-full flex items-center gap-4 rounded-xl p-5 text-left transition-all",
								isSelected
									? "bg-primary/10 ring-2 ring-primary"
									: "bg-muted/30 hover:bg-muted/50",
								isSkip && "opacity-70"
							)}
						>
							<div className={cn(
								"flex h-12 w-12 items-center justify-center rounded-xl transition-colors flex-shrink-0",
								isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
							)}>
								<Icon className="h-6 w-6" />
							</div>

							<div className="flex-1 min-w-0">
								<p className="font-semibold">{action.title}</p>
								<p className="text-sm text-muted-foreground">{action.description}</p>
								<div className="flex items-center gap-4 mt-2">
									<span className="flex items-center gap-1 text-xs text-muted-foreground">
										<Clock className="h-3 w-3" />
										{action.time}
									</span>
									<span className="text-xs text-muted-foreground">
										{action.impact}
									</span>
								</div>
							</div>

							<ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
						</button>
					);
				})}
			</div>

			{/* Encouragement */}
			<div className="text-center text-sm text-muted-foreground">
				<p>Don't worry — you can always do all of these later.</p>
				<p>We recommend starting with "Add Your First Customer".</p>
			</div>
		</div>
	);
}

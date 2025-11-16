"use client";

/**
 * Tabbed Forms Component
 *
 * Main container for Customer, Job, and Appointment forms in call window
 *
 * Features:
 * - Tab switching with keyboard shortcuts (Cmd+1/2/3)
 * - Visual indicators for AI-filled fields
 * - Form state persistence during call
 * - Smooth animations
 */

import { Building2, Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AppointmentTab } from "./appointment-tab";
import { CustomerIntakeTab } from "./customer-intake-tab";
import { JobCreationTab } from "./job-creation-tab";

type TabValue = "customer" | "job" | "appointment";

export function TabbedForms() {
	const [activeTab, setActiveTab] = useState<TabValue>("customer");

	// Keyboard shortcuts for tab switching
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.metaKey || e.ctrlKey) {
				if (e.key === "1") {
					e.preventDefault();
					setActiveTab("customer");
				} else if (e.key === "2") {
					e.preventDefault();
					setActiveTab("job");
				} else if (e.key === "3") {
					e.preventDefault();
					setActiveTab("appointment");
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<div className="flex h-full flex-col bg-background">
			<Tabs
				className="flex h-full flex-col"
				onValueChange={(value) => setActiveTab(value as TabValue)}
				value={activeTab}
			>
				{/* Tab Navigation */}
				<div className="border-border border-b bg-card px-4">
					<TabsList className="h-14 w-full justify-start gap-1 bg-transparent p-0">
						<TabsTrigger
							className={cn(
								"relative gap-2 rounded-none border-transparent border-b-2 px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
								"hover:bg-accent/50"
							)}
							value="customer"
						>
							<User className="h-4 w-4" />
							<span className="font-medium">Customer</span>
							<kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] opacity-70 sm:flex">
								<span className="text-xs">⌘</span>1
							</kbd>
						</TabsTrigger>
						<TabsTrigger
							className={cn(
								"relative gap-2 rounded-none border-transparent border-b-2 px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
								"hover:bg-accent/50"
							)}
							value="job"
						>
							<Building2 className="h-4 w-4" />
							<span className="font-medium">Job</span>
							<kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] opacity-70 sm:flex">
								<span className="text-xs">⌘</span>2
							</kbd>
						</TabsTrigger>
						<TabsTrigger
							className={cn(
								"relative gap-2 rounded-none border-transparent border-b-2 px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
								"hover:bg-accent/50"
							)}
							value="appointment"
						>
							<Calendar className="h-4 w-4" />
							<span className="font-medium">Appointment</span>
							<kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] opacity-70 sm:flex">
								<span className="text-xs">⌘</span>3
							</kbd>
						</TabsTrigger>
					</TabsList>
				</div>

				{/* Tab Content */}
				<div className="flex-1 overflow-hidden">
					<TabsContent className="mt-0 h-full" value="customer">
						<CustomerIntakeTab />
					</TabsContent>
					<TabsContent className="mt-0 h-full" value="job">
						<JobCreationTab />
					</TabsContent>
					<TabsContent className="mt-0 h-full" value="appointment">
						<AppointmentTab />
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}

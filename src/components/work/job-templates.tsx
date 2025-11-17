"use client";

import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Job Templates Component
 *
 * Quick templates for common service types
 * Keyboard shortcuts: Alt + 1-9
 */

type JobTemplate = {
	id: string;
	name: string;
	shortcut: string;
	jobType: "service" | "installation" | "repair" | "maintenance" | "inspection" | "consultation";
	priority: "low" | "medium" | "high" | "urgent";
	duration: number; // minutes
	title: string;
	description: string;
};

const JOB_TEMPLATES: JobTemplate[] = [
	{
		id: "hvac-maintenance",
		name: "HVAC Maintenance",
		shortcut: "Alt+1",
		jobType: "maintenance",
		priority: "medium",
		duration: 120,
		title: "Annual HVAC Maintenance",
		description: "Routine HVAC system maintenance and inspection",
	},
	{
		id: "emergency-repair",
		name: "Emergency Repair",
		shortcut: "Alt+2",
		jobType: "repair",
		priority: "urgent",
		duration: 60,
		title: "Emergency Service Call",
		description: "Urgent repair required",
	},
	{
		id: "installation",
		name: "New Installation",
		shortcut: "Alt+3",
		jobType: "installation",
		priority: "medium",
		duration: 480,
		title: "Equipment Installation",
		description: "New equipment installation and setup",
	},
	{
		id: "inspection",
		name: "System Inspection",
		shortcut: "Alt+4",
		jobType: "inspection",
		priority: "low",
		duration: 60,
		title: "System Inspection",
		description: "Comprehensive system inspection",
	},
	{
		id: "consultation",
		name: "Consultation",
		shortcut: "Alt+5",
		jobType: "consultation",
		priority: "low",
		duration: 30,
		title: "Customer Consultation",
		description: "Initial consultation and assessment",
	},
	{
		id: "seasonal-service",
		name: "Seasonal Service",
		shortcut: "Alt+6",
		jobType: "service",
		priority: "medium",
		duration: 90,
		title: "Seasonal Service Check",
		description: "Pre-season system service and optimization",
	},
];

type JobTemplatesProps = {
	onTemplateSelect: (template: JobTemplate) => void;
};

export function JobTemplates({ onTemplateSelect }: JobTemplatesProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="sm" type="button" variant="outline">
					<Zap className="mr-2 size-4" />
					Quick Templates
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-64">
				<DropdownMenuLabel className="flex items-center justify-between">
					<span>Job Templates</span>
					<span className="text-muted-foreground text-xs font-normal">Alt + 1-6</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{JOB_TEMPLATES.map((template) => (
					<DropdownMenuItem
						className="flex cursor-pointer items-center justify-between"
						key={template.id}
						onClick={() => onTemplateSelect(template)}
					>
						<div className="flex flex-col">
							<span className="font-medium">{template.name}</span>
							<span className="text-muted-foreground text-xs">
								{template.duration} min • {template.priority}
							</span>
						</div>
						<span className="text-muted-foreground text-xs">{template.shortcut.split("+")[1]}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export { JOB_TEMPLATES };
export type { JobTemplate };

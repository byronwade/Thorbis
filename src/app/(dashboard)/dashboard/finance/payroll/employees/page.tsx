/**
 * Finance > Payroll > Employees Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { Calendar, DollarSign, Mail, MoreHorizontal, Phone, Plus, Search, UserCheck, UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock employee data
const employees = [
	{
		id: "1",
		name: "John Smith",
		email: "john.smith@example.com",
		phone: "(555) 123-4567",
		role: "Lead Technician",
		hourlyRate: 45.0,
		status: "active",
		hireDate: "2023-01-15",
	},
	{
		id: "2",
		name: "Sarah Johnson",
		email: "sarah.j@example.com",
		phone: "(555) 234-5678",
		role: "Service Technician",
		hourlyRate: 35.0,
		status: "active",
		hireDate: "2023-03-22",
	},
	{
		id: "3",
		name: "Mike Davis",
		email: "mike.d@example.com",
		phone: "(555) 345-6789",
		role: "Apprentice",
		hourlyRate: 25.0,
		status: "active",
		hireDate: "2024-01-10",
	},
	{
		id: "4",
		name: "Emily Chen",
		email: "emily.c@example.com",
		phone: "(555) 456-7890",
		role: "Senior Technician",
		hourlyRate: 50.0,
		status: "active",
		hireDate: "2022-08-05",
	},
	{
		id: "5",
		name: "Robert Williams",
		email: "robert.w@example.com",
		phone: "(555) 567-8901",
		role: "Service Technician",
		hourlyRate: 38.0,
		status: "inactive",
		hireDate: "2023-06-12",
	},
];

export default function PayrollEmployeesPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="font-semibold text-2xl">Employee Management</h1>
					<p className="text-muted-foreground">Manage employee profiles and compensation</p>
				</div>
				<Button>
					<Plus className="mr-2 size-4" />
					<span className="hidden sm:inline">Add Employee</span>
					<span className="sm:hidden">Add</span>
				</Button>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Active Employees</CardTitle>
						<UserCheck className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">4</div>
						<p className="text-muted-foreground text-xs">1 inactive</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Average Rate</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">$38.60/hr</div>
						<p className="text-muted-foreground text-xs">Across all employees</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">New This Year</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">1</div>
						<p className="text-muted-foreground text-xs">Hired in 2024</p>
					</CardContent>
				</Card>
			</div>

			{/* Search and Filters */}
			<Card>
				<CardHeader>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<CardTitle>Employees</CardTitle>
							<CardDescription>View and manage your employee roster</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							<div className="relative">
								<Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
								<Input className="pl-8" placeholder="Search employees..." />
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Contact</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Rate</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Hire Date</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{employees.map((employee) => (
								<TableRow key={employee.id}>
									<TableCell className="font-medium">{employee.name}</TableCell>
									<TableCell>
										<div className="flex flex-col gap-1">
											<div className="flex items-center gap-1 text-xs">
												<Mail className="h-3 w-3" />
												<span>{employee.email}</span>
											</div>
											<div className="flex items-center gap-1 text-xs">
												<Phone className="h-3 w-3" />
												<span>{employee.phone}</span>
											</div>
										</div>
									</TableCell>
									<TableCell>{employee.role}</TableCell>
									<TableCell>${employee.hourlyRate.toFixed(2)}/hr</TableCell>
									<TableCell>
										<Badge variant={employee.status === "active" ? "default" : "secondary"}>
											{employee.status === "active" ? (
												<UserCheck className="mr-1 h-3 w-3" />
											) : (
												<UserX className="mr-1 h-3 w-3" />
											)}
											{employee.status}
										</Badge>
									</TableCell>
									<TableCell>{new Date(employee.hireDate).toLocaleDateString()}</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button size="sm" variant="ghost">
													<MoreHorizontal className="size-4" />
													<span className="sr-only">Open menu</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuItem>View Profile</DropdownMenuItem>
												<DropdownMenuItem>Edit Details</DropdownMenuItem>
												<DropdownMenuItem>View Timesheet</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem>{employee.status === "active" ? "Deactivate" : "Activate"}</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}

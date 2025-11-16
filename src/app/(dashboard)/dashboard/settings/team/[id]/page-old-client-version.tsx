"use client";

/**
 * Settings > Team > [Id] Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
	ArrowLeft,
	Briefcase,
	Calendar,
	CheckCircle2,
	Clock,
	DollarSign,
	File,
	FileText,
	IdCard,
	Mail,
	MapPin,
	Percent,
	Phone,
	Save,
	Shield,
	Upload,
	User,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { PermissionsEditor } from "@/components/team/permissions-editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { UserRole } from "@/lib/auth/permissions";

type EmploymentType = "full-time" | "part-time" | "contractor" | "intern";
type PayType = "hourly" | "salary" | "commission" | "hybrid";
type EmploymentStatus = "active" | "on-leave" | "suspended" | "terminated";

type EmployeeProfile = {
	// Personal Information
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	alternatePhone?: string;
	dateOfBirth: string;
	ssn: string; // Last 4 digits only for display
	address: string;
	city: string;
	state: string;
	zipCode: string;
	emergencyContactName: string;
	emergencyContactPhone: string;
	emergencyContactRelationship: string;

	// Employment Details
	employeeId: string;
	hireDate: string;
	employmentType: EmploymentType;
	employmentStatus: EmploymentStatus;
	terminationDate?: string;
	terminationReason?: string;
	jobTitle: string;
	departmentId: string;
	roleId: string;
	reportsToId?: string;
	workLocation: string;
	workSchedule: string;

	// Payroll Information
	payType: PayType;
	hourlyRate?: number;
	annualSalary?: number;
	commissionRate?: number;
	overtimeEligible: boolean;
	payrollSchedule: "weekly" | "biweekly" | "semimonthly" | "monthly";
	paymentMethod: "direct-deposit" | "check" | "cash";
	bankName?: string;
	accountNumber?: string; // Last 4 digits
	routingNumber?: string;

	// Tax Information
	federalFilingStatus:
		| "single"
		| "married"
		| "married-separate"
		| "head-of-household";
	federalAllowances: number;
	stateFilingStatus: string;
	stateAllowances: number;
	additionalWithholding: number;
	taxExempt: boolean;
	w4OnFile: boolean;
	i9OnFile: boolean;

	// Benefits & Deductions
	healthInsurance: boolean;
	healthInsurancePlan?: string;
	healthInsuranceDeduction: number;
	dentalInsurance: boolean;
	dentalInsuranceDeduction: number;
	visionInsurance: boolean;
	visionInsuranceDeduction: number;
	retirement401k: boolean;
	retirement401kPercent: number;
	retirement401kMatch: boolean;
	hsa: boolean;
	hsaContribution: number;
	lifeInsurance: boolean;
	lifeInsuranceCoverage?: number;

	// Time Off
	ptoBalance: number;
	ptoAccrualRate: number;
	sickLeaveBalance: number;
	sickLeaveAccrualRate: number;
	vacationDaysUsed: number;
	sickDaysUsed: number;

	// Skills & Certifications
	skills: string[];
	certifications: {
		name: string;
		issuer: string;
		issueDate: string;
		expiryDate?: string;
		certificationNumber?: string;
	}[];
	licenses: {
		type: string;
		number: string;
		state: string;
		issueDate: string;
		expiryDate: string;
	}[];

	// Performance
	performanceRating?: number;
	lastReviewDate?: string;
	nextReviewDate?: string;
	goals: string[];

	// Documents
	documents: {
		id: string;
		name: string;
		type: string;
		uploadDate: string;
		size: string;
	}[];

	// Notes
	notes: string;
};

export default function EmployeeProfilePage() {
	const params = useParams();
	const employeeId = params?.id as string;

	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [isSavingPermissions, setIsSavingPermissions] = useState(false);

	// Role and permissions state
	const [currentRole, setCurrentRole] = useState<UserRole>("technician");
	const [customPermissions, setCustomPermissions] = useState<
		Record<string, boolean>
	>({});

	const [employee, setEmployee] = useState<EmployeeProfile>({
		// Personal Information
		id: employeeId,
		firstName: "John",
		lastName: "Doe",
		email: "john.doe@company.com",
		phone: "(555) 123-4567",
		alternatePhone: "(555) 987-6543",
		dateOfBirth: "1990-05-15",
		ssn: "****5678",
		address: "123 Main Street",
		city: "San Francisco",
		state: "CA",
		zipCode: "94102",
		emergencyContactName: "Jane Doe",
		emergencyContactPhone: "(555) 111-2222",
		emergencyContactRelationship: "Spouse",

		// Employment Details
		employeeId: "EMP-001234",
		hireDate: "2022-01-15",
		employmentType: "full-time",
		employmentStatus: "active",
		jobTitle: "Senior HVAC Technician",
		departmentId: "1",
		roleId: "3",
		reportsToId: "5",
		workLocation: "San Francisco Bay Area",
		workSchedule: "Monday-Friday, 8:00 AM - 5:00 PM",

		// Payroll Information
		payType: "hourly",
		hourlyRate: 32.5,
		overtimeEligible: true,
		payrollSchedule: "biweekly",
		paymentMethod: "direct-deposit",
		bankName: "Chase Bank",
		accountNumber: "****5678",
		routingNumber: "322271627",

		// Tax Information
		federalFilingStatus: "married",
		federalAllowances: 2,
		stateFilingStatus: "married",
		stateAllowances: 2,
		additionalWithholding: 0,
		taxExempt: false,
		w4OnFile: true,
		i9OnFile: true,

		// Benefits & Deductions
		healthInsurance: true,
		healthInsurancePlan: "PPO Gold",
		healthInsuranceDeduction: 150,
		dentalInsurance: true,
		dentalInsuranceDeduction: 25,
		visionInsurance: true,
		visionInsuranceDeduction: 10,
		retirement401k: true,
		retirement401kPercent: 6,
		retirement401kMatch: true,
		hsa: false,
		hsaContribution: 0,
		lifeInsurance: true,
		lifeInsuranceCoverage: 100_000,

		// Time Off
		ptoBalance: 120,
		ptoAccrualRate: 6.67,
		sickLeaveBalance: 40,
		sickLeaveAccrualRate: 3.33,
		vacationDaysUsed: 32,
		sickDaysUsed: 8,

		// Skills & Certifications
		skills: [
			"HVAC Installation",
			"Preventive Maintenance",
			"Troubleshooting",
			"Customer Service",
			"EPA Universal Certification",
		],
		certifications: [
			{
				name: "EPA Universal Certification",
				issuer: "EPA",
				issueDate: "2021-03-15",
				expiryDate: "2025-03-15",
				certificationNumber: "EPA-123456",
			},
			{
				name: "NATE HVAC Certification",
				issuer: "North American Technician Excellence",
				issueDate: "2020-06-01",
				certificationNumber: "NATE-789012",
			},
		],
		licenses: [
			{
				type: "California Contractor License",
				number: "C20-123456",
				state: "CA",
				issueDate: "2021-01-01",
				expiryDate: "2025-01-01",
			},
		],

		// Performance
		performanceRating: 4.5,
		lastReviewDate: "2024-01-15",
		nextReviewDate: "2025-01-15",
		goals: [
			"Complete advanced refrigeration training",
			"Mentor 2 junior technicians",
			"Maintain 95%+ customer satisfaction",
		],

		// Documents
		documents: [
			{
				id: "1",
				name: "W-4 Form 2024.pdf",
				type: "Tax Document",
				uploadDate: "2024-01-05",
				size: "125 KB",
			},
			{
				id: "2",
				name: "I-9 Employment Eligibility.pdf",
				type: "Employment Verification",
				uploadDate: "2022-01-10",
				size: "98 KB",
			},
			{
				id: "3",
				name: "EPA Certification.pdf",
				type: "Certification",
				uploadDate: "2021-03-20",
				size: "256 KB",
			},
		],

		// Notes
		notes:
			"Excellent technician with strong customer service skills. Consistently receives high ratings from customers. Recommended for team lead position.",
	});

	const handleFieldChange = <K extends keyof EmployeeProfile>(
		field: K,
		value: EmployeeProfile[K],
	) => {
		setEmployee((prev) => ({ ...prev, [field]: value }));
		setHasUnsavedChanges(true);
	};

	const handleSave = () => {
		// TODO: Implement save logic
		setHasUnsavedChanges(false);
	};

	// Handle role change
	const handleRoleChange = async (newRole: UserRole) => {
		setCurrentRole(newRole);
		setHasUnsavedChanges(true);
	};

	// Handle permissions change
	const handlePermissionsChange = (newPermissions: Record<string, boolean>) => {
		setCustomPermissions(newPermissions);
		setHasUnsavedChanges(true);
	};

	// Save role and permissions
	const handleSavePermissions = async () => {
		setIsSavingPermissions(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setHasUnsavedChanges(false);
		} catch (_error) {
		} finally {
			setIsSavingPermissions(false);
		}
	};

	const _getEmploymentStatusColor = (status: EmploymentStatus) => {
		switch (status) {
			case "active":
				return "bg-success";
			case "on-leave":
				return "bg-warning";
			case "suspended":
				return "bg-warning";
			case "terminated":
				return "bg-destructive";
			default:
				return "bg-secondary0";
		}
	};

	const getEmploymentStatusBadgeVariant = (
		status: EmploymentStatus,
	): "default" | "secondary" | "destructive" | "outline" => {
		switch (status) {
			case "active":
				return "default";
			case "on-leave":
				return "secondary";
			case "suspended":
				return "destructive";
			case "terminated":
				return "outline";
			default:
				return "outline";
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="flex items-start gap-4">
					<Link href="/dashboard/settings/team">
						<Button size="icon" variant="ghost">
							<ArrowLeft className="size-4" />
						</Button>
					</Link>
					<div className="flex items-start gap-4">
						<Avatar className="h-20 w-20">
							<AvatarImage src="" />
							<AvatarFallback className="text-2xl">
								{employee.firstName[0]}
								{employee.lastName[0]}
							</AvatarFallback>
						</Avatar>
						<div>
							<h1 className="font-bold text-4xl tracking-tight">
								{employee.firstName} {employee.lastName}
							</h1>
							<p className="mt-1 text-muted-foreground">{employee.jobTitle}</p>
							<div className="mt-2 flex items-center gap-2">
								<Badge
									variant={getEmploymentStatusBadgeVariant(
										employee.employmentStatus,
									)}
								>
									{employee.employmentStatus}
								</Badge>
								<Badge variant="outline">{employee.employmentType}</Badge>
								<span className="text-muted-foreground text-sm">
									ID: {employee.employeeId}
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className="flex gap-2">
					{hasUnsavedChanges && (
						<Button onClick={handleSave} size="lg">
							<Save className="mr-2 size-4" />
							Save Changes
						</Button>
					)}
					<Button size="lg" variant="outline">
						<Upload className="mr-2 size-4" />
						Upload Document
					</Button>
				</div>
			</div>

			{/* Quick Stats */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
								<DollarSign className="h-5 w-5 text-success" />
							</div>
							<div>
								<p className="text-muted-foreground text-xs">Pay Rate</p>
								<p className="font-semibold">
									{employee.payType === "hourly"
										? `$${employee.hourlyRate}/hr`
										: employee.payType === "salary"
											? `$${employee.annualSalary?.toLocaleString()}/yr`
											: "Commission"}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
								<Calendar className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-muted-foreground text-xs">PTO Balance</p>
								<p className="font-semibold">{employee.ptoBalance} hours</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
								<Clock className="h-5 w-5 text-accent-foreground" />
							</div>
							<div>
								<p className="text-muted-foreground text-xs">Tenure</p>
								<p className="font-semibold">
									{Math.floor(
										(Date.now() - new Date(employee.hireDate).getTime()) /
											(1000 * 60 * 60 * 24 * 365),
									)}{" "}
									years
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
								<Shield className="h-5 w-5 text-warning" />
							</div>
							<div>
								<p className="text-muted-foreground text-xs">Performance</p>
								<p className="font-semibold">
									{employee.performanceRating
										? `${employee.performanceRating}/5.0`
										: "N/A"}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Content Tabs */}
			<Tabs className="w-full" defaultValue="personal">
				<TabsList className="grid w-full grid-cols-2 lg:grid-cols-9">
					<TabsTrigger value="personal">Personal</TabsTrigger>
					<TabsTrigger value="employment">Employment</TabsTrigger>
					<TabsTrigger value="permissions">
						<Shield className="mr-2 h-4 w-4" />
						Permissions
					</TabsTrigger>
					<TabsTrigger value="payroll">Payroll</TabsTrigger>
					<TabsTrigger value="tax">Tax Info</TabsTrigger>
					<TabsTrigger value="benefits">Benefits</TabsTrigger>
					<TabsTrigger value="time-off">Time Off</TabsTrigger>
					<TabsTrigger value="skills">Skills</TabsTrigger>
					<TabsTrigger value="documents">Documents</TabsTrigger>
				</TabsList>

				{/* Personal Information */}
				<TabsContent className="space-y-6" value="personal">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<User className="h-5 w-5 text-primary" />
								Personal Information
							</CardTitle>
							<CardDescription>
								Basic personal details and contact information
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="firstName">First Name</Label>
									<Input
										id="firstName"
										onChange={(e) =>
											handleFieldChange("firstName", e.target.value)
										}
										value={employee.firstName}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="lastName">Last Name</Label>
									<Input
										id="lastName"
										onChange={(e) =>
											handleFieldChange("lastName", e.target.value)
										}
										value={employee.lastName}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">Email Address</Label>
									<div className="relative">
										<Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
										<Input
											className="pl-9"
											id="email"
											onChange={(e) =>
												handleFieldChange("email", e.target.value)
											}
											type="email"
											value={employee.email}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="phone">Phone Number</Label>
									<div className="relative">
										<Phone className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
										<Input
											className="pl-9"
											id="phone"
											onChange={(e) =>
												handleFieldChange("phone", e.target.value)
											}
											type="tel"
											value={employee.phone}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="alternatePhone">Alternate Phone</Label>
									<div className="relative">
										<Phone className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
										<Input
											className="pl-9"
											id="alternatePhone"
											onChange={(e) =>
												handleFieldChange("alternatePhone", e.target.value)
											}
											type="tel"
											value={employee.alternatePhone}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="dateOfBirth">Date of Birth</Label>
									<Input
										id="dateOfBirth"
										onChange={(e) =>
											handleFieldChange("dateOfBirth", e.target.value)
										}
										type="date"
										value={employee.dateOfBirth}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="ssn">Social Security Number (Last 4)</Label>
									<Input
										disabled
										id="ssn"
										placeholder="****-5678"
										value={employee.ssn}
									/>
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<h3 className="font-medium">Address</h3>
								<div className="grid gap-6 md:grid-cols-2">
									<div className="space-y-2 md:col-span-2">
										<Label htmlFor="address">Street Address</Label>
										<div className="relative">
											<MapPin className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
											<Input
												className="pl-9"
												id="address"
												onChange={(e) =>
													handleFieldChange("address", e.target.value)
												}
												value={employee.address}
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="city">City</Label>
										<Input
											id="city"
											onChange={(e) =>
												handleFieldChange("city", e.target.value)
											}
											value={employee.city}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="state">State</Label>
										<Select
											onValueChange={(value) =>
												handleFieldChange("state", value)
											}
											value={employee.state}
										>
											<SelectTrigger id="state">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="CA">California</SelectItem>
												<SelectItem value="NY">New York</SelectItem>
												<SelectItem value="TX">Texas</SelectItem>
												{/* Add more states */}
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label htmlFor="zipCode">ZIP Code</Label>
										<Input
											id="zipCode"
											onChange={(e) =>
												handleFieldChange("zipCode", e.target.value)
											}
											value={employee.zipCode}
										/>
									</div>
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<h3 className="font-medium">Emergency Contact</h3>
								<div className="grid gap-6 md:grid-cols-3">
									<div className="space-y-2">
										<Label htmlFor="emergencyName">Contact Name</Label>
										<Input
											id="emergencyName"
											onChange={(e) =>
												handleFieldChange(
													"emergencyContactName",
													e.target.value,
												)
											}
											value={employee.emergencyContactName}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="emergencyPhone">Contact Phone</Label>
										<Input
											id="emergencyPhone"
											onChange={(e) =>
												handleFieldChange(
													"emergencyContactPhone",
													e.target.value,
												)
											}
											type="tel"
											value={employee.emergencyContactPhone}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="emergencyRelationship">Relationship</Label>
										<Input
											id="emergencyRelationship"
											onChange={(e) =>
												handleFieldChange(
													"emergencyContactRelationship",
													e.target.value,
												)
											}
											value={employee.emergencyContactRelationship}
										/>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Permissions & Role */}
				<TabsContent className="space-y-6" value="permissions">
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="font-bold text-2xl tracking-tight">
									Role & Permissions
								</h2>
								<p className="text-muted-foreground">
									Manage this team member's role and custom permissions
								</p>
							</div>
							{hasUnsavedChanges && (
								<Button
									disabled={isSavingPermissions}
									onClick={handleSavePermissions}
									size="lg"
								>
									{isSavingPermissions ? (
										<>
											<Save className="mr-2 size-4 animate-spin" />
											Saving...
										</>
									) : (
										<>
											<Save className="mr-2 size-4" />
											Save Changes
										</>
									)}
								</Button>
							)}
						</div>

						<PermissionsEditor
							currentPermissions={customPermissions}
							currentRole={currentRole}
							isSaving={isSavingPermissions}
							onPermissionsChange={handlePermissionsChange}
							onRoleChange={handleRoleChange}
						/>
					</div>
				</TabsContent>

				{/* Employment Details */}
				<TabsContent className="space-y-6" value="employment">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Briefcase className="h-5 w-5 text-primary" />
								Employment Details
							</CardTitle>
							<CardDescription>
								Job title, department, and work information
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="employeeId">Employee ID</Label>
									<Input disabled id="employeeId" value={employee.employeeId} />
								</div>

								<div className="space-y-2">
									<Label htmlFor="hireDate">Hire Date</Label>
									<Input
										id="hireDate"
										onChange={(e) =>
											handleFieldChange("hireDate", e.target.value)
										}
										type="date"
										value={employee.hireDate}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="employmentType">Employment Type</Label>
									<Select
										onValueChange={(value) =>
											handleFieldChange(
												"employmentType",
												value as EmploymentType,
											)
										}
										value={employee.employmentType}
									>
										<SelectTrigger id="employmentType">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="full-time">Full-Time</SelectItem>
											<SelectItem value="part-time">Part-Time</SelectItem>
											<SelectItem value="contractor">Contractor</SelectItem>
											<SelectItem value="intern">Intern</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="employmentStatus">Employment Status</Label>
									<Select
										onValueChange={(value) =>
											handleFieldChange(
												"employmentStatus",
												value as EmploymentStatus,
											)
										}
										value={employee.employmentStatus}
									>
										<SelectTrigger id="employmentStatus">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="active">Active</SelectItem>
											<SelectItem value="on-leave">On Leave</SelectItem>
											<SelectItem value="suspended">Suspended</SelectItem>
											<SelectItem value="terminated">Terminated</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="jobTitle">Job Title</Label>
									<Input
										id="jobTitle"
										onChange={(e) =>
											handleFieldChange("jobTitle", e.target.value)
										}
										value={employee.jobTitle}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="workLocation">Work Location</Label>
									<Input
										id="workLocation"
										onChange={(e) =>
											handleFieldChange("workLocation", e.target.value)
										}
										value={employee.workLocation}
									/>
								</div>

								<div className="space-y-2 md:col-span-2">
									<Label htmlFor="workSchedule">Work Schedule</Label>
									<Input
										id="workSchedule"
										onChange={(e) =>
											handleFieldChange("workSchedule", e.target.value)
										}
										placeholder="e.g., Monday-Friday, 8:00 AM - 5:00 PM"
										value={employee.workSchedule}
									/>
								</div>
							</div>

							{employee.employmentStatus === "terminated" && (
								<>
									<Separator />
									<Card className="border-destructive/50 bg-destructive/5">
										<CardContent className="space-y-4 pt-6">
											<h3 className="font-medium text-destructive dark:text-destructive">
												Termination Information
											</h3>
											<div className="grid gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label htmlFor="terminationDate">
														Termination Date
													</Label>
													<Input
														id="terminationDate"
														onChange={(e) =>
															handleFieldChange(
																"terminationDate",
																e.target.value,
															)
														}
														type="date"
														value={employee.terminationDate}
													/>
												</div>
												<div className="space-y-2 md:col-span-2">
													<Label htmlFor="terminationReason">Reason</Label>
													<Textarea
														id="terminationReason"
														onChange={(e) =>
															handleFieldChange(
																"terminationReason",
																e.target.value,
															)
														}
														value={employee.terminationReason}
													/>
												</div>
											</div>
										</CardContent>
									</Card>
								</>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Payroll Information */}
				<TabsContent className="space-y-6" value="payroll">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<DollarSign className="h-5 w-5 text-primary" />
								Payroll Information
							</CardTitle>
							<CardDescription>
								Compensation and payment details
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="payType">Pay Type</Label>
									<Select
										onValueChange={(value) =>
											handleFieldChange("payType", value as PayType)
										}
										value={employee.payType}
									>
										<SelectTrigger id="payType">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="hourly">Hourly</SelectItem>
											<SelectItem value="salary">Salary</SelectItem>
											<SelectItem value="commission">Commission</SelectItem>
											<SelectItem value="hybrid">Hybrid</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{(employee.payType === "hourly" ||
									employee.payType === "hybrid") && (
									<div className="space-y-2">
										<Label htmlFor="hourlyRate">Hourly Rate ($/hour)</Label>
										<Input
											id="hourlyRate"
											min={0}
											onChange={(e) =>
												handleFieldChange(
													"hourlyRate",
													Number.parseFloat(e.target.value),
												)
											}
											step={0.25}
											type="number"
											value={employee.hourlyRate}
										/>
									</div>
								)}

								{(employee.payType === "salary" ||
									employee.payType === "hybrid") && (
									<div className="space-y-2">
										<Label htmlFor="annualSalary">Annual Salary ($/year)</Label>
										<Input
											id="annualSalary"
											min={0}
											onChange={(e) =>
												handleFieldChange(
													"annualSalary",
													Number.parseFloat(e.target.value),
												)
											}
											step={1000}
											type="number"
											value={employee.annualSalary}
										/>
									</div>
								)}

								{(employee.payType === "commission" ||
									employee.payType === "hybrid") && (
									<div className="space-y-2">
										<Label htmlFor="commissionRate">Commission Rate (%)</Label>
										<Input
											id="commissionRate"
											max={100}
											min={0}
											onChange={(e) =>
												handleFieldChange(
													"commissionRate",
													Number.parseFloat(e.target.value),
												)
											}
											step={0.5}
											type="number"
											value={employee.commissionRate}
										/>
									</div>
								)}

								<div className="flex items-center justify-between space-y-2 md:col-span-2">
									<div className="space-y-0.5">
										<Label htmlFor="overtimeEligible">Overtime Eligible</Label>
										<p className="text-muted-foreground text-sm">
											Eligible for overtime pay
										</p>
									</div>
									<Switch
										checked={employee.overtimeEligible}
										id="overtimeEligible"
										onCheckedChange={(checked) =>
											handleFieldChange("overtimeEligible", checked)
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="payrollSchedule">Payroll Schedule</Label>
									<Select
										onValueChange={(value) =>
											handleFieldChange(
												"payrollSchedule",
												value as EmployeeProfile["payrollSchedule"],
											)
										}
										value={employee.payrollSchedule}
									>
										<SelectTrigger id="payrollSchedule">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="weekly">Weekly</SelectItem>
											<SelectItem value="biweekly">Bi-weekly</SelectItem>
											<SelectItem value="semimonthly">Semi-monthly</SelectItem>
											<SelectItem value="monthly">Monthly</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="paymentMethod">Payment Method</Label>
									<Select
										onValueChange={(value) =>
											handleFieldChange(
												"paymentMethod",
												value as EmployeeProfile["paymentMethod"],
											)
										}
										value={employee.paymentMethod}
									>
										<SelectTrigger id="paymentMethod">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="direct-deposit">
												Direct Deposit
											</SelectItem>
											<SelectItem value="check">Paper Check</SelectItem>
											<SelectItem value="cash">Cash</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							{employee.paymentMethod === "direct-deposit" && (
								<>
									<Separator />
									<div className="space-y-4">
										<h3 className="font-medium">Banking Information</h3>
										<div className="grid gap-6 md:grid-cols-2">
											<div className="space-y-2">
												<Label htmlFor="bankName">Bank Name</Label>
												<Input
													id="bankName"
													onChange={(e) =>
														handleFieldChange("bankName", e.target.value)
													}
													value={employee.bankName}
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="routingNumber">Routing Number</Label>
												<Input
													id="routingNumber"
													onChange={(e) =>
														handleFieldChange("routingNumber", e.target.value)
													}
													value={employee.routingNumber}
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="accountNumber">
													Account Number (Last 4)
												</Label>
												<Input
													disabled
													id="accountNumber"
													value={employee.accountNumber}
												/>
											</div>
										</div>
									</div>
								</>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Tax Information */}
				<TabsContent className="space-y-6" value="tax">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Percent className="h-5 w-5 text-primary" />
								Tax Information
							</CardTitle>
							<CardDescription>
								Tax withholding and compliance documents
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<h3 className="font-medium">Federal Tax Withholding</h3>
								<div className="grid gap-6 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="federalFilingStatus">Filing Status</Label>
										<Select
											onValueChange={(value) =>
												handleFieldChange(
													"federalFilingStatus",
													value as EmployeeProfile["federalFilingStatus"],
												)
											}
											value={employee.federalFilingStatus}
										>
											<SelectTrigger id="federalFilingStatus">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="single">Single</SelectItem>
												<SelectItem value="married">
													Married Filing Jointly
												</SelectItem>
												<SelectItem value="married-separate">
													Married Filing Separately
												</SelectItem>
												<SelectItem value="head-of-household">
													Head of Household
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label htmlFor="federalAllowances">Allowances</Label>
										<Input
											id="federalAllowances"
											max={20}
											min={0}
											onChange={(e) =>
												handleFieldChange(
													"federalAllowances",
													Number.parseInt(e.target.value, 10),
												)
											}
											type="number"
											value={employee.federalAllowances}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="additionalWithholding">
											Additional Withholding ($/pay period)
										</Label>
										<Input
											id="additionalWithholding"
											min={0}
											onChange={(e) =>
												handleFieldChange(
													"additionalWithholding",
													Number.parseFloat(e.target.value),
												)
											}
											step={1}
											type="number"
											value={employee.additionalWithholding}
										/>
									</div>

									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<Label htmlFor="taxExempt">Tax Exempt</Label>
											<p className="text-muted-foreground text-sm">
												Exempt from federal tax withholding
											</p>
										</div>
										<Switch
											checked={employee.taxExempt}
											id="taxExempt"
											onCheckedChange={(checked) =>
												handleFieldChange("taxExempt", checked)
											}
										/>
									</div>
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<h3 className="font-medium">State Tax Withholding</h3>
								<div className="grid gap-6 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="stateFilingStatus">Filing Status</Label>
										<Input
											id="stateFilingStatus"
											onChange={(e) =>
												handleFieldChange("stateFilingStatus", e.target.value)
											}
											value={employee.stateFilingStatus}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="stateAllowances">Allowances</Label>
										<Input
											id="stateAllowances"
											max={20}
											min={0}
											onChange={(e) =>
												handleFieldChange(
													"stateAllowances",
													Number.parseInt(e.target.value, 10),
												)
											}
											type="number"
											value={employee.stateAllowances}
										/>
									</div>
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<h3 className="font-medium">Compliance Documents</h3>
								<div className="grid gap-4 md:grid-cols-2">
									<Card>
										<CardContent className="flex items-center justify-between pt-6">
											<div className="flex items-center gap-3">
												<FileText className="h-5 w-5 text-muted-foreground" />
												<div>
													<p className="font-medium text-sm">W-4 Form</p>
													<p className="text-muted-foreground text-xs">
														Federal withholding certificate
													</p>
												</div>
											</div>
											{employee.w4OnFile ? (
												<CheckCircle2 className="h-5 w-5 text-success" />
											) : (
												<XCircle className="h-5 w-5 text-destructive" />
											)}
										</CardContent>
									</Card>

									<Card>
										<CardContent className="flex items-center justify-between pt-6">
											<div className="flex items-center gap-3">
												<IdCard className="h-5 w-5 text-muted-foreground" />
												<div>
													<p className="font-medium text-sm">I-9 Form</p>
													<p className="text-muted-foreground text-xs">
														Employment eligibility
													</p>
												</div>
											</div>
											{employee.i9OnFile ? (
												<CheckCircle2 className="h-5 w-5 text-success" />
											) : (
												<XCircle className="h-5 w-5 text-destructive" />
											)}
										</CardContent>
									</Card>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Benefits */}
				<TabsContent className="space-y-6" value="benefits">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Shield className="h-5 w-5 text-primary" />
								Benefits & Deductions
							</CardTitle>
							<CardDescription>
								Insurance, retirement, and other benefits
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Health Insurance */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="healthInsurance">Health Insurance</Label>
										<p className="text-muted-foreground text-sm">
											Medical insurance coverage
										</p>
									</div>
									<Switch
										checked={employee.healthInsurance}
										id="healthInsurance"
										onCheckedChange={(checked) =>
											handleFieldChange("healthInsurance", checked)
										}
									/>
								</div>

								{employee.healthInsurance && (
									<div className="ml-6 grid gap-4 border-l-2 pl-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="healthPlan">Plan Type</Label>
											<Input
												id="healthPlan"
												onChange={(e) =>
													handleFieldChange(
														"healthInsurancePlan",
														e.target.value,
													)
												}
												value={employee.healthInsurancePlan}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="healthDeduction">
												Deduction ($/pay period)
											</Label>
											<Input
												id="healthDeduction"
												min={0}
												onChange={(e) =>
													handleFieldChange(
														"healthInsuranceDeduction",
														Number.parseFloat(e.target.value),
													)
												}
												step={0.01}
												type="number"
												value={employee.healthInsuranceDeduction}
											/>
										</div>
									</div>
								)}
							</div>

							<Separator />

							{/* Dental Insurance */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="dentalInsurance">Dental Insurance</Label>
										<p className="text-muted-foreground text-sm">
											Dental coverage
										</p>
									</div>
									<Switch
										checked={employee.dentalInsurance}
										id="dentalInsurance"
										onCheckedChange={(checked) =>
											handleFieldChange("dentalInsurance", checked)
										}
									/>
								</div>

								{employee.dentalInsurance && (
									<div className="ml-6 border-l-2 pl-4">
										<div className="space-y-2">
											<Label htmlFor="dentalDeduction">
												Deduction ($/pay period)
											</Label>
											<Input
												className="max-w-xs"
												id="dentalDeduction"
												min={0}
												onChange={(e) =>
													handleFieldChange(
														"dentalInsuranceDeduction",
														Number.parseFloat(e.target.value),
													)
												}
												step={0.01}
												type="number"
												value={employee.dentalInsuranceDeduction}
											/>
										</div>
									</div>
								)}
							</div>

							<Separator />

							{/* Vision Insurance */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="visionInsurance">Vision Insurance</Label>
										<p className="text-muted-foreground text-sm">
											Vision coverage
										</p>
									</div>
									<Switch
										checked={employee.visionInsurance}
										id="visionInsurance"
										onCheckedChange={(checked) =>
											handleFieldChange("visionInsurance", checked)
										}
									/>
								</div>

								{employee.visionInsurance && (
									<div className="ml-6 border-l-2 pl-4">
										<div className="space-y-2">
											<Label htmlFor="visionDeduction">
												Deduction ($/pay period)
											</Label>
											<Input
												className="max-w-xs"
												id="visionDeduction"
												min={0}
												onChange={(e) =>
													handleFieldChange(
														"visionInsuranceDeduction",
														Number.parseFloat(e.target.value),
													)
												}
												step={0.01}
												type="number"
												value={employee.visionInsuranceDeduction}
											/>
										</div>
									</div>
								)}
							</div>

							<Separator />

							{/* 401(k) Retirement */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="retirement401k">401(k) Retirement</Label>
										<p className="text-muted-foreground text-sm">
											Retirement savings plan
										</p>
									</div>
									<Switch
										checked={employee.retirement401k}
										id="retirement401k"
										onCheckedChange={(checked) =>
											handleFieldChange("retirement401k", checked)
										}
									/>
								</div>

								{employee.retirement401k && (
									<div className="ml-6 grid gap-4 border-l-2 pl-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="retirement401kPercent">
												Contribution (%)
											</Label>
											<Input
												id="retirement401kPercent"
												max={100}
												min={0}
												onChange={(e) =>
													handleFieldChange(
														"retirement401kPercent",
														Number.parseFloat(e.target.value),
													)
												}
												step={0.5}
												type="number"
												value={employee.retirement401kPercent}
											/>
										</div>
										<div className="flex items-center justify-between">
											<Label htmlFor="retirement401kMatch">Company Match</Label>
											<Switch
												checked={employee.retirement401kMatch}
												id="retirement401kMatch"
												onCheckedChange={(checked) =>
													handleFieldChange("retirement401kMatch", checked)
												}
											/>
										</div>
									</div>
								)}
							</div>

							<Separator />

							{/* Life Insurance */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="lifeInsurance">Life Insurance</Label>
										<p className="text-muted-foreground text-sm">
											Life insurance coverage
										</p>
									</div>
									<Switch
										checked={employee.lifeInsurance}
										id="lifeInsurance"
										onCheckedChange={(checked) =>
											handleFieldChange("lifeInsurance", checked)
										}
									/>
								</div>

								{employee.lifeInsurance && (
									<div className="ml-6 border-l-2 pl-4">
										<div className="space-y-2">
											<Label htmlFor="lifeInsuranceCoverage">
												Coverage Amount ($)
											</Label>
											<Input
												className="max-w-xs"
												id="lifeInsuranceCoverage"
												min={0}
												onChange={(e) =>
													handleFieldChange(
														"lifeInsuranceCoverage",
														Number.parseFloat(e.target.value),
													)
												}
												step={10_000}
												type="number"
												value={employee.lifeInsuranceCoverage}
											/>
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Time Off */}
				<TabsContent className="space-y-6" value="time-off">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Calendar className="h-5 w-5 text-primary" />
								Time Off & Leave
							</CardTitle>
							<CardDescription>
								PTO, sick leave, and vacation tracking
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-6 md:grid-cols-2">
								{/* PTO Balance */}
								<Card>
									<CardContent className="pt-6">
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<div>
													<p className="font-medium text-sm">PTO Balance</p>
													<p className="text-muted-foreground text-xs">
														Paid Time Off
													</p>
												</div>
												<p className="font-bold text-2xl">
													{employee.ptoBalance}
												</p>
											</div>
											<div className="space-y-1">
												<div className="flex justify-between text-xs">
													<span>Accrual Rate</span>
													<span>{employee.ptoAccrualRate} hrs/period</span>
												</div>
												<div className="flex justify-between text-xs">
													<span>Used This Year</span>
													<span>{employee.vacationDaysUsed} hours</span>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Sick Leave Balance */}
								<Card>
									<CardContent className="pt-6">
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<div>
													<p className="font-medium text-sm">
														Sick Leave Balance
													</p>
													<p className="text-muted-foreground text-xs">
														Sick Days
													</p>
												</div>
												<p className="font-bold text-2xl">
													{employee.sickLeaveBalance}
												</p>
											</div>
											<div className="space-y-1">
												<div className="flex justify-between text-xs">
													<span>Accrual Rate</span>
													<span>
														{employee.sickLeaveAccrualRate} hrs/period
													</span>
												</div>
												<div className="flex justify-between text-xs">
													<span>Used This Year</span>
													<span>{employee.sickDaysUsed} hours</span>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>

							<Separator />

							<div className="space-y-4">
								<h3 className="font-medium">Accrual Settings</h3>
								<div className="grid gap-6 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="ptoAccrual">
											PTO Accrual (hours/pay period)
										</Label>
										<Input
											id="ptoAccrual"
											min={0}
											onChange={(e) =>
												handleFieldChange(
													"ptoAccrualRate",
													Number.parseFloat(e.target.value),
												)
											}
											step={0.01}
											type="number"
											value={employee.ptoAccrualRate}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="sickLeaveAccrual">
											Sick Leave Accrual (hours/pay period)
										</Label>
										<Input
											id="sickLeaveAccrual"
											min={0}
											onChange={(e) =>
												handleFieldChange(
													"sickLeaveAccrualRate",
													Number.parseFloat(e.target.value),
												)
											}
											step={0.01}
											type="number"
											value={employee.sickLeaveAccrualRate}
										/>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Skills & Certifications */}
				<TabsContent className="space-y-6" value="skills">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Shield className="h-5 w-5 text-primary" />
								Skills & Certifications
							</CardTitle>
							<CardDescription>
								Professional skills, certifications, and licenses
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Skills */}
							<div className="space-y-4">
								<h3 className="font-medium">Skills</h3>
								<div className="flex flex-wrap gap-2">
									{employee.skills.map((skill, index) => (
										<Badge key={index} variant="secondary">
											{skill}
										</Badge>
									))}
									<Button size="sm" type="button" variant="outline">
										+ Add Skill
									</Button>
								</div>
							</div>

							<Separator />

							{/* Certifications */}
							<div className="space-y-4">
								<h3 className="font-medium">Certifications</h3>
								<div className="space-y-3">
									{employee.certifications.map((cert, index) => (
										<Card key={index}>
											<CardContent className="pt-6">
												<div className="flex items-start justify-between">
													<div className="space-y-1">
														<p className="font-medium">{cert.name}</p>
														<p className="text-muted-foreground text-sm">
															Issued by {cert.issuer} •{" "}
															{new Date(cert.issueDate).toLocaleDateString()}
														</p>
														{cert.expiryDate && (
															<p className="text-muted-foreground text-xs">
																Expires:{" "}
																{new Date(cert.expiryDate).toLocaleDateString()}
															</p>
														)}
														{cert.certificationNumber && (
															<p className="text-muted-foreground text-xs">
																#{cert.certificationNumber}
															</p>
														)}
													</div>
													<CheckCircle2 className="h-5 w-5 text-success" />
												</div>
											</CardContent>
										</Card>
									))}
									<Button size="sm" type="button" variant="outline">
										+ Add Certification
									</Button>
								</div>
							</div>

							<Separator />

							{/* Licenses */}
							<div className="space-y-4">
								<h3 className="font-medium">Licenses</h3>
								<div className="space-y-3">
									{employee.licenses.map((license, index) => (
										<Card key={index}>
											<CardContent className="pt-6">
												<div className="flex items-start justify-between">
													<div className="space-y-1">
														<p className="font-medium">{license.type}</p>
														<p className="text-muted-foreground text-sm">
															{license.state} • #{license.number}
														</p>
														<p className="text-muted-foreground text-xs">
															Issued:{" "}
															{new Date(license.issueDate).toLocaleDateString()}{" "}
															• Expires:{" "}
															{new Date(
																license.expiryDate,
															).toLocaleDateString()}
														</p>
													</div>
													<CheckCircle2 className="h-5 w-5 text-success" />
												</div>
											</CardContent>
										</Card>
									))}
									<Button size="sm" type="button" variant="outline">
										+ Add License
									</Button>
								</div>
							</div>

							<Separator />

							{/* Performance */}
							<div className="space-y-4">
								<h3 className="font-medium">Performance</h3>
								<div className="grid gap-4 md:grid-cols-3">
									<div className="space-y-2">
										<Label htmlFor="performanceRating">
											Performance Rating
										</Label>
										<Input
											id="performanceRating"
											max={5}
											min={0}
											onChange={(e) =>
												handleFieldChange(
													"performanceRating",
													Number.parseFloat(e.target.value),
												)
											}
											step={0.1}
											type="number"
											value={employee.performanceRating}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="lastReviewDate">Last Review</Label>
										<Input
											id="lastReviewDate"
											onChange={(e) =>
												handleFieldChange("lastReviewDate", e.target.value)
											}
											type="date"
											value={employee.lastReviewDate}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="nextReviewDate">Next Review</Label>
										<Input
											id="nextReviewDate"
											onChange={(e) =>
												handleFieldChange("nextReviewDate", e.target.value)
											}
											type="date"
											value={employee.nextReviewDate}
										/>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Documents */}
				<TabsContent className="space-y-6" value="documents">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<File className="h-5 w-5 text-primary" />
								Documents
							</CardTitle>
							<CardDescription>Employee documents and files</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3">
								{employee.documents.map((doc) => (
									<Card key={doc.id}>
										<CardContent className="flex items-center justify-between pt-6">
											<div className="flex items-center gap-3">
												<FileText className="h-5 w-5 text-muted-foreground" />
												<div>
													<p className="font-medium text-sm">{doc.name}</p>
													<p className="text-muted-foreground text-xs">
														{doc.type} • {doc.size} •{" "}
														{new Date(doc.uploadDate).toLocaleDateString()}
													</p>
												</div>
											</div>
											<Button size="sm" type="button" variant="ghost">
												View
											</Button>
										</CardContent>
									</Card>
								))}
							</div>

							<Button className="w-full" type="button" variant="outline">
								<Upload className="mr-2 size-4" />
								Upload Document
							</Button>

							<Separator />

							<div className="space-y-2">
								<Label htmlFor="notes">Internal Notes</Label>
								<Textarea
									className="min-h-[150px]"
									id="notes"
									onChange={(e) => handleFieldChange("notes", e.target.value)}
									placeholder="Add internal notes about this employee..."
									value={employee.notes}
								/>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Save Button (sticky at bottom) */}
			{hasUnsavedChanges && (
				<div className="sticky bottom-4 flex justify-end gap-2">
					<Button onClick={() => setHasUnsavedChanges(false)} variant="outline">
						Cancel
					</Button>
					<Button onClick={handleSave} size="lg">
						<Save className="mr-2 size-4" />
						Save All Changes
					</Button>
				</div>
			)}
		</div>
	);
}

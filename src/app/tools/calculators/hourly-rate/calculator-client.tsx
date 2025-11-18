"use client";

import {
	BarChart3,
	Briefcase,
	Calculator,
	CalendarDays,
	DollarSign,
	Info,
	Target,
	TrendingUp,
	Wrench,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAnalytics, useFeatureTracking } from "@/lib/analytics";

const CALCULATION_TRACKING_DEBOUNCE_MS = 1000;

const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
	maximumFractionDigits: 2,
});

function toNumber(value: string) {
	const n = Number.parseFloat(value);
	return Number.isNaN(n) ? 0 : n;
}

function toPercent(value: string) {
	return toNumber(value) / 100;
}

function formatCurrency(value: number) {
	if (!Number.isFinite(value)) {
		return "-";
	}
	return currencyFormatter.format(value);
}

function formatNumber(value: number) {
	if (!Number.isFinite(value)) {
		return "-";
	}
	return numberFormatter.format(value);
}

type InputState = {
	// Time & capacity
	workDaysPerWeek: string;
	weeksPerYear: string;
	holidaysPerYear: string;
	vacationDaysPerYear: string;
	personalDaysPerYear: string;
	dailyWorkHours: string;
	serviceVehicles: string;
	billableHoursSoldPercent: string;

	// Operating expenses
	ownerPay: string;
	plumber: string;
	apprenticesHelpers: string;
	advertisingMarketing: string;
	bankMerchantFees: string;
	debtService: string;
	insuranceAuto: string;
	insuranceBusiness: string;
	insuranceHealth: string;
	internetExpense: string;
	lossRefund: string;
	membershipDues: string;
	officeSalaries: string;
	officeSupplies: string;
	professionalLicensing: string;
	professionalServices: string;
	rentLease: string;
	replacementAllowance: string;
	suppliesExpense: string;
	employerTaxPercent: string;
	telephoneExpense: string;
	uniformsExpense: string;
	utilities: string;
	vehicleFuel: string;
	vehicleLease: string;
	vehicleMaintenance: string;
	otherExpenses: string;

	// Growth expenses
	growthDevelopment: string;
	growthEquipment: string;
	growthVehicle: string;
	growthOther: string;

	// Profit
	profitPercent: string;
};

export default function HonestHourlyRateCalculator() {
	const [_activeSection, setActiveSection] = useState("overview");
	const { track } = useAnalytics();
	const { trackFeatureUse } = useFeatureTracking();

	const [inputs, setInputs] = useState<InputState>({
		workDaysPerWeek: "5",
		weeksPerYear: "52",
		holidaysPerYear: "8",
		vacationDaysPerYear: "10",
		personalDaysPerYear: "5",
		dailyWorkHours: "8",
		serviceVehicles: "3",
		billableHoursSoldPercent: "75",
		ownerPay: "80000",
		plumber: "110000",
		apprenticesHelpers: "45000",
		advertisingMarketing: "12000",
		bankMerchantFees: "3600",
		debtService: "0",
		insuranceAuto: "9000",
		insuranceBusiness: "4800",
		insuranceHealth: "18000",
		internetExpense: "1200",
		lossRefund: "2400",
		membershipDues: "600",
		officeSalaries: "35000",
		officeSupplies: "2400",
		professionalLicensing: "1500",
		professionalServices: "6000",
		rentLease: "24000",
		replacementAllowance: "6000",
		suppliesExpense: "15000",
		employerTaxPercent: "12",
		telephoneExpense: "3000",
		uniformsExpense: "1800",
		utilities: "4800",
		vehicleFuel: "12000",
		vehicleLease: "18000",
		vehicleMaintenance: "6000",
		otherExpenses: "3000",
		growthDevelopment: "8000",
		growthEquipment: "15000",
		growthVehicle: "0",
		growthOther: "5000",
		profitPercent: "50",
	});

	const calculations = useMemo(() => {
		const workDaysPerWeek = toNumber(inputs.workDaysPerWeek);
		const weeksPerYear = toNumber(inputs.weeksPerYear);
		const holidaysPerYear = toNumber(inputs.holidaysPerYear);
		const vacationDaysPerYear = toNumber(inputs.vacationDaysPerYear);
		const personalDaysPerYear = toNumber(inputs.personalDaysPerYear);
		const dailyWorkHours = toNumber(inputs.dailyWorkHours);
		const serviceVehicles = toNumber(inputs.serviceVehicles);
		const billableHoursSoldPct = toPercent(inputs.billableHoursSoldPercent);

		const totalWorkDaysPerYearRaw =
			workDaysPerWeek * weeksPerYear -
			(holidaysPerYear + vacationDaysPerYear + personalDaysPerYear);
		const totalWorkDaysPerYear = Math.max(0, totalWorkDaysPerYearRaw);
		const totalWorkHoursPerYear = totalWorkDaysPerYear * dailyWorkHours;
		const availableBillableHours = totalWorkHoursPerYear * serviceVehicles;
		const annualBillableHours = availableBillableHours * billableHoursSoldPct;

		const ownerPay = toNumber(inputs.ownerPay);
		const plumber = toNumber(inputs.plumber);
		const apprenticesHelpers = toNumber(inputs.apprenticesHelpers);
		const officeSalaries = toNumber(inputs.officeSalaries);
		const employerTaxRate = toPercent(inputs.employerTaxPercent);
		const employerTaxesAnnual =
			(ownerPay + plumber + apprenticesHelpers + officeSalaries) *
			employerTaxRate;

		const operatingExpenses = {
			ownerPay,
			plumber,
			apprenticesHelpers,
			advertisingMarketing: toNumber(inputs.advertisingMarketing),
			bankMerchantFees: toNumber(inputs.bankMerchantFees),
			debtService: toNumber(inputs.debtService),
			insuranceAuto: toNumber(inputs.insuranceAuto),
			insuranceBusiness: toNumber(inputs.insuranceBusiness),
			insuranceHealth: toNumber(inputs.insuranceHealth),
			internetExpense: toNumber(inputs.internetExpense),
			lossRefund: toNumber(inputs.lossRefund),
			membershipDues: toNumber(inputs.membershipDues),
			officeSalaries,
			officeSupplies: toNumber(inputs.officeSupplies),
			professionalLicensing: toNumber(inputs.professionalLicensing),
			professionalServices: toNumber(inputs.professionalServices),
			rentLease: toNumber(inputs.rentLease),
			replacementAllowance: toNumber(inputs.replacementAllowance),
			suppliesExpense: toNumber(inputs.suppliesExpense),
			employerTaxesAnnual,
			telephoneExpense: toNumber(inputs.telephoneExpense),
			uniformsExpense: toNumber(inputs.uniformsExpense),
			utilities: toNumber(inputs.utilities),
			vehicleFuel: toNumber(inputs.vehicleFuel),
			vehicleLease: toNumber(inputs.vehicleLease),
			vehicleMaintenance: toNumber(inputs.vehicleMaintenance),
			otherExpenses: toNumber(inputs.otherExpenses),
		};

		const hourlyFromAnnual = (annual: number) =>
			annualBillableHours > 0 ? annual / annualBillableHours : 0;

		const totalOperatingAnnual = Object.values(operatingExpenses).reduce(
			(sum, val) => sum + val,
			0,
		);
		const totalOperatingHourly = hourlyFromAnnual(totalOperatingAnnual);

		const growthExpenses = {
			development: toNumber(inputs.growthDevelopment),
			equipment: toNumber(inputs.growthEquipment),
			vehicle: toNumber(inputs.growthVehicle),
			other: toNumber(inputs.growthOther),
		};

		const totalGrowthAnnual = Object.values(growthExpenses).reduce(
			(sum, val) => sum + val,
			0,
		);
		const totalGrowthHourly = hourlyFromAnnual(totalGrowthAnnual);

		const totalExpensesAnnual = totalOperatingAnnual + totalGrowthAnnual;
		const totalExpensesHourly = totalOperatingHourly + totalGrowthHourly;
		const hourlyExpenseRate = totalExpensesHourly;
		const profitPercent = toPercent(inputs.profitPercent);
		const honestHourlyRate =
			profitPercent < 1 ? hourlyExpenseRate / (1 - profitPercent) : Number.NaN;

		const dailyExpense =
			totalWorkDaysPerYear > 0 ? totalExpensesAnnual / totalWorkDaysPerYear : 0;
		const dailyBillableHours =
			totalWorkDaysPerYear > 0 ? annualBillableHours / totalWorkDaysPerYear : 0;
		const dailyBreakEvenRevenue = dailyExpense;
		const dailyRevenueCapacity = dailyBillableHours * honestHourlyRate;

		return {
			totalWorkDaysPerYear,
			totalWorkHoursPerYear,
			availableBillableHours,
			annualBillableHours,
			employerTaxesAnnual,
			totalOperatingAnnual,
			totalOperatingHourly,
			totalGrowthAnnual,
			totalGrowthHourly,
			totalExpensesAnnual,
			totalExpensesHourly,
			hourlyExpenseRate,
			honestHourlyRate,
			hourlyFromAnnual,
			dailyExpense,
			dailyBillableHours,
			dailyBreakEvenRevenue,
			dailyRevenueCapacity,
		};
	}, [inputs]);

	// Track tool opened on mount
	useEffect(() => {
		track({
			name: "tool.opened",
			properties: {
				toolName: "hourly-rate-calculator",
				toolCategory: "calculator",
			},
		});
		trackFeatureUse("hourly_rate_calculator", { firstTime: true });
	}, [track, trackFeatureUse]);

	// Track calculator completion when a valid rate is calculated
	useEffect(() => {
		if (
			Number.isFinite(calculations.honestHourlyRate) &&
			calculations.honestHourlyRate > 0
		) {
			const timeoutId = setTimeout(() => {
				track({
					name: "calculator.used",
					properties: {
						calculatorType: "hourly-rate",
						inputs: {
							workDaysPerWeek: inputs.workDaysPerWeek,
							serviceVehicles: inputs.serviceVehicles,
							profitPercent: inputs.profitPercent,
						},
						result: {
							hourlyRate: calculations.honestHourlyRate,
							annualBillableHours: calculations.annualBillableHours,
							totalExpenses: calculations.totalExpensesAnnual,
						},
					},
				});
			}, CALCULATION_TRACKING_DEBOUNCE_MS);

			return () => clearTimeout(timeoutId);
		}
	}, [
		calculations.honestHourlyRate,
		calculations.annualBillableHours,
		calculations.totalExpensesAnnual,
		inputs.workDaysPerWeek,
		inputs.serviceVehicles,
		inputs.profitPercent,
		track,
	]);

	const handleChange =
		(field: keyof InputState) => (e: React.ChangeEvent<HTMLInputElement>) => {
			setInputs((prev) => ({
				...prev,
				[field]: e.target.value,
			}));
		};

	const _scrollToSection = (sectionId: string) => {
		setActiveSection(sectionId);
		const element = document.getElementById(sectionId);
		if (element) {
			const offset = 100;
			const elementPosition =
				element.getBoundingClientRect().top + window.pageYOffset;
			window.scrollTo({
				top: elementPosition - offset,
				behavior: "smooth",
			});

			// Track section navigation
			track({
				name: "ui.tab_switched",
				properties: {
					tabName: sectionId,
					section: "calculator",
				},
			});
		}
	};

	const LabelWithTooltip = ({
		htmlFor,
		label,
		tooltip,
	}: {
		htmlFor: string;
		label: string;
		tooltip: string;
	}) => (
		<div className="flex items-center gap-1.5">
			<Label className="text-sm font-medium" htmlFor={htmlFor}>
				{label}
			</Label>
			<Tooltip>
				<TooltipTrigger asChild>
					<Info className="text-muted-foreground h-3.5 w-3.5 cursor-help" />
				</TooltipTrigger>
				<TooltipContent className="max-w-xs">
					<p className="text-xs leading-relaxed">{tooltip}</p>
				</TooltipContent>
			</Tooltip>
		</div>
	);

	const _navSections = [
		{ id: "capacity", label: "Work Schedule", icon: Briefcase },
		{ id: "expenses", label: "Expenses", icon: Wrench },
		{ id: "overview", label: "Overview", icon: BarChart3 },
		{ id: "daily", label: "Daily View", icon: CalendarDays },
		{ id: "final", label: "Final Rate", icon: Target },
	];

	return (
		<TooltipProvider>
			<div className="bg-background min-h-screen">
				<div className="bg-background">
					<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
						<div className="text-center">
							<div className="bg-muted text-muted-foreground mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
								<Calculator className="h-3.5 w-3.5" />
								Thorbis Rights
							</div>
							<h1 className="mb-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
								Free Tradesman Calculator
							</h1>
							<p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed text-pretty">
								Calculate your honest hourly rate for your trades business.
								Factor in all expenses, capacity constraints, and profit margins
								to price your services right and build a sustainable business.
							</p>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<main className="px-4 py-8 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-5xl space-y-12">
						{/* Capacity Section */}
						<section className="scroll-mt-24" id="capacity">
							<div className="mb-6">
								<h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight">
									<div className="bg-muted rounded-lg p-2">
										<Briefcase className="h-5 w-5" />
									</div>
									Work Schedule & Capacity
								</h2>
								<p className="text-muted-foreground mt-2 text-sm">
									Define your working hours and billable capacity
								</p>
							</div>

							<div className="bg-background space-y-6 rounded-lg p-6">
								<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
									<div className="space-y-2">
										<LabelWithTooltip
											htmlFor="workDaysPerWeek"
											label="Work days per week"
											tooltip="Number of days per week you operate. Standard is 5 days (Mon-Fri)."
										/>
										<Input
											className="bg-input"
											id="workDaysPerWeek"
											onChange={handleChange("workDaysPerWeek")}
											type="number"
											value={inputs.workDaysPerWeek}
										/>
									</div>
									<div className="space-y-2">
										<LabelWithTooltip
											htmlFor="weeksPerYear"
											label="Weeks per year"
											tooltip="Total weeks in a year. Standard is 52 weeks."
										/>
										<Input
											className="bg-input"
											id="weeksPerYear"
											onChange={handleChange("weeksPerYear")}
											type="number"
											value={inputs.weeksPerYear}
										/>
									</div>
									<div className="space-y-2">
										<LabelWithTooltip
											htmlFor="holidaysPerYear"
											label="Holidays per year"
											tooltip="Paid company holidays (e.g., New Year's, July 4th, Thanksgiving, Christmas). Industry standard: 8-10 days."
										/>
										<Input
											className="bg-input"
											id="holidaysPerYear"
											onChange={handleChange("holidaysPerYear")}
											type="number"
											value={inputs.holidaysPerYear}
										/>
									</div>
									<div className="space-y-2">
										<LabelWithTooltip
											htmlFor="vacationDaysPerYear"
											label="Vacation days per year"
											tooltip="Paid vacation time for employees. Industry standard: 10-15 days per year."
										/>
										<Input
											className="bg-input"
											id="vacationDaysPerYear"
											onChange={handleChange("vacationDaysPerYear")}
											type="number"
											value={inputs.vacationDaysPerYear}
										/>
									</div>
									<div className="space-y-2">
										<LabelWithTooltip
											htmlFor="personalDaysPerYear"
											label="Personal days per year"
											tooltip="Paid personal/sick days. Industry standard: 5-7 days per year."
										/>
										<Input
											className="bg-input"
											id="personalDaysPerYear"
											onChange={handleChange("personalDaysPerYear")}
											type="number"
											value={inputs.personalDaysPerYear}
										/>
									</div>
									<div className="space-y-2">
										<LabelWithTooltip
											htmlFor="dailyWorkHours"
											label="Daily work hours"
											tooltip="Hours worked per day. Standard is 8 hours."
										/>
										<Input
											className="bg-input"
											id="dailyWorkHours"
											onChange={handleChange("dailyWorkHours")}
											type="number"
											value={inputs.dailyWorkHours}
										/>
									</div>
									<div className="space-y-2">
										<LabelWithTooltip
											htmlFor="serviceVehicles"
											label="Service vehicles"
											tooltip="Number of vehicles/crews that can be billed simultaneously. For a 3-man company, typically 3 vehicles (1 per person)."
										/>
										<Input
											className="bg-input"
											id="serviceVehicles"
											onChange={handleChange("serviceVehicles")}
											type="number"
											value={inputs.serviceVehicles}
										/>
									</div>
									<div className="space-y-2">
										<LabelWithTooltip
											htmlFor="billableHoursSoldPercent"
											label="Billable hours sold (%)"
											tooltip="Percentage of available hours actually sold to customers. Calculation: (Billable Hours Sold / Available Hours) × 100. Industry average: 70-80%."
										/>
										<Input
											className="bg-input"
											id="billableHoursSoldPercent"
											onChange={handleChange("billableHoursSoldPercent")}
											type="number"
											value={inputs.billableHoursSoldPercent}
										/>
									</div>
								</div>

								<div className="bg-muted/30 mt-6 grid gap-4 rounded-lg p-4 sm:grid-cols-2 lg:grid-cols-4">
									<div>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="cursor-help">
													<p className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
														Total Work Days/Year
														<Info className="h-3 w-3" />
													</p>
													<p className="mt-1 text-2xl font-semibold">
														{formatNumber(calculations.totalWorkDaysPerYear)}
													</p>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p className="text-xs">
													Formula: (Work Days/Week × Weeks/Year) - (Holidays +
													Vacation + Personal Days)
													<br />= ({inputs.workDaysPerWeek} ×{" "}
													{inputs.weeksPerYear}) - ({inputs.holidaysPerYear} +{" "}
													{inputs.vacationDaysPerYear} +{" "}
													{inputs.personalDaysPerYear})
												</p>
											</TooltipContent>
										</Tooltip>
									</div>
									<div>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="cursor-help">
													<p className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
														Total Work Hours/Year
														<Info className="h-3 w-3" />
													</p>
													<p className="mt-1 text-2xl font-semibold">
														{formatNumber(calculations.totalWorkHoursPerYear)}
													</p>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p className="text-xs">
													Formula: Total Work Days/Year × Daily Work Hours
													<br />={" "}
													{formatNumber(calculations.totalWorkDaysPerYear)} ×{" "}
													{inputs.dailyWorkHours}
												</p>
											</TooltipContent>
										</Tooltip>
									</div>
									<div>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="cursor-help">
													<p className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
														Available Billable Hours
														<Info className="h-3 w-3" />
													</p>
													<p className="mt-1 text-2xl font-semibold">
														{formatNumber(calculations.availableBillableHours)}
													</p>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p className="text-xs">
													Formula: Total Work Hours/Year × Service Vehicles
													<br />={" "}
													{formatNumber(calculations.totalWorkHoursPerYear)} ×{" "}
													{inputs.serviceVehicles}
												</p>
											</TooltipContent>
										</Tooltip>
									</div>
									<div>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="cursor-help">
													<p className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
														Annual Billable Hours
														<Info className="h-3 w-3" />
													</p>
													<p className="mt-1 text-2xl font-semibold text-green-600 dark:text-green-500">
														{formatNumber(calculations.annualBillableHours)}
													</p>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p className="text-xs">
													Formula: Available Billable Hours × (Billable Hours
													Sold % ÷ 100)
													<br />={" "}
													{formatNumber(calculations.availableBillableHours)} ×
													({inputs.billableHoursSoldPercent}% ÷ 100)
												</p>
											</TooltipContent>
										</Tooltip>
									</div>
								</div>
							</div>
						</section>

						{/* Expenses Section */}
						<section className="scroll-mt-24 space-y-6" id="expenses">
							<div className="mb-6">
								<h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight">
									<div className="bg-muted rounded-lg p-2">
										<Wrench className="h-5 w-5" />
									</div>
									Business Expenses
								</h2>
								<p className="text-muted-foreground mt-2 text-sm">
									Track all annual operating and growth expenses with hourly
									breakdowns
								</p>
							</div>

							{/* Operating Expenses */}
							<div className="bg-background rounded-lg p-6">
								<div className="mb-4">
									<h3 className="text-lg font-semibold">Operating Expenses</h3>
									<p className="text-muted-foreground text-sm">
										Annual business expenses and hourly breakdown
									</p>
								</div>
								<div className="space-y-4">
									{/* Personnel */}
									<div>
										<h3 className="text-foreground mb-3 text-sm font-semibold">
											Personnel Costs
										</h3>
										<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="ownerPay"
													label="Owner Pay"
													tooltip="Annual salary for business owner. Small company standard: $60,000-$100,000."
												/>
												<Input
													className="bg-input"
													id="ownerPay"
													onChange={handleChange("ownerPay")}
													type="number"
													value={inputs.ownerPay}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="plumber"
													label="Plumber"
													tooltip="Annual salary for licensed plumber(s). Industry standard: $50,000-$80,000 per plumber."
												/>
												<Input
													className="bg-input"
													id="plumber"
													onChange={handleChange("plumber")}
													type="number"
													value={inputs.plumber}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="apprenticesHelpers"
													label="Apprentices / Helpers"
													tooltip="Annual salary for apprentices and helpers. Industry standard: $30,000-$50,000 per person."
												/>
												<Input
													className="bg-input"
													id="apprenticesHelpers"
													onChange={handleChange("apprenticesHelpers")}
													type="number"
													value={inputs.apprenticesHelpers}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="officeSalaries"
													label="Office Salaries"
													tooltip="Annual cost for administrative staff (receptionist, bookkeeper, etc.). Part-time standard: $20,000-$40,000."
												/>
												<Input
													className="bg-input"
													id="officeSalaries"
													onChange={handleChange("officeSalaries")}
													type="number"
													value={inputs.officeSalaries}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="employerTaxPercent"
													label="Employer Tax Rate (%)"
													tooltip="FICA (7.65%) + unemployment insurance + workers comp. Calculation: (Owner Pay + Plumber + Apprentices + Office Salaries) × Tax Rate. Typical total: 10-15%."
												/>
												<Input
													className="bg-input"
													id="employerTaxPercent"
													onChange={handleChange("employerTaxPercent")}
													type="number"
													value={inputs.employerTaxPercent}
												/>
											</div>
											<div className="flex items-end">
												<Tooltip>
													<TooltipTrigger asChild>
														<div className="bg-muted/50 w-full cursor-help rounded-lg p-3">
															<p className="text-muted-foreground flex items-center gap-1 text-xs">
																Employer Taxes
																<Info className="h-3 w-3" />
															</p>
															<p className="mt-1 font-semibold">
																{formatCurrency(
																	calculations.employerTaxesAnnual,
																)}
															</p>
														</div>
													</TooltipTrigger>
													<TooltipContent>
														<p className="text-xs">
															Formula: (Owner Pay + Plumber + Apprentices +
															Office) × (Tax Rate ÷ 100)
															<br />= (
															{formatCurrency(toNumber(inputs.ownerPay))} +{" "}
															{formatCurrency(toNumber(inputs.plumber))} +{" "}
															{formatCurrency(
																toNumber(inputs.apprenticesHelpers),
															)}{" "}
															+{" "}
															{formatCurrency(toNumber(inputs.officeSalaries))})
															× {inputs.employerTaxPercent}%
														</p>
													</TooltipContent>
												</Tooltip>
											</div>
										</div>
									</div>

									{/* Insurance & Benefits */}
									<div>
										<h3 className="text-foreground mb-3 text-sm font-semibold">
											Insurance & Benefits
										</h3>
										<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="insuranceAuto"
													label="Insurance - Auto"
													tooltip="Annual commercial auto insurance. 3 vehicles: $2,500-$4,000 per vehicle = $7,500-$12,000 total."
												/>
												<Input
													className="bg-input"
													id="insuranceAuto"
													onChange={handleChange("insuranceAuto")}
													type="number"
													value={inputs.insuranceAuto}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="insuranceBusiness"
													label="Insurance - Business"
													tooltip="General liability and property insurance. Small service business standard: $3,000-$6,000/year."
												/>
												<Input
													className="bg-input"
													id="insuranceBusiness"
													onChange={handleChange("insuranceBusiness")}
													type="number"
													value={inputs.insuranceBusiness}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="insuranceHealth"
													label="Insurance - Health"
													tooltip="Employer portion of health insurance. 3 employees: $4,000-$8,000 per person = $12,000-$24,000 total."
												/>
												<Input
													className="bg-input"
													id="insuranceHealth"
													onChange={handleChange("insuranceHealth")}
													type="number"
													value={inputs.insuranceHealth}
												/>
											</div>
										</div>
									</div>

									{/* Vehicle Expenses */}
									<div>
										<h3 className="text-foreground mb-3 text-sm font-semibold">
											Vehicle Expenses
										</h3>
										<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="vehicleFuel"
													label="Vehicle - Fuel"
													tooltip="Annual fuel costs. 3 vehicles at ~$300-$500/month each = $10,800-$18,000/year."
												/>
												<Input
													className="bg-input"
													id="vehicleFuel"
													onChange={handleChange("vehicleFuel")}
													type="number"
													value={inputs.vehicleFuel}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="vehicleLease"
													label="Vehicle - Lease"
													tooltip="Annual vehicle lease/loan payments. 3 vehicles at ~$400-$600/month each = $14,400-$21,600/year."
												/>
												<Input
													className="bg-input"
													id="vehicleLease"
													onChange={handleChange("vehicleLease")}
													type="number"
													value={inputs.vehicleLease}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="vehicleMaintenance"
													label="Vehicle - Maintenance"
													tooltip="Annual maintenance and repairs. 3 vehicles: $1,500-$2,500 per vehicle = $4,500-$7,500/year."
												/>
												<Input
													className="bg-input"
													id="vehicleMaintenance"
													onChange={handleChange("vehicleMaintenance")}
													type="number"
													value={inputs.vehicleMaintenance}
												/>
											</div>
										</div>
									</div>

									{/* Office & Operations */}
									<div>
										<h3 className="text-foreground mb-3 text-sm font-semibold">
											Office & Operations
										</h3>
										<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="rentLease"
													label="Rent / Lease"
													tooltip="Annual office/shop rent. Small shop/office: $1,500-$3,000/month = $18,000-$36,000/year."
												/>
												<Input
													className="bg-input"
													id="rentLease"
													onChange={handleChange("rentLease")}
													type="number"
													value={inputs.rentLease}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="utilities"
													label="Utilities"
													tooltip="Annual electricity, water, gas for office/shop. Small location: $300-$500/month = $3,600-$6,000/year."
												/>
												<Input
													className="bg-input"
													id="utilities"
													onChange={handleChange("utilities")}
													type="number"
													value={inputs.utilities}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="internetExpense"
													label="Internet"
													tooltip="Annual business internet service. $80-$150/month = $960-$1,800/year."
												/>
												<Input
													className="bg-input"
													id="internetExpense"
													onChange={handleChange("internetExpense")}
													type="number"
													value={inputs.internetExpense}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="telephoneExpense"
													label="Telephone"
													tooltip="Annual phone service (landline + 3 mobile lines). ~$200-$300/month = $2,400-$3,600/year."
												/>
												<Input
													className="bg-input"
													id="telephoneExpense"
													onChange={handleChange("telephoneExpense")}
													type="number"
													value={inputs.telephoneExpense}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="officeSupplies"
													label="Office Supplies"
													tooltip="Annual office supplies (paper, pens, forms). Small business: $150-$300/month = $1,800-$3,600/year."
												/>
												<Input
													className="bg-input"
													id="officeSupplies"
													onChange={handleChange("officeSupplies")}
													type="number"
													value={inputs.officeSupplies}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="suppliesExpense"
													label="Supplies Expense"
													tooltip="Annual job supplies (parts, materials kept in stock). ~3-5% of revenue, typically $10,000-$20,000/year."
												/>
												<Input
													className="bg-input"
													id="suppliesExpense"
													onChange={handleChange("suppliesExpense")}
													type="number"
													value={inputs.suppliesExpense}
												/>
											</div>
										</div>
									</div>

									{/* Marketing & Professional */}
									<div>
										<h3 className="text-foreground mb-3 text-sm font-semibold">
											Marketing & Professional Services
										</h3>
										<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="advertisingMarketing"
													label="Advertising / Marketing"
													tooltip="Annual marketing spend (Google Ads, local ads, website). 5-8% of revenue standard, ~$10,000-$15,000/year for small companies."
												/>
												<Input
													className="bg-input"
													id="advertisingMarketing"
													onChange={handleChange("advertisingMarketing")}
													type="number"
													value={inputs.advertisingMarketing}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="professionalServices"
													label="Professional Services"
													tooltip="Annual accounting, legal, consulting fees. Small business: $400-$600/month = $4,800-$7,200/year."
												/>
												<Input
													className="bg-input"
													id="professionalServices"
													onChange={handleChange("professionalServices")}
													type="number"
													value={inputs.professionalServices}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="professionalLicensing"
													label="Professional Licensing"
													tooltip="Annual license renewals and permits. Multiple licenses/permits: $1,000-$2,500/year."
												/>
												<Input
													className="bg-input"
													id="professionalLicensing"
													onChange={handleChange("professionalLicensing")}
													type="number"
													value={inputs.professionalLicensing}
												/>
											</div>
										</div>
									</div>

									{/* Other Expenses */}
									<div>
										<h3 className="text-foreground mb-3 text-sm font-semibold">
											Other Expenses
										</h3>
										<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="bankMerchantFees"
													label="Bank & Merchant Fees"
													tooltip="Annual credit card processing and bank fees. ~2-3% of revenue or $250-$400/month = $3,000-$4,800/year."
												/>
												<Input
													className="bg-input"
													id="bankMerchantFees"
													onChange={handleChange("bankMerchantFees")}
													type="number"
													value={inputs.bankMerchantFees}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="debtService"
													label="Debt Service"
													tooltip="Annual loan payments (equipment, startup loans). Enter 0 if debt-free."
												/>
												<Input
													className="bg-input"
													id="debtService"
													onChange={handleChange("debtService")}
													type="number"
													value={inputs.debtService}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="lossRefund"
													label="Loss / Refund"
													tooltip="Annual allowance for bad debt, refunds, write-offs. Typically 1-2% of revenue or ~$2,000-$4,000/year."
												/>
												<Input
													className="bg-input"
													id="lossRefund"
													onChange={handleChange("lossRefund")}
													type="number"
													value={inputs.lossRefund}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="membershipDues"
													label="Membership Dues"
													tooltip="Annual professional association dues, chamber of commerce, etc. Typically $400-$1,000/year."
												/>
												<Input
													className="bg-input"
													id="membershipDues"
													onChange={handleChange("membershipDues")}
													type="number"
													value={inputs.membershipDues}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="replacementAllowance"
													label="Replacement Allowance"
													tooltip="Annual reserve for tool/equipment replacement. Small company: ~$400-$600/month = $4,800-$7,200/year."
												/>
												<Input
													className="bg-input"
													id="replacementAllowance"
													onChange={handleChange("replacementAllowance")}
													type="number"
													value={inputs.replacementAllowance}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="uniformsExpense"
													label="Uniforms"
													tooltip="Annual uniform purchase and cleaning. 3 employees: $50-75/month each = $1,800-$2,700/year."
												/>
												<Input
													className="bg-input"
													id="uniformsExpense"
													onChange={handleChange("uniformsExpense")}
													type="number"
													value={inputs.uniformsExpense}
												/>
											</div>
											<div className="space-y-2">
												<LabelWithTooltip
													htmlFor="otherExpenses"
													label="Other Expenses"
													tooltip="Annual miscellaneous expenses not categorized elsewhere. Safety equipment, training, etc.: $200-$400/month = $2,400-$4,800/year."
												/>
												<Input
													className="bg-input"
													id="otherExpenses"
													onChange={handleChange("otherExpenses")}
													type="number"
													value={inputs.otherExpenses}
												/>
											</div>
										</div>
									</div>
								</div>

								<div className="bg-muted/30 mt-6 grid gap-4 rounded-lg p-4 sm:grid-cols-2">
									<div>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="cursor-help">
													<p className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
														Total Operating (Annual)
														<Info className="h-3 w-3" />
													</p>
													<p className="mt-1 text-2xl font-semibold">
														{formatCurrency(calculations.totalOperatingAnnual)}
													</p>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p className="text-xs">
													Sum of all operating expenses listed above.
												</p>
											</TooltipContent>
										</Tooltip>
									</div>
									<div>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="cursor-help">
													<p className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
														Total Operating (Hourly)
														<Info className="h-3 w-3" />
													</p>
													<p className="mt-1 text-2xl font-semibold">
														{formatCurrency(calculations.totalOperatingHourly)}
													</p>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p className="text-xs">
													Formula: Total Operating Annual ÷ Annual Billable
													Hours
													<br />={" "}
													{formatCurrency(calculations.totalOperatingAnnual)} ÷{" "}
													{formatNumber(calculations.annualBillableHours)}
												</p>
											</TooltipContent>
										</Tooltip>
									</div>
								</div>
							</div>

							{/* 12-Month Growth */}
							<div className="bg-background rounded-lg p-6">
								<div className="mb-4 flex items-center gap-3">
									<div className="bg-muted rounded-lg p-2">
										<TrendingUp className="h-5 w-5" />
									</div>
									<div>
										<h3 className="text-lg font-semibold">
											12-Month Growth Expenses
										</h3>
										<p className="text-muted-foreground text-sm">
											Investment in business growth and expansion
										</p>
									</div>
								</div>
								<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
									<div className="space-y-2">
										<LabelWithTooltip
											htmlFor="growthDevelopment"
											label="Development"
											tooltip="Investment in training, certifications, and skill development. $5,000-$10,000/year for small company."
										/>
										<Input
											className="bg-input"
											id="growthDevelopment"
											onChange={handleChange("growthDevelopment")}
											type="number"
											value={inputs.growthDevelopment}
										/>
									</div>
									<div className="space-y-2">
										<LabelWithTooltip
											htmlFor="growthEquipment"
											label="Equipment"
											tooltip="New equipment purchases for expansion. $10,000-$20,000/year depending on growth plans."
										/>
										<Input
											className="bg-input"
											id="growthEquipment"
											onChange={handleChange("growthEquipment")}
											type="number"
											value={inputs.growthEquipment}
										/>
									</div>
									<div className="space-y-2">
										<LabelWithTooltip
											htmlFor="growthVehicle"
											label="Vehicle"
											tooltip="Down payment or purchase of additional service vehicle. Enter 0 if not adding vehicles this year."
										/>
										<Input
											className="bg-input"
											id="growthVehicle"
											onChange={handleChange("growthVehicle")}
											type="number"
											value={inputs.growthVehicle}
										/>
									</div>
									<div className="space-y-2">
										<LabelWithTooltip
											htmlFor="growthOther"
											label="Other"
											tooltip="Other growth investments (technology, systems, processes). $3,000-$7,000/year for small company improvements."
										/>
										<Input
											className="bg-input"
											id="growthOther"
											onChange={handleChange("growthOther")}
											type="number"
											value={inputs.growthOther}
										/>
									</div>
								</div>

								<div className="bg-muted/30 mt-6 grid gap-4 rounded-lg p-4 sm:grid-cols-2">
									<div>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="cursor-help">
													<p className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
														Total Growth (Annual)
														<Info className="h-3 w-3" />
													</p>
													<p className="mt-1 text-2xl font-semibold">
														{formatCurrency(calculations.totalGrowthAnnual)}
													</p>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p className="text-xs">Sum of all growth expenses.</p>
											</TooltipContent>
										</Tooltip>
									</div>
									<div>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="cursor-help">
													<p className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
														Total Growth (Hourly)
														<Info className="h-3 w-3" />
													</p>
													<p className="mt-1 text-2xl font-semibold">
														{formatCurrency(calculations.totalGrowthHourly)}
													</p>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p className="text-xs">
													Formula: Total Growth Annual ÷ Annual Billable Hours
													<br />={" "}
													{formatCurrency(calculations.totalGrowthAnnual)} ÷{" "}
													{formatNumber(calculations.annualBillableHours)}
												</p>
											</TooltipContent>
										</Tooltip>
									</div>
								</div>
							</div>
						</section>

						{/* Overview Section */}
						<section className="scroll-mt-24" id="overview">
							<div className="mb-6">
								<h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight">
									<div className="bg-muted rounded-lg p-2">
										<BarChart3 className="h-5 w-5" />
									</div>
									Business Overview
								</h2>
								<p className="text-muted-foreground mt-2 text-sm">
									Key metrics and financial insights for your business
								</p>
							</div>

							{/* Key Metrics Dashboard */}
							<div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
								<div className="bg-muted/30 rounded-lg p-4">
									<p className="text-muted-foreground mb-2 text-xs font-medium">
										Your Hourly Rate
									</p>
									<div className="text-2xl font-bold text-green-600 dark:text-green-500">
										{Number.isFinite(calculations.honestHourlyRate)
											? formatCurrency(calculations.honestHourlyRate)
											: "—"}
									</div>
									<p className="text-muted-foreground mt-1 text-xs">
										With {inputs.profitPercent}% profit margin
									</p>
								</div>

								<div className="bg-muted/30 rounded-lg p-4">
									<p className="text-muted-foreground mb-2 text-xs font-medium">
										Annual Billable Hours
									</p>
									<div className="text-2xl font-bold">
										{formatNumber(calculations.annualBillableHours)}
									</div>
									<p className="text-muted-foreground mt-1 text-xs">
										{formatNumber(calculations.dailyBillableHours)} hrs/day
										average
									</p>
								</div>

								<div className="bg-muted/30 rounded-lg p-4">
									<p className="text-muted-foreground mb-2 text-xs font-medium">
										Total Annual Expenses
									</p>
									<div className="text-2xl font-bold">
										{formatCurrency(calculations.totalExpensesAnnual)}
									</div>
									<p className="text-muted-foreground mt-1 text-xs">
										{formatCurrency(calculations.dailyExpense)}/day
									</p>
								</div>

								<div className="bg-muted/30 rounded-lg p-4">
									<p className="text-muted-foreground mb-2 text-xs font-medium">
										Annual Revenue Target
									</p>
									<div className="text-2xl font-bold text-green-600 dark:text-green-500">
										{Number.isFinite(calculations.honestHourlyRate)
											? formatCurrency(
													calculations.honestHourlyRate *
														calculations.annualBillableHours,
												)
											: "—"}
									</div>
									<p className="text-muted-foreground mt-1 text-xs">
										At full capacity
									</p>
								</div>
							</div>

							{/* Expense Breakdown */}
							<div className="bg-background mb-6 rounded-lg p-6">
								<div className="mb-4">
									<h3 className="text-lg font-semibold">Expense Breakdown</h3>
									<p className="text-muted-foreground text-sm">
										Where your money goes annually
									</p>
								</div>
								<div className="space-y-4">
									<div className="border-border/50 flex items-center justify-between border-b pb-3">
										<div>
											<p className="font-medium">Operating Expenses</p>
											<p className="text-muted-foreground text-sm">
												{formatCurrency(calculations.totalOperatingHourly)}/hour
											</p>
										</div>
										<div className="text-right">
											<p className="text-xl font-bold">
												{formatCurrency(calculations.totalOperatingAnnual)}
											</p>
											<p className="text-muted-foreground text-xs">
												{(
													(calculations.totalOperatingAnnual /
														calculations.totalExpensesAnnual) *
													100
												).toFixed(1)}
												% of total
											</p>
										</div>
									</div>

									<div className="border-border/50 flex items-center justify-between border-b pb-3">
										<div>
											<p className="font-medium">Growth Expenses</p>
											<p className="text-muted-foreground text-sm">
												{formatCurrency(calculations.totalGrowthHourly)}/hour
											</p>
										</div>
										<div className="text-right">
											<p className="text-xl font-bold">
												{formatCurrency(calculations.totalGrowthAnnual)}
											</p>
											<p className="text-muted-foreground text-xs">
												{(
													(calculations.totalGrowthAnnual /
														calculations.totalExpensesAnnual) *
													100
												).toFixed(1)}
												% of total
											</p>
										</div>
									</div>

									<div className="flex items-center justify-between pt-2">
										<div>
											<p className="text-lg font-semibold">Total Expenses</p>
											<p className="text-muted-foreground text-sm">
												{formatCurrency(calculations.hourlyExpenseRate)}/hour
											</p>
										</div>
										<div className="text-right">
											<p className="text-2xl font-bold">
												{formatCurrency(calculations.totalExpensesAnnual)}
											</p>
											<p className="text-muted-foreground text-xs">
												Annual total
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Quick Financial Insights */}
							<div className="grid gap-6 sm:grid-cols-2">
								<div className="bg-background rounded-lg p-6">
									<div className="mb-4 flex items-center gap-2">
										<DollarSign className="h-5 w-5" />
										<h3 className="text-base font-semibold">
											Break-Even Analysis
										</h3>
									</div>
									<div className="space-y-3">
										<div>
											<p className="text-muted-foreground text-sm">
												Hourly break-even rate
											</p>
											<p className="text-2xl font-bold text-red-600 dark:text-red-500">
												{formatCurrency(calculations.hourlyExpenseRate)}
											</p>
										</div>
										<div>
											<p className="text-muted-foreground text-sm">
												Daily break-even revenue
											</p>
											<p className="text-2xl font-bold text-red-600 dark:text-red-500">
												{formatCurrency(calculations.dailyBreakEvenRevenue)}
											</p>
										</div>
										<div>
											<p className="text-muted-foreground text-sm">
												Annual break-even revenue
											</p>
											<p className="text-2xl font-bold text-red-600 dark:text-red-500">
												{formatCurrency(calculations.totalExpensesAnnual)}
											</p>
										</div>
									</div>
								</div>

								<div className="bg-background rounded-lg p-6">
									<div className="mb-4 flex items-center gap-2">
										<TrendingUp className="h-5 w-5" />
										<h3 className="text-base font-semibold">
											Profit Projections
										</h3>
									</div>
									<div className="space-y-3">
										<div>
											<p className="text-muted-foreground text-sm">
												Profit per billable hour
											</p>
											<p className="text-2xl font-bold text-green-600 dark:text-green-500">
												{Number.isFinite(calculations.honestHourlyRate)
													? formatCurrency(
															calculations.honestHourlyRate -
																calculations.hourlyExpenseRate,
														)
													: "—"}
											</p>
										</div>
										<div>
											<p className="text-muted-foreground text-sm">
												Daily profit potential
											</p>
											<p className="text-2xl font-bold text-green-600 dark:text-green-500">
												{Number.isFinite(calculations.dailyRevenueCapacity)
													? formatCurrency(
															calculations.dailyRevenueCapacity -
																calculations.dailyExpense,
														)
													: "—"}
											</p>
										</div>
										<div>
											<p className="text-muted-foreground text-sm">
												Annual profit potential
											</p>
											<p className="text-2xl font-bold text-green-600 dark:text-green-500">
												{Number.isFinite(calculations.honestHourlyRate)
													? formatCurrency(
															calculations.honestHourlyRate *
																calculations.annualBillableHours -
																calculations.totalExpensesAnnual,
														)
													: "—"}
											</p>
										</div>
									</div>
								</div>
							</div>
						</section>

						{/* Daily View Section */}
						<section className="scroll-mt-24" id="daily">
							<div className="mb-6">
								<h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight">
									<div className="bg-muted rounded-lg p-2">
										<CalendarDays className="h-5 w-5" />
									</div>
									Daily Break-Even Analysis
								</h2>
								<p className="text-muted-foreground mt-2 text-sm">
									Understand what it takes to cover expenses each working day
								</p>
							</div>

							<div className="bg-background rounded-lg p-6">
								<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
									<div className="bg-muted/30 rounded-lg p-4">
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="cursor-help">
													<p className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
														Daily Operating Cost
														<Info className="h-3 w-3" />
													</p>
													<p className="mt-2 text-2xl font-semibold">
														{formatCurrency(calculations.dailyExpense)}
													</p>
													<p className="text-muted-foreground mt-1 text-xs">
														Per working day
													</p>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p className="text-xs">
													Formula: Total Annual Expenses ÷ Working Days Per Year
													<br />={" "}
													{formatCurrency(calculations.totalExpensesAnnual)} ÷{" "}
													{formatNumber(calculations.totalWorkDaysPerYear)}
													<br />
													<br />
													This is how much your company spends every working day
													just to keep the doors open.
												</p>
											</TooltipContent>
										</Tooltip>
									</div>

									<div className="bg-muted/30 rounded-lg p-4">
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="cursor-help">
													<p className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
														Daily Break-Even Revenue
														<Info className="h-3 w-3" />
													</p>
													<p className="mt-2 text-2xl font-semibold text-red-600 dark:text-red-500">
														{formatCurrency(calculations.dailyBreakEvenRevenue)}
													</p>
													<p className="text-muted-foreground mt-1 text-xs">
														Minimum to cover costs
													</p>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p className="text-xs">
													Formula: Daily Operating Cost (same value)
													<br />= {formatCurrency(calculations.dailyExpense)}
													<br />
													<br />
													You must bill at least this amount each working day
													just to break even (zero profit).
												</p>
											</TooltipContent>
										</Tooltip>
									</div>

									<div className="bg-muted/30 rounded-lg p-4">
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="cursor-help">
													<p className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
														Daily Billable Hours
														<Info className="h-3 w-3" />
													</p>
													<p className="mt-2 text-2xl font-semibold">
														{formatNumber(calculations.dailyBillableHours)} hrs
													</p>
													<p className="text-muted-foreground mt-1 text-xs">
														Average sold per day
													</p>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p className="text-xs">
													Formula: Annual Billable Hours ÷ Working Days Per Year
													<br />={" "}
													{formatNumber(calculations.annualBillableHours)} ÷{" "}
													{formatNumber(calculations.totalWorkDaysPerYear)}
													<br />
													<br />
													This is the average number of billable hours your team
													sells each working day.
												</p>
											</TooltipContent>
										</Tooltip>
									</div>

									<div className="bg-muted/30 rounded-lg p-4">
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="cursor-help">
													<p className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
														Daily Revenue Capacity
														<Info className="h-3 w-3" />
													</p>
													<p className="mt-2 text-2xl font-semibold text-green-600 dark:text-green-500">
														{Number.isFinite(calculations.dailyRevenueCapacity)
															? formatCurrency(
																	calculations.dailyRevenueCapacity,
																)
															: "—"}
													</p>
													<p className="text-muted-foreground mt-1 text-xs">
														Target with profit margin
													</p>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p className="text-xs">
													Formula: Daily Billable Hours × Honest Hourly Rate
													<br />={" "}
													{formatNumber(calculations.dailyBillableHours)} hrs ×{" "}
													{formatCurrency(calculations.honestHourlyRate)}
													<br />
													<br />
													This is your target daily revenue when billing at your
													honest hourly rate, including your desired profit
													margin.
												</p>
											</TooltipContent>
										</Tooltip>
									</div>
								</div>

								<div className="bg-muted/30 mt-6 rounded-lg p-6">
									<div className="flex items-start gap-3">
										<div className="bg-muted mt-0.5 rounded-lg p-2">
											<Info className="h-5 w-5" />
										</div>
										<div className="flex-1">
											<h4 className="text-foreground mb-2 font-semibold">
												Understanding Your Daily Numbers
											</h4>
											<div className="text-muted-foreground space-y-3 text-sm">
												<p>
													<strong className="text-foreground">
														Daily Operating Cost:
													</strong>{" "}
													Every working day, your business spends{" "}
													<span className="text-foreground font-medium">
														{formatCurrency(calculations.dailyExpense)}
													</span>{" "}
													on expenses before earning a single dollar.
												</p>
												<p>
													<strong className="text-foreground">
														Break-Even Point:
													</strong>{" "}
													You need to bill at least{" "}
													<span className="font-medium text-red-600 dark:text-red-500">
														{formatCurrency(calculations.dailyBreakEvenRevenue)}
													</span>{" "}
													each day just to cover costs with zero profit.
												</p>
												<p>
													<strong className="text-foreground">
														Profit Target:
													</strong>{" "}
													To achieve your {inputs.profitPercent}% profit margin,
													aim to bill{" "}
													<span className="font-medium text-green-600 dark:text-green-500">
														{Number.isFinite(calculations.dailyRevenueCapacity)
															? formatCurrency(
																	calculations.dailyRevenueCapacity,
																)
															: "—"}
													</span>{" "}
													daily ({formatNumber(calculations.dailyBillableHours)}{" "}
													billable hours at{" "}
													{formatCurrency(calculations.honestHourlyRate)}/hr).
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>

						{/* Final Rate Section */}
						<section className="scroll-mt-24" id="final">
							<div className="mb-6">
								<h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight">
									<div className="bg-muted rounded-lg p-2">
										<Target className="h-5 w-5" />
									</div>
									Your Honest Hourly Rate
								</h2>
								<p className="text-muted-foreground mt-2 text-sm">
									Final calculation based on all expenses and profit margin
								</p>
							</div>

							<div className="bg-background rounded-lg p-6">
								<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
									<div className="bg-muted/30 rounded-lg p-4">
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="cursor-help">
													<p className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
														Total Expenses (Annual)
														<Info className="h-3 w-3" />
													</p>
													<p className="mt-2 text-2xl font-semibold">
														{formatCurrency(calculations.totalExpensesAnnual)}
													</p>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p className="text-xs">
													Formula: Total Operating + Total Growth
													<br />={" "}
													{formatCurrency(calculations.totalOperatingAnnual)} +{" "}
													{formatCurrency(calculations.totalGrowthAnnual)}
												</p>
											</TooltipContent>
										</Tooltip>
									</div>
									<div className="bg-muted/30 rounded-lg p-4">
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="cursor-help">
													<p className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
														Hourly Expense Rate
														<Info className="h-3 w-3" />
													</p>
													<p className="mt-2 text-2xl font-semibold">
														{formatCurrency(calculations.hourlyExpenseRate)}
													</p>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p className="text-xs">
													Formula: Total Expenses Annual ÷ Annual Billable Hours
													<br />={" "}
													{formatCurrency(calculations.totalExpensesAnnual)} ÷{" "}
													{formatNumber(calculations.annualBillableHours)}
												</p>
											</TooltipContent>
										</Tooltip>
									</div>
									<div className="space-y-2">
										<LabelWithTooltip
											htmlFor="profitPercent"
											label="Desired Profit Margin (%)"
											tooltip="Target profit percentage. Formula: Hourly Rate = Hourly Expense Rate ÷ (1 - Profit %). Industry standard: 40-60% for service businesses."
										/>
										<Input
											className="bg-input"
											id="profitPercent"
											onChange={handleChange("profitPercent")}
											type="number"
											value={inputs.profitPercent}
										/>
									</div>
								</div>

								<Tooltip>
									<TooltipTrigger asChild>
										<div className="bg-muted/40 mt-8 cursor-help rounded-lg p-6 text-center">
											<p className="text-muted-foreground flex items-center justify-center gap-1.5 text-sm font-medium">
												Your Honest Hourly Rate
												<Info className="h-4 w-4" />
											</p>
											<p className="mt-3 text-5xl font-bold text-green-600 dark:text-green-500">
												{Number.isFinite(calculations.honestHourlyRate)
													? formatCurrency(calculations.honestHourlyRate)
													: "—"}
											</p>
											<p className="text-muted-foreground mt-2 text-sm">
												This rate covers all expenses and your desired profit
												margin
											</p>
										</div>
									</TooltipTrigger>
									<TooltipContent className="max-w-sm">
										<p className="text-xs leading-relaxed">
											Formula: Hourly Expense Rate ÷ (1 - Profit Margin ÷ 100)
											<br />= {formatCurrency(calculations.hourlyExpenseRate)} ÷
											(1 - {inputs.profitPercent}% ÷ 100)
											<br />= {formatCurrency(calculations.hourlyExpenseRate)} ÷{" "}
											{(1 - toPercent(inputs.profitPercent)).toFixed(2)}
											<br />
											<br />
											This ensures your hourly rate not only covers all expenses
											but also delivers your target profit percentage on each
											billable hour.
										</p>
									</TooltipContent>
								</Tooltip>

								<div className="mt-8 space-y-4">
									<h3 className="text-lg font-semibold">Revenue Projections</h3>
									<div className="bg-muted/30 overflow-hidden rounded-lg">
										<table className="w-full">
											<thead className="bg-muted/50">
												<tr>
													<th className="px-4 py-3 text-left text-sm font-medium">
														Time Period
													</th>
													<th className="px-4 py-3 text-right text-sm font-medium">
														Expenses
													</th>
													<th className="px-4 py-3 text-right text-sm font-medium">
														Revenue (Full Capacity)
													</th>
													<th className="px-4 py-3 text-right text-sm font-medium">
														Profit
													</th>
													<th className="px-4 py-3 text-right text-sm font-medium">
														Profit Margin
													</th>
												</tr>
											</thead>
											<tbody className="divide-border/30 divide-y">
												<tr className="hover:bg-muted/20">
													<td className="px-4 py-3 text-sm font-medium">
														Per Hour
													</td>
													<td className="px-4 py-3 text-right text-sm">
														{formatCurrency(calculations.hourlyExpenseRate)}
													</td>
													<td className="px-4 py-3 text-right text-sm font-medium text-green-600 dark:text-green-500">
														{formatCurrency(calculations.honestHourlyRate)}
													</td>
													<td className="px-4 py-3 text-right text-sm text-green-600 dark:text-green-500">
														{Number.isFinite(calculations.honestHourlyRate)
															? formatCurrency(
																	calculations.honestHourlyRate -
																		calculations.hourlyExpenseRate,
																)
															: "—"}
													</td>
													<td className="px-4 py-3 text-right text-sm">
														{inputs.profitPercent}%
													</td>
												</tr>
												<tr className="hover:bg-muted/20">
													<td className="px-4 py-3 text-sm font-medium">
														Per Day
													</td>
													<td className="px-4 py-3 text-right text-sm">
														{formatCurrency(calculations.dailyExpense)}
													</td>
													<td className="px-4 py-3 text-right text-sm font-medium text-green-600 dark:text-green-500">
														{Number.isFinite(calculations.dailyRevenueCapacity)
															? formatCurrency(
																	calculations.dailyRevenueCapacity,
																)
															: "—"}
													</td>
													<td className="px-4 py-3 text-right text-sm text-green-600 dark:text-green-500">
														{Number.isFinite(calculations.dailyRevenueCapacity)
															? formatCurrency(
																	calculations.dailyRevenueCapacity -
																		calculations.dailyExpense,
																)
															: "—"}
													</td>
													<td className="px-4 py-3 text-right text-sm">
														{inputs.profitPercent}%
													</td>
												</tr>
												<tr className="hover:bg-muted/20">
													<td className="px-4 py-3 text-sm font-medium">
														Per Week
													</td>
													<td className="px-4 py-3 text-right text-sm">
														{formatCurrency(
															calculations.totalExpensesAnnual / 52,
														)}
													</td>
													<td className="px-4 py-3 text-right text-sm font-medium text-green-600 dark:text-green-500">
														{Number.isFinite(calculations.honestHourlyRate)
															? formatCurrency(
																	(calculations.honestHourlyRate *
																		calculations.annualBillableHours) /
																		52,
																)
															: "—"}
													</td>
													<td className="px-4 py-3 text-right text-sm text-green-600 dark:text-green-500">
														{Number.isFinite(calculations.honestHourlyRate)
															? formatCurrency(
																	(calculations.honestHourlyRate *
																		calculations.annualBillableHours) /
																		52 -
																		calculations.totalExpensesAnnual / 52,
																)
															: "—"}
													</td>
													<td className="px-4 py-3 text-right text-sm">
														{inputs.profitPercent}%
													</td>
												</tr>
												<tr className="hover:bg-muted/20">
													<td className="px-4 py-3 text-sm font-medium">
														Per Month
													</td>
													<td className="px-4 py-3 text-right text-sm">
														{formatCurrency(
															calculations.totalExpensesAnnual / 12,
														)}
													</td>
													<td className="px-4 py-3 text-right text-sm font-medium text-green-600 dark:text-green-500">
														{Number.isFinite(calculations.honestHourlyRate)
															? formatCurrency(
																	(calculations.honestHourlyRate *
																		calculations.annualBillableHours) /
																		12,
																)
															: "—"}
													</td>
													<td className="px-4 py-3 text-right text-sm text-green-600 dark:text-green-500">
														{Number.isFinite(calculations.honestHourlyRate)
															? formatCurrency(
																	(calculations.honestHourlyRate *
																		calculations.annualBillableHours) /
																		12 -
																		calculations.totalExpensesAnnual / 12,
																)
															: "—"}
													</td>
													<td className="px-4 py-3 text-right text-sm">
														{inputs.profitPercent}%
													</td>
												</tr>
												<tr className="bg-muted/50 font-semibold">
													<td className="px-4 py-3 text-sm">Per Year</td>
													<td className="px-4 py-3 text-right text-sm">
														{formatCurrency(calculations.totalExpensesAnnual)}
													</td>
													<td className="px-4 py-3 text-right text-sm font-bold text-green-600 dark:text-green-500">
														{Number.isFinite(calculations.honestHourlyRate)
															? formatCurrency(
																	calculations.honestHourlyRate *
																		calculations.annualBillableHours,
																)
															: "—"}
													</td>
													<td className="px-4 py-3 text-right text-sm font-bold text-green-600 dark:text-green-500">
														{Number.isFinite(calculations.honestHourlyRate)
															? formatCurrency(
																	calculations.honestHourlyRate *
																		calculations.annualBillableHours -
																		calculations.totalExpensesAnnual,
																)
															: "—"}
													</td>
													<td className="px-4 py-3 text-right text-sm">
														{inputs.profitPercent}%
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</section>
					</div>
				</main>

				{/* Footer */}
				<div className="text-muted-foreground mt-12 py-8 text-center text-sm">
					Copyright © 2025 - Thorbis Rights. All Rights Reserved.
				</div>
			</div>
		</TooltipProvider>
	);
}

"use client";

/**
 * Holiday Schedule Manager - Manage company holidays and special routing
 *
 * Features:
 * - Add/edit/delete company holidays
 * - Set recurring holidays (yearly, monthly, etc.)
 * - Configure special greeting messages for holidays
 * - Assign custom routing rules for holiday periods
 * - Support for date ranges and multi-day holidays
 */

import { Calendar, Edit, Loader2, Plus, Repeat, Save, Trash2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { createHoliday, deleteHoliday, getCompanyHolidays, updateHoliday } from "@/actions/voip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Holiday = {
	id: string;
	name: string;
	holiday_date: string;
	is_recurring: boolean;
	recurrence_type: string | null;
	special_greeting_message: string | null;
	enabled: boolean;
};

export function HolidayScheduleManager() {
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [isLoading, setIsLoading] = useState(true);
	const [holidays, setHolidays] = useState<Holiday[]>([]);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
	const [isCreating, setIsCreating] = useState(false);

	const [holidayForm, setHolidayForm] = useState({
		name: "",
		holiday_date: "",
		is_recurring: false,
		recurrence_type: "yearly",
		special_greeting_message: "",
		enabled: true,
	});

	useEffect(() => {
		loadHolidays();
	}, [loadHolidays]);

	async function loadHolidays() {
		setIsLoading(true);
		try {
			const result = await getCompanyHolidays();
			if (result.success && result.data) {
				setHolidays(result.data);
			} else {
				toast.error(result.error || "Failed to load holidays");
			}
		} catch (_error) {
			toast.error("Failed to load holidays");
		} finally {
			setIsLoading(false);
		}
	}

	function openCreateDialog() {
		setIsCreating(true);
		setSelectedHoliday(null);
		setHolidayForm({
			name: "",
			holiday_date: "",
			is_recurring: false,
			recurrence_type: "yearly",
			special_greeting_message: "",
			enabled: true,
		});
		setIsEditDialogOpen(true);
	}

	function openEditDialog(holiday: Holiday) {
		setIsCreating(false);
		setSelectedHoliday(holiday);
		setHolidayForm({
			name: holiday.name,
			holiday_date: holiday.holiday_date,
			is_recurring: holiday.is_recurring,
			recurrence_type: holiday.recurrence_type || "yearly",
			special_greeting_message: holiday.special_greeting_message || "",
			enabled: holiday.enabled,
		});
		setIsEditDialogOpen(true);
	}

	function handleSaveHoliday() {
		if (!(holidayForm.name && holidayForm.holiday_date)) {
			toast.error("Please fill in all required fields");
			return;
		}

		startTransition(async () => {
			let result;
			if (isCreating) {
				result = await createHoliday(holidayForm as any);
			} else if (selectedHoliday) {
				result = await updateHoliday(selectedHoliday.id, holidayForm as any);
			} else {
				return;
			}

			if (result.success) {
				toast.success(`Holiday ${isCreating ? "created" : "updated"} successfully`);
				setIsEditDialogOpen(false);
				loadHolidays();
			} else {
				toast.error(result.error || "Failed to save holiday");
			}
		});
	}

	function handleDeleteHoliday(holidayId: string) {
		if (!confirm("Are you sure you want to delete this holiday?")) {
			return;
		}

		startTransition(async () => {
			const result = await deleteHoliday(holidayId);
			if (result.success) {
				toast.success("Holiday deleted successfully");
				loadHolidays();
			} else {
				toast.error(result.error || "Failed to delete holiday");
			}
		});
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}

	const sortedHolidays = [...holidays].sort(
		(a, b) => new Date(a.holiday_date).getTime() - new Date(b.holiday_date).getTime()
	);

	if (isLoading) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<Loader2 className="text-muted-foreground size-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<CardTitle>Company Holidays</CardTitle>
							<CardDescription>Manage holidays and configure special call routing</CardDescription>
						</div>
						<Button onClick={openCreateDialog}>
							<Plus className="mr-2 size-4" />
							Add Holiday
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Holiday Name</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Recurrence</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{sortedHolidays.length === 0 ? (
									<TableRow>
										<TableCell className="h-24 text-center" colSpan={5}>
											No holidays configured. Add your first holiday to get started.
										</TableCell>
									</TableRow>
								) : (
									sortedHolidays.map((holiday) => (
										<TableRow key={holiday.id}>
											<TableCell>
												<div>
													<div className="font-medium">{holiday.name}</div>
													{holiday.special_greeting_message && (
														<div className="text-muted-foreground text-xs">
															Special greeting configured
														</div>
													)}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<Calendar className="text-muted-foreground size-4" />
													<span className="text-sm">{formatDate(holiday.holiday_date)}</span>
												</div>
											</TableCell>
											<TableCell>
												{holiday.is_recurring ? (
													<Badge className="gap-1" variant="secondary">
														<Repeat className="size-3" />
														{holiday.recurrence_type}
													</Badge>
												) : (
													<Badge variant="outline">One-time</Badge>
												)}
											</TableCell>
											<TableCell>
												{holiday.enabled ? (
													<Badge variant="default">Active</Badge>
												) : (
													<Badge variant="secondary">Disabled</Badge>
												)}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Button
														onClick={() => openEditDialog(holiday)}
														size="sm"
														variant="outline"
													>
														<Edit className="mr-2 size-4" />
														Edit
													</Button>
													<Button
														disabled={isPending}
														onClick={() => handleDeleteHoliday(holiday.id)}
														size="sm"
														variant="outline"
													>
														<Trash2 className="mr-2 size-4" />
														Delete
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			<Card className="border-primary/50 bg-primary/5">
				<CardContent className="flex items-start gap-3 pt-6">
					<Calendar className="text-primary mt-0.5 h-5 w-5 shrink-0" />
					<div className="space-y-1">
						<p className="text-primary dark:text-primary text-sm font-medium">
							Holiday Routing Tips
						</p>
						<p className="text-muted-foreground text-sm">
							Set up recurring holidays to automatically apply special routing every year. Configure
							special greeting messages to inform callers about holiday hours. Consider creating a
							dedicated routing rule for holidays with voicemail or emergency contact options.
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Edit/Create Dialog */}
			<Dialog onOpenChange={setIsEditDialogOpen} open={isEditDialogOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>{isCreating ? "Add Holiday" : "Edit Holiday"}</DialogTitle>
						<DialogDescription>
							Configure holiday details and special call routing
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-6">
						<div>
							<Label htmlFor="holidayName">Holiday Name *</Label>
							<Input
								id="holidayName"
								onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })}
								placeholder="New Year's Day"
								value={holidayForm.name}
							/>
						</div>

						<div>
							<Label htmlFor="holidayDate">Date *</Label>
							<Input
								className="mt-2"
								id="holidayDate"
								onChange={(e) =>
									setHolidayForm({
										...holidayForm,
										holiday_date: e.target.value,
									})
								}
								type="date"
								value={holidayForm.holiday_date}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<Label>Recurring Holiday</Label>
								<p className="text-muted-foreground text-xs">Automatically repeat this holiday</p>
							</div>
							<Switch
								checked={holidayForm.is_recurring}
								onCheckedChange={(checked) =>
									setHolidayForm({ ...holidayForm, is_recurring: checked })
								}
							/>
						</div>

						{holidayForm.is_recurring && (
							<div>
								<Label htmlFor="recurrenceType">Recurrence Pattern</Label>
								<Select
									onValueChange={(value) =>
										setHolidayForm({ ...holidayForm, recurrence_type: value })
									}
									value={holidayForm.recurrence_type}
								>
									<SelectTrigger className="mt-2" id="recurrenceType">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="yearly">Yearly - Same date every year</SelectItem>
										<SelectItem value="monthly">Monthly - Same day each month</SelectItem>
										<SelectItem value="weekly">Weekly - Same day each week</SelectItem>
										<SelectItem value="custom">Custom - Define your own pattern</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}

						<div>
							<Label htmlFor="greetingMessage">Special Greeting Message (Optional)</Label>
							<Textarea
								className="mt-2"
								id="greetingMessage"
								onChange={(e) =>
									setHolidayForm({
										...holidayForm,
										special_greeting_message: e.target.value,
									})
								}
								placeholder="Thank you for calling. Our offices are closed for New Year's Day..."
								rows={4}
								value={holidayForm.special_greeting_message}
							/>
							<p className="text-muted-foreground mt-1 text-xs">
								This message will be played to callers on this holiday
							</p>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<Label>Holiday Enabled</Label>
								<p className="text-muted-foreground text-xs">Enable or disable this holiday</p>
							</div>
							<Switch
								checked={holidayForm.enabled}
								onCheckedChange={(checked) => setHolidayForm({ ...holidayForm, enabled: checked })}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							disabled={isPending}
							onClick={() => setIsEditDialogOpen(false)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button disabled={isPending} onClick={handleSaveHoliday}>
							{isPending ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Save className="mr-2 size-4" />
									{isCreating ? "Add Holiday" : "Save Changes"}
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

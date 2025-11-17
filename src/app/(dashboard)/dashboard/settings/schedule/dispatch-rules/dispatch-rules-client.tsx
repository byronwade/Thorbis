"use client";

import { Plus, Trash2, Workflow } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
	createDispatchRule,
	deleteDispatchRule,
	type getDispatchRules,
	updateDispatchRule,
} from "@/actions/settings";
import { SettingsPageLayout } from "@/components/settings/settings-page-layout";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
	buildDispatchRuleFormData,
	DISPATCH_ASSIGNMENT_METHODS,
	type DispatchRuleForm,
	mapDispatchRuleRows,
} from "./dispatch-rules-config";

type DispatchRulesResult = Awaited<ReturnType<typeof getDispatchRules>>;
type ExtractData<T> = T extends { data: infer D } ? D : never;
type DispatchRuleRows = ExtractData<DispatchRulesResult>;

type DispatchRulesClientProps = {
	initialRules: DispatchRuleRows | null;
};

export function DispatchRulesClient({ initialRules }: DispatchRulesClientProps) {
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [rules, setRules] = useState<DispatchRuleForm[]>(mapDispatchRuleRows(initialRules ?? []));

	const handleFieldChange = (
		id: string,
		field: keyof DispatchRuleForm,
		value: string | number | boolean
	) => {
		setRules((prev) =>
			prev.map((rule) => (rule.id === id ? { ...rule, [field]: value as never } : rule))
		);
	};

	const handleSaveRule = (rule: DispatchRuleForm) => {
		startTransition(async () => {
			const formData = buildDispatchRuleFormData(rule);
			const result = rule.id.startsWith("temp-")
				? await createDispatchRule(formData)
				: await updateDispatchRule(rule.id, formData);

			if (!result.success) {
				toast.error(result.error ?? "Failed to save dispatch rule");
				return;
			}

			toast.success("Dispatch rule saved");
			const newId = result.data;
			if (typeof newId === "string") {
				setRules((prev) =>
					prev.map((record) => (record.id === rule.id ? { ...record, id: newId } : record))
				);
			}
		});
	};

	const handleDeleteRule = (id: string) => {
		startTransition(async () => {
			if (id.startsWith("temp-")) {
				setRules((prev) => prev.filter((rule) => rule.id !== id));
				return;
			}

			const result = await deleteDispatchRule(id);
			if (result.success) {
				setRules((prev) => prev.filter((rule) => rule.id !== id));
				toast.success("Dispatch rule deleted");
			} else {
				toast.error(result.error ?? "Failed to delete dispatch rule");
			}
		});
	};

	const handleAddRule = () => {
		setRules((prev) => [
			{
				id: `temp-${Date.now()}`,
				ruleName: "",
				priority: 0,
				isActive: true,
				assignmentMethod: "auto",
				conditions: JSON.stringify({ job_types: [] }, null, 2),
				actions: JSON.stringify({ notify: "mobile_push" }, null, 2),
			},
			...prev,
		]);
	};

	return (
		<SettingsPageLayout
			description="Fine-tune how Thorbis auto-assigns jobs based on priority, skills, or proximity."
			hasChanges={isPending}
			helpText="Dispatch rules evaluate from highest to lowest priority."
			isLoading={false}
			isPending={isPending}
			onCancel={() => setRules(mapDispatchRuleRows(initialRules ?? []))}
			onSave={() => {}}
			saveButtonText=""
			title="Dispatch Rules"
		>
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/dashboard/settings">Settings</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/dashboard/settings/schedule">Scheduling</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Dispatch rules</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<Button onClick={handleAddRule} variant="outline">
					<Plus className="mr-2 size-4" />
					Add Rule
				</Button>
			</div>

			{rules.map((rule) => (
				<Card key={rule.id}>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Workflow className="size-4" />
							{rule.ruleName || "Untitled Rule"}
						</CardTitle>
						<CardDescription>
							Priority {rule.priority} • {rule.assignmentMethod}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label>Rule name</Label>
								<Input
									className="mt-2"
									onChange={(event) => handleFieldChange(rule.id, "ruleName", event.target.value)}
									placeholder="Emergency Calls"
									value={rule.ruleName}
								/>
							</div>
							<div>
								<Label>Priority (higher wins)</Label>
								<Input
									className="mt-2"
									min={0}
									onChange={(event) =>
										handleFieldChange(rule.id, "priority", Number(event.target.value))
									}
									type="number"
									value={rule.priority}
								/>
							</div>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label>Assignment method</Label>
								<Select
									onValueChange={(value) =>
										handleFieldChange(
											rule.id,
											"assignmentMethod",
											value as DispatchRuleForm["assignmentMethod"]
										)
									}
									value={rule.assignmentMethod}
								>
									<SelectTrigger className="mt-2">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{DISPATCH_ASSIGNMENT_METHODS.map((method) => (
											<SelectItem key={method} value={method}>
												{method.replace("_", " ")}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="flex items-center justify-between rounded-lg border p-3">
								<div>
									<p className="text-sm font-medium">Rule active</p>
									<p className="text-muted-foreground text-xs">Disable to keep for reference.</p>
								</div>
								<Switch
									checked={rule.isActive}
									onCheckedChange={(checked) => handleFieldChange(rule.id, "isActive", checked)}
								/>
							</div>
						</div>

						<div>
							<Label>Conditions JSON</Label>
							<Textarea
								className="mt-2 font-mono text-sm"
								onChange={(event) => handleFieldChange(rule.id, "conditions", event.target.value)}
								rows={5}
								value={rule.conditions}
							/>
						</div>

						<div>
							<Label>Actions JSON</Label>
							<Textarea
								className="mt-2 font-mono text-sm"
								onChange={(event) => handleFieldChange(rule.id, "actions", event.target.value)}
								rows={5}
								value={rule.actions}
							/>
						</div>

						<div className="flex items-center justify-between">
							<Button onClick={() => handleSaveRule(rule)} size="sm" variant="default">
								Save rule
							</Button>
							<Button onClick={() => handleDeleteRule(rule.id)} size="sm" variant="ghost">
								<Trash2 className="mr-2 size-4" />
								Delete
							</Button>
						</div>
					</CardContent>
				</Card>
			))}
		</SettingsPageLayout>
	);
}

export default DispatchRulesClient;

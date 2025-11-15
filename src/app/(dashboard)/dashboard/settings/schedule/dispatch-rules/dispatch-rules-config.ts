import type { Database } from "@/types/supabase";

export type DispatchRuleRecord =
  Database["public"]["Tables"]["schedule_dispatch_rules"]["Row"];

export type DispatchRuleForm = {
  id: string;
  ruleName: string;
  priority: number;
  isActive: boolean;
  assignmentMethod:
    | "auto"
    | "manual"
    | "round_robin"
    | "closest_technician"
    | "skill_based";
  conditions: string;
  actions: string;
};

export const DISPATCH_ASSIGNMENT_METHODS: DispatchRuleForm["assignmentMethod"][] =
  ["auto", "manual", "round_robin", "closest_technician", "skill_based"];

export function mapDispatchRuleRows(
  rows: DispatchRuleRecord[]
): DispatchRuleForm[] {
  if (!rows?.length) {
    return [];
  }

  return rows.map((row) => ({
    id: row.id,
    ruleName: row.rule_name ?? "",
    priority: row.priority ?? 0,
    isActive: row.is_active ?? true,
    assignmentMethod:
      (row.assignment_method as DispatchRuleForm["assignmentMethod"]) ?? "auto",
    conditions: JSON.stringify(row.conditions ?? {}, null, 2),
    actions: JSON.stringify(row.actions ?? {}, null, 2),
  }));
}

export function buildDispatchRuleFormData(rule: DispatchRuleForm) {
  const formData = new FormData();
  formData.append("ruleName", rule.ruleName);
  formData.append("priority", rule.priority.toString());
  formData.append("isActive", rule.isActive.toString());
  formData.append("assignmentMethod", rule.assignmentMethod);
  formData.append("conditions", rule.conditions || "{}");
  formData.append("actions", rule.actions || "{}");
  return formData;
}

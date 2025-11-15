import { getDispatchRules } from "@/actions/settings";
import { DispatchRulesClient } from "./dispatch-rules-client";

export default async function DispatchRulesSettingsPage() {
  const result = await getDispatchRules();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load dispatch rules");
  }

  return <DispatchRulesClient initialRules={result.data ?? null} />;
}

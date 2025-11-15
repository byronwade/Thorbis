import { getTeamSchedulingRules } from "@/actions/settings";
import TeamSchedulingClient from "./team-scheduling-client";
import {
  DEFAULT_TEAM_SCHEDULING_SETTINGS,
  mapTeamSchedulingSettings,
} from "./team-scheduling-config";

export const revalidate = 1800;

export default async function TeamSchedulingPage() {
  const result = await getTeamSchedulingRules();

  if (!result.success) {
    throw new Error(result.error ?? "Failed to load team scheduling rules");
  }

  const initialSettings = {
    ...DEFAULT_TEAM_SCHEDULING_SETTINGS,
    ...mapTeamSchedulingSettings(result.data ?? null),
  };

  return <TeamSchedulingClient initialSettings={initialSettings} />;
}

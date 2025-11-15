import { addDays, subDays } from "date-fns";
import { CompanyGate } from "@/components/company/company-gate";
import { SchedulePageClient } from "@/components/schedule/schedule-page-client";
import {
  getActiveCompanyId,
  getUserCompanies,
} from "@/lib/auth/company-context";
import type { ScheduleBootstrapSerialized } from "@/lib/schedule-bootstrap";
import { serializeScheduleBootstrap } from "@/lib/schedule-bootstrap";
import { fetchScheduleData } from "@/lib/schedule-data";
import { createClient } from "@/lib/supabase/server";

export default async function SchedulePage() {
  let initialData: ScheduleBootstrapSerialized | undefined;
  let bootstrapError: string | null = null;
  const supabase = await createClient();
  const companyId = await getActiveCompanyId();

  if (!companyId) {
    const companies = await getUserCompanies();
    return (
      <CompanyGate
        context="scheduling"
        hasCompanies={(companies ?? []).length > 0}
      />
    );
  }

  if (!supabase) {
    return <CompanyGate context="scheduling" hasCompanies />;
  }

  try {
    const now = new Date();
    const defaultRange = {
      start: subDays(now, 7),
      end: addDays(now, 30),
    };

    const { jobs, technicians } = await fetchScheduleData({
      supabase,
      companyId,
      range: defaultRange,
    });

    initialData = serializeScheduleBootstrap({
      companyId,
      jobs,
      technicians,
      range: defaultRange,
      lastSync: new Date(),
    });
  } catch (error) {
    bootstrapError =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Unable to load schedule data";
    console.warn("Schedule bootstrap failed", bootstrapError);
  }

  return (
    <SchedulePageClient
      bootstrapError={bootstrapError}
      initialData={initialData}
    />
  );
}

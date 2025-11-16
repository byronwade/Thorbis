"use server";

import { z } from "zod";
import {
  createResendDomain,
  createInboundRoute as createResendInboundRoute,
  getResendDomain,
  verifyResendDomain,
} from "@/lib/email/resend-domains";
import { ActionError, ERROR_CODES } from "@/lib/errors/action-error";
import {
  type ActionResult,
  assertAuthenticated,
  withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

const DOMAIN_MIN_LENGTH = 3;
const DOMAIN_MAX_LENGTH = 255;

const domainSchema = z.object({
  domain: z.string().min(DOMAIN_MIN_LENGTH).max(DOMAIN_MAX_LENGTH),
});

type SupabaseServerClient = Exclude<
  Awaited<ReturnType<typeof createClient>>,
  null
>;

const HTTP_STATUS = {
  forbidden: 403,
  notFound: 404,
} as const;

const COMPANY_ADDRESS_SLICE_LENGTH = 8;

async function getCompanyId(supabase: SupabaseServerClient, userId: string) {
  const { data: teamMember } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (!teamMember?.company_id) {
    throw new ActionError(
      "You must be part of a company",
      ERROR_CODES.AUTH_FORBIDDEN,
      HTTP_STATUS.forbidden
    );
  }

  return teamMember.company_id;
}

export function provisionEmailDomain(
  formData: FormData
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    const typedSupabase = supabase as SupabaseServerClient;
    const companyId = await getCompanyId(typedSupabase, user.id);
    const { domain } = domainSchema.parse({
      domain: formData.get("domain"),
    });

    const existing = await typedSupabase
      .from("communication_email_domains")
      .select("*")
      .eq("company_id", companyId)
      .eq("domain", domain)
      .maybeSingle();

    if (existing.data) {
      throw new ActionError(
        "Domain already exists",
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    const result = await createResendDomain(domain);
    if (!result.success) {
      throw new ActionError(result.error, ERROR_CODES.EXTERNAL_API_ERROR);
    }

    await typedSupabase.from("communication_email_domains").insert({
      company_id: companyId,
      domain,
      status: result.data.status || "pending",
      resend_domain_id: result.data.id,
      dns_records: result.data.records || [],
      last_synced_at: new Date().toISOString(),
    });
  });
}

export function refreshEmailDomain(
  domainId: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    const typedSupabase = supabase as SupabaseServerClient;

    const companyId = await getCompanyId(typedSupabase, user.id);

    const { data: domain } = await typedSupabase
      .from("communication_email_domains")
      .select("*")
      .eq("company_id", companyId)
      .eq("id", domainId)
      .maybeSingle();

    if (!domain?.resend_domain_id) {
      throw new ActionError(
        "Domain not found",
        ERROR_CODES.NOT_FOUND,
        HTTP_STATUS.notFound
      );
    }

    const result = await getResendDomain(domain.resend_domain_id);
    if (!result.success) {
      throw new ActionError(result.error, ERROR_CODES.EXTERNAL_API_ERROR);
    }

    await typedSupabase
      .from("communication_email_domains")
      .update({
        status: result.data.status,
        dns_records: result.data.records || [],
        last_synced_at: new Date().toISOString(),
        last_verified_at:
          result.data.status === "verified"
            ? new Date().toISOString()
            : domain.last_verified_at,
      })
      .eq("id", domainId);
  });
}

export function verifyEmailDomain(
  domainId: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    const typedSupabase = supabase as SupabaseServerClient;

    const companyId = await getCompanyId(typedSupabase, user.id);

    const { data: domain } = await typedSupabase
      .from("communication_email_domains")
      .select("*")
      .eq("company_id", companyId)
      .eq("id", domainId)
      .maybeSingle();

    if (!domain?.resend_domain_id) {
      throw new ActionError(
        "Domain not found",
        ERROR_CODES.NOT_FOUND,
        HTTP_STATUS.notFound
      );
    }

    const result = await verifyResendDomain(domain.resend_domain_id);
    if (!result.success) {
      throw new ActionError(result.error, ERROR_CODES.EXTERNAL_API_ERROR);
    }
  });
}

export async function ensureInboundRoute(): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    const typedSupabase = supabase as SupabaseServerClient;
    const companyId = await getCompanyId(typedSupabase, user.id);

    const { data: existing } = await typedSupabase
      .from("communication_email_inbound_routes")
      .select("*")
      .eq("company_id", companyId)
      .maybeSingle();

    if (existing) {
      return;
    }

    const inboundDomain = process.env.RESEND_INBOUND_DOMAIN;
    if (!inboundDomain) {
      throw new ActionError(
        "RESEND_INBOUND_DOMAIN is not configured",
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    const address = `company-${companyId.slice(
      0,
      COMPANY_ADDRESS_SLICE_LENGTH
    )}@${inboundDomain}`;
    const destinationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/api/webhooks/resend`;

    const result = await createResendInboundRoute({
      name: `Company ${companyId}`,
      recipients: [address],
      url: destinationUrl,
    });

    if (!result.success) {
      throw new ActionError(result.error, ERROR_CODES.EXTERNAL_API_ERROR);
    }

    await typedSupabase.from("communication_email_inbound_routes").insert({
      company_id: companyId,
      route_address: address,
      resend_route_id: result.data.id,
      signing_secret: result.data?.secret ?? null,
      status: result.data?.status ?? "pending",
      destination_url: destinationUrl,
      last_synced_at: new Date().toISOString(),
    });
  });
}

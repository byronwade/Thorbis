import "server-only";

const TELNYX_BASE_URL = "https://api.telnyx.com/v2";

type TelnyxRequestOptions = {
  method?: "GET" | "POST";
  body?: Record<string, unknown>;
};

async function telnyxRequest<TResponse>(
  path: string,
  { method = "GET", body }: TelnyxRequestOptions = {}
): Promise<{ success: boolean; data?: TResponse; error?: string }> {
  const apiKey = process.env.TELNYX_API_KEY;
  if (!apiKey) {
    return { success: false, error: "TELNYX_API_KEY is not configured" };
  }

  const response = await fetch(`${TELNYX_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = (await response.json().catch(() => undefined)) as
    | { data?: TResponse; errors?: Array<{ detail?: string }> }
    | undefined;

  if (!response.ok) {
    const message =
      payload?.errors?.[0]?.detail ||
      payload?.errors?.[0] ||
      response.statusText;
    return {
      success: false,
      error: `Telnyx ${response.status}: ${message}`,
    };
  }

  return { success: true, data: payload?.data };
}

export type TenDlcBrandPayload = {
  customer_reference: string;
  brand_name: string;
  ein: string;
  ein_issuing_country?: string;
  vertical: string;
  website: string | null;
  stock_symbol?: string | null;
  company_type?: "PRIVATE_PROFIT" | "PUBLIC_PROFIT" | "NON_PROFIT";
  address: {
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  contact: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    job_position?: string | null;
  };
  optional_attributes?: Record<string, unknown>;
};

export async function createTenDlcBrand(payload: TenDlcBrandPayload) {
  return telnyxRequest<{ id: string }>("/10dlc/brands", {
    method: "POST",
    body: payload,
  });
}

export async function getTenDlcBrand(brandId: string) {
  return telnyxRequest<{ id: string; status: string }>(`/10dlc/brands/${brandId}`);
}

export type TenDlcCampaignPayload = {
  brand_id: string;
  campaign_alias: string;
  usecase: string;
  description: string;
  sample_messages: string[];
  message_flow: string;
  terms_and_conditions: string;
  help_message: string;
  help_phone_number: string;
  help_email: string;
  auto_renewal: boolean;
  message_fee_credits?: number;
  usecase_details?: Record<string, unknown>;
  sub_usecases?: string[];
  opt_in_keywords?: string[];
  opt_out_keywords?: string[];
  opt_in_message?: string;
  opt_out_message?: string;
};

export async function createTenDlcCampaign(payload: TenDlcCampaignPayload) {
  return telnyxRequest<{ id: string }>("/10dlc/campaigns", {
    method: "POST",
    body: payload,
  });
}

export async function getTenDlcCampaign(campaignId: string) {
  return telnyxRequest<{ id: string; status: string; usecase: string }>(
    `/10dlc/campaigns/${campaignId}`
  );
}

export async function attachNumberToCampaign(
  campaignId: string,
  phoneNumber: string
) {
  return telnyxRequest<{ id: string }>(
    `/10dlc/campaigns/${campaignId}/phone_numbers`,
    {
      method: "POST",
      body: {
        phone_numbers: [{ phone_number: phoneNumber }],
      },
    }
  );
}


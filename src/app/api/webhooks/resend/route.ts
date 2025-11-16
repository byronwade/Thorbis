import { Buffer } from "node:buffer";
import type { SupabaseClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { verifyResendWebhookSignature } from "@/lib/email/resend-domains";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import type { Database } from "@/types/supabase";

type TypedSupabaseClient = SupabaseClient<Database>;

export async function POST(request: Request) {
  const rawBody = await request.text();
  const headersList = await headers();
  const signature = headersList.get("resend-signature") || "";

  const isValid = verifyResendWebhookSignature({
    payload: rawBody,
    signature,
  });

  if (!isValid) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as ResendWebhookPayload;
  const supabase = await createServiceSupabaseClient();

  switch (payload.type) {
    case "email.delivered":
    case "email.bounced":
    case "email.complained":
    case "email.opened":
    case "email.clicked":
      await handleEmailEvent(supabase, payload);
      break;
    case "email.received":
      await handleEmailReceived(supabase, payload);
      break;
    default:
      break;
  }

  return NextResponse.json({ success: true });
}

async function handleEmailEvent(
  supabase: TypedSupabaseClient,
  payload: ResendWebhookPayload
) {
  const communicationId = payload.data.tags?.find(
    (tag) => tag.name === "communication_id"
  )?.value;

  if (!communicationId) {
    return;
  }

  await supabase.from("communication_email_events").insert({
    communication_id: communicationId,
    event_type: payload.type,
    provider_event_id: payload.data.id,
    payload,
    occurred_at: payload.created_at,
  });

  const updates: Record<string, unknown> = {
    provider_status: payload.type,
    provider_metadata: payload,
  };

  if (payload.type === "email.delivered") {
    updates.status = "delivered";
    updates.delivered_at = new Date().toISOString();
  }

  if (payload.type === "email.opened") {
    updates.opened_at = new Date().toISOString();
  }

  await supabase
    .from("communications")
    .update(updates)
    .eq("id", communicationId);
}

async function handleEmailReceived(
  supabase: TypedSupabaseClient,
  payload: ResendWebhookPayload
) {
  const destination = payload.data.to?.[0]?.email;
  if (!destination) {
    return;
  }

  const { data: route } = await supabase
    .from("communication_email_inbound_routes")
    .select("company_id")
    .eq("route_address", destination)
    .maybeSingle();

  if (!route?.company_id) {
    return;
  }

  const attachments = payload.data.attachments || [];
  const storedAttachments = [];

  for (const attachment of attachments) {
    if (!(attachment.filename && attachment.content)) {
      continue;
    }
    try {
      const buffer = Buffer.from(attachment.content, "base64");
      const filePath = `${route.company_id}/${Date.now()}-${attachment.filename}`;
      await supabase.storage
        .from("email-attachments")
        .upload(filePath, buffer, {
          contentType: attachment.content_type || "application/octet-stream",
          upsert: true,
        });
      storedAttachments.push({
        name: attachment.filename,
        path: filePath,
        type: attachment.content_type,
      });
    } catch (_error) {}
  }

  await supabase.from("communications").insert({
    company_id: route.company_id,
    type: "email",
    channel: "resend",
    direction: "inbound",
    from_address: payload.data.from?.[0]?.email,
    from_name: payload.data.from?.[0]?.name,
    to_address: destination,
    subject: payload.data.subject || "(No subject)",
    body: payload.data.text || "",
    body_html: payload.data.html || null,
    status: "delivered",
    provider_message_id: payload.data.id,
    provider_metadata: payload,
    attachments: storedAttachments,
    attachment_count: storedAttachments.length,
    is_thread_starter: true,
  });
}

type ResendWebhookPayload = {
  type: string;
  created_at: string;
  data: {
    id?: string;
    subject?: string;
    text?: string;
    html?: string;
    to?: { email: string }[];
    from?: { email: string; name?: string }[];
    tags?: { name: string; value: string }[];
    attachments?: Array<{
      filename?: string;
      content?: string;
      content_type?: string;
    }>;
  };
};

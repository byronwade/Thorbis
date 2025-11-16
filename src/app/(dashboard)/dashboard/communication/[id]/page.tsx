/**
 * Communication Detail Page - Server Component
 *
 * Shows full message details with actions for email, SMS, phone, and tickets
 *
 * Performance optimizations:
 * - Server Component by default
 * - Direct async/await for data fetching from Supabase
 * - URL-based navigation (shareable/bookmarkable)
 */

import {
  Archive,
  Mail,
  MessageSquare,
  Phone,
  Star,
  Ticket,
  Trash2,
} from "lucide-react";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type MessageType = "email" | "sms" | "phone" | "ticket";

type CommunicationRow = Database["public"]["Tables"]["communications"]["Row"];
type CustomerRow = Database["public"]["Tables"]["customers"]["Row"];

function getMessageIcon(type: MessageType) {
  switch (type) {
    case "email":
      return <Mail className="size-5" />;
    case "sms":
      return <MessageSquare className="size-5" />;
    case "phone":
      return <Phone className="size-5" />;
    case "ticket":
      return <Ticket className="size-5" />;
    default:
      return <MessageSquare className="size-5" />;
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "urgent":
      return "destructive";
    case "high":
      return "default";
    case "normal":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "secondary";
  }
}

export default async function CommunicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  if (!supabase) {
    notFound();
  }

  // Fetch communication record from database with customer info
  const { data: communication, error } = await supabase
    .from("communications")
    .select(
      `
      id,
      type,
      direction,
      status,
      priority,
      subject,
      body,
      created_at,
      read_at,
      from_address,
      to_address,
      customer_id,
      call_duration,
      call_recording_url,
      customer:customers(id, first_name, last_name, email, phone)
    `
    )
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error || !communication) {
    notFound();
  }

  // Extract customer info
  const customer = Array.isArray(communication.customer)
    ? communication.customer[0]
    : communication.customer;

  const customerName =
    customer && (customer.first_name || customer.last_name)
      ? `${customer.first_name || ""} ${customer.last_name || ""}`.trim()
      : "Unknown";

  const messageType = (communication.type || "email") as MessageType;
  const priority = (communication.priority || "normal") as
    | "low"
    | "normal"
    | "high"
    | "urgent";
  const timestamp = new Date(communication.created_at);

  // Determine from/to addresses
  const isInbound = communication.direction === "inbound";
  const fromAddress = communication.from_address || "";
  const toAddress = communication.to_address || "";

  return (
    <div className="flex h-full flex-col">
      {/* Message Header */}
      <div className="border-b bg-background p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              {getMessageIcon(messageType)}
              <h1 className="font-semibold text-2xl">
                {communication.subject ||
                  `${messageType.charAt(0).toUpperCase() + messageType.slice(1)} ${isInbound ? "from" : "to"} ${customerName}`}
              </h1>
              <Badge variant={getPriorityColor(priority)}>{priority}</Badge>
              <Badge variant={isInbound ? "default" : "secondary"}>
                {isInbound ? "Inbound" : "Outbound"}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {customerName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-foreground">
                    {customerName}
                  </div>
                  {fromAddress && (
                    <div className="text-xs">
                      {isInbound ? "From" : "To"}: {fromAddress}
                    </div>
                  )}
                  {messageType === "phone" && communication.call_duration && (
                    <div className="text-xs">
                      Duration: {Math.floor(communication.call_duration / 60)}m{" "}
                      {communication.call_duration % 60}s
                    </div>
                  )}
                </div>
              </div>
              <span>•</span>
              <span>{timestamp.toLocaleString()}</span>
              <span>•</span>
              <span className="capitalize">{communication.status}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Star className="mr-2 size-4" />
              Star
            </Button>
            <Button size="sm" variant="outline">
              <Archive className="mr-2 size-4" />
              Archive
            </Button>
            <Button size="sm" variant="outline">
              <Trash2 className="mr-2 size-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Call Recording */}
          {messageType === "phone" && communication.call_recording_url && (
            <div>
              <h3 className="mb-2 font-medium text-sm">Call Recording</h3>
              <audio
                className="w-full"
                controls
                src={communication.call_recording_url}
              >
                <track kind="captions" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* Message body */}
          <div className="rounded-lg border bg-card p-6">
            <div className="whitespace-pre-wrap font-normal text-sm leading-relaxed">
              {communication.body || "No content"}
            </div>
          </div>

          {/* Reply section */}
          <div className="border-t pt-6">
            <h3 className="mb-4 font-medium">Reply</h3>
            <div className="space-y-3">
              <textarea
                className="min-h-32 w-full rounded-lg border bg-background p-3 text-sm"
                placeholder={`Type your ${messageType} reply...`}
              />
              <div className="flex justify-between">
                <div className="flex gap-2">
                  {messageType === "email" && (
                    <Button size="sm" variant="outline">
                      Attach File
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    Add Template
                  </Button>
                </div>
                <Button size="sm">Send Reply</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

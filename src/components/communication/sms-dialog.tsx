/**
 * SMS Dialog - Internal SMS composer using Telnyx
 *
 * Features:
 * - Send SMS messages via Telnyx
 * - Character counter
 * - Creates communication records
 * - Shows send status
 */

"use client";

import { MessageSquare, Send } from "lucide-react";
import { useState, useTransition } from "react";
import { sendTextMessage } from "@/actions/telnyx";
import type {
  CommunicationRecord,
  CompanyPhone,
} from "@/components/communication/communication-page-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type SMSDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName: string;
  customerPhone: string;
  companyId: string;
  customerId?: string;
  companyPhones?: CompanyPhone[];
  jobId?: string;
  propertyId?: string;
  invoiceId?: string;
  estimateId?: string;
  onCommunicationCreated?: (record: CommunicationRecord) => void;
};

export function SMSDialog({
  open,
  onOpenChange,
  customerName,
  customerPhone,
  customerId,
  companyId,
  companyPhones = [],
  jobId,
  propertyId,
  invoiceId,
  estimateId,
  onCommunicationCreated,
}: SMSDialogProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [selectedPhone, setSelectedPhone] = useState(
    companyPhones[0]?.number || ""
  );

  const charCount = message.length;
  const maxChars = 1600; // SMS max length (multiple segments)
  const SMS_SEGMENT_LENGTH = 160;
  const segmentCount = Math.ceil(charCount / SMS_SEGMENT_LENGTH);

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Please enter a message to send");
      return;
    }

    if (!selectedPhone) {
      toast.error("Please select a company phone number to send from");
      return;
    }

    startTransition(async () => {
      const result = await sendTextMessage({
        to: customerPhone,
        from: selectedPhone,
        text: message,
        companyId,
        customerId,
        jobId,
        propertyId,
        invoiceId,
        estimateId,
      });

      if (result.success && "data" in result && result.data) {
        toast.success(`Text message sent to ${customerName}`);
        onCommunicationCreated?.(result.data as CommunicationRecord);
        setMessage("");
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to send text message");
      }
    });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="size-5" />
            Send Text Message
          </DialogTitle>
          <DialogDescription>
            Send an SMS message to {customerName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Recipient Info */}
          <div className="rounded-lg border bg-muted/50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                {customerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm">{customerName}</div>
                <div className="text-muted-foreground text-xs">
                  {customerPhone}
                </div>
              </div>
            </div>
          </div>

          {/* From Phone Selection */}
          {companyPhones.length > 0 ? (
            <div className="space-y-2">
              <Label>Send From</Label>
              <Select onValueChange={setSelectedPhone} value={selectedPhone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a phone number" />
                </SelectTrigger>
                <SelectContent>
                  {companyPhones.map((phone) => (
                    <SelectItem key={phone.id} value={phone.number}>
                      {phone.label || phone.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="rounded-lg border border-warning bg-warning p-4 text-center dark:border-warning dark:bg-warning">
              <p className="text-sm text-warning dark:text-warning">
                No company phone numbers configured.
              </p>
              <p className="mt-1 text-warning text-xs dark:text-warning">
                Purchase or port a phone number from Settings → Phone Numbers
              </p>
            </div>
          )}

          {/* Message Input */}
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              className="min-h-[120px] resize-none"
              maxLength={maxChars}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              value={message}
            />
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>
                {charCount} / {maxChars} characters
              </span>
              <span>
                {segmentCount} SMS segment{segmentCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <Button
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            disabled={
              isPending ||
              !message.trim() ||
              !selectedPhone ||
              companyPhones.length === 0
            }
            onClick={handleSend}
          >
            <Send className="mr-2 size-4" />
            {companyPhones.length === 0 ? "No Phone Numbers" : "Send Message"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

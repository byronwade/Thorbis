"use client";

import { useCallback } from "react";
import type {
  CommunicationRecord,
  CompanyPhone,
} from "@/components/communication/communication-page-client";
import { useCommunicationStore } from "@/lib/stores/communication-store";
import { CallComposerDialog } from "./call-composer-dialog";
import { EmailDialog } from "./email-dialog";
import { SMSDialog } from "./sms-dialog";

type CommunicationComposerHostProps = {
  companyId: string;
  companyPhones: CompanyPhone[];
  onCommunicationCreated: (record: CommunicationRecord) => void;
};

export function CommunicationComposerHost({
  companyId,
  companyPhones,
  onCommunicationCreated,
}: CommunicationComposerHostProps) {
  const composer = useCommunicationStore((state) => state.composer);
  const closeComposer = useCommunicationStore((state) => state.closeComposer);

  const handleClose = useCallback(() => {
    closeComposer();
  }, [closeComposer]);

  if (!composer.type) {
    return null;
  }

  const context = composer.context ?? {};

  if (composer.type === "email") {
    return (
      <EmailDialog
        companyId={companyId}
        customerEmail={context.email || ""}
        customerId={context.customerId}
        customerName={context.customerName || "Customer"}
        defaultBody=""
        defaultSubject=""
        estimateId={context.estimateId}
        invoiceId={context.invoiceId}
        jobId={context.jobId}
        onCommunicationCreated={onCommunicationCreated}
        onOpenChange={(open) => {
          if (!open) {
            handleClose();
          }
        }}
        open
        propertyId={context.propertyId}
      />
    );
  }

  if (composer.type === "sms") {
    return (
      <SMSDialog
        companyId={companyId}
        companyPhones={companyPhones}
        customerId={context.customerId}
        customerName={context.customerName || "Customer"}
        customerPhone={context.phone || ""}
        estimateId={context.estimateId}
        invoiceId={context.invoiceId}
        jobId={context.jobId}
        onCommunicationCreated={onCommunicationCreated}
        onOpenChange={(open) => {
          if (!open) {
            handleClose();
          }
        }}
        open
        propertyId={context.propertyId}
      />
    );
  }

  return (
    <CallComposerDialog
      companyId={companyId}
      companyPhones={companyPhones}
      contactName={context.customerName}
      contactNumber={context.phone}
      customerId={context.customerId}
      estimateId={context.estimateId}
      invoiceId={context.invoiceId}
      jobId={context.jobId}
      onCallCreated={onCommunicationCreated}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
      open
      propertyId={context.propertyId}
    />
  );
}

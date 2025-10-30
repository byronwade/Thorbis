"use client";

/**
 * Contract Actions Component - Client Component
 *
 * Handles interactive actions for contracts like sending,
 * downloading, deleting, etc. This is extracted as a client
 * component to keep the main page as a Server Component.
 */

type ContractActionsProps = {
  contractId: string;
  status: string;
};

export function ContractActions({ contractId, status }: ContractActionsProps) {
  // This component can be expanded with modals, confirmation dialogs, etc.
  // For now it's a placeholder to keep the detail page as a Server Component
  return null;
}

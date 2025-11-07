/**
 * Contracts Types
 *
 * Shared types for contracts system.
 * Separated from server actions to comply with Next.js 16 "use server" restrictions.
 */

import { z } from "zod";

// Re-export the schemas for use in forms
export const contractSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  customer_id: z.string().uuid("Invalid customer ID"),
  property_id: z.string().uuid().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  renewal_type: z.enum(["manual", "automatic"]),
  billing_frequency: z.enum(["monthly", "quarterly", "annually"]),
  amount: z.number().positive("Amount must be positive"),
  terms: z.string().optional(),
});

export const signContractSchema = z.object({
  signature: z.string().min(1, "Signature is required"),
  signedBy: z.string().min(1, "Signer name is required"),
  signedAt: z.string().min(1, "Signature date is required"),
});

export type ContractInput = z.infer<typeof contractSchema>;
export type SignContractInput = z.infer<typeof signContractSchema>;

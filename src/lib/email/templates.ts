/**
 * Email Templates Re-exports
 * 
 * This file provides a clean way to import email templates from the emails directory
 * without bundling issues during Next.js compilation.
 */

// Re-export email templates using absolute paths
export { default as InvoiceEmail } from "../../../emails/templates/customer/invoice-notification";
export { default as EstimateEmail } from "../../../emails/templates/customer/estimate-notification";


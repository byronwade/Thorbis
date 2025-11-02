/**
 * New Customer Page - Intelligent Wizard
 *
 * Performance optimizations:
 * - Server Component wrapper (minimal overhead)
 * - Client-side wizard for interactive multi-step UX
 * - Smart form with progressive disclosure
 * - Context-aware fields and validation
 *
 * Features:
 * - 4-step guided wizard instead of long form
 * - Quick templates for common customer types
 * - Real-time validation and duplicate detection
 * - Smart autofill with AI suggestions
 * - Collects more data intelligently
 */

import { IntelligentCustomerWizard } from "@/components/customers/intelligent-customer-wizard";

export default function NewCustomerPage() {
  return <IntelligentCustomerWizard />;
}

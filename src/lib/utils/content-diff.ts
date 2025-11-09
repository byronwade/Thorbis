/**
 * Content Diff Utilities
 *
 * Detects changes between original and modified TipTap content
 * Extracts human-readable field changes for confirmation dialog
 */

interface Change {
  field: string;
  oldValue: any;
  newValue: any;
  section: string;
}

const FIELD_LABELS: Record<string, string> = {
  displayName: "Profile Display Name",
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  phone: "Phone",
  secondaryPhone: "Secondary Phone",
  billingEmail: "Billing Email",
  companyName: "Company Name",
  customerType: "Customer Type",
  address: "Street Address",
  address2: "Address Line 2",
  city: "City",
  state: "State",
  zipCode: "ZIP Code",
  country: "Country",
  paymentTerms: "Payment Terms",
  creditLimit: "Credit Limit",
  taxExempt: "Tax Exempt",
  taxExemptNumber: "Tax Exempt Number",
};

const SECTION_LABELS: Record<string, string> = {
  customerInfoBlock: "Customer Information",
  addressPropertiesAdaptiveBlock: "Address",
  billingInfoBlock: "Billing Information",
  notesCollapsibleBlock: "Notes",
  metricsBlock: "Metrics",
};

/**
 * Extract changes from TipTap content
 */
export function extractChanges(
  originalContent: any,
  newContent: any
): Change[] {
  const changes: Change[] = [];

  if (!(originalContent && newContent)) {
    return changes;
  }

  // Compare each block
  const originalBlocks = originalContent.content || [];
  const newBlocks = newContent.content || [];

  // Create a map of blocks by type for easy comparison
  const originalMap = new Map();
  originalBlocks.forEach((block: any) => {
    originalMap.set(block.type, block.attrs);
  });

  newBlocks.forEach((newBlock: any) => {
    const originalAttrs = originalMap.get(newBlock.type);
    if (!originalAttrs) return;

    const section = SECTION_LABELS[newBlock.type] || newBlock.type;

    // Compare each attribute
    Object.keys(newBlock.attrs || {}).forEach((key) => {
      const oldValue = originalAttrs[key];
      const newValue = newBlock.attrs[key];

      // Skip internal fields and IDs
      if (
        key === "id" ||
        key === "customerId" ||
        key === "properties" ||
        key === "jobs" ||
        key === "invoices" ||
        key === "equipment" ||
        key === "attachments" ||
        key === "paymentMethods" ||
        key === "activities" ||
        key === "metrics" ||
        key === "notesCount"
      ) {
        return;
      }

      // Check if value changed
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({
          field: FIELD_LABELS[key] || key,
          oldValue,
          newValue,
          section,
        });
      }
    });
  });

  return changes;
}

/**
 * Check if content has changes
 */
export function hasChanges(originalContent: any, newContent: any): boolean {
  return extractChanges(originalContent, newContent).length > 0;
}

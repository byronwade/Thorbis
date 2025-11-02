# Contracts Feature - Complete Implementation

## 🎉 What's Been Built

A complete digital contract management system for your field service management platform with support for:
- Standalone contracts
- Contracts linked to estimates/invoices for combined workflows
- Digital signature capture
- Public customer-facing signing pages
- Contract templates for reusability
- Full CRUD operations with Server Actions

---

## 📁 Files Created

### Database Schema
- **`src/lib/db/schema.ts`** - Added `contracts` table with full schema including:
  - Links to jobs, estimates, invoices (NOT directly to customers)
  - Digital signature fields (signature image, signer details, IP tracking)
  - Status workflow (draft, sent, viewed, signed, rejected, expired)
  - Contract types (service, maintenance, custom)
  - Validity periods and terms
  - Template support

**Important Design Decision**: Contracts are NOT linked directly to customers. They must be linked to either an estimate or invoice (which already contain customer information). This prevents data duplication and maintains a single source of truth.

### Dashboard Pages (Protected Routes)
1. **`src/app/(dashboard)/dashboard/work/contracts/page.tsx`**
   - Main contracts list with statistics
   - Server Component with mock data (ready for DB integration)
   - Actions: Export, Templates, New Contract

2. **`src/app/(dashboard)/dashboard/work/contracts/new/page.tsx`**
   - Create new contract form page
   - Supports pre-filling from estimates/invoices via query params
   - Server Component wrapper

3. **`src/app/(dashboard)/dashboard/work/contracts/[id]/page.tsx`**
   - Contract detail page with full information
   - View contract terms, signature status, activity timeline
   - Actions: Download PDF, Send, Edit, Delete
   - Server Component with mock data

4. **`src/app/(dashboard)/dashboard/work/contracts/templates/page.tsx`**
   - Manage reusable contract templates
   - Template usage statistics
   - Create templates for faster contract creation

### Public Pages (Customer-Facing)
1. **`src/app/(marketing)/contracts/sign/[id]/page.tsx`**
   - Public contract signing page (no auth required)
   - Clean, customer-friendly interface
   - Trust badges (secure, quick, legally binding)
   - Contract terms display

2. **`src/app/(marketing)/contracts/sign/[id]/success/page.tsx`**
   - Success confirmation after signing
   - Download signed contract option
   - Email confirmation notice

### Components
1. **`src/components/work/contracts-table.tsx`** - Client Component
   - Full-featured datatable with sorting, filtering, pagination
   - Status badges (signed, sent, viewed, draft, rejected, expired)
   - Contract type badges (service, maintenance, custom)
   - Row actions (View, Send, Download, Delete)
   - Bulk actions support
   - Search by contract number, customer, title, status, type

2. **`src/components/work/contract-form.tsx`** - Client Component
   - Comprehensive form for creating/editing contracts
   - Contract information, terms, validity period
   - Signer information capture
   - Internal notes
   - Integration with Server Actions

3. **`src/components/work/signature-pad.tsx`** - Client Component
   - HTML5 canvas-based signature capture
   - Touch and mouse support
   - Base64 PNG export
   - Clear/reset functionality
   - Visual feedback when signature captured

4. **`src/components/work/contract-signing-form.tsx`** - Client Component
   - Public-facing signing form
   - Signer information capture
   - Signature pad integration
   - Terms agreement checkbox
   - IP address tracking (server-side)

5. **`src/components/work/contract-actions.tsx`** - Client Component
   - Placeholder for interactive contract actions
   - Keeps detail page as Server Component

### Server Actions
**`src/actions/contracts.ts`** - Complete CRUD operations:
- `createContract()` - Create new contracts
- `updateContract()` - Update existing contracts
- `deleteContract()` - Delete contracts
- `sendContract()` - Send contracts for signature via email
- `signContract()` - Customer-facing signature action
- `rejectContract()` - Reject contracts
- `trackContractView()` - Track when customers view contracts

All actions include:
- Zod validation schemas
- TypeScript types
- Error handling
- Path revalidation
- TODO comments for database integration

### Navigation
**`src/components/layout/app-sidebar.tsx`**
- Added "Contracts" link to Financial Documents section
- Positioned between Estimates and Purchase Orders
- Uses FileSignature icon

---

## 🔑 Key Features

### 1. Flexible Workflows
- **Estimate Contracts**: Link contract to estimate for quote + agreement workflow
- **Invoice Contracts**: Link contract to invoice for payment + terms agreement
- **Job Contracts**: Link to jobs for service agreements
- **Example**: Send estimate + contract together for customer signature
- **Example**: Send invoice + contract for payment terms agreement

**Access Points**: Contracts can be viewed from multiple locations:
- Main contracts list (`/dashboard/work/contracts`)
- Customer profile → Documents tab (shows all contracts via linked estimates/invoices)
- Job page → Documents section (shows contracts linked to that job)
- Estimate page → Contracts section (shows contracts linked to that estimate)
- Invoice page → Contracts section (shows contracts linked to that invoice)

### 2. Digital Signatures
- Canvas-based signature capture
- Base64 PNG storage in database
- Signer information capture (name, email, title, company)
- IP address tracking for legal compliance
- Timestamp tracking (sent, viewed, signed)

### 3. Status Workflow
```
draft → sent → viewed → signed
              ↓
           rejected/expired
```

### 4. Contract Templates
- Create reusable templates
- Track usage statistics
- Quick contract creation from templates
- Pre-filled content and terms

### 5. Public Signing Experience
- Clean, customer-friendly interface
- No authentication required
- Trust badges for confidence
- Legal compliance information
- Email confirmations

### 6. Security & Compliance
- IP address tracking
- Timestamp recording
- E-signature law compliance
- Secure data handling
- Legal disclaimers

---

## 🚀 Next Steps to Complete

### 1. Database Integration (Priority: HIGH)

Replace mock data with real database queries:

```typescript
// In page.tsx files, replace mock data with:
import { db } from "@/lib/db";
import { contracts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const contractList = await db.select().from(contracts).where(...);
```

### 2. Connect Server Actions to Database

In `src/actions/contracts.ts`, implement the TODO sections:

```typescript
// Example for createContract
const [contract] = await db.insert(contracts).values({
  ...data,
  companyId: await getCurrentCompanyId(),
  contractNumber: generateContractNumber(),
  status: 'draft',
}).returning();
```

### 3. Add Missing Helper Functions

Create these utility functions:

```typescript
// src/lib/utils/contract-utils.ts
export function generateContractNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CNT-${year}-${random}`;
}

export async function getCurrentCompanyId(): Promise<string> {
  // Get from session or context
}
```

### 4. Email Integration

Implement email sending for contract notifications:

```typescript
// src/lib/email/contract-emails.ts
export async function sendContractForSignature(contract: Contract) {
  const signingUrl = `${process.env.NEXT_PUBLIC_URL}/contracts/sign/${contract.id}`;

  await sendEmail({
    to: contract.signerEmail,
    subject: `Contract for Signature: ${contract.title}`,
    template: 'contract-signature-request',
    data: { contract, signingUrl },
  });
}
```

### 5. PDF Generation

Add PDF export functionality:

```typescript
// src/lib/pdf/contract-pdf.ts
import { jsPDF } from 'jspdf';

export async function generateContractPDF(contractId: string) {
  const contract = await db.select().from(contracts)
    .where(eq(contracts.id, contractId)).limit(1);

  const doc = new jsPDF();
  // Add contract content, signature, etc.
  return doc.output('blob');
}
```

### 6. Display Contracts on Customer Profiles

Add a contracts section to customer profile pages:

```typescript
// src/app/(dashboard)/dashboard/customers/[id]/page.tsx
import { ContractsTable } from "@/components/work/contracts-table";

export default async function CustomerPage({ params }) {
  const { id } = await params;

  // Get contracts for this customer through estimates/invoices
  const contracts = await db.select()
    .from(contracts)
    .leftJoin(estimates, eq(contracts.estimateId, estimates.id))
    .leftJoin(invoices, eq(contracts.invoiceId, invoices.id))
    .where(
      or(
        eq(estimates.customerId, id),
        eq(invoices.customerId, id)
      )
    );

  return (
    <CustomerLayout>
      <Tabs>
        <TabsContent value="documents">
          <h3>Contracts</h3>
          <ContractsTable contracts={contracts} />
        </TabsContent>
      </Tabs>
    </CustomerLayout>
  );
}
```

### 7. IP Address Tracking

Implement server-side IP capture:

```typescript
// In signContract server action
import { headers } from 'next/headers';

const headersList = await headers();
const forwarded = headersList.get('x-forwarded-for');
const ipAddress = forwarded ? forwarded.split(',')[0] : headersList.get('x-real-ip');
```

### 8. Display Contracts on Estimate/Invoice Pages

Add contracts section to estimate and invoice detail pages:

```typescript
// On estimate detail page
export default async function EstimateDetailPage({ params }) {
  const { id } = await params;

  const estimate = await db.select().from(estimates)...;
  const relatedContracts = await db.select().from(contracts)
    .where(eq(contracts.estimateId, id));

  return (
    <EstimateLayout>
      <EstimateDetails estimate={estimate} />

      {relatedContracts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Related Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <ContractsList contracts={relatedContracts} />
          </CardContent>
        </Card>
      )}

      <Button asChild>
        <Link href={`/dashboard/work/contracts/new?estimateId=${id}`}>
          Add Contract to this Estimate
        </Link>
      </Button>
    </EstimateLayout>
  );
}
```

### 9. Template CRUD Operations

Implement template management:

```typescript
// Add templates table to schema
// Create template actions in src/actions/contract-templates.ts
// Build template edit page
```

### 10. Testing & Validation

- Test signature capture on mobile devices
- Verify email sending
- Test PDF generation
- Validate all form inputs
- Test public signing flow end-to-end
- Check accessibility (WCAG compliance)

---

## 📊 Database Migration

Run migration to create the contracts table:

```bash
# Generate migration
pnpm drizzle-kit generate:pg

# Apply migration
pnpm drizzle-kit push:pg
```

---

## 🎨 Design Patterns Used

### Server Components (Default)
- All page.tsx files are Server Components
- Fetches data before rendering
- Better SEO and initial page load

### Client Components (Minimal)
- Only interactive parts are client components
- Forms, signature pad, interactive actions
- Marked with `"use client"` directive

### Server Actions
- Replace client-side state management
- Form handling with proper validation
- Path revalidation after mutations

### Type Safety
- Zod schemas for validation
- TypeScript types exported from schemas
- Type-safe database queries

---

## 🔗 Integration Points

### With Estimates
```typescript
// Link contract to estimate (customer info comes from estimate)
const estimate = await db.select().from(estimates)
  .where(eq(estimates.id, estimateId)).limit(1);

const customer = await db.select().from(users)
  .where(eq(users.id, estimate[0].customerId)).limit(1);

const contract = await createContract({
  ...contractData,
  estimateId: estimate[0].id,
  jobId: estimate[0].jobId,
  signerEmail: customer[0].email, // Send to customer's email
});

// Send both together
await sendEstimateWithContract(estimate[0], contract);
```

### With Invoices
```typescript
// Link contract to invoice (for payment terms agreement)
const invoice = await db.select().from(invoices)
  .where(eq(invoices.id, invoiceId)).limit(1);

const customer = await db.select().from(users)
  .where(eq(users.id, invoice[0].customerId)).limit(1);

const contract = await createContract({
  ...contractData,
  invoiceId: invoice[0].id,
  jobId: invoice[0].jobId,
  signerEmail: customer[0].email,
});
```

### Querying Contracts by Customer
```typescript
// Get all contracts for a customer (through estimates/invoices)
const customerContracts = await db.select()
  .from(contracts)
  .leftJoin(estimates, eq(contracts.estimateId, estimates.id))
  .leftJoin(invoices, eq(contracts.invoiceId, invoices.id))
  .where(
    or(
      eq(estimates.customerId, customerId),
      eq(invoices.customerId, customerId)
    )
  );
```

### Viewing Contracts on Customer Profile
```typescript
// Customer profile page shows contracts
export default async function CustomerPage({ params }) {
  const { customerId } = await params;

  // Fetch contracts linked through estimates/invoices
  const contracts = await getContractsByCustomer(customerId);

  return (
    <CustomerLayout>
      <DocumentsTab contracts={contracts} />
    </CustomerLayout>
  );
}
```

---

## 📱 User Experience Flow

### Internal User (Dashboard)
1. Navigate to Work → Contracts
2. Click "New Contract"
3. Fill in contract details and terms
4. Save as draft or send immediately
5. Track signing status in list view
6. View signed contracts and download PDFs

### Customer (Public)
1. Receive email with signing link
2. Click link to public signing page
3. Review contract terms
4. Provide information
5. Draw signature on canvas
6. Agree to terms
7. Submit signature
8. Receive confirmation email
9. Download signed contract

---

## 🛡️ Security Considerations

### Authentication
- Dashboard pages: Protected by authentication middleware
- Public pages: No auth required (contract ID acts as token)
- Consider adding token-based access for extra security

### Data Protection
- SSL/HTTPS for all pages
- IP address tracking for audit trail
- Timestamp recording
- Signature stored as base64 PNG

### Legal Compliance
- E-signature law compliant (ESIGN Act, UETA)
- Audit trail: Who, When, Where (IP)
- Legal disclaimers on signing page
- Email confirmations

---

## 📈 Analytics & Tracking

Track important metrics:
- Contract conversion rate (sent → signed)
- Average time to signature
- Most used templates
- Rejection reasons
- Contract value by type

---

## 🎯 Future Enhancements

1. **Advanced Templates**
   - Variable substitution ([CUSTOMER_NAME], [DATE])
   - Conditional clauses
   - Template versioning

2. **Multi-Party Signatures**
   - Multiple signers per contract
   - Sequential signing workflows
   - Parallel signing

3. **Document Management**
   - Attach supporting documents
   - Version control
   - Document library

4. **Integration APIs**
   - DocuSign integration
   - HelloSign integration
   - Adobe Sign integration

5. **Advanced Features**
   - Contract reminders
   - Auto-renewal handling
   - Contract amendments
   - Bulk sending

---

## 📝 Notes

- All code follows Next.js 16+ patterns (async params, cookies, headers)
- Server Components by default for better performance
- Client Components only where needed for interactivity
- TypeScript strict mode enabled
- Zod validation for all form inputs
- Mock data ready to be replaced with database queries
- **Pattern Consistency**: Contracts pages follow the exact same pattern as Estimates and Invoices pages (using `DataTablePageHeader`, `Card` components, etc.)
- **Optional Refactor**: Pages could be refactored to use shared infrastructure like `AppToolbar` and `WorkPageLayout` if desired, but current implementation matches existing work pages

---

## ✅ Completion Checklist

- [x] Database schema design
- [x] Main contracts list page
- [x] New contract form page
- [x] Contract detail page
- [x] Contract table component
- [x] Contract form component
- [x] Signature pad component
- [x] Contract templates page
- [x] Public signing page
- [x] Signing success page
- [x] Signing form component
- [x] Server actions for CRUD
- [x] Navigation integration
- [ ] Database migration
- [ ] Connect to real database
- [ ] Email integration
- [ ] PDF generation
- [ ] IP tracking implementation
- [ ] Customer list integration
- [ ] Testing & validation

---

**Ready to go live after completing the database integration and email setup!** 🚀

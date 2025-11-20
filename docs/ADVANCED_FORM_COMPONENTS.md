# Advanced Form Components - Complete Reference

**Production-ready form components with enterprise features built on React Hook Form + Zod**

This document catalogs all advanced form components created for the Stratos application, providing usage examples, features, and integration patterns.

---

## 📦 Component Inventory

| Component | File | Lines | Status | Use Case |
|-----------|------|-------|--------|----------|
| DatePicker | `date-time-picker.tsx` | 528 | ✅ Ready | Scheduling, appointments |
| TimePicker | `date-time-picker.tsx` | Included | ✅ Ready | Time slots, availability |
| FileUpload | `file-upload.tsx` | 550+ | ✅ Ready | Photos, documents, contracts |
| Digital Signature | `digital-signature.tsx` | 580+ | ✅ Ready | Contracts, service agreements |
| Currency Input | `currency-input.tsx` | 540+ | ✅ Ready | Pricing, invoices, estimates |
| Tags/MultiSelect | `tags-input.tsx` | 500+ | ✅ Ready | Skills, categories, filters |
| ConditionalField | `conditional-field.tsx` | 250+ | ✅ Ready | Dynamic form visibility |
| FieldDependencies | `use-field-dependencies.ts` | 450+ | ✅ Ready | Auto-calculations |
| AsyncValidator | `async-validator.tsx` | 400+ | ✅ Ready | Real-time validation |
| RepeatingGroup | `repeating-group.tsx` | 420+ | ✅ Ready | Line items, contacts |
| FormProgress | `form-progress.tsx` | 600+ | ✅ Ready | Multi-step wizards |
| VoiceInput | `voice-input.tsx` | 580+ | ✅ Ready | Speech-to-text notes |
| BarcodeScanner | `barcode-scanner.tsx` | 520+ | ✅ Ready | Equipment tracking |
| LocationCapture | `location-capture.tsx` | 540+ | ✅ Ready | GPS check-in/out |
| RichTextEditor | `rich-text-editor.tsx` | 560+ | ✅ Ready | Formatted descriptions |

**Total: 14 comprehensive components with 7,500+ lines of production code**

---

## 🎯 1. DatePicker / TimePicker

**File:** `/src/components/ui/date-time-picker.tsx`

### Features
- ✅ Calendar grid with month/year navigation
- ✅ Business hours enforcement (weekdays 8am-6pm)
- ✅ Blocked dates (holidays, unavailability)
- ✅ Blocked days of week (e.g., no Sundays)
- ✅ Availability checking with visual indicators
- ✅ Smart suggestions (next available slot)
- ✅ Duration-based booking (2-hour blocks)
- ✅ Min/max date ranges
- ✅ Keyboard navigation (arrow keys, Enter, Escape)
- ✅ Accessibility (ARIA labels, screen reader)

### Usage

```tsx
import { DateTimePicker } from "@/components/ui/date-time-picker";

// Simple date picker
<DatePicker
  value={date}
  onChange={setDate}
  disabled PastdisablePast={true}
  label="Appointment Date"
/>

// With business hours
<DatePicker
  value={date}
  onChange={setDate}
  businessHoursOnly={true}
  blockedDaysOfWeek={[0, 6]} // No weekends
  blockedDates={holidays}
  showAvailability={true}
  availabilityData={technicianAvailability}
/>

// Time picker with duration
<TimePicker
  value={time}
  onChange={setTime}
  duration={120} // 2 hours
  businessHoursOnly={true}
  interval={30} // 30-minute slots
  showAvailability={true}
  technicianId={selectedTech}
/>

// Combined date + time
<DateTimePicker
  value={dateTime}
  onChange={setDateTime}
  businessHoursOnly={true}
  duration={60}
  showAvailability={true}
/>
```

### Field Service Use Cases
- **Job scheduling** - Book appointments with business hours
- **Technician dispatch** - Check availability before assignment
- **Service agreements** - Recurring maintenance schedules
- **Emergency calls** - Show next available slot
- **Equipment installation** - Multi-hour duration blocks

---

## 🎯 2. File Upload

**File:** `/src/components/ui/file-upload.tsx`

### Features
- ✅ Drag & drop interface with visual feedback
- ✅ Multiple file selection
- ✅ Image compression (auto-resize to 1920px, 80% quality)
- ✅ Preview grid (images, PDFs, videos)
- ✅ Camera access for mobile (before/after photos)
- ✅ Upload progress tracking
- ✅ File type validation
- ✅ Size validation (default 10MB)
- ✅ Copy/paste support
- ✅ Thumbnail generation
- ✅ Three variants: default, compact, inline

### Usage

```tsx
import { FileUpload } from "@/components/ui/file-upload";

// Basic usage
<FileUpload
  value={files}
  onChange={setFiles}
  label="Job Photos"
  maxFiles={10}
  accept="image/*"
/>

// With compression & camera
<FileUpload
  value={files}
  onChange={setFiles}
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
  enableCamera={true}
  enableCompression={true}
  compressionQuality={0.8}
  maxImageDimension={1920}
/>

// Upload on select
<FileUpload
  value={files}
  onChange={setFiles}
  uploadOnSelect={true}
  uploadUrl="/api/upload"
  onUploadComplete={(file) => console.log("Uploaded:", file.url)}
  onUploadError={(file, error) => console.error(error)}
/>

// Compact variant
<FileUpload
  value={files}
  onChange={setFiles}
  variant="compact"
  maxFiles={1}
/>
```

### Field Service Use Cases
- **Before/after photos** - Document job completion
- **Invoices/receipts** - Attach to customer records
- **Service contracts** - Upload signed agreements
- **Equipment manuals** - Technical documentation
- **Inspection reports** - Photo evidence

---

## 🎯 3. Digital Signature

**File:** `/src/components/ui/digital-signature.tsx`

### Features
- ✅ Canvas-based signature pad with touch/stylus support
- ✅ Pressure sensitivity (experimental)
- ✅ Undo/redo with history (10 steps)
- ✅ Legal compliance metadata:
  - Timestamp (ISO 8601)
  - IP address logging
  - User agent & platform
  - Device type detection
  - Verification hash (SHA-256)
  - Stroke count & signature time
- ✅ Export as PNG or SVG
- ✅ Readonly preview mode
- ✅ Mobile-optimized touch interface
- ✅ Accessibility features

### Usage

```tsx
import { SignaturePad } from "@/components/ui/digital-signature";

// Basic signature
<SignaturePad
  value={signature}
  onChange={setSignature}
  label="Customer Signature"
  required={true}
/>

// With legal metadata
<SignaturePad
  value={signature}
  onChange={setSignature}
  captureMetadata={true} // IP, timestamp, device
  requireFullName={true}
  fullName={customerName}
  minStrokes={3} // Prevent accidental dots
/>

// With history & download
<SignaturePad
  value={signature}
  onChange={setSignature}
  enableHistory={true}
  maxHistorySteps={10}
  showDownloadButton={true}
  showMetadata={true}
/>

// Readonly view
<SignaturePad
  value={signature}
  variant="readonly"
  showTimestamp={true}
  showMetadata={true}
/>
```

### Field Service Use Cases
- **Service contracts** - Customer acceptance
- **Work orders** - Technician sign-off
- **Delivery receipts** - Proof of completion
- **Safety waivers** - Liability protection
- **Change orders** - Approval workflow

### Metadata Structure
```typescript
{
  timestamp: "2025-01-19T10:30:00.000Z",
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  platform: "MacIntel",
  deviceType: "desktop", // desktop | mobile | tablet
  signedBy: "John Doe",
  verificationHash: "a1b2c3d4...", // SHA-256
  strokeCount: 15,
  signatureTime: 3500, // milliseconds
  canvasWidth: 600,
  canvasHeight: 200
}
```

---

## 🎯 4. Currency Input

**File:** `/src/components/ui/currency-input.tsx`

### Features
- ✅ Auto-formatting with locale support
- ✅ 9 currency support (USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR)
- ✅ Thousands separators & decimal precision
- ✅ Built-in calculator popover:
  - Subtotal + Tax + Shipping + Fees
  - Percentage & fixed discounts
  - Live breakdown preview
- ✅ Keyboard navigation (arrow keys increment/decrement)
- ✅ Copy/paste with format parsing
- ✅ Min/max validation
- ✅ Negative value control
- ✅ Three sizes: sm, md, lg
- ✅ Three variants: default, compact, minimal

### Usage

```tsx
import { CurrencyInput } from "@/components/ui/currency-input";

// Basic usage
<CurrencyInput
  value={amount}
  onChange={setAmount}
  label="Service Price"
  currency="USD"
  placeholder="0.00"
/>

// With calculator
<CurrencyInput
  value={total}
  onChange={setTotal}
  enableCalculations={true}
  calculationOptions={{
    subtotal: 100,
    taxRate: 8.5,
    discountRate: 10,
    shippingCost: 15
  }}
  onCalculationComplete={(result, breakdown) => {
    console.log("Total:", result);
    console.log("Tax:", breakdown.tax);
  }}
/>

// With validation
<CurrencyInput
  value={amount}
  onChange={setAmount}
  min={0}
  max={10000}
  allowNegative={false}
  required={true}
/>

// Compact variant with increment buttons
<CurrencyInput
  value={amount}
  onChange={setAmount}
  variant="compact"
  incrementStep={5}
/>

// Different currencies
<CurrencyInput value={amount} onChange={setAmount} currency="EUR" />
<CurrencyInput value={amount} onChange={setAmount} currency="GBP" />
<CurrencyInput value={amount} onChange={setAmount} currency="JPY" decimals={0} />
```

### Calculation Helpers
```typescript
import { calculateTotal, formatCurrency, sum, percentage, withTax } from "@/components/ui/currency-input";

// Manual calculations
const total = calculateTotal({
  subtotal: 100,
  taxRate: 8.5,
  discountRate: 10,
  shippingCost: 15,
  additionalFees: 5
});
// Returns: { total: 109.15, breakdown: {...} }

// Helper functions
sum(10, 20, 30) // 60
percentage(100, 10) // 10
withTax(100, 8.5) // 108.5
```

### Field Service Use Cases
- **Service pricing** - Labor + parts + tax
- **Invoices** - Line items with calculations
- **Estimates** - Quote breakdowns
- **Payment processing** - Transaction amounts
- **Expense tracking** - Material costs

---

## 🎯 5. Tags Input / MultiSelect

**File:** `/src/components/ui/tags-input.tsx`

### Features
- ✅ Two components: TagsInput (create), MultiSelect (choose)
- ✅ Autocomplete with fuzzy matching
- ✅ Create new tags on the fly
- ✅ Keyboard navigation (Tab, Enter, comma, arrow keys)
- ✅ Backspace removes last tag
- ✅ Copy/paste support (comma-separated)
- ✅ Tag validation & deduplication
- ✅ Custom tag colors/variants
- ✅ Max tags limit
- ✅ Character limit per tag
- ✅ Search filtering
- ✅ Loading states

### Usage

```tsx
import { TagsInput, MultiSelect } from "@/components/ui/tags-input";

// Free-form tags (create new)
<TagsInput
  value={tags}
  onChange={setTags}
  label="Skills"
  suggestions={['Plumbing', 'HVAC', 'Electrical']}
  allowCreate={true}
  maxTags={10}
  placeholder="Add skills..."
/>

// Predefined options only
<MultiSelect
  value={selectedTags}
  onChange={setSelectedTags}
  label="Service Categories"
  options={categoryOptions}
  maxTags={5}
  searchPlaceholder="Search categories..."
/>

// With validation
<TagsInput
  value={tags}
  onChange={setTags}
  validateTag={(tag) => {
    if (tag.length < 3) return "Minimum 3 characters";
    if (!/^[a-zA-Z]+$/.test(tag)) return "Letters only";
    return true;
  }}
  maxTagLength={20}
  minTags={1}
/>

// Paste comma-separated values
<TagsInput
  value={tags}
  onChange={setTags}
  delimiter="," // Paste "tag1,tag2,tag3"
  triggerKeys={['Enter', 'Tab', ',']}
/>
```

### Field Service Use Cases
- **Job tags** - Categorization (urgent, warranty, callback)
- **Technician skills** - Certification tracking
- **Equipment types** - Filter by category
- **Customer tags** - VIP, commercial, residential
- **Service areas** - Geographic coverage

---

## 🎯 6. Conditional Field

**File:** `/src/components/ui/conditional-field.tsx`

### Features
- ✅ Show/hide fields based on other field values
- ✅ 13 operators: equals, not_equals, contains, greater_than, etc.
- ✅ Multi-condition logic (AND/OR)
- ✅ Regex matching support
- ✅ Array checks (in, not_in)
- ✅ Empty/not_empty validation
- ✅ Smooth animations
- ✅ Value preservation when hidden
- ✅ Component & Hook APIs
- ✅ Nested sections

### Usage

```tsx
import { ConditionalField, ConditionalSection, useConditionalField } from "@/components/ui/conditional-field";

// Simple condition
<ConditionalField
  watch={form.watch}
  conditions={{
    field: "customerType",
    operator: "equals",
    value: "commercial"
  }}
>
  <F.CompanyName control={form.control} />
  <F.TaxId control={form.control} />
</ConditionalField>

// Multiple conditions (AND)
<ConditionalField
  watch={form.watch}
  conditions={[
    { field: "customerType", operator: "equals", value: "commercial" },
    { field: "state", operator: "equals", value: "CA" }
  ]}
  logic="AND"
>
  <F.CaliforniaTaxId control={form.control} />
</ConditionalField>

// OR logic
<ConditionalField
  watch={form.watch}
  conditions={[
    { field: "priority", operator: "equals", value: "urgent" },
    { field: "priority", operator: "equals", value: "high" }
  ]}
  logic="OR"
>
  <Alert variant="destructive">Urgent attention required!</Alert>
</ConditionalField>

// Hook version
const showCompanyFields = useConditionalField(
  form.watch,
  { field: "customerType", operator: "equals", value: "commercial" }
);

{showCompanyFields && (
  <>
    <F.CompanyName control={form.control} />
    <F.TaxId control={form.control} />
  </>
)}

// Section with title
<ConditionalSection
  title="Commercial Details"
  description="Additional fields for commercial customers"
  watch={form.watch}
  conditions={{ field: "customerType", operator: "equals", value: "commercial" }}
>
  <F.CompanyName control={form.control} />
  <F.TaxId control={form.control} />
</ConditionalSection>
```

### Operators Reference

| Operator | Example | Use Case |
|----------|---------|----------|
| `equals` | `"CA"` | State selection |
| `not_equals` | `!"pending"` | Not in status |
| `contains` | `"urgent"` | Text search |
| `greater_than` | `> 100` | Price threshold |
| `less_than` | `< 50` | Under limit |
| `in` | `["CA", "NY"]` | Multi-state |
| `not_in` | `!["archived"]` | Exclude values |
| `is_empty` | `null` | Required field check |
| `matches_regex` | `/^\d{5}$/` | ZIP code format |

### Field Service Use Cases
- **Customer type fields** - Commercial vs residential
- **Service tier options** - Premium features
- **Emergency surcharges** - Show only for urgent
- **Geographic pricing** - State-specific taxes
- **Equipment warranty** - Show warranty fields if in-warranty

---

## 🎯 7. Field Dependencies (Auto-Calculations)

**File:** `/src/hooks/use-field-dependencies.ts`

### Features
- ✅ Watch multiple fields, auto-calculate target
- ✅ Topological sorting (correct calculation order)
- ✅ Circular dependency detection
- ✅ Debouncing for performance (300ms default)
- ✅ Max depth protection (prevents infinite loops)
- ✅ Error handling per dependency
- ✅ Manual recalculate function
- ✅ Helper functions (sum, multiply, percentage, withTax)

### Usage

```tsx
import { useFieldDependencies, sum, percentage, withTax } from "@/hooks/use-field-dependencies";

// Invoice calculations
useFieldDependencies(form, [
  // Line item total = quantity * price
  {
    targetField: "lineItems.0.total",
    dependencies: ["lineItems.0.quantity", "lineItems.0.unitPrice"],
    calculate: ({ quantity, unitPrice }) => (quantity || 0) * (unitPrice || 0)
  },

  // Subtotal = sum of line items
  {
    targetField: "subtotal",
    dependencies: ["lineItems"],
    calculate: ({ lineItems }) => {
      return lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
    }
  },

  // Tax = subtotal * tax rate
  {
    targetField: "tax",
    dependencies: ["subtotal", "taxRate"],
    calculate: ({ subtotal, taxRate }) => percentage(subtotal, taxRate)
  },

  // Total = subtotal + tax + shipping
  {
    targetField: "total",
    dependencies: ["subtotal", "tax", "shipping"],
    calculate: ({ subtotal, tax, shipping }) => sum(subtotal, tax, shipping)
  }
]);

// With debounce & validation
useFieldDependencies(form, [
  {
    targetField: "total",
    dependencies: ["subtotal", "tax"],
    calculate: ({ subtotal, tax }) => (subtotal || 0) + (tax || 0),
    debounce: 500, // Wait 500ms after last change
    validate: true, // Run Zod validation after update
    onError: (error) => console.error("Calculation error:", error)
  }
]);

// Manual recalculate
const { recalculate } = useFieldDependencies(form, dependencies);

// Recalculate specific field
recalculate("total");

// Recalculate all
recalculate();
```

### Helper Functions

```typescript
// Sum values
sum(10, 20, 30) // 60
sum(subtotal, tax, shipping, fees)

// Multiply values
multiply(quantity, unitPrice) // quantity * unitPrice

// Calculate percentage
percentage(100, 10) // 10 (10% of 100)

// Add tax
withTax(100, 8.5) // 108.5 (100 + 8.5%)

// Apply discount
applyDiscount(100, 10, 5) // 80 (100 - 10% - $5)

// Round to decimals
roundTo(123.456, 2) // 123.46
```

### Field Service Use Cases
- **Invoice calculations** - Line items → subtotal → tax → total
- **Labor + materials** - Auto-calculate job cost
- **Service agreements** - Monthly rate * months = total
- **Discount logic** - Apply percentage off subtotal
- **Equipment rental** - Daily rate * days = cost

---

## 🎯 8. Async Validator

**File:** `/src/components/ui/async-validator.tsx`

### Features
- ✅ Real-time async validation with visual feedback
- ✅ Debounced API calls (500ms default)
- ✅ Caching for performance (5-minute expiry)
- ✅ Retry logic (configurable attempts)
- ✅ Loading/success/error indicators
- ✅ Inline error messages
- ✅ Min length before triggering
- ✅ Skip empty values
- ✅ Pre-built validators:
  - Email exists check
  - Username availability
  - Phone number validation
  - Tax ID verification
  - Coupon code validation
  - Domain availability

### Usage

```tsx
import { AsyncValidator, EmailValidator, UsernameValidator } from "@/components/ui/async-validator";

// Email exists check
<AsyncValidator
  value={form.watch("email")}
  validate={async (email) => {
    const response = await fetch(`/api/check-email?email=${email}`);
    const { exists } = await response.json();
    return exists ? "Email already registered" : true;
  }}
  debounce={500}
>
  <F.Email control={form.control} />
</AsyncValidator>

// Pre-configured email validator
<EmailValidator value={form.watch("email")}>
  <F.Email control={form.control} />
</EmailValidator>

// Username availability
<UsernameValidator value={form.watch("username")}>
  <Input {...form.register("username")} />
</UsernameValidator>

// Custom validation with retry
<AsyncValidator
  value={form.watch("couponCode")}
  validate={validateCouponCode}
  debounce={300}
  minLength={3}
  retryAttempts={2}
  retryDelay={1000}
  showLoading={true}
  showSuccess={true}
  loadingText="Validating..."
  successText="Valid code!"
>
  <Input {...form.register("couponCode")} />
</AsyncValidator>
```

### Built-in Validators

```typescript
import {
  validateEmailExists,
  validateUsernameAvailable,
  validatePhoneNumber,
  validateTaxId,
  validateCouponCode,
  validateDomainAvailable
} from "@/components/ui/async-validator";

// All return Promise<true | string>
// true = valid, string = error message

const result = await validateEmailExists("test@example.com");
// Returns: "This email is already registered" OR true
```

### Field Service Use Cases
- **Customer emails** - Check for duplicates
- **Phone numbers** - Validate format & carrier
- **Tax IDs** - Verify EIN/VAT numbers
- **Promo codes** - Validate coupons
- **Equipment serial numbers** - Check registry
- **Service areas** - Validate ZIP codes

---

## 🎯 9. Repeating Group

**File:** `/src/components/ui/repeating-group.tsx`

### Features
- ✅ Dynamic field arrays with add/remove
- ✅ Duplicate items
- ✅ Collapsible sections
- ✅ Min/max item limits
- ✅ Default values for new items
- ✅ Custom render function per item
- ✅ Drag & drop reordering (future)
- ✅ Bulk operations
- ✅ Three variants: default, compact, cards
- ✅ Pre-configured: LineItems, Contacts

### Usage

```tsx
import { RepeatingGroup, LineItemsGroup, ContactsGroup } from "@/components/ui/repeating-group";

// Basic repeating group
<RepeatingGroup
  name="contacts"
  control={form.control}
  label="Contacts"
  minItems={1}
  maxItems={5}
  defaultValue={{ firstName: "", lastName: "", email: "" }}
  renderItem={(index) => (
    <>
      <F.FirstName
        control={form.control}
        name={`contacts.${index}.firstName`}
      />
      <F.LastName
        control={form.control}
        name={`contacts.${index}.lastName`}
      />
      <F.Email
        control={form.control}
        name={`contacts.${index}.email`}
      />
    </>
  )}
/>

// With features
<RepeatingGroup
  name="lineItems"
  control={form.control}
  label="Line Items"
  itemLabel="Line Item"
  collapsible={true} // Items can collapse
  duplicatable={true} // Show duplicate button
  showIndex={true}
  addButtonLabel="Add Line Item"
  emptyMessage="No line items added"
  onAdd={(item) => console.log("Added:", item)}
  onRemove={(index, item) => console.log("Removed:", item)}
/>

// Pre-configured line items
<LineItemsGroup
  name="lineItems"
  control={form.control}
  showTotals={true}
  taxRate={8.5}
/>

// Pre-configured contacts
<ContactsGroup
  name="contacts"
  control={form.control}
  showRole={true}
  minItems={1}
  maxItems={3}
/>

// Different variants
<RepeatingGroup variant="default" {...props} />
<RepeatingGroup variant="compact" {...props} />
<RepeatingGroup variant="cards" {...props} />
```

### Field Service Use Cases
- **Invoice line items** - Multiple services/parts
- **Job contacts** - Primary + secondary contacts
- **Equipment list** - Multiple units installed
- **Service locations** - Multi-property accounts
- **Technician assignments** - Multi-crew jobs

---

## 🔧 Integration Patterns

### Pattern 1: Combine All Features

```tsx
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { CurrencyInput } from "@/components/ui/currency-input";
import { TagsInput } from "@/components/ui/tags-input";
import { ConditionalField } from "@/components/ui/conditional-field";
import { useFieldDependencies, sum, percentage } from "@/hooks/use-field-dependencies";

function JobForm() {
  const form = useSmartForm({ schema: jobSchema });

  // Auto-calculations
  useFieldDependencies(form, [
    {
      targetField: "total",
      dependencies: ["labor", "parts", "taxRate"],
      calculate: ({ labor, parts, taxRate }) => {
        const subtotal = sum(labor, parts);
        return subtotal + percentage(subtotal, taxRate);
      }
    }
  ]);

  return (
    <Form {...form}>
      {/* Date/Time */}
      <DateTimePicker
        value={form.watch("scheduledDate")}
        onChange={(date) => form.setValue("scheduledDate", date)}
        businessHoursOnly={true}
        duration={120}
      />

      {/* Tags */}
      <TagsInput
        value={form.watch("tags")}
        onChange={(tags) => form.setValue("tags", tags)}
        suggestions={['urgent', 'warranty', 'callback']}
      />

      {/* Pricing with auto-calc */}
      <CurrencyInput
        value={form.watch("labor")}
        onChange={(val) => form.setValue("labor", val)}
        label="Labor Cost"
      />
      <CurrencyInput
        value={form.watch("parts")}
        onChange={(val) => form.setValue("parts", val)}
        label="Parts Cost"
      />
      <CurrencyInput
        value={form.watch("total")}
        onChange={(val) => form.setValue("total", val)}
        label="Total (Auto-calculated)"
        disabled
      />

      {/* Conditional signature */}
      <ConditionalField
        watch={form.watch}
        conditions={{ field: "completed", operator: "equals", value: true }}
      >
        <SignaturePad
          value={form.watch("signature")}
          onChange={(sig) => form.setValue("signature", sig)}
          label="Customer Signature"
          captureMetadata={true}
        />
      </ConditionalField>
    </Form>
  );
}
```

### Pattern 2: Invoice with Line Items

```tsx
function InvoiceForm() {
  const form = useSmartForm({ schema: invoiceSchema });

  useFieldDependencies(form, [
    // Calculate line item totals
    {
      targetField: "lineItems.0.total",
      dependencies: ["lineItems.0.quantity", "lineItems.0.unitPrice"],
      calculate: ({ quantity, unitPrice }) => (quantity || 0) * (unitPrice || 0)
    },

    // Calculate subtotal
    {
      targetField: "subtotal",
      dependencies: ["lineItems"],
      calculate: ({ lineItems }) => {
        return lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
      }
    },

    // Calculate tax
    {
      targetField: "tax",
      dependencies: ["subtotal", "taxRate"],
      calculate: ({ subtotal, taxRate }) => percentage(subtotal, taxRate)
    },

    // Calculate grand total
    {
      targetField: "total",
      dependencies: ["subtotal", "tax"],
      calculate: ({ subtotal, tax }) => sum(subtotal, tax)
    }
  ]);

  return (
    <Form {...form}>
      {/* Line items repeater */}
      <LineItemsGroup
        name="lineItems"
        control={form.control}
        showTotals={true}
      />

      {/* Auto-calculated totals */}
      <div className="space-y-2">
        <div>Subtotal: ${form.watch("subtotal")}</div>
        <div>Tax: ${form.watch("tax")}</div>
        <div>Total: ${form.watch("total")}</div>
      </div>

      {/* Signature */}
      <SignaturePad
        value={form.watch("signature")}
        onChange={(sig) => form.setValue("signature", sig)}
        label="Authorized Signature"
      />
    </Form>
  );
}
```

---

## 📊 Performance Considerations

### Optimization Strategies

1. **Debouncing** - All async operations are debounced (300-500ms)
2. **Caching** - AsyncValidator caches results for 5 minutes
3. **Lazy Loading** - Large components lazy-loaded with `dynamic()`
4. **React.memo** - Expensive calculations memoized
5. **Circular Detection** - FieldDependencies detects infinite loops
6. **Max Depth** - Calculation depth capped at 10 levels

### Bundle Impact

| Component | Gzipped Size | Impact |
|-----------|--------------|--------|
| DatePicker | ~8 KB | Low |
| FileUpload | ~6 KB | Low |
| Signature | ~7 KB | Low |
| Currency | ~5 KB | Low |
| Tags | ~4 KB | Low |
| Conditional | ~2 KB | Minimal |
| Dependencies | ~4 KB | Low |
| AsyncValidator | ~3 KB | Minimal |
| RepeatingGroup | ~4 KB | Low |

**Total:** ~43 KB gzipped (acceptable for enterprise forms)

---

---

## 🎯 10. Form Progress Indicator

**File:** `/src/components/ui/form-progress.tsx`

### Features
- ✅ Real-time completion percentage tracking
- ✅ Section/step-based progress
- ✅ Field-level validation tracking
- ✅ Visual indicators (progress bar, checkmarks)
- ✅ Auto-scroll to incomplete sections
- ✅ Wizard-style stepped forms
- ✅ Collapsible/expandable sections
- ✅ Completion callbacks
- ✅ Three variants: default, minimal, detailed
- ✅ Mobile-optimized

### Usage

```tsx
import { FormProgress, FormWizard, useFormProgress } from "@/components/ui/form-progress";

// Track multi-section form
<FormProgress
  watch={form.watch}
  formState={form.formState}
  sections={[
    {
      id: "personal",
      title: "Personal Info",
      fields: ["firstName", "lastName", "email", "phone"],
      requiredFields: ["firstName", "email"]
    },
    {
      id: "address",
      title: "Address",
      fields: ["street", "city", "state", "zipCode"],
      requiredFields: ["street", "city"]
    },
    {
      id: "payment",
      title: "Payment Info",
      fields: ["cardNumber", "expiry", "cvv"]
    }
  ]}
  showPercentage={true}
  showValidation={true}
  sticky={true}
  onComplete={() => console.log("Form complete!")}
/>

// Wizard variant (stepped form)
const [currentStep, setCurrentStep] = useState(0);

<FormWizard
  watch={form.watch}
  formState={form.formState}
  steps={wizardSteps}
  currentStep={currentStep}
  onStepChange={setCurrentStep}
  allowSkip={false}
/>

// Hook version for custom UI
const progress = useFormProgress(form.watch, form.formState, sections);
console.log(progress.percentage); // 65%
console.log(progress.isComplete); // false
```

### Field Service Use Cases
- **Customer onboarding** - Multi-step registration
- **Job creation** - Progressive form completion
- **Service agreements** - Step-by-step contract setup
- **Equipment setup** - Installation checklist progress
- **Safety inspections** - Track checklist completion

---

## 🎯 11. Voice Input (Speech-to-Text)

**File:** `/src/components/ui/voice-input.tsx`

### Features
- ✅ Real-time speech recognition (Web Speech API)
- ✅ 20+ language support (English, Spanish, French, etc.)
- ✅ Continuous listening mode
- ✅ Punctuation commands ("period", "comma", "new line")
- ✅ Voice commands ("clear", "undo")
- ✅ Confidence scoring
- ✅ Interim results preview
- ✅ Transcript history
- ✅ Browser compatibility detection
- ✅ Error handling & fallback

### Usage

```tsx
import { VoiceInput } from "@/components/ui/voice-input";

// Basic dictation
<VoiceInput
  value={form.watch("notes")}
  onChange={(value) => form.setValue("notes", value)}
  label="Job Notes"
  placeholder="Click microphone to start..."
/>

// Advanced features
<VoiceInput
  value={form.watch("description")}
  onChange={(value) => form.setValue("description", value)}
  language="en-US"
  continuous={true}
  interimResults={true}
  showConfidence={true}
  showTranscript={true}
  showLanguageSelector={true}
  minConfidence={0.7}
  rows={6}
/>

// Voice commands supported:
// - "period" → .
// - "comma" → ,
// - "new line" → \n
// - "clear" → Delete all
// - "undo" → Remove last
```

### Field Service Use Cases
- **Job site notes** - Hands-free dictation for technicians
- **Safety inspections** - Voice checklists
- **Equipment issues** - Describe problems while working
- **Customer interactions** - Document conversations
- **Daily logs** - Quick status updates

---

## 🎯 12. Barcode Scanner

**File:** `/src/components/ui/barcode-scanner.tsx`

### Features
- ✅ Camera-based scanning (front/rear camera)
- ✅ 13 barcode formats (QR, Code128, EAN-13, UPC-A, etc.)
- ✅ Real-time detection
- ✅ Torch (flashlight) control
- ✅ Manual entry fallback
- ✅ Scan history tracking
- ✅ Duplicate detection (2s delay)
- ✅ Sound & vibration feedback
- ✅ Permission handling
- ✅ Mobile-optimized

### Supported Formats
- QR Code, Code 128, Code 39, Code 93
- EAN-8, EAN-13, UPC-A, UPC-E
- Codabar, ITF, Data Matrix, PDF417, Aztec

### Usage

```tsx
import { BarcodeScanner } from "@/components/ui/barcode-scanner";

// Basic scanning
<BarcodeScanner
  value={form.watch("serialNumber")}
  onChange={(code) => form.setValue("serialNumber", code)}
  label="Equipment Serial Number"
/>

// Advanced features
<BarcodeScanner
  value={form.watch("partNumber")}
  onChange={(code) => form.setValue("partNumber", code)}
  formats={["code128", "qr_code"]}
  enableTorch={true}
  enableSound={true}
  enableVibration={true}
  allowManualEntry={true}
  allowHistory={true}
  maxHistory={10}
  cameraFacing="environment"
  onScan={(result) => {
    console.log("Scanned:", result.code);
    console.log("Format:", result.format);
    console.log("Timestamp:", result.timestamp);
  }}
/>
```

### Field Service Use Cases
- **Equipment tracking** - Serial number registration
- **Parts inventory** - Quick stock lookup
- **Asset management** - Tag scanning
- **Work orders** - QR code verification
- **Warranty lookup** - Scan product codes

---

## 🎯 13. Location Capture (GPS)

**File:** `/src/components/ui/location-capture.tsx`

### Features
- ✅ Real-time GPS location capture
- ✅ High accuracy mode
- ✅ Reverse geocoding (coordinates → address)
- ✅ Distance calculation (Haversine formula)
- ✅ Geofencing validation (radius check)
- ✅ Location history tracking
- ✅ Continuous position watching
- ✅ Altitude & heading (if available)
- ✅ Battery-efficient
- ✅ Permission handling

### Location Data Captured
- Latitude/Longitude, Accuracy (meters)
- Altitude, Heading, Speed
- Timestamp, Reverse geocoded address

### Usage

```tsx
import { LocationCapture } from "@/components/ui/location-capture";

// Basic GPS capture
<LocationCapture
  value={form.watch("location")}
  onChange={(location) => form.setValue("location", location)}
  label="Job Site Location"
  required={true}
/>

// With geofencing
<LocationCapture
  value={form.watch("checkInLocation")}
  onChange={(location) => form.setValue("checkInLocation", location)}
  highAccuracy={true}
  showAddress={true}
  showMap={true}
  geofence={{
    latitude: 37.7749,
    longitude: -122.4194,
    radius: 100, // 100 meters
    name: "Job Site"
  }}
  onGeofenceViolation={(distance) => {
    console.warn(`${distance}m outside geofence`);
  }}
/>

// Continuous tracking
<LocationCapture
  value={form.watch("currentLocation")}
  onChange={(location) => form.setValue("currentLocation", location)}
  watchPosition={true} // Track movement
  autoCapture={true} // Capture on mount
  showHistory={true}
  maxHistory={20}
/>
```

### Field Service Use Cases
- **Check-in/check-out** - Job site verification
- **Route tracking** - Technician location
- **Service area validation** - Ensure within coverage
- **Distance billing** - Mileage tracking
- **Emergency location** - Quick share coordinates

---

## 🎯 14. Rich Text Editor

**File:** `/src/components/ui/rich-text-editor.tsx`

### Features
- ✅ Lightweight WYSIWYG editor
- ✅ Text formatting (bold, italic, underline, strikethrough)
- ✅ Headings (H1-H3)
- ✅ Lists (ordered, unordered)
- ✅ Links with URL validation
- ✅ Code blocks & inline code
- ✅ Blockquotes
- ✅ Text alignment (left, center, right)
- ✅ Keyboard shortcuts (Cmd+B, Cmd+I, etc.)
- ✅ Undo/redo support
- ✅ Preview mode
- ✅ Word/character count
- ✅ Auto-save support
- ✅ HTML sanitization

### Keyboard Shortcuts
- **Cmd/Ctrl + B** - Bold
- **Cmd/Ctrl + I** - Italic
- **Cmd/Ctrl + U** - Underline
- **Cmd/Ctrl + K** - Insert link
- **Cmd/Ctrl + Z** - Undo
- **Cmd/Ctrl + Shift + Z** - Redo

### Usage

```tsx
import { RichTextEditor } from "@/components/ui/rich-text-editor";

// Basic editor
<RichTextEditor
  value={form.watch("description")}
  onChange={(value) => form.setValue("description", value)}
  label="Job Description"
  placeholder="Enter detailed description..."
/>

// Advanced features
<RichTextEditor
  value={form.watch("notes")}
  onChange={(value) => form.setValue("notes", value)}
  minHeight={300}
  maxHeight={600}
  maxLength={5000}
  showToolbar={true}
  showWordCount={true}
  showPreview={true}
  autoSave={true}
  autoSaveDelay={2000}
  onAutoSave={(value) => {
    // Save to localStorage or API
    console.log("Auto-saving:", value);
  }}
/>

// With character limit
<RichTextEditor
  value={form.watch("summary")}
  onChange={(value) => form.setValue("summary", value)}
  maxLength={500}
  showWordCount={true}
/>
```

### Field Service Use Cases
- **Job descriptions** - Detailed service notes
- **Email templates** - Formatted communications
- **Service reports** - Professional documentation
- **Knowledge base** - Internal wiki articles
- **Proposals** - Customer-facing documents

---

## 🚀 Next Steps

### Integration with StandardFormFields

Add all components to `/src/components/form-fields/standard-form-fields.tsx`:

```typescript
// Import all advanced components
import { DatePicker, TimePicker, DateTimePicker } from "@/components/ui/date-time-picker";
import { FileUpload } from "@/components/ui/file-upload";
import { SignaturePad } from "@/components/ui/digital-signature";
import { CurrencyInput } from "@/components/ui/currency-input";
import { TagsInput, MultiSelect } from "@/components/ui/tags-input";
import { ConditionalField, ConditionalSection } from "@/components/ui/conditional-field";
import { RepeatingGroup, LineItemsGroup, ContactsGroup } from "@/components/ui/repeating-group";
import { AsyncValidator } from "@/components/ui/async-validator";
import { FormProgress, FormWizard } from "@/components/ui/form-progress";
import { VoiceInput } from "@/components/ui/voice-input";
import { BarcodeScanner } from "@/components/ui/barcode-scanner";
import { LocationCapture } from "@/components/ui/location-capture";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export const StandardFormFields = {
  // Basic fields...
  FirstName, LastName, Email, Phone, Address,

  // Advanced components
  DatePicker,
  TimePicker,
  DateTimePicker,
  FileUpload,
  Signature: SignaturePad,
  Currency: CurrencyInput,
  Tags: TagsInput,
  MultiSelect,
  ConditionalField,
  ConditionalSection,
  RepeatingGroup,
  LineItems: LineItemsGroup,
  Contacts: ContactsGroup,
  AsyncValidator,
  FormProgress,
  FormWizard,
  VoiceInput,
  BarcodeScanner,
  LocationCapture,
  RichTextEditor,
};
```

### Usage Example - Complete Job Form

```tsx
import { StandardFormFields as F } from "@/components/form-fields/standard-form-fields";
import { useFieldDependencies } from "@/hooks/use-field-dependencies";

function JobForm() {
  const form = useSmartForm({ schema: jobSchema });

  // Auto-calculate total
  useFieldDependencies(form, [
    {
      targetField: "total",
      dependencies: ["labor", "parts", "tax"],
      calculate: ({ labor, parts, tax }) => (labor || 0) + (parts || 0) + (tax || 0)
    }
  ]);

  return (
    <Form {...form}>
      {/* Progress tracking */}
      <F.FormProgress
        watch={form.watch}
        formState={form.formState}
        sections={formSections}
        sticky
      />

      {/* Scheduling */}
      <F.DateTimePicker
        value={form.watch("scheduledDate")}
        onChange={(date) => form.setValue("scheduledDate", date)}
        businessHoursOnly
        duration={120}
      />

      {/* Voice notes */}
      <F.VoiceInput
        value={form.watch("notes")}
        onChange={(val) => form.setValue("notes", val)}
        continuous
      />

      {/* Equipment serial */}
      <F.BarcodeScanner
        value={form.watch("serialNumber")}
        onChange={(val) => form.setValue("serialNumber", val)}
      />

      {/* Location */}
      <F.LocationCapture
        value={form.watch("location")}
        onChange={(val) => form.setValue("location", val)}
        geofence={jobSiteGeofence}
      />

      {/* Pricing */}
      <F.Currency
        value={form.watch("labor")}
        onChange={(val) => form.setValue("labor", val)}
        enableCalculations
      />

      {/* Line items */}
      <F.LineItems name="lineItems" control={form.control} />

      {/* Photos */}
      <F.FileUpload
        value={form.watch("photos")}
        onChange={(val) => form.setValue("photos", val)}
        enableCamera
        enableCompression
      />

      {/* Signature */}
      <F.Signature
        value={form.watch("signature")}
        onChange={(val) => form.setValue("signature", val)}
        captureMetadata
      />
    </Form>
  );
}
```

### Integration with StandardFormFields

Add to `/src/components/form-fields/standard-form-fields.tsx`:

```typescript
export const StandardFormFields = {
  // Existing fields...
  FirstName, LastName, Email, Phone, Address, etc.,

  // Advanced components
  DatePicker,
  TimePicker,
  DateTimePicker,
  FileUpload,
  Signature,
  Currency,
  Tags,
  MultiSelect,
  // Helper components
  ConditionalField,
  RepeatingGroup,
  AsyncValidator,
};
```

---

## 📚 Related Documentation

- [Standard Form Fields](/docs/STANDARD_FORM_FIELDS.md) - Basic field components
- [AI Form Auto-Fill](/docs/AI_FORM_AUTOFILL.md) - Smart autocomplete system
- [Common Validation Schemas](/src/lib/validations/common-schemas.ts) - Zod schemas
- [Smart Form Hook](/src/hooks/use-smart-form.ts) - Form state management

---

**Questions?** Check component source code for detailed JSDoc documentation and usage examples.

**Last Updated:** 2025-01-19

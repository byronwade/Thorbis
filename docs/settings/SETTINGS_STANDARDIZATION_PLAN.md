# Settings Pages Standardization Plan

## Overview
Systematically standardizing ALL 85 settings pages to follow the EXACT same layout pattern with zero deviations.

## Standard Layout Pattern (REQUIRED for ALL pages)

### 1. Header Structure
```typescript
<div className="space-y-8 py-8">
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="font-bold text-4xl tracking-tight">[Title]</h1>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button">
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm">[Help text]</p>
          </TooltipContent>
        </Tooltip>
      </div>
      {hasChanges && <Badge className="bg-amber-600 hover:bg-amber-700">Unsaved Changes</Badge>}
    </div>
    <p className="text-lg text-muted-foreground">[Description]</p>
  </div>
```

### 2. Content with Cards (space-y-6)
```typescript
<div className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Icon className="size-5 text-primary" />
        Section Title
      </CardTitle>
      <CardDescription>Description</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Form fields */}
    </CardContent>
  </Card>
</div>
```

### 3. Sticky Bottom Action Bar (for form pages)
```typescript
<div className="sticky bottom-0 z-10 rounded-xl border bg-card p-6 shadow-lg">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      {hasChanges ? (
        <>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <div className="h-2 w-2 animate-pulse rounded-full bg-amber-600" />
          </div>
          <div>
            <p className="font-medium text-sm">Unsaved Changes</p>
            <p className="text-muted-foreground text-xs">Save your changes or discard them</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-medium text-sm">All Changes Saved</p>
            <p className="text-muted-foreground text-xs">Your settings are up to date</p>
          </div>
        </>
      )}
    </div>
    <div className="flex gap-3">
      <Button variant="outline" disabled={isPending}>Cancel</Button>
      <Button disabled={isPending || !hasChanges}>
        {isPending ? (
          <><Loader2 className="mr-2 size-4 animate-spin" />Saving...</>
        ) : (
          <><Save className="mr-2 size-4" />Save Settings</>
        )}
      </Button>
    </div>
  </div>
</div>
```

## Critical Requirements (Zero Tolerance)

1. ✅ Header title MUST be `text-4xl` (not text-3xl)
2. ✅ Page wrapper MUST be `space-y-8 py-8`
3. ✅ Header section MUST be `space-y-3`
4. ✅ Content sections MUST have `space-y-6`
5. ✅ Card content MUST have `space-y-4`
6. ✅ ALL cards MUST use `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>` components
7. ✅ CardTitle icons MUST be `size-5 text-primary`
8. ✅ Tooltips MUST use `h-3.5 w-3.5 text-muted-foreground`
9. ✅ Button icons MUST be `size-4`
10. ✅ Info banners MUST be `<Card className="border-blue-500/50 bg-blue-500/5">`
11. ✅ ALL form pages MUST have sticky bottom action bar
12. ✅ Loading state MUST be `<div className="flex h-[50vh] items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>`

## Pages Inventory (85 Total)

### Finance (9 pages) ✓
- [x] accounting/page.tsx - STANDARDIZED
- [x] bank-accounts/page.tsx - STANDARDIZED
- [x] bookkeeping/page.tsx - Coming Soon (already standard)
- [ ] business-financing/page.tsx
- [ ] consumer-financing/page.tsx
- [ ] debit-cards/page.tsx
- [ ] gas-cards/page.tsx
- [ ] gift-cards/page.tsx
- [ ] virtual-buckets/page.tsx
- [ ] page.tsx (finance hub)

### Payroll (8 pages)
- [ ] schedule/page.tsx
- [ ] materials/page.tsx
- [ ] deductions/page.tsx
- [ ] callbacks/page.tsx
- [ ] bonuses/page.tsx
- [ ] overtime/page.tsx
- [ ] commission/page.tsx
- [ ] page.tsx (payroll hub)

### Communications (13 pages)
- [ ] templates/page.tsx
- [ ] email-templates/page.tsx
- [ ] phone-numbers/page.tsx
- [ ] porting-status/page.tsx
- [ ] usage/page.tsx
- [ ] call-routing/page.tsx
- [ ] ivr-menus/page.tsx
- [ ] voicemail/page.tsx
- [ ] email/page.tsx
- [ ] notifications/page.tsx
- [ ] phone/page.tsx
- [ ] sms/page.tsx
- [ ] page.tsx (communications hub)

### Team (6 pages)
- [ ] roles/[id]/page.tsx
- [ ] roles/page.tsx
- [ ] departments/page.tsx
- [ ] invite/page.tsx
- [ ] [id]/page.tsx
- [ ] page.tsx (team hub)

### Customers (5 pages)
- [ ] custom-fields/page.tsx
- [ ] loyalty/page.tsx
- [ ] preferences/page.tsx
- [ ] privacy/page.tsx
- [ ] page.tsx (customers hub)

### Profile (8 pages)
- [ ] security/2fa/page.tsx
- [ ] security/page.tsx
- [ ] security/password/page.tsx
- [ ] personal/page.tsx
- [ ] preferences/page.tsx
- [ ] notifications/page.tsx
- [ ] notifications/email/page.tsx
- [ ] notifications/push/page.tsx

### Schedule (6 pages)
- [ ] service-areas/page.tsx
- [ ] dispatch-rules/page.tsx
- [ ] availability/page.tsx
- [ ] calendar/page.tsx
- [ ] team-scheduling/page.tsx
- [ ] page.tsx (schedule hub)

### Root Level Settings (30+ pages)
- [ ] company/page.tsx
- [ ] billing/page.tsx
- [ ] billing/payment-methods/page.tsx
- [ ] subscriptions/page.tsx
- [ ] integrations/page.tsx
- [ ] integrations/[id]/page.tsx
- [ ] organizations/new/page.tsx
- [ ] purchase-orders/page.tsx
- [ ] job-fields/page.tsx
- [ ] tv/page.tsx
- [ ] automation/page.tsx
- [ ] development/page.tsx
- [ ] marketing/page.tsx
- [ ] reporting/page.tsx
- [ ] customer-portal/page.tsx
- [ ] tags/page.tsx
- [ ] checklists/page.tsx
- [ ] data-import-export/page.tsx
- [ ] company-feed/page.tsx
- [ ] service-plans/page.tsx
- [ ] booking/page.tsx
- [ ] lead-sources/page.tsx
- [ ] pricebook/page.tsx
- [ ] pricebook/integrations/page.tsx
- [ ] customer-intake/page.tsx
- [ ] invoices/page.tsx
- [ ] estimates/page.tsx
- [ ] jobs/page.tsx
- [ ] page.tsx (settings hub)

## Common Patterns to Fix

### Pattern 1: Title Size
```typescript
// ❌ WRONG
<h1 className="font-bold text-3xl tracking-tight">

// ✅ CORRECT
<h1 className="font-bold text-4xl tracking-tight">
```

### Pattern 2: Wrapper Spacing
```typescript
// ❌ WRONG
<div className="space-y-6">

// ✅ CORRECT
<div className="space-y-8 py-8">
```

### Pattern 3: Card Icons
```typescript
// ❌ WRONG
<CardTitle>Section Title</CardTitle>

// ✅ CORRECT
<CardTitle className="flex items-center gap-2">
  <Icon className="size-5 text-primary" />
  Section Title
</CardTitle>
```

### Pattern 4: Missing Tooltip
```typescript
// ❌ WRONG
<h1 className="font-bold text-4xl tracking-tight">Title</h1>

// ✅ CORRECT
<div className="flex items-center gap-3">
  <h1 className="font-bold text-4xl tracking-tight">Title</h1>
  <Tooltip>
    <TooltipTrigger asChild>
      <button type="button">
        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    </TooltipTrigger>
    <TooltipContent className="max-w-xs">
      <p className="text-sm">Help text here</p>
    </TooltipContent>
  </Tooltip>
</div>
```

### Pattern 5: Missing Bottom Bar
Form pages MUST have sticky bottom bar. Only Coming Soon pages skip it.

## Special Cases

### Coming Soon Pages
- Use `<SettingsComingSoon>` component (already standardized)
- NO sticky bottom bar needed
- Already compliant: bookkeeping, many payroll pages

### Hub Pages (like finance/page.tsx)
- Navigation grids to sub-pages
- Standard header still applies
- Info cards instead of forms
- NO sticky bottom bar (no save action)

### Table/List Pages (like team/page.tsx)
- Standard header applies
- May have custom content layout
- Add/Edit actions in dialogs
- May or may not need bottom bar (case by case)

## Implementation Strategy

### Phase 1: Finance ✓ (2/9 done)
- ✅ accounting - COMPLETE
- ✅ bank-accounts - COMPLETE
- ✅ bookkeeping - Already compliant (Coming Soon)
- ⏳ business-financing
- ⏳ consumer-financing
- ⏳ debit-cards
- ⏳ gas-cards
- ⏳ gift-cards
- ⏳ virtual-buckets
- ⏳ page.tsx (hub)

### Phase 2: Payroll (0/8 done)

### Phase 3: Communications (0/13 done)

### Phase 4: Team (0/6 done)

### Phase 5: Customers (0/5 done)

### Phase 6: Profile (0/8 done)

### Phase 7: Schedule (0/6 done)

### Phase 8: Root Level (0/30 done)

## Required Imports for Standardization

Every form page needs:
```typescript
import { Save, Check, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMemo } from "react"; // for hasChanges
```

## Testing Checklist

For each updated page, verify:
- [ ] Header is text-4xl with help tooltip
- [ ] Page wrapper is space-y-8 py-8
- [ ] Content sections use space-y-6
- [ ] Card content uses space-y-4
- [ ] All CardTitles have icon (size-5 text-primary)
- [ ] Info banners follow standard pattern
- [ ] Form pages have sticky bottom bar
- [ ] hasChanges tracking works correctly
- [ ] Loading state follows standard
- [ ] No manual div cards (use Card components)

## Progress Tracking

- Total pages: 85
- Completed: 2
- Remaining: 83
- Current phase: Finance (2/9 done)

## Next Steps

1. Complete remaining Finance pages (7 more)
2. Move to Payroll pages (8 pages)
3. Then Communications (13 pages)
4. Continue systematically through all categories
5. Generate final compliance report

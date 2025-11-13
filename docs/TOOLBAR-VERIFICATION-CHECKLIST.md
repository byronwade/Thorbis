# Detail Page Toolbar Verification Checklist

**Complete checklist to verify ALL 13 detail pages have consistent, clean toolbars with back buttons.**

---

## 🎯 Universal Requirements (Every Detail Page Must Have)

- [ ] **Back button** - "← [Entity Type]" in breadcrumbs
- [ ] **Breadcrumb separator** - "/"
- [ ] **"Details" label** - After separator
- [ ] **Ellipsis menu** - "⋮" with Archive option
- [ ] **56px toolbar height** (h-14)
- [ ] **32px button height** (h-8)
- [ ] **Outline variant** on all buttons
- [ ] **NO button groups** - individual buttons only
- [ ] **NO inset padding** - toolbar edge-to-edge
- [ ] **Mobile responsive** labels (hidden md:inline or lg:inline)

---

## 📋 Page-by-Page Verification

### 1. Jobs (`/dashboard/work/[id]`)
**URL**: `/dashboard/work/75381f87-f41d-4ac3-bff9-ad1489229ea4`

- [ ] Breadcrumbs: `[← Jobs] / Details`
- [ ] Quick Actions: `[Invoice] [Estimate] [Clone]`
- [ ] Ellipsis Menu: Statistics, Export, Print, Share, Archive
- [ ] All buttons h-8 outline
- [ ] Labels: Invoice (md:), Estimate (md:), Clone (lg:)

### 2. Customers (`/dashboard/customers/[id]`)
**URL**: Test with any customer ID

- [ ] Breadcrumbs: `[← Customers] / Details`
- [ ] Quick Actions: `[Edit/View] [Job] [Invoice]` (in view mode)
- [ ] Ellipsis Menu: Email, Export, Archive
- [ ] All buttons h-8 outline
- [ ] Labels: Edit/View (md:), Job (md:), Invoice (lg:)

### 3. Estimates (`/dashboard/work/estimates/[id]`)
**URL**: Test with any estimate ID

- [ ] Breadcrumbs: `[← Estimates] / Details`
- [ ] Quick Actions: `[Preview] [PDF] [Send]`
- [ ] Ellipsis Menu: Export, Archive
- [ ] All buttons h-8 outline
- [ ] Labels: Preview (md:), PDF (lg:), Send (lg:)

### 4. Invoices (`/dashboard/work/invoices/[id]`)
**URL**: Test with any invoice ID

- [ ] Breadcrumbs: `[← Invoices] / Details` (needs breadcrumb component!)
- [ ] Quick Actions: `[Preview] [PDF] [Send]`
- [ ] Ellipsis Menu: Export, Archive
- [ ] All buttons h-8 outline
- [ ] Labels: Preview (md:), PDF (lg:), Send (lg:)

### 5. Appointments (`/dashboard/work/appointments/[id]`)
**URL**: `/dashboard/work/appointments/13d0d79a-0f28-4826-8c5d-c96ce6c00572`

- [ ] Breadcrumbs: `[← Appointments] / Details`
- [ ] Quick Actions: *(none - just menu)*
- [ ] Ellipsis Menu: Export, Archive
- [ ] Ellipsis h-8 w-8 outline
- [ ] NO padding around page

### 6. Payments (`/dashboard/work/payments/[id]`)
**URL**: Test with any payment ID

- [ ] Breadcrumbs: `[← Payments] / Details`
- [ ] Quick Actions: *(none - just menu)*
- [ ] Ellipsis Menu: Export, Archive
- [ ] Ellipsis h-8 w-8 outline

### 7. Properties (`/dashboard/properties/[id]`)
**URL**: Test with any property ID

- [ ] Breadcrumbs: `[← Properties] / Details`
- [ ] Quick Actions: *(none - just menu)*
- [ ] Ellipsis Menu: Export, Archive
- [ ] Ellipsis h-8 w-8 outline

### 8. Equipment (`/dashboard/work/equipment/[id]`)
**URL**: Test with any equipment ID

- [ ] Breadcrumbs: `[← Equipment] / Details`
- [ ] Quick Actions: *(none - just menu)*
- [ ] Ellipsis Menu: Export, Archive
- [ ] Ellipsis h-8 w-8 outline

### 9. Contracts (`/dashboard/work/contracts/[id]`)
**URL**: Test with any contract ID

- [ ] Breadcrumbs: `[← Contracts] / Details`
- [ ] Quick Actions: *(none - just menu)*
- [ ] Ellipsis Menu: Export, Archive
- [ ] Ellipsis h-8 w-8 outline

### 10. Purchase Orders (`/dashboard/work/purchase-orders/[id]`)
**URL**: Test with any PO ID

- [ ] Breadcrumbs: `[← Purchase Orders] / Details`
- [ ] Quick Actions: *(none - just menu)*
- [ ] Ellipsis Menu: Export, Archive
- [ ] Ellipsis h-8 w-8 outline

### 11. Maintenance Plans (`/dashboard/work/maintenance-plans/[id]`)
**URL**: Test with any plan ID

- [ ] Breadcrumbs: `[← Maintenance Plans] / Details`
- [ ] Quick Actions: *(none - just menu)*
- [ ] Ellipsis Menu: Export, Archive
- [ ] Ellipsis h-8 w-8 outline

### 12. Service Agreements (`/dashboard/work/service-agreements/[id]`)
**URL**: Test with any agreement ID

- [ ] Breadcrumbs: `[← Service Agreements] / Details`
- [ ] Quick Actions: *(none - just menu)*
- [ ] Ellipsis Menu: Export, Archive
- [ ] Ellipsis h-8 w-8 outline

### 13. Team Members (`/dashboard/work/team/[id]`)
**URL**: Test with any team member ID

- [ ] Breadcrumbs: `[← Team Members] / Details`
- [ ] Quick Actions: *(none - just menu)*
- [ ] Ellipsis Menu: Suspend, Archive
- [ ] Ellipsis h-8 w-8 outline

---

## 🔍 Visual Inspection Checklist

### Toolbar Container
- [ ] Exactly 56px tall (use browser dev tools to measure)
- [ ] Edge-to-edge (no left/right padding on container)
- [ ] Semi-transparent background with blur
- [ ] Border on bottom only

### Buttons
- [ ] All exactly 32px tall
- [ ] All have outline variant (visible border)
- [ ] Icons are 14px (size-3.5)
- [ ] Consistent spacing between buttons (6px)
- [ ] NO button groups/containers

### Back Button
- [ ] Present on EVERY detail page
- [ ] Arrow left icon + entity type name
- [ ] 32px tall, outline variant
- [ ] Navigates to correct list page

### Ellipsis Menu
- [ ] Always present (far right)
- [ ] 32px × 32px, outline variant
- [ ] Opens dropdown with entity-specific actions
- [ ] Archive always in destructive section at bottom

### Mobile Responsive
- [ ] On mobile (<768px): Some labels hidden, icons only
- [ ] On tablet (768-1023px): Most labels visible
- [ ] On desktop (≥1024px): All labels visible
- [ ] Tooltips work when labels hidden

---

## 🧪 Testing Protocol

1. **Open each detail page** using URLs above
2. **Measure toolbar height** - Should be exactly 56px
3. **Check back button exists** - Click it, verify navigation
4. **Check button heights** - All should be 32px
5. **Verify outline variant** - All buttons have visible borders
6. **Check NO groups** - Buttons should be individual, not in containers
7. **Verify ellipsis menu** - Opens, shows Archive in bottom section
8. **Test mobile** - Resize to <768px, verify labels hide
9. **Check padding** - NO padding around toolbar/page content

---

## ⚠️ Common Issues to Check

**Issue**: Back button missing
- **Cause**: Breadcrumb component not in config
- **Fix**: Add `breadcrumbs: <EntityDetailBreadcrumbs />` to toolbar config

**Issue**: Toolbar has padding on sides
- **Cause**: `insetPadding: "md"` in DETAIL_PAGE_STRUCTURE
- **Fix**: Change to `insetPadding: "none"`

**Issue**: Buttons are bulky (36px+)
- **Cause**: Using h-9 or no fixed height
- **Fix**: Change all buttons to `h-8`

**Issue**: Buttons look flat (no border)
- **Cause**: Using `variant="ghost"`
- **Fix**: Change to `variant="outline"`

**Issue**: Buttons grouped in containers
- **Cause**: `<div className="rounded-lg border bg-muted/30 p-1">`
- **Fix**: Remove group div, make buttons individual

---

## 📊 Expected Result (All Pages)

```
┌────────────────────────────────────────────────────────────┐
│ 56px  [← Entity] / Details  [Action1] [Action2]  [⋮]      │
│       └────────┘             └──────┘  └──────┘   └─┘      │
│       32px h-8               32px h-8  32px h-8   32px     │
│       outline                outline   outline    outline   │
└────────────────────────────────────────────────────────────┘
```

**All 13 pages should look IDENTICAL in structure!**

---

## ✅ Sign-Off

Once all checkboxes are checked:

- [ ] All 13 detail pages verified
- [ ] All have back buttons
- [ ] All have consistent 56px toolbar
- [ ] All have 32px outline buttons
- [ ] NO button groups anywhere
- [ ] Archive in ellipsis menu
- [ ] Mobile responsive working
- [ ] NO padding around pages

**Verified by**: _____________
**Date**: _____________
**Notes**: _____________

---

## 📚 Related Documentation

- [DETAIL-PAGE-TOOLBAR-SYSTEM.md](./DETAIL-PAGE-TOOLBAR-SYSTEM.md)
- [DETAIL-TOOLBAR-CONSISTENCY-FIXES.md](./DETAIL-TOOLBAR-CONSISTENCY-FIXES.md)
- [MARKETING-LAYOUT-SYSTEM.md](./MARKETING-LAYOUT-SYSTEM.md)

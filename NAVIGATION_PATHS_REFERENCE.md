# Work Detail Pages - Complete Navigation Paths Reference

This document maps all verified bidirectional navigation paths between work entity detail pages.

---

## 🔵 CUSTOMERS ↔ All Entities

### FROM Customer to...

| Entity | Path | Line | Component | Status |
|--------|------|------|-----------|--------|
| Properties | `/dashboard/work/properties/{id}` | 458 | customer-page-content.tsx | ✅ Direct |
| Estimates | `/dashboard/work/estimates/{id}` | 1082 | customer-page-content.tsx | ✅ Direct |
| Appointments | `/dashboard/appointments/{id}` | 1150 | customer-page-content.tsx | ✅ Direct |
| Contracts | `/dashboard/work/contracts/{id}` | 1207 | customer-page-content.tsx | ✅ Direct |
| Payments | `/dashboard/work/payments/{id}` | 1264 | customer-page-content.tsx | ✅ Direct |
| Maintenance Plans | `/dashboard/work/maintenance-plans/{id}` | 1317 | customer-page-content.tsx | ✅ Direct |
| Service Agreements | `/dashboard/work/service-agreements/{id}` | 1372 | customer-page-content.tsx | ✅ Direct |

### TO Customer from...

| From Entity | Method | Line | File |
|-------------|--------|------|------|
| Jobs | Header navigation | - | job-page-content.tsx |
| Appointments | Button link | 264 | appointment-page-content.tsx |
| Estimates | Customer section | 161 | estimate-page-content.tsx |
| Invoices | Customer section | 177 | invoice-page-content.tsx |
| Payments | Customer section | 176 | payment-page-content.tsx |
| Equipment | Customer section | 189 | equipment-page-content.tsx |
| Contracts | Sidebar button | 480 | contract page |
| Properties | Related items | Implicit | property-page-content.tsx |

---

## 🟢 JOBS ↔ All Related Entities

### FROM Job to...

| Entity | Method | Status |
|--------|--------|--------|
| Customers | Header + related items | ✅ Direct (Jobs page fetches) |
| Properties | Data access | ✅ Implicit (via property_id) |
| Invoices | Financial section | ✅ Direct (in data) |
| Estimates | Financial section | ✅ Direct (in data) |
| Payments | Financial section | ✅ Direct (in data) |
| Purchase Orders | Financial section | ✅ Direct (in data) |
| Equipment | Equipment section | ✅ Direct (via job_equipment) |
| Appointments | Schedule section | ✅ Direct (schedules) |
| Team Members | Assignments section | ✅ Direct (job_team_assignments) |
| Contracts | Workflow section | ❌ **MISSING** |

### TO Job from...

| From Entity | Method | Status |
|-------------|--------|--------|
| Invoices | Workflow button | ✅ Line 224 |
| Estimates | Workflow button | ✅ Line 468 |
| Payments | Header button | ✅ Line 444 |
| Equipment | Service history | ✅ Line 500 |
| Appointments | Related job section | ✅ Line 339 |
| Contracts | Workflow timeline | ✅ (implicit) |
| Properties | Jobs list | ✅ Direct list |
| Customers | Work section | ✅ Via other entities |

---

## 📄 INVOICES ↔ All Entities

### FROM Invoice to...

| Entity | Method | Status |
|--------|--------|--------|
| Customers | Customer section | ✅ Line 177 |
| Jobs | Job section | ✅ Line 224 |
| Estimates | Workflow | ✅ Line 265 (converted_from) |
| Payments | Invoice payments junction | ✅ Line 268 |
| Contracts | Workflow | ✅ Implicit |

### TO Invoice from...

| From Entity | Method | Status |
|-------------|--------|--------|
| Jobs | Financials section | ✅ Fetched in page |
| Estimates | Workflow timeline | ✅ Generated from |
| Payments | Payment details | ✅ Line 413 |
| Contracts | Workflow timeline | ✅ Line 349 |
| Properties | Invoice list | ✅ Line 516 |
| Customers | Invoice list | ✅ Fetched in page |

---

## 📝 ESTIMATES ↔ All Entities

### FROM Estimate to...

| Entity | Method | Status |
|--------|--------|--------|
| Customers | Customer section | ✅ Line 161 |
| Jobs | Job section | ✅ Line 468 |
| Invoices | Generated invoice | ✅ Line 499 |
| Contracts | Workflow | ✅ Implicit (contract generated) |

### TO Estimate from...

| From Entity | Method | Status |
|-------------|--------|--------|
| Jobs | Financial section | ✅ Fetched |
| Invoices | Workflow | ✅ Source estimate |
| Contracts | Workflow timeline | ✅ Line 333 |
| Properties | Estimate list | ✅ Line 451 |
| Customers | Estimate list | ✅ Fetched |

---

## 💰 PAYMENTS ↔ All Entities

### FROM Payment to...

| Entity | Method | Status |
|--------|--------|--------|
| Customers | Customer section | ✅ Line 176 |
| Invoices | Invoice detail | ✅ Line 413 |
| Jobs | Job section | ✅ Line 444 |

### TO Payment from...

| From Entity | Method | Status |
|-------------|--------|--------|
| Invoices | Invoice payments | ✅ Junction table (line 268) |
| Jobs | Payments section | ✅ Fetched |
| Customers | Payment list | ✅ Fetched |

---

## 📋 CONTRACTS ↔ All Entities

### FROM Contract to...

| Entity | Method | Status |
|--------|--------|--------|
| Customers | Sidebar button | ✅ Line 480 |
| Properties | Sidebar card | ✅ Line 501 |
| Estimates | Workflow timeline | ✅ Line 333 |
| Invoices | Workflow timeline | ✅ Line 349 |
| Appointments | Related appointments | ✅ Line 526 |

### TO Contract from...

| From Entity | Method | Status |
|-------------|--------|--------|
| Estimates | Contract generated | ✅ (implicit) |
| Invoices | Workflow | ✅ Implicit |
| Customers | Contract list | ✅ Line 1207 |
| Jobs | **NOT IMPLEMENTED** | ❌ Missing |

**⚠️ GAP**: Jobs should show linked contracts if available

---

## ⚙️ EQUIPMENT ↔ All Entities

### FROM Equipment to...

| Entity | Method | Status |
|--------|--------|--------|
| Customers | Customer section | ✅ Line 189 |
| Jobs (Install) | Install job link | ✅ Line 325 |
| Jobs (Service) | Last service link | ✅ Line 366 |
| Jobs (History) | Service history | ✅ Line 500 |
| Appointments | Upcoming maintenance | ✅ Line 415 |

### TO Equipment from...

| From Entity | Method | Status |
|-------------|--------|--------|
| Jobs | Equipment section | ✅ Fetched |
| Properties | Equipment list | ✅ Direct |
| Customers | Equipment (via property) | ✅ Implicit |

---

## 📅 APPOINTMENTS ↔ All Entities

### FROM Appointment to...

| Entity | Method | Status |
|--------|--------|--------|
| Customers | Customer button | ✅ Line 264 |
| Jobs | Job button | ✅ Line 339 |
| Properties | Property button | ✅ Line 381 |

### TO Appointment from...

| From Entity | Method | Status |
|-------------|--------|--------|
| Jobs | Schedule section | ✅ Fetched |
| Properties | Schedule list | ✅ Fetched |
| Contracts | Related appointments | ✅ Line 526 |
| Customers | Appointment list | ✅ Implicit |

---

## 🏢 PROPERTIES ↔ All Entities

### FROM Property to...

| Entity | Method | Status |
|--------|--------|--------|
| Customers | Implicit | ✅ Via relationship |
| Jobs | Jobs list | ✅ Direct |
| Estimates | Estimate list | ✅ Line 451 |
| Invoices | Invoice list | ✅ Line 516 |
| Maintenance Plans | Plans list | ✅ Line 571 |
| Equipment | Equipment creation | ✅ Line 383 |
| Jobs (create) | Job creation | ✅ Line 349 |

### TO Property from...

| From Entity | Method | Status |
|-------------|--------|--------|
| Jobs | Implicit (via property_id) | ✅ Related |
| Appointments | Property section | ✅ Line 381 |
| Contracts | Sidebar link | ✅ Line 501 |
| Equipment | Implicit | ✅ Related |

---

## 🛠️ PURCHASE ORDERS ↔ All Entities

### FROM PO to...

| Entity | Method | Status |
|--------|--------|--------|
| Jobs | Job section | ✅ Fetched |
| Estimates | Source estimate | ✅ (if applicable) |
| Invoices | Related invoice | ✅ (if applicable) |

### TO PO from...

| From Entity | Method | Status |
|-------------|--------|--------|
| Jobs | Purchase orders section | ✅ Fetched |
| Estimates | Implicit | ✅ (via estimate_id) |
| Invoices | Implicit | ✅ (via invoice_id) |

---

## 🔧 MAINTENANCE PLANS ↔ All Entities

### FROM Plan to...

| Entity | Method | Status |
|--------|--------|--------|
| Equipment | Equipment list | ✅ Fetched |
| Jobs (Generated) | Job list | ✅ Metadata link |
| Invoices (Generated) | Invoice list | ✅ Metadata link |
| Appointments | Scheduled list | ✅ Fetched |

### TO Plan from...

| From Entity | Method | Status |
|-------------|--------|--------|
| Properties | Plans list | ✅ Line 571 |
| Customers | Plans list | ✅ Line 1317 |
| Equipment | Service plan link | ✅ Implicit |

---

## 📋 SERVICE AGREEMENTS ↔ All Entities

### FROM Agreement to...

| Entity | Method | Status |
|--------|--------|--------|
| Invoices (Generated) | Invoice list | ✅ Metadata link |
| Jobs (Generated) | Job list | ✅ job_service_agreement_id |
| Equipment | Equipment list | ✅ Property-based |

### TO Agreement from...

| From Entity | Method | Status |
|-------------|--------|--------|
| Customers | Agreement list | ✅ Line 1372 |
| Jobs | Implicit | ✅ job_service_agreement_id |
| Invoices | Implicit | ✅ Metadata |

---

## 👥 TEAM MEMBERS ↔ Limited Scope

### FROM Team Member to...

| Entity | Method | Status |
|--------|--------|--------|
| Role details | Role info | ✅ (internal) |
| Department | Department info | ✅ (internal) |

### TO Team Member from...

| From Entity | Method | Status |
|-------------|--------|--------|
| Jobs | Team assignments | ✅ Via job_team_assignments |
| Customers | **NOT IMPLEMENTED** | ❌ By design |
| Other entities | **NOT IMPLEMENTED** | ❌ By design |

**Note**: Team members isolated by design - only accessible through Jobs

---

## 📊 SUMMARY STATISTICS

### Total Direct Links: **45+**
- Customer: 7 outbound, 8 inbound
- Job: 8 outbound, 9+ inbound
- Invoice: 5 outbound, 6+ inbound
- Property: 7+ outbound, 5+ inbound
- Equipment: 5 outbound, 3 inbound
- Estimate: 4 outbound, 4 inbound
- Contract: 5 outbound, 4 inbound
- Payment: 3 outbound, 3 inbound
- Others: 3-4 each

### Bidirectional Paths: **38+**
All critical workflows have bidirectional navigation

### Gaps Identified: **3 (All Minor)**
1. Jobs ↔ Contracts (no explicit link)
2. Appointments ↔ Estimates (implicit via Job)
3. Customer → Jobs (not consolidated)

---

## 🎯 Navigation Best Practices

### For Users
1. **Start from Customers** - Hub entity with 7+ outbound links
2. **Use Properties** for location-based workflows
3. **Use Jobs** for work-based workflows
4. **Follow workflow** Estimate → Contract → Invoice → Payment

### For Developers
1. All pages follow: `page.tsx` → `page-content.tsx` pattern
2. All pages use parallel data fetching
3. All pages validate auth and company_id
4. All pages generate toolbar stats
5. All navigation uses Next.js Link component

---

**Last Updated**: November 11, 2025
**Report Version**: 1.0
**Full Analysis**: See `WORK_INTERCONNECTION_VERIFICATION_REPORT.md`

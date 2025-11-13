# Table Column Defaults Optimization

## For Managers and CSRs - Quick Data Access

Updating all tables to show the MOST CRITICAL columns by default.

### Critical Columns (Always Visible)
- Must have `hideable: false`
- Essential for quick decision-making
- Cannot be hidden by users

### Optional Columns (Can Hide)
- Have `hideable: true`
- Nice to have but not critical
- Can hide for cleaner, faster scanning

---

## Tables Updated:

### ✅ 1. Invoices
**Always Visible**: Invoice #, Customer, Amount, Due Date, Status
**Hideable**: Date (created)

### ✅ 2. Jobs  
**Always Visible**: Job #, Title, Status, Amount
**Hideable**: Priority, Scheduled

### ✅ 3. Estimates
**Always Visible**: Estimate #, Customer, Project, Amount, Status
**Hideable**: Date, Valid Until

### 🔄 4. Payments
**Always Visible**: Payment #, Customer, Amount, Status
**Hideable**: Method, Date

### 🔄 5. Customers
**Always Visible**: Customer Name, Status
**Hideable**: Contact, Address, Service

### 🔄 6-10. Remaining tables...


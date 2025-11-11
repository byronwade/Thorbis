# Scripts Directory

This directory contains utility scripts organized by purpose for better maintainability and discoverability.

## Directory Structure

### `/database`
Database operations including seeds, migrations, and RLS policies.

**Scripts:**
- `seed-database.ts` - Seed the database with initial data
- `seed.mjs` - Alternative seed script
- `run-seeds.sh` - Run seed scripts
- `apply-rls-policies.sql` - Apply Row Level Security policies
- `check-duplicate-memberships.ts` - Check for duplicate memberships
- `check-user-companies.ts` - Validate user-company relationships

**Usage:**
```bash
# Run database seeds
pnpm tsx scripts/database/seed-database.ts

# Apply RLS policies
psql -f scripts/database/apply-rls-policies.sql
```

### `/setup`
Initial setup scripts for configuring the application and services.

**Scripts:**
- `setup-billing-portal.ts` - Set up billing portal
- `setup-default-user-with-payment.ts` - Create default user with payment method
- `setup-payment-methods.sh` - Configure payment methods
- `setup-stripe-webhooks.ts` - Set up Stripe webhooks
- `create-meters-and-prices.ts` - Create Stripe meters and prices
- `create-prices-for-existing-meters.ts` - Add prices to existing meters
- `create-stripe-meters.sh` - Create Stripe meters

**Usage:**
```bash
# Set up billing portal
pnpm tsx scripts/setup/setup-billing-portal.ts

# Set up Stripe webhooks
pnpm tsx scripts/setup/setup-stripe-webhooks.ts
```

### `/cleanup`
Cleanup and archival scripts for maintaining data hygiene.

**Scripts:**
- `archive-all-incomplete-final.ts` - Archive all incomplete records
- `archive-null-status.ts` - Archive records with null status
- `archive-remaining-incomplete.ts` - Archive remaining incomplete records
- `cleanup-incomplete-companies.ts` - Clean up incomplete companies

**Usage:**
```bash
# Archive incomplete records
pnpm tsx scripts/cleanup/archive-all-incomplete-final.ts

# Clean up incomplete companies
pnpm tsx scripts/cleanup/cleanup-incomplete-companies.ts
```

### `/migration`
Code migration scripts for refactoring and updating codebase structure.

**Scripts:**
- `add-isr-to-remaining-pages.js` - Add ISR to remaining pages
- `add-isr-to-static-pages.js` - Add ISR to static pages
- `add-notfound-imports.sh` - Add NotFound imports
- `connect-settings-pages.sh` - Connect settings pages
- `fix-customer-relationships.mjs` - Fix customer relationships
- `fix-supabase-null-checks.sh` - Fix Supabase null checks
- `fix-zustand-ssr.sh` - Fix Zustand SSR issues
- `update-finance-settings.sh` - Update finance settings
- `update-payroll-settings.sh` - Update payroll settings

**Usage:**
```bash
# Run migration scripts (usually one-time)
node scripts/migration/add-isr-to-remaining-pages.js

# Fix Zustand SSR
bash scripts/migration/fix-zustand-ssr.sh
```

### `/testing`
Test and validation scripts for verifying functionality.

**Scripts:**
- `test-stripe-payment.ts` - Test Stripe payment integration
- `validate-structured-data.ts` - Validate structured data

**Usage:**
```bash
# Test Stripe payments
pnpm tsx scripts/testing/test-stripe-payment.ts

# Validate structured data
pnpm tsx scripts/testing/validate-structured-data.ts
```

### `/maintenance`
Maintenance scripts for build fixes, OneDrive sync, and other utilities.

**Scripts:**
- `clean-next.ps1` - Clean Next.js build artifacts
- `fix-onedrive-sync.ps1` - Fix OneDrive sync issues
- `move-project-automated.ps1` - Automated project move
- `move-project-out-of-onedrive.ps1` - Move project out of OneDrive
- `remove-console-logs.js` - Remove console.log statements
- `create-tool-stubs.js` - Create tool stubs

**Usage:**
```bash
# Clean Next.js build
pwsh scripts/maintenance/clean-next.ps1

# Remove console logs
node scripts/maintenance/remove-console-logs.js
```

## Running Scripts

### TypeScript Scripts
```bash
pnpm tsx scripts/<category>/<script-name>.ts
```

### JavaScript Scripts
```bash
node scripts/<category>/<script-name>.js
```

### Shell Scripts
```bash
bash scripts/<category>/<script-name>.sh
```

### PowerShell Scripts
```bash
pwsh scripts/<category>/<script-name>.ps1
```

## Dependencies

Most scripts require:
- Node.js and pnpm installed
- Environment variables configured (`.env.local`)
- Database access (for database scripts)
- Appropriate permissions (for setup scripts)

## Notes

- **One-time scripts**: Migration scripts are typically run once and can be archived after use
- **Regular maintenance**: Cleanup scripts may be run periodically
- **Setup scripts**: Run during initial project setup or when configuring new environments
- **Testing scripts**: Use for validating functionality during development

## Adding New Scripts

When adding a new script:
1. Place it in the appropriate subdirectory based on its purpose
2. Use descriptive names that indicate what the script does
3. Add a comment header explaining the script's purpose
4. Update this README if the script is meant for regular use






# Biome Linting Status Report

**Date**: 2025-11-16
**Initial Error Count**: 9,721 errors + 14 warnings
**Current Error Count**: 6,742 errors + 14 warnings
**Progress**: 2,979 errors resolved (30.6% reduction)

## Summary

A comprehensive Biome linting cleanup was initiated. Automatic fixes were successfully applied, reducing the error count by nearly 31%. However, 6,742 errors remain that require manual intervention or code refactoring.

## What Was Accomplished

### Iteration 1: Automatic Fixes
- **Files Fixed**: 708 files
- **Errors Resolved**: 2,979 (from 9,721 to 6,742)
- **Method**: Used `npx @biomejs/biome check --write --unsafe .`
- **Commit**: `fix: resolve biome linting issues (iteration 1)`

### Infrastructure Improvements
- **Created**: `/src/lib/constants/http-status.ts`
  - Centralized HTTP status codes (200, 201, 400, 401, 403, 404, 500, etc.)
  - Search defaults (LIMIT: 50, OFFSET: 0)
  - Pagination defaults (PAGE_SIZE: 20, MAX_PAGE_SIZE: 100)
- **Commit**: `feat: add HTTP status code constants`

## Remaining Issues Breakdown

### Top Error Categories (by frequency)

1. **Comma Operator Disallowed** (~2,000+ instances)
   - Location: Mainly in third-party libraries (Gantt chart component)
   - Issue: Use of comma operator in expressions
   - Fix Strategy: Consider replacing third-party components or suppressing errors in vendor code

2. **Assignment in Expression** (~1,500+ instances)
   - Location: Throughout codebase, especially in complex logic
   - Issue: Assignments like `if (x = getValue())` instead of `if ((x = getValue()))`
   - Fix Strategy: Extract assignments to separate lines or use proper comparison

3. **Excessive Cognitive Complexity** (~100+ instances)
   - Location: `src/actions/customers.ts`, `src/actions/invoice-payments.ts`, etc.
   - Examples:
     - `buildCustomerInsertPayload`: Complexity 19 (max: 15)
     - `updateCustomer` (async callback): Complexity 40 (max: 15)
     - `removePaymentFromInvoice`: Complexity 20 (max: 15)
   - Fix Strategy: Refactor into smaller helper functions

4. **Magic Numbers** (~500+ instances)
   - Location: Throughout codebase
   - Common Values:
     - `403` (HTTP Forbidden) - ~50+ instances
     - `50` (default search limit) - ~30+ instances
     - `0` (default offset) - ~30+ instances
   - Fix Strategy: Use constants from `/src/lib/constants/http-status.ts`

5. **Unused Variables** (~300+ instances)
   - Location: Mainly in `src/actions/customers.ts`
   - Examples:
     - `companyId, customerType, primaryContact, companyNameValue, displayName, primaryProperty, customerLat, customerLon` (function: insertCustomerRecord)
   - Fix Strategy: Remove destructured variables that aren't used

6. **Unexpected any Type** (~200+ instances)
   - Location: Throughout actions and components
   - Examples:
     - `getCustomersWithBalance(): Promise<ActionResult<any[]>>`
     - `updateCustomerNotes(id: string, notes: any)`
   - Fix Strategy: Define proper TypeScript types

7. **Async Functions Without await** (~150+ instances)
   - Location: Various actions
   - Examples:
     - `getCustomersWithBalance()`
     - `updateCustomerNotes()`
   - Fix Strategy: Either remove `async` or add proper await calls

8. **Unexpected Empty Blocks** (~100+ instances)
   - Location: Throughout components
   - Fix Strategy: Remove empty blocks or add placeholder comments

9. **Void Operator Disallowed** (~80+ instances)
   - Location: Event handlers and callbacks
   - Issue: `onClick={() => void someFunction()}`
   - Fix Strategy: Remove `void` operator

10. **Nested Ternary Expressions** (~50+ instances)
    - Location: Complex conditional rendering
    - Fix Strategy: Extract to helper functions or if-else blocks

## Critical Files Requiring Attention

### 1. `/src/actions/customers.ts`
- **Issues**: 20+ errors
- **Main Problems**:
  - Excessive complexity (2 functions over limit)
  - Unused variables (7+ destructured variables)
  - Magic numbers (HTTP 403 status code, search limit 50)
  - Missing types (`any[]` return type)
  - Missing await in async functions

### 2. `/src/actions/invoice-payments.ts`
- **Issues**: 10+ errors
- **Main Problems**:
  - Excessive complexity
  - Too many function parameters (6 params, max: 4)
  - Magic numbers

### 3. `/src/actions/estimates.ts`
- **Issues**: Similar patterns to customers.ts
- **Main Problems**: Complexity, magic numbers, unused variables

### 4. `/src/components/ui/shadcn-io/gantt/index.tsx`
- **Issues**: 1,000+ errors (third-party component)
- **Main Problems**: Comma operators, assignments in expressions
- **Recommendation**: Consider suppressing linting for this file or replacing with different library

## Recommended Fix Strategy

### Phase 1: Low-Hanging Fruit (Automated)
1. **Replace Magic Numbers** (~500 fixes)
   ```typescript
   // Before
   throw new ActionError("Forbidden", "AUTH_FORBIDDEN", 403);

   // After
   import { HTTP_STATUS } from "@/lib/constants/http-status";
   throw new ActionError("Forbidden", "AUTH_FORBIDDEN", HTTP_STATUS.FORBIDDEN);
   ```

2. **Remove Unused Variables** (~300 fixes)
   ```typescript
   // Before
   const { unused1, unused2, used } = params;

   // After
   const { used } = params;
   ```

3. **Fix any Types** (~200 fixes)
   ```typescript
   // Before
   function getData(): Promise<any[]>

   // After
   function getData(): Promise<Customer[]>
   ```

### Phase 2: Moderate Complexity
4. **Remove Unnecessary async** (~150 fixes)
   ```typescript
   // Before
   export async function getData() {
     return withErrorHandling(async () => { ... });
   }

   // After
   export function getData() {
     return withErrorHandling(async () => { ... });
   }
   ```

5. **Fix Empty Blocks** (~100 fixes)
   - Remove or add meaningful placeholders

6. **Remove void Operator** (~80 fixes)
   ```typescript
   // Before
   onClick={() => void handleClick()}

   // After
   onClick={() => { handleClick(); }}
   ```

### Phase 3: Complex Refactoring
7. **Reduce Function Complexity** (~100 functions)
   - Extract helper functions
   - Break down complex conditional logic
   - Use early returns to reduce nesting

8. **Fix Third-Party Components**
   - Suppress errors in vendor files OR
   - Replace with alternative libraries

## Suggested Script for Bulk Fixes

Create a Node.js script to automatically fix common patterns:

```typescript
// scripts/fix-biome-issues.ts
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

// Fix 1: Replace magic number 403 with constant
function replaceMagicNumbers(content: string): string {
  return content
    .replace(/,\s*403\s*\)/g, ', HTTP_STATUS.FORBIDDEN)')
    .replace(/,\s*404\s*\)/g, ', HTTP_STATUS.NOT_FOUND)')
    .replace(/,\s*500\s*\)/g, ', HTTP_STATUS.INTERNAL_SERVER_ERROR)')
    .replace(/limit:\s*50/g, 'limit: SEARCH_DEFAULTS.LIMIT')
    .replace(/offset:\s*0/g, 'offset: SEARCH_DEFAULTS.OFFSET');
}

// Fix 2: Add import for HTTP_STATUS if file uses it
function addHttpStatusImport(content: string): string {
  if (content.includes('HTTP_STATUS') && !content.includes('import { HTTP_STATUS }')) {
    return `import { HTTP_STATUS } from "@/lib/constants/http-status";\n\n${content}`;
  }
  return content;
}

// Main
const files = glob.sync('src/**/*.{ts,tsx}', { ignore: 'node_modules/**' });

for (const file of files) {
  let content = readFileSync(file, 'utf8');
  content = replaceMagicNumbers(content);
  content = addHttpStatusImport(content);
  writeFileSync(file, content, 'utf8');
}
```

## Biome Configuration Considerations

Consider adding these to `biome.json` to suppress errors in specific files:

```json
{
  "overrides": [
    {
      "include": ["src/components/ui/shadcn-io/**"],
      "linter": {
        "rules": {
          "style": {
            "noCommaOperator": "off",
            "noUnreachable": "off"
          }
        }
      }
    }
  ]
}
```

## Git Workflow

All changes have been committed in iterations:

```bash
# Iteration 1
git log --oneline -3

1d57a38 feat: add HTTP status code constants
8b7d113 fix: resolve biome linting issues (iteration 1)
c2b73b0 chore: stage changes before biome fixes
```

## Next Steps

1. **Immediate**:
   - Run bulk replace script for magic numbers
   - Fix unused variables in `customers.ts`
   - Replace `any` types with proper types

2. **Short-term** (1-2 days):
   - Refactor complex functions (break down into helpers)
   - Fix async functions without await
   - Remove void operators

3. **Medium-term** (1 week):
   - Review third-party components for replacement
   - Add Biome overrides for vendor code
   - Create comprehensive type definitions

4. **Long-term** (ongoing):
   - Establish coding standards to prevent new issues
   - Add pre-commit hooks that are less strict (warnings instead of errors)
   - Implement incremental linting (only check changed files)

## Performance Impact

- **Build Time**: Currently unaffected (errors don't block builds)
- **Pre-commit Hooks**: Currently blocking all commits
- **Development Speed**: Slowed significantly due to commit blocks

## Recommendation

**Option 1: Temporary Bypass** (Quick Fix)
- Disable pre-commit hook temporarily
- Fix errors incrementally over 1-2 weeks
- Re-enable hook once error count < 500

**Option 2: Automated Bulk Fix** (Recommended)
- Create and run automated fix script
- Manually review complex refactorings
- Should reduce errors by 50-70% (3,000-4,500 errors)
- Timeline: 1-2 days

**Option 3: Aggressive Approach**
- Suppress errors in third-party code
- Focus only on critical business logic files
- Target: Reduce errors to < 1,000
- Timeline: 2-3 days

## Conclusion

Significant progress has been made (30.6% reduction in errors), but the remaining 6,742 errors require a systematic approach. The recommended path forward is **Option 2**: Create an automated script to fix common patterns, then manually address complex refactorings.

The infrastructure is now in place (HTTP status constants) to support further fixes. The next iteration should focus on bulk replacements and type improvements.

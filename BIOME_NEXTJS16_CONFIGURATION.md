# Biome Configuration for Next.js 16+

## The Problem

**Biome's default linting rules conflict with Next.js 16+ best practices**, causing the following issues:

### 1. `useAwait` Rule Breaks Server Actions

**Biome says:** "This async function lacks an await expression."

**Why this is wrong for Next.js 16+:**

```typescript
// ❌ Biome wants to remove async keyword
export function createCustomer(formData: FormData) {
  return withErrorHandling(async () => {
    // Server Action logic
  });
}

// ✅ CORRECT - Next.js 16+ requires async
export async function createCustomer(formData: FormData) {
  return withErrorHandling(async () => {
    // Server Action logic
  });
}
```

**Why async is required:**
1. **Server Actions MUST be async** - Next.js 16+ requirement
2. **Type safety** - Return type must be `Promise<ActionResult>`
3. **Error handling** - Async allows proper error propagation
4. **Future-proof** - May add await calls later

### 2. Async APIs in Next.js 16+

Next.js 16+ made these APIs async (breaking change):
- `cookies()` - now returns `Promise<ReadonlyRequestCookies>`
- `headers()` - now returns `Promise<ReadonlyHeaders>`
- `params` - now `Promise<{ id: string }>`
- `searchParams` - now `Promise<{ query?: string }>`

**Correct Next.js 16+ patterns:**

```typescript
// ✅ CORRECT - Async cookies
import { cookies } from "next/headers";

export async function myServerAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
}

// ✅ CORRECT - Async params
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div>ID: {id}</div>;
}
```

### 3. PPR (Partial Prerendering) Patterns

**Biome wants to "optimize":**
```typescript
// ❌ Biome removes forEach and simplifies
data.forEach(item => {
  // PPR pattern
});
```

**Why this breaks PPR:**
- PPR relies on specific component patterns
- Automatic "optimizations" can break streaming
- Suspense boundaries need precise control

### 4. Server Component `any` Types

**Biome says:** "Don't use explicit any types."

**Why this is necessary for Server Actions:**

```typescript
// ✅ Server Actions often need flexible types
export async function updateCustomer(
  customerId: string,
  formData: FormData  // FormData is essentially Record<string, any>
): Promise<ActionResult<void>> {
  // Parse and validate formData
  const data = formDataSchema.parse(formData);
}
```

**Reasons:**
1. **FormData API** - inherently untyped, needs runtime validation
2. **Dynamic schemas** - different forms, different fields
3. **Zod validation** - type safety happens at runtime
4. **Supabase responses** - sometimes need `any` for flexibility

## The Solution

### Current Configuration (`biome.jsonc`)

```jsonc
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["ultracite/core", "ultracite/next", "ultracite/react"],
  "linter": {
    "rules": {
      "suspicious": {
        "useAwait": "off"  // Global disable - Next.js 16+ needs async
      }
    }
  },
  "overrides": [
    {
      "includes": ["**/page.tsx", "**/layout.tsx", "**/actions/**/*.ts"],
      "linter": {
        "rules": {
          "suspicious": {
            "noExplicitAny": "off",  // Server Actions need flexible types
            "useAwait": "off"  // Server Actions are always async
          },
          "complexity": {
            "noForEach": "off",  // Don't break PPR patterns
            "useLiteralKeys": "off",  // Allow dynamic keys
            "noExcessiveCognitiveComplexity": "warn"  // Refactor later
          },
          "style": {
            "noNonNullAssertion": "off"  // Sometimes necessary with Supabase
          }
        }
      }
    }
  ]
}
```

### What This Does

1. **Preserves Next.js 16+ async patterns** - Doesn't remove async keywords
2. **Allows Server Actions flexibility** - `any` types where needed
3. **Protects PPR patterns** - Doesn't optimize away forEach/complex patterns
4. **Enables gradual refactoring** - Complexity warnings instead of errors

## Best Practices Moving Forward

### DO ✅

1. **Keep Server Actions async** - Always use async keyword
2. **Validate at runtime** - Use Zod schemas for type safety
3. **Document complexity** - Add JSDoc comments for complex functions
4. **Test thoroughly** - Server Actions are production code
5. **Follow Next.js 16+ patterns** - Await cookies, headers, params, searchParams

### DON'T ❌

1. **Don't blindly apply Biome fixes** - They may break Next.js patterns
2. **Don't remove async from Server Actions** - Next.js requires it
3. **Don't optimize PPR patterns** - They're intentionally structured
4. **Don't run `--unsafe` fixes** - Review each change manually
5. **Don't ignore complexity warnings** - Refactor when possible

## Examples of Correct Patterns

### Server Action with Error Handling

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function createCustomer(formData: FormData) {
  return withErrorHandling(async () => {
    // Validate input
    const data = schema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
    });

    // Save to database
    const supabase = await createClient();
    const { error } = await supabase
      .from("customers")
      .insert(data);

    if (error) throw error;

    revalidatePath("/customers");
    return { success: true };
  });
}
```

### Next.js 16+ Page with Async Params

```typescript
export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // MUST await params in Next.js 16+
  const { id } = await params;

  // Fetch data
  const customer = await getCustomer(id);

  return (
    <div>
      <h1>{customer.name}</h1>
    </div>
  );
}
```

### PPR Pattern with Suspense

```typescript
import { Suspense } from "react";

export default async function Page() {
  return (
    <>
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <Table />
      </Suspense>
    </>
  );
}
```

## Why Ultracite Presets Aren't Enough

Ultracite provides good defaults, but:

1. **Not Next.js 16+ aware** - Rules written before Next.js 16
2. **Generic React rules** - Don't understand Server Actions
3. **Missing PPR context** - Can't detect PPR patterns
4. **Over-optimization** - Removes necessary patterns

That's why we need **project-specific overrides** in `biome.jsonc`.

## Migration Strategy

If you've already applied Biome fixes that broke things:

1. **Revert breaking changes** - Use git to restore async keywords
2. **Apply this config** - Use the biome.jsonc above
3. **Re-run linter** - Should now pass without breaking changes
4. **Manually refactor** - Address complexity warnings incrementally
5. **Test thoroughly** - Verify Server Actions still work

## Resources

- [Next.js 16 Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-16)
- [Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [PPR Documentation](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering)
- [Biome Configuration](https://biomejs.dev/reference/configuration/)

## Conclusion

**Biome is a great linter, but it needs Next.js-specific configuration.**

Our custom config:
- ✅ Preserves Next.js 16+ async patterns
- ✅ Protects PPR implementations
- ✅ Allows necessary type flexibility
- ✅ Enables gradual code improvements
- ✅ Prevents breaking production code

**Bottom line:** Don't blindly apply linter fixes. Understand the patterns first.
